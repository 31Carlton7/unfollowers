/**
 * This file handles the robots.txt file.
 */
import { MetadataRoute } from 'next';

/**
 * Generates the robots.txt file for the website.
 *
 * @return {MetadataRoute.Robots} The robots.txt configuration object.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://www.unfollowers.co/sitemap.xml',
  };
}
