import { z } from 'zod';

// Trick validation schema
export const TrickSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_.,!?()]+$/, 'Title contains invalid characters'),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  
  steps: z.array(z.string().min(5).max(200))
    .min(1, 'At least one step is required')
    .max(5, 'Maximum 5 steps allowed'),
  
  country: z.string().optional(),
  
  countryCode: z.string()
    .length(2, 'Country code must be 2 characters')
    .regex(/^[A-Z]{2}$/, 'Invalid country code format'),
  
  difficulty: z.enum(['easy', 'medium', 'hard']),
  
  category: z.string().optional(),
  
  tags: z.array(z.string().min(2).max(20))
    .max(5, 'Maximum 5 tags allowed')
    .optional(),
  
  authorName: z.string().optional(),
  
  authorEmail: z.string().email('Invalid email format')
});

// Comment validation schema
export const CommentSchema = z.object({
  text: z.string()
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment must be less than 500 characters')
    .transform(sanitizeInput),
  
  authorName: z.string()
    .min(1, 'Author name is required')
    .max(50, 'Author name must be less than 50 characters')
    .transform(sanitizeInput)
});

// Comprehensive input sanitization to prevent XSS and injection attacks
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>"'&]/g, (match) => {
      const htmlEntities: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return htmlEntities[match];
    })
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/url\s*\(/gi, '')
    .replace(/import\s+/gi, '')
    .replace(/eval\s*\(/gi, '')
    .replace(/[\x00-\x1f\x7f-\x9f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Additional security validation
export function validateSecureInput(input: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /vbscript:/i,
    /expression\s*\(/i,
    /url\s*\(/i,
    /import\s+/i,
    /eval\s*\(/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<link/i,
    /<meta/i
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(input));
}

// Validate and sanitize trick data
export function validateTrick(data: any) {
  // Sanitize string fields
  if (data.title) data.title = sanitizeInput(data.title);
  if (data.description) data.description = sanitizeInput(data.description);
  if (data.steps) {
    data.steps = data.steps.map((step: string) => sanitizeInput(step));
  }
  if (data.tags) {
    data.tags = data.tags.map((tag: string) => sanitizeInput(tag.toLowerCase()));
  }
  
  return TrickSchema.parse(data);
}
