import { useState, useEffect } from 'react';
import Link from 'next/link';
import { countries } from '../lib/mockData';

interface Trick {
  id: string;
  title: string;
  countryCode: string;
  kudos: number;
  views: number;
  authorName?: string;
}

export default function TopTricks() {
  const [topTricks, setTopTricks] = useState<Trick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopTricks();
  }, []);

  const fetchTopTricks = async () => {
    try {
      const response = await fetch('/api/tricks/top');
      if (response.ok) {
        const data = await response.json();
        setTopTricks(data);
      }
    } catch (error) {
      console.error('Failed to fetch top tricks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="top-tricks-container">
        <div className="section-header">
          <h3 className="section-title">🏆 Top Tricks</h3>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span>Loading top tricks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="top-tricks-container">
      <div className="section-header">
        <h3 className="section-title">🏆 Top Tricks</h3>
        <div className="section-subtitle">Most appreciated by community</div>
      </div>
      
      <div className="tricks-list">
        {topTricks.slice(0, 10).map((trick, index) => {
          const country = countries.find(c => c.code === trick.countryCode);
          return (
            <Link key={trick.id} href={`/trick/${trick.id}`} className="trick-item">
              <div className="rank-badge">
                <span className="rank-number">#{index + 1}</span>
                {index < 3 && (
                  <span className="crown-icon">
                    {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}
                  </span>
                )}
              </div>
              
              <div className="trick-content">
                <h4 className="trick-title">{trick.title}</h4>
                <div className="trick-meta">
                  <span className="country-flag">{country?.flag}</span>
                  <span className="author-name">{trick.authorName || 'Anonymous'}</span>
                </div>
                <div className="trick-stats">
                  <span className="stat-item">
                    <span className="stat-icon">👍</span>
                    <span className="stat-value">{trick.kudos}</span>
                  </span>
                  <span className="stat-item">
                    <span className="stat-icon">👁️</span>
                    <span className="stat-value">{trick.views}</span>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      <style jsx>{`
        .top-tricks-container {
          background: white;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow);
          border: 1px solid var(--gray-200);
        }
        
        .section-header {
          padding: var(--space-6);
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          text-align: center;
          position: relative;
        }
        
        .section-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="stars" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.2)"/></pattern></defs><rect width="100" height="100" fill="url(%23stars)"/></svg>');
          opacity: 0.3;
        }
        
        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 var(--space-1) 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 1;
        }
        
        .section-subtitle {
          font-size: 0.875rem;
          opacity: 0.9;
          font-weight: 500;
          position: relative;
          z-index: 1;
        }
        
        .loading-state {
          padding: var(--space-8);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-4);
          color: var(--gray-500);
        }
        
        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--gray-200);
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .tricks-list {
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        
        .trick-item {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          text-decoration: none;
          color: inherit;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
          position: relative;
          overflow: hidden;
        }
        
        .trick-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.1), transparent);
          transition: left 0.5s ease;
        }
        
        .trick-item:hover::before {
          left: 100%;
        }
        
        .trick-item:hover {
          background: var(--gray-50);
          border-color: var(--primary);
          transform: translateX(4px);
          box-shadow: var(--shadow-md);
        }
        
        .rank-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-1);
          min-width: 48px;
          position: relative;
        }
        
        .rank-number {
          background: linear-gradient(135deg, var(--primary), var(--primary-hover));
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          box-shadow: var(--shadow);
        }
        
        .crown-icon {
          font-size: 1.25rem;
          position: absolute;
          top: -8px;
          right: -8px;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
          animation: bounce 2s ease-in-out infinite;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        
        .trick-content {
          flex: 1;
          min-width: 0;
        }
        
        .trick-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--gray-900);
          margin: 0 0 var(--space-2) 0;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .trick-meta {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-2);
        }
        
        .country-flag {
          font-size: 1rem;
        }
        
        .author-name {
          font-size: 0.75rem;
          color: var(--gray-600);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100px;
        }
        
        .trick-stats {
          display: flex;
          gap: var(--space-3);
        }
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }
        
        .stat-icon {
          font-size: 0.75rem;
          opacity: 0.7;
        }
        
        .stat-value {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--gray-600);
        }
        
        @media (max-width: 1024px) {
          .section-header {
            padding: var(--space-4);
          }
          
          .section-title {
            font-size: 1.125rem;
          }
          
          .tricks-list {
            padding: var(--space-3);
          }
          
          .trick-item {
            padding: var(--space-3);
            gap: var(--space-3);
          }
        }
        
        @media (max-width: 768px) {
          .trick-item {
            gap: var(--space-2);
          }
          
          .rank-badge {
            min-width: 40px;
          }
          
          .rank-number {
            width: 28px;
            height: 28px;
            font-size: 0.625rem;
          }
          
          .crown-icon {
            font-size: 1rem;
            top: -6px;
            right: -6px;
          }
          
          .trick-title {
            font-size: 0.8125rem;
          }
          
          .author-name {
            max-width: 80px;
          }
        }
      `}</style>
    </div>
  );
}
