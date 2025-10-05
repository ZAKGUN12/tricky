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
          margin: 20px 0;
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
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid transparent;
          border-radius: 12px;
          padding: 8px 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          min-width: 60px;
        }
        
        .chain-link:hover {
          transform: translateY(-3px);
          border-color: #667eea;
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
        }
        
        .chain-link.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        
        .flag {
          font-size: 1.3rem;
        }
        
        .count {
          font-size: 0.8rem;
          font-weight: bold;
          background: rgba(0,0,0,0.1);
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 20px;
          text-align: center;
        }
        
        .chain-link.active .count {
          background: rgba(255,255,255,0.2);
        }
        
        .connector {
          font-size: 0.8rem;
          opacity: 0.6;
        }
        
        .chain-link:last-child .connector {
          display: none;
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
