import { Trick } from './types';

export const mockTricks: Trick[] = [
  {
    id: '1',
    title: 'Perfect Coffee Every Morning',
    description: 'Never have bitter coffee again with this simple temperature trick',
    steps: [
      'Heat water to exactly 195°F (90°C)',
      'Add coffee grounds in 1:15 ratio',
      'Pour in circular motion for 30 seconds'
    ],
    countryCode: 'IT',
    languageCode: 'en',
    tags: ['coffee', 'morning', 'temperature'],
    authorName: 'Marco Rossi',
    kudos: 1247,
    views: 8934,
    favorites: 456,
    comments: 89,
    difficulty: 'easy',
    timeEstimate: '2 minutes',
    status: 'approved',
    createdAt: '2024-10-01T08:00:00Z'
  },
  {
    id: '2',
    title: 'Instant Wrinkle Remover',
    description: 'Remove wrinkles from clothes without iron using ice cubes. This simple trick works because the ice creates steam in the dryer, which naturally relaxes fabric fibers and smooths out wrinkles. Perfect for travel or when you\'re in a hurry.',
    steps: [],
    countryCode: 'JP',
    languageCode: 'en',
    tags: ['laundry', 'clothes', 'quick-fix'],
    authorName: 'Yuki Tanaka',
    kudos: 892,
    views: 5621,
    favorites: 234,
    comments: 67,
    difficulty: 'easy',
    timeEstimate: '10 minutes',
    status: 'approved',
    createdAt: '2024-09-28T14:30:00Z'
  },
  {
    id: '3',
    title: 'Phone Battery Life Hack',
    description: 'Double your phone battery life with this hidden setting',
    steps: [
      'Go to Settings > Battery',
      'Enable Low Power Mode',
      'Turn off Background App Refresh for unused apps'
    ],
    countryCode: 'US',
    languageCode: 'en',
    tags: ['phone', 'battery', 'technology'],
    authorName: 'Alex Johnson',
    kudos: 2156,
    views: 12847,
    favorites: 789,
    comments: 156,
    difficulty: 'easy',
    timeEstimate: '3 minutes',
    status: 'approved',
    createdAt: '2024-10-02T16:45:00Z'
  },
  {
    id: '4',
    title: 'Speed Reading Technique',
    description: 'Read 3x faster using the pointer method from speed reading experts. Your finger acts as a pacer, forcing your eyes to move faster than your comfortable reading speed. This trains your brain to process information more quickly while maintaining comprehension.',
    steps: [],
    countryCode: 'GB',
    languageCode: 'en',
    tags: ['reading', 'productivity', 'learning'],
    authorName: 'Emma Thompson',
    kudos: 1834,
    views: 9876,
    favorites: 567,
    comments: 123,
    difficulty: 'medium',
    timeEstimate: '5 minutes to learn',
    status: 'approved',
    createdAt: '2024-09-30T11:20:00Z'
  },
  {
    id: '5',
    title: 'Perfect Pasta Water Secret',
    description: 'Italian grandmothers secret for perfect pasta texture',
    steps: [
      'Use 1 liter water per 100g pasta',
      'Add salt when water boils (tastes like sea water)',
      'Save 1 cup pasta water before draining'
    ],
    countryCode: 'IT',
    languageCode: 'en',
    tags: ['cooking', 'pasta', 'italian'],
    authorName: 'Nonna Giuseppe',
    kudos: 3421,
    views: 18765,
    favorites: 1234,
    comments: 287,
    difficulty: 'easy',
    timeEstimate: '1 minute',
    status: 'approved',
    createdAt: '2024-09-25T19:15:00Z'
  },
  {
    id: '6',
    title: 'Memory Palace Technique',
    description: 'Remember anything using ancient Greek memory method. Visualize a familiar place like your home, then mentally place items you want to remember at specific locations along a route. When you need to recall the information, simply walk through your mental palace and collect the items.',
    steps: [],
    countryCode: 'GR',
    languageCode: 'en',
    tags: ['memory', 'learning', 'ancient-technique'],
    authorName: 'Dimitris Kostas',
    kudos: 987,
    views: 6543,
    favorites: 345,
    comments: 78,
    difficulty: 'hard',
    timeEstimate: '15 minutes to learn',
    status: 'approved',
    createdAt: '2024-09-27T13:40:00Z'
  },
  {
    id: '7',
    title: 'Sushi Rice Perfect Texture',
    description: 'Restaurant-quality sushi rice at home every time',
    steps: [
      'Rinse rice until water runs clear',
      'Cook with 1:1.2 rice to water ratio',
      'Mix with rice vinegar while still warm'
    ],
    countryCode: 'JP',
    languageCode: 'en',
    tags: ['sushi', 'rice', 'japanese-cooking'],
    authorName: 'Chef Hiroshi',
    kudos: 2567,
    views: 14321,
    favorites: 891,
    comments: 198,
    difficulty: 'medium',
    timeEstimate: '30 minutes',
    status: 'approved',
    createdAt: '2024-09-29T20:10:00Z'
  },
  {
    id: '8',
    title: 'Croissant Butter Layers',
    description: 'French bakery secret for flaky croissant layers. The key is temperature control - butter and dough must be the same consistency. Too cold and the butter breaks, too warm and it melts into the dough. Professional bakers test this by pressing both with their finger.',
    steps: [],
    countryCode: 'FR',
    languageCode: 'en',
    tags: ['baking', 'croissant', 'french-technique'],
    authorName: 'Pierre Dubois',
    kudos: 1456,
    views: 8234,
    favorites: 456,
    comments: 134,
    difficulty: 'hard',
    timeEstimate: '4 hours',
    status: 'approved',
    createdAt: '2024-09-26T07:30:00Z'
  },
  {
    id: '9',
    title: 'Meditation Focus Trick',
    description: 'Ancient Buddhist technique for instant mental clarity',
    steps: [
      'Sit comfortably with eyes closed',
      'Count breaths from 1 to 10',
      'When mind wanders, gently return to counting'
    ],
    countryCode: 'IN',
    languageCode: 'en',
    tags: ['meditation', 'mindfulness', 'buddhist'],
    authorName: 'Lama Tenzin',
    kudos: 2134,
    views: 11567,
    favorites: 678,
    comments: 145,
    difficulty: 'medium',
    timeEstimate: '10 minutes',
    status: 'approved',
    createdAt: '2024-09-24T06:00:00Z'
  },
  {
    id: '10',
    title: 'Tango Dance Balance',
    description: 'Argentine tango masters secret for perfect balance. Feel the music through your partner\'s embrace, not just your ears. The connection creates a shared axis that makes complex moves effortless. Practice walking together before attempting any fancy steps.',
    steps: [],
    countryCode: 'AR',
    languageCode: 'en',
    tags: ['dance', 'tango', 'balance'],
    authorName: 'Carlos Mendez',
    kudos: 876,
    views: 4321,
    favorites: 234,
    comments: 67,
    difficulty: 'hard',
    timeEstimate: 'Years to master',
    status: 'approved',
    createdAt: '2024-09-23T21:45:00Z'
  },
  {
    id: '11',
    title: 'Origami Paper Crane',
    description: 'Traditional Japanese paper folding for good luck',
    steps: [
      'Start with square paper, fold diagonally both ways',
      'Create preliminary base with valley and mountain folds',
      'Form bird base, then pull wings and head into shape'
    ],
    countryCode: 'JP',
    languageCode: 'en',
    tags: ['origami', 'paper-craft', 'japanese-art'],
    authorName: 'Akiko Sato',
    kudos: 1567,
    views: 7890,
    favorites: 445,
    comments: 89,
    difficulty: 'medium',
    timeEstimate: '15 minutes',
    status: 'approved',
    createdAt: '2024-09-22T15:20:00Z'
  },
  {
    id: '12',
    title: 'Flamenco Guitar Rasgueado',
    description: 'Spanish flamenco strumming technique for passionate rhythm. The secret is in the wrist motion - loose and fluid like painting with your fingers. Each finger strikes the strings in sequence, creating that distinctive rolling sound that makes flamenco so captivating.',
    steps: [],
    countryCode: 'ES',
    languageCode: 'en',
    tags: ['guitar', 'flamenco', 'spanish-music'],
    authorName: 'Paco Rodriguez',
    kudos: 1234,
    views: 6789,
    favorites: 356,
    comments: 78,
    difficulty: 'hard',
    timeEstimate: 'Months to master',
    status: 'approved',
    createdAt: '2024-09-21T18:30:00Z'
  }
];

