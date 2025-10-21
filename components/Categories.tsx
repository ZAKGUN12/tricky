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
      <div className="communities-container">
        <div className="communities-header">
          <div className="header-icon">🌟</div>
          <h3>Popular Communities</h3>
        </div>
        <div className="loading">Loading communities...</div>
        
        <style jsx>{`
          .communities-container {
            background: white;
            border-radius: 0;
            border: none;
            overflow: hidden;
          }

          .communities-header {
            background: linear-gradient(135deg, rgba(120, 119, 198, 0.1), rgba(120, 219, 255, 0.05));
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          }

          .header-icon {
            font-size: 1.2rem;
            filter: none;
          }

          .communities-header h3 {
            color: #333;
            font-size: 0.95rem;
            font-weight: 600;
            margin: 0;
            text-shadow: none;
          }

          .loading {
            padding: 2rem;
            text-align: center;
            color: #666;
            font-size: 0.85rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="communities-container">
      <div className="communities-header">
        <div className="header-icon">🌟</div>
        <h3>Popular Communities</h3>
      </div>
      
      <div className="communities-list">
        <button
          onClick={() => onCategorySelect(null)}
          className={`community-item ${!selectedCategory ? 'active' : ''}`}
        >
          <div className="community-icon">🏠</div>
          <div className="community-info">
            <span className="community-name">All Tricks</span>
            <span className="community-count">{(tricks || []).length} posts</span>
          </div>
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`community-item ${selectedCategory === category.id ? 'active' : ''}`}
          >
            <div className="community-icon">{category.icon}</div>
            <div className="community-info">
              <span className="community-name">{category.name}</span>
              <span className="community-count">{category.count} posts</span>
            </div>
          </button>
        ))}
      </div>

      <style jsx>{`
        .communities-container {
          background: white;
          border-radius: 0;
          border: none;
          overflow: hidden;
          margin: 0;
          padding: 0;
          box-shadow: none;
        }

        .communities-header {
          background: linear-gradient(135deg, rgba(120, 119, 198, 0.3), rgba(120, 219, 255, 0.2));
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid rgba(120, 119, 198, 0.2);
        }

        .header-icon {
          font-size: 1.2rem;
          filter: drop-shadow(0 0 8px rgba(120, 219, 255, 0.6));
        }

        .communities-header h3 {
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 600;
          margin: 0;
          text-shadow: 0 0 10px rgba(120, 219, 255, 0.4);
        }

        .communities-list {
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .community-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: white;
          border: none;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 0;
          color: #333;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          text-align: left;
        }

        .community-item:hover {
          background: rgba(120, 119, 198, 0.05);
          color: #333;
        }

        .community-item.active {
          background: rgba(120, 119, 198, 0.1);
          color: #333;
          border-left: 3px solid #7877c6;
        }

        .community-icon {
          font-size: 1.1rem;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(120, 119, 198, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(120, 119, 198, 0.2);
          transition: all 0.2s ease;
        }

        .community-item:hover .community-icon {
          background: rgba(120, 119, 198, 0.2);
        }

        .community-item.active .community-icon {
          background: rgba(120, 119, 198, 0.2);
          border-color: #7877c6;
        }

        .community-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .community-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: inherit;
        }

        .community-count {
          font-size: 0.7rem;
          color: #666;
          font-weight: 500;
        }

        .community-item.active .community-count {
          color: #7877c6;
        }

        .loading {
          padding: 2rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
}
