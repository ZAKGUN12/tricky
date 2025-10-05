import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Trick } from '../lib/types';
import { mockTricks, countries } from '../lib/mockData';
import CountryChain from '../components/CountryChain';
import AnimatedCounter from '../components/AnimatedCounter';
import AuthWrapper from '../components/AuthWrapper';

function HomeContent() {
  const [tricks, setTricks] = useState<Trick[]>([]);
  const [filteredTricks, setFilteredTricks] = useState<Trick[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({
    totalTricks: 0,
    totalKudos: 0,
    totalViews: 0,
    totalCountries: 0
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    filterTricks();
  }, [selectedCountry, searchQuery, tricks]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setTricks(mockTricks);
      
      // Calculate stats
      const stats = {
        totalTricks: mockTricks.length,
        totalKudos: mockTricks.reduce((sum, trick) => sum + trick.kudos, 0),
        totalViews: mockTricks.reduce((sum, trick) => sum + trick.views, 0),
        totalCountries: countries.filter(c => c.tricks > 0).length
      };
      setTotalStats(stats);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTricks = () => {
    let filtered = tricks;
    
    if (selectedCountry) {
      filtered = filtered.filter(trick => trick.countryCode === selectedCountry);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(trick =>
        trick.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trick.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trick.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredTricks(filtered);
  };

  const handleKudos = async (trickId: string) => {
    setTricks(prev => prev.map(trick => 
      trick.id === trickId 
        ? { ...trick, kudos: trick.kudos + 1 }
        : trick
    ));
  };

  const handleFavorite = async (trickId: string) => {
    setTricks(prev => prev.map(trick => 
      trick.id === trickId 
        ? { ...trick, favorites: trick.favorites + 1 }
        : trick
    ));
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading amazing tricks from around the world...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🌍 TrickShare</h1>
        <p>Discover life tricks from around the world</p>
      </div>

      {/* Animated Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">
            <AnimatedCounter value={totalStats.totalTricks} duration={1200} />
          </div>
          <div className="stat-label">Global Tricks</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            <AnimatedCounter value={totalStats.totalKudos} duration={1500} />
          </div>
          <div className="stat-label">Total Kudos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            <AnimatedCounter value={totalStats.totalViews} duration={1800} />
          </div>
          <div className="stat-label">Total Views</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            <AnimatedCounter value={totalStats.totalCountries} duration={1000} />
          </div>
          <div className="stat-label">Countries</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search tricks, tags, or techniques..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Country Chain */}
      <CountryChain 
        selectedCountry={selectedCountry}
        onCountrySelect={setSelectedCountry}
      />

      {/* Tricks List */}
      <div className="tricks-container">
        {filteredTricks.length === 0 ? (
          <div className="empty-state">
            <h3>No tricks found</h3>
            <p>Try adjusting your search or country filter</p>
          </div>
        ) : (
          filteredTricks.map((trick, index) => (
            <div 
              key={trick.id} 
              className="trick-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="trick-title">{trick.title}</div>
              <div className="trick-description">{trick.description}</div>
              
              <ol className="trick-steps">
                {trick.steps.map((step, stepIndex) => (
                  <li key={stepIndex}>{step}</li>
                ))}
              </ol>
              
              <div className="trick-meta">
                <div className="trick-info">
                  <span>{countries.find(c => c.code === trick.countryCode)?.flag} {countries.find(c => c.code === trick.countryCode)?.name}</span>
                  <span>👤 {trick.authorName}</span>
                  <span>⏱️ {trick.timeEstimate}</span>
                  <span className={`difficulty-${trick.difficulty}`}>
                    {trick.difficulty === 'easy' ? '🟢' : trick.difficulty === 'medium' ? '🟡' : '🔴'} {trick.difficulty}
                  </span>
                </div>
                
                <div className="trick-actions">
                  <button 
                    className="action-btn"
                    onClick={() => handleKudos(trick.id)}
                  >
                    👍 <AnimatedCounter value={trick.kudos} duration={500} />
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => handleFavorite(trick.id)}
                  >
                    ⭐ <AnimatedCounter value={trick.favorites} duration={500} />
                  </button>
                  <button className="action-btn">
                    👁️ <AnimatedCounter value={trick.views} duration={500} />
                  </button>
                  <button className="action-btn">
                    💬 {trick.comments}
                  </button>
                </div>
              </div>
              
              <div style={{ marginTop: '15px' }}>
                {trick.tags.map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Navigation */}
      <nav className="nav">
        <Link href="/" className="nav-btn active">🏠 Home</Link>
        <Link href="/submit" className="nav-btn">➕ Submit</Link>
        <Link href="/profile" className="nav-btn">👤 Profile</Link>
      </nav>
    </div>
  );
}

export default function Home() {
  return (
    <AuthWrapper>
      <HomeContent />
    </AuthWrapper>
  );
}
