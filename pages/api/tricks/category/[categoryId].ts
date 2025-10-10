import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'eu-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { categoryId } = req.query;

  try {
    const command = new ScanCommand({
      TableName: 'TrickShare-Tricks',
      FilterExpression: 'category = :category',
      ExpressionAttributeValues: {
        ':category': categoryId,
      },
    });

    const result = await docClient.send(command);
    res.status(200).json({ tricks: result.Items || [] });
  } catch (error) {
    console.error('Error fetching tricks by category:', error);
    res.status(500).json({ error: 'Failed to fetch tricks' });
  }
}
