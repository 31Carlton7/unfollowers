import Image from 'next/image';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

interface UserCardProps {
  userName: string;
}

export const UserCard = ({ userName }: UserCardProps) => {
  const link = `https://www.instagram.com/${userName}`;
  return (
    <Card className='rounded-2xl mb-3'>
      <a href={link} target='_blank' rel='noopener noreferrer'>
        <div className='flex items-center gap-4 m-3'>
          <Image src='/instalogo.png' alt='' width={36} height={36} />
          <div className='flex flex-col items-start gap-1'>
            <CardTitle className='break-all'>{userName}</CardTitle>
            <CardDescription className='break-all'>https://www.instagram.com/{userName}</CardDescription>
          </div>
        </div>
      </a>
    </Card>
  );
};
