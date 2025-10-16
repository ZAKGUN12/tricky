# TrickShare - Global Community for Life Tricks

A modern, multilingual platform where people from around the world share practical life tricks and tips. Built with Next.js, AWS DynamoDB, and featuring a stunning **🌍 Global Network** space theme with advanced visual effects.

## 🌍 Live Demo

**Production:** [tricky-peach.vercel.app](https://tricky-peach.vercel.app)

## ✨ Latest Features (v2.1) - October 2025

### 🔧 Recent Improvements
- **Fixed Authentication Flow**: Resolved redirect loop issues after sign-in
- **Enhanced Logout UX**: Improved logout button visibility and mobile layout
- **Relocated Counters**: Moved tricks counter to Global Network section for better organization
- **Fixed Form Validation**: Resolved "Validation failed" errors in trick submission
- **Better Error Handling**: Added comprehensive client-side validation and error messages

### 🚀 Global Network Theme
- **Space-age Design**: Dark gradient backgrounds with floating particle effects
- **Advanced Animations**: Pulsing glow effects, shimmer animations, and floating orbs
- **Glass Morphism**: Sophisticated backdrop blur effects throughout the interface
- **Color Palette**: Purple (#7877c6), cyan (#78dbff), and pink (#ff77c6) accents
- **Interactive Elements**: Enhanced hover effects with scaling and glow animations

### 📱 Mobile-First Experience
- **Responsive Design**: Optimized layouts for all screen sizes
- **Performance Optimized**: Reduced animations on mobile for better performance
- **Touch-Friendly**: Improved button sizes and spacing for mobile interaction
- **Fixed Header Layout**: Resolved overlapping issues between logout button and counters

### 🎯 Enhanced UI Components
- **Dual Counter Display**: Countries and Tricks counters side-by-side in Global Network
- **Improved Authentication**: Seamless sign-in/sign-out experience with proper state management
- **Real-Time Counting**: Accurate category counts from live DynamoDB data
- **Smart Filtering**: Dynamic category detection with keyword matching

## ✨ Core Features

### International Content
- **Multilingual Tricks**: Content in 20+ languages including Turkish, Japanese, French, Hindi, Portuguese, Arabic, Russian, Chinese, and more
- **Global Representation**: 🇹🇷 Turkey, 🇯🇵 Japan, 🇩🇪 Germany, 🇫🇷 France, 🇬🇧 UK, 🇮🇹 Italy, 🇪🇸 Spain, 🇨🇦 Canada, 🇦🇺 Australia, 🇧🇷 Brazil, 🇮🇳 India, 🇨🇳 China, 🇰🇷 South Korea, 🇲🇽 Mexico, and more
- **Dynamic Country Chain**: Interactive country selector with trick counts

### Smart Features
- **Browse & Discover**: Explore life hacks from around the world
- **Submit Tricks**: Share your own tips with the global community (with robust validation)
- **Interactive Engagement**: Give kudos, comment, and view detailed trick instructions
- **Advanced Search**: Find tricks by title, description, or tags
- **Smart Category Filtering**: Intelligent categorization with multilingual keyword detection

### Social & Gamification
- **Top 3 Leaderboard**: See the top contributors ranked by community engagement
- **Top 3 Tricks**: Dynamic ranking based on community kudos
- **Real-Time Stats**: Live view counts, kudos, and engagement metrics
- **Comments System**: Interactive commenting on tricks

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with SSR/SSG
- **TypeScript** - Type-safe development with full compliance
- **Advanced CSS** - Glass morphism, animations, and responsive design
- **React Hooks** - Optimized with useCallback and proper dependency management

### Backend & Database
- **AWS DynamoDB** - NoSQL database with optimized queries
- **Next.js API Routes** - Serverless API endpoints with comprehensive validation
- **Real-Time Data** - Live updates and accurate counting

### Authentication & Security
- **AWS Cognito** - Secure user authentication and management
- **Input Validation** - Comprehensive Zod schema validation
- **XSS Protection** - Input sanitization and security measures
- **Rate Limiting** - API protection against abuse

### Deployment & Performance
- **Vercel** - Frontend hosting with automatic deployments
- **AWS IAM** - Secure credential management
- **Performance Optimized** - Mobile-first approach with efficient data fetching

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- AWS Account with DynamoDB access
- Git

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/ZAKGUN12/tricky.git
cd tricky
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your_user_pool_id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your_client_id
NEXT_PUBLIC_COGNITO_DOMAIN=your_cognito_domain
```

4. **Run development server:**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to experience the Global Network theme.

## 📊 Database Schema

### TrickShare-Tricks
```javascript
{
  id: string,              // Primary key
  title: string,           // 5-100 characters, validated
  description: string,     // 10-500 characters, validated
  steps: string[],         // Array of step instructions (1-5 steps)
  country: string,         // Country name
  countryCode: string,     // ISO country code (2 letters)
  difficulty: 'easy' | 'medium' | 'hard',
  tags: string[],          // Searchable tags (max 5)
  category: string,        // Category classification
  authorName: string,      // Username
  authorEmail: string,     // Validated email
  kudos: number,           // Community likes
  views: number,           // View count
  comments: number,        // Comment count
  status: 'approved',      // Moderation status
  createdAt: string        // ISO timestamp
}
```

## 🌐 API Endpoints

### Tricks
- `GET /api/tricks` - List all tricks with smart filtering
- `POST /api/tricks` - Create new trick (with comprehensive validation)
- `GET /api/tricks/[id]` - Get specific trick
- `POST /api/tricks/[id]/kudos` - Give kudos to trick
- `GET /api/tricks/top` - Get top 3 tricks by kudos

### Categories & Stats
- `GET /api/categories` - Get categories with real-time counts
- `GET /api/leaderboard` - Get top 3 contributors
- `GET /api/users/stats` - Get user statistics

### Authentication
- `POST /api/auth/signin` - User authentication
- `GET /api/auth/user` - Get user profile
- `POST /api/auth/verify` - Email verification

## 🎨 Global Network Theme Components

### Enhanced Sidebar
- **Categories**: Purple gradient with real-time trick counting
- **Top 3 Tricks**: Pink gradient showing community favorites
- **Top 3 Leaderboard**: Cyan gradient with contributor rankings

### Global Network Section
- **Dual Counters**: Countries and Tricks displayed side-by-side
- **Calendar-Style Badges**: Beautiful counter design with gradient headers
- **Country Chain**: Interactive country selector with trick counts

### Interactive Elements
- **Trick Cards**: Glass morphism with shimmer hover effects
- **Action Buttons**: Global Network color gradients with scale animations
- **Authentication UI**: Seamless sign-in/sign-out with proper state management

## 📱 Mobile Experience

- **Responsive Header**: Fixed layout issues with proper element spacing
- **Optimized Performance**: Reduced animations for better mobile performance
- **Touch-Friendly Interface**: Improved button sizes and interaction areas
- **Responsive Typography**: Scalable text and elements across all devices

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint with zero warnings
npm run type-check   # Run TypeScript checks
```

### Code Quality
- **ESLint**: Zero warnings or errors
- **TypeScript**: Full type safety with proper React Hook dependencies
- **React Best Practices**: useCallback optimization and dependency management
- **Performance**: Optimized for both desktop and mobile experiences

### Recent Bug Fixes
- ✅ **Authentication Redirect Loop**: Fixed infinite redirect after sign-in
- ✅ **Logout Button Visibility**: Improved header layout and mobile responsiveness
- ✅ **Form Validation**: Resolved "Validation failed" errors with proper data formatting
- ✅ **Counter Layout**: Relocated tricks counter to Global Network section
- ✅ **Error Handling**: Added comprehensive client-side validation

## 🌍 Internationalization

The platform supports content in multiple languages with smart category detection:
- **English** - Primary interface language
- **Asian Languages**: Japanese (生活のコツ), Chinese (生活小窍门), Korean, Hindi (जीवन की तरकीबें)
- **European Languages**: Turkish, French, German, Spanish, Italian, Portuguese, Russian
- **Middle Eastern**: Arabic (حيل الحياة)

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Automatic deployment on push to main branch

### AWS Configuration
- **DynamoDB**: Optimized tables with proper indexing
- **Cognito**: Secure user authentication and management
- **IAM**: Secure credential management with minimal permissions
- **Performance**: Efficient queries and real-time data updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Follow TypeScript and React best practices
4. Ensure all ESLint checks pass
5. Test authentication and form validation
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Global community contributors from 20+ countries
- AWS for reliable cloud infrastructure and authentication
- Vercel for seamless deployment
- Next.js team for the excellent framework
- The open-source community for inspiration

## 📞 Support

For support, email [support@trickshare.com](mailto:support@trickshare.com) or create an issue on GitHub.

---

**Built with ❤️ and 🌍 Global Network theme by the worldwide community**

*Experience the future of knowledge sharing with our space-age interface, robust authentication, and real-time global connectivity.*
