import { createContext, useContext, useEffect, useState } from 'react';
import { getCognitoLogoutUrl } from '../lib/cognito-auth';

interface User {
  email: string;
  name: string;
  username: string;
  sub: string;
  profile?: {
    displayName: string;
    bio: string;
    country: string;
    interests: string;
    completedAt: string;
  };
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
      const profileData = localStorage.getItem('user_profile');
      
      if (accessToken) {
        // Validate token server-side and get user info
        const response = await fetch('/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser({
            email: userData.email,
            name: userData.name,
            username: userData.preferredUsername || userData.name,
            sub: userData.sub,
            profile: profileData ? JSON.parse(profileData) : undefined
          });
        } else {
          // Token is invalid, clear storage
          localStorage.removeItem('access_token');
          localStorage.removeItem('id_token');
          localStorage.removeItem('username');
          localStorage.removeItem('user_profile');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('username');
      localStorage.removeItem('user_profile');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('username');
      localStorage.removeItem('user_profile');
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
