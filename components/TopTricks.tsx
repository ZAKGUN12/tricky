import { mockTricks } from '../lib/mockData';

export default function TopTricks() {
  // Sort tricks by kudos and take top 10
  const topTricks = [...mockTricks]
    .sort((a, b) => b.kudos - a.kudos)
    .slice(0, 10);

  const getRankStyle = (index: number) => {
    if (index === 0) return 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-xl border-4 border-yellow-300';
    if (index === 1) return 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-white shadow-lg border-4 border-gray-200';
    if (index === 2) return 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white shadow-lg border-4 border-orange-300';
    return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white shadow-md border-2 border-blue-300';
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return '👑';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '⭐';
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-8 mb-8 border border-purple-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          🏆 Top 10 Best Tricks
        </h2>
        <p className="text-gray-600">Most loved tricks by our community</p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-6">
        {topTricks.map((trick, index) => (
          <div 
            key={trick.id} 
            className="relative group animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Chain connector */}
            {index < topTricks.length - 1 && (
              <div className="absolute top-1/2 -right-3 w-6 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-transparent rounded-full z-0 animate-pulse" />
            )}
            
            {/* Trick medallion */}
            <div className={`
              relative w-20 h-20 rounded-full flex flex-col items-center justify-center
              cursor-pointer transition-all duration-500 z-10 transform
              ${getRankStyle(index)}
              hover:scale-125 hover:rotate-12 hover:shadow-2xl
              ${index < 3 ? 'animate-bounce-gentle' : ''}
            `}>
              <div className="absolute -top-2 -right-2 text-lg">
                {getRankIcon(index)}
              </div>
              <div className="text-xs font-bold opacity-90">#{index + 1}</div>
              <div className="text-2xl drop-shadow-sm">
                {trick.countryCode === 'IT' ? '🇮🇹' : 
                 trick.countryCode === 'JP' ? '🇯🇵' : 
                 trick.countryCode === 'US' ? '🇺🇸' : 
                 trick.countryCode === 'GB' ? '🇬🇧' : 
                 trick.countryCode === 'FR' ? '🇫🇷' : 
                 trick.countryCode === 'IN' ? '🇮🇳' : 
                 trick.countryCode === 'ES' ? '🇪🇸' : 
                 trick.countryCode === 'GR' ? '🇬🇷' : 
                 trick.countryCode === 'AR' ? '🇦🇷' : '🌍'}
              </div>
            </div>

            {/* Enhanced tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 scale-95 group-hover:scale-100">
              <div className="bg-gradient-to-r from-gray-900 to-black text-white text-sm rounded-lg px-4 py-3 shadow-2xl border border-gray-700 max-w-48 text-center">
                <div className="font-bold text-yellow-300 mb-1">{trick.title}</div>
                <div className="flex items-center justify-center gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    👍 <span className="text-yellow-300 font-semibold">{trick.kudos.toLocaleString()}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    ⭐ {trick.favorites}
                  </span>
                  <span className="flex items-center gap-1">
                    💬 {trick.comments}
                  </span>
                </div>
              </div>
              {/* Tooltip arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        ))}
        
        {/* Closing chain link with sparkle */}
        <div className="flex items-center">
          <div className="w-6 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-pulse" />
          <div className="text-2xl animate-spin-slow">✨</div>
        </div>
      </div>
    </div>
  );
}
