import posthog from 'posthog-js';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import AdmZip from 'adm-zip';

/** Patterns for locating Meta export files inside the zip. */
const FOLLOWERS_PATTERN = /followers_and_following\/followers(?:_\d+)?\.json$/i;
const FOLLOWING_PATTERN = /followers_and_following\/following(?:_\d+)?\.json$/i;
const CLOSE_FRIENDS_PATTERN = /followers_and_following\/close_friends\.json$/i;
const PENDING_REQUESTS_PATTERN = /followers_and_following\/recent_follow_requests\.json$/i;
const STORY_INTERACTIONS_PATTERN = /story_activities.*\.json$/i;
const LIKES_PATTERN = /likes\/liked_posts\.json$/i;
const COMMENTS_PATTERN = /comments.*post_comments.*\.json$/i;

function normalizePath(p: string): string {
  return p.replace(/\\/g, '/');
}

/** Extract username from a Meta export record (works for both followers and following formats). */
function extractUsername(item: Record<string, unknown>): string {
  const val =
    (item?.string_list_data as Array<{ value?: string }>)?.[0]?.value ??
    (typeof item?.title === 'string' && item.title !== '' ? item.title : '') ??
    '';
  return typeof val === 'string' ? val.trim().toLowerCase() : '';
}

/** Extract usernames from a standard Meta relationship wrapper: { "relationships_*": [...] } or a plain array. */
function extractUsernamesFromData(data: unknown): string[] {
  const usernames: string[] = [];
  if (Array.isArray(data)) {
    for (const item of data) {
      const u = extractUsername(item as Record<string, unknown>);
      if (u) usernames.push(u);
    }
  } else if (data && typeof data === 'object') {
    for (const key of Object.keys(data as Record<string, unknown>)) {
      const arr = (data as Record<string, unknown>)[key];
      if (Array.isArray(arr)) {
        for (const item of arr) {
          const u = extractUsername(item as Record<string, unknown>);
          if (u) usernames.push(u);
        }
      }
    }
  }
  return usernames;
}

/** Extract usernames from all zip entries matching a pattern. */
function extractFromEntries(entries: AdmZip.IZipEntry[], pattern: RegExp): string[] {
  const matched = entries.filter(
    (e) => !e.isDirectory && pattern.test(normalizePath(e.entryName)),
  );
  const usernames: string[] = [];
  for (const entry of matched) {
    try {
      const data = JSON.parse(entry.getData().toString('utf8'));
      usernames.push(...extractUsernamesFromData(data));
    } catch {
      // skip malformed files
    }
  }
  return usernames;
}

export interface UnfollowerEntry {
  username: string;
  followedAtTimestamp: number | null;
}

export interface ProcessResult {
  unfollowers: UnfollowerEntry[];
  stats: {
    baseFollowers: number;
    closeFriends: number;
    interactionSignals: number;
    pendingRequests: number;
    totalAugmentedFollowers: number;
    followingCount: number;
    unfollowersCount: number;
  };
}

function processZip(zipBuffer: Buffer): ProcessResult {
  const zip = new AdmZip(zipBuffer);
  const entries = zip.getEntries();

  // --- Core lists ---
  const followersEntries = entries.filter(
    (e) => !e.isDirectory && FOLLOWERS_PATTERN.test(normalizePath(e.entryName)),
  );
  const followingEntries = entries.filter(
    (e) => !e.isDirectory && FOLLOWING_PATTERN.test(normalizePath(e.entryName)),
  );

  if (followersEntries.length === 0 || followingEntries.length === 0) {
    throw new Error('The required files were not found in the zip file.');
  }

  // Base followers from followers_*.json
  const baseFollowers = extractFromEntries(followersEntries, /.*/);

  // Following list with timestamps
  const followingWithTimestamps: { username: string; timestamp: number | null }[] = [];
  for (const entry of followingEntries) {
    const data = JSON.parse(entry.getData().toString('utf8')) as Record<string, unknown>;
    for (const key of Object.keys(data)) {
      const arr = data[key];
      if (!Array.isArray(arr)) continue;
      for (const item of arr) {
        const obj = item as Record<string, unknown>;
        const username = extractUsername(obj);
        const ts = (obj?.string_list_data as Array<{ timestamp?: number }>)?.[0]?.timestamp ?? null;
        if (username) followingWithTimestamps.push({ username, timestamp: ts });
      }
    }
  }

  // --- Augmented followers (Phase 1): close friends ---
  const closeFriends = extractFromEntries(entries, CLOSE_FRIENDS_PATTERN);

  // --- Augmented followers (Phase 2): interaction signals ---
  const storyUsers = extractFromEntries(entries, STORY_INTERACTIONS_PATTERN);
  const likeUsers = extractFromEntries(entries, LIKES_PATTERN);
  const commentUsers = extractFromEntries(entries, COMMENTS_PATTERN);
  const interactionSignals = Array.from(new Set([...storyUsers, ...likeUsers, ...commentUsers]));

  // --- Pending requests to exclude ---
  const pendingRequests = extractFromEntries(entries, PENDING_REQUESTS_PATTERN);
  const pendingSet = new Set(pendingRequests);

  // --- Build augmented follower set ---
  const augmentedFollowersSet = new Set([
    ...baseFollowers,
    ...closeFriends,
    ...interactionSignals,
  ]);

  // --- Compute unfollowers: following - augmented followers - pending ---
  const unfollowers: UnfollowerEntry[] = followingWithTimestamps
    .filter((f) => !augmentedFollowersSet.has(f.username) && !pendingSet.has(f.username))
    .map((f) => ({ username: f.username, followedAtTimestamp: f.timestamp }))
    .sort((a, b) => a.username.localeCompare(b.username, undefined, { sensitivity: 'base' }));

  return {
    unfollowers,
    stats: {
      baseFollowers: baseFollowers.length,
      closeFriends: closeFriends.length,
      interactionSignals: interactionSignals.length,
      pendingRequests: pendingRequests.length,
      totalAugmentedFollowers: augmentedFollowersSet.size,
      followingCount: followingWithTimestamps.length,
      unfollowersCount: unfollowers.length,
    },
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No zip file uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const result = processZip(buffer);

    posthog.capture('$successfulZipUpload', { property: 'Successfully' });
    posthog.capture('$numberOfUnfollowers', { property: result.stats.unfollowersCount });

    return NextResponse.json(result);
  } catch (e) {
    posthog.capture('$successfulZipUpload', { property: `With Error: ${(e as Error).message}` });
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
