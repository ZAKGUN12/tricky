import { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Trick } from '../lib/types';

const countries = [
  { code: '', name: 'All', flag: '🌍' },
  { code: 'US', name: 'USA', flag: '🇺🇸' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'GB', name: 'UK', flag: '🇬🇧' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'KR', name: 'Korea', flag: '🇰🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' }
];

export default function Home() {
  const { user } = useAuthenticator((context) => [context.user]);
  const [tricks, setTricks] = useState<Trick[]>([]);
  const [filteredTricks, setFilteredTricks] = useState<Trick[]>([]);
  const [activeFilter, setActiveFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [userFavorites, setUserFavorites] = useState<string[]>([]);
  const [userKudos, setUserKudos] = useState<string[]>([]);
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    fetchTricks();
    if (user) fetchUserData();
  }, [user]);

  useEffect(() => {
    filterTricks();
  }, [tricks, activeFilter, searchQuery]);

  useEffect(() => {
    // Animate counter
    const target = filteredTricks.length;
    const duration = 800;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedCount(target);
        clearInterval(timer);
      } else {
        setAnimatedCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [filteredTricks.length]);

  const fetchTricks = async () => {
    setLoading(true);
    const response = await fetch('/api/tricks');
    const data = await response.json();
    setTricks(data.tricks || []);
    setLoading(false);
  };

  const fetchUserData = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/user/${user.userId}/data`);
      const data = await response.json();
      setUserFavorites(data.favorites || []);
      setUserKudos(data.kudos || []);
    } catch (error) {
      console.log('User data not available');
    }
  };

  const filterTricks = () => {
    let filtered = [...tricks];

    if (activeFilter) {
      filtered = filtered.filter(t => t.countryCode === activeFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(trick => 
        trick.title.toLowerCase().includes(query) ||
        trick.description.toLowerCase().includes(query) ||
        trick.tags.some(tag => tag.toLowerCase().includes(query)) ||
        trick.authorName?.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => b.kudos - a.kudos);
    setFilteredTricks(filtered);
  };

  const giveKudos = async (trickId: string) => {
    if (!user) {
      alert('Please sign in to give kudos!');
      return;
    }

    if (userKudos.includes(trickId)) return;

    setTricks(prev => prev.map(trick => 
      trick.id === trickId ? { ...trick, kudos: trick.kudos + 1 } : trick
    ));
    setUserKudos(prev => [...prev, trickId]);
    
    await fetch(`/api/tricks/${trickId}/kudos`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.userId })
    });
  };

  const toggleFavorite = async (trickId: string) => {
    if (!user) {
      alert('Please sign in to save favorites!');
      return;
    }

    const isFavorited = userFavorites.includes(trickId);
    
    setTricks(prev => prev.map(trick => 
      trick.id === trickId ? { 
        ...trick, 
        favorites: isFavorited ? trick.favorites - 1 : trick.favorites + 1 
      } : trick
    ));
    
    if (isFavorited) {
      setUserFavorites(prev => prev.filter(id => id !== trickId));
    } else {
      setUserFavorites(prev => [...prev, trickId]);
    }
    
    await fetch(`/api/tricks/${trickId}/favorite`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.userId })
    });
  };

  return (
    <div className="container">
      <header className="header">
        <h1>TrickShare</h1>
        <p>Discover life tricks from around the world</p>
        {user && (
          <div style={{ marginTop: '15px', fontSize: '14px', opacity: 0.9 }}>
            Welcome back, {user.signInDetails?.loginId?.split('@')[0]}! 👋
          </div>
        )}
      </header>

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search tricks, tags, or authors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="country-chain">
        {countries.map((country, index) => (
          <button
            key={country.code}
            className={`country-btn ${activeFilter === country.code ? 'active' : ''}`}
            onClick={() => setActiveFilter(country.code)}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            <span className="country-flag">{country.flag}</span>
            <span className="country-name">{country.name}</span>
          </button>
        ))}
      </div>

      <div className="counter-section">
        <div className="animated-counter">
          <span className="counter-number">{animatedCount}</span>
          <span className="counter-label">tricks found</span>
        </div>
      </div>

      <main>
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            Loading tricks...
          </div>
        ) : filteredTricks.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🤔</div>
            <h3>No tricks found</h3>
            <p>Try a different search or filter</p>
          </div>
        ) : (
          filteredTricks.map((trick, index) => (
            <div 
              key={trick.id} 
              className="trick-card"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <h2 className="trick-title">{trick.title}</h2>
              <p className="trick-description">{trick.description}</p>
              
              <ol className="trick-steps">
                {trick.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
              
              <div className="trick-meta">
                <div className="trick-info">
                  <span>{countries.find(c => c.code === trick.countryCode)?.flag} {trick.countryCode}</span>
                  <span>By {trick.authorName || 'Anonymous'}</span>
                  <span>{trick.views} views</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {trick.tags.slice(0, 3).map(tag => (
                      <span 
                        key={tag} 
                        className="tag"
                        onClick={() => setSearchQuery(tag)}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="trick-actions">
                  <button 
                    className={`action-btn ${userKudos.includes(trick.id) ? 'active' : ''}`}
                    onClick={() => giveKudos(trick.id)}
                    disabled={userKudos.includes(trick.id)}
                  >
                    👍 {trick.kudos}
                  </button>
                  
                  <button 
                    className={`action-btn ${userFavorites.includes(trick.id) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(trick.id)}
                  >
                    {userFavorites.includes(trick.id) ? '❤️' : '🤍'} {trick.favorites}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
