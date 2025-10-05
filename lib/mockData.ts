import { Trick, Comment, Achievement } from './types';

export const mockTricks: Trick[] = [
  {
    id: '1',
    title: 'Japanese Rice Washing Technique',
    description: 'Perfect rice every time using traditional Japanese method',
    steps: [
      'Rinse rice until water runs clear (5-7 times)',
      'Let rice rest in water for 30 minutes before cooking',
      'Use 1:1.2 rice to water ratio'
    ],
    countryCode: 'JP',
    languageCode: 'en',
    tags: ['cooking', 'rice', 'japanese'],
    authorId: 'user1',
    authorName: 'Hiroshi',
    kudos: 142,
    views: 856,
    favorites: 73,
    comments: 12,
    difficulty: 'easy',
    timeEstimate: '5 min',
    status: 'approved',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'German Window Cleaning Hack',
    description: 'Streak-free windows using newspaper and vinegar',
    steps: [
      'Mix 1 part white vinegar with 3 parts water',
      'Clean with microfiber cloth first',
      'Polish with crumpled newspaper for streak-free finish'
    ],
    countryCode: 'DE',
    languageCode: 'en',
    tags: ['cleaning', 'windows', 'household'],
    authorId: 'user2',
    authorName: 'Klaus',
    kudos: 98,
    views: 489,
    favorites: 42,
    comments: 8,
    difficulty: 'easy',
    timeEstimate: '10 min',
    status: 'approved',
    createdAt: '2024-01-14T15:30:00Z'
  },
  {
    id: '3',
    title: 'Advanced Sourdough Starter',
    description: 'Create and maintain a perfect sourdough starter',
    steps: [
      'Mix equal parts flour and water daily for 7 days',
      'Discard half before each feeding',
      'Maintain at room temperature, feed twice daily when active'
    ],
    countryCode: 'US',
    languageCode: 'en',
    tags: ['baking', 'sourdough', 'fermentation'],
    authorId: 'user3',
    authorName: 'Sarah',
    kudos: 267,
    views: 1234,
    favorites: 156,
    comments: 34,
    difficulty: 'hard',
    timeEstimate: '7 days',
    status: 'approved',
    createdAt: '2024-01-13T09:15:00Z'
  }
];

export const mockComments: Comment[] = [
  {
    id: 'c1',
    trickId: '1',
    authorId: 'user4',
    authorName: 'Emma',
    text: 'This really works! My rice is perfect every time now.',
    kudos: 5,
    createdAt: '2024-01-16T14:30:00Z'
  },
  {
    id: 'c2',
    trickId: '1',
    authorId: 'user5',
    authorName: 'Chen',
    text: 'My grandmother taught me this same technique in Beijing!',
    kudos: 8,
    createdAt: '2024-01-17T09:15:00Z'
  }
];

export const achievements: Achievement[] = [
  {
    id: 'first_trick',
    name: 'First Share',
    description: 'Share your first trick',
    icon: '🌟',
    category: 'contributor',
    requirement: 1
  },
  {
    id: 'popular_creator',
    name: 'Popular Creator',
    description: 'Get 100 kudos on a single trick',
    icon: '🔥',
    category: 'contributor',
    requirement: 100
  },
  {
    id: 'helpful_commenter',
    name: 'Helpful Commenter',
    description: 'Leave 10 helpful comments',
    icon: '💬',
    category: 'social',
    requirement: 10
  },
  {
    id: 'world_explorer',
    name: 'World Explorer',
    description: 'Try tricks from 10 different countries',
    icon: '🌍',
    category: 'explorer',
    requirement: 10
  },
  {
    id: 'cooking_master',
    name: 'Cooking Master',
    description: 'Share 5 cooking tricks',
    icon: '👨‍🍳',
    category: 'expert',
    requirement: 5
  }
];

let tricks = [...mockTricks];
let comments = [...mockComments];
let userFavorites: {[userId: string]: string[]} = {};
let userKudos: {[userId: string]: string[]} = {};
let userAchievements: {[userId: string]: string[]} = {};

