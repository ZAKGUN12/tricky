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
    return (
      <div className="leaderboard-frame">
        <div className="section-header">
          <h3>🏆 Top 3 Contributors</h3>
          <div className="header-line"></div>
        </div>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="leaderboard-frame">
      <div className="section-header">
        <h3>🏆 Top Contributors</h3>
        <div className="header-line"></div>
      </div>
      
      <div className="leaderboard-list">
        {users.length === 0 ? (
          <div className="empty-state">No contributors yet. Be the first!</div>
        ) : (
          users.slice(0, 3).map(user => (
            <div key={user.rank} className="leaderboard-item top-three">
              <div className="rank-badge">
                <span className="rank-number">#{user.rank}</span>
                <span className="crown">
                  {user.rank === 1 ? '👑' : user.rank === 2 ? '🥈' : '🥉'}
                </span>
              </div>
              
              <div className="user-info">
                <div className="username">{user.username}</div>
                <div className="user-stats">
                  <span className="stat">💡 {user.tricksSubmitted}</span>
                  <span className="stat">👍 {user.kudosReceived}</span>
                </div>
              </div>
              
              <div className="score">{user.score}</div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .leaderboard-frame {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          padding: 0;
          margin-bottom: 30px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          border: 1px solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
        }
        
        .section-header {
          background: linear-gradient(135deg, #667eea, #764ba2);
          padding: 16px 20px;
          color: white;
          position: relative;
        }
        
        .section-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 700;
        }
        
        .header-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255, 255, 255, 0.3);
        }
        
        .loading, .empty-state {
          padding: 20px;
          text-align: center;
          color: #666;
        }
        
        .leaderboard-list {
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .leaderboard-item {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 10px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        
        .leaderboard-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        
        .leaderboard-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
          border-color: rgba(102, 126, 234, 0.2);
        }
        
        .leaderboard-item:hover::before {
          opacity: 1;
        }
        
        .top-three {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 255, 255, 0.9));
          border-color: rgba(255, 215, 0, 0.3);
        }
        
        .rank-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 35px;
        }
        
        .rank-number {
          font-weight: bold;
          color: #667eea;
          font-size: 0.9rem;
        }
        
        .crown {
          font-size: 0.8rem;
          margin-top: 2px;
        }
        
        .user-info {
          flex: 1;
          min-width: 0;
        }
        
        .username {
          font-weight: 600;
          font-size: 0.85rem;
          color: #2c3e50;
          line-height: 1.2;
          margin-bottom: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .user-stats {
          display: flex;
          gap: 8px;
        }
        
        .stat {
          font-size: 0.7rem;
          color: #666;
          background: rgba(0,0,0,0.05);
          padding: 2px 6px;
          border-radius: 8px;
        }
        
        .score {
          font-weight: bold;
          color: #667eea;
          font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
          .section-header {
            padding: 12px 16px;
          }
          
          .leaderboard-list {
            padding: 6px;
          }
          
          .leaderboard-item {
            padding: 10px;
            gap: 10px;
          }
          
          .username {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}
