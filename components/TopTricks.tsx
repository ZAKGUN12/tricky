import { mockTricks } from '../lib/mockData';

export default function TopTricks() {
  // Sort tricks by kudos and take top 10
  const topTricks = [...mockTricks]
    .sort((a, b) => b.kudos - a.kudos)
    .slice(0, 10);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-900">
        🏆 Top 10 Best Tricks
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {topTricks.map((trick, index) => (
          <div 
            key={trick.id} 
            className="group cursor-pointer"
          >
            <div className={`
              relative p-3 rounded-lg border-2 transition-all duration-300
              ${index < 3 
                ? 'border-yellow-300 bg-yellow-50 hover:border-yellow-400 hover:bg-yellow-100' 
                : 'border-blue-200 bg-blue-50 hover:border-blue-300 hover:bg-blue-100'
              }
              hover:shadow-md hover:transform hover:scale-105
            `}>
              {/* Rank badge */}
              <div className={`
                absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${index < 3 ? 'bg-yellow-500 text-white' : 'bg-blue-500 text-white'}
              `}>
                {index + 1}
              </div>

              {/* Country flag */}
              <div className="text-center mb-2">
                <div className="text-3xl mb-1">
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

              {/* Trick title */}
              <div className="text-xs font-medium text-gray-800 text-center mb-2 line-clamp-2 h-8">
                {trick.title}
              </div>

              {/* Stats */}
              <div className="flex justify-center items-center gap-2 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  👍 <span className="font-semibold">{trick.kudos > 1000 ? `${(trick.kudos/1000).toFixed(1)}k` : trick.kudos}</span>
                </span>
                <span className="flex items-center gap-1">
                  {trick.difficulty === 'easy' ? '🟢' : 
                   trick.difficulty === 'medium' ? '🟡' : '🔴'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
