import { z } from 'zod';

// XSS protection function
function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Enhanced trick validation schema
export const TrickSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_.,!?()]+$/, 'Title contains invalid characters')
    .transform(sanitizeHtml),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .transform(sanitizeHtml),
  
  steps: z.array(z.string().min(5).max(200).transform(sanitizeHtml))
    .min(1, 'At least one step is required')
    .max(5, 'Maximum 5 steps allowed'),
  
  country: z.string().optional(),
  
  countryCode: z.string()
    .length(2, 'Country code must be 2 characters')
    .regex(/^[A-Z]{2}$/, 'Invalid country code format'),
  
  difficulty: z.enum(['easy', 'medium', 'hard']),
  
  category: z.string().optional(),
  
  tags: z.array(z.string().min(2).max(20).transform(sanitizeHtml))
    .max(5, 'Maximum 5 tags allowed')
    .optional()
    .default([]),
  
  authorName: z.string()
    .min(2, 'Author name must be at least 2 characters')
    .max(50, 'Author name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s\-_.]+$/, 'Author name contains invalid characters')
    .transform(sanitizeHtml),
  
  authorEmail: z.string()
    .email('Invalid email format')
    .max(100, 'Email must be less than 100 characters')
    .toLowerCase()
});

// Validation functions
export function validateTrick(data: any) {
  try {
    return TrickSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }));
      
      const validationError = new Error('Validation failed');
      (validationError as any).name = 'ZodError';
      (validationError as any).errors = formattedErrors;
      throw validationError;
    }
    throw error;
  }
}

// Input sanitization for search queries
export function sanitizeSearchQuery(query: string): string {
  return query
    .replace(/[<>\"']/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .substring(0, 100);
}
