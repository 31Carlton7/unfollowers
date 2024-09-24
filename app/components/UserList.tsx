/**
 * This component is used to display a list of users.
 */

'use client';

import React from 'react';
import { useUserListContext } from '@/contexts/userlist';
import { UserCard } from './UserCard';

/**
 * Renders a list of user cards based on the provided array of user names.
 *
 * @return {JSX.Element} A React element representing the user list.
 */
export const UserList: React.FC = (): JSX.Element => {
  const { usernames, setUsernames } = useUserListContext();

  return (
    <div>
      {/* User did not upload file*/}
      {usernames.length === 0 && (
        <ul className='flex flex-col mx-4'>
          {[0, 1, 2, 3, 4].map((i) => (
            <li key={i} className='w-full'>
              {i === 0 && <UserCard userName='31carlton7' />}
              {i === 1 && <UserCard userName='champagnepapi' />}
              {i === 2 && <UserCard userName='lamineyamal' />}
              {i === 3 && <UserCard userName='sza' />}
              {i === 4 && <UserCard userName='kingjames' />}
            </li>
          ))}
        </ul>
      )}

      {/* User uploaded file but no users were found */}
      {usernames[0] === '-1' && <p>No users found 🤷‍♂️</p>}

      {/* User uploaded file and users were found */}
      {usernames.length > 0 &&
        usernames[0] !== '-1' &&
        usernames.map((user) => <UserCard key={user} userName={user} />)}
    </div>
  );
};
