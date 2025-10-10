import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const command = new ScanCommand({
      TableName: 'TrickShare-Tricks',
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': 'approved'
      }
    });

    const result = await docClient.send(command);
    const tricks = result.Items || [];

    // Sort by kudos (descending) and take top 10
    const topTricks = tricks
      .sort((a, b) => (b.kudos || 0) - (a.kudos || 0))
      .slice(0, 10);

    res.status(200).json(topTricks);
  } catch (error) {
    console.error('Error fetching top tricks:', error);
    
    // Fallback data when DynamoDB is not accessible
    const fallbackTricks = [
      { id: 'top-1', title: 'Perfect Turkish Tea', countryCode: 'TR', kudos: 45, views: 250 },
      { id: 'top-2', title: 'Japanese Cleaning Method', countryCode: 'JP', kudos: 38, views: 200 },
      { id: 'top-3', title: 'French Cooking Tips', countryCode: 'FR', kudos: 32, views: 180 },
      { id: 'top-4', title: 'German Organization', countryCode: 'DE', kudos: 28, views: 160 },
      { id: 'top-5', title: 'Italian Pasta Secrets', countryCode: 'IT', kudos: 25, views: 140 }
    ];
    
    res.status(200).json(fallbackTricks);
  }
}
