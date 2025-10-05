import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const command = new ScanCommand({
      TableName: 'TrickShare-Tricks',
      ProjectionExpression: 'authorName, countryCode, kudos, #views',
      ExpressionAttributeNames: { '#views': 'views' }
    });

    const result = await docClient.send(command);
    const tricks = result.Items || [];

    // Calculate user stats
    const userStats = new Map();
    
    tricks.forEach(trick => {
      const author = trick.authorName || 'Anonymous';
      if (!userStats.has(author)) {
        userStats.set(author, {
          name: author,
          countryCode: trick.countryCode,
          tricksCount: 0,
          totalKudos: 0,
          totalViews: 0,
          score: 0
        });
      }
      
      const stats = userStats.get(author);
      stats.tricksCount += 1;
      stats.totalKudos += trick.kudos || 0;
      stats.totalViews += trick.views || 0;
      stats.score = stats.tricksCount * 100 + stats.totalKudos + Math.floor(stats.totalViews / 10);
    });

    // Convert to array and sort by score
    const topUsers = Array.from(userStats.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    res.status(200).json(topUsers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
}