export const getTricks = () => tricks;
export const getComments = (trickId: string) => comments.filter(c => c.trickId === trickId);
export const getAllComments = () => comments;

export const addTrick = (trick: Omit<Trick, 'id' | 'kudos' | 'status' | 'createdAt' | 'views' | 'favorites' | 'comments'>) => {
  const newTrick: Trick = {
    ...trick,
    id: Date.now().toString(),
    kudos: 0,
    views: 0,
    favorites: 0,
    comments: 0,
    status: 'approved',
    createdAt: new Date().toISOString()
  };
  tricks.unshift(newTrick);
  return newTrick;
};

export const addComment = (comment: Omit<Comment, 'id' | 'kudos' | 'createdAt'>) => {
  const newComment: Comment = {
    ...comment,
    id: Date.now().toString(),
    kudos: 0,
    createdAt: new Date().toISOString()
  };
  comments.push(newComment);
  
  // Update trick comment count
  const trick = tricks.find(t => t.id === comment.trickId);
  if (trick) trick.comments++;
  
  return newComment;
};

export const addKudos = (id: string, userId?: string) => {
  const trick = tricks.find(t => t.id === id);
  if (trick && userId) {
    if (!userKudos[userId]) userKudos[userId] = [];
    if (!userKudos[userId].includes(id)) {
      trick.kudos++;
      userKudos[userId].push(id);
      return true;
    }
  }
  return false;
};

export const addCommentKudos = (commentId: string, userId: string) => {
  const comment = comments.find(c => c.id === commentId);
  if (comment) {
    comment.kudos++;
    return true;
  }
  return false;
};

export const toggleFavorite = (id: string, userId: string) => {
  const trick = tricks.find(t => t.id === id);
  if (trick) {
    if (!userFavorites[userId]) userFavorites[userId] = [];
    const index = userFavorites[userId].indexOf(id);
    if (index > -1) {
      userFavorites[userId].splice(index, 1);
      trick.favorites--;
      return false;
    } else {
      userFavorites[userId].push(id);
      trick.favorites++;
      return true;
    }
  }
  return false;
};

export const addView = (id: string) => {
  const trick = tricks.find(t => t.id === id);
  if (trick) trick.views++;
};

export const getUserFavorites = (userId: string) => userFavorites[userId] || [];
export const getUserKudos = (userId: string) => userKudos[userId] || [];
export const getUserAchievements = (userId: string) => userAchievements[userId] || [];

export const checkAchievements = (userId: string) => {
  const userTricks = getTricksByAuthor(userId);
  const userComments = comments.filter(c => c.authorId === userId);
  const newAchievements: string[] = [];

  // Check each achievement
  achievements.forEach(achievement => {
    if (userAchievements[userId]?.includes(achievement.id)) return;

    let earned = false;
    switch (achievement.id) {
      case 'first_trick':
        earned = userTricks.length >= 1;
        break;
      case 'popular_creator':
        earned = userTricks.some(t => t.kudos >= 100);
        break;
      case 'helpful_commenter':
        earned = userComments.length >= 10;
        break;
      case 'cooking_master':
        earned = userTricks.filter(t => t.tags.includes('cooking')).length >= 5;
        break;
    }

    if (earned) {
      if (!userAchievements[userId]) userAchievements[userId] = [];
      userAchievements[userId].push(achievement.id);
      newAchievements.push(achievement.id);
    }
  });

  return newAchievements;
};

export const searchTricks = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return tricks.filter(trick => 
    trick.title.toLowerCase().includes(lowercaseQuery) ||
    trick.description.toLowerCase().includes(lowercaseQuery) ||
    trick.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    trick.steps.some(step => step.toLowerCase().includes(lowercaseQuery)) ||
    trick.authorName?.toLowerCase().includes(lowercaseQuery)
  );
};

export const getTricksByAuthor = (authorId: string) => {
  return tricks.filter(trick => trick.authorId === authorId);
};

export const getPopularTags = () => {
  const tagCounts: {[tag: string]: number} = {};
  tricks.forEach(trick => {
    trick.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  return Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));
};
