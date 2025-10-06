import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { Trick } from '../lib/types';
import { countries } from '../lib/mockData';
import { TrickShareAPI } from '../lib/api';
import CountryChain from '../components/CountryChain';
import TopTricks from '../components/TopTricks';
import UserRace from '../components/UserRace';
import UserStats from '../components/UserStats';
import Leaderboard from '../components/Leaderboard';

function HomeContent() {
  const { user, signOut } = useAuthenticator((context) => [context.user, context.signOut]);
  const [tricks, setTricks] = useState<Trick[]>([]);
  const [filteredTricks, setFilteredTricks] = useState<Trick[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

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
    const filtered = (tricks || []).filter(trick => {
      if (!trick) return false;
      
      const matchesCountry = !selectedCountry || trick.countryCode === selectedCountry;
      const matchesSearch = !searchQuery || 
        (trick.title && trick.title.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (trick.description && trick.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (trick.tags && Array.isArray(trick.tags) && trick.tags.some(tag => 
          tag && tag.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      
      return matchesCountry && matchesSearch;
    });
    setFilteredTricks(filtered);
  }, [selectedCountry, searchQuery, tricks]);

  const handleKudos = async (trickId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
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
      {user && (
        <div className="auth-header">
          <div className="user-info">
            <span>Welcome, {user.signInDetails?.loginId || 'User'}!</span>
            <UserStats userEmail={user.signInDetails?.loginId || user.username || ''} />
          </div>
          <button onClick={signOut} className="sign-out-btn">
            Sign Out
          </button>
        </div>
      )}

      <header className="hero">
        <div className="hero-decoration"></div>
        <div className="hero-decoration"></div>
        <div className="hero-decoration"></div>
        <h1>TrickShare</h1>
        <p>Discover life tricks from around the world</p>
        <div className="tricks-counter">
          <span className="counter-number">{tricks.length}</span>
          <span className="counter-label">tricks shared</span>
        </div>
      </header>

      <UserRace />

      <CountryChain 
        selectedCountry={selectedCountry}
        onCountrySelect={setSelectedCountry}
        tricks={tricks}
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
          <Leaderboard />
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
                      {(trick.tags || []).slice(0, 3).map(tag => (
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
        {user ? (
          <Link href="/submit" className="submit-btn">
            + Share Your Trick
          </Link>
        ) : (
          <button onClick={() => setShowAuthModal(true)} className="submit-btn">
            + Share Your Trick
          </button>
        )}
      </div>

      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Login Required</h2>
            <p>Please sign in to share tricks and give kudos.</p>
            <div className="modal-actions">
              <button onClick={() => setShowAuthModal(false)} className="cancel-btn">
                Cancel
              </button>
              <Link href="/login" className="login-btn">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .auth-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-md) var(--space-lg);
          background: var(--glass-bg);
          border-bottom: 1px solid var(--glass-border);
          backdrop-filter: blur(20px);
          margin-bottom: var(--space-lg);
        }

        .sign-out-btn {
          background: #e53e3e;
          color: white;
          border: none;
          padding: var(--space-sm) var(--space-lg);
          border-radius: var(--radius-md);
          cursor: pointer;
          font-weight: 600;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: var(--space-xl);
          border-radius: var(--radius-lg);
          text-align: center;
          max-width: 400px;
        }

        .modal-actions {
          display: flex;
          gap: var(--space-md);
          margin-top: var(--space-lg);
        }

        .cancel-btn, .login-btn {
          flex: 1;
          padding: var(--space-md);
          border-radius: var(--radius-md);
          text-decoration: none;
          text-align: center;
          font-weight: 600;
        }

        .cancel-btn {
          background: #f7fafc;
          border: 1px solid #e2e8f0;
          color: #4a5568;
        }

        .login-btn {
          background: var(--primary-gradient);
          color: white;
          border: none;
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  return (
    <Authenticator.Provider>
      <HomeContent />
    </Authenticator.Provider>
  );
}
