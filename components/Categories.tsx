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
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          margin-bottom: 1rem;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header h3 {
          color: white;
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .count {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          font-size: 0.65rem;
          font-weight: 600;
        }

        .categories-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .category-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          color: white;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          width: 100%;
          text-align: left;
          backdrop-filter: blur(10px);
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
