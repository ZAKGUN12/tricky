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
      <div className="px-4 py-3 bg-gray-50 border-b">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide">
          Categories ({categories.length})
        </h3>
      </div>
      
      <div className="py-1">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors border-l-3 ${
              selectedCategory === category.id 
                ? 'bg-blue-50 border-l-blue-500 text-blue-700' 
                : 'border-l-transparent text-gray-700'
            }`}
            onClick={() => onCategorySelect(selectedCategory === category.id ? null : category.id)}
          >
            <span className="text-lg mr-3">{category.icon}</span>
            <span className="font-medium">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
