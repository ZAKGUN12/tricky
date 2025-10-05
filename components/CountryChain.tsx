import { countries } from '../lib/mockData';

interface CountryChainProps {
  selectedCountry: string;
  onCountrySelect: (countryCode: string) => void;
}

export default function CountryChain({ selectedCountry, onCountrySelect }: CountryChainProps) {
  return (
    <div className="country-chain">
      <button
        className={`country-btn ${selectedCountry === '' ? 'active' : ''}`}
        onClick={() => onCountrySelect('')}
      >
        🌍 All Countries
      </button>
      {countries.map((country, index) => (
        <button
          key={country.code}
          className={`country-btn ${selectedCountry === country.code ? 'active' : ''}`}
          onClick={() => onCountrySelect(country.code)}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <span className="country-flag">{country.flag}</span>
          <span className="country-name">{country.name}</span>
          {country.tricks > 0 && <span className="trick-count">({country.tricks})</span>}
        </button>
      ))}
    </div>
  );
}
