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
          <h3 className="chain-title">🌍 Global Network</h3>
        </div>
        <div className="counters-section">
          <div className="calendar-badge">
            <div className="calendar-number">{countriesWithTricks.length}</div>
            <div className="calendar-label">Countries</div>
          </div>
          <div className="tricks-badge">
            <div className="tricks-number">{tricks.length}</div>
            <div className="tricks-label">Tricks</div>
          </div>
        </div>
      </div>

      <div className="chain-container">
        <div className="chain-track">
          {countriesWithTricks.map((country, index) => (
            <button
              key={country.code}
              className={`country-link ${selectedCountry === country.code ? 'active' : ''}`}
              onClick={() => onCountrySelect(country.code)}
              style={{ '--delay': `${index * 0.05}s` } as React.CSSProperties}
            >
              <span className="country-flag">{country.flag}</span>
              <div className="country-details">
                <span className="country-name">{country.name}</span>
                <span className="trick-count">{country.trickCount}</span>
              </div>
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
            <span className="button-title">All Countries</span>
          </div>
        </button>
      </div>

      <style jsx>{`
        .country-chain-wrapper {
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(120, 119, 198, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .country-chain-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .chain-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          position: relative;
          z-index: 2;
        }

        .header-content {
          flex: 1;
        }

        .chain-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          margin: 0 0 4px 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .chain-subtitle {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          font-weight: 500;
        }

        .counters-section {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .calendar-badge, .tricks-badge {
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(120, 119, 198, 0.4);
          border-radius: 8px;
          padding: 0;
          text-align: center;
          min-width: 60px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          position: relative;
        }

        .calendar-badge::before {
          content: '';
          position: absolute;
          top: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 8px;
          background: linear-gradient(135deg, #7877c6 0%, #ff77c6 100%);
          border-radius: 4px 4px 0 0;
        }

        .tricks-badge::before {
          content: '';
          position: absolute;
          top: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 8px;
          background: linear-gradient(135deg, #78dbff 0%, #7877c6 100%);
          border-radius: 4px 4px 0 0;
        }

        .calendar-number, .tricks-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #7877c6;
          padding: 8px 4px 2px 4px;
          line-height: 1;
        }

        .tricks-number {
          color: #78dbff;
        }

        .calendar-label, .tricks-label {
          font-size: 0.65rem;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 0 4px 6px 4px;
          border-top: 1px solid rgba(120, 119, 198, 0.2);
        }

        .chain-container {
          position: relative;
          z-index: 2;
        }

        .chain-track {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
          justify-content: flex-start;
        }

        .country-link {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          animation: slideIn 0.4s ease-out var(--delay) both;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(15px);
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
          transition: left 0.6s ease;
        }

        .country-link:hover::before {
          left: 100%;
        }

        .country-link:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .country-link.active {
          background: rgba(255, 255, 255, 0.25);
          border-color: #fbbf24;
          box-shadow: 0 0 0 1px #fbbf24, 0 4px 8px rgba(251, 191, 36, 0.2);
        }

        .country-flag {
          font-size: 1.5rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }

        .country-link:hover .country-flag {
          transform: scale(1.05);
        }

        .country-details {
          flex: 1;
          min-width: 0;
        }

        .country-name {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .trick-count {
          display: block;
          font-size: 0.75rem;
          color: #fbbf24;
          font-weight: 500;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .chain-footer {
          position: relative;
          z-index: 2;
        }

        .all-countries-button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
          transition: left 0.6s ease;
        }

        .all-countries-button:hover::before {
          left: 100%;
        }

        .all-countries-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .all-countries-button.active {
          background: #fbbf24;
          border-color: #f59e0b;
          color: #1e40af;
          box-shadow: 0 4px 8px rgba(251, 191, 36, 0.3);
        }

        .button-icon {
          font-size: 1.5rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
          transition: transform 0.2s ease;
        }

        .all-countries-button:hover .button-icon {
          transform: scale(1.05);
        }

        .button-content {
          flex: 1;
          text-align: left;
        }

        .button-title {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .all-countries-button.active .button-title {
          color: #1e40af;
          text-shadow: none;
        }

        @media (max-width: 1024px) {
          .country-chain-wrapper {
            padding: 16px;
            margin-bottom: 16px;
          }

          .chain-title {
            font-size: 1.125rem;
          }

          .chain-track {
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 6px;
          }

          .country-link {
            padding: 10px;
            gap: 6px;
          }

          .country-flag {
            font-size: 1.25rem;
          }
        }

        @media (max-width: 768px) {
          .country-chain-wrapper {
            padding: 12px;
            margin-bottom: 12px;
          }

          .chain-header {
            flex-direction: column;
            gap: 8px;
            text-align: center;
            margin-bottom: 12px;
          }

          .chain-title {
            font-size: 1rem;
          }

          .chain-subtitle {
            font-size: 0.75rem;
          }

          .total-badge {
            align-self: center;
            min-width: 40px;
            padding: 6px 10px;
          }

          .total-number {
            font-size: 1rem;
          }

          .chain-track {
            grid-template-columns: 1fr;
            gap: 4px;
          }

          .country-link {
            padding: 8px;
            gap: 6px;
          }

          .country-flag {
            font-size: 1.125rem;
          }

          .country-name {
            font-size: 0.75rem;
          }

          .trick-count {
            font-size: 0.625rem;
          }

          .all-countries-button {
            padding: 8px;
            gap: 8px;
          }

          .button-icon {
            font-size: 1.25rem;
          }

          .button-title {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
