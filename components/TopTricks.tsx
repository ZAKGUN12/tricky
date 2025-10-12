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
        <div className="tricks-header">
          <h2 className="tricks-title">🏆 Top Tricks</h2>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span>Loading top tricks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="top-tricks-wrapper">
      <div className="tricks-header">
        <div className="header-content">
          <h2 className="tricks-title">🏆 Top Tricks</h2>
          <p className="tricks-subtitle">Most appreciated by community</p>
        </div>
        <div className="tricks-badge">
          <span className="badge-number">TOP</span>
          <span className="badge-label">10</span>
        </div>
      </div>
      
      <div className="tricks-container">
        {topTricks.slice(0, 10).map((trick, index) => {
          const country = countries.find(c => c.code === trick.countryCode);
          const isTopThree = index < 3;
          const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
          
          return (
            <Link key={trick.id} href={`/trick/${trick.id}`} className="trick-link">
              <div 
                className={`trick-item ${isTopThree ? 'top-three' : ''}`}
                style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
              >
                <div className="rank-section">
                  <div className={`rank-badge rank-${index + 1}`}>
                    <span className="rank-number">#{index + 1}</span>
                    {medal && <span className="medal">{medal}</span>}
                  </div>
                  {isTopThree && <div className="crown-glow"></div>}
                </div>
                
                <div className="trick-content">
                  <div className="trick-header">
                    <h3 className="trick-title">{trick.title}</h3>
                    <div className="country-info">
                      <span className="country-flag">{country?.flag}</span>
                      <span className="author-name">{trick.authorName || 'Anonymous'}</span>
                    </div>
                  </div>
                  
                  <div className="trick-stats">
                    <div className="stat-item kudos">
                      <span className="stat-icon">👍</span>
                      <span className="stat-value">{trick.kudos}</span>
                      <span className="stat-label">kudos</span>
                    </div>
                    <div className="stat-item views">
                      <span className="stat-icon">👁️</span>
                      <span className="stat-value">{trick.views}</span>
                      <span className="stat-label">views</span>
                    </div>
                  </div>
                </div>
                
                <div className="trick-arrow">→</div>
              </div>
            </Link>
          );
        })}
      </div>

      <style jsx>{`
        .top-tricks-wrapper {
          background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(255, 215, 0, 0.3);
        }

        .top-tricks-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 179, 71, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 215, 0, 0.2) 0%, transparent 50%);
          pointer-events: none;
        }

        .tricks-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          position: relative;
          z-index: 2;
        }

        .header-content {
          flex: 1;
        }

        .tricks-title {
          font-size: 2rem;
          font-weight: 800;
          color: #8b4513;
          margin: 0 0 8px 0;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          letter-spacing: -0.02em;
        }

        .tricks-subtitle {
          font-size: 1.125rem;
          color: rgba(139, 69, 19, 0.8);
          margin: 0;
          font-weight: 600;
        }

        .tricks-badge {
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-radius: 16px;
          padding: 16px 24px;
          text-align: center;
          min-width: 100px;
        }

        .badge-number {
          display: block;
          font-size: 1.5rem;
          font-weight: 800;
          color: #8b4513;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .badge-label {
          display: block;
          font-size: 2rem;
          color: #8b4513;
          font-weight: 800;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .loading-state {
          padding: 64px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          color: rgba(139, 69, 19, 0.8);
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(139, 69, 19, 0.3);
          border-top: 3px solid #8b4513;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .tricks-container {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .trick-link {
          text-decoration: none;
          color: inherit;
        }

        .trick-item {
          display: flex;
          align-items: center;
          gap: 20px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          animation: slideIn 0.6s ease-out var(--delay) both;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .trick-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.8s ease;
        }

        .trick-item:hover::before {
          left: 100%;
        }

        .trick-item:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-4px) translateX(8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
        }

        .trick-item.top-three {
          background: rgba(255, 255, 255, 0.4);
          border-color: rgba(255, 255, 255, 0.6);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .trick-item.top-three:hover {
          background: rgba(255, 255, 255, 0.5);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.25);
        }

        .rank-section {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .rank-badge {
          position: relative;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.875rem;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .rank-1 {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          border: 3px solid #fff;
        }

        .rank-2 {
          background: linear-gradient(135deg, #c0c0c0, #e5e5e5);
          border: 3px solid #fff;
        }

        .rank-3 {
          background: linear-gradient(135deg, #cd7f32, #daa520);
          border: 3px solid #fff;
        }

        .rank-badge:not(.rank-1):not(.rank-2):not(.rank-3) {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .rank-number {
          position: relative;
          z-index: 2;
        }

        .medal {
          position: absolute;
          top: -8px;
          right: -8px;
          font-size: 1.5rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .crown-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          animation: glow 2s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.8;
          }
        }

        .trick-content {
          flex: 1;
          min-width: 0;
        }

        .trick-header {
          margin-bottom: 12px;
        }

        .trick-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #8b4513;
          margin: 0 0 8px 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .country-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .country-flag {
          font-size: 1.25rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        .author-name {
          font-size: 0.875rem;
          color: rgba(139, 69, 19, 0.7);
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 120px;
        }

        .trick-stats {
          display: flex;
          gap: 20px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .stat-icon {
          font-size: 1rem;
          opacity: 0.8;
        }

        .stat-value {
          font-size: 0.875rem;
          font-weight: 700;
          color: #8b4513;
        }

        .stat-label {
          font-size: 0.75rem;
          color: rgba(139, 69, 19, 0.6);
          font-weight: 500;
        }

        .trick-arrow {
          font-size: 1.5rem;
          font-weight: 700;
          color: #8b4513;
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }

        .trick-item:hover .trick-arrow {
          transform: translateX(4px);
        }

        @media (max-width: 1024px) {
          .top-tricks-wrapper {
            padding: 24px;
            margin-bottom: 24px;
          }

          .tricks-title {
            font-size: 1.75rem;
          }

          .tricks-subtitle {
            font-size: 1rem;
          }

          .trick-item {
            padding: 16px;
            gap: 16px;
          }

          .rank-badge {
            width: 48px;
            height: 48px;
            font-size: 0.75rem;
          }

          .medal {
            font-size: 1.25rem;
            top: -6px;
            right: -6px;
          }
        }

        @media (max-width: 768px) {
          .top-tricks-wrapper {
            padding: 20px;
            margin-bottom: 20px;
          }

          .tricks-header {
            flex-direction: column;
            gap: 16px;
            text-align: center;
            margin-bottom: 24px;
          }

          .tricks-title {
            font-size: 1.5rem;
          }

          .tricks-subtitle {
            font-size: 0.875rem;
          }

          .tricks-badge {
            align-self: center;
            min-width: 80px;
            padding: 12px 20px;
          }

          .badge-number {
            font-size: 1.25rem;
          }

          .badge-label {
            font-size: 1.5rem;
          }

          .trick-item {
            padding: 12px;
            gap: 12px;
          }

          .rank-badge {
            width: 40px;
            height: 40px;
            font-size: 0.625rem;
          }

          .medal {
            font-size: 1rem;
            top: -4px;
            right: -4px;
          }

          .trick-title {
            font-size: 1rem;
          }

          .author-name {
            max-width: 80px;
          }

          .trick-stats {
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
