import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface CategoriesProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string | null) => void;
}

export default function Categories({ selectedCategory, onCategorySelect }: CategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        // Handle both direct array and wrapped object
        const categoriesArray = Array.isArray(data) ? data : (data.categories || []);
        setCategories(categoriesArray);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header h3 {
          color: white;
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0;
        }

        .count {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

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
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          color: white;
          text-decoration: none;
          transition: all var(--transition-smooth);
          cursor: pointer;
          width: 100%;
          text-align: left;
        }

        .category-item:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .category-item.active {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .icon {
          font-size: 1.2rem;
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
          font-size: 0.9rem;
        }

        .category-count {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.125rem 0.5rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .loading {
          color: rgba(255, 255, 255, 0.8);
          text-align: center;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
}
