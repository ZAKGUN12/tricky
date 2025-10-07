import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q } = req.query;
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Query parameter required' });
  }

  try {
    const smartSuggestions = await generateSmartSuggestions(q.toLowerCase());
    res.status(200).json(smartSuggestions);
  } catch (error) {
    console.error('Smart suggestions error:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
}

async function generateSmartSuggestions(query: string): Promise<string[]> {
  const suggestions: string[] = [];

  // Intent detection patterns
  const patterns = {
    cooking: ['cook', 'recipe', 'kitchen', 'food', 'meal', 'ingredient'],
    cleaning: ['clean', 'wash', 'stain', 'dirt', 'mess', 'tidy'],
    organization: ['organize', 'storage', 'declutter', 'space', 'room'],
    productivity: ['time', 'work', 'efficient', 'quick', 'fast', 'save'],
    health: ['health', 'exercise', 'sleep', 'stress', 'wellness'],
    money: ['money', 'save', 'budget', 'cheap', 'cost', 'expensive']
  };

  // Detect intent
  let detectedIntent = '';
  for (const [intent, keywords] of Object.entries(patterns)) {
    if (keywords.some(keyword => query.includes(keyword))) {
      detectedIntent = intent;
      break;
    }
  }

  // Generate contextual suggestions
  const contextualSuggestions = {
    cooking: [
      'quick meal prep ideas',
      'kitchen organization hacks',
      'food storage tips',
      'cooking time savers'
    ],
    cleaning: [
      'natural cleaning solutions',
      'stain removal tricks',
      'quick cleaning routines',
      'deep cleaning hacks'
    ],
    organization: [
      'small space storage',
      'decluttering methods',
      'closet organization',
      'desk organization'
    ],
    productivity: [
      'time management tips',
      'morning routines',
      'work from home hacks',
      'focus techniques'
    ],
    health: [
      'healthy habits',
      'exercise at home',
      'stress relief tips',
      'better sleep tricks'
    ],
    money: [
      'money saving hacks',
      'budget meal ideas',
      'DIY alternatives',
      'frugal living tips'
    ]
  };

  // Add intent-based suggestions
  if (detectedIntent && contextualSuggestions[detectedIntent as keyof typeof contextualSuggestions]) {
    suggestions.push(...contextualSuggestions[detectedIntent as keyof typeof contextualSuggestions]);
  }

  // Add query completion suggestions
  const completions = generateQueryCompletions(query);
  suggestions.push(...completions);

  // Add trending suggestions based on query
  const trending = getTrendingSuggestions(query);
  suggestions.push(...trending);

  return Array.from(new Set(suggestions)).slice(0, 4);
}

function generateQueryCompletions(query: string): string[] {
  const completions = [];
  
  if (query.length < 3) return [];

  // Common completion patterns
  const patterns = [
    `${query} tips`,
    `${query} hacks`,
    `${query} tricks`,
    `how to ${query}`,
    `best ${query}`,
    `${query} ideas`
  ];

  return patterns.slice(0, 2);
}

function getTrendingSuggestions(query: string): string[] {
  // Mock trending - in production, use analytics data
  const trending = [
    'winter organization tips',
    'holiday cooking hacks',
    'year-end productivity',
    'seasonal cleaning',
    'budget holiday meals',
    'gift wrapping tricks'
  ];

  return trending
    .filter(trend => 
      trend.toLowerCase().includes(query) || 
      query.split(' ').some(word => trend.toLowerCase().includes(word))
    )
    .slice(0, 2);
}
