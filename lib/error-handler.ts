export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleApiError(error: any) {
  console.error('API Error:', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });
  
  if (error instanceof AppError) {
    return { error: error.message, code: error.code };
  }
  
  // AWS errors
  if (error.name === 'ResourceNotFoundException') {
    return { error: 'Resource not found', code: 'NOT_FOUND' };
  }
  
  if (error.name === 'ValidationException') {
    return { error: 'Invalid data provided', code: 'VALIDATION_ERROR' };
  }

  if (error.name === 'ConditionalCheckFailedException') {
    return { error: 'Resource conflict', code: 'CONFLICT' };
  }

  if (error.name === 'ThrottlingException') {
    return { error: 'Too many requests', code: 'THROTTLED' };
  }
  
  return { error: 'Internal server error', code: 'INTERNAL_ERROR' };
}

export function withErrorHandling(handler: any) {
  return async (req: any, res: any) => {
    try {
      return await handler(req, res);
    } catch (error) {
      const { error: message, code } = handleApiError(error);
      const statusCode = getStatusCode(code);
      
      res.status(statusCode).json({ error: message, code });
    }
  };
}

function getStatusCode(code?: string): number {
  switch (code) {
    case 'NOT_FOUND': return 404;
    case 'VALIDATION_ERROR': return 400;
    case 'CONFLICT': return 409;
    case 'THROTTLED': return 429;
    default: return 500;
  }
}
