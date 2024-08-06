/**
 * This component renders the navigation bar at the top of the page.
 */

import React from 'react';

/**
 * A functional component that renders the navigation bar at the top of the page.
 *
 * @return {JSX.Element} The JSX element representing the navigation bar.
 */
const Navbar = (): JSX.Element => {
  return (
    <nav className='my-8 md:my-3 px-6 md:px-12 w-full'>
      <a href='/'>
        <div className='flex items-center'>
          <img src='logo.png' alt='Unfollowers Logo' className='h-8 mr-2' />
          <span className='text-bold text-xl font-bold text-center text-[#222222]'>unfollowers</span>
        </div>
      </a>
    </nav>
  );
};

export default Navbar;
