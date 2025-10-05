import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trick } from '../lib/types';
import { mockTricks, countries } from '../lib/mockData';
import CountryChain from '../components/CountryChain';

function HomeContent() {
  const [tricks, setTricks] = useState<Trick[]>(mockTricks);
  const [filteredTricks, setFilteredTricks] = useState<Trick[]>(mockTricks);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const filtered = tricks.filter(trick => 
      (!selectedCountry || trick.countryCode === selectedCountry) &&
      (!searchQuery || trick.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       trick.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredTricks(filtered);
  }, [selectedCountry, searchQuery, tricks]);

  const handleKudos = (trickId: string) => {
    setTricks(prev => prev.map(trick => 
      trick.id === trickId ? { ...trick, kudos: trick.kudos + 1 } : trick
    ));
  };

  return (
    <div className="container">
      <header className="hero">
        <h1>TrickShare</h1>
        <p>Discover life tricks from around the world</p>
      </header>

      <CountryChain 
        selectedCountry={selectedCountry}
        onCountrySelect={setSelectedCountry}
      />

      <div className="controls">
        <input
          type="text"
          placeholder="🔍 Search tricks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        
        <select 
          value={selectedCountry} 
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="country-select"
        >
          <option value="">🌍 All Countries</option>
          {countries.map(country => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="tricks-grid">
        {filteredTricks.map(trick => {
          const country = countries.find(c => c.code === trick.countryCode);
          return (
            <div key={trick.id} className="trick-card">
              <div className="trick-header">
                <span className="country-flag">{country?.flag}</span>
                <span className="difficulty-badge">
                  {trick.difficulty === 'easy' ? '🟢' : 
                   trick.difficulty === 'medium' ? '🟡' : '🔴'}
                </span>
              </div>
              
              <h3>{trick.title}</h3>
              <p>{trick.description}</p>
              
              <div className="trick-tags">
                {trick.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
              
              <div className="trick-actions">
                <button 
                  onClick={() => handleKudos(trick.id)}
                  className="kudos-btn"
                >
                  👍 {trick.kudos}
                </button>
                <Link href={`/trick/${trick.id}`} className="view-btn">
                  View →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTricks.length === 0 && (
        <div className="empty-state">
          <p>No tricks found. Try adjusting your filters.</p>
        </div>
      )}

      <div className="submit-section">
        <Link href="/submit" className="submit-btn">
          + Share Your Trick
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
