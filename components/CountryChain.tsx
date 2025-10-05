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
          gap: 6px;
        }
        
        .chain-link {
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid transparent;
          border-radius: 10px;
          padding: 6px 10px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 5px;
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          min-width: 55px;
          position: relative;
          overflow: hidden;
          animation: chainFloat 3s ease-in-out infinite;
          animation-delay: calc(var(--index) * 0.1s);
        }
        
        .chain-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
          transition: left 0.5s;
        }
        
        .chain-link:hover {
          transform: translateY(-4px) scale(1.1);
          border-color: #667eea;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
          animation: none;
        }
        
        .chain-link:hover::before {
          left: 100%;
        }
        
        .chain-link.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          transform: scale(1.15);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          animation: activePulse 2s ease-in-out infinite;
        }
        
        .flag {
          font-size: 1.1rem;
          animation: flagWave 2s ease-in-out infinite;
        }
        
        .count {
          font-size: 0.7rem;
          font-weight: bold;
          background: rgba(0,0,0,0.1);
          padding: 1px 5px;
          border-radius: 8px;
          min-width: 18px;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .chain-link.active .count {
          background: rgba(255,255,255,0.25);
          animation: countBounce 1s ease-in-out infinite;
        }
        
        .connector {
          font-size: 0.7rem;
          opacity: 0.6;
          animation: connectorSpin 4s linear infinite;
        }
        
        .chain-link:last-child .connector {
          display: none;
        }
        
        @keyframes chainFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        
        @keyframes activePulse {
          0%, 100% { box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4); }
          50% { box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6); }
        }
        
        @keyframes flagWave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        
        @keyframes countBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes connectorSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
