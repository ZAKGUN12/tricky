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
        <h3 className="chain-title">🌍 Global Trick Network</h3>
        <div className="total-countries">{countriesWithTricks.length} countries active</div>
      </div>
      
      <div className="countries-grid">
        {countriesWithTricks.slice(0, 12).map((country, index) => (
          <button
            key={country.code}
            className={`country-node ${selectedCountry === country.code ? 'active' : ''}`}
            onClick={() => onCountrySelect(country.code)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <span className="country-flag">{country.flag}</span>
            <div className="country-info">
              <span className="country-name">{country.name}</span>
              <span className="trick-count">{country.trickCount}</span>
            </div>
          </button>
        ))}
      </div>

      <button
        className={`all-countries-btn ${!selectedCountry ? 'active' : ''}`}
        onClick={() => onCountrySelect('')}
      >
        <span className="globe-icon">🌐</span>
        <div className="btn-content">
          <span className="btn-text">All Countries</span>
          <span className="btn-count">{tricks.length} total tricks</span>
        </div>
      </button>
      
      <style jsx>{`
        .country-chain-container {
          background: linear-gradient(135deg, #1e40af, #3b82f6, #60a5fa);
          border-radius: var(--radius-2xl);
          padding: var(--space-8);
          margin-bottom: var(--space-6);
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-xl);
        }
        
        .country-chain-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
          opacity: 0.3;
          pointer-events: none;
        }
        
        .chain-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-8);
          position: relative;
          z-index: 2;
        }
        
        .chain-title {
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .total-countries {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .countries-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: var(--space-4);
          margin-bottom: var(--space-8);
          position: relative;
          z-index: 2;
        }
        
        .country-node {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-xl);
          padding: var(--space-4);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }
        
        .country-node::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s ease;
        }
        
        .country-node:hover::before {
          left: 100%;
        }
        
        .country-node:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }
        
        .country-node.active {
          background: rgba(255, 255, 255, 0.3);
          border-color: #fbbf24;
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
          transform: translateY(-2px);
        }
        
        .country-flag {
          font-size: 2rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
          transition: transform 0.3s ease;
        }
        
        .country-node:hover .country-flag {
          transform: scale(1.1) rotate(5deg);
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
          font-size: 0.875rem;
          line-height: 1.2;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .trick-count {
          color: #fbbf24;
          font-size: 0.75rem;
          font-weight: 700;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        .all-countries-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: var(--space-4);
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: var(--space-5);
          border-radius: var(--radius-xl);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          position: relative;
          z-index: 2;
          overflow: hidden;
        }
        
        .all-countries-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s ease;
        }
        
        .all-countries-btn:hover::before {
          left: 100%;
        }
        
        .all-countries-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }
        
        .all-countries-btn.active {
          background: #fbbf24;
          border-color: #f59e0b;
          color: #1e40af;
          box-shadow: 0 8px 25px rgba(251, 191, 36, 0.4);
        }
        
        .globe-icon {
          font-size: 2rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }
        
        .btn-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          flex: 1;
        }
        
        .btn-text {
          font-size: 1.125rem;
          font-weight: 700;
          line-height: 1.2;
        }
        
        .btn-count {
          font-size: 0.875rem;
          opacity: 0.9;
          font-weight: 500;
        }
        
        @media (max-width: 1024px) {
          .countries-grid {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: var(--space-3);
          }
          
          .country-node {
            padding: var(--space-3);
          }
          
          .country-flag {
            font-size: 1.75rem;
          }
        }
        
        @media (max-width: 768px) {
          .country-chain-container {
            padding: var(--space-6);
            margin-bottom: var(--space-4);
          }
          
          .chain-header {
            flex-direction: column;
            gap: var(--space-3);
            text-align: center;
            margin-bottom: var(--space-6);
          }
          
          .chain-title {
            font-size: 1.25rem;
          }
          
          .countries-grid {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: var(--space-2);
          }
          
          .country-node {
            flex-direction: column;
            text-align: center;
            padding: var(--space-3);
            gap: var(--space-2);
          }
          
          .country-flag {
            font-size: 1.5rem;
          }
          
          .country-name {
            font-size: 0.75rem;
          }
          
          .trick-count {
            font-size: 0.625rem;
          }
          
          .all-countries-btn {
            padding: var(--space-4);
            gap: var(--space-3);
          }
          
          .globe-icon {
            font-size: 1.5rem;
          }
          
          .btn-text {
            font-size: 1rem;
          }
          
          .btn-count {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
