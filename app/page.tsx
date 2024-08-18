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
            <ul>
              <li className='leading-7'>1. Open Instagram and go to your profile</li>
              <li className='leading-7'>2. Tap on the 3 lines in the top corner and go to settings</li>
              <li className='leading-7'>
                3. Tap on accounts center &gt; Your Information &gt; Download Information &gt; Download or transfer
                information &gt; Some of your information
              </li>
              <li className='leading-7'>
                4. Scroll down under &quot;Connections&quot; and select Followers and Following &gt; Next
              </li>
              <li className='leading-7'>
                5. (IMPORTANT) Set format to JSON &gt; Set the range to whatever you&apos;d like (This will change how
                many unfollowers you see) &gt; Create files
              </li>
              <li className='leading-7'>
                7. Check for an email sent from Meta and open on it or keep refreshing the download information page
              </li>
              <li className='leading-7'>
                8. Go back to the Download information page &gt; Sign in &gt; Save the zip file
              </li>
              <li className='leading-7'>9. Come back to the unfollowers.co website and Upload the zip file</li>
              <li className='leading-7'>10. Then enjoy :) Happy unfollowing!</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
