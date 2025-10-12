import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Trick } from '../lib/types';
import { countries } from '../lib/mockData';
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
  const [filteredTricks, setFilteredTricks] = useState<Trick[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { showToast, ToastContainer } = useToast();

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
      }
    } catch (error) {
      console.error('Error fetching tricks:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCountry, selectedCategory, searchQuery]);

  useEffect(() => {
    fetchTricks();
  }, [fetchTricks]);

  const handleKudos = async (trickId: string) => {
    try {
      await fetch(`/api/tricks/${trickId}/kudos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: 'anonymous@example.com' })
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
              <Link href="/submit" className="share-btn">
                Share Your Trick
              </Link>
            </div>
            <div className="header-right">
              <div className="tricks-counter">
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
          background: var(--gradient-bg);
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .header {
          background: var(--surface-glass);
          backdrop-filter: blur(20px);
          border-radius: var(--radius-lg);
          margin: 1rem 0;
          padding: 1rem 2rem;
          border: 1px solid var(--border-light);
          position: sticky;
          top: 1rem;
          z-index: 100;
        }

        .header-content {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 2rem;
        }

        .header-left {
          justify-self: start;
        }

        .header-center {
          justify-self: center;
        }

        .header-right {
          justify-self: end;
        }

        .share-btn {
          background: var(--gradient-primary);
          color: white;
          padding: 0.75rem 2rem;
          border-radius: var(--radius-full);
          text-decoration: none;
          font-weight: 600;
          transition: all var(--transition-smooth);
          box-shadow: var(--shadow-md);
        }

        .share-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .tricks-counter {
          background: var(--surface-elevated);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-weight: 600;
          color: var(--text-primary);
        }

        .main-content {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
          margin: 2rem 0;
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: sticky;
          top: 120px;
          height: calc(100vh - 140px);
          overflow-y: auto;
          padding-right: 0.5rem;
          scrollbar-width: thin;
          scrollbar-color: rgba(102, 126, 234, 0.5) transparent;
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
          background: var(--surface-glass);
          backdrop-filter: blur(20px);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          border: 1px solid var(--border-light);
        }

        .tricks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .trick-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%);
          backdrop-filter: blur(20px);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all var(--transition-smooth);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .trick-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          border-color: rgba(102, 126, 234, 0.3);
        }

        .trick-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .country-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .flag {
          font-size: 1.2rem;
        }

        .country-name {
          font-weight: 500;
          color: var(--text-secondary);
        }

        .difficulty-badge {
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .difficulty-badge.easy {
          background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }

        .difficulty-badge.medium {
          background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
        }

        .difficulty-badge.hard {
          background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
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
          margin-bottom: 1rem;
        }

        .tag {
          background: var(--primary-100);
          color: var(--primary-700);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 500;
        }

        .trick-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .author-info {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .trick-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-smooth);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .action-btn.kudos {
          background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }

        .action-btn.kudos:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .action-btn.view {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .action-btn.view:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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
          .main-content {
            grid-template-columns: 1fr;
          }

          .header-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 1rem;
          }

          .tricks-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
