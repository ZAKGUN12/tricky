import Link from 'next/link';
import { mockTricks, countries } from '../lib/mockData';

export default function TopTricks() {
  const topTricks = mockTricks
    .sort((a, b) => b.kudos - a.kudos)
    .slice(0, 10);

  return (
    <div className="top-tricks">
      <h3>🔥 Top 10 Tricks</h3>
      <div className="top-list">
        {topTricks.map((trick, index) => {
          const country = countries.find(c => c.code === trick.countryCode);
          return (
            <Link key={trick.id} href={`/trick/${trick.id}`} className="top-item">
              <div className="rank">#{index + 1}</div>
              <div className="flag">{country?.flag}</div>
              <div className="content">
                <div className="title">{trick.title}</div>
                <div className="stats">👍 {trick.kudos} • 👁️ {trick.views}</div>
              </div>
            </Link>
          );
        })}
      </div>

      <style jsx>{`
        .top-tricks {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 30px;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .top-tricks h3 {
          margin-bottom: 15px;
          color: #2c3e50;
          font-size: 1.2rem;
        }
        
        .top-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .top-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          border-radius: 8px;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.5);
        }
        
        .top-item:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: translateX(5px);
        }
        
        .rank {
          font-weight: bold;
          color: #667eea;
          min-width: 25px;
          font-size: 0.9rem;
        }
        
        .flag {
          font-size: 1.2rem;
        }
        
        .content {
          flex: 1;
          min-width: 0;
        }
        
        .title {
          font-weight: 600;
          font-size: 0.9rem;
          color: #2c3e50;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .stats {
          font-size: 0.75rem;
          color: #666;
          margin-top: 2px;
        }
        
        @media (max-width: 768px) {
          .top-tricks {
            padding: 15px;
          }
          
          .title {
            white-space: normal;
            line-height: 1.3;
          }
        }
      `}</style>
    </div>
  );
}
