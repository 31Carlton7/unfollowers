import Navbar from './components/Navbar';
import UploadCard from './components/UploadCard';
import Footer from './components/Footer';
import TutorialDialog from './components/TutorialDialog';
import { UserList } from './components/UserList';
import { UserListProvider } from '@/contexts/userlist';

export default function Home() {
  return (
    <UserListProvider>
      <div className='flex flex-col items-center w-full bg-white min-h-screen'>
        <Navbar />
        <main className='flex flex-col flex-grow justify-center items-center'>
          <UploadCard />
          <div className='flex flex-col md:w-[60.0%] items-center'>
            <p className='text-4xl text-[#222222] font-bold leading-[120%] text-center'>
              Check who <span className='italic tracking-tight'>doesn&apos;t</span> follow you back on Instagram!
            </p>
          </div>
          <TutorialDialog />

          <div className='w-full max-w-lg mx-auto px-4 my-4'>
            <details className='rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800'>
              <summary className='cursor-pointer font-semibold'>How we calculate unfollowers</summary>
              <div className='mt-2 space-y-2 text-xs leading-relaxed text-amber-700'>
                <p>
                  We compare the <strong>following</strong> and <strong>followers</strong> lists from your Instagram
                  data export and show you everyone you follow who doesn&apos;t appear in your followers list. Both
                  the <strong>JSON</strong> and <strong>HTML</strong> export formats work — upload the whole ZIP, or
                  just the followers and following files from it.
                </p>
                <p>
                  Everything is processed on the fly and nothing is stored — your data never leaves the request.
                </p>
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
  );
}
