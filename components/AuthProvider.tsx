import { createContext, useContext, useEffect, useState } from 'react';
import { getLogoutUrl } from '../lib/oidc-auth';

interface User {
  email: string;
  name: string;
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
          name: userData.name || userData.email,
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
      window.location.href = getLogoutUrl();
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
