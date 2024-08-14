/**
 * This file defines the PostHog provider.
 */

'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

// Initialize PostHog
if (typeof window !== 'undefined') {
  posthog.init(`${process.env.NEXT_PUBLIC_POSTHOG_KEY}`, {
    api_host: `${process.env.NEXT_PUBLIC_POSTHOG_HOST}`,
    person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
  });
}

/**
 * A PostHog provider component that wraps the application with PostHog analytics.
 *
 * @param {{ children: React.ReactNode }} props - The children elements to be rendered.
 * @return {JSX.Element} The PostHogProvider component with the client instance and children.
 */
export function CSPostHogProvider({ children: children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
