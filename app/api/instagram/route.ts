/**
 * This file handles the API endpoint for calling a Python script.
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import os from 'os';
import * as fs from 'fs';
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
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No zip file uploaded' }, { status: 400 });
    }

    // Create a temporary file
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, file.name);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write the file to the temporary directory
    await writeFile(tempFilePath, buffer);

    const result = getUnfollowers(tempFilePath);

    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Extracts the contents of a zip file from the local file system and navigates to the target files.
 * @param zipPath The path to the zip file.
 * @returns A list containing the paths to the followers and following files.
 * @throws Error If the required files were not found in the extracted directory.
 */
function extractAndNavigate(zipPath: string): string[] {
  const zip = new AdmZip(zipPath);
  const extractDir = path.parse(zipPath).name;
  zip.extractAllTo(extractDir, true);

  const followersFile = path.join(extractDir, 'connections', 'followers_and_following', 'followers_1.json');
  const followingFile = path.join(extractDir, 'connections', 'followers_and_following', 'following.json');

  if (!fs.existsSync(followersFile) || !fs.existsSync(followingFile)) {
    throw new Error('The required files were not found in the extracted directory.');
  }

  return [followersFile, followingFile];
}

/**
 * Reads a JSON file containing a list of followers and returns a list of strings representing the values
 * of the "value" key in each object.
 * @param followers The path to the JSON file containing the followers data.
 * @returns A list of strings representing the values of the "value" key in each object.
 */
function getFollowers(followers: string): string[] {
  const data = JSON.parse(fs.readFileSync(followers, 'utf8'));
  return data.map((follower: any) => follower.string_list_data[0].value);
}

/**
 * Reads a JSON file containing a list of followings and returns a list of strings representing the values
 * of the "value" key in each object.
 * @param following The path to the JSON file containing the followings data.
 * @returns A list of strings representing the values of the "value" key in each object.
 */
function getFollowing(following: string): string[] {
  const data = JSON.parse(fs.readFileSync(following, 'utf8'));
  return data.relationships_following.map((followingData: any) => followingData.string_list_data[0].value);
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
function extractZipAndReturnNotFollowingBack(zip: string): string[] {
  const files = extractAndNavigate(zip);
  const followers = getFollowers(files[0]);
  const following = getFollowing(files[1]);
  return notFollowingBack(followers, following);
}

/**
 * Extracts a zip file, retrieves followers and following data, and returns a list of users who do not follow back.
 * @param zipPath The path to the zip file containing the followers and following data.
 * @returns A sorted list of strings representing the users who do not follow back.
 */
function getUnfollowers(zipPath: string): string[] {
  return extractZipAndReturnNotFollowingBack(zipPath);
}

export { getUnfollowers };
