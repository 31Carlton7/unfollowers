/**
 * This component is used to display a card that allows users to upload a file.
 */

'use client';

import React, { useState } from 'react';
import { FileUploader, FileInput } from '@/components/extension/file-uploader';
import { DropzoneOptions } from 'react-dropzone';
import { useUserListContext } from '@/contexts/userlist';

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
   * Updates the state with the new value of the files and performs a POST request to '/api/callPythonScript'
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

        const response = await fetch('/api/callUnfollowersScript', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          if (result.length === 0) {
            setUsernames(['-1']);
          } else {
            setUsernames(result);
          }
        } else {
          setFiles([]);
          setError(result.error);
        }
      }
    } catch (err: any) {
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

{
  /* <Dialog>
      <DialogTrigger>
        
        
      </DialogTrigger>
      <DialogContent className='sm:max-w-xl'>
        <ScrollArea>
          <DialogHeader>
            <DialogTitle>Upload files</DialogTitle>
            <DialogDescription>Drag and drop your files here or click to browse.</DialogDescription>
          </DialogHeader>
          <FileUploader
            value={files}
            onValueChange={onValueChange}
            dropzoneOptions={dropZoneConfig}
            className='relative space-y-1'
          >
            <FileInput className='border border-dashed border-gray-500'>
              <div className='flex items-center justify-center h-32 w-full border bg-background rounded-md'>
                <p className='text-gray-400'>Drop files here</p>
              </div>
            </FileInput>
            <FileUploaderContent className=''>
              {usernames &&
                usernames?.map((user, i) => (
                  <div key={i} className=''>
                    <UserCard userName={user} />
                  </div>
                ))}
            </FileUploaderContent>
          </FileUploader>
          <DialogDescription>
            The file will start with instagram-your-username-date-someID. For example:
            instagram-31carlton7-2024-07-31-someID.zip
          </DialogDescription>
          {error && <DialogDescription className='text-red-500'>{error}</DialogDescription>}
        </ScrollArea>
      </DialogContent>
    </Dialog> */
}

export default CardComponent;
