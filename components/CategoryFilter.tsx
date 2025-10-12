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
  { id: 'diy', name: 'DIY & Crafts', description: 'Creative projects', icon: '🔨', createdAt: '', color: '#f97316' },
  { id: 'finance', name: 'Finance', description: 'Money tips', icon: '💰', createdAt: '', color: '#84cc16' },
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
          <h2 className="categories-title">🏷️ Categories</h2>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span>Loading categories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-wrapper">
      <div className="categories-header">
        <div className="header-content">
          <h2 className="categories-title">🏷️ Categories</h2>
          <p className="categories-subtitle">Filter by topic ({categories.length} available)</p>
        </div>
        <div className="categories-badge">
          <span className="badge-number">{categories.length}</span>
          <span className="badge-label">Topics</span>
        </div>
      </div>

      <div className="categories-container">
        <button
          className={`category-all ${!selectedCategory ? 'active' : ''}`}
          onClick={() => onCategorySelect(null)}
        >
          <div className="category-icon-wrapper">
            <span className="category-icon">🌟</span>
            <div className="icon-glow"></div>
          </div>
          <div className="category-content">
            <span className="category-name">All Categories</span>
            <span className="category-desc">Browse everything</span>
          </div>
          <div className="category-arrow">→</div>
        </button>

        <div className="categories-grid">
          {categories.map((category, index) => (
            <button
              key={category.id}
              className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => onCategorySelect(selectedCategory === category.id ? null : category.id)}
              style={{ 
                '--category-color': category.color || '#6366f1',
                '--delay': `${index * 0.1}s`
              } as React.CSSProperties}
            >
              <div className="category-icon-wrapper">
                <span className="category-icon">{category.icon}</span>
                <div className="icon-glow"></div>
              </div>
              <div className="category-content">
                <span className="category-name">{category.name}</span>
                <span className="category-desc">{category.description}</span>
              </div>
              <div className="selection-indicator"></div>
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .categories-wrapper {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(255, 107, 107, 0.3);
        }

        .categories-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(238, 90, 36, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 107, 107, 0.2) 0%, transparent 50%);
          pointer-events: none;
        }

        .categories-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          position: relative;
          z-index: 2;
        }

        .header-content {
          flex: 1;
        }

        .categories-title {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          margin: 0 0 8px 0;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          letter-spacing: -0.02em;
        }

        .categories-subtitle {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          font-weight: 500;
        }

        .categories-badge {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          padding: 16px 24px;
          text-align: center;
          min-width: 100px;
        }

        .badge-number {
          display: block;
          font-size: 2rem;
          font-weight: 800;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .badge-label {
          display: block;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .loading-state {
          padding: 64px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          color: rgba(255, 255, 255, 0.8);
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
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
          gap: 20px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .category-all::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.8s ease;
        }

        .category-all:hover::before {
          left: 100%;
        }

        .category-all:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
        }

        .category-all.active {
          background: white;
          border-color: #fbbf24;
          color: #ee5a24;
          box-shadow: 0 0 0 2px #fbbf24, 0 16px 32px rgba(251, 191, 36, 0.4);
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .category-item {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          animation: slideUp 0.6s ease-out var(--delay) both;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .category-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.8s ease;
        }

        .category-item:hover::before {
          left: 100%;
        }

        .category-item:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
        }

        .category-item.active {
          background: var(--category-color);
          border-color: var(--category-color);
          color: white;
          box-shadow: 0 0 0 2px var(--category-color), 0 12px 24px rgba(0, 0, 0, 0.3);
          transform: translateY(-2px);
        }

        .category-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          flex-shrink: 0;
        }

        .category-icon {
          font-size: 2rem;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          transition: transform 0.3s ease;
          z-index: 2;
          position: relative;
        }

        .category-item:hover .category-icon,
        .category-all:hover .category-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .icon-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 70px;
          height: 70px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
          border-radius: 50%;
          animation: glow 2s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.8;
          }
        }

        .category-content {
          flex: 1;
          min-width: 0;
          text-align: left;
        }

        .category-name {
          display: block;
          font-size: 1.125rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .category-all.active .category-name,
        .category-item.active .category-name {
          color: inherit;
          text-shadow: none;
        }

        .category-desc {
          display: block;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .category-all.active .category-desc,
        .category-item.active .category-desc {
          color: rgba(255, 255, 255, 0.9);
        }

        .category-arrow {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          transition: transform 0.3s ease;
        }

        .category-all:hover .category-arrow {
          transform: translateX(4px);
        }

        .category-all.active .category-arrow {
          color: #ee5a24;
        }

        .selection-indicator {
          width: 4px;
          height: 40px;
          background: var(--category-color);
          border-radius: 2px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .category-item.active .selection-indicator {
          opacity: 1;
        }

        @media (max-width: 1024px) {
          .categories-wrapper {
            padding: 24px;
            margin-bottom: 24px;
          }

          .categories-title {
            font-size: 1.75rem;
          }

          .categories-subtitle {
            font-size: 1rem;
          }

          .categories-grid {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 12px;
          }

          .category-item, .category-all {
            padding: 16px;
            gap: 12px;
          }

          .category-icon-wrapper {
            width: 48px;
            height: 48px;
          }

          .category-icon {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 768px) {
          .categories-wrapper {
            padding: 20px;
            margin-bottom: 20px;
          }

          .categories-header {
            flex-direction: column;
            gap: 16px;
            text-align: center;
            margin-bottom: 24px;
          }

          .categories-title {
            font-size: 1.5rem;
          }

          .categories-subtitle {
            font-size: 0.875rem;
          }

          .categories-badge {
            align-self: center;
            min-width: 80px;
            padding: 12px 20px;
          }

          .badge-number {
            font-size: 1.5rem;
          }

          .categories-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .category-item, .category-all {
            padding: 12px;
            gap: 10px;
          }

          .category-icon-wrapper {
            width: 40px;
            height: 40px;
          }

          .category-icon {
            font-size: 1.5rem;
          }

          .category-name {
            font-size: 1rem;
          }

          .category-desc {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
