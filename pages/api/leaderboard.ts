import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ 
  region: 'eu-west-1' // Use your configured region
});
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Fetching leaderboard from DynamoDB...');
    const result = await docClient.send(new ScanCommand({
      TableName: 'TrickShare-Users'
    }));

    console.log('DynamoDB users response:', { itemCount: result.Items?.length || 0 });
    
    const users = (result.Items || [])
      .sort((a, b) => (b.score || 0) - (a.score || 0)) // Sort by score descending
      .slice(0, 10) // Top 10
      .map((user, index) => ({
        rank: index + 1,
        email: user.email,
        username: user.email.split('@')[0], // Use email prefix as display name
        score: user.score || 0,
        tricksSubmitted: user.tricksSubmitted || 0,
        kudosReceived: user.kudosReceived || 0
      }));

    console.log('Returning leaderboard users:', users.length);
    res.status(200).json(users);
  } catch (error) {
    console.error('Leaderboard error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch leaderboard', details: errorMessage });
  }
}
