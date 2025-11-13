import { useState, useEffect } from 'react';

interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  totalKudos: number;
  totalTricks: number;
  totalScore: number;
  rank: number;
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setError(null);
      const response = await fetch('/api/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setLeaders(Array.isArray(data) ? data : []);
      } else {
        throw new Error('Failed to fetch leaderboard');
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard');
      setLeaders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="sidebar-section">
        <div className="sidebar-header">
          <div className="header-icon">👑</div>
          <h3>Top Contributors</h3>
        </div>
        <div className="loading">Loading leaderboard...</div>
      </div>
    );
  }

  if (error || leaders.length === 0) {
    return (
      <div className="sidebar-section">
        <div className="sidebar-header">
          <div className="header-icon">👑</div>
          <h3>Top Contributors</h3>
        </div>
        <div className="no-data">
          {error ? error : 'No contributors yet'}
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar-section">
      <div className="sidebar-header">
        <div className="header-icon">👑</div>
        <h3>Top Contributors</h3>
      </div>
      <div className="leaderboard-list">
        {leaders.slice(0, 3).map((user) => (
          <div key={user.id} className="leader-item">
            <div className={`leader-rank rank-${user.rank}`}>#{user.rank}</div>
            <div className="leader-info">
              <div className="leader-name">{user.name}</div>
              <div className="leader-stats">
                <span className="stat">🔥 {user.totalKudos}</span>
                <span className="stat">📝 {user.totalTricks}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .leaderboard-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .leader-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(120, 219, 255, 0.2);
          border-radius: 8px;
          color: #ffffff;
          transition: all 0.2s ease;
        }
        
        .leader-item:hover {
          background: rgba(120, 219, 255, 0.2);
          border-color: rgba(120, 219, 255, 0.4);
          transform: translateX(4px);
          box-shadow: 0 4px 16px rgba(120, 219, 255, 0.2);
        }
        
        .leader-rank {
          color: #ffffff;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .leader-rank.rank-1 {
          background: linear-gradient(135deg, gold, #ffed4e);
          color: #92400e;
        }
        
        .leader-rank.rank-2 {
          background: linear-gradient(135deg, silver, #e5e7eb);
          color: #374151;
        }
        
        .leader-rank.rank-3 {
          background: linear-gradient(135deg, #cd7f32, #d97706);
          color: #ffffff;
        }
        
        .leader-info {
          flex: 1;
          min-width: 0;
        }
        
        .leader-name {
          font-weight: 600;
          font-size: 0.9rem;
          line-height: 1.3;
          margin-bottom: 0.25rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .leader-stats {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.8rem;
        }
        
        .stat {
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }
        
        .loading, .no-data {
          padding: 1rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }
        
        .leader-item:focus {
          outline: 2px solid #78dbff;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
