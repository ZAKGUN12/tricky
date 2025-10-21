import { useState, useEffect } from 'react';
import Link from 'next/link';
import { countries } from '../lib/mockData';

interface Trick {
  id: string;
  title: string;
  description: string;
  kudos: number;
  countryCode: string;
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
        setTopTricks(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching top tricks:', error);
      setTopTricks([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="top-tricks-container">
        <div className="top-tricks-header">
          <div className="header-icon">🏆</div>
          <h3>Top Tricks</h3>
        </div>
        <div className="loading">Loading top tricks...</div>
        
        <style jsx>{`
          .top-tricks-container {
            background: linear-gradient(145deg, rgba(15, 15, 35, 0.95), rgba(25, 25, 45, 0.9));
            backdrop-filter: blur(20px);
            border-radius: 16px;
            border: 1px solid rgba(255, 119, 198, 0.2);
            overflow: hidden;
          }

          .top-tricks-header {
            background: linear-gradient(135deg, rgba(255, 119, 198, 0.3), rgba(255, 77, 198, 0.2));
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            border-bottom: 1px solid rgba(255, 119, 198, 0.2);
          }

          .header-icon {
            font-size: 1.2rem;
            filter: drop-shadow(0 0 8px rgba(255, 119, 198, 0.6));
          }

          .top-tricks-header h3 {
            color: #ffffff;
            font-size: 0.95rem;
            font-weight: 600;
            margin: 0;
            text-shadow: 0 0 10px rgba(255, 119, 198, 0.4);
          }

          .loading {
            padding: 2rem;
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.85rem;
          }
        `}</style>
      </div>
    );
  }

  const displayTricks = (topTricks || []).slice(0, 3);

  return (
    <div className="top-tricks-container">
      <div className="top-tricks-header">
        <div className="header-icon">🏆</div>
        <h3>Top Tricks</h3>
        <div className="badge">Top {displayTricks.length}</div>
      </div>
      
      <div className="tricks-list">
        {displayTricks.length > 0 ? displayTricks.map((trick, index) => {
          const country = countries.find(c => c.code === trick.countryCode);
          return (
            <Link key={trick.id} href={`/trick/${trick.id}`} className="trick-link">
              <div className="trick-item">
                <div className="rank-badge">
                  <span className="rank-number">#{index + 1}</span>
                  <div className="medal">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                </div>
                
                <div className="trick-content">
                  <div className="trick-meta">
                    <span className="country-flag">{country?.flag}</span>
                    <span className="kudos">⭐ {trick.kudos}</span>
                  </div>
                  <h4 className="trick-title">{trick.title}</h4>
                  <p className="trick-preview">{(trick.description || '').slice(0, 60)}...</p>
                </div>
              </div>
            </Link>
          );
        }) : (
          <div className="no-tricks">
            <span>🎯</span>
            <p>No top tricks yet</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .top-tricks-container {
          background: white;
          border-radius: 0;
          border: none;
          overflow: hidden;
        }

        .top-tricks-header {
          background: linear-gradient(135deg, rgba(255, 119, 198, 0.1), rgba(255, 77, 198, 0.05));
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .header-icon {
          font-size: 1.2rem;
          filter: none;
        }

        .top-tricks-header h3 {
          color: #333;
          font-size: 0.95rem;
          font-weight: 600;
          margin: 0;
          flex: 1;
          text-shadow: none;
        }

        .badge {
          background: rgba(255, 119, 198, 0.1);
          color: #ff77c6;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          border: 1px solid rgba(255, 119, 198, 0.2);
        }

        .tricks-list {
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .trick-link {
          text-decoration: none;
          color: inherit;
        }

        .trick-item {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .trick-item:hover {
          background: rgba(255, 119, 198, 0.15);
          border-color: rgba(255, 119, 198, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(255, 119, 198, 0.2);
        }

        .rank-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          min-width: 40px;
        }

        .rank-number {
          font-size: 0.7rem;
          font-weight: 700;
          color: rgba(255, 119, 198, 0.9);
          background: rgba(255, 119, 198, 0.2);
          padding: 0.2rem 0.4rem;
          border-radius: 6px;
          border: 1px solid rgba(255, 119, 198, 0.3);
        }

        .medal {
          font-size: 1.2rem;
          filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.5));
        }

        .trick-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .trick-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
        }

        .country-flag {
          font-size: 0.9rem;
        }

        .kudos {
          color: rgba(255, 215, 0, 0.9);
          font-weight: 600;
        }

        .trick-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .trick-preview {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .no-tricks {
          text-align: center;
          padding: 2rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .no-tricks span {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .no-tricks p {
          margin: 0;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
}
