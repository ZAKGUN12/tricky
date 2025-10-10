import { useState, useEffect, useCallback } from 'react';
import { TrickShareAPI } from '../lib/api';
import { Category } from '../lib/types';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export default function CategoryFilter({ selectedCategory, onCategorySelect }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    try {
      const response = await TrickShareAPI.getCategories();
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([
        { id: 'cooking', name: 'Cooking', description: 'Kitchen tips', icon: '🍳', createdAt: '' },
        { id: 'cleaning', name: 'Cleaning', description: 'House tips', icon: '🧹', createdAt: '' },
        { id: 'technology', name: 'Technology', description: 'Tech tips', icon: '📱', createdAt: '' },
        { id: 'health', name: 'Health', description: 'Wellness', icon: '🍎', createdAt: '' },
        { id: 'travel', name: 'Travel', description: 'Travel tips', icon: '✈️', createdAt: '' },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  if (loading) {
    return (
      <div className="card">
        <div className="p-4 text-center text-gray-500">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="category-header">
        <h3>Categories ({categories.length})</h3>
      </div>
      
      <div className="category-list">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategorySelect(selectedCategory === category.id ? null : category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>
      
      <style jsx>{`
        .category-header {
          padding: 0.75rem 1rem;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .category-header h3 {
          margin: 0;
          font-size: 0.75rem;
          font-weight: 700;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .category-list {
          padding: 0.25rem 0;
        }
        
        .category-item {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          text-align: left;
          background: none;
          border: none;
          border-left: 3px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #374151;
        }
        
        .category-item:hover {
          background: #f9fafb;
        }
        
        .category-item.active {
          background: #dbeafe;
          border-left-color: #3b82f6;
          color: #1d4ed8;
        }
        
        .category-icon {
          font-size: 1.125rem;
          margin-right: 0.75rem;
        }
        
        .category-name {
          font-weight: 500;
        }
        
        .category-item.active .category-name {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
