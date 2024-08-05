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

/**
 * A React functional component that renders the home page of the application.
 *
 * @return {JSX.Element} The rendered JSX element representing the home page.
 */
export default function Home(): JSX.Element {
  return (
    <UserListProvider>
      <div className='absolute flex flex-col items-center w-full h-screen bg-white'>
        <Navbar />
        <UploadCard />
        <div className='flex flex-col items-center justify-center h-[80vh] gap-4'>
          <div className='flex flex-col md:w-[40.0%] items-center h-full'>
            <p className='text-4xl text-[#222222] font-bold leading-[120%] text-center'>
              Check who <span className='italic tracking-tight'>doesn't</span> follow you back on Instagram!
            </p>
            <ThreeDButton text='How to use 🤔' />
            <UserList />
            <Footer />
          </div>
        </div>
      </div>
    </UserListProvider>
  );
}
