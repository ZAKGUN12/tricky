import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { getCognitoAuthUrl } from '../lib/cognito-auth';

function LoginContent() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      const returnUrl = router.query.returnUrl as string || '/';
      router.push(returnUrl);
    }
  }, [user, loading, router]);

  const handleLogin = () => {
    setSigningIn(true);
    window.location.href = getCognitoAuthUrl();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h1>🌍 Welcome to TrickShare</h1>
      <p>Join our global community and share amazing life tricks!</p>
      
      {signingIn ? (
        <div className="signing-in">
          <div className="spinner"></div>
          <p>Redirecting to secure sign in...</p>
        </div>
      ) : (
        <button onClick={handleLogin} className="login-btn">
          Sign In
        </button>
      )}

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

        .signing-in {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .signing-in p {
          color: #78dbff;
          font-size: 1rem;
          margin: 0;
          opacity: 0.8;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(120, 219, 255, 0.3);
          border-top: 3px solid #78dbff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
