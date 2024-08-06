/**
 * This component renders a footer component with copyright information and an Instagram link.
 */

import React from 'react';
import { FaInstagram, FaTwitter } from 'react-icons/fa';

/**
 * Renders a footer component with copyright information and an Instagram link.
 *
 * @return {JSX.Element} The rendered footer component.
 */
const Footer = (): JSX.Element => {
  return (
    <div className='flex w-full justify-between'>
      <p className='text-[#222222] font-bold text-xl mx-8 my-4'>© Charm Technologies 2024</p>
      <div className='flex gap-2 mr-4'>
        <a href='https://www.twitter.com/31carlton7' target='_blank'>
          <FaTwitter className='text-[#222222] font-bold text-xl my-4' />
        </a>
        <a href='https://www.instagram.com/31carlton7' target='_blank'>
          <FaInstagram className='text-[#222222] font-bold text-xl  my-4' />
        </a>
      </div>
    </div>
  );
};

export default Footer;
