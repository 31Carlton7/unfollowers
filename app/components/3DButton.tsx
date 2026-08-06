import { forwardRef, type ButtonHTMLAttributes } from 'react';

interface ThreeDButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

/** Renders a real <button> so it composes with Radix `asChild` triggers. */
const ThreeDButton = forwardRef<HTMLButtonElement, ThreeDButtonProps>(({ text, ...props }, ref) => (
  <button
    ref={ref}
    type='button'
    className='group relative m-2 my-4 py-2 px-6 cursor-pointer inline-flex items-center justify-center overflow-hidden rounded-full border-b-2 border-l-2 border-r-2 border-black bg-gradient-to-tr from-[#222222] to-[#333333] text-white shadow-lg transition duration-100 ease-in-out active:translate-y-0.5 active:border-[#222222] active:shadow-none'
    {...props}
  >
    <span className='relative font-medium'>{text}</span>
  </button>
));

ThreeDButton.displayName = 'ThreeDButton';

export default ThreeDButton;
