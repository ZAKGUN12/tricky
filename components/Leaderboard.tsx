import { useState, useEffect } from 'react';

interface LeaderboardUser {
  rank: number;
  username: string;
  score: number;
  tricksSubmitted: number;
  kudosReceived: number;
}

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="section-header">
          <h3 className="section-title">🏅 Leaderboard</h3>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span>Loading leaderboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="section-header">
        <h3 className="section-title">🏅 Leaderboard</h3>
        <div className="section-subtitle">Top contributors this month</div>
      </div>
      
      <div className="users-list">
        {users.slice(0, 10).map((user, index) => (
          <div key={user.username} className="user-item">
            <div className="rank-badge">
              <span className="rank-number">#{index + 1}</span>
              {index < 3 && (
                <span className="medal-icon">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </span>
              )}
            </div>
            
            <div className="user-content">
              <div className="user-name">
                {user.username}
              </div>
              <div className="user-stats">
                <span className="stat-item">
                  <span className="stat-icon">⭐</span>
                  <span className="stat-value">{user.score}</span>
                </span>
                <span className="stat-item">
                  <span className="stat-icon">📝</span>
                  <span className="stat-value">{user.tricksSubmitted}</span>
                </span>
                <span className="stat-item">
                  <span className="stat-icon">👍</span>
                  <span className="stat-value">{user.kudosReceived}</span>
                </span>
              </div>
            </div>
            
            <div className="score-display">
              {user.score}
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .leaderboard-container {
          background: white;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow);
          border: 1px solid var(--gray-200);
        }
        
        .section-header {
          padding: var(--space-6);
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          text-align: center;
          position: relative;
        }
        
        .section-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="trophy" width="25" height="25" patternUnits="userSpaceOnUse"><text x="12.5" y="18" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.1)">🏆</text></pattern></defs><rect width="100" height="100" fill="url(%23trophy)"/></svg>');
          opacity: 0.3;
        }
        
        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 var(--space-1) 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 1;
        }
        
        .section-subtitle {
          font-size: 0.875rem;
          opacity: 0.9;
          font-weight: 500;
          position: relative;
          z-index: 1;
        }
        
        .loading-state {
          padding: var(--space-8);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-4);
          color: var(--gray-500);
        }
        
        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--gray-200);
          border-top: 3px solid var(--secondary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .users-list {
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        
        .user-item {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
          position: relative;
          overflow: hidden;
        }
        
        .user-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.1), transparent);
          transition: left 0.5s ease;
        }
        
        .user-item:hover::before {
          left: 100%;
        }
        
        .user-item:hover {
          background: var(--gray-50);
          border-color: var(--secondary);
          transform: translateX(4px);
          box-shadow: var(--shadow-md);
        }
        
        .rank-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-1);
          min-width: 48px;
          position: relative;
        }
        
        .rank-number {
          background: linear-gradient(135deg, var(--secondary), var(--secondary-hover));
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          box-shadow: var(--shadow);
        }
        
        .medal-icon {
          font-size: 1.25rem;
          position: absolute;
          top: -8px;
          right: -8px;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        .user-content {
          flex: 1;
          min-width: 0;
        }
        
        .user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--gray-900);
          margin-bottom: var(--space-2);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .user-stats {
          display: flex;
          gap: var(--space-3);
          flex-wrap: wrap;
        }
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }
        
        .stat-icon {
          font-size: 0.75rem;
          opacity: 0.7;
        }
        
        .stat-value {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--gray-600);
        }
        
        .score-display {
          background: linear-gradient(135deg, var(--accent), var(--accent-hover));
          color: white;
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 700;
          box-shadow: var(--shadow);
          min-width: 48px;
          text-align: center;
        }
        
        @media (max-width: 1024px) {
          .section-header {
            padding: var(--space-4);
          }
          
          .section-title {
            font-size: 1.125rem;
          }
          
          .users-list {
            padding: var(--space-3);
          }
          
          .user-item {
            padding: var(--space-3);
            gap: var(--space-3);
          }
        }
        
        @media (max-width: 768px) {
          .user-item {
            gap: var(--space-2);
          }
          
          .rank-badge {
            min-width: 40px;
          }
          
          .rank-number {
            width: 28px;
            height: 28px;
            font-size: 0.625rem;
          }
          
          .medal-icon {
            font-size: 1rem;
            top: -6px;
            right: -6px;
          }
          
          .user-name {
            font-size: 0.8125rem;
          }
          
          .user-stats {
            gap: var(--space-2);
          }
          
          .score-display {
            font-size: 0.75rem;
            padding: var(--space-1) var(--space-2);
            min-width: 40px;
          }
        }
      `}</style>
    </div>
  );
}
