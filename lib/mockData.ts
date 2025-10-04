import { Trick } from './types';

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
    kudos: 42,
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
    kudos: 28,
    status: 'approved',
    createdAt: '2024-01-14T15:30:00Z'
  },
  {
    id: '3',
    title: 'American Laundry Stain Removal',
    description: 'Remove tough stains with common household items',
    steps: [
      'Mix baking soda and dish soap into paste',
      'Apply to stain and let sit for 15 minutes',
      'Scrub gently and wash normally'
    ],
    countryCode: 'US',
    languageCode: 'en',
    tags: ['laundry', 'cleaning', 'stains'],
    kudos: 35,
    status: 'approved',
    createdAt: '2024-01-13T09:15:00Z'
  }
];

let tricks = [...mockTricks];

export const getTricks = () => tricks;
export const addTrick = (trick: Omit<Trick, 'id' | 'kudos' | 'status' | 'createdAt'>) => {
  const newTrick: Trick = {
    ...trick,
    id: Date.now().toString(),
    kudos: 0,
    status: 'approved',
    createdAt: new Date().toISOString()
  };
  tricks.unshift(newTrick);
  return newTrick;
};
export const addKudos = (id: string) => {
  const trick = tricks.find(t => t.id === id);
  if (trick) trick.kudos++;
};
