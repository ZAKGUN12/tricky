import { useState, useEffect } from 'react';

interface TrendingTrick {
  id: string;
  title: string;
  kudos: number;
  comments: number;
  trend: 'up' | 'down' | 'stable';
}

export default function TrendingTricks() {
  const [trending, setTrending] = useState<TrendingTrick[]>([]);

  useEffect(() => {
    const fetchTrending = () => {
      fetch('/api/trending')
        .then(res => res.json())
        .then(setTrending);
    };

    fetchTrending();
    const interval = setInterval(fetchTrending, 30000); // Update every 30s

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">🔥 Trending Now</h2>
      <div className="space-y-3">
        {trending.map((trick, index) => (
          <div key={trick.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded">
            <div className="text-lg font-bold text-gray-400 w-6">
              #{index + 1}
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">{trick.title}</div>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <span>👍 {trick.kudos}</span>
                <span>💬 {trick.comments}</span>
                <span>{getTrendIcon(trick.trend)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
