import { useAuthenticator } from '@aws-amplify/ui-react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  if (!user) {
    return null; // Will be handled by Authenticator component
  }

  return (
    <div>
      <div className="auth-header">
        <div className="user-info">
          <span>Welcome, {user.signInDetails?.loginId || 'User'}!</span>
          <div className="user-stats">
            <span className="score">Score: 0</span>
            <span className="tricks">Tricks: 0</span>
          </div>
        </div>
        <button onClick={signOut} className="sign-out-btn">
          Sign Out
        </button>
      </div>
      {children}

      <style jsx>{`
        .auth-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-md) var(--space-lg);
          background: var(--glass-bg);
          border-bottom: 1px solid var(--glass-border);
          backdrop-filter: blur(20px);
        }

        .user-info {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .user-stats {
          display: flex;
          gap: var(--space-md);
          font-size: var(--text-sm);
          color: #666;
        }

        .score {
          color: #667eea;
          font-weight: 600;
        }

        .tricks {
          color: #764ba2;
          font-weight: 600;
        }

        .sign-out-btn {
          background: #e53e3e;
          color: white;
          border: none;
          padding: var(--space-sm) var(--space-lg);
          border-radius: var(--radius-md);
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .sign-out-btn:hover {
          background: #c53030;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .auth-header {
            flex-direction: column;
            gap: var(--space-md);
            text-align: center;
          }

          .user-stats {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
