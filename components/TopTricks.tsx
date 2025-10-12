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
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header h3 {
          color: white;
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .count {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
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
