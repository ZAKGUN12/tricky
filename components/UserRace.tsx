import { mockTricks, countries } from '../lib/mockData';

export default function UserRace() {
  const getUserStats = () => {
    const users = [
      { id: '1', name: 'Sarah Chen', countryCode: 'US' },
      { id: '2', name: 'Hiroshi Tanaka', countryCode: 'JP' },
      { id: '3', name: 'Marco Rossi', countryCode: 'IT' },
      { id: '4', name: 'Emma Schmidt', countryCode: 'DE' },
      { id: '5', name: 'Lucas Silva', countryCode: 'BR' },
      { id: '6', name: 'Priya Sharma', countryCode: 'IN' },
      { id: '7', name: 'Alex Johnson', countryCode: 'CA' },
      { id: '8', name: 'Marie Dubois', countryCode: 'FR' }
    ];

    return users.map(user => {
      const userTricks = mockTricks.filter(() => Math.random() > 0.6);
      const totalKudos = userTricks.reduce((sum, trick) => sum + Math.floor(trick.kudos * Math.random()), 0);
      const score = userTricks.length * 50 + totalKudos;
      
      return {
        ...user,
        tricksCount: userTricks.length,
        totalKudos,
        score
      };
    }).sort((a, b) => b.score - a.score).slice(0, 6);
  };

  const userStats = getUserStats();
  const maxScore = userStats[0]?.score || 1;

  return (
    <div className="user-race">
      <div className="race-header">
        <h3>🏆 Top Contributors</h3>
      </div>
      
      <div className="race-list">
        {userStats.map((user, index) => {
          const percentage = (user.score / maxScore) * 100;
          const country = countries.find(c => c.code === user.countryCode);
          
          return (
            <div key={user.id} className="user-item">
              <div className="user-info">
                <span className="rank">#{index + 1}</span>
                <span className="flag">{country?.flag}</span>
                <span className="name">{user.name}</span>
              </div>
              
              <div className="progress">
                <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
              </div>
              
              <div className="stats">
                <span className="score">{user.score}</span>
                <span className="tricks">{user.tricksCount} tricks</span>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .user-race {
          background: white;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 25px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }
        
        .race-header h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 16px;
        }
        
        .race-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .user-item {
          display: grid;
          grid-template-columns: 1fr 120px 80px;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .rank {
          font-weight: 600;
          color: #667eea;
          min-width: 20px;
          font-size: 0.9rem;
        }
        
        .flag {
          font-size: 1.1rem;
        }
        
        .name {
          font-weight: 500;
          color: var(--text-primary);
          font-size: 0.9rem;
        }
        
        .progress {
          background: #f1f5f9;
          border-radius: 6px;
          height: 6px;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          background: var(--primary-gradient);
          border-radius: 6px;
          transition: width 1s ease-out;
        }
        
        .stats {
          text-align: right;
          font-size: 0.8rem;
        }
        
        .score {
          font-weight: 600;
          color: #667eea;
          display: block;
        }
        
        .tricks {
          color: var(--text-muted);
        }
        
        @media (max-width: 768px) {
          .user-item {
            grid-template-columns: 1fr 60px;
            gap: 8px;
          }
          
          .progress {
            grid-column: 1 / -1;
            margin-top: 4px;
          }
          
          .stats {
            grid-column: 2;
            grid-row: 1;
          }
        }
      `}</style>
    </div>
  );
}
