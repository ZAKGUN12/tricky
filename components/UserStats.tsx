import { useState, useEffect, useCallback } from 'react';

interface UserStatsProps {
  userId: string;
}

interface UserStats {
  score: number;
  tricksSubmitted: number;
  kudosReceived: number;
}

export default function UserStats({ userId }: UserStatsProps) {
  const [stats, setStats] = useState<UserStats>({ score: 0, tricksSubmitted: 0, kudosReceived: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`/api/user/stats?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return <span className="user-stats">Loading...</span>;
  }

  return (
    <div className="user-stats">
      <span className="score">Score: {stats.score}</span>
      <span className="tricks">Tricks: {stats.tricksSubmitted}</span>
      <span className="kudos">Kudos: {stats.kudosReceived}</span>

      <style jsx>{`
        .user-stats {
          display: flex;
          gap: var(--space-md);
          font-size: var(--text-sm);
        }

        .score {
          color: #667eea;
          font-weight: 600;
        }

        .tricks {
          color: #764ba2;
          font-weight: 600;
        }

        .kudos {
          color: #f093fb;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .user-stats {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
