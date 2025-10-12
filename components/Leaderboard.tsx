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
      <div className="leaderboard-wrapper">
        <div className="leaderboard-header">
          <h2 className="leaderboard-title">🏅 Leaderboard</h2>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span>Loading leaderboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-wrapper">
      <div className="leaderboard-header">
        <div className="header-content">
          <h2 className="leaderboard-title">🏅 Leaderboard</h2>
          <p className="leaderboard-subtitle">Top contributors this month</p>
        </div>
        <div className="leaderboard-badge">
          <span className="badge-number">{users.length}</span>
          <span className="badge-label">Users</span>
        </div>
      </div>
      
      <div className="users-container">
        {users.slice(0, 10).map((user, index) => {
          const isTopThree = index < 3;
          const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
          
          return (
            <div 
              key={user.username} 
              className={`user-item ${isTopThree ? 'top-three' : ''}`}
              style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
            >
              <div className="rank-section">
                <div className={`rank-badge rank-${index + 1}`}>
                  <span className="rank-number">#{index + 1}</span>
                  {medal && <span className="medal">{medal}</span>}
                </div>
                {isTopThree && <div className="champion-glow"></div>}
              </div>
              
              <div className="user-content">
                <div className="user-header">
                  <h3 className="user-name">{user.username}</h3>
                  <div className="score-display">
                    <span className="score-value">{user.score}</span>
                    <span className="score-label">pts</span>
                  </div>
                </div>
                
                <div className="user-stats">
                  <div className="stat-item">
                    <span className="stat-icon">📝</span>
                    <span className="stat-value">{user.tricksSubmitted}</span>
                    <span className="stat-label">tricks</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">👍</span>
                    <span className="stat-value">{user.kudosReceived}</span>
                    <span className="stat-label">kudos</span>
                  </div>
                </div>
              </div>
              
              <div className="achievement-indicator">
                {isTopThree ? '⭐' : '🌟'}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .leaderboard-wrapper {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
        }

        .leaderboard-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(5, 150, 105, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.2) 0%, transparent 50%);
          pointer-events: none;
        }

        .leaderboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          position: relative;
          z-index: 2;
        }

        .header-content {
          flex: 1;
        }

        .leaderboard-title {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          margin: 0 0 8px 0;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          letter-spacing: -0.02em;
        }

        .leaderboard-subtitle {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          font-weight: 500;
        }

        .leaderboard-badge {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          padding: 16px 24px;
          text-align: center;
          min-width: 100px;
        }

        .badge-number {
          display: block;
          font-size: 2rem;
          font-weight: 800;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .badge-label {
          display: block;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .loading-state {
          padding: 64px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          color: rgba(255, 255, 255, 0.8);
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .users-container {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .user-item {
          display: flex;
          align-items: center;
          gap: 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          animation: slideIn 0.6s ease-out var(--delay) both;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .user-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.8s ease;
        }

        .user-item:hover::before {
          left: 100%;
        }

        .user-item:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-4px) translateX(8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
        }

        .user-item.top-three {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .user-item.top-three:hover {
          background: rgba(255, 255, 255, 0.3);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.25);
        }

        .rank-section {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .rank-badge {
          position: relative;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.875rem;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .rank-1 {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          border: 3px solid #fff;
        }

        .rank-2 {
          background: linear-gradient(135deg, #c0c0c0, #e5e5e5);
          border: 3px solid #fff;
        }

        .rank-3 {
          background: linear-gradient(135deg, #cd7f32, #daa520);
          border: 3px solid #fff;
        }

        .rank-badge:not(.rank-1):not(.rank-2):not(.rank-3) {
          background: linear-gradient(135deg, #34d399, #10b981);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .rank-number {
          position: relative;
          z-index: 2;
        }

        .medal {
          position: absolute;
          top: -8px;
          right: -8px;
          font-size: 1.5rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .champion-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          animation: glow 2s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.8;
          }
        }

        .user-content {
          flex: 1;
          min-width: 0;
        }

        .user-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .user-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: white;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150px;
        }

        .score-display {
          display: flex;
          align-items: baseline;
          gap: 4px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 8px 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .score-value {
          font-size: 1.25rem;
          font-weight: 800;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .score-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 600;
        }

        .user-stats {
          display: flex;
          gap: 20px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .stat-icon {
          font-size: 1rem;
          opacity: 0.8;
        }

        .stat-value {
          font-size: 0.875rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .stat-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

        .achievement-indicator {
          font-size: 1.5rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
          animation: twinkle 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes twinkle {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(10deg); }
        }

        @media (max-width: 1024px) {
          .leaderboard-wrapper {
            padding: 24px;
            margin-bottom: 24px;
          }

          .leaderboard-title {
            font-size: 1.75rem;
          }

          .leaderboard-subtitle {
            font-size: 1rem;
          }

          .user-item {
            padding: 16px;
            gap: 16px;
          }

          .rank-badge {
            width: 48px;
            height: 48px;
            font-size: 0.75rem;
          }

          .medal {
            font-size: 1.25rem;
            top: -6px;
            right: -6px;
          }

          .user-name {
            max-width: 120px;
          }
        }

        @media (max-width: 768px) {
          .leaderboard-wrapper {
            padding: 20px;
            margin-bottom: 20px;
          }

          .leaderboard-header {
            flex-direction: column;
            gap: 16px;
            text-align: center;
            margin-bottom: 24px;
          }

          .leaderboard-title {
            font-size: 1.5rem;
          }

          .leaderboard-subtitle {
            font-size: 0.875rem;
          }

          .leaderboard-badge {
            align-self: center;
            min-width: 80px;
            padding: 12px 20px;
          }

          .badge-number {
            font-size: 1.5rem;
          }

          .user-item {
            padding: 12px;
            gap: 12px;
          }

          .rank-badge {
            width: 40px;
            height: 40px;
            font-size: 0.625rem;
          }

          .medal {
            font-size: 1rem;
            top: -4px;
            right: -4px;
          }

          .user-name {
            font-size: 1rem;
            max-width: 100px;
          }

          .score-value {
            font-size: 1rem;
          }

          .user-stats {
            gap: 12px;
          }

          .achievement-indicator {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
