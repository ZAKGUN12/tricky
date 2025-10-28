import { createContext, useContext, useEffect, useState } from 'react';

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
  signOut: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/user', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser({
          email: userData.email,
          name: userData.name,
          username: userData.preferredUsername || userData.name,
          sub: userData.sub
        });
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('username');
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('username');
      setUser(null);
    }
    
    setLoading(false);
  };

  const signOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('username');
    setUser(null);
    window.location.href = '/';
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
