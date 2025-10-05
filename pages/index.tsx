import { useState, useEffect } from 'react';
import { Trick } from '../lib/types';

const countries = [
  { code: '', name: '🌍 All', flag: '🌍' },
  { code: 'US', name: 'USA', flag: '🇺🇸' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' }
];

const sortOptions = [
  { value: 'kudos', label: '👍 Most Kudos' },
  { value: 'recent', label: '🕒 Most Recent' },
  { value: 'title', label: '🔤 A-Z' }
];

export default function Home() {
  const [tricks, setTricks] = useState<Trick[]>([]);
  const [filteredTricks, setFilteredTricks] = useState<Trick[]>([]);
  const [activeFilter, setActiveFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('kudos');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTricks();
  }, []);

  useEffect(() => {
    filterAndSortTricks();
  }, [tricks, activeFilter, searchQuery, sortBy]);

  const fetchTricks = async () => {
    setLoading(true);
    const params = activeFilter ? `?country=${activeFilter}` : '';
    const response = await fetch(`/api/tricks${params}`);
    const data = await response.json();
    setTricks(data.tricks || []);
    setLoading(false);
  };

  const filterAndSortTricks = () => {
    let filtered = [...tricks];

    // Apply country filter
    if (activeFilter) {
      filtered = filtered.filter(t => t.countryCode === activeFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(trick => 
        trick.title.toLowerCase().includes(query) ||
        trick.description.toLowerCase().includes(query) ||
        trick.tags.some(tag => tag.toLowerCase().includes(query)) ||
        trick.steps.some(step => step.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'kudos':
          return b.kudos - a.kudos;
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredTricks(filtered);
  };

  const giveKudos = async (trickId: string) => {
    // Optimistic update
    setTricks(prev => prev.map(trick => 
      trick.id === trickId ? { ...trick, kudos: trick.kudos + 1 } : trick
    ));
    
    await fetch(`/api/tricks/${trickId}/kudos`, { method: 'POST' });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  return (
    <div className="container">
      <header className="header">
        <h1>TrickShare</h1>
        <p>Life tricks from around the world ✨</p>
      </header>

      {/* Search Bar */}
      <div style={{ padding: '0 20px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍 Search tricks, tags, or countries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '25px',
            border: '2px solid rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '16px',
            outline: 'none'
          }}
        />
      </div>

      {/* Filters and Sort */}
      <div className="controls">
        <div className="filters">
          {countries.map(country => (
            <button
              key={country.code}
              className={`filter-btn ${activeFilter === country.code ? 'active' : ''}`}
              onClick={() => setActiveFilter(country.code)}
            >
              {country.flag} {country.name}
            </button>
          ))}
        </div>
        
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.3)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '20px',
            margin: '10px 20px'
          }}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value} style={{ color: '#333' }}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results Count */}
      <div style={{ padding: '0 20px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
        {searchQuery && `Found ${filteredTricks.length} tricks for "${searchQuery}"`}
        {!searchQuery && `${filteredTricks.length} tricks available`}
      </div>

      <main>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
            Loading amazing tricks...
          </div>
        ) : filteredTricks.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🤔</div>
            <h3>No tricks found</h3>
            <p>Try a different search or filter</p>
          </div>
        ) : (
          filteredTricks.map(trick => (
            <div key={trick.id} className="trick-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <h2 className="trick-title">{trick.title}</h2>
                <span style={{ fontSize: '12px', color: '#999', whiteSpace: 'nowrap', marginLeft: '10px' }}>
                  {getTimeAgo(trick.createdAt)}
                </span>
              </div>
              
              <p style={{ color: '#666', marginBottom: '15px' }}>{trick.description}</p>
              
              <ol className="trick-steps">
                {trick.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
              
              <div className="trick-meta">
                <span>{countries.find(c => c.code === trick.countryCode)?.flag} {trick.countryCode}</span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {trick.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="tag"
                      onClick={() => setSearchQuery(tag)}
                      style={{ cursor: 'pointer' }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <button 
                  className="kudos-btn"
                  onClick={() => giveKudos(trick.id)}
                >
                  👍 {trick.kudos}
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
