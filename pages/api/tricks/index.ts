import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { rateLimit } from '../../../lib/rateLimit';
import { validateTrick } from '../../../lib/validation';
import { logger } from '../../../lib/logger';
import { cache } from '../../../lib/cache';
import { matchesCategory } from '../../../lib/categoryMatcher';
import { countries } from '../../../lib/mockData';

const client = new DynamoDBClient({ 
  region: process.env.AWS_REGION || 'eu-west-1'
});
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
    logger.error('API Error in /api/tricks', error instanceof Error ? error : new Error(String(error)), { 
      method: req.method,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    });
    
    res.status(500).json({ 
      error: 'Internal server error'
    });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { country, search, difficulty, category } = req.query;
  
  // Validate and sanitize query parameters
  const sanitizedFilters = {
    country: validateCountryCode(country),
    search: sanitizeSearchTerm(search),
    difficulty: validateDifficulty(difficulty)
  };
  
  try {
    const command = new ScanCommand({
      TableName: 'TrickShare-Tricks',
      FilterExpression: buildFilterExpression(sanitizedFilters),
      ExpressionAttributeValues: buildExpressionValues(sanitizedFilters)
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
    logger.error('DynamoDB error', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({ error: 'Failed to fetch tricks from database' });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Handle country name to countryCode conversion
    const requestData = { ...req.body };
    if (requestData.country && !requestData.countryCode) {
      const selectedCountry = countries.find(c => c.name === requestData.country);
      requestData.countryCode = selectedCountry?.code || '';
    }
    
    // Validate and sanitize input
    const validatedData = validateTrick(requestData);
    
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

function validateCountryCode(country: any): string | undefined {
  if (!country || typeof country !== 'string') return undefined;
  return /^[A-Z]{2}$/.test(country) ? country : undefined;
}

function sanitizeSearchTerm(search: any): string | undefined {
  if (!search || typeof search !== 'string') return undefined;
  return search.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 50) || undefined;
}

function validateDifficulty(difficulty: any): string | undefined {
  if (!difficulty || typeof difficulty !== 'string') return undefined;
  return ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : undefined;
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
