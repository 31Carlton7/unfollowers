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

export const UserList: React.FC = (): JSX.Element => {
  const { unfollowers, stats } = useUserListContext();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const hasResults = unfollowers.length > 0 && unfollowers[0].username !== '-1';
  const isEmpty = unfollowers.length === 1 && unfollowers[0].username === '-1';

  const filtered = useMemo(() => {
    if (!hasResults) return [];
    if (activeFilter === 'all') return unfollowers;
    const cutoff = filterCutoff(activeFilter);
    return unfollowers.filter(
      (u) => u.followedAtTimestamp !== null && u.followedAtTimestamp >= cutoff,
    );
  }, [unfollowers, activeFilter, hasResults]);

  return (
    <div className='w-full max-w-lg mx-auto px-4'>
      {/* Stats bar — only shown after a successful upload */}
      {stats && (
        <div className='mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600'>
          <p className='font-semibold text-slate-800 mb-2'>Data summary</p>
          <div className='grid grid-cols-2 gap-x-6 gap-y-1'>
            <span>Following</span>
            <span className='font-medium text-slate-800'>{stats.followingCount}</span>
            <span>Followers (base)</span>
            <span className='font-medium text-slate-800'>{stats.baseFollowers}</span>
            <span>Close friends</span>
            <span className='font-medium text-slate-800'>+{stats.closeFriends}</span>
            {stats.interactionSignals > 0 && (
              <>
                <span>Interactions</span>
                <span className='font-medium text-slate-800'>+{stats.interactionSignals}</span>
              </>
            )}
            <span>Pending requests</span>
            <span className='font-medium text-slate-800'>{stats.pendingRequests}</span>
            <span className='font-semibold text-slate-800 pt-1 border-t border-slate-200'>Total confirmed followers</span>
            <span className='font-bold text-slate-900 pt-1 border-t border-slate-200'>{stats.totalAugmentedFollowers}</span>
          </div>
          <p className='mt-3 font-semibold text-slate-800'>
            {stats.unfollowersCount} unfollower{stats.unfollowersCount !== 1 ? 's' : ''} found
          </p>
        </div>
      )}

      {/* Followed-since filter — only shown when there are results */}
      {hasResults && (
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

      {/* Placeholder cards before upload */}
      {unfollowers.length === 0 && (
        <ul className='flex flex-col'>
          {['31carlton7', 'champagnepapi', 'lamineyamal', 'sza', 'kingjames'].map((name) => (
            <li key={name} className='w-full'>
              <UserCard userName={name} />
            </li>
          ))}
        </ul>
      )}

      {/* No unfollowers found */}
      {isEmpty && <p className='text-center text-slate-500'>No unfollowers found</p>}

      {/* Filtered results */}
      {hasResults && (
        <>
          {activeFilter !== 'all' && (
            <p className='text-xs text-slate-400 text-center mb-2'>
              Showing {filtered.length} of {unfollowers.length}
            </p>
          )}
          {filtered.map((entry) => (
            <UserCard key={entry.username} userName={entry.username} />
          ))}
        </>
      )}
    </div>
  );
};
