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
          background: #192734;
          border: 1px solid #38444d;
          border-radius: 16px;
          padding: 0;
          margin-bottom: 30px;
          overflow: hidden;
        }
        
        .section-header {
          background: linear-gradient(135deg, #1d9bf0, #1a8cd8);
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
          color: #8b98a5;
        }
        
        .stats-list {
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .stat-item {
          background: #15202b;
          border: 1px solid #38444d;
          border-radius: 10px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s ease;
        }
        
        .stat-item:hover {
          border-color: #1d9bf0;
        }
        
        .stat-icon {
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(29, 155, 240, 0.1);
          border-radius: 50%;
        }
        
        .stat-info {
          flex: 1;
        }
        
        .stat-label {
          font-size: 0.75rem;
          color: #8b98a5;
          font-weight: 500;
          margin-bottom: 2px;
        }
        
        .stat-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
        }
        
        @media (max-width: 768px) {
          .user-stats-frame {
            margin-bottom: 0;
            min-height: 180px;
          }
          
          .section-header {
            padding: 8px 12px;
          }
          
          .section-header h3 {
            font-size: 0.9rem;
          }
          
          .stats-list {
            padding: 4px;
            gap: 3px;
          }
          
          .stat-item {
            padding: 6px;
            gap: 6px;
          }
          
          .stat-icon {
            width: 25px;
            height: 25px;
            font-size: 0.8rem;
          }
          
          .stat-label {
            font-size: 0.6rem;
          }
          
          .stat-value {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}
