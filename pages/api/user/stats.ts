import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Get user stats
    const result = await docClient.send(new GetCommand({
      TableName: 'TrickShare-Users',
      Key: { userId: userId as string }
    }));

    if (!result.Item) {
      // Create initial user stats
      const initialStats = {
        userId: userId as string,
        score: 0,
        tricksSubmitted: 0,
        kudosReceived: 0,
        createdAt: new Date().toISOString()
      };

      await docClient.send(new PutCommand({
        TableName: 'TrickShare-Users',
        Item: initialStats
      }));

      return res.status(200).json(initialStats);
    }

    res.status(200).json(result.Item);
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
