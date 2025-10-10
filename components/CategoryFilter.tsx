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
    console.log('🔍 Loading categories...');
    try {
      const response = await TrickShareAPI.getCategories();
      console.log('📦 Categories response:', response);
      setCategories(response.categories || []);
      console.log('✅ Categories loaded:', response.categories?.length || 0);
    } catch (error) {
      console.error('❌ Error loading categories:', error);
      // Fallback categories if API fails
      const fallbackCategories = [
        { id: 'cooking', name: 'Cooking', description: 'Kitchen tips and recipes', icon: '🍳', createdAt: '' },
        { id: 'cleaning', name: 'Cleaning', description: 'House cleaning tips', icon: '🧹', createdAt: '' },
        { id: 'technology', name: 'Technology', description: 'Tech tips and tricks', icon: '📱', createdAt: '' },
        { id: 'health', name: 'Health', description: 'Wellness and fitness', icon: '🍎', createdAt: '' },
        { id: 'travel', name: 'Travel', description: 'Travel tips and hacks', icon: '✈️', createdAt: '' },
      ];
      console.log('🔄 Using fallback categories:', fallbackCategories.length);
      setCategories(fallbackCategories);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="category-filter">
        <div className="category-header">
          <h3>Categories</h3>
        </div>
        <div className="loading">Loading categories...</div>
        <style jsx>{`
          .category-filter {
            background: white;
            border-radius: 8px;
            border: 3px solid #ff0000;
            overflow: hidden;
            margin-bottom: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            min-height: 200px;
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
          .loading {
            padding: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="category-filter">
      <div className="category-header">
        <h3>Categories ({categories.length})</h3>
      </div>
      
      <div className="category-list">
        {categories.length === 0 && !loading && (
          <div style={{ padding: '16px', color: '#666', fontSize: '14px' }}>
            No categories loaded. Check console for errors.
          </div>
        )}
        
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
        .category-filter {
          background: white;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          margin-bottom: 1rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }
        
        .category-header {
          background: #f9fafb;
          padding: 0.875rem 1rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .category-header h3 {
          margin: 0;
          font-size: 0.75rem;
          font-weight: 700;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .category-list {
          padding: 0.25rem 0;
        }
        
        .category-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 0.75rem 1rem;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.15s ease-in-out;
          text-align: left;
          border-left: 3px solid transparent;
          font-size: 0.875rem;
        }
        
        .category-item:hover {
          background: #f1f5f9;
        }
        
        .category-item.active {
          background: #dbeafe;
          border-left-color: #3b82f6;
          color: #1d4ed8;
        }
        
        .category-icon {
          font-size: 1.125rem;
          margin-right: 0.75rem;
          width: 1.25rem;
          text-align: center;
          flex-shrink: 0;
        }
        
        .category-name {
          font-weight: 500;
          color: #374151;
          flex: 1;
        }
        
        .category-item.active .category-name {
          color: #1d4ed8;
          font-weight: 600;
        }
        
        @media (max-width: 768px) {
          .category-filter {
            margin-bottom: 0.75rem;
            border-radius: 0.5rem;
          }
          
          .category-header {
            padding: 0.75rem;
          }
          
          .category-item {
            padding: 0.875rem 0.75rem;
          }
          
          .category-icon {
            font-size: 1.25rem;
            margin-right: 0.625rem;
          }
          
          .category-name {
            font-size: 0.9375rem;
          }
        }
      `}</style>
    </div>
  );
}
