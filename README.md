# TrickShare - Global Community for Life Tricks

A modern, multilingual platform where people from around the world share practical life tricks and tips. Built with Next.js, AWS DynamoDB, and Cognito authentication.

## 🌍 Live Demo

**Production:** [tricky-peach.vercel.app](https://tricky-peach.vercel.app)

## ✨ Features

### Core Functionality
- **Browse Tricks:** Discover life hacks from 20+ countries in native languages
- **Submit Tricks:** Share your own tips with the global community
- **Interactive Engagement:** Give kudos, comment, and view trick details
- **Country Filtering:** Filter tricks by specific countries using the dynamic country chain
- **Search:** Find tricks by title, description, or tags across all content

### International Support
- **Multilingual Content:** Tricks in Turkish, Japanese, French, Hindi, Portuguese, Arabic, Russian, Chinese, and more
- **Country Representation:** 🇹🇷 Turkey, 🇯🇵 Japan, 🇩🇪 Germany, 🇫🇷 France, 🇬🇧 UK, 🇮🇹 Italy, 🇪🇸 Spain, 🇨🇦 Canada, 🇦🇺 Australia, 🇧🇷 Brazil, 🇮🇳 India, 🇨🇳 China, 🇰🇷 South Korea, 🇲🇽 Mexico, 🇳🇱 Netherlands, 🇸🇪 Sweden, 🇳🇴 Norway, 🇩🇰 Denmark, 🇫🇮 Finland, 🇨🇭 Switzerland, 🇷🇺 Russia, 🇪🇬 Egypt
- **Dynamic Country Chain:** Animated bike chain showing trick counts per country

### Social Features
- **User Authentication:** AWS Cognito integration with email-based login
- **User Profiles:** Track personal stats, submitted tricks, and kudos received
- **Leaderboard:** Top contributors ranked by community engagement
- **Comments System:** Real-time commenting on tricks
- **Top 10 Tricks:** Dynamic ranking based on community kudos

### Technical Features
- **Real-time Updates:** Live trick counts, view tracking, and engagement metrics
- **Responsive Design:** Mobile-first approach with smooth animations
- **Performance Optimized:** Fast loading with efficient data fetching
- **Error Handling:** Robust error handling and graceful degradation

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with SSR/SSG
- **TypeScript** - Type-safe development
- **CSS-in-JS** - Styled JSX for component styling
- **AWS Amplify UI** - Authentication components

### Backend
- **AWS DynamoDB** - NoSQL database for tricks, users, and comments
- **AWS Cognito** - User authentication and management
- **Next.js API Routes** - Serverless API endpoints

### Deployment
- **Vercel** - Frontend hosting with automatic deployments
- **GitHub Actions** - CI/CD pipeline with automated testing
- **AWS** - Backend services and data storage

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- AWS Account with DynamoDB and Cognito access
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

Edit `.env.local` with your AWS credentials:
```env
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
```

4. **Set up AWS infrastructure:**
```bash
# Create DynamoDB tables
node scripts/setup-db.js

# Populate with sample data
node scripts/populate-db.js
node scripts/add-more-data.js
```

5. **Run development server:**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 Database Schema

### TrickShare-Tricks
```javascript
{
  id: string,              // Primary key
  title: string,
  description: string,
  steps: string[],         // Array of step instructions
  country: string,         // Country name
  countryCode: string,     // ISO country code
  difficulty: 'easy' | 'medium' | 'hard',
  tags: string[],          // Searchable tags
  authorName: string,
  authorEmail: string,
  kudos: number,           // Community likes
  views: number,           // View count
  comments: number,        // Comment count
  status: 'approved',      // Moderation status
  createdAt: string        // ISO timestamp
}
```

### TrickShare-Users
```javascript
{
  email: string,           // Primary key
  score: number,           // Total points
  tricksSubmitted: number,
  kudosReceived: number,
  createdAt: string
}
```

### TrickShare-Comments
```javascript
{
  trickId: string,         // Partition key
  id: string,              // Sort key
  text: string,
  authorName: string,
  createdAt: string
}
```

## 🌐 API Endpoints

### Tricks
- `GET /api/tricks` - List all tricks with filtering
- `POST /api/tricks` - Create new trick
- `GET /api/tricks/[id]` - Get specific trick
- `POST /api/tricks/[id]/kudos` - Give kudos to trick
- `POST /api/tricks/[id]/view` - Increment view count
- `GET /api/tricks/top` - Get top 10 tricks by kudos

### Comments
- `GET /api/tricks/[id]/comments` - Get trick comments
- `POST /api/tricks/[id]/comments` - Add comment

### Users
- `GET /api/users/stats` - Get user statistics
- `GET /api/leaderboard` - Get top contributors

## 🎨 Key Components

### CountryChain
Dynamic bike chain animation showing countries with trick counts. Features:
- Circular chain links with country flags
- Real-time trick counts per country
- Smooth animations and hover effects
- Mobile responsive design

### TopTricks
Real-time top 10 tricks based on community engagement:
- Live data from API
- Ranking with crown icons for top 3
- Click-through to full trick details
- Loading states and error handling

### TrickCard
Individual trick display with:
- Country flag and author info
- Difficulty indicators
- Tag system
- Engagement metrics (kudos, views, comments)
- Responsive design

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Quality
- **ESLint** - Code linting with Next.js rules
- **TypeScript** - Type checking
- **Husky** - Pre-commit hooks
- **GitHub Actions** - Automated CI/CD

### Project Structure
```
├── components/          # Reusable React components
├── lib/                # Utility functions and configurations
├── pages/              # Next.js pages and API routes
│   ├── api/           # Backend API endpoints
│   └── trick/         # Dynamic trick pages
├── scripts/           # Database setup and population scripts
├── styles/            # Global CSS styles
└── public/            # Static assets
```

## 🌍 Internationalization

The platform supports content in multiple languages:
- **English** - Primary interface language
- **Turkish** - Çay demleme, mutfak hileleri
- **Japanese** - 生活のコツ、掃除方法
- **French** - Astuces de vie, nettoyage
- **German** - Lebenstipps, Haushaltstricks
- **Spanish** - Trucos de vida, cocina
- **Portuguese** - Dicas de vida, limpeza
- **Hindi** - जीवन की तरकीबें
- **Chinese** - 生活小窍门
- **Arabic** - حيل الحياة
- **Russian** - Лайфхаки

## 📱 Mobile Experience

- Responsive design optimized for mobile devices
- Touch-friendly interface elements
- Optimized country chain for small screens
- Mobile-first CSS approach

## 🔒 Security

- AWS Cognito authentication
- Input validation and sanitization
- CORS protection
- Environment variable protection
- Secure API endpoints

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Community contributors from around the world
- AWS for reliable cloud infrastructure
- Vercel for seamless deployment
- Next.js team for the excellent framework

## 📞 Support

For support, email [support@trickshare.com](mailto:support@trickshare.com) or create an issue on GitHub.

---

**Built with ❤️ by the global community**
