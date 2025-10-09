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
              <div className="link-connector"></div>
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
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
          position: relative;
          z-index: 2;
          justify-items: center;
        }
        
        .chain-link {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          padding: 16px 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: chainFloat 3s ease-in-out infinite;
          backdrop-filter: blur(10px);
          width: 100%;
          max-width: 280px;
          min-height: 80px;
          justify-content: flex-start;
        }
        
        .chain-link:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-3px) scale(1.02);
        }
        
        .chain-link.active {
          background: rgba(255, 255, 255, 0.3);
          border-color: #fbbf24;
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
        }
        
        .link-connector {
          width: 12px;
          height: 12px;
          background: #fbbf24;
          border-radius: 50%;
          margin-right: 16px;
          animation: pulse 2s infinite;
          flex-shrink: 0;
        }
        
        .country-node {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }
        
        .country-flag {
          font-size: 1.8rem;
          animation: rotate 4s linear infinite;
          flex-shrink: 0;
        }
        
        .country-info {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }
        
        .country-name {
          color: white;
          font-weight: 600;
          font-size: 1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .trick-count {
          color: #fbbf24;
          font-size: 0.85rem;
          font-weight: 500;
          margin-top: 2px;
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
            padding: 20px;
            margin: 16px 0;
          }
          
          .chain-header {
            flex-direction: column;
            gap: 12px;
            text-align: center;
            margin-bottom: 20px;
          }
          
          .chain-track {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .chain-link {
            padding: 12px 16px;
            min-height: 70px;
            max-width: none;
          }
          
          .country-flag {
            font-size: 1.5rem;
          }
          
          .country-name {
            font-size: 0.9rem;
          }
          
          .trick-count {
            font-size: 0.8rem;
          }
          
          .link-connector {
            width: 10px;
            height: 10px;
            margin-right: 12px;
          }
        }
      `}</style>
    </div>
  );
}
