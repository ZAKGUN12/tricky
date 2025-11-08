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
    <div className="country-chain-wrapper">
      <div className="chain-header">
        <h3 className="chain-title">Global Network</h3>
        <div className="counters-section">
          <div className="calendar-badge">
            <div className="calendar-number">{activeCountries.length}</div>
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
          {activeCountries.length > 0 ? (
            activeCountries.map((country, index) => (
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
            ))
          ) : (
            <div className="no-countries-message">
              <span className="loading-icon">🌍</span>
              <span className="loading-text">Loading global network...</span>
            </div>
          )}
        </div>
      </div>

      <div className="chain-footer">
        <button
          className={`all-countries-button ${!selectedCountry ? 'active' : ''}`}
          onClick={() => onCountrySelect('')}
        >
          <span className="button-icon">🌐</span>
          <span className="button-title">All Countries</span>
        </button>
      </div>
    </div>
  );
}
