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

            {/* Disclaimer */}
            <div className='w-full max-w-lg mx-auto px-4 my-4'>
              <details className='rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800'>
                <summary className='cursor-pointer font-semibold'>How we calculate unfollowers &amp; how to improve accuracy</summary>
                <div className='mt-2 space-y-2 text-xs leading-relaxed text-amber-700'>
                  <p>
                    We cross-reference multiple files from your Instagram data export to build a
                    list of confirmed followers: <strong>followers_*.json</strong>, <strong>close_friends.json</strong>,
                    and — when present — <strong>story interactions</strong>, <strong>likes</strong>, and <strong>comments</strong>.
                    Pending follow requests are excluded since those accounts can&apos;t follow you back yet.
                  </p>
                  <p className='font-semibold text-amber-800'>For the most accurate results, re-export your data with these categories selected:</p>
                  <ul className='list-disc pl-4 space-y-1'>
                    <li>Followers and following</li>
                    <li>Story interactions</li>
                    <li>Likes</li>
                    <li>Comments</li>
                  </ul>
                  <p>
                    Meta&apos;s export may still omit some followers (deactivated, restricted, or private accounts),
                    so always verify a few results in the Instagram app before unfollowing anyone.
                  </p>
                </div>
              </details>
            </div>

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
            <p className='text-slate-500 mb-2 text-xs'>
              *NOTE*: When in the Instagram app, always check if the person doesn&apos;t follow you back. IG can
              sometimes return a list of users who actually do follow you back, making Unfollowers show you an incorrect
              unfollower.
            </p>
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
