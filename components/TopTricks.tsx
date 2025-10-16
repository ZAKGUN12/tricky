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
      console.log('Fetching top tricks...');
      const response = await fetch('/api/tricks/top');
      console.log('API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Top tricks data received:', data);
        setTopTricks(Array.isArray(data) ? data : []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error:', response.status, errorData);
        setTopTricks([]);
      }
    } catch (error) {
      console.error('Network error fetching top tricks:', error);
      setTopTricks([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="top-tricks-wrapper">
        <div className="header">
          <h3>🏆 Top Tricks</h3>
        </div>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const displayTricks = topTricks.slice(0, 3);

  return (
    <div className="top-tricks-wrapper">
      <div className="header">
        <h3>🏆 Top Tricks</h3>
        <span className="count">Top {displayTricks.length}</span>
      </div>
      
      <div className="tricks-list">
        {displayTricks.length > 0 ? displayTricks.map((trick, index) => {
          const country = countries.find(c => c.code === trick.countryCode);
          return (
            <Link key={trick.id} href={`/trick/${trick.id}`} className="trick-link">
              <div className="trick-item">
                <div className="rank">
                  <span className="rank-number">#{index + 1}</span>
                  {index < 3 && (
                    <span className="medal">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                  )}
                </div>
                
                <div className="trick-content">
                  <div className="trick-title">{trick.title}</div>
                  <div className="trick-meta">
                    <span className="country">{country?.flag}</span>
                    <span className="stats">👍 {trick.kudos}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        }) : (
          <div className="no-data">No tricks available</div>
        )}
      </div>

      <style jsx>{`
        .top-tricks-wrapper {
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(20px);
          border-radius: var(--radius-lg);
          padding: 1rem;
          border: 1px solid rgba(255, 119, 198, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          margin-bottom: 1rem;
          animation: sidebarPulse 7s ease-in-out infinite;
        }

        @keyframes sidebarPulse {
          0%, 100% { border-color: rgba(255, 119, 198, 0.3); }
          50% { border-color: rgba(255, 119, 198, 0.5); }
        }

        .header {
          background: rgba(255, 119, 198, 0.2);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 119, 198, 0.3);
          border-radius: var(--radius-md);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          padding: 0.75rem 1rem;
        }

        .header h3 {
          color: #ff77c6;
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0;
          text-shadow: 0 0 10px rgba(255, 119, 198, 0.5);
        }

        .count {
          background: rgba(120, 219, 255, 0.2);
          color: #78dbff;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          font-size: 0.65rem;
          font-weight: 600;
          border: 1px solid rgba(120, 219, 255, 0.3);
        }
          color: rgba(139, 69, 19, 0.8);
          font-weight: 600;
        }

        .loading, .no-data {
          padding: 20px;
          text-align: center;
          color: rgba(139, 69, 19, 0.7);
          font-size: 0.75rem;
        }

        .tricks-list {
          display: flex !important;
          flex-direction: column !important;
          gap: 0 !important;
        }

        .trick-link {
          text-decoration: none !important;
          color: inherit !important;
        }

        .trick-item {
          display: flex !important;
          align-items: center !important;
          gap: 0.6rem !important;
          padding: 0.8rem !important;
          transition: all 0.2s ease !important;
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-bottom: none !important;
          border-radius: 0 !important;
        }

        .tricks-list .trick-item:first-child {
          border-top-left-radius: var(--radius-md) !important;
          border-top-right-radius: var(--radius-md) !important;
        }

        .tricks-list .trick-item:last-child {
          border-bottom-left-radius: var(--radius-md) !important;
          border-bottom-right-radius: var(--radius-md) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        .trick-item:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(2px);
        }

        .rank {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          flex-shrink: 0;
        }

        .rank-number {
          font-size: 0.6rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .medal {
          position: absolute;
          top: -3px;
          right: -3px;
          font-size: 0.7rem;
        }

        .trick-content {
          flex: 1;
          min-width: 0;
        }

        .trick-title {
          font-size: 0.7rem;
          font-weight: 500;
          color: white;
          margin-bottom: 0.2rem;
          line-height: 1.2;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .trick-meta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .country {
          font-size: 0.8rem;
        }

        .stats {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .header {
            padding: 10px 12px;
          }

          .header h3 {
            font-size: 0.75rem;
          }

          .count {
            font-size: 0.625rem;
          }

          .tricks-list {
            padding: 6px;
          }

          .trick-item {
            padding: 6px;
            gap: 8px;
          }

          .rank {
            width: 24px;
            height: 24px;
          }

          .rank-number {
            font-size: 0.5rem;
          }

          .medal {
            font-size: 0.625rem;
            top: -3px;
            right: -3px;
          }

          .trick-title {
            font-size: 0.625rem;
          }
        }
      `}</style>
    </div>
  );
}
