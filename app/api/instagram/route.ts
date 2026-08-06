import { NextResponse } from 'next/server';
import {
  classifyLooseFiles,
  computeUnfollowers,
  sourcesFromZip,
  type NamedFile,
} from '@/lib/instagram';

// Mirrored client-side in UploadCard's dropzone maxSize; this is the enforced limit.
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

export async function POST(request: Request): Promise<NextResponse> {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Expected a multipart form upload' }, { status: 400 });
  }
  const files = formData.getAll('file').filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  if (totalBytes > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: 'Upload is too large (max 50MB)' }, { status: 413 });
  }

  try {
    const zipFile = files.find((f) => /\.zip$/i.test(f.name));

    let followers: NamedFile[];
    let following: NamedFile[];

    if (zipFile) {
      ({ followers, following } = sourcesFromZip(Buffer.from(await zipFile.arrayBuffer())));
      if (followers.length === 0 || following.length === 0) {
        return NextResponse.json(
          {
            error:
              'Could not find the followers/following files in the ZIP. Make sure you export "Followers and following" from Instagram (JSON or HTML format both work).',
          },
          { status: 400 },
        );
      }
    } else {
      const loose: NamedFile[] = await Promise.all(
        files.map(async (f) => ({ name: f.name, text: await f.text() })),
      );
      ({ followers, following } = classifyLooseFiles(loose));
      if (followers.length === 0 || following.length === 0) {
        return NextResponse.json(
          {
            error:
              'Upload both your followers file (followers_1.json/html) and your following file (following.json/html), or the whole export ZIP.',
          },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(computeUnfollowers(followers, following));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
