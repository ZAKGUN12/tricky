import { mockTricks } from '../lib/mockData';

export default function TopTricks() {
  // Sort tricks by kudos and take top 10
  const topTricks = [...mockTricks]
    .sort((a, b) => b.kudos - a.kudos)
    .slice(0, 10);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        🏆 Top 10 Best Tricks
      </h2>
      <div className="space-y-3">
        {topTricks.map((trick, index) => (
          <div 
            key={trick.id} 
            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer transition-colors"
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
              ${index < 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}
            `}>
              #{index + 1}
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm line-clamp-1">{trick.title}</div>
              <div className="text-xs text-gray-500 flex items-center gap-3">
                <span>👍 {trick.kudos.toLocaleString()}</span>
                <span>⭐ {trick.favorites}</span>
                <span>💬 {trick.comments}</span>
                <span>{trick.countryCode === 'IT' ? '🇮🇹' : 
                       trick.countryCode === 'JP' ? '🇯🇵' : 
                       trick.countryCode === 'US' ? '🇺🇸' : 
                       trick.countryCode === 'GB' ? '🇬🇧' : 
                       trick.countryCode === 'FR' ? '🇫🇷' : 
                       trick.countryCode === 'IN' ? '🇮🇳' : 
                       trick.countryCode === 'ES' ? '🇪🇸' : '🌍'}</span>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {trick.difficulty === 'easy' ? '🟢' : 
               trick.difficulty === 'medium' ? '🟡' : '🔴'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
