import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Trick } from '../../lib/types';
import { mockTricks, countries } from '../../lib/mockData';

export default function TrickDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [trick, setTrick] = useState<Trick | null>(null);
  const [userRating, setUserRating] = useState<number>(0);

  useEffect(() => {
    if (id) {
      const foundTrick = mockTricks.find(t => t.id === id);
      setTrick(foundTrick || null);
    }
  }, [id]);

  const handleKudos = () => {
    if (trick) {
      setTrick(prev => prev ? { ...prev, kudos: prev.kudos + 1 } : null);
    }
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
  };

  if (!trick) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Trick not found</h3>
          <p>The trick you are looking for does not exist.</p>
          <Link href="/" className="back-btn">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const country = countries.find(c => c.code === trick.countryCode);

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link href="/">Home</Link> → <span>{trick.title}</span>
      </div>

      <article className="trick-detail">
        <header className="trick-header">
          <div className="author-section">
            <div className="author-info">
              <span className="country-flag">{country?.flag}</span>
              <div className="author-details">
                <span className="author-name">{trick.authorName || 'Anonymous'}</span>
                <span className="country-name">{country?.name}</span>
              </div>
            </div>
            <div className="trick-meta">
              <span className="difficulty-badge">
                {trick.difficulty === 'easy' ? '🟢 Easy' : 
                 trick.difficulty === 'medium' ? '🟡 Medium' : '🔴 Hard'}
              </span>
              <span className="time-estimate">{trick.timeEstimate}</span>
            </div>
          </div>
          <h1>{trick.title}</h1>
          <p className="description">{trick.description}</p>
        </header>

        <div className="trick-content">
          <div className="steps">
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
        </div>

        <div className="trick-actions">
          <button onClick={handleKudos} className="kudos-btn">
            👍 {trick.kudos} Kudos
          </button>
          
          <div className="rating">
            <span>Rate this trick: </span>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                className={`star ${star <= userRating ? 'active' : ''}`}
                onClick={() => handleRating(star)}
              >
                ⭐
              </button>
            ))}
            {userRating > 0 && (
              <span className="rating-text">You rated this {userRating} star{userRating !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      </article>

      <style jsx>{`
        .breadcrumb {
          margin-bottom: var(--space-lg);
          color: var(--text-muted);
          font-size: var(--text-sm);
        }
        
        .breadcrumb a {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .breadcrumb a:hover {
          color: #764ba2;
          text-shadow: 0 0 8px rgba(102, 126, 234, 0.3);
        }
        
        .trick-detail {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          box-shadow: var(--glass-shadow);
          border: 1px solid var(--glass-border);
          position: relative;
          overflow: hidden;
        }
        
        .trick-detail::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        
        .trick-header {
          margin-bottom: 30px;
        }
        
        .trick-meta {
          display: flex;
          gap: 15px;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .country-flag {
          font-size: 1.5rem;
        }
        
        .difficulty-badge {
          font-size: 1.1rem;
        }
        
        .trick-detail h1 {
          font-size: 2rem;
          color: #2c3e50;
          margin-bottom: 15px;
        }
        
        .description {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.6;
        }
        
        .steps {
          margin-bottom: 25px;
        }
        
        .steps h3 {
          margin-bottom: 15px;
          color: #2c3e50;
        }
        
        .steps ol {
          padding-left: 20px;
        }
        
        .steps li {
          margin-bottom: 10px;
          line-height: 1.5;
        }
        
        .trick-tags {
          display: flex;
          gap: 8px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }
        
        .tag {
          background: #e3f2fd;
          color: #1976d2;
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 0.9rem;
        }
        
        .trick-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 1px solid #eee;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .kudos-btn {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.2s;
        }
        
        .kudos-btn:hover {
          background: #e9ecef;
        }
        
        .rating {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .star {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          opacity: 0.3;
          transition: opacity 0.2s;
        }
        
        .star.active {
          opacity: 1;
        }
        
        .rating-text {
          font-size: 0.9rem;
          color: #666;
          margin-left: 10px;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }
        
        .back-btn {
          color: #3498db;
          text-decoration: none;
          margin-top: 20px;
          display: inline-block;
        }
        
        @media (max-width: 768px) {
          .trick-detail {
            padding: 20px;
          }
          
          .trick-detail h1 {
            font-size: 1.5rem;
          }
          
          .trick-actions {
            flex-direction: column;
            align-items: stretch;
          }
          
          .rating {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
