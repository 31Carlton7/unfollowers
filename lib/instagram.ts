/**
 * Parsing and diff logic for Instagram "followers and following" data exports.
 *
 * Meta lets users download their data in two formats — JSON and HTML — and both
 * are supported here, whether the user uploads the whole ZIP or the individual
 * followers/following files.
 */
import AdmZip from 'adm-zip';

interface FollowRecord {
  username: string;
  /** Unix timestamp (seconds) of when the follow happened, when the export includes it. */
  timestamp: number | null;
}

export interface UnfollowerEntry {
  username: string;
  followedAtTimestamp: number | null;
}

export interface ProcessResult {
  unfollowers: UnfollowerEntry[];
  stats: {
    followersCount: number;
    followingCount: number;
    unfollowersCount: number;
  };
}

/** Matches followers_1.json / followers.html etc. inside the export ZIP. */
const FOLLOWERS_PATTERN = /followers_and_following\/followers(?:_\d+)?\.(?:json|html)$/i;
/** Matches following.json / following.html (occasionally split like following_1.json). */
const FOLLOWING_PATTERN = /followers_and_following\/following(?:_\d+)?\.(?:json|html)$/i;

function normalizePath(p: string): string {
  return p.replace(/\\/g, '/');
}

function normalizeUsername(u: string): string {
  return u.trim().toLowerCase();
}

function recordFromJsonItem(item: unknown): FollowRecord | null {
  if (!item || typeof item !== 'object') return null;
  const obj = item as Record<string, unknown>;
  const stringListData = obj.string_list_data as Array<{ value?: string; timestamp?: number }> | undefined;
  const first = Array.isArray(stringListData) ? stringListData[0] : undefined;
  const raw = first?.value ?? (typeof obj.title === 'string' ? obj.title : '');
  const username = typeof raw === 'string' ? normalizeUsername(raw) : '';
  if (!username) return null;
  const timestamp = typeof first?.timestamp === 'number' ? first.timestamp : null;
  return { username, timestamp };
}

/**
 * Parse a Meta JSON export file. Followers files are a plain array; following
 * (and some older exports) wrap the array in an object like
 * `{ "relationships_following": [...] }`.
 */
function parseJsonRecords(text: string): FollowRecord[] {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return [];
  }

  const records: FollowRecord[] = [];
  const collect = (arr: unknown): void => {
    if (!Array.isArray(arr)) return;
    for (const item of arr) {
      const record = recordFromJsonItem(item);
      if (record) records.push(record);
    }
  };

  if (Array.isArray(data)) {
    collect(data);
  } else if (data && typeof data === 'object') {
    for (const value of Object.values(data as Record<string, unknown>)) {
      collect(value);
    }
  }
  return records;
}

/**
 * Parse a Meta HTML export file. Each account is an anchor like
 * `<a href="https://www.instagram.com/username">username</a>`, usually followed
 * by a `<div>Aug 12, 2023, 10:05 PM</div>` with the follow date.
 */
function parseHtmlRecords(html: string): FollowRecord[] {
  const records: FollowRecord[] = [];
  const anchorRe = /<a[^>]+href="https?:\/\/(?:www\.)?instagram\.com\/([^"?#]+?)\/?"[^>]*>([^<]*)<\/a>/gi;

  let match: RegExpExecArray | null;
  while ((match = anchorRe.exec(html)) !== null) {
    const [, hrefPath, anchorText] = match;
    const username = normalizeUsername(anchorText || decodeURIComponent(hrefPath));
    if (!username) continue;

    // Look just past the anchor for the follow-date div Meta places next to it.
    const tail = html.slice(anchorRe.lastIndex, anchorRe.lastIndex + 300);
    const dateMatch = /<div[^>]*>\s*([A-Z][a-z]{2} \d{1,2}, \d{4}[^<]*?)\s*</.exec(tail);
    let timestamp: number | null = null;
    if (dateMatch) {
      const parsed = Date.parse(dateMatch[1].replace(/,/g, ''));
      if (!Number.isNaN(parsed)) timestamp = Math.floor(parsed / 1000);
    }
    records.push({ username, timestamp });
  }
  return records;
}

function parseRecords(fileName: string, text: string): FollowRecord[] {
  if (/\.json$/i.test(fileName)) return parseJsonRecords(text);
  if (/\.html?$/i.test(fileName)) return parseHtmlRecords(text);
  // No useful extension (e.g. pasted content) — sniff the content.
  return text.trimStart().startsWith('<') ? parseHtmlRecords(text) : parseJsonRecords(text);
}

export interface NamedFile {
  name: string;
  text: string;
}

export function sourcesFromZip(zipBuffer: Buffer): { followers: NamedFile[]; following: NamedFile[] } {
  const zip = new AdmZip(zipBuffer);
  const followers: NamedFile[] = [];
  const following: NamedFile[] = [];

  for (const entry of zip.getEntries()) {
    if (entry.isDirectory) continue;
    const path = normalizePath(entry.entryName);
    if (FOLLOWERS_PATTERN.test(path)) {
      followers.push({ name: path, text: entry.getData().toString('utf8') });
    } else if (FOLLOWING_PATTERN.test(path)) {
      following.push({ name: path, text: entry.getData().toString('utf8') });
    }
  }
  return { followers, following };
}

/** Classify loose (non-ZIP) uploads by filename: "following.html" vs "followers_1.json". */
export function classifyLooseFiles(files: NamedFile[]): { followers: NamedFile[]; following: NamedFile[] } {
  const followers: NamedFile[] = [];
  const following: NamedFile[] = [];
  for (const file of files) {
    const base = normalizePath(file.name).split('/').pop() ?? file.name;
    if (/following/i.test(base)) following.push(file);
    else if (/follower/i.test(base)) followers.push(file);
  }
  return { followers, following };
}

/**
 * Compute the strict diff: accounts you follow that do not appear in your
 * followers list. Sorted by most recent follow first (unknown dates last).
 */
export function computeUnfollowers(
  followerFiles: NamedFile[],
  followingFiles: NamedFile[],
): ProcessResult {
  const followerSet = new Set<string>();
  for (const file of followerFiles) {
    for (const record of parseRecords(file.name, file.text)) {
      followerSet.add(record.username);
    }
  }

  const followingMap = new Map<string, FollowRecord>();
  for (const file of followingFiles) {
    for (const record of parseRecords(file.name, file.text)) {
      if (!followingMap.has(record.username)) followingMap.set(record.username, record);
    }
  }

  if (followerSet.size === 0) {
    throw new Error('No followers could be read from your upload — make sure it includes your followers file.');
  }
  if (followingMap.size === 0) {
    throw new Error('No following list could be read from your upload — make sure it includes your following file.');
  }

  const unfollowers: UnfollowerEntry[] = [];
  for (const record of followingMap.values()) {
    if (!followerSet.has(record.username)) {
      unfollowers.push({ username: record.username, followedAtTimestamp: record.timestamp });
    }
  }

  unfollowers.sort((a, b) => {
    if (a.followedAtTimestamp !== null && b.followedAtTimestamp !== null) {
      return b.followedAtTimestamp - a.followedAtTimestamp;
    }
    if (a.followedAtTimestamp !== null) return -1;
    if (b.followedAtTimestamp !== null) return 1;
    return a.username.localeCompare(b.username, undefined, { sensitivity: 'base' });
  });

  return {
    unfollowers,
    stats: {
      followersCount: followerSet.size,
      followingCount: followingMap.size,
      unfollowersCount: unfollowers.length,
    },
  };
}
