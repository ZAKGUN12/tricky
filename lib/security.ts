import { z } from 'zod';

// XSS Protection
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 1000); // Limit length
}

export function sanitizeHtml(html: string): string {
  if (typeof html !== 'string') return '';
  
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}

// CSRF Protection
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken && token.length > 10;
}

// Rate limiting helper
export function createRateLimiter(windowMs: number, maxRequests: number) {
  const requests = new Map();
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!requests.has(identifier)) {
      requests.set(identifier, [now]);
      return true;
    }
    
    const userRequests = requests.get(identifier).filter((time: number) => time > windowStart);
    
    if (userRequests.length >= maxRequests) {
      return false;
    }
    
    userRequests.push(now);
    requests.set(identifier, userRequests);
    return true;
  };
}

// Input validation schemas
export const trickSchema = z.object({
  title: z.string().min(5).max(100).transform(sanitizeInput),
  description: z.string().min(10).max(500).transform(sanitizeInput),
  steps: z.array(z.string().min(1).max(200).transform(sanitizeInput)).min(1).max(5),
  country: z.string().min(2).max(50).transform(sanitizeInput),
  countryCode: z.string().length(2),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string().min(1).max(20).transform(sanitizeInput)).max(5),
  category: z.string().min(1).max(50).transform(sanitizeInput),
});

export const commentSchema = z.object({
  text: z.string().min(1).max(500).transform(sanitizeInput),
  authorName: z.string().min(1).max(50).transform(sanitizeInput),
  authorEmail: z.string().email(),
});

export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(50).transform(sanitizeInput),
  username: z.string().min(3).max(30).transform(sanitizeInput),
});
