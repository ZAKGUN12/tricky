import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SignIn() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    email: '',
    password: '',
    username: '',
    verificationCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (showVerification) {
        // Handle verification code submission
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            code: formData.verificationCode
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Verification failed');
        }

        setError('Account verified! Please sign in.');
        setShowVerification(false);
        setIsSignUp(false);
      } else {
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: isSignUp ? formData.email : formData.emailOrUsername,
            password: formData.password,
            username: isSignUp ? formData.username : formData.emailOrUsername,
            action: isSignUp ? 'signup' : 'signin'
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Authentication failed');
        }

        if (isSignUp) {
          setShowVerification(true);
          setError('Check your email for verification code');
        } else {
          localStorage.setItem('access_token', data.AccessToken || '');
          localStorage.setItem('id_token', data.IdToken || '');
          localStorage.setItem('username', data.username || (isSignUp ? formData.username : formData.emailOrUsername));
          
          const returnUrl = router.query.returnUrl as string || '/';
          router.push(returnUrl);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      {/* Background Effects */}
      <div className="background-orbs"></div>
      <div className="starfield"></div>
      
      <div className="signin-container">
        <div className="signin-card">
          <div className="card-glow"></div>
          
          <div className="signin-header">
            <h1 className="signin-title">
              🌍 {showVerification ? 'Verify Email' : (isSignUp ? 'Join TrickShare' : 'Welcome Back')}
            </h1>
            <p className="signin-subtitle">
              {showVerification 
                ? 'Enter the verification code sent to your email'
                : (isSignUp 
                  ? 'Join our global community and share amazing life tricks!' 
                  : 'Sign in to share your tricks with the world'
                )
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="signin-form">
            {showVerification ? (
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Verification Code"
                  value={formData.verificationCode}
                  onChange={(e) => setFormData({...formData, verificationCode: e.target.value})}
                  className="signin-input"
                  required
                />
                <div className="input-glow"></div>
              </div>
            ) : (
              <>
                {isSignUp ? (
                  <>
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="signin-input"
                        required
                      />
                      <div className="input-glow"></div>
                    </div>
                    
                    <div className="input-group">
                      <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="signin-input"
                        required
                      />
                      <div className="input-glow"></div>
                    </div>
                  </>
                ) : (
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Username or Email"
                      value={formData.emailOrUsername}
                      onChange={(e) => setFormData({...formData, emailOrUsername: e.target.value})}
                      className="signin-input"
                      required
                    />
                    <div className="input-glow"></div>
                  </div>
                )}
                
                <div className="input-group">
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="signin-input"
                    required
                  />
                  <div className="input-glow"></div>
                </div>
              </>
            )}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="signin-button"
            >
              <div className="button-glow"></div>
              <span className="button-text">
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    {showVerification ? '✅ Verify Email' : (isSignUp ? '🚀 Create Account' : '✨ Sign In')}
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="signin-toggle">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="toggle-button"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .signin-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .background-orbs {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.4) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.4) 0%, transparent 50%),
                      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
          pointer-events: none;
          z-index: -2;
        }

        .starfield {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, rgba(120, 219, 255, 0.8), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255, 119, 198, 0.6), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(120, 119, 198, 0.9), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(120, 219, 255, 0.7), transparent),
            radial-gradient(2px 2px at 160px 30px, rgba(255, 119, 198, 0.5), transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
          pointer-events: none;
          z-index: -1;
          animation: sparkle 15s linear infinite;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .signin-container {
          width: 100%;
          max-width: 420px;
          position: relative;
        }

        .signin-card {
          background: rgba(15, 15, 35, 0.85);
          backdrop-filter: blur(25px);
          border-radius: 20px;
          padding: 2.5rem;
          border: 1px solid rgba(120, 119, 198, 0.3);
          position: relative;
          overflow: hidden;
        }

        .card-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #7877c6, #ff77c6, #78dbff, #7877c6);
          border-radius: 20px;
          opacity: 0;
          z-index: -1;
          transition: opacity 0.3s;
        }

        .signin-card:hover .card-glow {
          opacity: 0.3;
        }

        .signin-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .signin-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #7877c6, #ff77c6, #78dbff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .signin-subtitle {
          color: rgba(120, 219, 255, 0.9);
          font-size: 1rem;
          line-height: 1.5;
          opacity: 0.9;
        }

        .signin-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group {
          position: relative;
        }

        .signin-input {
          width: 100%;
          padding: 1rem 1.25rem;
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(120, 119, 198, 0.3);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .signin-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .signin-input:focus {
          border-color: rgba(120, 219, 255, 0.6);
          box-shadow: 0 0 20px rgba(120, 219, 255, 0.2);
        }

        .input-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 12px;
          background: linear-gradient(45deg, #7877c6, #78dbff);
          opacity: 0;
          z-index: -1;
          transition: opacity 0.3s;
        }

        .signin-input:focus + .input-glow {
          opacity: 0.2;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          text-align: center;
        }

        .signin-button {
          position: relative;
          background: linear-gradient(135deg, #7877c6 0%, #ff77c6 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(120, 119, 198, 0.3);
        }

        .signin-button:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 12px 40px rgba(120, 119, 198, 0.5);
        }

        .signin-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .button-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transform: rotate(45deg);
          transition: all 0.6s;
          opacity: 0;
        }

        .signin-button:hover:not(:disabled) .button-glow {
          opacity: 1;
          animation: shimmer 0.6s ease-out;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }

        .button-text {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .signin-toggle {
          text-align: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(120, 119, 198, 0.2);
        }

        .toggle-button {
          background: none;
          border: none;
          color: rgba(120, 219, 255, 0.8);
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .toggle-button:hover {
          color: #78dbff;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .signin-page {
            padding: 1rem;
          }

          .signin-card {
            padding: 2rem;
          }

          .signin-title {
            font-size: 2rem;
          }

          .signin-subtitle {
            font-size: 0.9rem;
          }

          .signin-input {
            padding: 0.875rem 1rem;
          }

          .signin-button {
            padding: 0.875rem 1.5rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
