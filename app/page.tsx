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
                  Check who <span className='italic tracking-tight'>doesn't</span> follow you back on Instagram!
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
            <ul>
              <li className='leading-7'>1. Open Instagram and go to your profile</li>
              <li className='leading-7'>2. Tap on the 3 lines in the top corner and go to settings</li>
              <li className='leading-7'>
                3. Tap on accounts center &gt; Download Information &gt; Followers and Following
              </li>
              <li className='leading-7'>
                4. Set the range to whatever you'd like (This will change how many unfollowers you see)
              </li>
              <li className='leading-7'>5. Tap download</li>
              <li className='leading-7'>6. Check for an email sent from Meta and open on it</li>
              <li className='leading-7'>7. Tap the download information link &gt; Sign in &gt; Save the zip file</li>
              <li className='leading-7'>8. Come back to the unfollowers.co website and Upload the zip file</li>
              <li className='leading-7'>9. Then enjoy :)</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
