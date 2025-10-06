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
  
  countryCode: z.string()
    .length(2, 'Country code must be 2 characters')
    .regex(/^[A-Z]{2}$/, 'Invalid country code format'),
  
  difficulty: z.enum(['easy', 'medium', 'hard']),
  
  tags: z.array(z.string().min(2).max(20))
    .max(5, 'Maximum 5 tags allowed')
    .optional(),
  
  authorEmail: z.string().email('Invalid email format')
});

// Comment validation schema
export const CommentSchema = z.object({
  text: z.string()
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment must be less than 500 characters'),
  
  authorName: z.string()
    .min(1, 'Author name is required')
    .max(50, 'Author name must be less than 50 characters')
});

// Sanitize HTML content
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
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
