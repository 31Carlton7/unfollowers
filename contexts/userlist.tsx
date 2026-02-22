'use client';

import React, { createContext, useState, useContext, type ReactNode, type Dispatch, type SetStateAction } from 'react';

export interface UnfollowerEntry {
  username: string;
  followedAtTimestamp: number | null;
}

export interface FollowerStats {
  baseFollowers: number;
  closeFriends: number;
  interactionSignals: number;
  pendingRequests: number;
  totalAugmentedFollowers: number;
  followingCount: number;
  unfollowersCount: number;
}

interface UserListContextType {
  unfollowers: UnfollowerEntry[];
  setUnfollowers: Dispatch<SetStateAction<UnfollowerEntry[]>>;
  stats: FollowerStats | null;
  setStats: Dispatch<SetStateAction<FollowerStats | null>>;
}

const UserListContext = createContext<UserListContextType | undefined>(undefined);

export const UserListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [unfollowers, setUnfollowers] = useState<UnfollowerEntry[]>([]);
  const [stats, setStats] = useState<FollowerStats | null>(null);

  return (
    <UserListContext.Provider value={{ unfollowers, setUnfollowers, stats, setStats }}>
      {children}
    </UserListContext.Provider>
  );
};

export const useUserListContext = () => {
  const context = useContext(UserListContext);
  if (context === undefined) {
    throw new Error('useUserListContext must be used within a UserListProvider');
  }
  return context;
};
