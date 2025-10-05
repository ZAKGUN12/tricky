import { countries } from '../lib/mockData';

interface CountryChainProps {
  selectedCountry: string;
  onCountrySelect: (countryCode: string) => void;
}

export default function CountryChain({ selectedCountry, onCountrySelect }: CountryChainProps) {
  return (
    <div className="country-chain">
      <div className="chain-links">
        {countries.slice(0, 8).map((country, index) => (
          <button
            key={country.code}
            className={`chain-link ${selectedCountry === country.code ? 'active' : ''}`}
            onClick={() => onCountrySelect(selectedCountry === country.code ? '' : country.code)}
            title={country.name}
          >
            <span className="flag">{country.flag}</span>
            <span className="connector">🔗</span>
          </button>
        ))}
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
          gap: 5px;
        }
        
        .chain-link {
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid transparent;
          border-radius: 15px;
          padding: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .chain-link:hover {
          transform: translateY(-2px);
          border-color: #667eea;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        
        .chain-link.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          transform: scale(1.1);
        }
        
        .flag {
          font-size: 1.5rem;
          margin-right: 5px;
        }
        
        .connector {
          font-size: 1rem;
          opacity: 0.6;
        }
        
        .chain-link:last-child .connector {
          display: none;
        }
        
        @media (max-width: 768px) {
          .chain-links {
            justify-content: center;
          }
          
          .chain-link {
            padding: 8px;
          }
          
          .flag {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}
