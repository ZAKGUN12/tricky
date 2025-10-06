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
import ReadabilityEnhancer from '../components/ReadabilityEnhancer';

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
    <ReadabilityEnhancer>
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

        <header className="compact-header">
          <div className="header-content">
            <h1>TrickShare</h1>
            <div className="tricks-counter">
              <span className="counter-number">{tricks.length}</span>
              <span className="counter-label">tricks</span>
            </div>
          </div>
        </header>

        <div className="main-content">
          <div className="sidebar">
            <TopTricks />
            <Leaderboard />
          </div>
          
          <div className="feed-container">
            <div className="controls">
              <input
                type="text"
                placeholder="🔍 Search tricks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search tricks"
              />
            </div>

            <CountryChain 
              selectedCountry={selectedCountry}
              onCountrySelect={setSelectedCountry}
              tricks={tricks}
            />

            {loading ? (
              <div className="loading" role="status" aria-live="polite">
                <div className="loading-spinner"></div>
                <span>Loading amazing tricks...</span>
              </div>
            ) : (
              <div className="tricks-feed" role="main">
                {filteredTricks.map(trick => {
                  const country = countries.find(c => c.code === trick.countryCode);
                  return (
                    <article key={trick.id} className="trick-card">
                      <header className="card-header">
                        <div className="author-info">
                          <span className="country-flag" role="img" aria-label={`Flag of ${country?.name}`}>
                            {country?.flag}
                          </span>
                          <div className="author-details">
                            <span className="author-name">{trick.authorName || 'Anonymous'}</span>
                            <span className="country-name">from {country?.name}</span>
                          </div>
                        </div>
                        <div className="difficulty-badge" title={`Difficulty: ${trick.difficulty}`}>
                          {trick.difficulty === 'easy' ? '🟢' : 
                           trick.difficulty === 'medium' ? '🟡' : '🔴'}
                        </div>
                      </header>
                      
                      <h2 className="trick-title">{trick.title}</h2>
                      <p className="trick-description">{trick.description}</p>
                      
                      <div className="trick-tags">
                        {(trick.tags || []).slice(0, 3).map(tag => (
                          <span key={tag} className="tag">#{tag}</span>
                        ))}
                      </div>
                      
                      <footer className="card-actions">
                        <button 
                          onClick={() => handleKudos(trick.id)}
                          className="action-btn kudos"
                          aria-label={`Give kudos to ${trick.title}`}
                        >
                          👍 {trick.kudos}
                        </button>
                        <span className="action-btn" aria-label={`${trick.comments} comments`}>
                          💬 {trick.comments}
                        </span>
                        <span className="action-btn" aria-label={`${trick.views} views`}>
                          👁️ {trick.views}
                        </span>
                        <Link 
                          href={`/trick/${trick.id}`} 
                          className="view-link"
                          aria-label={`View full details of ${trick.title}`}
                        >
                          View →
                        </Link>
                      </footer>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {filteredTricks.length === 0 && !loading && (
          <div className="empty-state" role="status">
            <h3>No tricks found</h3>
            <p>Try adjusting your search or filters to discover more tricks!</p>
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
          .loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--space-4);
            padding: var(--space-8);
            color: var(--gray-600);
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--gray-200);
            border-top: 3px solid var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .empty-state {
            text-align: center;
            padding: var(--space-8);
            color: var(--gray-600);
          }

          .empty-state h3 {
            margin-bottom: var(--space-2);
            color: var(--gray-800);
          }
        `}</style>
      </div>
    </ReadabilityEnhancer>
  );
}

export default function Home() {
  return (
    <Authenticator.Provider>
      <HomeContent />
    </Authenticator.Provider>
  );
}
