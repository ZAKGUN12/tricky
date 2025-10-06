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
          background: #15202b;
          border: 1px solid #38444d;
          border-radius: 16px;
          padding: 16px;
          margin: 16px 0;
        }
        
        .selector-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #38444d;
        }
        
        .selector-header h4 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
        }
        
        .total-countries {
          font-size: 0.85rem;
          color: #8b98a5;
          background: rgba(29, 155, 240, 0.1);
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
          background: #15202b;
        }
        
        .countries-grid::-webkit-scrollbar-thumb {
          background: #38444d;
          border-radius: 2px;
        }
        
        .country-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #15202b;
          border: 1px solid #38444d;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.85rem;
          font-weight: 500;
          color: #ffffff;
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
          background: linear-gradient(90deg, transparent, rgba(29, 155, 240, 0.1), transparent);
          transition: left 0.5s ease;
        }
        
        .country-pill:hover {
          transform: translateY(-2px);
          border-color: #1d9bf0;
          background: #1e2732;
        }
        
        .country-pill:hover::before {
          left: 100%;
        }
        
        .country-pill.active {
          background: #1d9bf0;
          border-color: #1d9bf0;
          color: white;
          transform: translateY(-1px);
        }
        
        .country-pill.active .pill-count {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }
        
        .all-countries {
          grid-column: 1 / -1;
          background: #1e2732;
          border-color: #38444d;
          font-weight: 600;
        }
        
        .all-countries.active {
          background: #1d9bf0;
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
          background: rgba(29, 155, 240, 0.2);
          color: #1d9bf0;
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
            padding: 8px;
            margin: 8px 0;
            min-height: 180px;
          }
          
          .selector-header {
            flex-direction: row;
            gap: 8px;
            align-items: center;
            margin-bottom: 8px;
            padding-bottom: 6px;
          }
          
          .selector-header h4 {
            font-size: 0.9rem;
          }
          
          .total-countries {
            font-size: 0.7rem;
            padding: 2px 6px;
          }
          
          .countries-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 4px;
            max-height: 120px;
          }
          
          .country-pill {
            padding: 4px 6px;
            font-size: 0.7rem;
            gap: 4px;
          }
          
          .pill-icon, .pill-flag {
            font-size: 0.8rem;
          }
          
          .pill-count {
            font-size: 0.6rem;
            padding: 1px 4px;
            min-width: 16px;
          }
          
          .all-countries {
            grid-column: 1 / -1;
          }
        }
        
        @media (max-width: 480px) {
          .countries-grid {
            grid-template-columns: 1fr 1fr;
            gap: 3px;
          }
          
          .country-pill {
            padding: 3px 4px;
            font-size: 0.65rem;
          }
          
          .pill-count {
            font-size: 0.55rem;
          }
        }
      `}</style>
    </div>
  );
}
