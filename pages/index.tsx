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
import UserStats from '../components/UserStats';
import Leaderboard from '../components/Leaderboard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import KudosButton from '../components/KudosButton';
import { useToast } from '../lib/useToast';

function HomeContent() {
  const [tricks, setTricks] = useState<Trick[]>([]);
  const [allTricks, setAllTricks] = useState<Trick[]>([]); // Keep all tricks for category counting
  const [filteredTricks, setFilteredTricks] = useState<Trick[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [userKudos, setUserKudos] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('hot');
  const [viewMode, setViewMode] = useState('card');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Start collapsed on mobile
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: '',
    countryCode: '',
    tags: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    document.body.classList.add('reddit-header-active');
    return () => {
      document.body.classList.remove('reddit-header-active');
    };
  }, []);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!sidebarCollapsed && window.innerWidth <= 768) {
        document.body.classList.add('sidebar-open');
      } else {
        document.body.classList.remove('sidebar-open');
      }
    }
    
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('sidebar-open');
      }
    };
  }, [sidebarCollapsed]);
  const [theme, setTheme] = useState('dark');

  // Apply theme to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.className = theme;
    }
  }, [theme]);

  const { showToast, ToastContainer } = useToast();
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Protect scroll for unauthenticated users
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      if (!user && !loading) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const currentUrl = window.location.pathname + window.location.search;
          router.push(`/signin?returnUrl=${encodeURIComponent(currentUrl)}`);
        }, 3000); // Redirect after 3 seconds of scrolling
      }
    };

    if (!user && !loading) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [user, loading, router]);

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

  const fetchUserKudos = useCallback(async (trickIds: string[]) => {
    if (!user?.email || trickIds.length === 0) return;
    
    try {
      const response = await fetch('/api/user/kudos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userEmail: user.email, 
          trickIds 
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserKudos(data.kudosStatus);
      }
    } catch (error) {
      console.error('Error fetching user kudos:', error);
    }
  }, [user?.email]);

  const fetchTricks = useCallback(async () => {
    try {
      setError(null);
      // Use filtering state for filter changes, loading only for initial load
      if (tricks.length > 0) {
        setFiltering(true);
      } else {
        setLoading(true);
      }
      
      const params = new URLSearchParams();
      if (selectedCountry) params.append('country', selectedCountry);
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);

      console.log('Fetching tricks from API:', `/api/tricks?${params}`);
      const response = await fetch(`/api/tricks?${params}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch tricks: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      setTricks(Array.isArray(data) ? data : []);
      
      // If no filters are applied, this is our complete dataset for Global Network
      if (!selectedCountry && !selectedCategory && !searchQuery) {
        setAllTricks(Array.isArray(data) ? data : []);
      }
      
      // Don't fetch user kudos here to avoid overriding current state
      // Kudos will be fetched when user logs in via useEffect
    } catch (error) {
      console.error('Error fetching tricks:', error);
      setError(error instanceof Error ? error.message : 'Failed to load tricks');
      setTricks([]);
    } finally {
      setLoading(false);
      setFiltering(false);
    }
  }, [selectedCountry, selectedCategory, searchQuery, tricks.length]);

  const clearFilters = () => {
    setSelectedCountry('');
    setSelectedCategory('');
    setSearchQuery('');
    // Force refresh of allTricks when clearing filters
    setAllTricks([]);
  };

  const handleUnauthenticatedAction = (e?: React.MouseEvent) => {
    if (!user) {
      if (e) e.preventDefault();
      // Redirect to login with return URL
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/signin?returnUrl=${encodeURIComponent(currentUrl)}`);
      return true;
    }
    return false;
  };

  useEffect(() => {
    fetchTricks();
  }, [fetchTricks]);

  // Fetch all tricks for Global Network on initial load only
  useEffect(() => {
    const fetchAllTricks = async () => {
      try {
        const response = await fetch('/api/tricks');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setAllTricks(data);
          }
        }
      } catch (error) {
        console.error('Error fetching all tricks for Global Network:', error);
      }
    };

    if (allTricks.length === 0) {
      fetchAllTricks();
    }
  }, [allTricks.length]);

  // Fetch user kudos when user logs in and we have tricks
  useEffect(() => {
    if (user?.email && tricks.length > 0) {
      const trickIds = tricks.map(trick => trick.id);
      fetchUserKudos(trickIds);
    } else if (!user?.email) {
      // Clear kudos state when user logs out
      setUserKudos({});
    }
  }, [user?.email, fetchUserKudos, tricks]);

  // Initial kudos load when tricks are first loaded
  useEffect(() => {
    if (user?.email && tricks.length > 0 && Object.keys(userKudos).length === 0) {
      const trickIds = tricks.map(trick => trick.id);
      fetchUserKudos(trickIds);
    }
  }, [tricks, user?.email, userKudos, fetchUserKudos]);

  const handleKudosToggle = async (trickId: string) => {
    if (handleUnauthenticatedAction()) return;

    try {
      const response = await fetch(`/api/tricks/${trickId}/kudos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userEmail: user?.email,
          action: 'toggle'
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setTricks(prev => prev.map(trick => 
          trick.id === trickId 
            ? { ...trick, kudos: result.newKudosCount }
            : trick
        ));
        
        setUserKudos(prev => ({
          ...prev,
          [trickId]: result.hasKudos
        }));
        
        showToast(result.hasKudos ? 'Kudos given! 👍' : 'Kudos removed! 👎', 'success');
      } else {
        showToast(result.error || 'Failed to toggle kudos', 'error');
      }
    } catch (error: any) {
      console.error('Error toggling kudos:', error);
      showToast('Error toggling kudos', 'error');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (filters: any) => {
    if (filters.country) setSelectedCountry(filters.country);
    if (filters.category) setSelectedCategory(filters.category);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.difficulty || !formData.countryCode) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (!user) {
      setFormError('Please sign in to create tricks');
      return;
    }

    setFormLoading(true);
    setFormError('');

    try {
      const response = await fetch('/api/tricks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          steps: [formData.description.trim()], // API requires steps array
          difficulty: formData.difficulty,
          countryCode: formData.countryCode,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          authorName: user.name,
          authorEmail: user.email
        }),
      });

      if (response.ok) {
        // Success - reset form and refresh tricks
        setFormData({ title: '', description: '', difficulty: '', countryCode: '', tags: '' });
        setShowCreateForm(false);
        showToast('🎉 Trick created successfully!', 'success');
        
        // Refresh tricks list and sync allTricks
        await fetchTricks();
        
        // Update allTricks with fresh data for Global Network
        const allTricksResponse = await fetch('/api/tricks');
        if (allTricksResponse.ok) {
          const allTricksData = await allTricksResponse.json();
          if (Array.isArray(allTricksData)) {
            setAllTricks(allTricksData);
          }
        }
      } else {
        const errorData = await response.json();
        setFormError(errorData.error || 'Failed to create trick');
      }
    } catch (error) {
      setFormError('Network error. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formError) setFormError(''); // Clear error on input
  };

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode === selectedCountry ? '' : countryCode);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  if (loading) {
    return (
      <div className="home">
        <ToastContainer />
        <div className="container">
          <header className="header">
            <div className="header-content">
              <div className="header-center">
                <div className="loading-header">
                  🌍 TrickShare - Loading...
                </div>
              </div>
            </div>
          </header>
          <div className="main-content">
            <LoadingSkeleton count={6} />
          </div>
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
        {/* Reddit-Style Header */}
        <header className="reddit-header">
          <nav className="reddit-header-nav">
            {/* Logo Section */}
            <div className="reddit-logo-section">
              <button 
                className="hamburger-btn"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                aria-label="Toggle menu"
              >
                ☰
              </button>
              <Link href="/" className="reddit-logo">
                <div className="logo-icon">T</div>
                <span>TrickShare</span>
              </Link>
            </div>

            {/* Search Section */}
            <div className="reddit-search-section">
              <form className="reddit-search-form" onSubmit={(e) => e.preventDefault()}>
                <div className="search-icon">🔍</div>
                <input
                  type="text"
                  className="reddit-search-input"
                  placeholder="Search tricks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Actions Section */}
            <div className="reddit-actions">
              <button 
                className="reddit-action-btn primary"
                onClick={() => setShowCreateForm(true)}
              >
                <span>+</span>
                <span>Create</span>
              </button>
              
              <button className="reddit-action-btn icon-only notification-badge">
                🔔
              </button>
              
              <button className="reddit-action-btn icon-only">
                💬
              </button>

              {user ? (
                <div className="reddit-user-menu">
                  <button 
                    className="reddit-user-btn"
                    onClick={async () => {
                      if (confirm('Are you sure you want to sign out?')) {
                        await signOut();
                        router.push('/');
                      }
                    }}
                  >
                    <div className="user-avatar">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span>{user.name}</span>
                  </button>
                </div>
              ) : (
                <Link href="/signin" className="reddit-action-btn">
                  Log In
                </Link>
              )}
            </div>
          </nav>
        </header>

        <div className="main-content">
          <nav className={`sidebar z-2 box-border flex flex-col mt-0 mb-0 pt-md shrink-0 w-full min-h-screen-without-header select-none ${!sidebarCollapsed ? 'open' : ''}`} aria-label="Primary">
            <button 
              className="sidebar-close"
              onClick={() => setSidebarCollapsed(true)}
              aria-label="Close sidebar"
            >
              ✕
            </button>
            
            {/* Top Navigation Section */}
            <div className="left-nav-top-section">
              <ul className="nav-list">
                <li className="relative list-none mt-0" role="presentation">
                  <Link href="/" className="flex justify-between relative px-md gap-[0.5rem] text-secondary hover:text-secondary-hover hover:bg-neutral-background-hover hover:no-underline cursor-pointer py-2xs -outline-offset-1 s:rounded-2 bg-transparent no-underline">
                    <span className="flex items-center gap-xs min-w-0 shrink">
                      <span className="flex shrink-0 items-center justify-center h-xl w-xl text-20 leading-4">
                        🏠
                      </span>
                      <span className="flex flex-col justify-center min-w-0 shrink py-[var(--rem6)]">
                        <span className="text-14">Home</span>
                      </span>
                    </span>
                  </Link>
                </li>
                <li className="relative list-none mt-0" role="presentation">
                  <Link href="/submit" className="flex justify-between relative px-md gap-[0.5rem] text-secondary hover:text-secondary-hover hover:bg-neutral-background-hover hover:no-underline cursor-pointer py-2xs -outline-offset-1 s:rounded-2 bg-transparent no-underline">
                    <span className="flex items-center gap-xs min-w-0 shrink">
                      <span className="flex shrink-0 items-center justify-center h-xl w-xl text-20 leading-4">
                        ✨
                      </span>
                      <span className="flex flex-col justify-center min-w-0 shrink py-[var(--rem6)]">
                        <span className="text-14">Submit Trick</span>
                      </span>
                    </span>
                  </Link>
                </li>
                <li className="relative list-none mt-0" role="presentation">
                  <Link href="/" className="flex justify-between relative px-md gap-[0.5rem] text-secondary hover:text-secondary-hover hover:bg-neutral-background-hover hover:no-underline cursor-pointer py-2xs -outline-offset-1 s:rounded-2 bg-transparent no-underline">
                    <span className="flex items-center gap-xs min-w-0 shrink">
                      <span className="flex shrink-0 items-center justify-center h-xl w-xl text-20 leading-4">
                        🌍
                      </span>
                      <span className="flex flex-col justify-center min-w-0 shrink py-[var(--rem6)]">
                        <span className="text-14">Global Network</span>
                      </span>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            <hr className="w-100 my-sm border-neutral-border-weak" />

            {/* Categories Section */}
            <div className="expandable-section">
              <div className="section-header">
                <div className="flex justify-between relative px-md gap-[0.5rem] text-secondary py-2xs -outline-offset-1 bg-transparent s:rounded-2">
                  <span className="flex items-center gap-xs min-w-0 shrink">
                    <span className="flex flex-col justify-center min-w-0 shrink py-[var(--rem6)]">
                      <span className="text-14">
                        <span className="text-12 text-secondary-weak tracking-widest">CATEGORIES</span>
                      </span>
                    </span>
                  </span>
                </div>
              </div>
              <div className="section-content">
                <Categories 
                  selectedCategory={selectedCategory}
                  onCategorySelect={(categoryId) => handleCategorySelect(categoryId || '')}
                  tricks={allTricks}
                />
              </div>
            </div>

            <hr className="w-100 my-sm border-neutral-border-weak" />

            {/* Footer */}
            <div className="visible py-md grow flex flex-col justify-end">
              <a className="no-underline text-tone-2 text-10 px-md" href="https://tricky-peach.vercel.app">
                TrickShare © 2025. All rights reserved.
              </a>
            </div>
          </nav>
          {!sidebarCollapsed && (
            <div 
              className="sidebar-overlay active"
              onClick={() => setSidebarCollapsed(true)}
            />
          )}

          <div className="content">
            {/* CountryChain with integrated Global Network - Always visible */}
            <CountryChain 
              tricks={allTricks}
              onCountrySelect={handleCountrySelect}
              selectedCountry={selectedCountry}
            />

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
                {(selectedCountry || selectedCategory || searchQuery) && (
                  <button 
                    className="clear-filters-btn"
                    onClick={clearFilters}
                    title="Clear all filters"
                  >
                    🗑️ Clear
                  </button>
                )}
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

            {loading && (
              <div className="loading-tricks">
                <div className="loading-spinner"></div>
                <p>Loading tricks...</p>
              </div>
            )}
            
            {!loading && sortedTricks && sortedTricks.length > 0 && (
              <div className={`tricks-grid ${viewMode === 'compact' ? 'compact-view' : 'card-view'} ${filtering ? 'filtering' : ''}`}>
                {sortedTricks.map((trick) => {
                const country = countries.find(c => c.code === trick.countryCode);
                return (
                  <div key={trick.id} className="trick-card reddit-style">
                    <div className="trick-votes">
                      <KudosButton
                        key={`kudos-${trick.id}-${userKudos[trick.id] ? 'liked' : 'not-liked'}`}
                        trickId={trick.id}
                        kudosCount={trick.kudos}
                        hasUserKudos={userKudos[trick.id] || false}
                        onKudosToggle={handleKudosToggle}
                        disabled={!user}
                      />
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
            )}

            {!loading && (!sortedTricks || sortedTricks.length === 0) && (
              <div className="no-tricks">
                <h3>🔍 No tricks found</h3>
                <p>Try adjusting your filters or search terms</p>
                {process.env.NODE_ENV === 'development' && (
                  <p className="debug-info">Debug: {tricks?.length || 0} tricks loaded, {sortedTricks?.length || 0} after sorting</p>
                )}
                <button 
                  onClick={() => {
                    clearFilters();
                    fetchTricks();
                  }}
                  className="retry-button"
                >
                  🔄 Show All Tricks
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="right-sidebar">
            {/* Top Tricks Section */}
            <div className="expandable-section">
              <div className="section-header">
                <div className="flex justify-between relative px-md gap-[0.5rem] text-secondary py-2xs -outline-offset-1 bg-transparent s:rounded-2">
                  <span className="flex items-center gap-xs min-w-0 shrink">
                    <span className="flex flex-col justify-center min-w-0 shrink py-[var(--rem6)]">
                      <span className="text-14">
                        <span className="text-12 text-secondary-weak tracking-widest">TOP TRICKS</span>
                      </span>
                    </span>
                  </span>
                </div>
              </div>
              <div className="section-content">
                <TopTricks />
              </div>
            </div>

            <hr className="w-100 my-sm border-neutral-border-weak" />

            {/* Leaderboard Section */}
            <div className="expandable-section">
              <div className="section-header">
                <div className="flex justify-between relative px-md gap-[0.5rem] text-secondary py-2xs -outline-offset-1 bg-transparent s:rounded-2">
                  <span className="flex items-center gap-xs min-w-0 shrink">
                    <span className="flex flex-col justify-center min-w-0 shrink py-[var(--rem6)]">
                      <span className="text-14">
                        <span className="text-12 text-secondary-weak tracking-widest">LEADERBOARD</span>
                      </span>
                    </span>
                  </span>
                </div>
              </div>
              <div className="section-content">
                <Leaderboard />
              </div>
            </div>
          </aside>

        </div>

        {/* Create Trick Modal */}
        {showCreateForm && (
          <div className="create-modal-overlay" onClick={() => setShowCreateForm(false)}>
            <div className="create-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>🌍 Create New Trick</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowCreateForm(false)}
                >
                  ✕
                </button>
              </div>
              <div className="create-form-container">
                <form className="inline-create-form" onSubmit={handleFormSubmit}>
                  {formError && (
                    <div className="form-error">
                      ⚠️ {formError}
                    </div>
                  )}
                  <input 
                    type="text" 
                    name="title"
                    placeholder="Enter your life trick title..."
                    className="form-input title-input"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    disabled={formLoading}
                  />
                  <textarea 
                    name="description"
                    placeholder="Describe your trick in detail..."
                    className="form-input description-input"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    disabled={formLoading}
                  />
                  <div className="form-row">
                    <select 
                      name="difficulty"
                      className="form-input difficulty-select" 
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      required
                      disabled={formLoading}
                    >
                      <option value="">Select difficulty</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    <select 
                      name="countryCode"
                      className="form-input country-select" 
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      required
                      disabled={formLoading}
                    >
                      <option value="">Select country</option>
                      <option value="TR">🇹🇷 Turkey</option>
                      <option value="JP">🇯🇵 Japan</option>
                      <option value="FR">🇫🇷 France</option>
                      <option value="DE">🇩🇪 Germany</option>
                      <option value="IT">🇮🇹 Italy</option>
                      <option value="BR">🇧🇷 Brazil</option>
                      <option value="CN">🇨🇳 China</option>
                      <option value="CA">🍁 Canada</option>
                    </select>
                  </div>
                  <input 
                    type="text" 
                    name="tags"
                    placeholder="Tags (comma separated)"
                    className="form-input tags-input"
                    value={formData.tags}
                    onChange={handleInputChange}
                    disabled={formLoading}
                  />
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => setShowCreateForm(false)}
                      disabled={formLoading}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn" disabled={formLoading}>
                      {formLoading ? '⏳ Creating...' : '🚀 Share Trick'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
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

        /* Layout fixes handled by middle-column-fix.css */

        /* Content layout handled by middle-column-fix.css */

        /* Country chain styles handled by middle-column-fix.css */

        /* Country Chain Visibility Fix - Override JSX Styles */
        .main-content .country-chain-wrapper {
          min-height: 300px !important;
          overflow: visible !important;
          height: auto !important;
          max-height: none !important;
        }

        .main-content .chain-container {
          overflow: visible !important;
          height: auto !important;
          max-height: none !important;
        }

        .main-content .chain-track {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 12px !important;
          overflow: visible !important;
          height: auto !important;
          max-height: none !important;
          padding-bottom: 1rem !important;
        }

        .main-content .country-link {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          padding: 12px 16px !important;
          min-width: 120px !important;
          visibility: visible !important;
          opacity: 1 !important;
          position: relative !important;
          z-index: 10 !important;
        }

        .main-content .country-flag {
          font-size: 1.8rem !important;
          display: inline-block !important;
          visibility: visible !important;
          opacity: 1 !important;
          flex-shrink: 0 !important;
        }

        .main-content .country-name {
          font-size: 0.9rem !important;
          font-weight: 600 !important;
          color: white !important;
          white-space: nowrap !important;
        }

        .main-content .trick-count {
          font-size: 0.8rem !important;
          color: #fbbf24 !important;
          font-weight: 600 !important;
        }

        .main-content .chain-footer {
          margin-top: 1rem !important;
          overflow: visible !important;
        }

        /* Global Network styles handled by middle-column-fix.css */

        /* All layout styles handled by middle-column-fix.css */

        /* Duplicate styles removed - handled by middle-column-fix.css */

        /* Global Network Section */
        .global-network-section {
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(20px);
          border-radius: var(--radius-lg);
          padding: 2rem;
          border: 1px solid rgba(120, 119, 198, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }

        .global-network-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(120, 119, 198, 0.05) 0%, 
            rgba(120, 219, 255, 0.05) 50%, 
            rgba(255, 119, 198, 0.05) 100%);
          pointer-events: none;
          z-index: -1;
        }

        .global-network-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .global-network-header h2 {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #7877c6, #ff77c6, #78dbff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 20px rgba(120, 119, 198, 0.5);
        }

        .global-network-header p {
          color: rgba(120, 219, 255, 0.8);
          font-size: 1.1rem;
          margin: 0;
        }

        .global-counters {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .counter-card {
          background: rgba(15, 15, 35, 0.6);
          backdrop-filter: blur(15px);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          border: 1px solid rgba(120, 219, 255, 0.3);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .counter-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          transition: all 0.3s ease;
        }

        .counter-card.countries::before {
          background: linear-gradient(90deg, #7877c6, #ff77c6);
        }

        .counter-card.tricks::before {
          background: linear-gradient(90deg, #78dbff, #7877c6);
        }

        .counter-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(120, 219, 255, 0.6);
          box-shadow: 0 16px 40px rgba(120, 219, 255, 0.3);
        }

        .counter-card:hover::before {
          height: 100%;
          opacity: 0.1;
        }

        .counter-header {
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(120, 219, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1rem;
        }

        .counter-value {
          font-size: 3rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 20px rgba(120, 219, 255, 0.5);
          line-height: 1;
        }

        .counter-label {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .global-network-section {
            padding: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .global-network-header h2 {
            font-size: 1.5rem;
          }

          .global-counters {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .counter-card {
            padding: 1.5rem;
          }

          .counter-value {
            font-size: 2.5rem;
          }
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
        .sort-btn:focus,
        .view-btn:focus,
        .action-btn:focus {
          outline: 2px solid #7877c6;
          outline-offset: 2px;
        }

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

        /* Layout styles are now handled by layout-system.css */

        /* All sidebar styles moved to perfect-left-sidebar.css */

        .loading-header {
          color: #7877c6;
          font-weight: 600;
          font-size: 1.1rem;
          text-shadow: 0 0 10px rgba(120, 119, 198, 0.5);
        }

        .debug-info {
          font-size: 0.8rem;
          color: #78dbff;
          opacity: 0.7;
          margin: 0.5rem 0;
        }

        .loading-tricks {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: var(--text-secondary);
          gap: 1rem;
        }

        .loading-tricks .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(120, 119, 198, 0.3);
          border-top: 3px solid #7877c6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* First sidebar styles removed - handled by layout-system.css */

        .sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(120, 119, 198, 0.05) 0%, 
            rgba(120, 219, 255, 0.05) 50%, 
            rgba(255, 119, 198, 0.05) 100%);
          border-radius: 20px;
          pointer-events: none;
          z-index: -1;
        }

        .sidebar::-webkit-scrollbar {
          width: 8px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: rgba(120, 219, 255, 0.1);
          border-radius: 4px;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(120, 219, 255, 0.6), rgba(120, 119, 198, 0.6));
          border-radius: 4px;
          border: 1px solid rgba(120, 219, 255, 0.2);
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(120, 219, 255, 0.8), rgba(120, 119, 198, 0.8));
        }

        .sidebar.collapsed {
          width: 80px;
          min-width: 80px;
          padding: 1rem;
        }

        .sidebar > * {
          flex-shrink: 0;
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

        /* Main content styles handled by layout-system.css */

        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: fixed;
          top: 80px;
          left: 0;
          height: calc(100vh - 80px);
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

        .sidebar.collapsed + .content {
          margin-left: 60px;
        }

        .sidebar-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, rgba(120, 219, 255, 0.2), rgba(120, 119, 198, 0.2));
          border: 1px solid rgba(120, 219, 255, 0.4);
          border-radius: 12px;
          color: #ffffff;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          z-index: 10;
        }

        .sidebar-close:hover {
          background: linear-gradient(135deg, rgba(120, 219, 255, 0.4), rgba(120, 119, 198, 0.4));
          border-color: rgba(120, 219, 255, 0.6);
          transform: scale(1.1) rotate(90deg);
          box-shadow: 0 8px 20px rgba(120, 219, 255, 0.3);
        }

        .sidebar-close:active {
          transform: scale(0.95);
        }

        .content {
          flex: 1;
          min-width: 0;
          margin-left: 300px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(120, 219, 255, 0.2);
          border-radius: 16px;
          padding: 0;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          overflow: hidden;
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
          background: rgba(15, 15, 35, 0.8) !important;
          backdrop-filter: blur(15px);
          border: 1px solid rgba(120, 219, 255, 0.2);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .reddit-header {
          background: linear-gradient(135deg, rgba(120, 119, 198, 0.2), rgba(120, 219, 255, 0.1));
          padding: 16px 20px;
          border-bottom: 1px solid rgba(120, 219, 255, 0.2);
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
          padding: 12px 0;
        }

        .reddit-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 12px 20px;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          border-bottom: 1px solid rgba(120, 219, 255, 0.1);
        }

        .reddit-item:hover {
          background: rgba(120, 219, 255, 0.15);
          color: rgba(255, 255, 255, 1);
          transform: translateX(4px);
        }

        .reddit-item.active {
          background: linear-gradient(90deg, rgba(120, 219, 255, 0.2), rgba(120, 119, 198, 0.1));
          color: #78dbff;
          border-right: 3px solid #78dbff;
          font-weight: 600;
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
          flex-wrap: wrap;
        }

        .sort-btn, .clear-filters-btn {
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

        .clear-filters-btn {
          background: rgba(255, 119, 198, 0.2);
          border: 1px solid rgba(255, 119, 198, 0.4);
          color: rgba(255, 119, 198, 0.9);
        }

        .sort-btn:hover, .clear-filters-btn:hover {
          background: var(--gray-300);
          color: var(--text-secondary);
        }

        .clear-filters-btn:hover {
          background: rgba(255, 119, 198, 0.3);
          color: #ffffff;
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

        /* Standardized Trick Card Dimensions */
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
          min-height: 180px;
          max-height: 250px;
          width: 100%;
        }

        .trick-card.reddit-style .trick-content {
          flex: 1;
          padding: var(--space-3);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 180px;
          max-height: 250px;
          overflow: hidden;
        }

        .trick-card.reddit-style .trick-title {
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.3;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 2.6rem;
        }

        .trick-card.reddit-style .trick-description {
          font-size: 0.875rem;
          line-height: 1.4;
          color: var(--text-secondary);
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          min-height: 3.6rem;
          max-height: 3.6rem;
        }

        .trick-card.reddit-style .trick-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
          height: 1.2rem;
          flex-shrink: 0;
        }

        .trick-card.reddit-style .trick-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: auto;
          height: 2rem;
          flex-shrink: 0;
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

        /* Removed duplicate .trick-card styles - using only .trick-card.reddit-style */

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
            height: 70px;
          }

          /* Mobile main-content styles handled by layout-system.css */

          .sidebar {
            position: fixed;
            left: -340px;
            top: 0;
            height: 100vh;
            width: 320px;
            min-width: 320px;
            z-index: 1001;
            transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 0 20px 20px 0;
            padding-top: 80px;
          }

          .sidebar.collapsed {
            left: 0;
            width: 320px;
            min-width: 320px;
          }

          .content {
            width: 100%;
            order: 1;
          }
          .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            backdrop-filter: blur(4px);
          }

          .header-content {
            grid-template-columns: auto 1fr auto;
            gap: 0.5rem;
            padding: 0;
            height: auto;
          }

          .mobile-sidebar-toggle {
            display: block !important;
            background: rgba(120, 119, 198, 0.4) !important;
            border: 2px solid rgba(120, 219, 255, 0.6) !important;
            box-shadow: 0 0 10px rgba(120, 219, 255, 0.4) !important;
          }

          .header-left, .header-center, .header-right {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .header-center .share-btn {
            padding: 0.4rem 1rem !important;
            font-size: 0.7rem !important;
            white-space: nowrap;
          }

          .header-left {
            justify-content: flex-start !important;
          }

          .header-center {
            justify-content: center !important;
          }

          .header-right {
            justify-content: flex-end !important;
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
            flex-direction: row;
            gap: 0.3rem;
            align-items: center;
            justify-content: flex-end;
            flex-wrap: wrap;
          }

          .user-section {
            order: 1;
            padding: 0.3rem 0.6rem;
            font-size: 0.7rem;
          }

          .theme-toggle, .right-sidebar-toggle {
            padding: 6px 8px;
            font-size: 14px;
            margin-right: 0.2rem;
          }

          .search-section {
            padding: 1rem;
            margin-bottom: 1rem;
          }

          .tricks-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .trick-card.reddit-style {
            min-height: 160px;
            max-height: 220px;
          }

          .trick-card.reddit-style .trick-content {
            min-height: 140px;
            max-height: 200px;
          }

          .trick-card.reddit-style .trick-title {
            font-size: 0.9rem;
            height: 2.4rem;
            -webkit-line-clamp: 2;
          }

          .trick-card.reddit-style .trick-description {
            font-size: 0.8rem;
            min-height: 3.2rem;
            max-height: 3.2rem;
            -webkit-line-clamp: 3;
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

          .trick-card.reddit-style:hover {
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

        /* Create Modal */
        .create-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1rem;
        }

        .create-modal {
          background: rgba(15, 15, 35, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          width: 90%;
          max-width: 800px;
          height: 80vh;
          border: 1px solid rgba(255, 119, 198, 0.4);
          box-shadow: 0 8px 32px rgba(255, 119, 198, 0.3);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(255, 119, 198, 0.3);
          background: linear-gradient(90deg, rgba(255, 119, 198, 0.1), rgba(120, 119, 198, 0.1));
        }

        .modal-header h3 {
          margin: 0;
          color: white;
          font-size: 1.2rem;
          background: linear-gradient(135deg, #ff77c6, #7877c6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: rgba(255, 119, 198, 0.2);
          transform: scale(1.1);
        }

        .create-form-container {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
        }

        .inline-create-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-error {
          background: rgba(255, 77, 77, 0.2);
          border: 1px solid rgba(255, 77, 77, 0.4);
          border-radius: 8px;
          padding: 0.75rem;
          color: #ff6b6b;
          font-size: 0.9rem;
          text-align: center;
        }

        .form-input {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 119, 198, 0.3);
          border-radius: 8px;
          padding: 0.75rem;
          color: white;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-input:focus {
          outline: none;
          border-color: rgba(255, 119, 198, 0.6);
          box-shadow: 0 0 0 2px rgba(255, 119, 198, 0.2);
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .title-input {
          font-size: 1rem;
          font-weight: 600;
        }

        .description-input {
          resize: vertical;
          min-height: 100px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1rem;
        }

        .cancel-btn, .submit-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .cancel-btn:disabled, .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .cancel-btn {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .cancel-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .submit-btn {
          background: linear-gradient(135deg, #ff77c6, #7877c6);
          color: white;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 119, 198, 0.4);
        }

        @media (max-width: 768px) {
          .create-modal {
            width: 95%;
            height: 85vh;
          }

          .modal-header {
            padding: 0.75rem 1rem;
          }

          .modal-header h3 {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
