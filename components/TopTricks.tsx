import { useState, useEffect } from 'react';
import Link from 'next/link';
import { countries } from '../lib/mockData';

interface Trick {
  id: string;
  title: string;
  countryCode: string;
  kudos: number;
  views: number;
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
      <div className="card">
        <div className="loading">Loading top tricks...</div>
        <style jsx>{`
          .loading {
            padding: 2rem 1rem;
            text-align: center;
            color: #6b7280;
            font-size: 0.875rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="header">
        <h3>Top Contributors</h3>
      </div>
      
      <div className="list">
        {topTricks.slice(0, 5).map((trick, index) => {
          const country = countries.find(c => c.code === trick.countryCode);
          return (
            <Link key={trick.id} href={`/trick/${trick.id}`}>
              <div className="item">
                <div className={`rank ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : 'default'}`}>
                  {index + 1}
                </div>
                <div className="content">
                  <p className="title">{trick.title}</p>
                  <p className="meta">
                    {country?.flag} {trick.kudos} kudos • {trick.views} views
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      <style jsx>{`
        .header {
          padding: 0.75rem 1rem;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .header h3 {
          margin: 0;
          font-size: 0.75rem;
          font-weight: 700;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .list {
          padding: 0.25rem 0;
        }
        
        .item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          transition: background-color 0.2s ease;
          border-bottom: 1px solid #f3f4f6;
          text-decoration: none;
          color: inherit;
        }
        
        .item:last-child {
          border-bottom: none;
        }
        
        .item:hover {
          background: #f9fafb;
        }
        
        .rank {
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
          color: white;
        }
        
        .rank.gold {
          background: #f59e0b;
        }
        
        .rank.silver {
          background: #6b7280;
        }
        
        .rank.bronze {
          background: #d97706;
        }
        
        .rank.default {
          background: #3b82f6;
        }
        
        .content {
          flex: 1;
          min-width: 0;
        }
        
        .title {
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0 0 0.25rem 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #374151;
        }
        
        .meta {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
