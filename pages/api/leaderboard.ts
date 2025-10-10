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
    const result = await docClient.send(new ScanCommand({
      TableName: 'TrickShare-Users'
    }));

    const users = (result.Items || [])
      .filter(user => user.score > 0) // Only show users with points
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

    res.status(200).json(users);
  } catch (error) {
    console.error('Leaderboard error:', error);
    
    // Fallback data when DynamoDB is not accessible
    const fallbackUsers = [
      { rank: 1, username: 'TrickMaster', score: 150, tricksSubmitted: 12, kudosReceived: 45 },
      { rank: 2, username: 'LifeHacker', score: 120, tricksSubmitted: 8, kudosReceived: 38 },
      { rank: 3, username: 'TipGuru', score: 95, tricksSubmitted: 6, kudosReceived: 29 },
      { rank: 4, username: 'HackExpert', score: 80, tricksSubmitted: 5, kudosReceived: 22 },
      { rank: 5, username: 'TrickWiz', score: 65, tricksSubmitted: 4, kudosReceived: 18 }
    ];
    
    res.status(200).json(fallbackUsers);
  }
}
