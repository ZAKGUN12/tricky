import { useState, useEffect, useCallback } from 'react';
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
import ReadabilityEnhancer from '../components/ReadabilityEnhancer';
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
  const { showToast, ToastContainer } = useToast();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const fetchTricks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCountry) params.append('country', selectedCountry);
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/tricks?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTricks(data);
        
        // Also fetch all tricks for category counting if we don't have them
        if (allTricks.length === 0 || (!selectedCountry && !selectedCategory && !searchQuery)) {
          setAllTricks(data);
        }
      }
    } catch (error) {
      console.error('Error fetching tricks:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCountry, selectedCategory, searchQuery, allTricks.length]);

  useEffect(() => {
    fetchTricks();
  }, [fetchTricks]);

  const handleKudos = async (trickId: string) => {
    if (!user) {
      router.push(`/signin?returnUrl=${encodeURIComponent(router.asPath)}`);
      return;
    }

    try {
      await fetch(`/api/tricks/${trickId}/kudos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: user.email })
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
    setSelectedCountry(countryCode === selectedCountry ? '' : countryCode);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading amazing tricks from around the world...</p>
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
              {user ? (
                <div className="user-section">
                  <div className="user-info">
                    <span className="welcome">Welcome, {user.name}!</span>
                    <button 
                      onClick={async () => {
                        if (confirm('Are you sure you want to sign out?')) {
                          await signOut();
                          router.push('/');
                        }
                      }}
                      className="sign-out-btn"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => router.push('/signin')}
                  className="login-btn"
                  style={{
                    background: 'rgba(15, 15, 35, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(120, 219, 255, 0.3)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '600',
                    color: '#78dbff',
                    boxShadow: '0 4px 16px rgba(120, 219, 255, 0.2)',
                    cursor: 'pointer'
                  }}
                >
                  Sign In
                </button>
              )}
              <div 
                className="tricks-counter"
                style={{
                  background: 'rgba(15, 15, 35, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(120, 219, 255, 0.3)',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: '600',
                  color: '#78dbff',
                  boxShadow: '0 4px 16px rgba(120, 219, 255, 0.2)',
                  marginLeft: '1rem'
                }}
              >
                {tricks.length} tricks
              </div>
            </div>
          </div>
        </header>

        <div className="main-content">
          <div className="sidebar">
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

            <CountryChain 
              tricks={tricks}
              onCountrySelect={handleCountrySelect}
              selectedCountry={selectedCountry}
            />

            <div className="tricks-grid">
              {tricks.map((trick) => {
                const country = countries.find(c => c.code === trick.countryCode);
                return (
                  <div key={trick.id} className="trick-card">
                    <div className="trick-header">
                      <div className="country-info">
                        <span className="flag">{country?.flag}</span>
                        <span className="country-name">{country?.name}</span>
                      </div>
                      <div className="difficulty">
                        <span className={`difficulty-badge ${trick.difficulty}`}>
                          {trick.difficulty}
                        </span>
                      </div>
                    </div>

                    <h3 className="trick-title">{trick.title}</h3>
                    <p className="trick-description">{trick.description}</p>

                    <div className="trick-tags">
                      {trick.tags?.map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                      ))}
                    </div>

                    <div className="trick-footer">
                      <div className="author-info">
                        <span>by {trick.authorName}</span>
                      </div>
                      
                      <div className="trick-actions">
                        <button 
                          onClick={() => handleKudos(trick.id)}
                          className="action-btn kudos"
                          aria-label={`Give kudos to ${trick.title}`}
                        >
                          👍 {trick.kudos}
                        </button>
                        
                        <Link href={`/trick/${trick.id}`} className="action-btn view">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {tricks.length === 0 && (
              <div className="no-tricks">
                <h3>No tricks found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .home {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
          position: relative;
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
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(20px);
          border-radius: var(--radius-lg);
          margin: 1rem 0;
          padding: 1rem 2rem;
          border: 1px solid rgba(120, 119, 198, 0.3);
          position: sticky;
          top: 1rem;
          z-index: 100;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(120, 119, 198, 0.1);
          animation: headerGlow 4s ease-in-out infinite;
        }

        @keyframes headerGlow {
          0%, 100% { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(120, 119, 198, 0.1); }
          50% { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 80px rgba(120, 119, 198, 0.2); }
        }

        .header-content {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 2rem;
          height: 100%;
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
          gap: 1rem;
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
        }

        .sign-out-btn {
          background: rgba(239, 68, 68, 0.8);
          color: white;
          border: none;
          padding: 0.3rem 0.8rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .sign-out-btn:hover {
          background: rgba(239, 68, 68, 1);
          transform: translateY(-1px);
        }

        .login-btn {
          transition: all 0.3s ease;
        }

        .login-btn:hover {
          background: rgba(120, 219, 255, 0.2) !important;
          transform: translateY(-1px);
        }

        .main-content {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
          margin: 2rem 0;
          align-items: start;
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          position: sticky;
          top: 120px;
          height: calc(100vh - 140px);
          overflow-y: auto;
          padding-right: 0.5rem;
          scrollbar-width: thin;
          scrollbar-color: rgba(102, 126, 234, 0.5) transparent;
          z-index: 10;
        }

        .sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: rgba(102, 126, 234, 0.5);
          border-radius: 3px;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
          background: rgba(102, 126, 234, 0.7);
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
        }

        .tricks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
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
            margin: 0.5rem 0;
            padding: 0.75rem 1rem;
            position: relative;
            top: 0;
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
      `}</style>
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
