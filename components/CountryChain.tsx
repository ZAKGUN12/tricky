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
    .sort((a, b) => b.trickCount - a.trickCount);

  const activeCountries = countriesWithTricks.filter(country => country.trickCount > 0);

  return (
    <div className="country-chain-wrapper compact">
      <div className="chain-header compact">
        <div className="header-left">
          <h3 className="chain-title">🌍 Global Network</h3>
        </div>
        <div className="header-right">
          <div className="counters-compact">
            <span className="counter-item">
              <span className="counter-number">{activeCountries.length}</span>
              <span className="counter-label">Countries</span>
            </span>
            <span className="counter-divider">•</span>
            <span className="counter-item">
              <span className="counter-number">{tricks.length}</span>
              <span className="counter-label">Tricks</span>
            </span>
          </div>
        </div>
      </div>

      <div className="chain-container compact">
        <div className="chain-track compact">
          {activeCountries.length > 0 ? (
            activeCountries.slice(0, 8).map((country, index) => (
              <button
                key={country.code}
                className={`country-link compact ${selectedCountry === country.code ? 'active' : ''}`}
                onClick={() => onCountrySelect(country.code)}
              >
                <span className="country-flag">{country.flag}</span>
                <span className="country-name">{country.name}</span>
                <span className="trick-count">{country.trickCount}</span>
              </button>
            ))
          ) : (
            <div className="loading-message">🌍 Loading...</div>
          )}
          
          {selectedCountry && (
            <button
              className="clear-filter-btn"
              onClick={() => onCountrySelect('')}
              title="Show all countries"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .country-chain-wrapper.compact {
          background: rgba(15, 15, 35, 0.8) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
          padding: 1rem !important;
          margin-bottom: 1rem !important;
          backdrop-filter: blur(10px) !important;
        }
        
        .chain-header.compact {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          margin-bottom: 0.75rem !important;
          padding: 0 !important;
        }
        
        .header-left .chain-title {
          font-size: 1rem !important;
          font-weight: 600 !important;
          color: white !important;
          margin: 0 !important;
        }
        
        .counters-compact {
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          font-size: 0.8rem !important;
        }
        
        .counter-item {
          display: flex !important;
          align-items: center !important;
          gap: 0.25rem !important;
        }
        
        .counter-number {
          color: #78dbff !important;
          font-weight: 700 !important;
        }
        
        .counter-label {
          color: rgba(255, 255, 255, 0.7) !important;
          font-size: 0.75rem !important;
        }
        
        .counter-divider {
          color: rgba(255, 255, 255, 0.5) !important;
        }
        
        .chain-container.compact {
          padding: 0 !important;
        }
        
        .chain-track.compact {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 0.5rem !important;
          align-items: center !important;
        }
        
        .country-link.compact {
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          padding: 0.5rem 0.75rem !important;
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 20px !important;
          color: white !important;
          font-size: 0.8rem !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          white-space: nowrap !important;
        }
        
        .country-link.compact:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(120, 119, 198, 0.3) !important;
          transform: translateY(-1px) !important;
        }
        
        .country-link.compact.active {
          background: rgba(120, 119, 198, 0.3) !important;
          border-color: rgba(120, 119, 198, 0.5) !important;
        }
        
        .country-flag {
          font-size: 1rem !important;
        }
        
        .country-name {
          font-weight: 500 !important;
        }
        
        .trick-count {
          background: rgba(120, 119, 198, 0.3) !important;
          color: #78dbff !important;
          padding: 0.125rem 0.375rem !important;
          border-radius: 10px !important;
          font-size: 0.7rem !important;
          font-weight: 600 !important;
        }
        
        .clear-filter-btn {
          background: rgba(255, 119, 198, 0.2) !important;
          border: 1px solid rgba(255, 119, 198, 0.3) !important;
          color: #ff77c6 !important;
          padding: 0.5rem 0.75rem !important;
          border-radius: 20px !important;
          font-size: 0.75rem !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }
        
        .clear-filter-btn:hover {
          background: rgba(255, 119, 198, 0.3) !important;
          transform: translateY(-1px) !important;
        }
        
        .loading-message {
          color: rgba(255, 255, 255, 0.7) !important;
          font-size: 0.9rem !important;
          padding: 1rem !important;
          text-align: center !important;
        }
        
        @media (max-width: 768px) {
          .chain-header.compact {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.5rem !important;
          }
          
          .counters-compact {
            font-size: 0.75rem !important;
          }
          
          .country-link.compact {
            font-size: 0.75rem !important;
            padding: 0.4rem 0.6rem !important;
          }
        }
      `}</style>
    </div>
  );
}
