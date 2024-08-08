/**
 * This component renders a 3D button with the given text.
 */

import React from 'react';

interface ThreeDButtonProps {
  text: string;
  onClick: () => void;
}

/**
 * Renders a 3D button component with the given text.
 *
 * @param {ThreeDButtonProps} props - The props for the component.
 * @param {string} props.text - The text to be displayed on the button.
 * @param {() => void} props.onClick - The function to be called when the button is clicked.
 * @return {JSX.Element} The rendered 3D button component.
 */
const ThreeDButton: React.FC<ThreeDButtonProps> = ({ text, onClick }: ThreeDButtonProps): JSX.Element => {
  return (
    <div
      className='group relative m-2 my-4 py-2 px-6 cursor-pointer inline-flex items-center justify-center overflow-hidden rounded-full border-b-2 border-l-2 border-r-2 border-black bg-gradient-to-tr from-[#222222] to-[#333333]  text-white shadow-lg transition duration-100 ease-in-out active:translate-y-0.5 active:border-[#222222] active:shadow-none'
      onClick={onClick}
      aria-label={text + ' unfollowers'}
    >
      <span className='relative font-medium'>{text}</span>
    </div>
  );
};

export default ThreeDButton;
