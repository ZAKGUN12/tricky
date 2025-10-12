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
          position: relative;
          overflow: hidden;
        }

        .categories-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.2rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          z-index: 1;
        }

        .header h3 {
          color: white;
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .count {
          background: rgba(255, 255, 255, 0.25);
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .categories-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          position: relative;
          z-index: 1;
        }

        .category-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.8rem;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          color: white;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          width: 100%;
          text-align: left;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .category-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .category-item:hover::before {
          left: 100%;
        }

        .category-item:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .category-item.active {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
          transform: scale(1.02);
        }

        .icon {
          font-size: 1.3rem;
          flex-shrink: 0;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        .category-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .name {
          font-weight: 600;
          font-size: 0.9rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .category-count {
          background: rgba(255, 255, 255, 0.25);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          font-weight: 700;
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          min-width: 24px;
          text-align: center;
        }

        .loading {
          color: rgba(255, 255, 255, 0.8);
          text-align: center;
          padding: 1.5rem;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
