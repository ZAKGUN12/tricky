import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { rateLimit } from '../../../lib/rateLimit';
import { validateTrick } from '../../../lib/validation';
import { logger } from '../../../lib/logger';
import { cache } from '../../../lib/cache';
import { matchesCategory } from '../../../lib/categoryMatcher';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100 // limit each IP to 100 requests per windowMs
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply rate limiting
  await new Promise<void>((resolve) => {
    limiter(req, res, resolve);
  });

  try {
    if (req.method === 'GET') {
      return await handleGet(req, res);
    } else if (req.method === 'POST') {
      return await handlePost(req, res);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    logger.error('API Error in /api/tricks', { 
      error: (error as Error).message, 
      method: req.method,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    });
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { country, search, difficulty, category } = req.query;
  
  try {
    const command = new ScanCommand({
      TableName: 'TrickShare-Tricks',
      FilterExpression: buildFilterExpression({ country, search, difficulty }),
      ExpressionAttributeValues: buildExpressionValues({ country, search, difficulty })
    });

    const result = await docClient.send(command);
    let tricks = result.Items || [];
    
    // Apply smart category filtering in memory
    if (category) {
      tricks = tricks.filter(trick => matchesCategory(trick, category as string));
    }
    
    logger.info('Tricks fetched successfully', { count: tricks.length });
    res.status(200).json(tricks);
  } catch (error) {
    logger.error('DynamoDB error, using fallback data', { error: (error as Error).message });
    
    // Fallback data when DynamoDB is not accessible
    const fallbackTricks = [
      {
        id: 'fallback-1',
        title: 'Perfect Turkish Tea',
        description: 'How to brew the perfect Turkish tea using traditional methods',
        country: 'Turkey',
        countryCode: 'TR',
        authorName: 'Ahmet',
        kudos: 25,
        views: 150,
        comments: 5,
        difficulty: 'easy',
        category: 'cooking',
        status: 'approved',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'fallback-2',
        title: 'Japanese Cleaning Method',
        description: 'Efficient cleaning techniques from Japan',
        country: 'Japan',
        countryCode: 'JP',
        authorName: 'Yuki',
        kudos: 18,
        views: 120,
        comments: 3,
        difficulty: 'medium',
        category: 'cleaning',
        status: 'approved',
        createdAt: '2024-01-02T00:00:00Z'
      },
      {
        id: 'fallback-3',
        title: 'French Cooking Tips',
        description: 'Essential French cooking techniques',
        country: 'France',
        countryCode: 'FR',
        authorName: 'Marie',
        kudos: 32,
        views: 200,
        comments: 8,
        difficulty: 'hard',
        category: 'cooking',
        status: 'approved',
        createdAt: '2024-01-03T00:00:00Z'
      }
    ];
    
    res.status(200).json(fallbackTricks);
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Validate and sanitize input
    const validatedData = validateTrick(req.body);
    
    const trick = {
      id: Date.now().toString(),
      ...validatedData,
      createdAt: new Date().toISOString(),
      kudos: 0,
      views: 0,
      comments: 0,
      status: 'approved'
    };

    // Save trick
    await docClient.send(new PutCommand({
      TableName: 'TrickShare-Tricks',
      Item: trick
    }));

    // Update user stats if authorEmail provided
    if (validatedData.authorEmail && validatedData.authorEmail !== 'anonymous') {
      try {
        await docClient.send(new UpdateCommand({
          TableName: 'TrickShare-Users',
          Key: { email: validatedData.authorEmail },
          UpdateExpression: 'ADD tricksSubmitted :inc SET score = if_not_exists(score, :zero) + :points',
          ExpressionAttributeValues: {
            ':inc': 1,
            ':zero': 0,
            ':points': 10
          }
        }));
      } catch (error) {
        logger.warn('User stats update failed', { error: (error as Error).message });
      }
    }

    // Clear relevant caches
    cache.clear(); // Simple approach - clear all caches when new data is added
    
    logger.info('Trick created successfully', { 
      id: trick.id, 
      author: validatedData.authorEmail,
      country: validatedData.countryCode
    });
    
    res.status(201).json(trick);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      logger.warn('Validation error', { errors: error.errors });
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    throw error;
  }
}

function buildFilterExpression(filters: any) {
  const expressions = [];
  if (filters.country) expressions.push('countryCode = :country');
  if (filters.difficulty) expressions.push('difficulty = :difficulty');
  if (filters.search) expressions.push('contains(title, :search) OR contains(description, :search)');
  return expressions.length > 0 ? expressions.join(' AND ') : undefined;
}

function buildExpressionValues(filters: any) {
  const values: any = {};
  if (filters.country) values[':country'] = filters.country;
  if (filters.difficulty) values[':difficulty'] = filters.difficulty;
  if (filters.search) values[':search'] = filters.search;
  return Object.keys(values).length > 0 ? values : undefined;
}
