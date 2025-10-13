# Category Filtering Architecture

## Overview
TrickShare implements a sophisticated category filtering system with smart keyword detection across multiple languages, ensuring consistent counts between sidebar display and actual filtering results.

## Core Components

### 1. Shared Category Matching Logic (`/lib/categoryMatcher.ts`)
```typescript
export function matchesCategory(trick: any, categoryFilter: string): boolean
export function categorizeAllTricks(tricks: any[]): CategoryCounts
```

**Features:**
- Smart keyword detection for multilingual content
- Consistent logic shared between counting and filtering
- Support for cooking, cleaning, technology, health, and travel categories

### 2. Categories API (`/pages/api/categories.ts`)
- Scans all tricks from DynamoDB
- Uses `categorizeAllTricks()` for accurate counting
- Returns categories with real-time counts
- OIDC authentication for AWS services

### 3. Tricks API (`/pages/api/tricks/index.ts`)
- Handles country, category, difficulty, and search filtering
- Uses `matchesCategory()` for in-memory category filtering
- Applies DynamoDB filters for performance optimization
- Consistent with categories API logic

### 4. Frontend Components

#### Categories Component (`/components/Categories.tsx`)
- Fetches categories from API with accurate counts
- Displays interactive category buttons
- Handles category selection state
- Global Network theme styling with glass morphism

#### Main Page Integration (`/pages/index.tsx`)
- Manages filtering state (country, category, search)
- Calls tricks API with proper parameters
- Updates UI based on filter selections

## Data Flow

```
1. User clicks category → handleCategorySelect()
2. Frontend calls /api/tricks?category=cooking
3. API scans DynamoDB with base filters
4. matchesCategory() filters results in memory
5. Consistent results displayed to user
```

## Smart Category Detection

### Keyword Mapping
- **Cooking**: tea, coffee, pasta, bread, sauce, spice, wine, beer, recipe, food
- **Technology**: tech, app, phone, computer, digital, software, productivity
- **Cleaning**: clean, organize, tidy
- **Travel**: travel, car, winter, trip, journey
- **Health**: health, exercise, diet

### Multilingual Support
- Works across 20+ languages (Turkish, Japanese, Chinese, Hindi, etc.)
- Keyword detection in titles and descriptions
- Fallback categorization for uncategorized content

## Database Structure

### Required Fields
```javascript
{
  id: string,
  title: string,
  description: string,
  category: string,  // Required: cooking, cleaning, travel, productivity
  country: string,
  countryCode: string
}
```

### Category Distribution (33 total tricks)
- **Cooking**: ~29 tricks (food, beverages, recipes)
- **Cleaning**: 2 tricks (organization, tidying)
- **Technology**: 1 trick (productivity, workspace)
- **Travel**: 1 trick (winter car maintenance)

## Authentication
- **OIDC Integration**: Automatic AWS credential detection
- **DynamoDB Access**: Secure table scanning and filtering
- **Environment Agnostic**: Works in development and production

## Performance Optimizations
- **DynamoDB Filtering**: Country, difficulty, search at database level
- **Memory Filtering**: Category matching for complex logic
- **Shared Logic**: Single source of truth for categorization
- **Efficient Scanning**: Projection expressions for minimal data transfer

## Consistency Guarantees
1. **Count Accuracy**: Sidebar counts match filtering results
2. **Logic Alignment**: Same matching function for counting and filtering
3. **Real-time Updates**: Categories reflect current database state
4. **Cross-language Support**: Consistent categorization across languages

## Troubleshooting

### Common Issues
- **Missing Categories**: Ensure all tricks have `category` field
- **Count Mismatches**: Verify shared logic usage in both APIs
- **Authentication Errors**: Check OIDC configuration
- **Filtering Problems**: Validate API parameter passing

### Verification Steps
1. Check `/api/categories` returns accurate counts
2. Verify `/api/tricks?category=X` matches sidebar count
3. Test multilingual keyword detection
4. Confirm country filtering works alongside categories

## Future Enhancements
- Dynamic category creation based on content analysis
- Machine learning categorization for new tricks
- Category hierarchy support (subcategories)
- User-defined custom categories
