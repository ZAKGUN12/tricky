import { mockTricks, countries } from '../lib/mockData';

export default function UserRace() {
  const getUserStats = () => {
    // Create users based on actual trick authors
    const userMap = new Map();
    
    (mockTricks || []).forEach(trick => {
      const authorName = trick.authorName || 'Anonymous';
      const countryCode = trick.countryCode;
      
      if (!userMap.has(authorName)) {
        userMap.set(authorName, {
          name: authorName,
          countryCode,
          tricks: [],
          totalKudos: 0,
          totalViews: 0
        });
      }
      
      const user = userMap.get(authorName);
      user.tricks.push(trick);
      user.totalKudos += trick.kudos;
      user.totalViews += trick.views;
    });

    // Convert to array and calculate scores
    return Array.from(userMap.values())
      .map(user => ({
        ...user,
        tricksCount: user.tricks.length,
        score: user.tricksCount * 100 + user.totalKudos + Math.floor(user.totalViews / 10)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4); // Show only top 4
  };

  const userStats = getUserStats();

  return (
    <div className="user-race">
      <div className="race-header">
        <h3>🏆 Top Contributors</h3>
      </div>
      
      <div className="contributors-grid">
        {userStats.map((user, index) => {
          const country = countries.find(c => c.code === user.countryCode);
          
          return (
            <div key={user.name} className={`contributor-card rank-${index + 1}`}>
              <div className="rank-badge">#{index + 1}</div>
              <div className="user-avatar">
                <span className="flag">{country?.flag}</span>
              </div>
              <div className="user-details">
                <div className="name">{user.name}</div>
                <div className="stats">
                  <span>{user.tricksCount} tricks</span>
                  <span>{user.totalKudos} kudos</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .user-race {
          background: white;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }
        
        .race-header h3 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
          text-align: center;
        }
        
        .contributors-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        
        .contributor-card {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          border-radius: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .contributor-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .contributor-card.rank-1 {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), #f8fafc);
          border-color: rgba(255, 215, 0, 0.3);
        }
        
        .rank-badge {
          font-size: 0.7rem;
          font-weight: 700;
          color: #667eea;
          min-width: 18px;
        }
        
        .user-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e2e8f0;
        }
        
        .flag {
          font-size: 0.9rem;
        }
        
        .user-details {
          flex: 1;
          min-width: 0;
        }
        
        .name {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .stats {
          display: flex;
          gap: 8px;
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        
        .stats span {
          white-space: nowrap;
        }
        
        @media (max-width: 768px) {
          .contributors-grid {
            grid-template-columns: 1fr;
          }
          
          .contributor-card {
            padding: 6px;
          }
          
          .name {
            font-size: 0.75rem;
          }
          
          .stats {
            font-size: 0.65rem;
          }
        }
      `}</style>
    </div>
  );
}
