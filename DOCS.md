# TrickShare Documentation

## 🔧 Setup & Configuration

### Environment Variables
```env
AWS_REGION=eu-west-1
NEXT_PUBLIC_AWS_REGION=eu-west-1
NEXT_PUBLIC_COGNITO_DOMAIN=trickshare-auth.auth.eu-west-1.amazoncognito.com
NEXT_PUBLIC_COGNITO_CLIENT_ID=7ce3588lqfcmq6ckedmlui6i9e
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback
```

### AWS Cognito Setup
1. Create User Pool in AWS Cognito
2. Configure app client with OIDC
3. Set redirect URIs for local and production
4. Enable email verification

### Vercel Deployment
1. Connect GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

## 🔒 Security Features

### Input Validation
- Zod schema validation for all inputs
- XSS prevention with HTML entity encoding
- SQL injection protection
- File upload restrictions

### Rate Limiting
- 100 requests per 15 minutes per IP
- Automatic IP tracking and cleanup
- Rate limit headers in responses

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security

### Authentication
- AWS Cognito integration
- JWT token validation
- Secure session management
- Email verification required

## 🏗️ Architecture

### Database Schema (DynamoDB)
```javascript
TrickShare-Tricks: {
  id: string,              // Primary key
  title: string,           // 5-100 characters
  description: string,     // 10-500 characters
  steps: string[],         // 1-5 steps
  country: string,         // Country name
  countryCode: string,     // ISO 2-letter code
  difficulty: 'easy' | 'medium' | 'hard',
  tags: string[],          // Max 5 tags
  category: string,        // Auto-categorized
  authorName: string,      // Username
  authorEmail: string,     // Validated email
  kudos: number,           // Community likes
  views: number,           // View count
  comments: number,        // Comment count
  status: 'approved',      // Moderation status
  createdAt: string        // ISO timestamp
}
```

### API Endpoints
- `GET /api/tricks` - List tricks with filtering
- `POST /api/tricks` - Create new trick
- `GET /api/tricks/[id]` - Get specific trick
- `POST /api/tricks/[id]/kudos` - Give kudos
- `GET /api/categories` - Get categories with counts
- `GET /api/leaderboard` - Top contributors
- `POST /api/auth/signin` - User authentication
- `GET /api/auth/user` - Get user profile

### Category Filtering
Smart categorization using keyword matching:
- **Cooking**: food, recipe, kitchen, cooking
- **Technology**: tech, computer, software, app
- **Health**: health, fitness, exercise, wellness
- **Home**: home, house, cleaning, organization
- **Travel**: travel, trip, vacation, journey
- **Money**: money, finance, budget, save

## 🎨 UI Components

### Global Network Theme
- Space-age design with dark gradients
- Glass morphism effects
- Purple (#7877c6), cyan (#78dbff), pink (#ff77c6) palette
- Floating particle animations
- Interactive hover effects

### Responsive Design
- Mobile-first approach
- Touch-friendly interfaces
- Optimized performance on mobile
- Single-column layout for small screens

### Key Components
- **CountryChain**: Interactive country selector with counters
- **Categories**: Sidebar with real-time trick counts
- **TopTricks**: Community favorites ranking
- **Leaderboard**: Top contributors display
- **AuthGuard**: Protected route wrapper

## 🚀 Development

### Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
npm run type-check   # TypeScript validation
```

### Code Quality
- TypeScript strict mode
- ESLint with zero warnings
- Husky pre-commit hooks
- Automated testing on build

### Recent Fixes
- ✅ Authentication redirect loop resolved
- ✅ Logout button visibility improved
- ✅ Form validation errors fixed
- ✅ Mobile layout optimized
- ✅ Security headers implemented

## 🌍 Internationalization

Supports content in 20+ languages:
- **English** (primary)
- **Asian**: Japanese, Chinese, Korean, Hindi
- **European**: Turkish, French, German, Spanish, Italian, Portuguese, Russian
- **Middle Eastern**: Arabic

## 📱 Mobile Features

- Responsive header with proper spacing
- Touch-optimized buttons and forms
- Reduced animations for performance
- Single-column sidebar layout
- Swipe-friendly country chain

## 🔄 Deployment Process

1. **Development**: Local testing with hot reload
2. **Pre-commit**: Automated linting and type checking
3. **Build**: Production optimization and static generation
4. **Deploy**: Automatic Vercel deployment on push
5. **Monitoring**: Built-in error tracking and analytics

## 📞 Support

- **Issues**: GitHub repository issues
- **Security**: GitHub Security tab
- **General**: Create discussion in repository

---

*This documentation covers all essential aspects of TrickShare development and deployment.*
