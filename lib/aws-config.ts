import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Singleton pattern for DynamoDB client
let client: DynamoDBClient | null = null;
let documentClient: DynamoDBDocumentClient | null = null;

function createDynamoDBClient() {
  if (!client) {
    client = new DynamoDBClient({
      region: process.env.AWS_REGION || 'eu-west-1',
      maxAttempts: 3,
      retryMode: 'adaptive',
      requestHandler: {
        connectionTimeout: 5000,
        requestTimeout: 10000,
      },
    });
  }
  return client;
}

function createDocumentClient() {
  if (!documentClient) {
    const dynamoClient = createDynamoDBClient();
    documentClient = DynamoDBDocumentClient.from(dynamoClient, {
      marshallOptions: {
        convertEmptyValues: false,
        removeUndefinedValues: true,
        convertClassInstanceToMap: false,
      },
      unmarshallOptions: {
        wrapNumbers: false,
      },
    });
  }
  return documentClient;
}

export { createDynamoDBClient as dynamoClient };
export const docClient = createDocumentClient();

// Table names as constants
export const TABLES = {
  TRICKS: 'TrickShare-Tricks',
  USERS: 'TrickShare-Users', 
  KUDOS: 'TrickShare-Kudos',
  COMMENTS: 'TrickShare-Comments',
} as const;

// Common DynamoDB error handler
export function handleDynamoError(error: any) {
  console.error('DynamoDB Error:', error);
  
  if (error.name === 'ResourceNotFoundException') {
    return { statusCode: 404, message: 'Resource not found' };
  }
  
  if (error.name === 'ConditionalCheckFailedException') {
    return { statusCode: 409, message: 'Resource conflict' };
  }
  
  if (error.name === 'ValidationException') {
    return { statusCode: 400, message: 'Invalid request data' };
  }
  
  if (error.name === 'ProvisionedThroughputExceededException') {
    return { statusCode: 429, message: 'Rate limit exceeded' };
  }
  
  if (error.name === 'ThrottlingException') {
    return { statusCode: 429, message: 'Request throttled' };
  }
  
  return { statusCode: 500, message: 'Database error' };
}
