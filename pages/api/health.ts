import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '../../lib/logger';

interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    memory: 'healthy' | 'unhealthy';
    environment: 'healthy' | 'unhealthy';
  };
  metrics?: {
    memoryUsage: NodeJS.MemoryUsage;
    responseTime: number;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<HealthCheck>) {
  const startTime = Date.now();
  
  try {
    // Memory check
    const memoryUsage = process.memoryUsage();
    const memoryStatus = memoryUsage.heapUsed / memoryUsage.heapTotal < 0.9 ? 'healthy' : 'unhealthy';

    // Environment check
    const envStatus = process.env.AWS_REGION && process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ? 'healthy' : 'unhealthy';

    const responseTime = Date.now() - startTime;
    const overallStatus = memoryStatus === 'healthy' && envStatus === 'healthy' ? 'healthy' : 'unhealthy';

    const healthCheck: HealthCheck = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
      uptime: process.uptime(),
      checks: {
        memory: memoryStatus,
        environment: envStatus,
      },
      metrics: {
        memoryUsage,
        responseTime,
      },
    };

    const statusCode = overallStatus === 'healthy' ? 200 : 503;
    res.status(statusCode).json(healthCheck);

    logger.info('Health check completed', { 
      status: overallStatus, 
      responseTime,
      checks: healthCheck.checks 
    });

  } catch (error) {
    logger.error('Health check failed', error instanceof Error ? error : new Error(String(error)));
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
      uptime: process.uptime(),
      checks: {
        memory: 'unhealthy',
        environment: 'unhealthy',
      },
    });
  }
}
