import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Trick } from '../../lib/types';
import { countries } from '../../lib/mockData';
import { useAuth } from '../../components/AuthProvider';
import Comments from '../../components/Comments';

function TrickDetailContent() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [trick, setTrick] = useState<Trick | null>(null);
  const [loading, setLoading] = useState(true);
  const [kudosLoading, setKudosLoading] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const loadTrick = useCallback(async () => {
    if (!id) return;
    
    try {
      const response = await fetch(`/api/tricks/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTrick(data);
        setCommentCount(data.comments || 0);
      }
    } catch (error) {
      console.error('Error loading trick:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const incrementView = useCallback(async () => {
    if (!id) return;
    try {
      await fetch(`/api/tricks/${id}/view`, { method: 'POST' });
    } catch (error) {
      console.error('Error incrementing view:', error);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadTrick();
      incrementView();
    }
  }, [id, loadTrick, incrementView]);

  const handleKudos = async () => {
    if (!trick) return;
    
    if (!user) {
      router.push(`/signin?returnUrl=${encodeURIComponent(router.asPath)}`);
      return;
    }
    
    setKudosLoading(true);
    
    try {
      const response = await fetch(`/api/tricks/${trick.id}/kudos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: user.email })
      });
      
      if (response.ok) {
        setTrick(prev => prev ? { ...prev, kudos: prev.kudos + 1 } : null);
      }
    } catch (error) {
      console.error('Error giving kudos:', error);
    } finally {
      setKudosLoading(false);
    }
  };

  const handleCommentCountChange = (count: number) => {
    setCommentCount(count);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading trick details...</p>
      </div>
    );
  }

  if (!trick) {
    return (
      <div className="error-container">
        <h2>Trick not found</h2>
        <Link href="/" className="back-link">← Back to Home</Link>
      </div>
    );
  }

  const country = countries.find(c => c.code === trick.countryCode);

  return (
    <div className="trick-detail">
      <div className="container">
        <div className="header">
          <Link href="/" className="back-link">← Back to Tricks</Link>
        </div>

        <div className="trick-content">
          <div className="trick-header">
            <div className="country-info">
              <span className="flag">{country?.flag}</span>
              <span className="country-name">{country?.name}</span>
            </div>
            <div className="difficulty">
              <span className={`difficulty-badge ${trick.difficulty}`}>
                {trick.difficulty}
              </span>
            </div>
          </div>

          <h1 className="trick-title">{trick.title}</h1>
          <p className="trick-description">{trick.description}</p>

          <div className="trick-tags">
            {trick.tags?.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>

          <div className="trick-steps">
            <h3>Steps:</h3>
            <ol>
              {trick.steps?.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="trick-meta">
            <div className="author-info">
              <span>Shared by {trick.authorName}</span>
            </div>
            
            <div className="trick-stats">
              <span>👁️ {trick.views} views</span>
              <span>💬 {commentCount} comments</span>
            </div>
          </div>

          <div className="trick-actions">
            <button
              onClick={handleKudos}
              disabled={kudosLoading}
              className="action-btn kudos"
            >
              {kudosLoading ? '...' : `👍 ${trick.kudos}`}
            </button>
          </div>
        </div>

        <Comments 
          trickId={trick.id} 
          onCommentCountChange={handleCommentCountChange}
        />
      </div>

      <style jsx>{`
        .trick-detail {
          min-height: 100vh;
          background: var(--gradient-bg);
          padding: 2rem 0;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .header {
          margin-bottom: 2rem;
        }

        .back-link {
          color: var(--primary-600);
          text-decoration: none;
          font-weight: 500;
        }

        .back-link:hover {
          color: var(--primary-700);
        }

        .trick-content {
          background: var(--surface-glass);
          backdrop-filter: blur(20px);
          border-radius: var(--radius-lg);
          padding: 2rem;
          border: 1px solid var(--border-light);
          margin-bottom: 2rem;
        }

        .trick-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .country-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .flag {
          font-size: 1.5rem;
        }

        .country-name {
          font-weight: 600;
          color: var(--text-secondary);
        }

        .difficulty-badge {
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .difficulty-badge.easy {
          background: var(--success-100);
          color: var(--success-700);
        }

        .difficulty-badge.medium {
          background: var(--warning-100);
          color: var(--warning-700);
        }

        .difficulty-badge.hard {
          background: var(--error-100);
          color: var(--error-700);
        }

        .trick-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .trick-description {
          font-size: 1.1rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .trick-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .tag {
          background: var(--primary-100);
          color: var(--primary-700);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .trick-steps {
          margin-bottom: 2rem;
        }

        .trick-steps h3 {
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .trick-steps ol {
          padding-left: 1.5rem;
        }

        .trick-steps li {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 0.5rem;
        }

        .trick-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-light);
        }

        .author-info {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .trick-stats {
          display: flex;
          gap: 1rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .trick-actions {
          display: flex;
          gap: 1rem;
        }

        .action-btn {
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-md);
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-smooth);
        }

        .action-btn.kudos {
          background: var(--success-100);
          color: var(--success-700);
        }

        .action-btn.kudos:hover:not(:disabled) {
          background: var(--success-200);
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading-container, .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          gap: 1rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-light);
          border-top: 3px solid var(--primary-500);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .trick-meta {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .trick-stats {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default function TrickDetail() {
  return <TrickDetailContent />;
}
