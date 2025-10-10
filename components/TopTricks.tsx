import { useState, useEffect } from 'react';
import Link from 'next/link';
import { countries } from '../lib/mockData';

interface Trick {
  id: string;
  title: string;
  kudos: number;
  views: number;
  comments: number;
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
        setTopTricks(data);
      } else {
        console.error('Failed to fetch top tricks');
      }
    } catch (error) {
      console.error('Error fetching top tricks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="top-tricks">
      <div className="section-header">
        <h3>🔥 Top 3 Tricks</h3>
        <div className="header-line"></div>
      </div>
      
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <span>Loading top tricks...</span>
        </div>
      ) : topTricks.length === 0 ? (
        <div className="empty-state">
          <span>No tricks found</span>
        </div>
      ) : (
        <div className="top-list">
          {topTricks.slice(0, 3).map((trick, index) => {
            const country = countries.find(c => c.code === trick.countryCode);
            return (
              <Link key={trick.id} href={`/trick/${trick.id}`} className="top-item top-three">
                <div className="item-frame">
                  <div className="rank-badge">
                    <span className="rank-number">#{index + 1}</span>
                    <span className="crown">{index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}</span>
                  </div>
                  
                  <div className="trick-info">
                    <div className="trick-header">
                      <span className="flag">{country?.flag || '🌍'}</span>
                      <span className="country-name">{country?.name || 'Unknown'}</span>
                    </div>
                    
                    <div className="trick-title">{trick.title}</div>
                    
                    <div className="trick-stats">
                      <span className="stat">👍 {trick.kudos || 0}</span>
                      <span className="stat">👁️ {trick.views || 0}</span>
                      <span className="stat">💬 {trick.comments || 0}</span>
                    </div>
                  </div>
                  
                  <div className="trend-indicator">
                    {index < 3 ? '🔥' : index < 6 ? '📈' : '⭐'}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .top-tricks {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          overflow: hidden;
          margin-bottom: 1rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          width: 100%;
        }
        
        .section-header {
          background: #f9fafb;
          padding: 0.875rem 1rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .section-header h3 {
          margin: 0;
          font-size: 0.75rem;
          font-weight: 700;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .top-list {
          padding: 0.25rem 0;
        }
        
        .trick-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          text-decoration: none;
          color: #374151;
          transition: all 0.15s ease-in-out;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .trick-item:last-child {
          border-bottom: none;
        }
        
        .trick-item:hover {
          background: #f9fafb;
        }
        
        .rank-badge {
          background: #3b82f6;
          color: white;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          margin-right: 0.75rem;
          flex-shrink: 0;
        }
        
        .rank-badge.gold {
          background: #f59e0b;
        }
        
        .rank-badge.silver {
          background: #6b7280;
        }
        
        .rank-badge.bronze {
          background: #d97706;
        }
        
        .trick-content {
          flex: 1;
          min-width: 0;
        }
        
        .trick-title {
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0 0 0.25rem 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .trick-meta {
          font-size: 0.75rem;
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .loading, .empty-state {
          padding: 2rem 1rem;
          text-align: center;
          color: #6b7280;
          font-size: 0.875rem;
        }
          background: rgba(255, 255, 255, 0.3);
        }
        
        .loading, .empty-state {
          padding: 40px 20px;
          text-align: center;
          color: #8b98a5;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #38444d;
          border-top: 2px solid #1d9bf0;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .top-list {
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .top-item {
          display: block;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s ease;
        }
        
        .item-frame {
          background: #15202b;
          border: 1px solid #38444d;
          border-radius: 10px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        
        .item-frame::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #1d9bf0, #1a8cd8);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        
        .top-item:hover .item-frame {
          border-color: #1d9bf0;
        }
        
        .top-item:hover .item-frame::before {
          opacity: 1;
        }
        
        .top-three .item-frame {
          background: #192734;
          border-color: #1d9bf0;
        }
        
        .rank-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 35px;
        }
        
        .rank-number {
          font-weight: bold;
          color: #1d9bf0;
          font-size: 0.9rem;
        }
        
        .crown {
          font-size: 0.8rem;
          margin-top: 2px;
        }
        
        .trick-info {
          flex: 1;
          min-width: 0;
        }
        
        .trick-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }
        
        .flag {
          font-size: 1rem;
        }
        
        .country-name {
          font-size: 0.75rem;
          color: #8b98a5;
          font-weight: 500;
        }
        
        .trick-title {
          font-weight: 600;
          font-size: 0.85rem;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 6px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .trick-stats {
          display: flex;
          gap: 8px;
        }
        
        .stat {
          font-size: 0.7rem;
          color: #8b98a5;
          background: rgba(29, 155, 240, 0.1);
          padding: 2px 6px;
          border-radius: 8px;
        }
        
        .trend-indicator {
          font-size: 1.2rem;
          opacity: 0.7;
        }
        
        @media (max-width: 768px) {
          .top-tricks {
            margin-bottom: 0;
            min-height: 160px;
          }
          
          .section-header {
            padding: 6px 8px;
            min-height: 32px;
          }
          
          .section-header h3 {
            font-size: 0.8rem;
            font-weight: 700;
            white-space: nowrap;
          }
          
          .top-list {
            padding: 4px;
            gap: 2px;
          }
          
          .item-frame {
            padding: 4px;
            gap: 4px;
          }
          
          .rank-badge {
            min-width: 20px;
          }
          
          .rank-number {
            font-size: 0.6rem;
          }
          
          .crown {
            font-size: 0.5rem;
          }
          
          .trick-title {
            font-size: 0.65rem;
            -webkit-line-clamp: 1;
          }
          
          .country-name {
            display: none;
          }
          
          .trick-stats {
            gap: 2px;
          }
          
          .stat {
            font-size: 0.55rem;
            padding: 1px 2px;
          }
          
          .trend-indicator {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}
