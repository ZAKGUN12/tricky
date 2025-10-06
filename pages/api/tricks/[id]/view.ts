import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    await docClient.send(new UpdateCommand({
      TableName: 'TrickShare-Tricks',
      Key: { id: id as string },
      UpdateExpression: 'ADD views :inc',
      ExpressionAttributeValues: { ':inc': 1 }
    }));

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('View increment error:', error);
    res.status(500).json({ error: 'Failed to increment views' });
  }
}
