import { useState, useEffect, useCallback } from 'react';

interface UserStatsProps {
  userEmail: string;
}

interface UserStats {
  score: number;
  tricksSubmitted: number;
  kudosReceived: number;
}

export default function UserStats({ userEmail }: UserStatsProps) {
  const [stats, setStats] = useState<UserStats>({ score: 0, tricksSubmitted: 0, kudosReceived: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`/api/user/stats?email=${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="user-stats-frame">
        <div className="section-header">
          <h3>📊 Your Stats</h3>
          <div className="header-line"></div>
        </div>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="user-stats-frame">
      <div className="section-header">
        <h3>📊 Your Stats</h3>
        <div className="header-line"></div>
      </div>
      
      <div className="stats-list">
        <div className="stat-item">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <div className="stat-label">Total Score</div>
            <div className="stat-value">{stats.score}</div>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">💡</div>
          <div className="stat-info">
            <div className="stat-label">Tricks Shared</div>
            <div className="stat-value">{stats.tricksSubmitted}</div>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">👍</div>
          <div className="stat-info">
            <div className="stat-label">Kudos Received</div>
            <div className="stat-value">{stats.kudosReceived}</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .user-stats-frame {
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
        
        .loading {
          padding: 20px;
          text-align: center;
          color: #666;
        }
        
        .stats-list {
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .stat-item {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 10px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s ease;
        }
        
        .stat-item:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
          border-color: rgba(102, 126, 234, 0.2);
        }
        
        .stat-icon {
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 50%;
        }
        
        .stat-info {
          flex: 1;
        }
        
        .stat-label {
          font-size: 0.75rem;
          color: #666;
          font-weight: 500;
          margin-bottom: 2px;
        }
        
        .stat-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #667eea;
        }
        
        @media (max-width: 768px) {
          .section-header {
            padding: 12px 16px;
          }
          
          .stats-list {
            padding: 6px;
          }
          
          .stat-item {
            padding: 10px;
            gap: 10px;
          }
          
          .stat-icon {
            width: 35px;
            height: 35px;
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
}
