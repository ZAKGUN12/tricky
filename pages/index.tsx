import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trick } from '../lib/types';
import { countries } from '../lib/mockData';
import { TrickShareAPI } from '../lib/api';
import CountryChain from '../components/CountryChain';
import TopTricks from '../components/TopTricks';
import UserRace from '../components/UserRace';

function HomeContent() {
  const [tricks, setTricks] = useState<Trick[]>([]);
  const [filteredTricks, setFilteredTricks] = useState<Trick[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTricks();
  }, []);

  const loadTricks = async () => {
    try {
      const data = await TrickShareAPI.getTricks();
      setTricks(data);
      setFilteredTricks(data);
    } catch (error) {
      console.error('Error loading tricks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = tricks.filter(trick => 
      (!selectedCountry || trick.countryCode === selectedCountry) &&
      (!searchQuery || trick.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       trick.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredTricks(filtered);
  }, [selectedCountry, searchQuery, tricks]);

  const handleKudos = async (trickId: string) => {
    try {
      await TrickShareAPI.giveKudos(trickId);
      setTricks(prev => prev.map(trick => 
        trick.id === trickId ? { ...trick, kudos: trick.kudos + 1 } : trick
      ));
    } catch (error) {
      console.error('Error giving kudos:', error);
    }
  };

  return (
    <div className="container">
      <header className="hero">
        <div className="hero-decoration"></div>
        <div className="hero-decoration"></div>
        <div className="hero-decoration"></div>
        <h1>TrickShare</h1>
        <p>Discover life tricks from around the world</p>
      </header>

      <UserRace />

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

      <div className="main-content">
        <div className="left-sidebar">
          <TopTricks />
        </div>
        
        <div className="feed">
          {loading ? (
            <div className="loading">Loading tricks...</div>
          ) : (
            <div className="tricks-feed">
              {filteredTricks.map(trick => {
                const country = countries.find(c => c.code === trick.countryCode);
                return (
                  <div key={trick.id} className={`trick-post difficulty-${trick.difficulty}`}>
                    <div className="post-header">
                      <div className="author-info">
                        <span className="country-flag">{country?.flag}</span>
                        <span className="author-name">{trick.authorName || 'Anonymous'}</span>
                      </div>
                      <div className="post-meta">
                        <span className="difficulty-badge">
                          {trick.difficulty === 'easy' ? '🟢' : 
                           trick.difficulty === 'medium' ? '🟡' : '🔴'}
                        </span>
                        <span className="time">{trick.timeEstimate}</span>
                      </div>
                    </div>
                    
                    <h3 className="post-title">{trick.title}</h3>
                    <p className="post-description">{trick.description}</p>
                    
                    <div className="post-tags">
                      {trick.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>
                    
                    <div className="post-actions">
                      <button 
                        onClick={() => handleKudos(trick.id)}
                        className="action-btn kudos"
                      >
                        👍 {trick.kudos}
                      </button>
                      <span className="action-btn">💬 {trick.comments}</span>
                      <span className="action-btn">👁️ {trick.views}</span>
                      <Link href={`/trick/${trick.id}`} className="view-link">
                        View →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
