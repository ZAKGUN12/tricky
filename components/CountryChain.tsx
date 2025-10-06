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
    <div className="country-selector">
      <div className="selector-header">
        <h4>🌍 Explore by Country</h4>
        <div className="total-countries">{countriesWithTricks.length} countries</div>
      </div>
      
      <div className="countries-grid">
        <button
          className={`country-pill all-countries ${!selectedCountry ? 'active' : ''}`}
          onClick={() => onCountrySelect('')}
        >
          <span className="pill-icon">🌐</span>
          <span className="pill-text">All Countries</span>
          <span className="pill-count">{tricks.length}</span>
        </button>
        
        {countriesWithTricks.map((country) => (
          <button
            key={country.code}
            className={`country-pill ${selectedCountry === country.code ? 'active' : ''}`}
            onClick={() => onCountrySelect(selectedCountry === country.code ? '' : country.code)}
            title={`${country.name} - ${country.trickCount} tricks`}
          >
            <span className="pill-flag">{country.flag}</span>
            <span className="pill-text">{country.name}</span>
            <span className="pill-count">{country.trickCount}</span>
          </button>
        ))}
      </div>
      
      <style jsx>{`
        .country-selector {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 20px;
          margin: 16px 0;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .selector-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid rgba(102, 126, 234, 0.1);
        }
        
        .selector-header h4 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: #2d3748;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .total-countries {
          font-size: 0.85rem;
          color: #718096;
          background: rgba(102, 126, 234, 0.1);
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 600;
        }
        
        .countries-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 8px;
          max-height: 200px;
          overflow-y: auto;
          padding-right: 4px;
        }
        
        .countries-grid::-webkit-scrollbar {
          width: 4px;
        }
        
        .countries-grid::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 2px;
        }
        
        .countries-grid::-webkit-scrollbar-thumb {
          background: rgba(102, 126, 234, 0.3);
          border-radius: 2px;
        }
        
        .country-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.8);
          border: 1.5px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.85rem;
          font-weight: 500;
          color: #4a5568;
          position: relative;
          overflow: hidden;
        }
        
        .country-pill::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
          transition: left 0.5s ease;
        }
        
        .country-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
          border-color: rgba(102, 126, 234, 0.4);
          background: rgba(255, 255, 255, 1);
        }
        
        .country-pill:hover::before {
          left: 100%;
        }
        
        .country-pill.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-color: #667eea;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
        }
        
        .country-pill.active .pill-count {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }
        
        .all-countries {
          grid-column: 1 / -1;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
          border-color: rgba(102, 126, 234, 0.3);
          font-weight: 600;
        }
        
        .all-countries.active {
          background: linear-gradient(135deg, #2d3748, #4a5568);
        }
        
        .pill-icon, .pill-flag {
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        
        .pill-text {
          flex: 1;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .pill-count {
          background: rgba(102, 126, 234, 0.15);
          color: #667eea;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 700;
          min-width: 24px;
          text-align: center;
          flex-shrink: 0;
        }
        
        @media (max-width: 768px) {
          .country-selector {
            padding: 16px;
            margin: 12px 0;
          }
          
          .selector-header {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }
          
          .countries-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 6px;
            max-height: 160px;
          }
          
          .country-pill {
            padding: 6px 10px;
            font-size: 0.8rem;
            gap: 6px;
          }
          
          .pill-icon, .pill-flag {
            font-size: 1rem;
          }
          
          .pill-count {
            font-size: 0.7rem;
            padding: 1px 6px;
          }
        }
        
        @media (max-width: 480px) {
          .countries-grid {
            grid-template-columns: 1fr 1fr;
          }
          
          .all-countries {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </div>
  );
}
