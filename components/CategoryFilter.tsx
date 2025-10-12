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
      <div className="category-filter-container">
        <div className="section-header">
          <h3 className="section-title">🏷️ Categories</h3>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span>Loading categories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="category-filter-container">
      <div className="section-header">
        <h3 className="section-title">🏷️ Categories</h3>
        <div className="section-subtitle">Filter by topic ({categories.length})</div>
      </div>
      
      <div className="categories-grid">
        <button
          className={`category-item all-categories ${!selectedCategory ? 'active' : ''}`}
          onClick={() => onCategorySelect(null)}
        >
          <span className="category-icon">🌟</span>
          <span className="category-name">All Categories</span>
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategorySelect(selectedCategory === category.id ? null : category.id)}
            style={{ '--category-color': category.color || '#6366f1' } as React.CSSProperties}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>
      
      <style jsx>{`
        .category-filter-container {
          background: white;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow);
          border: 1px solid var(--gray-200);
          margin-bottom: var(--space-6);
        }
        
        .section-header {
          padding: var(--space-6);
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          text-align: center;
          position: relative;
        }
        
        .section-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="tags" width="30" height="30" patternUnits="userSpaceOnUse"><text x="15" y="20" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.1)">🏷️</text></pattern></defs><rect width="100" height="100" fill="url(%23tags)"/></svg>');
          opacity: 0.3;
        }
        
        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 var(--space-1) 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 1;
        }
        
        .section-subtitle {
          font-size: 0.875rem;
          opacity: 0.9;
          font-weight: 500;
          position: relative;
          z-index: 1;
        }
        
        .loading-state {
          padding: var(--space-8);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-4);
          color: var(--gray-500);
        }
        
        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--gray-200);
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .categories-grid {
          padding: var(--space-4);
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-2);
        }
        
        .category-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-lg);
          background: white;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
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
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
          transition: left 0.5s ease;
        }
        
        .category-item:hover::before {
          left: 100%;
        }
        
        .category-item:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .category-item.active {
          border-color: var(--category-color);
          background: linear-gradient(135deg, 
            color-mix(in srgb, var(--category-color) 10%, white),
            color-mix(in srgb, var(--category-color) 5%, white)
          );
          box-shadow: 0 0 0 1px var(--category-color);
        }
        
        .category-item.all-categories.active {
          border-color: var(--primary);
          background: linear-gradient(135deg, var(--primary-light), white);
          box-shadow: 0 0 0 1px var(--primary);
        }
        
        .category-icon {
          font-size: 1.5rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
          transition: transform 0.2s ease;
        }
        
        .category-item:hover .category-icon {
          transform: scale(1.1) rotate(5deg);
        }
        
        .category-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--gray-800);
          flex: 1;
        }
        
        .category-item.active .category-name {
          color: var(--category-color);
          font-weight: 700;
        }
        
        .category-item.all-categories.active .category-name {
          color: var(--primary);
        }
        
        @media (max-width: 1024px) {
          .section-header {
            padding: var(--space-4);
          }
          
          .section-title {
            font-size: 1.125rem;
          }
          
          .categories-grid {
            padding: var(--space-3);
          }
          
          .category-item {
            padding: var(--space-3);
            gap: var(--space-2);
          }
          
          .category-icon {
            font-size: 1.25rem;
          }
        }
        
        @media (max-width: 768px) {
          .category-item {
            gap: var(--space-2);
          }
          
          .category-icon {
            font-size: 1.125rem;
          }
          
          .category-name {
            font-size: 0.8125rem;
          }
        }
      `}</style>
    </div>
  );
}
