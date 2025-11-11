import { NextApiRequest, NextApiResponse } from 'next';
import { ScanCommand, PutCommand, UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { rateLimit } from '../../../lib/rateLimit';
import { validateTrick } from '../../../lib/validation';
import { logger } from '../../../lib/logger';
import { matchesCategory } from '../../../lib/categoryMatcher';
import { countries } from '../../../lib/mockData';
import { docClient, TABLES, handleDynamoError } from '../../../lib/aws-config';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    
    const { statusCode, message } = handleDynamoError(error);
    res.status(statusCode).json({ error: message });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { country, search, difficulty, category, limit = '50' } = req.query;
  
  const sanitizedFilters = {
    country: validateCountryCode(country),
    search: sanitizeSearchTerm(search),
    difficulty: validateDifficulty(difficulty),
    limit: Math.min(parseInt(limit as string) || 50, 100)
  };
  
  try {
    let tricks: any[] = [];

    // Use Query for country-specific requests (assuming GSI exists)
    if (sanitizedFilters.country) {
      const command = new QueryCommand({
        TableName: TABLES.TRICKS,
        IndexName: 'CountryIndex', // Assumes GSI exists
        KeyConditionExpression: 'countryCode = :country',
        ExpressionAttributeValues: {
          ':country': sanitizedFilters.country
        },
        Limit: sanitizedFilters.limit,
        ScanIndexForward: false // Get newest first
      });
      
      const result = await docClient.send(command);
      tricks = result.Items || [];
    } else {
      // Use Scan with pagination for general queries
      const command = new ScanCommand({
        TableName: TABLES.TRICKS,
        FilterExpression: buildFilterExpression(sanitizedFilters),
        ExpressionAttributeValues: buildExpressionValues(sanitizedFilters),
        Limit: sanitizedFilters.limit
      });

      const result = await docClient.send(command);
      tricks = result.Items || [];
    }
    
    // Apply category filtering in memory (more efficient than DynamoDB filter)
    if (category) {
      tricks = tricks.filter(trick => matchesCategory(trick, category as string));
    }
    
    // Sort by engagement score (kudos + views)
    tricks.sort((a, b) => {
      const scoreA = (a.kudos || 0) + (a.views || 0) * 0.1;
      const scoreB = (b.kudos || 0) + (b.views || 0) * 0.1;
      return scoreB - scoreA;
    });
    
    logger.info('Tricks fetched successfully', { 
      count: tricks.length,
      filters: sanitizedFilters 
    });
    
    res.status(200).json(tricks);
  } catch (error) {
    const { statusCode, message } = handleDynamoError(error);
    res.status(statusCode).json({ error: message });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const requestData = { ...req.body };
    if (requestData.country && !requestData.countryCode) {
      const selectedCountry = countries.find(c => c.name === requestData.country);
      requestData.countryCode = selectedCountry?.code || '';
    }
    
    const validatedData = validateTrick(requestData);
    
    const trick = {
      id: uuidv4(), // Use UUID instead of timestamp
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      kudos: 0,
      views: 0,
      comments: 0,
      status: 'approved',
      // Add GSI partition key for efficient querying
      gsi1pk: `COUNTRY#${validatedData.countryCode}`,
      gsi1sk: new Date().toISOString()
    };

    // Use transaction for atomic operations
    const putCommand = new PutCommand({
      TableName: TABLES.TRICKS,
      Item: trick,
      ConditionExpression: 'attribute_not_exists(id)'
    });

    await docClient.send(putCommand);

    // Update user stats separately (non-critical operation)
    if (validatedData.authorEmail && validatedData.authorEmail !== 'anonymous') {
      try {
        await docClient.send(new UpdateCommand({
          TableName: TABLES.USERS,
          Key: { email: validatedData.authorEmail },
          UpdateExpression: 'ADD tricksSubmitted :inc, score :points SET updatedAt = :now',
          ExpressionAttributeValues: {
            ':inc': 1,
            ':points': 10,
            ':now': new Date().toISOString()
          }
        }));
      } catch (userError) {
        logger.warn('User stats update failed', { error: (userError as Error).message });
      }
    }
    
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
    
    const { statusCode, message } = handleDynamoError(error);
    res.status(statusCode).json({ error: message });
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
  if (filters.difficulty) expressions.push('difficulty = :difficulty');
  if (filters.search) expressions.push('(contains(title, :search) OR contains(description, :search))');
  return expressions.length > 0 ? expressions.join(' AND ') : undefined;
}

function buildExpressionValues(filters: any) {
  const values: any = {};
  if (filters.difficulty) values[':difficulty'] = filters.difficulty;
  if (filters.search) values[':search'] = filters.search;
  return Object.keys(values).length > 0 ? values : undefined;
}
