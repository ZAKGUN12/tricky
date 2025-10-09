import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({ error: 'User email required' });
  }

  try {
    const result = await docClient.send(new QueryCommand({
      TableName: 'TrickShare-Kudos',
      KeyConditionExpression: 'userEmail = :email',
      ExpressionAttributeValues: {
        ':email': userEmail as string
      }
    }));

    const kudoedTricks = result.Items?.map(item => item.trickId) || [];
    
    res.status(200).json({ kudoedTricks });
  } catch (error) {
    console.error('Error fetching user kudos:', error);
    res.status(500).json({ error: 'Failed to fetch kudos' });
  }
}
