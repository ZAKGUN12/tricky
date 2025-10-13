import { createContext, useContext, useEffect, useState } from 'react';
import { getCognitoLogoutUrl } from '../lib/cognito-auth';

interface User {
  email: string;
  name: string;
  username: string;
  sub: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const idToken = localStorage.getItem('id_token');
      
      if (accessToken && idToken) {
        // Decode JWT to get user info
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        
        setUser({
          email: payload.email || payload['cognito:username'],
          name: payload.name || payload.preferred_username || payload['cognito:username'],
          username: payload.preferred_username || payload['cognito:username'],
          sub: payload.sub
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    signOut,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
