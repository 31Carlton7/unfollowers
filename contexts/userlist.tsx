/**
 * This file defines the context for the user list.
 */

import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

// Define the shape of the context
interface UserListContextType {
  usernames: string[];
  setUsernames: Dispatch<SetStateAction<string[]>>;
}

// Create the context
const UserListContext = createContext<UserListContextType | undefined>(undefined);

// Create a provider component
export const UserListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usernames, setUsernames] = useState<string[]>([]);

  return <UserListContext.Provider value={{ usernames, setUsernames }}>{children}</UserListContext.Provider>;
};

// Create a custom hook to use the context
export const useUserListContext = () => {
  const context = useContext(UserListContext);
  if (context === undefined) {
    throw new Error('useUsernameContext must be used within a UsernameProvider');
  }
  return context;
};
