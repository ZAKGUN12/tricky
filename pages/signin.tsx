import { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithCognito, signUpWithCognito } from '../lib/cognito-direct';

export default function SignIn() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        if (!formData.username) {
          setError('Username is required');
          return;
        }
        await signUpWithCognito(formData.email, formData.password, formData.username);
        setError('Check your email for verification code');
      } else {
        const tokens = await signInWithCognito(formData.email, formData.password);
        localStorage.setItem('access_token', tokens.AccessToken || '');
        localStorage.setItem('id_token', tokens.IdToken || '');
        
        const returnUrl = router.query.returnUrl as string || '/';
        router.push(returnUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          {isSignUp ? 'Join TrickShare' : 'Welcome Back'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30"
              required
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30"
            required
          />

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-cyan-400 hover:text-cyan-300"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
