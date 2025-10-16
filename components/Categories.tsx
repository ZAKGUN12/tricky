import { useState, useEffect, useCallback } from 'react';

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface CategoriesProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string | null) => void;
  tricks?: any[];
}

export default function Categories({ selectedCategory, onCategorySelect, tricks = [] }: CategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading) {
    return (
      <div className="categories-wrapper">
        <div className="header">
          <h3>📂 Categories</h3>
        </div>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="categories-wrapper">
      <div className="header">
        <h3>📂 Categories</h3>
        <span className="count">{categories.length} categories</span>
      </div>
      
      <div className="categories-list">
        <button
          onClick={() => onCategorySelect(null)}
          className={`category-item ${!selectedCategory ? 'active' : ''}`}
        >
          <span className="icon">🌟</span>
          <span className="name">All Categories</span>
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
          >
            <span className="icon">{category.icon}</span>
            <div className="category-content">
              <span className="name">{category.name}</span>
              <span className="category-count">{category.count}</span>
            </div>
          </button>
        ))}
      </div>

      <style jsx>{`
        .categories-wrapper {
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(20px);
          border-radius: var(--radius-lg);
          padding: 1rem;
          border: 1px solid rgba(120, 119, 198, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          margin-bottom: 1rem;
          animation: sidebarPulse 6s ease-in-out infinite;
        }

        @keyframes sidebarPulse {
          0%, 100% { border-color: rgba(120, 119, 198, 0.3); }
          50% { border-color: rgba(120, 119, 198, 0.5); }
        }

        .header {
          background: rgba(120, 119, 198, 0.2);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(120, 119, 198, 0.3);
          border-radius: var(--radius-md);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          padding: 0.75rem 1rem;
        }

        .header h3 {
          color: #7877c6;
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0;
          text-shadow: 0 0 10px rgba(120, 119, 198, 0.5);
        }

        .count {
          background: rgba(120, 219, 255, 0.2);
          color: #78dbff;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          font-size: 0.65rem;
          font-weight: 600;
          border: 1px solid rgba(120, 219, 255, 0.3);
        }

        .categories-list {
          display: flex !important;
          flex-direction: column !important;
          gap: 0 !important;
        }

        .category-item {
          display: flex !important;
          align-items: center !important;
          gap: 0.6rem !important;
          padding: 0.8rem !important;
          background: rgba(255, 255, 255, 0.15) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-bottom: none !important;
          color: white !important;
          text-decoration: none !important;
          transition: all 0.2s ease !important;
          cursor: pointer !important;
          width: 100% !important;
          text-align: left !important;
          backdrop-filter: blur(10px) !important;
          border-radius: 0 !important;
        }

        .categories-list .category-item:first-child {
          border-top-left-radius: var(--radius-md) !important;
          border-top-right-radius: var(--radius-md) !important;
        }

        .categories-list .category-item:last-child {
          border-bottom-left-radius: var(--radius-md) !important;
          border-bottom-right-radius: var(--radius-md) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        .category-item:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .category-item.active {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .icon {
          font-size: 1rem;
          flex-shrink: 0;
        }

        .category-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .name {
          font-weight: 500;
          font-size: 0.8rem;
        }

        .category-count {
          background: rgba(255, 255, 255, 0.25);
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          font-size: 0.65rem;
          font-weight: 600;
          min-width: 20px;
          text-align: center;
        }

        .loading {
          color: rgba(255, 255, 255, 0.8);
          text-align: center;
          padding: 1rem;
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
}
