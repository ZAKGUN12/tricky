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
          background: linear-gradient(135deg, #10ac84 0%, #00d2d3 100%);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header h3 {
          color: #1a1a1a;
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
        }

        .count {
          background: rgba(26, 26, 26, 0.8);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .loading, .no-data {
          padding: 20px;
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.75rem;
        }

        .users-list {
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .user-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.1);
        }

        .user-item:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(4px);
        }

        .rank {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #065f46, #047857);
          flex-shrink: 0;
        }

        .rank-number {
          font-size: 0.625rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .medal {
          position: absolute;
          top: -4px;
          right: -4px;
          font-size: 0.75rem;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
        }

        .user-content {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          margin-bottom: 4px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-stats {
          display: flex;
          gap: 8px;
        }

        .stat {
          font-size: 0.625rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 600;
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
