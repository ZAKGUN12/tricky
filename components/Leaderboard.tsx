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
      console.log('Fetching leaderboard...');
      const response = await fetch('/api/leaderboard');
      console.log('Leaderboard API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Leaderboard data received:', data);
        setUsers(Array.isArray(data) ? data : []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Leaderboard API error:', response.status, errorData);
        setUsers([]);
      }
    } catch (error) {
      console.error('Network error fetching leaderboard:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="leaderboard-wrapper">
        <div className="header">
          <h3>🏅 Leaderboard</h3>
        </div>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const displayUsers = users.slice(0, 5);

  return (
    <div className="leaderboard-wrapper">
      <div className="header">
        <h3>🏅 Leaderboard</h3>
        <span className="count">Top {displayUsers.length}</span>
      </div>
      
      <div className="users-list">
        {displayUsers.length > 0 ? displayUsers.map((user, index) => (
          <div key={user.username} className="user-item">
            <div className="rank">
              <span className="rank-number">#{index + 1}</span>
              {index < 3 && (
                <span className="medal">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </span>
              )}
            </div>
            
            <div className="user-content">
              <div className="user-name">{user.username}</div>
              <div className="user-stats">
                <span className="stat">⭐ {user.score}</span>
                <span className="stat">📝 {user.tricksSubmitted}</span>
              </div>
            </div>
          </div>
        )) : (
          <div className="no-data">No users available</div>
        )}
      </div>

      <style jsx>{`
        .leaderboard-wrapper {
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(20px);
          border-radius: var(--radius-lg);
          padding: 1rem;
          border: 1px solid rgba(120, 219, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          margin-bottom: 1rem;
          animation: sidebarPulse 8s ease-in-out infinite;
        }

        @keyframes sidebarPulse {
          0%, 100% { border-color: rgba(120, 219, 255, 0.3); }
          50% { border-color: rgba(120, 219, 255, 0.5); }
        }

        .header {
          background: rgba(120, 219, 255, 0.2);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(120, 219, 255, 0.3);
          border-radius: var(--radius-md);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          padding: 0.75rem 1rem;
        }

        .header h3 {
          color: #78dbff;
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0;
          text-shadow: 0 0 10px rgba(120, 219, 255, 0.5);
        }

        .count {
          background: rgba(120, 119, 198, 0.2);
          color: #7877c6;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          font-size: 0.65rem;
          font-weight: 600;
          border: 1px solid rgba(120, 119, 198, 0.3);
        }

        .loading, .no-data {
          padding: 1rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.7rem;
        }

        .users-list {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .user-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem;
          border-radius: 6px;
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.1);
        }

        .user-item:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(2px);
        }

        .rank {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          flex-shrink: 0;
        }

        .rank-number {
          font-size: 0.6rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .medal {
          position: absolute;
          top: -3px;
          right: -3px;
          font-size: 0.7rem;
        }

        .user-content {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-size: 0.7rem;
          font-weight: 500;
          color: white;
          margin-bottom: 0.2rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-stats {
          display: flex;
          gap: 0.4rem;
        }

        .stat {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .header {
            padding: 10px 12px;
          }

          .header h3 {
            font-size: 0.75rem;
          }

          .count {
            font-size: 0.625rem;
          }

          .users-list {
            padding: 6px;
          }

          .user-item {
            padding: 6px;
            gap: 8px;
          }

          .rank {
            width: 24px;
            height: 24px;
          }

          .rank-number {
            font-size: 0.5rem;
          }

          .medal {
            font-size: 0.625rem;
            top: -3px;
            right: -3px;
          }

          .user-name {
            font-size: 0.625rem;
          }

          .stat {
            font-size: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
