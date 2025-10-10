import { useState, useEffect, useCallback } from 'react';
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
import AdvancedSearch from '../components/AdvancedSearch';
import MobileNav from '../components/MobileNav';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Categories, { categories } from '../components/Categories';
import CategoryFilter from '../components/CategoryFilter';
import Timer from '../components/Timer';
import { useToast } from '../components/Toast';

function HomeContent() {
  const { user, signOut } = useAuthenticator((context) => [context.user, context.signOut]);
  const [tricks, setTricks] = useState<Trick[]>([]);
  const [filteredTricks, setFilteredTricks] = useState<Trick[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userKudos, setUserKudos] = useState<string[]>([]);
  const { showToast, ToastContainer } = useToast();

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

  const loadUserKudos = useCallback(async () => {
    if (!user?.signInDetails?.loginId) return;
    
    try {
      const data = await TrickShareAPI.getUserKudos(user.signInDetails.loginId);
      setUserKudos(data.kudoedTricks || []);
    } catch (error) {
      console.error('Error loading user kudos:', error);
    }
  }, [user?.signInDetails?.loginId]);

  useEffect(() => {
    if (user?.signInDetails?.loginId) {
      loadUserKudos();
    }
  }, [user, loadUserKudos]);

  useEffect(() => {
    if (!tricks || tricks.length === 0) {
      setFilteredTricks([]);
      return;
    }

    const filtered = tricks.filter(trick => {
      if (!trick) return false;
      
      // Country filter
      const matchesCountry = !selectedCountry || trick.countryCode === selectedCountry;
      
      // Category filter
      const matchesCategory = !selectedCategory || trick.category === selectedCategory;
      
      // Search filter - check if search query is empty
      if (!searchQuery || searchQuery.trim() === '') {
        return matchesCountry && matchesCategory;
      }
      
      const searchLower = searchQuery.toLowerCase().trim();
      
      const matchesSearch = 
        (trick.title && trick.title.toLowerCase().includes(searchLower)) || 
        (trick.description && trick.description.toLowerCase().includes(searchLower)) ||
        (trick.tags && Array.isArray(trick.tags) && trick.tags.some(tag => 
          tag && typeof tag === 'string' && tag.toLowerCase().includes(searchLower)
        )) ||
        (trick.authorName && trick.authorName.toLowerCase().includes(searchLower));
      
      return matchesCountry && matchesCategory && matchesSearch;
    });
    
    setFilteredTricks(filtered);
  }, [selectedCountry, selectedCategory, searchQuery, tricks]);

  const handleKudos = async (trickId: string) => {
    if (!user?.signInDetails?.loginId) {
      setShowAuthModal(true);
      return;
    }

    if (userKudos.includes(trickId)) {
      showToast('You already gave kudos to this trick', 'error');
      return;
    }
    
    try {
      await TrickShareAPI.giveKudos(trickId, user.signInDetails.loginId);
      setTricks(prev => prev.map(trick => 
        trick.id === trickId ? { ...trick, kudos: trick.kudos + 1 } : trick
      ));
      setUserKudos(prev => [...prev, trickId]);
      showToast('Kudos given! 👍', 'success');
    } catch (error: any) {
      console.error('Error giving kudos:', error);
      if (error.message?.includes('Already gave kudos')) {
        showToast('You already gave kudos to this trick', 'error');
      } else {
        showToast('Failed to give kudos', 'error');
      }
    }
  };

  return (
    <ReadabilityEnhancer>
      <Timer />
      <ToastContainer />
      <div className="container">
        {user && (
          <div className="auth-header">
            <div className="user-info">
              <span>Welcome, {user.signInDetails?.loginId || 'User'}!</span>
            </div>
            <button onClick={signOut} className="sign-out-btn">
              Sign Out
            </button>
          </div>
        )}

        <header className="compact-header">
          <div className="header-content">
            <Link 
              href="/submit" 
              className="header-share-btn"
              style={{
                background: '#00d4aa',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '1.1rem',
                border: 'none',
                boxShadow: '0 4px 15px rgba(0, 212, 170, 0.3)',
                animation: 'bounce 1.5s ease infinite',
                display: 'inline-block',
                margin: '0',
                lineHeight: 'normal'
              }}
            >
              ✨ Share Your Trick
            </Link>
            <div 
              className="tricks-counter"
              style={{
                background: 'linear-gradient(135deg, #333, #555)',
                color: '#00d4aa',
                padding: '8px 16px',
                borderRadius: '20px',
                border: '2px solid #00d4aa',
                boxShadow: '0 0 15px rgba(0, 212, 170, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '80px',
                animation: 'glow 2s ease-in-out infinite alternate'
              }}
            >
              <span 
                className="counter-number"
                style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#00d4aa',
                  textShadow: '0 0 10px rgba(0, 212, 170, 0.5)'
                }}
              >
                {tricks.length}
              </span>
              <span 
                className="counter-label"
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                tricks
              </span>
            </div>
          </div>
        </header>

        <div className="main-content">
          <div className="sidebar">
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
            <TopTricks />
            {user && (
              <UserStats userEmail={user.signInDetails?.loginId || user.username || ''} />
            )}
            <Leaderboard />
          </div>
          
          <div className="feed-container">
            <div className="controls">
              <AdvancedSearch 
                onSearch={async (query) => {
                  setSearchQuery(query);
                  // Use semantic search for better results
                  if (query.length > 2) {
                    try {
                      const semanticResults = await fetch(`/api/search/semantic?q=${encodeURIComponent(query)}&limit=20`);
                      const results = await semanticResults.json();
                      setFilteredTricks(results);
                    } catch (error) {
                      console.error('Semantic search failed:', error);
                      // Fallback to regular search
                      setSearchQuery(query);
                    }
                  }
                }}
                onFilter={(filters) => {
                  // Handle any additional filters
                  console.log('Additional filters:', filters);
                }}
              />
            </div>

            <CountryChain 
              selectedCountry={selectedCountry}
              onCountrySelect={setSelectedCountry}
              tricks={tricks}
            />

            {loading ? (
              <LoadingSkeleton count={5} />
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
                          className={`action-btn kudos ${userKudos.includes(trick.id) ? 'disabled' : ''}`}
                          disabled={userKudos.includes(trick.id)}
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

        <MobileNav />

        <style jsx>{`
          .main-content {
            display: flex;
            gap: 24px;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .sidebar {
            width: 300px;
            flex-shrink: 0;
          }
          
          .feed-container {
            flex: 1;
            min-width: 0;
          }
          
          @media (max-width: 768px) {
            .main-content {
              flex-direction: column;
              padding: 16px;
            }
            
            .sidebar {
              width: 100%;
              order: 2;
            }
            
            .feed-container {
              order: 1;
            }
          }
          
          .header-content .header-share-btn {
            background: #00d4aa !important;
            color: white !important;
            padding: 12px 24px !important;
            border-radius: 50px !important;
            text-decoration: none !important;
            font-weight: 700 !important;
            font-size: 1.1rem !important;
            border: none !important;
            box-shadow: 0 4px 15px rgba(0, 212, 170, 0.3) !important;
            animation: bounce 1.5s ease infinite !important;
            display: inline-block !important;
            margin: 0 !important;
            line-height: normal !important;
          }

          .header-content .header-share-btn:hover {
            animation-play-state: paused !important;
            transform: scale(1.05) !important;
            box-shadow: 0 6px 20px rgba(0, 212, 170, 0.4) !important;
            background: #00d4aa !important;
            color: white !important;
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }

          @keyframes glow {
            0% { 
              box-shadow: 0 0 15px rgba(0, 212, 170, 0.3);
              border-color: #00d4aa;
            }
            100% { 
              box-shadow: 0 0 25px rgba(0, 212, 170, 0.6);
              border-color: #00b894;
            }
          }

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
// Force deployment Tue Oct  7 15:08:33 CEST 2025
