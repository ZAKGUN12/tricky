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
    return <div className="loading">Loading top tricks...</div>;
  }

  // Fallback tricks if API fails
  const fallbackTricks = [
    { id: '1', title: 'Quick Kitchen Cleaning Hack', kudos: 45, countryCode: 'US' },
    { id: '2', title: 'Phone Battery Life Extension', kudos: 38, countryCode: 'GB' },
    { id: '3', title: 'Travel Packing Technique', kudos: 32, countryCode: 'FR' },
  ];

  const displayTricks = topTricks.length > 0 ? topTricks : fallbackTricks;

  return (
    <>
      <div className="top-tricks-list">
        {displayTricks.slice(0, 3).map((trick, index) => {
          const country = countries.find(c => c.code === trick.countryCode);
          return (
            <Link key={trick.id} href={`/trick/${trick.id}`} className="top-trick-item">
              <div className="trick-rank">#{index + 1}</div>
              <div className="trick-info">
                <div className="trick-title">{trick.title}</div>
                <div className="trick-meta">
                  <span className="country-flag">{country?.flag || '🌍'}</span>
                  <span className="kudos">🔥 {trick.kudos}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      <style jsx>{`
        .loading {
          color: rgba(255, 255, 255, 0.8);
          text-align: center;
          padding: 1rem;
          font-size: 0.85rem;
        }
        
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
          border-color: rgba(255, 119, 198, 0.5);
          transform: translateX(4px);
        }
        
        .trick-rank {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff77c6, #ff4da6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.8rem;
          color: #ffffff;
          flex-shrink: 0;
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
    </>
  );
}
