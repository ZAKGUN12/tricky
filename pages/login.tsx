import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';

function LoginContent() {
  const router = useRouter();
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      router.push('/');
    }
  }, [authStatus, router]);

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Welcome to TrickShare</h1>
        <p>Sign in to share tricks and connect with the community</p>
      </div>

      <Authenticator signUpAttributes={['email']} />

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-lg);
          background: var(--bg-gradient);
        }

        .login-header {
          text-align: center;
          margin-bottom: var(--space-xl);
        }

        .login-header h1 {
          font-size: var(--text-3xl);
          margin-bottom: var(--space-md);
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .login-header p {
          color: #666;
          font-size: var(--text-lg);
        }
      `}</style>
    </div>
  );
}

export default function Login() {
  return (
    <Authenticator.Provider>
      <LoginContent />
    </Authenticator.Provider>
  );
}