export const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸', tricks: 1 },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', tricks: 3 },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', tricks: 2 },
  { code: 'FR', name: 'France', flag: '🇫🇷', tricks: 1 },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', tricks: 1 },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', tricks: 1 },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', tricks: 0 },
  { code: 'IN', name: 'India', flag: '🇮🇳', tricks: 1 },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', tricks: 0 },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', tricks: 1 },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', tricks: 0 },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', tricks: 0 },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', tricks: 0 },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', tricks: 0 },
  { code: 'CN', name: 'China', flag: '🇨🇳', tricks: 0 },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', tricks: 0 },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', tricks: 1 },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', tricks: 0 },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', tricks: 0 },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', tricks: 0 },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', tricks: 0 },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', tricks: 0 },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', tricks: 0 },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', tricks: 0 },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', tricks: 0 },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', tricks: 0 },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', tricks: 0 },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', tricks: 0 }
];

// API helper functions
export const getTricks = () => mockTricks;
export const addTrick = (trick: Trick) => { mockTricks.push(trick); return trick; };
export const searchTricks = (query: string) => mockTricks.filter(t => 
  t.title.toLowerCase().includes(query.toLowerCase())
);
export const addKudos = (id: string) => { return { success: true, id }; };
export const toggleFavorite = (id: string) => { return { success: true, id }; };
export const addView = (id: string) => { return { success: true, id }; };
export const getUserFavorites = (userId: string) => mockTricks.filter(t => t.authorId === userId);
export const getUserKudos = (userId: string) => mockTricks.filter(t => t.authorId === userId);
export const getTricksByAuthor = (authorId: string) => mockTricks.filter(t => t.authorId === authorId);
