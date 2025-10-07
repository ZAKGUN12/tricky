import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { Trick } from '../../lib/types';
import { countries } from '../../lib/mockData';
import { TrickShareAPI } from '../../lib/api';
import CommentsSection from '../../components/CommentsSection';

function TrickDetailContent() {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const { id } = router.query;
  const [trick, setTrick] = useState<Trick | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadTrick();
      incrementViews();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadTrick = async () => {
    if (!id) return;
    try {
      const data = await TrickShareAPI.getTrick(id as string);
      setTrick(data);
    } catch (error) {
      console.error('Error loading trick:', error);
    }
  };

  const incrementViews = async () => {
    if (!id) return;
    try {
      await fetch(`/api/tricks/${id}/view`, { method: 'POST' });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const handleKudos = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    if (!trick) return;
    
    try {
      await TrickShareAPI.giveKudos(trick.id);
      setTrick(prev => prev ? { ...prev, kudos: prev.kudos + 1 } : null);
    } catch (error) {
      console.error('Error giving kudos:', error);
    }
  };

  if (!trick) {
    return (
      <div className="container">
        <div className="loading-state">
          <div className="spinner"></div>
          <h3>Loading trick...</h3>
        </div>
      </div>
    );
  }

  const country = countries.find(c => c.code === trick.countryCode);

  return (
    <div className="container">
      <header className="page-header">
        <Link href="/" className="back-btn">
          ← Back to Tricks
        </Link>
      </header>

      <div className="trick-detail-card">
        <div className="trick-header">
          <div className="author-section">
            <div className="author-info">
              <span className="country-flag">{country?.flag}</span>
              <div className="author-details">
                <span className="author-name">{trick.authorName || 'Anonymous'}</span>
                <span className="country-name">{country?.name}</span>
              </div>
            </div>
            <div className="difficulty-badge difficulty-{trick.difficulty}">
              {trick.difficulty === 'easy' ? '🟢' : 
               trick.difficulty === 'medium' ? '🟡' : '🔴'}
              {trick.difficulty}
            </div>
          </div>
        </div>

        <h1 className="trick-title">{trick.title}</h1>
        <p className="trick-description">{trick.description}</p>

        <div className="trick-stats">
          <div className="stat">
            <span className="stat-icon">👍</span>
            <span className="stat-value">{trick.kudos}</span>
            <span className="stat-label">Kudos</span>
          </div>
          <div className="stat">
            <span className="stat-icon">👁️</span>
            <span className="stat-value">{trick.views}</span>
            <span className="stat-label">Views</span>
          </div>
          <div className="stat">
            <span className="stat-icon">💬</span>
            <span className="stat-value">{trick.comments}</span>
            <span className="stat-label">Comments</span>
          </div>
        </div>

        <div className="trick-steps">
          <h3>How to do it:</h3>
          <div className="steps-list">
            {trick.steps.map((step, index) => (
              <div key={index} className="step-item">
                <div className="step-number">{index + 1}</div>
                <div className="step-content">{step}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="trick-tags">
          {trick.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>

        <div className="action-section">
          <button onClick={handleKudos} className="kudos-btn">
            👍 Give Kudos ({trick.kudos})
          </button>
        </div>

        <CommentsSection 
          trickId={trick.id} 
          onAuthRequired={() => setShowAuthModal(true)}
        />

        {showAuthModal && (
          <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Login Required</h2>
              <p>Please sign in to give kudos and comment.</p>
              <div className="modal-actions">
                <button onClick={() => setShowAuthModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <Link href="/login" className="login-btn">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: #000;
          color: #fff;
          min-height: 100vh;
        }

        .page-header {
          margin-bottom: 30px;
        }

        .back-btn {
          color: #00d4aa;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          transition: color 0.2s;
        }

        .back-btn:hover {
          color: #00b894;
        }

        .trick-detail-card {
          background: #111;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .trick-header {
          margin-bottom: 24px;
        }

        .author-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .country-flag {
          font-size: 24px;
        }

        .author-details {
          display: flex;
          flex-direction: column;
        }

        .author-name {
          font-weight: 600;
          color: #fff;
          font-size: 16px;
        }

        .country-name {
          font-size: 14px;
          color: #888;
        }

        .difficulty-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          background: #333;
          color: #fff;
        }

        .trick-title {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 16px;
          color: #fff;
          line-height: 1.3;
        }

        .trick-description {
          font-size: 18px;
          color: #ccc;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .trick-stats {
          display: flex;
          gap: 24px;
          margin-bottom: 32px;
          padding: 20px;
          background: #0a0a0a;
          border-radius: 12px;
          border: 1px solid #222;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .stat-icon {
          font-size: 20px;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #00d4aa;
        }

        .stat-label {
          font-size: 12px;
          color: #888;
          text-transform: uppercase;
        }

        .trick-steps {
          margin-bottom: 32px;
        }

        .trick-steps h3 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #fff;
        }

        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .step-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .step-number {
          background: #00d4aa;
          color: #000;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
        }

        .step-content {
          flex: 1;
          font-size: 16px;
          line-height: 1.5;
          color: #ccc;
          padding-top: 4px;
        }

        .trick-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 32px;
        }

        .tag {
          background: #333;
          color: #00d4aa;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 500;
        }

        .action-section {
          margin-bottom: 32px;
          text-align: center;
        }

        .kudos-btn {
          background: linear-gradient(135deg, #00d4aa, #00b894);
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 25px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(0, 212, 170, 0.3);
        }

        .kudos-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 212, 170, 0.4);
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 16px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #333;
          border-top: 3px solid #00d4aa;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: #111;
          padding: 30px;
          border-radius: 16px;
          border: 1px solid #333;
          max-width: 400px;
          width: 90%;
        }

        .modal-content h2 {
          margin-bottom: 16px;
          color: #fff;
        }

        .modal-content p {
          margin-bottom: 24px;
          color: #ccc;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .cancel-btn, .login-btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-btn {
          background: #333;
          color: #fff;
          border: none;
        }

        .login-btn {
          background: #00d4aa;
          color: #000;
          border: none;
        }

        @media (max-width: 768px) {
          .container {
            padding: 16px;
          }

          .trick-detail-card {
            padding: 20px;
          }

          .trick-title {
            font-size: 24px;
          }

          .trick-stats {
            gap: 16px;
          }

          .author-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default function TrickDetail() {
  return (
    <Authenticator.Provider>
      <TrickDetailContent />
    </Authenticator.Provider>
  );
}
