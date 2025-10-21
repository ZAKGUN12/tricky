import { useState, useEffect } from 'react';

interface User {
  username: string;
  tricksCount: number;
  totalKudos: number;
}

export default function Leaderboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      if (response.ok) {
        const data = await response.json();
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
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <div className="header-icon">🏅</div>
          <h3>Leaderboard</h3>
        </div>
        <div className="loading">Loading leaderboard...</div>
        
        <style jsx>{`
          .leaderboard-container {
            background: linear-gradient(145deg, rgba(15, 15, 35, 0.95), rgba(25, 25, 45, 0.9));
            backdrop-filter: blur(20px);
            border-radius: 16px;
            border: 1px solid rgba(120, 219, 255, 0.2);
            overflow: hidden;
          }

          .leaderboard-header {
            background: linear-gradient(135deg, rgba(120, 219, 255, 0.3), rgba(78, 219, 255, 0.2));
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            border-bottom: 1px solid rgba(120, 219, 255, 0.2);
          }

          .header-icon {
            font-size: 1.2rem;
            filter: drop-shadow(0 0 8px rgba(120, 219, 255, 0.6));
          }

          .leaderboard-header h3 {
            color: #ffffff;
            font-size: 0.95rem;
            font-weight: 600;
            margin: 0;
            text-shadow: 0 0 10px rgba(120, 219, 255, 0.4);
          }

          .loading {
            padding: 2rem;
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.85rem;
          }
        `}</style>
      </div>
    );
  }

  const displayUsers = users.slice(0, 3);

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <div className="header-icon">🏅</div>
        <h3>Leaderboard</h3>
        <div className="badge">Top {displayUsers.length}</div>
      </div>
      
      <div className="users-list">
        {displayUsers.length > 0 ? displayUsers.map((user, index) => (
          <div key={user.username} className="user-item">
            <div className="rank-badge">
              <span className="rank-number">#{index + 1}</span>
              <div className="medal">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </div>
            </div>
            
            <div className="user-content">
              <div className="user-info">
                <h4 className="username">👤 {user.username}</h4>
                <div className="user-stats">
                  <span className="stat">📝 {user.tricksCount} tricks</span>
                  <span className="stat">⭐ {user.totalKudos} kudos</span>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="no-users">
            <span>🎯</span>
            <p>No contributors yet</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .leaderboard-container {
          background: linear-gradient(145deg, rgba(15, 15, 35, 0.95), rgba(25, 25, 45, 0.9));
          backdrop-filter: blur(20px);
          border-radius: 16px;
          border: 1px solid rgba(120, 219, 255, 0.2);
          overflow: hidden;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .leaderboard-header {
          background: linear-gradient(135deg, rgba(120, 219, 255, 0.3), rgba(78, 219, 255, 0.2));
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid rgba(120, 219, 255, 0.2);
        }

        .header-icon {
          font-size: 1.2rem;
          filter: drop-shadow(0 0 8px rgba(120, 219, 255, 0.6));
        }

        .leaderboard-header h3 {
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 600;
          margin: 0;
          flex: 1;
          text-shadow: 0 0 10px rgba(120, 219, 255, 0.4);
        }

        .badge {
          background: rgba(120, 219, 255, 0.3);
          color: rgba(120, 219, 255, 0.9);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          border: 1px solid rgba(120, 219, 255, 0.4);
        }

        .users-list {
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .user-item {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .user-item:hover {
          background: rgba(120, 219, 255, 0.15);
          border-color: rgba(120, 219, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(120, 219, 255, 0.2);
        }

        .rank-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          min-width: 40px;
        }

        .rank-number {
          font-size: 0.7rem;
          font-weight: 700;
          color: rgba(120, 219, 255, 0.9);
          background: rgba(120, 219, 255, 0.2);
          padding: 0.2rem 0.4rem;
          border-radius: 6px;
          border: 1px solid rgba(120, 219, 255, 0.3);
        }

        .medal {
          font-size: 1.2rem;
          filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.5));
        }

        .user-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .username {
          font-size: 0.8rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
          line-height: 1.3;
        }

        .user-stats {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .stat {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.6);
          background: rgba(120, 219, 255, 0.1);
          padding: 0.2rem 0.5rem;
          border-radius: 8px;
          border: 1px solid rgba(120, 219, 255, 0.2);
        }

        .no-users {
          text-align: center;
          padding: 2rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .no-users span {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .no-users p {
          margin: 0;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
}
