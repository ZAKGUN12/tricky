export interface Trick {
  id: string;
  title: string;
  description: string;
  steps: string[];
  countryCode: string;
  languageCode: string;
  tags: string[];
  authorId?: string;
  authorName?: string;
  kudos: number;
  views: number;
  favorites: number;
  comments: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeEstimate: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  bio?: string;
  location?: string;
  specialties: string[];
  roles: 'user' | 'mod';
  locale: string;
  points: number;
  badges: string[];
  joinedAt: string;
}

export interface Comment {
  id: string;
  trickId: string;
  authorId?: string;
  authorName?: string;
  text: string;
  kudos: number;
  createdAt: string;
}

export interface UserStats {
  tricksShared: number;
  totalKudos: number;
  kudosGiven: number;
  favoritesCount: number;
  commentsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'contributor' | 'social' | 'explorer' | 'expert';
  requirement: number;
  unlockedAt?: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  authorId: string;
  authorName: string;
  trickIds: string[];
  isPublic: boolean;
  createdAt: string;
}
