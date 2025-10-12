import { useRouter } from 'next/router';
import { useEffect } from 'react';

function LoginContent() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home since we removed authentication
    router.push('/');
  }, [router]);

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Welcome to TrickShare</h1>
        <p>Authentication has been removed - redirecting to home...</p>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
          color: white;
        }

        .login-header h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .login-header p {
          font-size: 1.1rem;
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}

export default function Login() {
  return <LoginContent />;
}
