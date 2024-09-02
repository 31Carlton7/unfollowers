/**
 * This is the home page of the application.
 */

'use client';

import Navbar from './components/Navbar';
import UploadCard from './components/UploadCard';
import ThreeDButton from './components/3DButton';
import Footer from './components/Footer';
import { UserList } from './components/UserList';
import { UserListProvider } from '@/contexts/userlist';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

/**
 * A React functional component that renders the home page of the application.
 *
 * @return {JSX.Element} The rendered JSX element representing the home page.
 */
export default function Home(): JSX.Element {
  return (
    <Dialog>
      <UserListProvider>
        <div className='absolute flex flex-col items-center w-full bg-white min-h-screen'>
          <Navbar />
          <main className='flex flex-col flex-grow justify-center items-center'>
            <UploadCard />
            <div className='flex flex-col items-center justify-center gap-4'>
              <div className='flex flex-col md:w-[60.0%] items-center h-full'>
                <p className='text-4xl text-[#222222] font-bold leading-[120%] text-center'>
                  Check who <span className='italic tracking-tight'>doesn&apos;t</span> follow you back on Instagram!
                </p>
              </div>
            </div>
            <DialogTrigger>
              <ThreeDButton text='How to use 🤔' onClick={() => {}} />
            </DialogTrigger>
            <p className='w-full flex justify-center my-2 text-slate-500 text-sm'>⬇️ Your unfollowers ⬇️</p>
            <UserList />
          </main>
          <Footer />
        </div>
      </UserListProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How to use unfollowers 🤔</DialogTitle>
          <DialogDescription>
            <MediaPlayer title='How to use Unfollowers' src='./unfollowers-tutorial.mov'>
              <MediaProvider />
              <DefaultVideoLayout icons={defaultLayoutIcons} colorScheme='system' />
            </MediaPlayer>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
