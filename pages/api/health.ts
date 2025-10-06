import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { logger } from '../../lib/logger';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-1' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: 'unknown',
      memory: process.memoryUsage(),
      uptime: process.uptime()
    }
  };

  try {
    // Test DynamoDB connection
    await client.send({
      name: 'ListTablesCommand',
      input: { Limit: 1 }
    } as any);
    
    health.services.database = 'healthy';
    logger.info('Health check passed');
    
    res.status(200).json(health);
  } catch (error) {
    health.status = 'unhealthy';
    health.services.database = 'unhealthy';
    
    logger.error('Health check failed', { error: (error as Error).message });
    res.status(503).json(health);
  }
}
