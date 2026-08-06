import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className='my-8 md:my-3 px-6 md:px-12 w-full'>
      <Link href='/' className='flex items-center'>
        <Image src='/logo.png' alt='Unfollowers Logo' className='h-8 mr-2' width={32} height={32} />
        <span className='text-xl font-bold text-center text-[#222222]'>unfollowers</span>
      </Link>
    </nav>
  );
};

export default Navbar;
