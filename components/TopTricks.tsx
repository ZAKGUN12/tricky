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
        <h3>🔥 Top 10 Tricks</h3>
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
          {topTricks.map((trick, index) => {
            const country = countries.find(c => c.code === trick.countryCode);
            const isTop3 = index < 3;
            return (
              <Link key={trick.id} href={`/trick/${trick.id}`} className={`top-item ${isTop3 ? 'top-three' : ''}`}>
                <div className="item-frame">
                  <div className="rank-badge">
                    <span className="rank-number">#{index + 1}</span>
                    {isTop3 && <span className="crown">{index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}</span>}
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
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          padding: 0;
          margin-bottom: 30px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          border: 1px solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
          min-height: 200px;
        }
        
        .section-header {
          background: linear-gradient(135deg, #667eea, #764ba2);
          padding: 16px 20px;
          color: white;
          position: relative;
        }
        
        .section-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 700;
        }
        
        .header-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255, 255, 255, 0.3);
        }
        
        .loading, .empty-state {
          padding: 40px 20px;
          text-align: center;
          color: #666;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #667eea;
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
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0,0,0,0.08);
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
          background: linear-gradient(90deg, #667eea, #764ba2);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        
        .top-item:hover .item-frame {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
          border-color: rgba(102, 126, 234, 0.2);
        }
        
        .top-item:hover .item-frame::before {
          opacity: 1;
        }
        
        .top-three .item-frame {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 255, 255, 0.9));
          border-color: rgba(255, 215, 0, 0.3);
        }
        
        .rank-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 35px;
        }
        
        .rank-number {
          font-weight: bold;
          color: #667eea;
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
          color: #666;
          font-weight: 500;
        }
        
        .trick-title {
          font-weight: 600;
          font-size: 0.85rem;
          color: #2c3e50;
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
          color: #666;
          background: rgba(0,0,0,0.05);
          padding: 2px 6px;
          border-radius: 8px;
        }
        
        .trend-indicator {
          font-size: 1.2rem;
          opacity: 0.7;
        }
        
        @media (max-width: 768px) {
          .section-header {
            padding: 12px 16px;
          }
          
          .top-list {
            padding: 6px;
          }
          
          .item-frame {
            padding: 10px;
            gap: 10px;
          }
          
          .trick-title {
            font-size: 0.8rem;
          }
          
          .country-name {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
