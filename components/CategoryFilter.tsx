import { useState, useEffect } from 'react';
import { TrickShareAPI } from '../lib/api';
import { Category } from '../lib/types';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export default function CategoryFilter({ selectedCategory, onCategorySelect }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await TrickShareAPI.getCategories();
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="category-filter loading">Loading categories...</div>;
  }

  return (
    <div className="category-filter">
      <div className="category-header">
        <h3>Categories</h3>
      </div>
      
      <div className="category-list">
        <button
          className={`category-item ${!selectedCategory ? 'active' : ''}`}
          onClick={() => onCategorySelect(null)}
        >
          <span className="category-icon">🌍</span>
          <span className="category-name">All Tricks</span>
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategorySelect(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>

      <style jsx>{`
        .category-filter {
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          margin-bottom: 20px;
        }
        
        .category-header {
          background: #f9fafb;
          padding: 12px 16px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .category-header h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .category-list {
          padding: 8px 0;
        }
        
        .category-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 8px 16px;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }
        
        .category-item:hover {
          background: #f3f4f6;
        }
        
        .category-item.active {
          background: #dbeafe;
          border-right: 3px solid #3b82f6;
        }
        
        .category-icon {
          font-size: 16px;
          margin-right: 12px;
          width: 20px;
          text-align: center;
        }
        
        .category-name {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }
        
        .category-item.active .category-name {
          color: #1d4ed8;
          font-weight: 600;
        }
        
        .loading {
          padding: 20px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        
        @media (max-width: 768px) {
          .category-filter {
            margin-bottom: 16px;
          }
          
          .category-item {
            padding: 12px 16px;
          }
          
          .category-name {
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
}
