import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../components/AuthProvider';

export default function ProfileSetup() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    displayName: user?.name || '',
    bio: '',
    country: '',
    interests: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Store profile data in localStorage for now
      localStorage.setItem('user_profile', JSON.stringify({
        ...formData,
        completedAt: new Date().toISOString()
      }));

      // Redirect to submit page
      router.push('/submit');
    } catch (error) {
      console.error('Profile setup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-setup-page">
      <div className="background-orbs"></div>
      <div className="starfield"></div>
      
      <div className="setup-container">
        <div className="setup-card">
          <div className="setup-header">
            <h1 className="setup-title">🌟 Complete Your Profile</h1>
            <p className="setup-subtitle">
              Tell us about yourself to personalize your TrickShare experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="setup-form">
            <div className="input-group">
              <label className="input-label">Display Name</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                className="setup-input"
                placeholder="How should we call you?"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="setup-textarea"
                placeholder="Tell us a bit about yourself..."
                rows={3}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className="setup-input"
                placeholder="Where are you from?"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Interests</label>
              <input
                type="text"
                value={formData.interests}
                onChange={(e) => setFormData({...formData, interests: e.target.value})}
                className="setup-input"
                placeholder="Cooking, Technology, Travel..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="setup-button"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Setting up...
                </>
              ) : (
                '🚀 Start Sharing Tricks'
              )}
            </button>
          </form>

          <div className="skip-section">
            <button
              type="button"
              onClick={() => router.push('/submit')}
              className="skip-button"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-setup-page {
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
            radial-gradient(1px 1px at 90px 40px, rgba(120, 119, 198, 0.9), transparent);
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

        .setup-container {
          width: 100%;
          max-width: 500px;
        }

        .setup-card {
          background: rgba(15, 15, 35, 0.85);
          backdrop-filter: blur(25px);
          border-radius: 20px;
          padding: 2.5rem;
          border: 1px solid rgba(120, 119, 198, 0.3);
        }

        .setup-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .setup-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #7877c6, #ff77c6, #78dbff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .setup-subtitle {
          color: rgba(120, 219, 255, 0.9);
          font-size: 1rem;
          line-height: 1.5;
        }

        .setup-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-label {
          color: white;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .setup-input, .setup-textarea {
          padding: 1rem;
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(120, 119, 198, 0.3);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .setup-input::placeholder, .setup-textarea::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .setup-input:focus, .setup-textarea:focus {
          border-color: rgba(120, 219, 255, 0.6);
          box-shadow: 0 0 20px rgba(120, 219, 255, 0.2);
        }

        .setup-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .setup-button {
          background: linear-gradient(135deg, #7877c6 0%, #ff77c6 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(120, 119, 198, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .setup-button:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 12px 40px rgba(120, 119, 198, 0.5);
        }

        .setup-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
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

        .skip-section {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(120, 119, 198, 0.2);
        }

        .skip-button {
          background: none;
          border: none;
          color: rgba(120, 219, 255, 0.8);
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .skip-button:hover {
          color: #78dbff;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .profile-setup-page {
            padding: 1rem;
          }

          .setup-card {
            padding: 2rem;
          }

          .setup-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
