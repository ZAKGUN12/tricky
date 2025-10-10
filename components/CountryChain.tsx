import { countries } from '../lib/mockData';
import { Trick } from '../lib/types';

interface CountryChainProps {
  selectedCountry: string;
  onCountrySelect: (countryCode: string) => void;
  tricks: Trick[];
}

export default function CountryChain({ selectedCountry, onCountrySelect, tricks }: CountryChainProps) {
  const getCountryTrickCount = (countryCode: string) => {
    return tricks.filter(trick => trick.countryCode === countryCode).length;
  };

  const countriesWithTricks = countries
    .map(country => ({
      ...country,
      trickCount: getCountryTrickCount(country.code)
    }))
    .filter(country => country.trickCount > 0)
    .sort((a, b) => b.trickCount - a.trickCount);

  return (
    <div className="country-chain-container">
      <div className="chain-header">
        <h4>🌍 Global Trick Chain</h4>
        <div className="total-countries">{countriesWithTricks.length} countries</div>
      </div>
      
      {/* Animated Bike Chain */}
      <div className="bike-chain">
        <div className="chain-track">
          {countriesWithTricks.map((country, index) => (
            <div
              key={country.code}
              className={`chain-link ${selectedCountry === country.code ? 'active' : ''}`}
              onClick={() => onCountrySelect(country.code)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="country-node">
                <span className="country-flag">{country.flag}</span>
                <div className="country-info">
                  <span className="country-name">{country.name}</span>
                  <span className="trick-count">{country.trickCount} tricks</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Chain Animation */}
        <div className="chain-animation">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="chain-segment" style={{ animationDelay: `${i * 0.05}s` }}>
              🔗
            </div>
          ))}
        </div>
      </div>

      {/* All Countries Button */}
      <button
        className={`all-countries-btn ${!selectedCountry ? 'active' : ''}`}
        onClick={() => onCountrySelect('')}
      >
        🌐 All Countries ({tricks.length} total tricks)
      </button>
      
      <style jsx>{`
        .country-chain-container {
          background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          border-radius: 20px;
          padding: 24px;
          margin: 20px 0;
          position: relative;
          overflow: hidden;
        }
        
        .chain-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          color: white;
        }
        
        .chain-header h4 {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 700;
        }
        
        .total-countries {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }
        
        .bike-chain {
          position: relative;
          margin: 24px 0;
        }
        
        .chain-track {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          position: relative;
          z-index: 2;
          justify-content: flex-start;
        }
        
        .chain-link {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: chainFloat 3s ease-in-out infinite;
          backdrop-filter: blur(10px);
          width: 70px;
          height: 70px;
          text-align: center;
        }
        
        .chain-link:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px) scale(1.02);
        }
        
        .chain-link.active {
          background: rgba(255, 255, 255, 0.3);
          border-color: #fbbf24;
          box-shadow: 0 0 15px rgba(251, 191, 36, 0.4);
        }
        
        
        .country-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          width: 100%;
          height: 100%;
          justify-content: center;
        }
        
        .country-flag {
          font-size: 1.4rem;
          animation: rotate 4s linear infinite;
        }
        
        .country-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        
        .country-name {
          color: white;
          font-weight: 600;
          font-size: 0.6rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1;
          max-width: 100%;
        }
        
        .trick-count {
          color: #fbbf24;
          font-size: 0.5rem;
          font-weight: 500;
          margin-top: 1px;
        }
        
        .chain-animation {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          opacity: 0.1;
          z-index: 1;
          pointer-events: none;
        }
        
        .chain-segment {
          font-size: 1.2rem;
          animation: chainMove 8s linear infinite;
        }
        
        .all-countries-btn {
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 16px;
          border-radius: 15px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 16px;
        }
        
        .all-countries-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
        }
        
        .all-countries-btn.active {
          background: #fbbf24;
          border-color: #f59e0b;
          color: #1e3a8a;
        }
        
        @keyframes chainFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes chainMove {
          0% { transform: translateX(-100px) rotate(0deg); }
          100% { transform: translateX(calc(100vw + 100px)) rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .country-chain-container {
            padding: 16px;
            margin: 16px 0;
          }
          
          .chain-header {
            flex-direction: column;
            gap: 8px;
            text-align: center;
            margin-bottom: 16px;
          }
          
          .chain-track {
            gap: 8px;
            justify-content: center;
          }
          
          .chain-link {
            width: 60px;
            height: 60px;
            padding: 4px;
          }
          
          .country-flag {
            font-size: 1.2rem;
          }
          
          .country-name {
            font-size: 0.55rem;
          }
          
          .trick-count {
            font-size: 0.45rem;
          }
        }
      `}</style>
    </div>
  );
}
