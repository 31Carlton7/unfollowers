/**
 * This file handles the API endpoint for calling a Python script.
 */
import posthog from 'posthog-js';
import { NextRequest, NextResponse } from 'next/server';
import AdmZip from 'adm-zip';

/**
 * Handles a POST request to the API endpoint for calling a Python script.
 *
 * @param {NextRequest} request - The Next.js request object containing the form data.
 * @return {Promise<NextResponse>} A promise that resolves to a Next.js response object.
 * If a zip file is not uploaded, the response will have a status of 400 and an error message.
 * If there is an error processing the zip file, the response will have a status of 500 and an error message.
 * If there is an internal server error, the response will have a status of 500 and an error message.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No zip file uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const unfollowers = getUnfollowers(buffer);

    // Capture successful upload in PostHog
    posthog.capture('Zip File Uploaded', { property: 'Successfully' });
    posthog.capture('Number of Instagrm Unfollowers', { property: unfollowers.length });

    return new NextResponse(JSON.stringify(unfollowers));
  } catch (e) {
    // Capture failed upload in PostHog
    posthog.capture('Zip File Uploaded', { property: `With Error: ${(e as Error).message}` });

    return new NextResponse(JSON.stringify({ error: (e as Error).message }), { status: 500 });
  }
}

/**
 * Extracts the contents of a zip file from the local file system and navigates to the target files.
 * @param zipPath The path to the zip file.
 * @returns A list containing the paths to the followers and following files.
 * @throws Error If the required files were not found in the extracted directory.
 */
function extractAndNavigate(zipBuffer: Buffer): { followers: any; following: any } {
  const zip = new AdmZip(zipBuffer);

  const followersEntry = zip.getEntry('connections/followers_and_following/followers_1.json');
  const followingEntry = zip.getEntry('connections/followers_and_following/following.json');

  if (!followersEntry || !followingEntry) {
    throw new Error('The required files were not found in the zip file.');
  }

  const followers = JSON.parse(followersEntry.getData().toString('utf8'));
  const following = JSON.parse(followingEntry.getData().toString('utf8'));

  return { followers, following };
}

/**
 * Reads a JSON file containing a list of followers and returns a list of strings representing the values
 * of the "value" key in each object.
 * @param followers The path to the JSON file containing the followers data.
 * @returns A list of strings representing the values of the "value" key in each object.
 */
function getFollowers(followers: any): string[] {
  return followers.map((follower: any) => follower.string_list_data[0].value);
}

/**
 * Reads a JSON file containing a list of followings and returns a list of strings representing the values
 * of the "value" key in each object.
 * @param following The path to the JSON file containing the followings data.
 * @returns A list of strings representing the values of the "value" key in each object.
 */
function getFollowing(following: any): string[] {
  return following.relationships_following.map((followingData: any) => followingData.string_list_data[0].value);
}

/**
 * Given two lists of usernames, `followers` and `following`, this function returns a sorted list of usernames who are in the `following` list but not in the `followers` list.
 * @param followers A list of usernames who are followers.
 * @param following A list of usernames who are being followed.
 * @returns A sorted list of usernames who are in the `following` list but not in the `followers` list.
 */
function notFollowingBack(followers: string[], following: string[]): string[] {
  const followersSet = new Set(followers);
  const notFollowingBack = [...following].filter((x) => !followersSet.has(x));
  return notFollowingBack.sort();
}

/**
 * Extracts a zip file, retrieves followers and following data, and returns a list of users who do not follow back.
 * @param zip The path to the zip file containing the followers and following data.
 * @returns A sorted list of strings representing the users who do not follow back.
 */
function processZipAndReturnNotFollowingBack(zipBuffer: Buffer): string[] {
  const { followers, following } = extractAndNavigate(zipBuffer);
  const followersList = getFollowers(followers);
  const followingList = getFollowing(following);
  return notFollowingBack(followersList, followingList);
}

/**
 * Extracts a zip file, retrieves followers and following data, and returns a list of users who do not follow back.
 * @param zipPath The path to the zip file containing the followers and following data.
 * @returns A sorted list of strings representing the users who do not follow back.
 */
function getUnfollowers(zipBuffer: Buffer): string[] {
  return processZipAndReturnNotFollowingBack(zipBuffer);
}
