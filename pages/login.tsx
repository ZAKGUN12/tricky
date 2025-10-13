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
    const authUrl = getCognitoAuthUrl();
    console.log('Auth URL:', authUrl);
    console.log('Environment vars:', {
      domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
      clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
      redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI
    });
    console.log('All env vars:', process.env);
    
    if (authUrl === '/login') {
      alert(`Cognito environment variables not configured. 
Domain: ${process.env.NEXT_PUBLIC_COGNITO_DOMAIN || 'MISSING'}
Client ID: ${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || 'MISSING'}  
Redirect URI: ${process.env.NEXT_PUBLIC_REDIRECT_URI || 'MISSING'}

Please check Vercel settings and redeploy.`);
      return;
    }
    
    window.location.href = authUrl;
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
      <div className="login-header">
        <h1>🌍 Welcome to TrickShare</h1>
        <p>Join our global community and share amazing life tricks!</p>
      </div>

      <div className="auth-wrapper">
        <div className="auth-header">
          <h2>Sign in to continue</h2>
          <p className="auth-subtitle">Secure authentication with AWS Cognito</p>
        </div>
        <button onClick={handleLogin} className="login-btn">
          🔐 Sign in with Cognito
        </button>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
        }

        .login-header {
          text-align: center;
          margin-bottom: 3rem;
          color: white;
        }

        .login-header h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
          background: linear-gradient(135deg, #7877c6, #ff77c6, #78dbff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .auth-wrapper {
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid rgba(120, 119, 198, 0.3);
          min-width: 400px;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-header h2 {
          color: #7877c6;
          margin-bottom: 0.5rem;
        }

        .auth-subtitle {
          color: #78dbff;
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .login-btn {
          width: 100%;
          background: linear-gradient(135deg, #7877c6 0%, #ff77c6 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(120, 119, 198, 0.4);
        }
      `}</style>
    </div>
  );
}

export default function Login() {
  return <LoginContent />;
}
