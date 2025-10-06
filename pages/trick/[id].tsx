import { useState, useEffect, useCallback } from 'react';
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

  const loadTrick = useCallback(async () => {
    try {
      const data = await TrickShareAPI.getTrick(id as string);
      setTrick(data);
    } catch (error) {
      console.error('Error loading trick:', error);
    }
  }, [id]);

  const incrementViews = useCallback(async () => {
    try {
      await fetch(`/api/tricks/${id}/view`, { method: 'POST' });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadTrick();
      incrementViews();
    }
  }, [id, loadTrick, incrementViews]);

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
        <div className="empty-state">
          <h3>Loading trick...</h3>
        </div>
      </div>
    );
  }

  const country = countries.find(c => c.code === trick.countryCode);

  return (
    <div className="container">
      <header className="page-header">
        <Link href="/" className="back-btn">← Back</Link>
        <h1>Trick Details</h1>
      </header>

      <div className="trick-detail">
        <div className="trick-header">
          <div className="author-info">
            <span className="country-flag">{country?.flag}</span>
            <span className="author-name">{trick.authorName || 'Anonymous'}</span>
          </div>
          <div className="difficulty-badge">
            {trick.difficulty === 'easy' ? '🟢' : 
             trick.difficulty === 'medium' ? '🟡' : '🔴'}
            {trick.difficulty}
          </div>
        </div>

        <h2 className="trick-title">{trick.title}</h2>
        <p className="trick-description">{trick.description}</p>

        <div className="trick-steps">
          <h3>Steps:</h3>
          <ol>
            {trick.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="trick-tags">
          {trick.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>

        <div className="trick-actions">
          <button onClick={handleKudos} className="action-btn kudos">
            👍 {trick.kudos}
          </button>
          <span className="action-btn">💬 {trick.comments}</span>
          <span className="action-btn">👁️ {trick.views}</span>
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
