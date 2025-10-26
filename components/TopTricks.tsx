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
      <div className="sidebar-section">
        <div className="sidebar-header">
          <div className="header-icon">🏆</div>
          <h3>Top Tricks</h3>
        </div>
        <div className="loading">Loading top tricks...</div>
      </div>
    );
  }

  return (
    <div className="sidebar-section">
      <div className="sidebar-header">
        <div className="header-icon">🏆</div>
        <h3>Top Tricks</h3>
      </div>
      <div className="top-tricks-list">
        {topTricks.slice(0, 3).map((trick, index) => {
          const country = countries.find(c => c.code === trick.countryCode);
          return (
            <Link key={trick.id} href={`/trick/${trick.id}`} className="top-trick-item">
              <div className="trick-rank">#{index + 1}</div>
              <div className="trick-info">
                <div className="trick-title">{trick.title}</div>
                <div className="trick-meta">
                  <span className="country-flag">{country?.flag}</span>
                  <span className="kudos">🔥 {trick.kudos}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      <style jsx>{`
        .top-tricks-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .top-trick-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 119, 198, 0.2);
          border-radius: 8px;
          color: #ffffff;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        
        .top-trick-item:hover {
          background: rgba(255, 119, 198, 0.2);
          border-color: rgba(255, 119, 198, 0.4);
          transform: translateX(4px);
          box-shadow: 0 4px 16px rgba(255, 119, 198, 0.2);
        }
        
        .trick-rank {
          background: linear-gradient(135deg, #ff77c6, #ff4da6);
          color: #ffffff;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(255, 119, 198, 0.4);
        }
        
        .trick-info {
          flex: 1;
          min-width: 0;
        }
        
        .trick-title {
          font-weight: 600;
          font-size: 0.9rem;
          line-height: 1.3;
          margin-bottom: 0.25rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .trick-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .country-flag {
          font-size: 1rem;
        }
        
        .kudos {
          color: #ff77c6;
          font-weight: 600;
        }
        
        .top-trick-item:focus {
          outline: 2px solid #ff77c6;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
