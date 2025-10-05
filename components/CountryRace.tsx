import { countries, mockTricks } from '../lib/mockData';

export default function CountryRace() {
  const getCountryStats = () => {
    return countries.map(country => {
      const countryTricks = mockTricks.filter(trick => trick.countryCode === country.code);
      const totalKudos = countryTricks.reduce((sum, trick) => sum + trick.kudos, 0);
      const totalViews = countryTricks.reduce((sum, trick) => sum + trick.views, 0);
      const score = countryTricks.length * 100 + totalKudos + (totalViews / 10);
      
      return {
        ...country,
        tricksCount: countryTricks.length,
        totalKudos,
        totalViews,
        score: Math.round(score)
      };
    }).sort((a, b) => b.score - a.score).slice(0, 8);
  };

  const countryStats = getCountryStats();
  const maxScore = countryStats[0]?.score || 1;

  return (
    <div className="country-race">
      <div className="race-header">
        <h3>🏆 Country Championship</h3>
        <p>Real-time competition based on tricks & engagement</p>
      </div>
      
      <div className="race-track">
        {countryStats.map((country, index) => {
          const percentage = (country.score / maxScore) * 100;
          const isTop3 = index < 3;
          
          return (
            <div key={country.code} className={`race-lane ${isTop3 ? 'podium' : ''}`}>
              <div className="country-info">
                <span className="rank">#{index + 1}</span>
                <span className="flag">{country.flag}</span>
                <span className="name">{country.name}</span>
                {isTop3 && <span className="medal">{index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}</span>}
              </div>
              
              <div className="progress-track">
                <div 
                  className="progress-bar"
                  style={{ width: `${percentage}%` }}
                >
                  <div className="progress-glow"></div>
                </div>
              </div>
              
              <div className="stats">
                <span className="score">{country.score.toLocaleString()}</span>
                <div className="breakdown">
                  <span>{country.tricksCount} tricks</span>
                  <span>{country.totalKudos} kudos</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .country-race {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 25px;
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
          position: relative;
          overflow: hidden;
        }
        
        .race-header h3 {
          font-size: 1.3rem;
          font-weight: 800;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 5px;
          animation: titleGlow 3s ease-in-out infinite;
        }
        
        .race-header p {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin: 0;
        }
        
        .race-lane {
          display: grid;
          grid-template-columns: 140px 1fr 80px;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: var(--glass-bg);
          border-radius: 12px;
          border: 1px solid var(--glass-border);
          transition: all 0.3s ease;
          animation: laneFloat 4s ease-in-out infinite;
          animation-delay: calc(var(--index) * 0.2s);
        }
        
        .race-lane.podium {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), var(--glass-bg));
          border-color: rgba(255, 215, 0, 0.3);
          transform: scale(1.02);
        }
        
        .rank {
          font-weight: bold;
          color: #667eea;
          min-width: 25px;
        }
        
        .name {
          font-weight: 600;
          color: var(--text-primary);
          flex: 1;
        }
        
        .progress-bar {
          height: 100%;
          background: var(--primary-gradient);
          border-radius: 10px;
          position: relative;
          transition: width 2s ease-out;
          animation: progressPulse 2s ease-in-out infinite;
        }
        
        .score {
          font-weight: bold;
          color: #667eea;
          display: block;
        }
        
        .breakdown {
          display: flex;
          flex-direction: column;
          gap: 2px;
          color: var(--text-muted);
          font-size: 0.7rem;
        }
        
        @keyframes titleGlow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }
        
        @keyframes laneFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        
        @keyframes flagWave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(3deg); }
          75% { transform: rotate(-3deg); }
        }
        
        @keyframes medalSpin {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
        }
        
        @keyframes progressPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes progressShine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @media (max-width: 768px) {
          .race-lane {
            grid-template-columns: 120px 1fr 70px;
            gap: 8px;
            padding: 8px;
          }
          
          .country-info {
            gap: 6px;
            font-size: 0.8rem;
          }
          
          .name {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
