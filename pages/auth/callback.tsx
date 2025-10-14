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
        const { code, error: authError, error_description } = router.query;

        if (authError) {
          setError(`${authError}: ${error_description || 'Authentication failed'}`);
          setStatus('error');
          return;
        }

        if (!code) {
          setError('No authorization code received');
          setStatus('error');
          return;
        }

        const tokens = await exchangeCodeForTokens(code as string);
        
        // Store tokens
        localStorage.setItem('access_token', tokens.access_token);
        if (tokens.id_token) {
          localStorage.setItem('id_token', tokens.id_token);
        }
        
        // Get user info
        const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
        if (domain) {
          const userResponse = await fetch(`https://${domain}/oauth2/userInfo`, {
            headers: { Authorization: `Bearer ${tokens.access_token}` }
          });

          if (userResponse.ok) {
            const userInfo = await userResponse.json();
            localStorage.setItem('user_info', JSON.stringify(userInfo));
          }
        }
        
        setStatus('success');
        setTimeout(() => router.push('/'), 1000);
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
            <h2 className="text-2xl font-bold text-white mb-2">Authentication Error</h2>
            <p className="text-white/80 mb-4 text-sm">{error}</p>
            <button
              onClick={() => router.push('/signin')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Go Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
