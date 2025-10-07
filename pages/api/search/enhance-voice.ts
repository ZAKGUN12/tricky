import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { transcript } = req.body;
  if (!transcript || typeof transcript !== 'string') {
    return res.status(400).json({ error: 'Transcript required' });
  }

  try {
    const enhancedQuery = await enhanceVoiceQuery(transcript);
    res.status(200).json({ 
      originalTranscript: transcript,
      enhancedQuery,
      confidence: 0.9
    });
  } catch (error) {
    console.error('Voice enhancement error:', error);
    res.status(500).json({ error: 'Failed to enhance query' });
  }
}

async function enhanceVoiceQuery(transcript: string): Promise<string> {
  const cleaned = transcript.toLowerCase().trim();
  
  // Convert conversational speech to search terms
  const conversationalPatterns = [
    {
      pattern: /how do i (.*)/,
      replacement: '$1 tutorial'
    },
    {
      pattern: /what's the best way to (.*)/,
      replacement: 'best $1 method'
    },
    {
      pattern: /i need help with (.*)/,
      replacement: '$1 tips'
    },
    {
      pattern: /show me (.*)/,
      replacement: '$1'
    },
    {
      pattern: /find (.*) tricks/,
      replacement: '$1 tricks'
    },
    {
      pattern: /looking for (.*)/,
      replacement: '$1'
    }
  ];

  let enhanced = cleaned;
  
  // Apply conversational patterns
  for (const { pattern, replacement } of conversationalPatterns) {
    if (pattern.test(enhanced)) {
      enhanced = enhanced.replace(pattern, replacement);
      break;
    }
  }

  // Expand common abbreviations and slang
  const expansions = {
    'fridge': 'refrigerator',
    'veggies': 'vegetables',
    'workout': 'exercise',
    'declutter': 'organize',
    'hack': 'trick',
    'diy': 'do it yourself',
    'asap': 'quick',
    'cheap': 'budget'
  };

  for (const [abbrev, full] of Object.entries(expansions)) {
    enhanced = enhanced.replace(new RegExp(`\\b${abbrev}\\b`, 'g'), full);
  }

  // Add context keywords based on detected topics
  const contextKeywords = {
    kitchen: ['cooking', 'food', 'meal'],
    bathroom: ['cleaning', 'hygiene'],
    bedroom: ['sleep', 'organization'],
    office: ['productivity', 'work'],
    garden: ['plants', 'outdoor'],
    car: ['automotive', 'maintenance']
  };

  for (const [location, keywords] of Object.entries(contextKeywords)) {
    if (enhanced.includes(location)) {
      // Don't add if already present
      const missingKeywords = keywords.filter(keyword => !enhanced.includes(keyword));
      if (missingKeywords.length > 0) {
        enhanced += ` ${missingKeywords[0]}`;
      }
    }
  }

  return enhanced.trim();
}
