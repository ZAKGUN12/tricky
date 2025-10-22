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
            background: linear-gradient(145deg, rgba(15, 15, 35, 0.6), rgba(25, 25, 45, 0.4));
            backdrop-filter: blur(15px);
            border: 1px solid rgba(120, 219, 255, 0.3);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          }

          .communities-header {
            background: linear-gradient(135deg, rgba(120, 219, 255, 0.2), rgba(120, 119, 198, 0.15));
            padding: 1.25rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            border-bottom: 1px solid rgba(120, 219, 255, 0.2);
            position: relative;
          }

          .communities-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(120, 219, 255, 0.5), transparent);
          }

          .header-icon {
            font-size: 1.3rem;
            filter: drop-shadow(0 0 8px rgba(120, 219, 255, 0.6));
          }

          .communities-header h3 {
            color: #ffffff;
            font-size: 1rem;
            font-weight: 600;
            margin: 0;
            text-shadow: 0 0 10px rgba(120, 219, 255, 0.3);
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
          background: linear-gradient(145deg, rgba(15, 15, 35, 0.6), rgba(25, 25, 45, 0.4));
          backdrop-filter: blur(15px);
          border: 1px solid rgba(120, 219, 255, 0.3);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .communities-header {
          background: linear-gradient(135deg, rgba(120, 219, 255, 0.2), rgba(120, 119, 198, 0.15));
          padding: 1.25rem;
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
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .community-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(120, 219, 255, 0.2);
          border-radius: 12px;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          text-align: left;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .community-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(120, 219, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .community-item:hover::before {
          left: 100%;
        }

        .community-item:hover {
          background: rgba(120, 219, 255, 0.1);
          border-color: rgba(120, 219, 255, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(120, 219, 255, 0.2);
        }

        .community-item.active {
          background: linear-gradient(135deg, rgba(120, 219, 255, 0.2), rgba(120, 119, 198, 0.15));
          border-color: rgba(120, 219, 255, 0.6);
          box-shadow: 0 0 20px rgba(120, 219, 255, 0.3);
        }

        .community-icon {
          font-size: 1.2rem;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(120, 219, 255, 0.2), rgba(120, 119, 198, 0.1));
          border-radius: 10px;
          border: 1px solid rgba(120, 219, 255, 0.3);
          transition: all 0.3s ease;
          filter: drop-shadow(0 0 8px rgba(120, 219, 255, 0.3));
        }

        .community-item:hover .community-icon {
          background: linear-gradient(135deg, rgba(120, 219, 255, 0.3), rgba(120, 119, 198, 0.2));
          border-color: rgba(120, 219, 255, 0.5);
          transform: scale(1.1);
        }

        .community-item.active .community-icon {
          background: linear-gradient(135deg, rgba(120, 219, 255, 0.4), rgba(120, 119, 198, 0.3));
          border-color: rgba(120, 219, 255, 0.6);
          box-shadow: 0 0 15px rgba(120, 219, 255, 0.4);
        }

        .community-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .community-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #ffffff;
          text-shadow: 0 0 8px rgba(120, 219, 255, 0.2);
        }

        .community-count {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

        .community-item.active .community-count {
          color: rgba(120, 219, 255, 0.9);
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
