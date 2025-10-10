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
      <div className="card">
        <div className="p-4 text-center text-gray-500">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="px-4 py-3 bg-gray-50 border-b">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide">
          Leaderboard
        </h3>
      </div>
      
      <div className="py-1">
        {users.slice(0, 5).map((user, index) => (
          <div key={user.username} className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 ${
              index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
            }`}>
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
              <p className="text-xs text-gray-500">
                {user.score} points • {user.tricksSubmitted} tricks
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
