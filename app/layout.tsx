/**
 * This file defines the layout of the app.
 */

import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

// Set the font family for Plus Jakarta Sans
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] });

// Define the metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://www.unfollowers.co'),
  title: 'Unfollowers - Track Who Unfollowed You On Instagram Safely',
  description:
    "Discover who doesn't follow you back on Instagram with Unfollowers. Use our safe and reliable tool without risking your account or data.",
  applicationName: 'Unfollowers',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: 'Instagram unfollowers, track unfollowers, Instagram followers, Instagram tool',
  creator: 'Carlton Aikins',
  publisher: 'Charm Technologies',
  robots: 'index, follow',
  category: 'Social Media',
  classification: 'Social Media',
  authors: [
    { name: 'Carlton Aikins', url: 'https://www.carltonaikins.com' },
    { name: 'Charm Technologies', url: 'https://www.charmtechnologies.co' },
  ],
  openGraph: {
    description:
      "Discover who doesn't follow you back on Instagram with Unfollowers. Use our safe and reliable tool without risking your account or data.",
    images: ['https://www.unfollowers.co/visual.png'],
    url: 'https://www.unfollowers.co',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unfollowers - Track Instagram Unfollowers Safely',
    description: "Discover who doesn't follow you back on Instagram with Unfollowers.",
    siteId: '',
    creator: '@31carlton7',
    creatorId: '',
    images: ['https://www.unfollowers.co/visual.png'],
  },
};

/**
 * A description of the entire function.
 *
 * @param {Readonly<{ children: React.ReactNode; }>} children - The child elements to be rendered.
 * @return {JSX.Element} The rendered HTML body element.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang='en'>
      <body className={plusJakartaSans.className}>{children}</body>
    </html>
  );
}
