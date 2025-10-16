import { NextApiRequest, NextApiResponse } from 'next';
import { validateSecureInput } from './validation';

export function securityMiddleware(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  // Check for suspicious patterns in request
  if (req.body && typeof req.body === 'object') {
    const hasUnsafeContent = checkObjectForUnsafeContent(req.body);
    if (hasUnsafeContent) {
      res.status(400).json({ error: 'Invalid request content' });
      return;
    }
  }
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Log suspicious requests
  if (isSuspiciousRequest(req)) {
    console.warn('Suspicious request detected:', {
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      url: req.url,
      method: req.method
    });
  }
  
  next();
}

function checkObjectForUnsafeContent(obj: any): boolean {
  if (typeof obj === 'string') {
    return !validateSecureInput(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.some(item => checkObjectForUnsafeContent(item));
  }
  
  if (typeof obj === 'object' && obj !== null) {
    return Object.values(obj).some(value => checkObjectForUnsafeContent(value));
  }
  
  return false;
}

function isSuspiciousRequest(req: NextApiRequest): boolean {
  const suspiciousPatterns = [
    /\.\./,  // Path traversal
    /union.*select/i,  // SQL injection
    /script.*alert/i,  // XSS attempts
    /eval\s*\(/i,  // Code injection
    /base64/i,  // Encoded payloads
  ];
  
  const url = req.url || '';
  const userAgent = req.headers['user-agent'] || '';
  
  return suspiciousPatterns.some(pattern => 
    pattern.test(url) || pattern.test(userAgent)
  );
}

export function validateOrigin(req: NextApiRequest): boolean {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000',
    'https://tricky-peach.vercel.app',
    process.env.NEXT_PUBLIC_SITE_URL
  ].filter(Boolean);
  
  return !origin || allowedOrigins.includes(origin);
}
