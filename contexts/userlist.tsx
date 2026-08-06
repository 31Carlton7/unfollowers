'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ProcessResult, UnfollowerEntry } from '@/lib/instagram';

export type FollowerStats = ProcessResult['stats'];
export type { UnfollowerEntry };

interface UserListContextType {
  unfollowers: UnfollowerEntry[];
  stats: FollowerStats | null;
  hasResults: boolean;
  setResults: (unfollowers: UnfollowerEntry[], stats: FollowerStats) => void;
  clearResults: () => void;
}

const UserListContext = createContext<UserListContextType | undefined>(undefined);

export const UserListProvider = ({ children }: { children: ReactNode }) => {
  const [unfollowers, setUnfollowers] = useState<UnfollowerEntry[]>([]);
  const [stats, setStats] = useState<FollowerStats | null>(null);

  const setResults = useCallback((entries: UnfollowerEntry[], newStats: FollowerStats) => {
    setUnfollowers(entries);
    setStats(newStats);
  }, []);

  const clearResults = useCallback(() => {
    setUnfollowers([]);
    setStats(null);
  }, []);

  const value = useMemo(
    () => ({ unfollowers, stats, hasResults: stats !== null, setResults, clearResults }),
    [unfollowers, stats, setResults, clearResults],
  );

  return <UserListContext.Provider value={value}>{children}</UserListContext.Provider>;
};

export const useUserListContext = (): UserListContextType => {
  const context = useContext(UserListContext);
  if (context === undefined) {
    throw new Error('useUserListContext must be used within a UserListProvider');
  }
  return context;
};
