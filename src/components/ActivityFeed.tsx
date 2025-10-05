import { useState, useEffect } from 'react';

interface Activity {
  id: string;
  type: string;
  userName: string;
  trickTitle: string;
  timestamp: string;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Fetch initial activities
    fetch('/api/activities')
      .then(res => res.json())
      .then(setActivities);

    // WebSocket for real-time updates
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001');
    ws.onmessage = (event) => {
      const activity = JSON.parse(event.data);
      setActivities(prev => [activity, ...prev.slice(0, 19)]);
    };

    return () => ws.close();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return '💬';
      case 'like':
        return '👍';
      case 'new_trick':
        return '✨';
      default:
        return '📝';
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'comment':
        return `commented on "${activity.trickTitle}"`;
      case 'like':
        return `liked "${activity.trickTitle}"`;
      case 'new_trick':
        return `shared a new trick: "${activity.trickTitle}"`;
      default:
        return 'did something';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">🔥 Live Activity</h2>
      <div className="space-y-3">
        {activities.map(activity => (
          <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded">
            <span className="text-xl">{getActivityIcon(activity.type)}</span>
            <div className="flex-1">
              <div className="text-sm">
                <span className="font-medium">{activity.userName}</span>
                {' '}
                <span className="text-gray-600">{getActivityText(activity)}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
