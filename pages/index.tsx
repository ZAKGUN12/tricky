import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Trick } from '../lib/types';
import { countries } from '../lib/mockData';
import { useAuth } from '../components/AuthProvider';
import AdvancedSearch from '../components/AdvancedSearch';
import CountryChain from '../components/CountryChain';
import TopTricks from '../components/TopTricks';
import Categories from '../components/Categories';
import UserRace from '../components/UserRace';
import UserStats from '../components/UserStats';
import Leaderboard from '../components/Leaderboard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Timer from '../components/Timer';
import { useToast } from '../lib/useToast';

function HomeContent() {
  const [tricks, setTricks] = useState<Trick[]>([]);
  const [allTricks, setAllTricks] = useState<Trick[]>([]); // Keep all tricks for category counting
  const [filteredTricks, setFilteredTricks] = useState<Trick[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('hot');
  const [viewMode, setViewMode] = useState('card');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const { showToast, ToastContainer } = useToast();
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Memoize sorted tricks to prevent unnecessary re-renders
  const sortedTricks = useMemo(() => {
    const sorted = [...(tricks || [])];
    switch (sortBy) {
      case 'hot':
        return sorted.sort((a, b) => (b.kudos + b.views * 0.1) - (a.kudos + a.views * 0.1));
      case 'new':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'top':
        return sorted.sort((a, b) => b.kudos - a.kudos);
      case 'rising':
        return sorted.sort((a, b) => {
          const aScore = a.kudos / Math.max(1, Math.floor((Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60)));
          const bScore = b.kudos / Math.max(1, Math.floor((Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60)));
          return bScore - aScore;
        });
      default:
        return sorted;
    }
  }, [tricks, sortBy]);

  const fetchTricks = useCallback(async () => {
    try {
      setError(null);
      const params = new URLSearchParams();
      if (selectedCountry) params.append('country', selectedCountry);
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/tricks?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tricks: ${response.status}`);
      }
      
      const data = await response.json();
      setTricks(data);
      
      // Also fetch all tricks for category counting if we don't have them
      if (allTricks.length === 0 || (!selectedCountry && !selectedCategory && !searchQuery)) {
        setAllTricks(data);
      }
    } catch (error) {
      console.error('Error fetching tricks:', error);
      setError(error instanceof Error ? error.message : 'Failed to load tricks');
    } finally {
      setLoading(false);
    }
  }, [selectedCountry, selectedCategory, searchQuery, allTricks.length]);

  const handleUnauthenticatedAction = (e?: React.MouseEvent) => {
    if (!user) {
      if (e) e.preventDefault();
      showToast('Please sign in to interact with tricks', 'info');
      return true;
    }
    return false;
  };

  useEffect(() => {
    fetchTricks();
  }, [fetchTricks]);

  const handleKudos = async (trickId: string) => {
    if (handleUnauthenticatedAction()) return;

    try {
      await fetch(`/api/tricks/${trickId}/kudos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: user?.email })
      });
      
      setTricks(prev => prev.map(trick => 
        trick.id === trickId ? { ...trick, kudos: trick.kudos + 1 } : trick
      ));
      showToast('Kudos given! 👍', 'success');
    } catch (error: any) {
      showToast('Error giving kudos', 'error');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (filters: any) => {
    if (filters.country) setSelectedCountry(filters.country);
    if (filters.category) setSelectedCategory(filters.category);
  };

  const handleCountrySelect = (countryCode: string) => {
    if (handleUnauthenticatedAction()) return;
    setSelectedCountry(countryCode === selectedCountry ? '' : countryCode);
  };

  const handleCategorySelect = (category: string) => {
    if (handleUnauthenticatedAction()) return;
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  if (loading) {
    return (
      <div className="home">
        <div className="container">
          <LoadingSkeleton count={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <div className="container">
          <div className="error-state">
            <h2>🚨 Oops! Something went wrong</h2>
            <p>{error}</p>
            <button 
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchTricks();
              }}
              className="retry-button"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <ToastContainer />
      <div className="container">
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              <Timer />
            </div>
            <div className="header-center">
              {user ? (
                <Link 
                  href="/submit" 
                  className="share-btn"
                  style={{
                    background: 'rgba(15, 15, 35, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(120, 119, 198, 0.8)',
                    color: '#7877c6',
                    padding: '0.75rem 2rem',
                    borderRadius: 'var(--radius-full)',
                    textDecoration: 'none',
                    fontWeight: '600',
                    boxShadow: '0 4px 16px rgba(120, 119, 198, 0.4)',
                    textShadow: '0 0 10px rgba(120, 119, 198, 0.5)'
                  }}
                >
                  Share Your Trick
                </Link>
              ) : (
                <button 
                  onClick={() => router.push(`/signin?returnUrl=${encodeURIComponent('/submit')}`)}
                  className="share-btn"
                  style={{
                    background: 'rgba(15, 15, 35, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(120, 119, 198, 0.8)',
                    color: '#7877c6',
                    padding: '0.75rem 2rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '600',
                    boxShadow: '0 4px 16px rgba(120, 119, 198, 0.4)',
                    textShadow: '0 0 10px rgba(120, 119, 198, 0.5)',
                    cursor: 'pointer'
                  }}
                >
                  Share Your Trick
                </button>
              )}
            </div>
            <div className="header-right">
              <button 
                className="theme-toggle"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button 
                className="right-sidebar-toggle"
                onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                aria-label="Toggle right sidebar"
              >
                ⚙️
              </button>
              {user ? (
                <div className="user-section">
                  <span className="welcome">👋 {user.name}</span>
                  <button 
                    onClick={async () => {
                      if (confirm('Are you sure you want to sign out?')) {
                        await signOut();
                        router.push('/');
                      }
                    }}
                    className="sign-out-btn"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => router.push('/signin')}
                  className="login-btn"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="main-content">
          <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <button 
              className="sidebar-close"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label="Toggle sidebar"
            >
              {sidebarCollapsed ? '☰' : '✕'}
            </button>
            <Categories 
              selectedCategory={selectedCategory}
              onCategorySelect={(categoryId) => handleCategorySelect(categoryId || '')}
              tricks={allTricks}
            />
            <TopTricks />
            <Leaderboard />
          </div>

          <div className="content">
            <div className="search-section">
              <AdvancedSearch onSearch={handleSearch} onFilter={handleFilter} />
            </div>

            {/* Reddit-style controls */}
            <div className="reddit-controls">
              <div className="sort-controls">
                <button 
                  className={`sort-btn ${sortBy === 'hot' ? 'active' : ''}`}
                  onClick={() => setSortBy('hot')}
                >
                  🔥 Hot
                </button>
                <button 
                  className={`sort-btn ${sortBy === 'new' ? 'active' : ''}`}
                  onClick={() => setSortBy('new')}
                >
                  🆕 New
                </button>
                <button 
                  className={`sort-btn ${sortBy === 'top' ? 'active' : ''}`}
                  onClick={() => setSortBy('top')}
                >
                  ⭐ Top
                </button>
                <button 
                  className={`sort-btn ${sortBy === 'rising' ? 'active' : ''}`}
                  onClick={() => setSortBy('rising')}
                >
                  📈 Rising
                </button>
              </div>
              
              <div className="view-controls">
                <button 
                  className={`view-btn ${viewMode === 'card' ? 'active' : ''}`}
                  onClick={() => setViewMode('card')}
                  title="Card view"
                >
                  ⊞
                </button>
                <button 
                  className={`view-btn ${viewMode === 'compact' ? 'active' : ''}`}
                  onClick={() => setViewMode('compact')}
                  title="Compact view"
                >
                  ☰
                </button>
              </div>
            </div>

            <CountryChain 
              tricks={tricks}
              onCountrySelect={handleCountrySelect}
              selectedCountry={selectedCountry}
            />

            <div className={`tricks-grid ${viewMode === 'compact' ? 'compact-view' : 'card-view'}`}>
              {(sortedTricks || []).map((trick) => {
                const country = countries.find(c => c.code === trick.countryCode);
                return (
                  <div key={trick.id} className="trick-card reddit-style">
                    <div className="trick-votes">
                      <button 
                        onClick={() => handleKudos(trick.id)}
                        className="vote-btn upvote"
                        aria-label={`Give kudos to ${trick.title}`}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleKudos(trick.id);
                          }
                        }}
                      >
                        ▲
                      </button>
                      <span className="vote-count" aria-label={`${trick.kudos} kudos`}>{trick.kudos}</span>
                      <button className="vote-btn downvote" disabled aria-label="Downvote disabled">
                        ▼
                      </button>
                    </div>
                    
                    <div className="trick-content">
                      <div className="trick-meta">
                        <span className="country-flag">{country?.flag}</span>
                        <span className="subreddit">r/lifehacks</span>
                        <span className="author">• Posted by u/{trick.authorName}</span>
                        <span className="time">• {new Date(trick.createdAt).toLocaleDateString()}</span>
                        <span className={`difficulty-badge ${trick.difficulty}`}>
                          {trick.difficulty}
                        </span>
                      </div>
                      
                      <Link href={`/trick/${trick.id}`} className="trick-link">
                        <h3 className="trick-title">{trick.title}</h3>
                      </Link>
                      
                      <p className="trick-description">{trick.description}</p>
                      
                      <div className="trick-tags">
                        {trick.tags?.slice(0, 3).map((tag, index) => (
                          <span key={index} className="tag">#{tag}</span>
                        ))}
                      </div>

                      <div className="trick-actions">
                        <Link href={`/trick/${trick.id}`} className="action-btn comments">
                          💬 {trick.comments || 0} comments
                        </Link>
                        <button className="action-btn share">
                          📤 Share
                        </button>
                        <button className="action-btn save">
                          🔖 Save
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {(tricks || []).length === 0 && (
              <div className="no-tricks">
                <h3>No tricks found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>

          {rightSidebarOpen && (
            <div className="right-sidebar">
              <button 
                className="right-sidebar-close"
                onClick={() => setRightSidebarOpen(false)}
                aria-label="Close right sidebar"
              >
                ✕
              </button>
              <div className="reddit-sidebar-section">
                <div className="reddit-header">
                  <h3>Settings</h3>
                </div>
                <div className="reddit-content">
                  <div className="setting-item">
                    <span>Theme</span>
                    <button 
                      className="setting-btn"
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                      {theme === 'dark' ? 'Dark' : 'Light'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        :root {
          --text-primary: ${theme === 'dark' ? '#ffffff' : '#1a1a1a'};
          --text-secondary: ${theme === 'dark' ? '#e5e7eb' : '#4a4a4a'};
          --text-muted: ${theme === 'dark' ? '#9ca3af' : '#6b7280'};
          --bg-primary: ${theme === 'dark' ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'};
          --surface-glass: ${theme === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)'};
          --border-light: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
        }

        /* Error state styles */
        .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          text-align: center;
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 119, 198, 0.3);
          border-radius: 16px;
          padding: 2rem;
          margin: 2rem;
        }
        
        .retry-button {
          background: rgba(120, 119, 198, 0.8);
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 1rem;
          transition: all 0.2s ease;
        }
        
        .retry-button:hover {
          background: rgba(120, 119, 198, 1);
          transform: scale(1.05);
        }

        /* Accessibility improvements */
        .vote-btn:focus,
        .sort-btn:focus,
        .view-btn:focus,
        .action-btn:focus {
          outline: 2px solid #7877c6;
          outline-offset: 2px;
        }

        .vote-btn:focus-visible,
        .sort-btn:focus-visible,
        .view-btn:focus-visible,
        .action-btn:focus-visible {
          outline: 2px solid #7877c6;
          outline-offset: 2px;
          box-shadow: 0 0 0 4px rgba(120, 119, 198, 0.3);
        }

        .home {
          min-height: 100vh;
          background: var(--bg-primary);
          color: var(--text-primary);
          position: relative;
        }

        .theme-toggle, .right-sidebar-toggle {
          background: rgba(120, 119, 198, 0.2);
          border: 1px solid rgba(120, 119, 198, 0.4);
          color: #ffffff;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          margin-right: 0.5rem;
          transition: all 0.2s ease;
        }

        .theme-toggle:hover, .right-sidebar-toggle:hover {
          background: rgba(120, 119, 198, 0.3);
          transform: scale(1.05);
        }

        .right-sidebar {
          position: fixed;
          right: 1rem;
          top: 140px;
          width: 300px;
          height: calc(100vh - 160px);
          overflow-y: auto;
          z-index: 500;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .right-sidebar {
            position: fixed;
            top: 0;
            right: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(10px);
            padding: 2rem;
          }
        }

        .right-sidebar-close {
          position: absolute;
          top: -10px;
          left: -10px;
          background: rgba(120, 119, 198, 0.8);
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .right-sidebar-close:hover {
          background: rgba(120, 119, 198, 1);
          transform: scale(1.1);
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid var(--border-light);
        }

        .setting-btn {
          background: rgba(120, 119, 198, 0.2);
          border: 1px solid rgba(120, 119, 198, 0.4);
          color: var(--text-primary);
          padding: 4px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .setting-btn:hover {
          background: rgba(120, 119, 198, 0.3);
        }

        .home::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.4) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.4) 0%, transparent 50%),
                      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
          pointer-events: none;
          z-index: -1;
          animation: float 20s ease-in-out infinite;
        }

        .home::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, rgba(120, 219, 255, 0.8), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255, 119, 198, 0.6), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(120, 119, 198, 0.9), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(120, 219, 255, 0.7), transparent),
            radial-gradient(2px 2px at 160px 30px, rgba(255, 119, 198, 0.5), transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
          pointer-events: none;
          z-index: -1;
          animation: sparkle 15s linear infinite;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(1deg); }
          66% { transform: translateY(10px) rotate(-1deg); }
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .header {
          background: rgba(15, 15, 35, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 1rem 2rem;
          border: 1px solid rgba(120, 119, 198, 0.3);
          position: fixed;
          top: 1rem;
          left: 1rem;
          right: 1rem;
          z-index: 1000;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .main-content {
          margin-top: 120px;
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
          padding: 0 2rem;
          align-items: start;
        }

        .header-content {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 2rem;
          height: 100%;
        }

        .sidebar {
          position: sticky;
          top: 140px;
          height: calc(100vh - 160px);
          overflow-y: auto;
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(120, 119, 198, 0.3);
          border-radius: 16px;
          padding: 1rem;
        }

        .header-left {
          justify-self: start;
          display: flex;
          align-items: center;
        }

        .header-center {
          justify-self: center;
          display: flex;
          align-items: center;
        }

        .header-right {
          justify-self: end;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header .share-btn,
        .header-center .share-btn,
        a.share-btn {
          background: rgba(15, 15, 35, 0.8) !important;
          backdrop-filter: blur(20px) !important;
          border: 2px solid rgba(120, 119, 198, 0.8) !important;
          color: #7877c6 !important;
          padding: 0.75rem 2rem !important;
          border-radius: var(--radius-full) !important;
          text-decoration: none !important;
          font-weight: 600 !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 4px 16px rgba(120, 119, 198, 0.4) !important;
          text-shadow: 0 0 10px rgba(120, 119, 198, 0.5) !important;
          position: relative !important;
        }

        .header .share-btn:hover,
        .header-center .share-btn:hover,
        a.share-btn:hover {
          background: rgba(120, 119, 198, 0.2) !important;
          border-color: rgba(120, 119, 198, 0.8) !important;
          color: #8988d4 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 24px rgba(120, 119, 198, 0.4) !important;
          text-shadow: 0 0 15px rgba(120, 119, 198, 0.8) !important;
        }

        .header .tricks-counter,
        .header-right .tricks-counter {
          background: rgba(15, 15, 35, 0.8) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(120, 219, 255, 0.3) !important;
          padding: 0.5rem 1rem !important;
          border-radius: var(--radius-full) !important;
          font-weight: 600 !important;
          color: #78dbff !important;
          box-shadow: 0 4px 16px rgba(120, 219, 255, 0.2) !important;
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(120, 119, 198, 0.3);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          box-shadow: 0 4px 16px rgba(120, 119, 198, 0.2);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(120, 119, 198, 0.3);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          box-shadow: 0 4px 16px rgba(120, 119, 198, 0.2);
        }

        .welcome {
          color: #7877c6;
          font-weight: 600;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .sign-out-btn {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }

        .sign-out-btn:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }

        .login-btn {
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(120, 219, 255, 0.3);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-weight: 600;
          color: #78dbff;
          box-shadow: 0 4px 16px rgba(120, 219, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .login-btn:hover {
          background: rgba(120, 219, 255, 0.2);
          transform: translateY(-1px);
        }

        .main-content {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 2rem;
          margin: 2rem 0;
          align-items: start;
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: sticky;
          top: 140px;
          height: calc(100vh - 160px);
          overflow-y: auto;
          padding-right: 0.5rem;
          scrollbar-width: thin;
          scrollbar-color: rgba(120, 119, 198, 0.5) transparent;
          z-index: 10;
          width: 300px;
          transition: all 0.3s ease;
        }

        .sidebar.collapsed {
          width: 60px;
          overflow: hidden;
        }

        .sidebar-close {
          position: absolute;
          top: -10px;
          right: -10px;
          background: rgba(120, 119, 198, 0.8);
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .sidebar-close:hover {
          background: rgba(120, 119, 198, 1);
          transform: scale(1.1);
        }

        .content {
          margin-left: 320px;
          transition: margin-left 0.3s ease;
        }

        .sidebar.collapsed + .content {
          margin-left: 80px;
        }

        .sidebar.collapsed .reddit-sidebar-section {
          width: 60px;
          padding: 0;
        }

        .sidebar.collapsed .reddit-header {
          padding: 12px 8px;
          text-align: center;
        }

        .sidebar.collapsed .reddit-header h3 {
          display: none;
        }

        .sidebar.collapsed .reddit-item {
          padding: 8px;
          justify-content: center;
        }

        .sidebar.collapsed .reddit-name,
        .sidebar.collapsed .reddit-count {
          display: none;
        }

        .sidebar.collapsed .reddit-icon {
          margin: 0;
        }

        /* Reddit-style sidebar sections */
        .sidebar > * {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: rgba(120, 119, 198, 0.5);
          border-radius: 3px;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
          background: rgba(120, 119, 198, 0.7);
        }

        /* Reddit-style sidebar components */
        .reddit-sidebar-section {
          background: var(--surface-glass) !important;
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .reddit-header {
          background: rgba(120, 119, 198, 0.1);
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-light);
        }

        .reddit-header h3 {
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 600;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .reddit-content {
          padding: 8px 0;
        }

        .reddit-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 8px 16px;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .reddit-item:hover {
          background: rgba(120, 119, 198, 0.1);
        }

        .reddit-item.active {
          background: rgba(120, 119, 198, 0.2);
          color: var(--text-primary);
          border-right: 3px solid #7877c6;
        }

        .reddit-icon {
          margin-right: 12px;
          font-size: 16px;
        }

        .reddit-name {
          flex: 1;
          font-weight: 500;
        }

        .reddit-count {
          color: var(--text-muted);
          font-size: 12px;
          background: var(--border-light);
          padding: 2px 6px;
          border-radius: 10px;
        }

        .content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .search-section {
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(20px);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          border: 1px solid rgba(120, 119, 198, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          margin-bottom: var(--space-4);
        }

        .reddit-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--surface-glass);
          backdrop-filter: var(--blur-md);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: var(--space-3);
          margin-bottom: var(--space-4);
          box-shadow: var(--shadow-md);
        }

        .sort-controls {
          display: flex;
          gap: var(--space-1);
        }

        .sort-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .sort-btn:hover {
          background: var(--gray-300);
          color: var(--text-secondary);
        }

        .sort-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: var(--shadow-glow-primary);
        }

        .view-controls {
          display: flex;
          gap: var(--space-1);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .view-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          padding: var(--space-2);
          font-size: var(--text-lg);
          cursor: pointer;
          transition: var(--transition-fast);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .view-btn:hover {
          background: var(--gray-300);
          color: var(--text-secondary);
        }

        .view-btn.active {
          background: var(--primary);
          color: white;
        }

        .tricks-grid.compact-view {
          gap: var(--space-1);
        }

        .tricks-grid.compact-view .trick-card.reddit-style {
          padding: 0;
        }

        .tricks-grid.compact-view .trick-votes {
          min-width: 50px;
          padding: var(--space-2);
        }

        .tricks-grid.compact-view .trick-content {
          padding: var(--space-3);
        }

        .tricks-grid.compact-view .trick-title {
          font-size: var(--text-base);
          margin-bottom: var(--space-1);
        }

        .tricks-grid.compact-view .trick-description {
          display: none;
        }

        .tricks-grid.compact-view .trick-tags {
          margin-bottom: var(--space-2);
        }

        .tricks-grid {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          max-width: 800px;
          margin: 0 auto;
        }

        .trick-card.reddit-style {
          display: flex;
          background: var(--surface-glass);
          backdrop-filter: var(--blur-md);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 0;
          box-shadow: var(--shadow-md);
          transition: var(--transition-base);
          overflow: hidden;
        }

        .trick-card.reddit-style:hover {
          border-color: var(--border-medium);
          box-shadow: var(--shadow-lg);
        }

        .trick-votes {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--space-3);
          background: var(--surface-elevated);
          border-right: 1px solid var(--border-light);
          min-width: 60px;
        }

        .vote-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: var(--text-lg);
          cursor: pointer;
          padding: var(--space-1);
          transition: var(--transition-fast);
          border-radius: var(--radius-sm);
        }

        .vote-btn.upvote:hover {
          color: var(--accent);
          background: var(--accent-light);
        }

        .vote-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .vote-count {
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin: var(--space-1) 0;
          font-size: var(--text-sm);
        }

        .trick-content {
          flex: 1;
          padding: var(--space-4);
        }

        .trick-meta {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-2);
          font-size: var(--text-xs);
          color: var(--text-muted);
          flex-wrap: wrap;
        }

        .subreddit {
          color: var(--primary);
          font-weight: var(--font-semibold);
        }

        .trick-title {
          font-size: var(--text-lg);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin-bottom: var(--space-2);
          line-height: var(--leading-tight);
        }

        .trick-link {
          text-decoration: none;
          color: inherit;
        }

        .trick-link:hover .trick-title {
          color: var(--primary);
        }

        .trick-description {
          color: var(--text-secondary);
          margin-bottom: var(--space-3);
          line-height: var(--leading-normal);
          font-size: var(--text-sm);
        }

        .trick-tags {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-3);
          flex-wrap: wrap;
        }

        .tag {
          background: var(--primary-light);
          color: var(--primary);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: var(--font-medium);
        }

        .trick-actions {
          display: flex;
          gap: var(--space-4);
          align-items: center;
        }

        .action-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: var(--text-xs);
          cursor: pointer;
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-sm);
          transition: var(--transition-fast);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }

        .action-btn:hover {
          background: var(--gray-300);
          color: var(--text-secondary);
        }

        .difficulty-badge {
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-sm);
          font-size: var(--text-xs);
          font-weight: var(--font-medium);
          text-transform: uppercase;
        }

        .difficulty-badge.easy {
          background: var(--success);
          color: white;
        }

        .difficulty-badge.medium {
          background: var(--warning);
          color: white;
        }

        .difficulty-badge.hard {
          background: var(--error);
          color: white;
        }

        .trick-card {
          background: rgba(15, 15, 35, 0.85);
          backdrop-filter: blur(25px);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          border: 1px solid rgba(120, 119, 198, 0.3);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(120, 119, 198, 0.1);
          position: relative;
          overflow: hidden;
        }

        .trick-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(120, 119, 198, 0.15), transparent);
          transition: left 0.6s;
        }

        .trick-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #7877c6, #ff77c6, #78dbff);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .trick-card:hover::before {
          left: 100%;
        }

        .trick-card:hover::after {
          opacity: 1;
        }

        .trick-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 60px rgba(120, 119, 198, 0.4), 0 0 40px rgba(120, 119, 198, 0.2);
          border-color: rgba(120, 119, 198, 0.6);
        }

        .trick-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          position: relative;
          z-index: 2;
        }

        .country-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(120, 119, 198, 0.15);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          border: 1px solid rgba(120, 119, 198, 0.3);
          backdrop-filter: blur(10px);
        }

        .flag {
          font-size: 1.5rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .country-name {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .difficulty {
          position: relative;
        }

        .difficulty-badge {
          padding: 0.4rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: relative;
          overflow: hidden;
        }

        .difficulty-badge::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: inherit;
          opacity: 0.8;
          z-index: -1;
        }

        .difficulty-badge.easy {
          background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .difficulty-badge.medium {
          background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        }

        .difficulty-badge.hard {
          background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }

        .trick-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .trick-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .trick-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .tag {
          background: rgba(120, 119, 198, 0.2);
          color: #7877c6;
          padding: 0.3rem 0.8rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid rgba(120, 119, 198, 0.3);
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .tag::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(120, 119, 198, 0.3), transparent);
          transition: left 0.3s;
        }

        .tag:hover::before {
          left: 100%;
        }

        .tag:hover {
          background: rgba(120, 119, 198, 0.3);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(120, 119, 198, 0.2);
        }

        .trick-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(120, 119, 198, 0.2);
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .author-info::before {
          content: '👤';
          opacity: 0.7;
        }

        .trick-actions {
          display: flex;
          gap: 0.75rem;
        }

        .action-btn {
          padding: 0.6rem 1.2rem;
          border-radius: var(--radius-full);
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          position: relative;
          overflow: hidden;
        }

        .action-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.4s;
        }

        .action-btn:hover::before {
          left: 100%;
        }

        .action-btn.kudos {
          background: linear-gradient(135deg, #78dbff 0%, #7877c6 100%);
          color: white;
          box-shadow: 0 4px 16px rgba(120, 219, 255, 0.3);
          border: 1px solid rgba(120, 219, 255, 0.4);
        }

        .action-btn.kudos:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 8px 24px rgba(120, 219, 255, 0.5);
          background: linear-gradient(135deg, #89e5ff 0%, #8988d4 100%);
        }

        .action-btn.view {
          background: linear-gradient(135deg, #7877c6 0%, #ff77c6 100%);
          color: white;
          box-shadow: 0 4px 16px rgba(120, 119, 198, 0.3);
          border: 1px solid rgba(120, 119, 198, 0.4);
        }

        .action-btn.view:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 8px 24px rgba(120, 119, 198, 0.5);
          background: linear-gradient(135deg, #8988d4 0%, #ff88d4 100%);
        }

        .no-tricks {
          text-align: center;
          padding: 3rem;
          color: var(--text-secondary);
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          gap: 1rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-light);
          border-top: 3px solid var(--primary-500);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 0.5rem;
          }

          .header {
            margin: 0.5rem;
            padding: 0.75rem 1rem;
            position: fixed;
            top: 0.5rem;
            left: 0.5rem;
            right: 0.5rem;
            z-index: 1000;
          }

          .main-content {
            margin-top: 100px;
            grid-template-columns: 1fr;
            gap: 1rem;
            margin: 1rem 0;
          }

          .main-content {
            grid-template-columns: 1fr;
            gap: 1rem;
            margin: 1rem 0;
          }

          .sidebar {
            order: -1;
            position: static;
            height: auto;
            overflow-y: visible;
            display: grid;
            grid-template-columns: 1fr;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
            padding-right: 0;
          }

          .header-content {
            grid-template-columns: auto 1fr auto;
            gap: 0.5rem;
            padding: 0;
            height: auto;
          }

          .header-left, .header-center, .header-right {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .header-center .share-btn {
            padding: 0.5rem 1.2rem !important;
            font-size: 0.75rem !important;
            white-space: nowrap;
          }

          .header-right .tricks-counter {
            padding: 0.4rem 0.8rem !important;
            font-size: 0.75rem !important;
            white-space: nowrap;
            margin-left: 0 !important;
          }

          .user-info {
            flex-direction: column;
            gap: 0.5rem;
            padding: 0.4rem 0.8rem;
          }

          .welcome {
            font-size: 0.8rem;
          }

          .sign-out-btn {
            padding: 0.2rem 0.6rem;
            font-size: 0.7rem;
          }

          .header-right {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-end;
          }

          .user-section {
            order: 1;
          }

          .search-section {
            padding: 1rem;
            margin-bottom: 1rem;
          }

          .tricks-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .trick-card {
            padding: 1rem;
          }

          .country-chain-wrapper {
            padding: 1rem;
            margin-bottom: 1rem;
          }

          .chain-track {
            gap: 0.5rem;
          }

          .country-link {
            min-width: auto;
            flex: 1;
          }

          /* Reduce animations on mobile for better performance */
          .home::before, .home::after {
            animation: none;
          }

          .header {
            animation: none;
          }

          .trick-card:hover {
            transform: translateY(-4px) scale(1.01);
          }

          .action-btn:hover {
            transform: translateY(-1px) scale(1.02);
          }
        }

        /* Login Popup Styles */
        .login-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }

        .login-popup {
          background: rgba(15, 15, 35, 0.95);
          backdrop-filter: blur(25px);
          border-radius: 20px;
          padding: 2.5rem;
          max-width: 400px;
          width: 90%;
          border: 1px solid rgba(120, 119, 198, 0.3);
          box-shadow: 0 20px 60px rgba(120, 119, 198, 0.4);
          position: relative;
          animation: popupSlide 0.3s ease-out;
        }

        .popup-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.5rem;
          cursor: pointer;
          transition: color 0.3s;
        }

        .popup-close:hover {
          color: #ff77c6;
        }

        .popup-content {
          text-align: center;
        }

        .popup-title {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #7877c6, #ff77c6, #78dbff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .popup-subtitle {
          color: rgba(120, 219, 255, 0.9);
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .popup-signin-btn {
          background: linear-gradient(135deg, #7877c6 0%, #ff77c6 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(120, 119, 198, 0.3);
        }

        .popup-signin-btn:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 12px 40px rgba(120, 119, 198, 0.5);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes popupSlide {
          from { 
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
