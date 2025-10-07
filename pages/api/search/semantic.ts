import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q, limit = 10 } = req.query;
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Query parameter required' });
  }

  try {
    const results = await intelligentSearch(q, parseInt(limit as string));
    res.status(200).json(results);
  } catch (error) {
    console.error('Semantic search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
}

async function intelligentSearch(query: string, limit: number) {
  // Get all tricks
  const command = new ScanCommand({
    TableName: 'TrickShare-Tricks',
    FilterExpression: '#status = :status',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: { ':status': 'approved' }
  });

  const result = await docClient.send(command);
  const tricks = result.Items || [];

  // Enhanced scoring with multiple factors
  const scoredTricks = tricks.map((trick) => {
    const trickText = `${trick.title} ${trick.description} ${trick.tags?.join(' ')}`.toLowerCase();
    const queryLower = query.toLowerCase();
    
    let score = 0;
    
    // Exact phrase match (highest priority)
    if (trickText.includes(queryLower)) {
      score += 100;
    }
    
    // Title match (high priority)
    if (trick.title?.toLowerCase().includes(queryLower)) {
      score += 80;
    }
    
    // Tag match (medium-high priority)
    if (trick.tags?.some((tag: string) => tag.toLowerCase().includes(queryLower))) {
      score += 60;
    }
    
    // Word-level matching
    const queryWords = queryLower.split(' ').filter(word => word.length > 2);
    const trickWords = trickText.split(' ');
    
    queryWords.forEach(queryWord => {
      trickWords.forEach(trickWord => {
        if (trickWord.includes(queryWord)) {
          score += 20;
        }
        // Fuzzy matching for typos
        if (levenshteinDistance(queryWord, trickWord) <= 1 && queryWord.length > 3) {
          score += 10;
        }
      });
    });
    
    // Semantic similarity using keyword relationships
    score += calculateSemanticScore(queryLower, trickText);
    
    // Popularity boost
    score += (trick.kudos || 0) * 0.1;
    score += (trick.views || 0) * 0.01;
    
    // Recency boost (newer tricks get slight boost)
    const createdAt = new Date(trick.createdAt);
    const daysSinceCreated = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreated < 30) {
      score += 5;
    }
    
    return {
      ...trick,
      searchScore: score,
      matchedTerms: findMatchedTerms(queryLower, trickText)
    };
  });

  // Sort by score and return top results
  return scoredTricks
    .filter(trick => trick.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore)
    .slice(0, limit);
}

function calculateSemanticScore(query: string, trickText: string): number {
  let score = 0;
  
  // Semantic keyword groups
  const semanticGroups = {
    cooking: ['cook', 'recipe', 'kitchen', 'food', 'meal', 'ingredient', 'chef', 'bake', 'fry', 'boil'],
    cleaning: ['clean', 'wash', 'stain', 'dirt', 'mess', 'tidy', 'scrub', 'polish', 'sanitize'],
    organization: ['organize', 'storage', 'declutter', 'space', 'room', 'arrange', 'sort', 'tidy'],
    productivity: ['time', 'work', 'efficient', 'quick', 'fast', 'save', 'productive', 'focus'],
    health: ['health', 'exercise', 'sleep', 'stress', 'wellness', 'fitness', 'diet', 'mental'],
    money: ['money', 'save', 'budget', 'cheap', 'cost', 'expensive', 'frugal', 'economical']
  };
  
  // Find semantic matches
  for (const [category, keywords] of Object.entries(semanticGroups)) {
    const queryInCategory = keywords.some(keyword => query.includes(keyword));
    const trickInCategory = keywords.some(keyword => trickText.includes(keyword));
    
    if (queryInCategory && trickInCategory) {
      score += 30;
    }
  }
  
  return score;
}

function findMatchedTerms(query: string, trickText: string): string[] {
  const queryWords = query.split(' ').filter(word => word.length > 2);
  const matched: string[] = [];
  
  queryWords.forEach(word => {
    if (trickText.includes(word)) {
      matched.push(word);
    }
  });
  
  return matched;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}
