import { mockTricks } from '../lib/mockData';

export default function TopTricks() {
  // Sort tricks by kudos and take top 10
  const topTricks = [...mockTricks]
    .sort((a, b) => b.kudos - a.kudos)
    .slice(0, 10);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-bold mb-6 text-center">
        🏆 Top 10 Best Tricks
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        {topTricks.map((trick, index) => (
          <div 
            key={trick.id} 
            className="relative group"
          >
            {/* Chain connector */}
            {index < topTricks.length - 1 && (
              <div className="absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent z-0" />
            )}
            
            {/* Trick circle */}
            <div className={`
              relative w-16 h-16 rounded-full flex flex-col items-center justify-center
              cursor-pointer transition-all duration-300 z-10
              ${index < 3 
                ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900 shadow-lg' 
                : 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 shadow-md'
              }
              hover:scale-110 hover:shadow-xl
            `}>
              <div className="text-xs font-bold">#{index + 1}</div>
              <div className="text-lg">
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

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
              <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap max-w-32 text-center">
                <div className="font-medium">{trick.title}</div>
                <div className="text-yellow-300">👍 {trick.kudos.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Closing chain link */}
        <div className="w-4 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 self-center animate-pulse" />
      </div>
    </div>
  );
}
