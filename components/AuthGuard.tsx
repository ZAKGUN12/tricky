import { useRouter } from 'next/router';
import { useAuth } from './AuthProvider';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?returnUrl=${encodeURIComponent(router.asPath)}`);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
        <p>Checking authentication...</p>
        
        <style jsx>{`
          .auth-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 50vh;
            gap: 1rem;
            color: #78dbff;
          }
          
          .spinner {
            width: 32px;
            height: 32px;
            border: 3px solid rgba(120, 219, 255, 0.3);
            border-top: 3px solid #78dbff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return fallback || null;
  }

  return <>{children}</>;
}