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
    <div className="country-chain">
      <div className="chain-container">
        <div className="chain-links">
          {countriesWithTricks.map((country, index) => (
            <button
              key={country.code}
              className={`chain-link ${selectedCountry === country.code ? 'active' : ''}`}
              onClick={() => onCountrySelect(selectedCountry === country.code ? '' : country.code)}
              title={`${country.name} - ${country.trickCount} tricks`}
              style={{ '--index': index } as React.CSSProperties}
            >
              <span className="flag">{country.flag}</span>
              <span className="count">{country.trickCount}</span>
            </button>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .country-chain {
          margin: 20px 0;
          overflow: hidden;
          position: relative;
        }
        
        .chain-container {
          position: relative;
          padding: 10px 0;
        }
        
        .chain-links {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          animation: chainFlow 20s linear infinite;
          flex-wrap: wrap;
        }
        
        .chain-link {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: 2px solid #4a5568;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          position: relative;
          animation: chainLink 3s ease-in-out infinite;
          animation-delay: calc(var(--index) * 0.2s);
        }
        
        .chain-link::before {
          content: '';
          position: absolute;
          right: -18px;
          top: 50%;
          transform: translateY(-50%);
          width: 12px;
          height: 3px;
          background: #4a5568;
          border-radius: 2px;
          z-index: -1;
        }
        
        .chain-link:last-child::before {
          display: none;
        }
        
        .chain-link:hover {
          transform: translateY(-3px) scale(1.1);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
        
        .chain-link.active {
          background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
          border-color: #d69e2e;
          transform: scale(1.15);
          box-shadow: 0 6px 16px rgba(255, 215, 0, 0.4);
        }
        
        .flag {
          font-size: 1.2rem;
          line-height: 1;
        }
        
        .count {
          font-size: 0.7rem;
          font-weight: 700;
          background: rgba(255,255,255,0.9);
          color: #2d3748;
          padding: 1px 4px;
          border-radius: 8px;
          min-width: 16px;
          text-align: center;
          line-height: 1;
        }
        
        .chain-link.active .count {
          background: rgba(0,0,0,0.8);
          color: white;
        }
        
        @keyframes chainLink {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        
        @keyframes chainFlow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-10px); }
        }
        
        @media (max-width: 768px) {
          .chain-links {
            gap: 8px;
            animation: none;
          }
          
          .chain-link {
            width: 50px;
            height: 50px;
          }
          
          .chain-link::before {
            right: -14px;
            width: 8px;
            height: 2px;
          }
          
          .flag {
            font-size: 1rem;
          }
          
          .count {
            font-size: 0.6rem;
            padding: 1px 3px;
          }
        }
      `}</style>
    </div>
  );
}
