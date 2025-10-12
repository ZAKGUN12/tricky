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

  const displayTricks = topTricks.slice(0, 5);

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
          background: linear-gradient(135deg, #5a67d8 0%, #667eea 100%);
          border-radius: var(--radius-lg);
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          margin-bottom: 1rem;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header h3 {
          color: white;
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .count {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          font-size: 0.65rem;
          font-weight: 600;
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
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .trick-link {
          text-decoration: none;
          color: inherit;
        }

        .trick-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem;
          border-radius: 6px;
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.1);
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
