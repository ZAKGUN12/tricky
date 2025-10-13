import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { exchangeCodeForTokens } from '../../lib/cognito-auth';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { code, error: authError } = router.query;

        if (authError) {
          setError(authError as string);
          setStatus('error');
          return;
        }

        if (code) {
          const tokens = await exchangeCodeForTokens(code as string);
          
          // Store tokens
          localStorage.setItem('access_token', tokens.access_token);
          localStorage.setItem('id_token', tokens.id_token);
          
          // Get user info
          const userResponse = await fetch(`https://${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/userInfo`, {
            headers: { Authorization: `Bearer ${tokens.access_token}` }
          });

          if (userResponse.ok) {
            const userInfo = await userResponse.json();
            localStorage.setItem('user_info', JSON.stringify(userInfo));
            setStatus('success');
            
            setTimeout(() => router.push('/'), 1000);
          } else {
            throw new Error('Failed to get user info');
          }
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setStatus('error');
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router.query, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 max-w-md w-full mx-4">
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Authenticating...</h2>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="text-green-400 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
            <p className="text-white/80">Redirecting...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">✗</div>
            <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
            <p className="text-white/80 mb-4">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Return Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
