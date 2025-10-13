import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { getCognitoAuthUrl } from '../lib/cognito-auth';

function LoginContent() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      const returnUrl = router.query.returnUrl as string || '/';
      router.push(returnUrl);
    }
  }, [user, loading, router]);

  const handleLogin = () => {
    window.location.href = getCognitoAuthUrl();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h1>🌍 Welcome to TrickShare</h1>
      <p>Join our global community and share amazing life tricks!</p>
      <button onClick={handleLogin} className="login-btn">
        Sign In
      </button>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
          text-align: center;
        }

        h1 {
          font-size: 3rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #7877c6, #ff77c6, #78dbff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        p {
          font-size: 1.2rem;
          color: #78dbff;
          margin-bottom: 3rem;
          opacity: 0.9;
        }

        .login-btn {
          background: linear-gradient(135deg, #7877c6 0%, #ff77c6 100%);
          color: white;
          border: none;
          padding: 1.5rem 3rem;
          border-radius: 12px;
          font-size: 1.2rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(120, 119, 198, 0.3);
        }

        .login-btn:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 12px 40px rgba(120, 119, 198, 0.5);
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 2.5rem;
          }
          
          p {
            font-size: 1rem;
          }
          
          .login-btn {
            padding: 1rem 2rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default function Login() {
  return <LoginContent />;
}
