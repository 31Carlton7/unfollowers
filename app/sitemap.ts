/**
 * This file handles the sitemap.xml file.
 */
type SitemapEntry = {
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
};

/**
 * Returns an array of sitemap entries for the static pages of the website.
 *
 * @return {Promise<SitemapEntry[]>} An array of sitemap entries.
 */
export default async function sitemap(): Promise<SitemapEntry[]> {
  const baseUrl = 'https://www.unfollowers.co';

  const staticPages: SitemapEntry[] = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];

  return [...staticPages];
}
