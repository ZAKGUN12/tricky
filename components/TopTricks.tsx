import { mockTricks } from '../lib/mockData';

interface TopTricksProps {
  onTrickSelect: (trickId: string) => void;
  selectedTrickId?: string;
}

export default function TopTricks({ onTrickSelect, selectedTrickId }: TopTricksProps) {
  // Sort tricks by kudos and take top 10
  const topTricks = [...mockTricks]
    .sort((a, b) => b.kudos - a.kudos)
    .slice(0, 10);

  return (
    <div className="country-chain">
      <div className="country-btn active" style={{ marginBottom: '10px', fontSize: '14px', cursor: 'default' }}>
        🏆 Top 10 Best Tricks
      </div>
      {topTricks.map((trick, index) => (
        <button
          key={trick.id}
          className={`country-btn ${index < 3 || selectedTrickId === trick.id ? 'active' : ''}`}
          style={{ animationDelay: `${index * 0.05}s` }}
          onClick={() => onTrickSelect(trick.id)}
        >
          <span className="country-flag">
            {index < 3 ? (index === 0 ? '👑' : index === 1 ? '🥈' : '🥉') : `#${index + 1}`}
          </span>
          <span className="country-flag">
            {trick.countryCode === 'IT' ? '🇮🇹' : 
             trick.countryCode === 'JP' ? '🇯🇵' : 
             trick.countryCode === 'US' ? '🇺🇸' : 
             trick.countryCode === 'GB' ? '🇬🇧' : 
             trick.countryCode === 'FR' ? '🇫🇷' : 
             trick.countryCode === 'IN' ? '🇮🇳' : 
             trick.countryCode === 'ES' ? '🇪🇸' : 
             trick.countryCode === 'GR' ? '🇬🇷' : 
             trick.countryCode === 'AR' ? '🇦🇷' : '🌍'}
          </span>
          <span className="country-name">{trick.title}</span>
          <span className="trick-count">👍{trick.kudos > 1000 ? `${(trick.kudos/1000).toFixed(1)}k` : trick.kudos}</span>
        </button>
      ))}
    </div>
  );
}
