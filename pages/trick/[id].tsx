import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Authenticator } from '@aws-amplify/ui-react';
import { useAuth } from '../../components/AuthProvider';
import Comments from '../../components/Comments';
import { apiClient } from '../../lib/api-client';
import { countries } from '../../lib/mockData';

interface Trick {
  id: string;
  title: string;
  description: string;
  steps: string[];
  country: string;
  countryCode: string;
  difficulty: string;
  tags: string[];
  authorName: string;
  authorEmail: string;
  kudos: number;
  views: number;
  comments: number;
  createdAt: string;
}

export default function TrickDetail() {
  return (
    <Authenticator>
      <TrickDetailContent />
    </Authenticator>
  );
}

function TrickDetailContent() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [trick, setTrick] = useState<Trick | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasKudos, setHasKudos] = useState(false);
  const [kudosLoading, setKudosLoading] = useState(false);

  const loadTrick = useCallback(async () => {
    const response = await apiClient.getTrick(id as string);
    if (response.data) {
      setTrick(response.data as Trick);
    }
    setLoading(false);
  }, [id]);

  const incrementView = useCallback(async () => {
    if (user?.signInDetails?.loginId) {
      await apiClient.incrementView(id as string, user.signInDetails.loginId);
    }
  }, [id, user?.signInDetails?.loginId]);

  const checkUserKudos = useCallback(async () => {
    if (!user?.signInDetails?.loginId) return;
    
    const response = await apiClient.getUserKudos(user.signInDetails.loginId);
    if (response.data) {
      setHasKudos((response.data as any[]).some((k: any) => k.trickId === id));
    }
  }, [id, user?.signInDetails?.loginId]);

  useEffect(() => {
    if (id) {
      loadTrick();
      incrementView();
      if (user) {
        checkUserKudos();
      }
    }
  }, [id, user, loadTrick, incrementView, checkUserKudos]);

  const handleKudos = async () => {
    if (!user || !trick) return;
    
    setKudosLoading(true);
    const userEmail = user.signInDetails?.loginId || '';
    
    try {
      if (hasKudos) {
        const response = await apiClient.removeKudos(trick.id, userEmail);
        if (!response.error) {
          setHasKudos(false);
          setTrick(prev => prev ? { ...prev, kudos: prev.kudos - 1 } : null);
        }
      } else {
        const response = await apiClient.giveKudos(trick.id, userEmail);
        if (!response.error) {
          setHasKudos(true);
          setTrick(prev => prev ? { ...prev, kudos: prev.kudos + 1 } : null);
        }
      }
    } catch (error) {
      console.error('Kudos error:', error);
    } finally {
      setKudosLoading(false);
    }
  };

  const handleCommentCountChange = (count: number) => {
    setTrick(prev => prev ? { ...prev, comments: count } : null);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading trick...</p>
        </div>
      </div>
    );
  }

  if (!trick) {
    return (
      <div className="container">
        <div className="error">
          <h2>Trick not found</h2>
          <Link href="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const country = countries.find(c => c.code === trick.countryCode);

  return (
    <div className="container">
      <header className="page-header">
        <Link href="/" className="back-link">
          ← Back to Tricks
        </Link>
      </header>

      <article className="trick-detail">
        <div className="trick-header">
          <div className="author-info">
            <span className="country-flag">{country?.flag}</span>
            <div className="author-details">
              <h3 className="author-name">{trick.authorName}</h3>
              <p className="country-name">{country?.name}</p>
            </div>
          </div>
          <div className="difficulty-badge">
            <span className={`badge ${trick.difficulty}`}>
              {trick.difficulty === 'easy' ? '🟢 Easy' : 
               trick.difficulty === 'medium' ? '🟡 Medium' : '🔴 Hard'}
            </span>
          </div>
        </div>

        <h1 className="trick-title">{trick.title}</h1>
        <p className="trick-description">{trick.description}</p>

        {trick.steps && trick.steps.length > 0 && (
          <div className="steps-section">
            <h3>Steps:</h3>
            <ol className="steps-list">
              {trick.steps.map((step, index) => (
                <li key={index} className="step">{step}</li>
              ))}
            </ol>
          </div>
        )}

        {trick.tags && trick.tags.length > 0 && (
          <div className="tags-section">
            {trick.tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}

        <div className="actions-section">
          <button
            onClick={handleKudos}
            disabled={kudosLoading || !user}
            className={`action-btn kudos ${hasKudos ? 'active' : ''}`}
          >
            {kudosLoading ? '⏳' : hasKudos ? '❤️' : '👍'} {trick.kudos}
          </button>
          <span className="stat">💬 {trick.comments} comments</span>
          <span className="stat">👁️ {trick.views} views</span>
          <span className="stat">📅 {new Date(trick.createdAt).toLocaleDateString()}</span>
        </div>
      </article>

      <Comments trickId={trick.id} onCommentCountChange={handleCommentCountChange} />

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background: white;
          min-height: 100vh;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .back-link {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
        }

        .back-link:hover {
          text-decoration: underline;
        }

        .trick-detail {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .trick-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .country-flag {
          font-size: 2rem;
        }

        .author-name {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
        }

        .country-name {
          margin: 0;
          font-size: 0.9rem;
          color: #64748b;
        }

        .badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .badge.easy {
          background: #dcfce7;
          color: #166534;
        }

        .badge.medium {
          background: #fef3c7;
          color: #92400e;
        }

        .badge.hard {
          background: #fee2e2;
          color: #991b1b;
        }

        .trick-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .trick-description {
          font-size: 1.1rem;
          color: #374151;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .steps-section {
          margin-bottom: 2rem;
        }

        .steps-section h3 {
          margin-bottom: 1rem;
          color: #1e293b;
        }

        .steps-list {
          padding-left: 1.5rem;
        }

        .step {
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }

        .tags-section {
          margin-bottom: 2rem;
        }

        .tag {
          display: inline-block;
          background: #dbeafe;
          color: #1e40af;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          margin-right: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .actions-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .action-btn {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .action-btn:hover:not(:disabled) {
          background: #e2e8f0;
        }

        .action-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .stat {
          color: #64748b;
          font-size: 0.9rem;
        }

        .loading, .error {
          text-align: center;
          padding: 4rem 2rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .trick-detail {
            padding: 1.5rem;
          }

          .trick-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .actions-section {
            flex-wrap: wrap;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
