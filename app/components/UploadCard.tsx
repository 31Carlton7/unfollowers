'use client';

import { useState } from 'react';
import { FileUploader, FileInput } from '@/components/extension/file-uploader';
import type { DropzoneOptions } from 'react-dropzone';
import { useUserListContext } from '@/contexts/userlist';

const CardComponent: React.FC = (): JSX.Element => {
  const [files, setFiles] = useState<File[] | null>([]);
  const [error, setError] = useState<string | null>(null);
  const { setUnfollowers, setStats } = useUserListContext();

  const onValueChange = async (value: File[] | null): Promise<void> => {
    try {
      if (value) {
        setFiles(value);
        setError(null);

        const formData = new FormData();
        formData.append('file', value[0]);

        const response = await fetch('/api/instagram', {
          method: 'POST',
          body: formData,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        });

        const result = await response.json();

        if (response.ok) {
          const { unfollowers, stats } = result;
          setStats(stats ?? null);

          if (!unfollowers || unfollowers.length === 0) {
            setUnfollowers([{ username: '-1', followedAtTimestamp: null }]);
          } else {
            setUnfollowers(unfollowers);
          }
        } else {
          setFiles([]);
          setError(result.error);
        }
      }
    } catch (err: unknown) {
      setFiles([]);
      setError(`An error occurred: ${(err as Error).message}`);
    }
  };

  const dropZoneConfig: DropzoneOptions = {
    accept: {
      'application/zip': ['.zip'],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  } satisfies DropzoneOptions;

  return (
    <div>
      <FileUploader value={files} onValueChange={onValueChange} dropzoneOptions={dropZoneConfig} className=''>
        <FileInput>
          <div className='mb-6'>
            <div
              className='relative transform rotate-5 border-[16px] border-white rounded-[48px] shadow-lg -rotate-6'
              style={{
                background: 'linear-gradient(to bottom right, #4F5BD5, #962FC0, #D62977, #FA7E1E, #FEDA76)',
                width: '168px',
                height: '270px',
                boxShadow: '0 3px 25px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className='absolute inset-0 flex items-center justify-center'>
                <h2 className='text-lg font-bold text-center text-white'>Tap to upload follower data</h2>
              </div>
            </div>
          </div>
        </FileInput>
      </FileUploader>
      {error && (
        <p className='mt-2 text-sm text-red-500 text-center'>{error}</p>
      )}
    </div>
  );
};

export default CardComponent;
