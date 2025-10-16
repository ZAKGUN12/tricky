import { z } from 'zod';

const envSchema = z.object({
  AWS_REGION: z.string().min(1),
  NEXT_PUBLIC_AWS_REGION: z.string().min(1),
  NEXT_PUBLIC_COGNITO_DOMAIN: z.string().url(),
  NEXT_PUBLIC_COGNITO_CLIENT_ID: z.string().min(1),
  NEXT_PUBLIC_REDIRECT_URI: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development')
});

export function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Environment validation failed');
  }
}

// Validate on module load
if (typeof window === 'undefined') {
  validateEnv();
}
