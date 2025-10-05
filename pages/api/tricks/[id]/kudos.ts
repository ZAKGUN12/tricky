import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    const result = await docClient.send(new UpdateCommand({
      TableName: 'TrickShare-Tricks',
      Key: { id: id as string },
      UpdateExpression: 'SET kudos = kudos + :inc',
      ExpressionAttributeValues: { ':inc': 1 },
      ReturnValues: 'UPDATED_NEW'
    }));

    res.status(200).json({ 
      success: true, 
      kudos: result.Attributes?.kudos || 0 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update kudos' });
  }
}
