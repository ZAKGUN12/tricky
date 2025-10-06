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
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="leaderboard loading">Loading leaderboard...</div>;
  }

  return (
    <div className="leaderboard">
      <h3>🏆 Top Contributors</h3>
      {users.length === 0 ? (
        <p>No contributors yet. Be the first!</p>
      ) : (
        <div className="leaderboard-list">
          {users.map(user => (
            <div key={user.rank} className={`leaderboard-item rank-${user.rank}`}>
              <div className="rank">
                {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : `#${user.rank}`}
              </div>
              <div className="user-info">
                <div className="username">{user.username}</div>
                <div className="stats">
                  {user.tricksSubmitted} tricks • {user.kudosReceived} kudos
                </div>
              </div>
              <div className="score">{user.score} pts</div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .leaderboard {
          background: var(--glass-bg);
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(20px);
          box-shadow: var(--glass-shadow);
          border: 1px solid var(--glass-border);
        }

        .leaderboard h3 {
          margin: 0 0 var(--space-lg) 0;
          text-align: center;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .leaderboard-item {
          display: flex;
          align-items: center;
          padding: var(--space-md);
          margin-bottom: var(--space-sm);
          background: rgba(255, 255, 255, 0.5);
          border-radius: var(--radius-md);
          transition: all 0.3s ease;
        }

        .leaderboard-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .rank-1 {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          color: #8b5a00;
        }

        .rank-2 {
          background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
          color: #666;
        }

        .rank-3 {
          background: linear-gradient(135deg, #cd7f32, #daa520);
          color: #5d4e37;
        }

        .rank {
          font-size: var(--text-lg);
          font-weight: bold;
          margin-right: var(--space-md);
          min-width: 40px;
        }

        .user-info {
          flex: 1;
        }

        .username {
          font-weight: 600;
          margin-bottom: var(--space-xs);
        }

        .stats {
          font-size: var(--text-sm);
          color: #666;
        }

        .score {
          font-weight: bold;
          color: #667eea;
          font-size: var(--text-lg);
        }

        .loading {
          text-align: center;
          padding: var(--space-xl);
          color: #666;
        }
      `}</style>
    </div>
  );
}
