'use client';

import { useMemo, useState } from 'react';
import { useUserListContext } from '@/contexts/userlist';
import { UserCard } from './UserCard';

type FilterKey = 'all' | '7d' | '30d' | '90d' | '1y';

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: '7d', label: '7 days' },
  { key: '30d', label: '30 days' },
  { key: '90d', label: '3 months' },
  { key: '1y', label: '1 year' },
];

const PLACEHOLDER_NAMES = ['31carlton7', 'champagnepapi', 'lamineyamal', 'sza', 'kingjames'];

function filterCutoff(key: FilterKey): number {
  const now = Date.now() / 1000;
  switch (key) {
    case '7d':
      return now - 7 * 86400;
    case '30d':
      return now - 30 * 86400;
    case '90d':
      return now - 90 * 86400;
    case '1y':
      return now - 365 * 86400;
    default:
      return 0;
  }
}

export const UserList = () => {
  const { unfollowers, stats, hasResults } = useUserListContext();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return unfollowers;
    const cutoff = filterCutoff(activeFilter);
    return unfollowers.filter((u) => u.followedAtTimestamp !== null && u.followedAtTimestamp >= cutoff);
  }, [unfollowers, activeFilter]);

  return (
    <div className='w-full max-w-lg mx-auto px-4'>
      {stats && (
        <div className='mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600'>
          <p className='font-semibold text-slate-800 mb-2'>Data summary</p>
          <div className='grid grid-cols-2 gap-x-6 gap-y-1'>
            <span>Following</span>
            <span className='font-medium text-slate-800'>{stats.followingCount}</span>
            <span>Followers</span>
            <span className='font-medium text-slate-800'>{stats.followersCount}</span>
            <span className='font-semibold text-slate-800 pt-1 border-t border-slate-200'>
              Don&apos;t follow you back
            </span>
            <span className='font-bold text-slate-900 pt-1 border-t border-slate-200'>{stats.unfollowersCount}</span>
          </div>
        </div>
      )}

      {hasResults && unfollowers.length > 0 && (
        <div className='mb-4 flex flex-wrap gap-2 justify-center'>
          <span className='text-xs text-slate-500 self-center mr-1'>Followed since:</span>
          {FILTER_OPTIONS.map((opt) => (
            <button
              type='button'
              key={opt.key}
              onClick={() => setActiveFilter(opt.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeFilter === opt.key
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {!hasResults && (
        <ul className='flex flex-col'>
          {PLACEHOLDER_NAMES.map((name) => (
            <li key={name} className='w-full'>
              <UserCard userName={name} />
            </li>
          ))}
        </ul>
      )}

      {hasResults && unfollowers.length === 0 && (
        <p className='text-center text-slate-500'>No unfollowers found — everyone you follow follows you back! 🎉</p>
      )}

      {hasResults && unfollowers.length > 0 && (
        <>
          {activeFilter !== 'all' && (
            <p className='text-xs text-slate-400 text-center mb-2'>
              Showing {filtered.length} of {unfollowers.length}
            </p>
          )}
          <ul className='flex flex-col'>
            {filtered.map((entry) => (
              <li key={entry.username} className='w-full'>
                <UserCard userName={entry.username} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
