/**
 * This component is used to display a card that allows users to upload a file.
 */

'use client';

import React, { useState } from 'react';
import { FileUploader, FileInput } from '@/components/extension/file-uploader';
import { DropzoneOptions } from 'react-dropzone';
import { useUserListContext } from '@/contexts/userlist';
import posthog from 'posthog-js';

/**
 * Renders a card component that allows users to upload a file.
 *
 * @return {JSX.Element} The rendered card component.
 */
const CardComponent: React.FC = (): JSX.Element => {
  const [files, setFiles] = useState<File[] | null>([]);
  const [error, setError] = useState<string | null>(null);
  const { setUsernames } = useUserListContext();

  /**
   * Updates the state with the new value of the files and performs a POST request to '/api/instagram'
   * with the first file from the value array. If the response is successful, updates the usernames state with
   * the parsed result. If the response is not successful, clears the files state and sets the error state with
   * the result error message. If an error occurs during the process, clears the files state and sets the error
   * state with the error message.
   *
   * @param {File[] | null} value - The new value of the files state.
   * @return {Promise<void>} - A Promise that resolves when the function completes.
   */
  const onValueChange = async (value: File[] | null): Promise<void> => {
    try {
      if (value) {
        setFiles(value);

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
          // Capture successful upload in PostHog
          posthog.capture('Zip File Uploaded', { property: 'Successfully' });
          posthog.capture('Number of Instagrm Unfollowers', { property: result.length });

          if (result.length === 0) {
            setUsernames(['-1']);
          } else {
            setUsernames(result);
          }
        } else {
          // Capture failed upload in PostHog
          posthog.capture('Zip File Uploaded', { property: `With Error: ${result.error}` });

          setFiles([]);
          setError(result.error);
        }
      }
    } catch (err: any) {
      // Capture failed upload in PostHog
      posthog.capture('Zip File Uploaded', { property: `With Error: ${err.message}` });

      setFiles([]);
      setError(`An error occurred: ${err.message}`);
    }
  };

  /**
   * Defines the configuration for the dropzone component.
   * @type {DropzoneOptions}
   * @returns {JSX.Element} The rendered dropzone component.
   */
  const dropZoneConfig: DropzoneOptions = {
    accept: {
      'application/zip': ['.zip'],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: 1 * 1024 * 1024,
  } satisfies DropzoneOptions;

  return (
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
  );
};

export default CardComponent;
