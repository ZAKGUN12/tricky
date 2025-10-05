import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Trick } from '../lib/types';
import { mockTricks, countries } from '../lib/mockData';
import CountryChain from '../components/CountryChain';
import AnimatedCounter from '../components/AnimatedCounter';
import TopTricks from '../components/TopTricks';
import { analytics, performanceMonitor } from '../lib/analytics';

function HomeContent() {
  const [tricks, setTricks] = useState<Trick[]>([]);
  const [filteredTricks, setFilteredTricks] = useState<Trick[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedTrickId, setSelectedTrickId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const tricksRef = useRef<HTMLDivElement>(null);
  const [totalStats, setTotalStats] = useState({
    totalTricks: 0,
    totalKudos: 0,
    totalViews: 0,
    totalCountries: 0
  });

  useEffect(() => {
    fetchUserData();
    analytics.trackPageView('home', 'TrickShare - Discover Life Tricks');
    performanceMonitor.startTiming('page_load');
  }, []);

  useEffect(() => {
    filterTricks();
  }, [selectedCountry, searchQuery, tricks, selectedTrickId, selectedTags, selectedDifficulty, selectedTimeRange]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      performanceMonitor.startTiming('data_fetch');
      
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
      
      performanceMonitor.endTiming('data_fetch');
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      performanceMonitor.endTiming('page_load');
    }
  };

  const filterTricks = () => {
    let filtered = tricks;
    
    // Filter by selected trick from Top 10
    if (selectedTrickId) {
      filtered = filtered.filter(trick => trick.id === selectedTrickId);
    } else {
      // Normal filtering
      if (selectedCountry) {
        filtered = filtered.filter(trick => trick.countryCode === selectedCountry);
        analytics.trackFilter('country', selectedCountry);
      }
      
      if (searchQuery) {
        filtered = filtered.filter(trick =>
          trick.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trick.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trick.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        analytics.trackSearch(searchQuery, filtered.length);
      }

      // Advanced filters
      if (selectedTags.length > 0) {
        filtered = filtered.filter(trick =>
          selectedTags.some(tag => trick.tags.includes(tag))
        );
        analytics.trackFilter('tags', selectedTags.join(','));
      }

      if (selectedDifficulty) {
        filtered = filtered.filter(trick => trick.difficulty === selectedDifficulty);
        analytics.trackFilter('difficulty', selectedDifficulty);
      }

      if (selectedTimeRange) {
        filtered = filtered.filter(trick => {
          const timeEstimate = trick.timeEstimate.toLowerCase();
          switch (selectedTimeRange) {
            case 'quick':
              return timeEstimate.includes('minute') && !timeEstimate.includes('hour');
            case 'medium':
              return timeEstimate.includes('hour') || timeEstimate.includes('30');
            case 'long':
              return timeEstimate.includes('hours') || timeEstimate.includes('days') || timeEstimate.includes('months') || timeEstimate.includes('years');
            default:
              return true;
          }
        });
        analytics.trackFilter('time_range', selectedTimeRange);
      }
    }
    
    setFilteredTricks(filtered);
  };

  // Get all unique tags from tricks
  const getAllTags = () => {
    const allTags = tricks.flatMap(trick => trick.tags);
    return [...new Set(allTags)].sort();
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setSelectedTrickId(''); // Clear trick selection
  };

  const clearAllFilters = () => {
    setSelectedTrickId('');
    setSelectedCountry('');
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedDifficulty('');
    setSelectedTimeRange('');
  };

  const handleTrickSelect = (trickId: string) => {
    setSelectedTrickId(selectedTrickId === trickId ? '' : trickId);
    setSelectedCountry(''); // Clear country filter
    setSearchQuery(''); // Clear search
    
    // Scroll to tricks section
    setTimeout(() => {
      tricksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setSelectedTrickId(''); // Clear trick selection
  };

  const handleKudos = async (trickId: string) => {
    const trick = tricks.find(t => t.id === trickId);
    if (trick) {
      analytics.trackTrickKudos(trickId, trick.title);
    }
    
    setTricks(prev => prev.map(trick => 
      trick.id === trickId 
        ? { ...trick, kudos: trick.kudos + 1 }
        : trick
    ));
  };

  const handleFavorite = async (trickId: string) => {
    const trick = tricks.find(t => t.id === trickId);
    if (trick) {
      analytics.trackTrickFavorite(trickId, trick.title);
    }
    
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
      {/* Header Section */}
      <div className="header">
        <h1>🌍 TrickShare</h1>
        <p>Discover life tricks from around the world</p>
      </div>

      {/* Stats Section */}
      <section className="stats-section">
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
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Search tricks, tags, or techniques..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedTrickId(''); // Clear trick selection when searching
            }}
          />
          <button 
            className="advanced-toggle"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            ⚙️ {showAdvancedFilters ? 'Hide' : 'Advanced'}
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="advanced-filters">
            {/* Tags Filter */}
            <div className="filter-group">
              <label className="filter-label">🏷️ Tags</label>
              <div className="tags-filter">
                {getAllTags().map(tag => (
                  <button
                    key={tag}
                    className={`tag-filter ${selectedTags.includes(tag) ? 'active' : ''}`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="filter-group">
              <label className="filter-label">📊 Difficulty</label>
              <div className="difficulty-filter">
                <button
                  className={`difficulty-btn ${selectedDifficulty === '' ? 'active' : ''}`}
                  onClick={() => setSelectedDifficulty('')}
                >
                  All
                </button>
                <button
                  className={`difficulty-btn easy ${selectedDifficulty === 'easy' ? 'active' : ''}`}
                  onClick={() => setSelectedDifficulty('easy')}
                >
                  🟢 Easy
                </button>
                <button
                  className={`difficulty-btn medium ${selectedDifficulty === 'medium' ? 'active' : ''}`}
                  onClick={() => setSelectedDifficulty('medium')}
                >
                  🟡 Medium
                </button>
                <button
                  className={`difficulty-btn hard ${selectedDifficulty === 'hard' ? 'active' : ''}`}
                  onClick={() => setSelectedDifficulty('hard')}
                >
                  🔴 Hard
                </button>
              </div>
            </div>

            {/* Time Range Filter */}
            <div className="filter-group">
              <label className="filter-label">⏱️ Time Required</label>
              <div className="time-filter">
                <button
                  className={`time-btn ${selectedTimeRange === '' ? 'active' : ''}`}
                  onClick={() => setSelectedTimeRange('')}
                >
                  Any Time
                </button>
                <button
                  className={`time-btn ${selectedTimeRange === 'quick' ? 'active' : ''}`}
                  onClick={() => setSelectedTimeRange('quick')}
                >
                  ⚡ Quick (&lt; 30 min)
                </button>
                <button
                  className={`time-btn ${selectedTimeRange === 'medium' ? 'active' : ''}`}
                  onClick={() => setSelectedTimeRange('medium')}
                >
                  ⏰ Medium (30 min - 2 hrs)
                </button>
                <button
                  className={`time-btn ${selectedTimeRange === 'long' ? 'active' : ''}`}
                  onClick={() => setSelectedTimeRange('long')}
                >
                  🕐 Long (2+ hrs)
                </button>
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedTags.length > 0 || selectedDifficulty || selectedTimeRange || searchQuery || selectedCountry) && (
              <div className="filter-actions">
                <button className="clear-filters" onClick={clearAllFilters}>
                  🔄 Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Country Filter Section */}
      <section className="filter-section">
        <CountryChain 
          selectedCountry={selectedCountry}
          onCountrySelect={handleCountrySelect}
        />
      </section>

      {/* Top 10 Section */}
      {selectedCountry === '' && !searchQuery && selectedTags.length === 0 && !selectedDifficulty && !selectedTimeRange && (
        <section className="top-tricks-section">
          <TopTricks 
            onTrickSelect={handleTrickSelect}
            selectedTrickId={selectedTrickId}
          />
        </section>
      )}

      {/* Tricks Section */}
      <section className="tricks-section" ref={tricksRef}>
        <div className="section-header">
          <h2>
            {selectedTrickId ? '🎯 Selected Trick' : 
             selectedCountry ? `🌍 Tricks from ${countries.find(c => c.code === selectedCountry)?.name}` :
             searchQuery ? `🔍 Search Results for "${searchQuery}"` :
             selectedTags.length > 0 ? `🏷️ Tagged: ${selectedTags.join(', ')}` :
             selectedDifficulty ? `📊 ${selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)} Tricks` :
             selectedTimeRange ? `⏱️ ${selectedTimeRange.charAt(0).toUpperCase() + selectedTimeRange.slice(1)} Duration` :
             '📚 All Tricks'}
          </h2>
          <p className="section-subtitle">
            {filteredTricks.length} trick{filteredTricks.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="tricks-grid">
          {filteredTricks.length === 0 ? (
            <div className="empty-state">
              <h3>No tricks found</h3>
              <p>Try adjusting your search or filters</p>
              {(selectedTrickId || selectedCountry || searchQuery || selectedTags.length > 0 || selectedDifficulty || selectedTimeRange) && (
                <button 
                  className="reset-btn"
                  onClick={clearAllFilters}
                >
                  🔄 Clear All Filters
                </button>
              )}
            </div>
          ) : (
            filteredTricks.map((trick, index) => (
              <Link 
                key={trick.id} 
                href={`/trick/${trick.id}`}
                className={`trick-card-link ${selectedTrickId === trick.id ? 'highlighted' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="trick-title">{trick.title}</div>
                <div className="trick-description">{trick.description}</div>
                
                {trick.steps.length > 0 ? (
                  <ol className="trick-steps">
                    {trick.steps.slice(0, 2).map((step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                    {trick.steps.length > 2 && (
                      <li style={{ opacity: 0.7, fontStyle: 'italic' }}>
                        +{trick.steps.length - 2} more steps...
                      </li>
                    )}
                  </ol>
                ) : (
                  <div className="trick-content">
                    <span className="content-type">💡 Quick Tip</span>
                  </div>
                )}
                
                <div className="trick-meta">
                  <div className="trick-info">
                    <span>{countries.find(c => c.code === trick.countryCode)?.flag}</span>
                    <span>{trick.difficulty === 'easy' ? '🟢' : trick.difficulty === 'medium' ? '🟡' : '🔴'}</span>
                    <span>{trick.timeEstimate}</span>
                  </div>
                  
                  <div className="trick-actions">
                    <button 
                      className="action-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        handleKudos(trick.id);
                      }}
                    >
                      👍 <AnimatedCounter value={trick.kudos} duration={300} />
                    </button>
                    <button 
                      className="action-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        handleFavorite(trick.id);
                      }}
                    >
                      ⭐ <AnimatedCounter value={trick.favorites} duration={300} />
                    </button>
                    <button className="action-btn" onClick={(e) => e.preventDefault()}>
                      💬 {trick.comments}
                    </button>
                  </div>
                </div>
                
                <div style={{ marginTop: '8px' }}>
                  {trick.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                  {trick.tags.length > 3 && (
                    <span className="tag">+{trick.tags.length - 3}</span>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

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
  return <HomeContent />;
}
