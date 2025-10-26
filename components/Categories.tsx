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
      <div className="sidebar-section">
        <div className="sidebar-header">
          <div className="header-icon">🌟</div>
          <h3>Popular Communities</h3>
        </div>
        <div className="loading">Loading communities...</div>
      </div>
    );
  }

  return (
    <div className="sidebar-section">
      <div className="sidebar-header">
        <div className="header-icon">🌟</div>
        <h3>Popular Communities</h3>
      </div>
      <div className="categories-list">
        <button
          className={`category-item ${!selectedCategory ? 'active' : ''}`}
          onClick={() => onCategorySelect(null)}
        >
          <span className="category-icon">🏠</span>
          <span className="category-name">All Tricks</span>
          <span className="category-count">{tricks.length}</span>
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategorySelect(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
            <span className="category-count">{category.count}</span>
          </button>
        ))}
      </div>
      
      <style jsx>{`
        .categories-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .category-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(120, 119, 198, 0.2);
          border-radius: 8px;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
        }
        
        .category-item:hover {
          background: rgba(120, 119, 198, 0.2);
          border-color: rgba(120, 119, 198, 0.4);
          transform: translateX(4px);
        }
        
        .category-item.active {
          background: rgba(120, 119, 198, 0.3);
          border-color: rgba(120, 119, 198, 0.6);
          box-shadow: 0 0 16px rgba(120, 119, 198, 0.3);
        }
        
        .category-icon {
          font-size: 1.1rem;
          filter: drop-shadow(0 0 4px rgba(120, 119, 198, 0.5));
        }
        
        .category-name {
          flex: 1;
          font-weight: 500;
        }
        
        .category-count {
          background: rgba(120, 119, 198, 0.3);
          color: #ffffff;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          min-width: 24px;
          text-align: center;
        }
        
        .category-item:focus {
          outline: 2px solid #7877c6;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
