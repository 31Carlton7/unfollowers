/**
 * This file handles the API endpoint for calling a Python script.
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

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

    // Path to your Python script
    const pythonScriptPath = 'script.py';

    // Execute the Python script
    const { stdout, stderr } = await execAsync(`python3 ${pythonScriptPath} ${tempFilePath}`);

    if (stderr) {
      console.error('Python script error:', stderr);
      return NextResponse.json({ error: 'Error processing zip file' }, { status: 500 });
    }

    // Fix formatting of stdout result
    const resultList = stdout.trim().split('\n');

    return NextResponse.json(resultList);
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
