import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { authApi } from '../services/api';
import type { User } from '../types';

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't try to sync while Auth0 is still loading
    if (auth0Loading) {
      return;
    }

    if (isAuthenticated) {
      console.log('UserContext: Syncing user with backend...');
      setLoading(true);
      authApi
        .syncUser()
        .then((syncedUser) => {
          console.log('UserContext: User synced successfully:', syncedUser);
          setUser(syncedUser);
          setError(null);
        })
        .catch((err) => {
          console.error('UserContext: Failed to sync user:', err);
          setError('Failed to sync user');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log('UserContext: User not authenticated, clearing user data');
      setUser(null);
      setError(null);
      setLoading(false);
    }
  }, [isAuthenticated, auth0Loading]);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
