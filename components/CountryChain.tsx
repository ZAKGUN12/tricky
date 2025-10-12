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
    <div className="country-chain-wrapper">
      <div className="chain-header">
        <div className="header-content">
          <h2 className="chain-title">🌍 Global Trick Network</h2>
          <p className="chain-subtitle">Discover life hacks from {countriesWithTricks.length} countries worldwide</p>
        </div>
        <div className="total-badge">
          <span className="total-number">{tricks.length}</span>
          <span className="total-label">Total Tricks</span>
        </div>
      </div>

      <div className="chain-container">
        <div className="chain-track">
          {countriesWithTricks.map((country, index) => (
            <button
              key={country.code}
              className={`country-link ${selectedCountry === country.code ? 'active' : ''}`}
              onClick={() => onCountrySelect(country.code)}
              style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
            >
              <div className="country-flag-wrapper">
                <span className="country-flag">{country.flag}</span>
                <div className="pulse-ring"></div>
              </div>
              <div className="country-details">
                <span className="country-name">{country.name}</span>
                <span className="trick-count">{country.trickCount} tricks</span>
              </div>
              <div className="connection-line"></div>
            </button>
          ))}
        </div>
      </div>

      <div className="chain-footer">
        <button
          className={`all-countries-button ${!selectedCountry ? 'active' : ''}`}
          onClick={() => onCountrySelect('')}
        >
          <div className="button-icon">🌐</div>
          <div className="button-content">
            <span className="button-title">View All Countries</span>
            <span className="button-subtitle">Browse {tricks.length} tricks globally</span>
          </div>
          <div className="button-arrow">→</div>
        </button>
      </div>

      <style jsx>{`
        .country-chain-wrapper {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
        }

        .country-chain-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%);
          pointer-events: none;
        }

        .chain-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          position: relative;
          z-index: 2;
        }

        .header-content {
          flex: 1;
        }

        .chain-title {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          margin: 0 0 8px 0;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          letter-spacing: -0.02em;
        }

        .chain-subtitle {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          font-weight: 500;
        }

        .total-badge {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          padding: 16px 24px;
          text-align: center;
          min-width: 120px;
        }

        .total-number {
          display: block;
          font-size: 2rem;
          font-weight: 800;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .total-label {
          display: block;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .chain-container {
          position: relative;
          z-index: 2;
        }

        .chain-track {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .country-link {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          animation: slideIn 0.6s ease-out var(--delay) both;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .country-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.8s ease;
        }

        .country-link:hover::before {
          left: 100%;
        }

        .country-link:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
        }

        .country-link.active {
          background: rgba(255, 255, 255, 0.25);
          border-color: #fbbf24;
          box-shadow: 0 0 0 2px #fbbf24, 0 12px 24px rgba(251, 191, 36, 0.3);
          transform: translateY(-2px);
        }

        .country-flag-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          flex-shrink: 0;
        }

        .country-flag {
          font-size: 2.5rem;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          transition: transform 0.3s ease;
          z-index: 2;
          position: relative;
        }

        .country-link:hover .country-flag {
          transform: scale(1.1) rotate(5deg);
        }

        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0;
          }
        }

        .country-details {
          flex: 1;
          min-width: 0;
        }

        .country-name {
          display: block;
          font-size: 1.125rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .trick-count {
          display: block;
          font-size: 0.875rem;
          color: #fbbf24;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .connection-line {
          width: 2px;
          height: 40px;
          background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.3), transparent);
          flex-shrink: 0;
        }

        .chain-footer {
          position: relative;
          z-index: 2;
        }

        .all-countries-button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .all-countries-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.8s ease;
        }

        .all-countries-button:hover::before {
          left: 100%;
        }

        .all-countries-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
        }

        .all-countries-button.active {
          background: #fbbf24;
          border-color: #f59e0b;
          color: #1e40af;
          box-shadow: 0 16px 32px rgba(251, 191, 36, 0.4);
        }

        .button-icon {
          font-size: 3rem;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          transition: transform 0.3s ease;
        }

        .all-countries-button:hover .button-icon {
          transform: scale(1.1) rotate(10deg);
        }

        .button-content {
          flex: 1;
          text-align: left;
        }

        .button-title {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          margin-bottom: 4px;
        }

        .all-countries-button.active .button-title {
          color: #1e40af;
          text-shadow: none;
        }

        .button-subtitle {
          display: block;
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .all-countries-button.active .button-subtitle {
          color: rgba(30, 64, 175, 0.8);
        }

        .button-arrow {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          transition: transform 0.3s ease;
        }

        .all-countries-button:hover .button-arrow {
          transform: translateX(4px);
        }

        .all-countries-button.active .button-arrow {
          color: #1e40af;
        }

        @media (max-width: 1024px) {
          .country-chain-wrapper {
            padding: 24px;
            margin-bottom: 24px;
          }

          .chain-title {
            font-size: 1.75rem;
          }

          .chain-subtitle {
            font-size: 1rem;
          }

          .chain-track {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 12px;
          }

          .country-link {
            padding: 16px;
            gap: 12px;
          }

          .country-flag-wrapper {
            width: 56px;
            height: 56px;
          }

          .country-flag {
            font-size: 2rem;
          }
        }

        @media (max-width: 768px) {
          .country-chain-wrapper {
            padding: 20px;
            margin-bottom: 20px;
          }

          .chain-header {
            flex-direction: column;
            gap: 16px;
            text-align: center;
            margin-bottom: 24px;
          }

          .chain-title {
            font-size: 1.5rem;
          }

          .chain-subtitle {
            font-size: 0.875rem;
          }

          .total-badge {
            align-self: center;
            min-width: 100px;
            padding: 12px 20px;
          }

          .total-number {
            font-size: 1.5rem;
          }

          .chain-track {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .country-link {
            padding: 12px;
            gap: 10px;
          }

          .country-flag-wrapper {
            width: 48px;
            height: 48px;
          }

          .country-flag {
            font-size: 1.75rem;
          }

          .country-name {
            font-size: 1rem;
          }

          .trick-count {
            font-size: 0.75rem;
          }

          .all-countries-button {
            padding: 20px;
            gap: 16px;
          }

          .button-icon {
            font-size: 2.5rem;
          }

          .button-title {
            font-size: 1.25rem;
          }

          .button-subtitle {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}
