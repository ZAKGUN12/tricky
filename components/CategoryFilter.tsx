import { useState, useEffect, useCallback } from 'react';
import { TrickShareAPI } from '../lib/api';
import { Category } from '../lib/types';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const defaultCategories = [
  { id: 'cooking', name: 'Cooking', description: 'Kitchen tips', icon: '🍳', createdAt: '', color: '#f59e0b' },
  { id: 'cleaning', name: 'Cleaning', description: 'House tips', icon: '🧹', createdAt: '', color: '#10b981' },
  { id: 'technology', name: 'Technology', description: 'Tech tips', icon: '📱', createdAt: '', color: '#3b82f6' },
  { id: 'health', name: 'Health', description: 'Wellness', icon: '🍎', createdAt: '', color: '#ef4444' },
  { id: 'travel', name: 'Travel', description: 'Travel tips', icon: '✈️', createdAt: '', color: '#06b6d4' },
  { id: 'productivity', name: 'Productivity', description: 'Work tips', icon: '⚡', createdAt: '', color: '#8b5cf6' },
];

export default function CategoryFilter({ selectedCategory, onCategorySelect }: CategoryFilterProps) {
  const [categories, setCategories] = useState<(Category & { color?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    try {
      const response = await TrickShareAPI.getCategories();
      setCategories(response.categories || defaultCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  if (loading) {
    return (
      <div className="categories-wrapper">
        <div className="categories-header">
          <h3 className="categories-title">🏷️ Categories</h3>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-wrapper">
      <div className="categories-header">
        <div className="header-content">
          <h3 className="categories-title">🏷️ Categories</h3>
          <p className="categories-subtitle">{categories.length} topics</p>
        </div>
      </div>

      <div className="categories-container">
        <button
          className={`category-all ${!selectedCategory ? 'active' : ''}`}
          onClick={() => onCategorySelect(null)}
        >
          <span className="category-icon">🌟</span>
          <span className="category-name">All Categories</span>
        </button>

        <div className="categories-grid">
          {categories.map((category, index) => (
            <button
              key={category.id}
              className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => onCategorySelect(selectedCategory === category.id ? null : category.id)}
              style={{ 
                '--category-color': category.color || '#6366f1',
                '--delay': `${index * 0.05}s`
              } as React.CSSProperties}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .categories-wrapper {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 16px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(255, 107, 107, 0.2);
        }

        .categories-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(238, 90, 36, 0.2) 0%, transparent 50%);
          pointer-events: none;
        }

        .categories-header {
          margin-bottom: 12px;
          position: relative;
          z-index: 2;
        }

        .header-content {
          text-align: center;
        }

        .categories-title {
          font-size: 1rem;
          font-weight: 700;
          color: white;
          margin: 0 0 2px 0;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .categories-subtitle {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          font-weight: 500;
        }

        .loading-state {
          padding: 20px;
          display: flex;
          justify-content: center;
          color: rgba(255, 255, 255, 0.8);
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .categories-container {
          position: relative;
          z-index: 2;
        }

        .category-all {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
        }

        .category-all:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
        }

        .category-all.active {
          background: white;
          color: #ee5a24;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
        }

        .category-item {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          animation: slideUp 0.3s ease-out var(--delay) both;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .category-item:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .category-item.active {
          background: var(--category-color);
          border-color: var(--category-color);
          color: white;
        }

        .category-icon {
          font-size: 1rem;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
          flex-shrink: 0;
        }

        .category-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        @media (max-width: 1024px) {
          .categories-wrapper {
            padding: 12px;
            margin-bottom: 12px;
          }

          .categories-title {
            font-size: 0.875rem;
          }

          .category-all, .category-item {
            padding: 6px;
            gap: 6px;
          }

          .category-icon {
            font-size: 0.875rem;
          }
        }

        @media (max-width: 768px) {
          .categories-wrapper {
            padding: 10px;
            margin-bottom: 10px;
          }

          .categories-grid {
            grid-template-columns: 1fr;
            gap: 3px;
          }

          .category-all, .category-item {
            padding: 6px;
            font-size: 0.625rem;
          }

          .category-icon {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
