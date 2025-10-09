import { useState } from 'react';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  tags: string[];
}

const categories: Category[] = [
  {
    id: 'all',
    name: 'All Tricks',
    icon: '✨',
    color: '#00d4aa',
    tags: []
  },
  {
    id: 'cooking',
    name: 'Cooking',
    icon: '👨‍🍳',
    color: '#e74c3c',
    tags: ['cooking', 'pasta', 'italian', 'recipe', 'kitchen', 'food', 'meal', 'baking', 'chef']
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    icon: '🧽',
    color: '#3498db',
    tags: ['cleaning', 'sanitize', 'stain', 'detergent', 'wash', 'scrub', 'polish', 'disinfect']
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: '⚡',
    color: '#f39c12',
    tags: ['productivity', 'time-management', 'habits', 'work', 'efficiency', 'organization']
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    icon: '💪',
    color: '#27ae60',
    tags: ['health', 'wellness', 'fitness', 'exercise', 'diet', 'mental', 'sleep']
  },
  {
    id: 'home',
    name: 'Home & DIY',
    icon: '🏠',
    color: '#9b59b6',
    tags: ['diy', 'home', 'repair', 'maintenance', 'decoration', 'furniture', 'garden']
  },
  {
    id: 'tech',
    name: 'Technology',
    icon: '📱',
    color: '#34495e',
    tags: ['tech', 'phone', 'computer', 'app', 'digital', 'software', 'gadget']
  },
  {
    id: 'money',
    name: 'Money & Finance',
    icon: '💰',
    color: '#16a085',
    tags: ['money', 'finance', 'budget', 'save', 'investment', 'frugal', 'cheap']
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: '✈️',
    color: '#e67e22',
    tags: ['travel', 'trip', 'vacation', 'packing', 'flight', 'hotel', 'tourism']
  }
];

interface CategoriesProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  trickCounts?: { [key: string]: number };
}

export default function Categories({ selectedCategory, onCategorySelect, trickCounts = {} }: CategoriesProps) {
  return (
    <div className="categories-container">
      <h3 className="categories-title">Categories</h3>
      <div className="categories-grid">
        {categories.map((category) => {
          const count = trickCounts[category.id] || 0;
          const isActive = selectedCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`category-card ${isActive ? 'active' : ''}`}
              style={{
                borderColor: isActive ? category.color : '#333',
                background: isActive ? `${category.color}15` : '#111'
              }}
            >
              <div className="category-icon" style={{ color: category.color }}>
                {category.icon}
              </div>
              <div className="category-info">
                <span className="category-name">{category.name}</span>
                <span className="category-count">{count} tricks</span>
              </div>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .categories-container {
          margin: 20px 0 !important;
          padding: 0 !important;
        }

        .categories-title {
          font-size: 18px !important;
          font-weight: 700 !important;
          color: #fff !important;
          margin-bottom: 16px !important;
          margin-top: 0 !important;
        }

        .categories-grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)) !important;
          gap: 12px !important;
          margin: 0 !important;
        }

        .category-card {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          padding: 12px 16px !important;
          border: 2px solid #333 !important;
          border-radius: 12px !important;
          background: #111 !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          text-align: left !important;
          margin: 0 !important;
        }

        .category-card:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        }

        .category-card.active {
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(0, 212, 170, 0.3) !important;
        }

        .category-icon {
          font-size: 24px !important;
          flex-shrink: 0 !important;
          margin: 0 !important;
        }

        .category-info {
          display: flex !important;
          flex-direction: column !important;
          gap: 2px !important;
          margin: 0 !important;
        }

        .category-name {
          font-size: 14px !important;
          font-weight: 600 !important;
          color: #fff !important;
          margin: 0 !important;
        }

        .category-count {
          font-size: 12px !important;
          color: #888 !important;
          margin: 0 !important;
        }

        @media (max-width: 768px) {
          .categories-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
          
          .category-card {
            padding: 10px 12px !important;
          }
          
          .category-icon {
            font-size: 20px !important;
          }
          
          .category-name {
            font-size: 13px !important;
          }
        }
      `}</style>
    </div>
  );
}

export { categories };
