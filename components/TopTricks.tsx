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
      <div className="top-tricks-wrapper">
        <div className="header">
          <h3>🏆 Top Tricks</h3>
        </div>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="top-tricks-wrapper">
      <div className="header">
        <h3>🏆 Top Tricks</h3>
        <span className="count">Top {Math.min(topTricks.length, 5)}</span>
      </div>
      
      <div className="tricks-list">
        {topTricks.slice(0, 5).map((trick, index) => {
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
        })}
      </div>

      <style jsx>{`
        .top-tricks-wrapper {
          background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(255, 215, 0, 0.2);
        }

        .header {
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header h3 {
          margin: 0;
          font-size: 0.875rem;
          font-weight: 700;
          color: #8b4513;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .count {
          font-size: 0.75rem;
          color: rgba(139, 69, 19, 0.8);
          font-weight: 600;
        }

        .loading {
          padding: 20px;
          text-align: center;
          color: rgba(139, 69, 19, 0.7);
          font-size: 0.75rem;
        }

        .tricks-list {
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .trick-link {
          text-decoration: none;
          color: inherit;
        }

        .trick-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.1);
        }

        .trick-item:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(4px);
        }

        .rank {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b4513, #a0522d);
          flex-shrink: 0;
        }

        .rank-number {
          font-size: 0.625rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .medal {
          position: absolute;
          top: -4px;
          right: -4px;
          font-size: 0.75rem;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
        }

        .trick-content {
          flex: 1;
          min-width: 0;
        }

        .trick-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: #8b4513;
          margin-bottom: 4px;
          line-height: 1.2;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .trick-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .country {
          font-size: 0.875rem;
        }

        .stats {
          font-size: 0.625rem;
          color: rgba(139, 69, 19, 0.7);
          font-weight: 600;
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
