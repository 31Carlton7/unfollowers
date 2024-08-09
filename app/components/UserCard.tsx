/**
 * This component renders a card that displays a user's username and contains a link to the user's profile on Instagram.
 */

import React from 'react';
import Image from 'next/image';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

interface UserCardProps {
  userName: string;
}

/**
 * A React functional component that renders a card displaying a user's Instagram profile information.
 *
 * @param {string} userName - The username of the Instagram user.
 * @return {JSX.Element} A JSX element representing the UserCard component.
 */
export const UserCard: React.FC<UserCardProps> = ({ userName }: UserCardProps): JSX.Element => {
  const link = `https://www.instagram.com/${userName}`;
  const imgSize = 36;
  return (
    <Card className='rounded-2xl mb-3'>
      <a href={link} target='_blank'>
        <div className='flex items-center gap-4 m-3'>
          <Image src='/instalogo.png' alt='' width={imgSize} height={imgSize} />
          <div className='flex flex-col items-start gap-1'>
            <CardTitle className='break-all'>{userName}</CardTitle>
            <CardDescription className='break-all'>https://www.instagram.com/{userName}</CardDescription>
          </div>
        </div>
      </a>
    </Card>
  );
};
