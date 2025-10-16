import { NextApiRequest, NextApiResponse } from 'next';

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
}

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(options: RateLimitOptions) {
  return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const ip = getClientIP(req);
    const now = Date.now();
    
    // Clean old entries
    const keysToDelete: string[] = [];
    requestCounts.forEach((value, key) => {
      if (value.resetTime < now) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => requestCounts.delete(key));
    
    const current = requestCounts.get(ip) || { count: 0, resetTime: now + options.windowMs };
    
    if (current.resetTime < now) {
      current.count = 0;
      current.resetTime = now + options.windowMs;
    }
    
    current.count++;
    requestCounts.set(ip, current);
    
    if (current.count > options.maxRequests) {
      res.status(429).json({ 
        error: 'Too many requests',
        retryAfter: Math.ceil((current.resetTime - now) / 1000)
      });
      return;
    }
    
    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', options.maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, options.maxRequests - current.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(current.resetTime / 1000));
    
    next();
  };
}

function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded 
    ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0])
    : req.socket.remoteAddress || 'unknown';
  
  return ip.trim();
}
