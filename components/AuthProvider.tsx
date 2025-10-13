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
      const userInfo = localStorage.getItem('user_info');
      const accessToken = localStorage.getItem('access_token');
      
      if (userInfo && accessToken) {
        const userData = JSON.parse(userInfo);
        setUser({
          email: userData.email,
          name: userData.name || userData.given_name || userData.email.split('@')[0],
          username: userData.preferred_username || userData.username || userData.email.split('@')[0],
          sub: userData.sub
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('user_info');
      setUser(null);
      window.location.href = getCognitoLogoutUrl();
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
