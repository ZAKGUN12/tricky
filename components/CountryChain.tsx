import { countries, mockTricks } from '../lib/mockData';

interface CountryChainProps {
  selectedCountry: string;
  onCountrySelect: (countryCode: string) => void;
}

export default function CountryChain({ selectedCountry, onCountrySelect }: CountryChainProps) {
  const getCountryTrickCount = (countryCode: string) => {
    return mockTricks.filter(trick => trick.countryCode === countryCode).length;
  };

  return (
    <div className="country-chain">
      <div className="chain-links">
        {countries.slice(0, 12).map((country, index) => {
          const trickCount = getCountryTrickCount(country.code);
          return (
            <button
              key={country.code}
              className={`chain-link ${selectedCountry === country.code ? 'active' : ''}`}
              onClick={() => onCountrySelect(selectedCountry === country.code ? '' : country.code)}
              title={`${country.name} - ${trickCount} tricks`}
              style={{ '--index': index } as React.CSSProperties}
            >
              <span className="flag">{country.flag}</span>
              <span className="count">{trickCount}</span>
              <span className="connector">🔗</span>
            </button>
          );
        })}
      </div>
      
      <style jsx>{`
        .country-chain {
          margin: 15px 0;
          text-align: center;
        }
        
        .chain-links {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .chain-link {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 6px 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 5px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          min-width: 50px;
        }
        
        .chain-link:hover {
          transform: translateY(-1px);
          border-color: #667eea;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
        }
        
        .chain-link.active {
          background: var(--primary-gradient);
          color: white;
          border-color: transparent;
        }
        
        .flag {
          font-size: 1.1rem;
        }
        
        .count {
          font-size: 0.7rem;
          font-weight: 600;
          background: rgba(0,0,0,0.1);
          padding: 1px 4px;
          border-radius: 6px;
          min-width: 16px;
          text-align: center;
        }
        
        .chain-link.active .count {
          background: rgba(255,255,255,0.2);
        }
        
        .connector {
          display: none;
        }
        
        @media (max-width: 768px) {
          .chain-links {
            gap: 6px;
          }
          
          .chain-link {
            padding: 4px 6px;
            min-width: 40px;
          }
          
          .flag {
            font-size: 1rem;
          }
          
          .count {
            font-size: 0.6rem;
            padding: 1px 3px;
          }
        }
        
        @media (max-width: 768px) {
          .chain-links {
            gap: 6px;
          }
          
          .chain-link {
            padding: 6px 8px;
            min-width: 50px;
          }
          
          .flag {
            font-size: 1.1rem;
          }
          
          .count {
            font-size: 0.7rem;
            padding: 1px 4px;
          }
        }
      `}</style>
    </div>
  );
}
