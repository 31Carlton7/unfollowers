'use client';

import { useCallback, useState } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { usePostHog } from 'posthog-js/react';
import { useUserListContext } from '@/contexts/userlist';

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

const ACCEPT = {
  'application/zip': ['.zip'],
  'application/x-zip-compressed': ['.zip'],
  'text/html': ['.html', '.htm'],
  'application/json': ['.json'],
};

/** Pick the files worth sending: a ZIP wins, otherwise the loose followers/following files. */
function selectUpload(files: File[]): { toSend: File[] | null; hint: string | null } {
  // Newest ZIP wins — dropped files are appended, so scan from the end.
  const zip = [...files].reverse().find((f) => /\.zip$/i.test(f.name));
  if (zip) return { toSend: [zip], hint: null };

  const hasFollowing = files.some((f) => /following/i.test(f.name));
  const hasFollowers = files.some((f) => /follower/i.test(f.name) && !/following/i.test(f.name));
  if (hasFollowers && hasFollowing) return { toSend: files, hint: null };
  if (hasFollowers || hasFollowing) {
    return {
      toSend: null,
      hint: `Got your ${hasFollowers ? 'followers' : 'following'} file — now add the ${
        hasFollowers ? 'following' : 'followers'
      } file (or upload the whole ZIP instead).`,
    };
  }
  return {
    toSend: null,
    hint: 'Upload your Instagram export ZIP, or the followers and following files from it.',
  };
}

function rejectionMessage(rejections: FileRejection[]): string {
  const code = rejections[0]?.errors[0]?.code;
  if (code === 'file-too-large') return 'That file is too large (max 50MB).';
  if (code === 'file-invalid-type') return 'Only .zip, .html, and .json files are supported.';
  return rejections[0]?.errors[0]?.message ?? 'That file could not be accepted.';
}

const UploadCard = () => {
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setResults, clearResults } = useUserListContext();
  const posthog = usePostHog();

  const processFiles = useCallback(
    async (files: File[]): Promise<void> => {
      const { toSend, hint: nextHint } = selectUpload(files);
      if (!toSend) {
        setPendingFiles(files);
        setHint(nextHint);
        return;
      }

      setIsLoading(true);
      clearResults();
      try {
        const formData = new FormData();
        for (const file of toSend) formData.append('file', file);

        const response = await fetch('/api/instagram', { method: 'POST', body: formData });
        const result = await response.json();

        if (response.ok) {
          setResults(result.unfollowers ?? [], result.stats);
          posthog?.capture('upload_processed', {
            format: /\.zip$/i.test(toSend[0].name) ? 'zip' : 'loose_files',
            unfollowers_count: result.stats?.unfollowersCount,
          });
        } else {
          setError(result.error ?? 'Something went wrong processing your upload.');
          posthog?.capture('upload_failed', { error: result.error });
        }
      } catch (err: unknown) {
        setError(`An error occurred: ${(err as Error).message}`);
        posthog?.capture('upload_failed', { error: (err as Error).message });
      } finally {
        setPendingFiles([]);
        setIsLoading(false);
      }
    },
    [clearResults, setResults, posthog],
  );

  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      setError(null);
      setHint(null);
      if (rejections.length > 0) {
        setError(rejectionMessage(rejections));
        return;
      }
      if (accepted.length === 0) return;
      void processFiles([...pendingFiles, ...accepted]);
    },
    [pendingFiles, processFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxSize: MAX_UPLOAD_BYTES,
    multiple: true,
    disabled: isLoading,
  });

  return (
    <div>
      <div {...getRootProps({ className: 'cursor-pointer outline-none' })}>
        <input {...getInputProps()} />
        <div className='mb-6'>
          <div
            className={`relative border-[16px] border-white rounded-[48px] shadow-lg -rotate-6 transition-transform duration-200 hover:-rotate-3 hover:scale-[1.02] ${
              isDragActive ? '-rotate-3 scale-[1.02]' : ''
            }`}
            style={{
              background: 'linear-gradient(to bottom right, #4F5BD5, #962FC0, #D62977, #FA7E1E, #FEDA76)',
              width: '168px',
              height: '270px',
              boxShadow: '0 3px 25px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className='absolute inset-0 flex items-center justify-center p-2'>
              {isLoading ? (
                <div className='flex flex-col items-center gap-3'>
                  <div className='h-8 w-8 animate-spin rounded-full border-[3px] border-white/40 border-t-white' />
                  <h2 className='text-lg font-bold text-center text-white'>Analyzing…</h2>
                </div>
              ) : (
                <h2 className='text-lg font-bold text-center text-white'>
                  {isDragActive ? 'Drop it here!' : 'Tap to upload follower data'}
                </h2>
              )}
            </div>
          </div>
        </div>
      </div>
      {hint && <p className='mt-2 text-sm text-slate-500 text-center max-w-xs mx-auto'>{hint}</p>}
      {error && <p className='mt-2 text-sm text-red-500 text-center max-w-xs mx-auto'>{error}</p>}
    </div>
  );
};

export default UploadCard;
