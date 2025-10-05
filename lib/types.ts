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
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  roles: 'user' | 'mod';
  locale: string;
}

export interface Comment {
  id: string;
  trickId: string;
  authorId?: string;
  text: string;
  createdAt: string;
}
