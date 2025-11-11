import { NextApiRequest, NextApiResponse } from 'next';
import { ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLES, handleDynamoError } from '../../lib/aws-config';

// Simple in-memory cache for leaderboard
let leaderboardCache: any = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check cache first
    const now = Date.now();
    if (leaderboardCache && (now - cacheTimestamp) < CACHE_TTL) {
      return res.status(200).json(leaderboardCache);
    }

    console.log('Fetching fresh leaderboard from DynamoDB...');
    
    // Use scan with projection to minimize data transfer
    const result = await docClient.send(new ScanCommand({
      TableName: TABLES.USERS,
      ProjectionExpression: 'email, score, tricksSubmitted, kudosReceived, updatedAt',
      FilterExpression: 'attribute_exists(score) AND score > :minScore',
      ExpressionAttributeValues: {
        ':minScore': 0
      }
    }));

    console.log('DynamoDB users response:', { itemCount: result.Items?.length || 0 });
    
    const users = (result.Items || [])
      .filter(user => user.score > 0) // Only users with activity
      .sort((a, b) => {
        // Sort by score, then by tricks submitted, then by kudos received
        if (b.score !== a.score) return (b.score || 0) - (a.score || 0);
        if (b.tricksSubmitted !== a.tricksSubmitted) return (b.tricksSubmitted || 0) - (a.tricksSubmitted || 0);
        return (b.kudosReceived || 0) - (a.kudosReceived || 0);
      })
      .slice(0, 10) // Top 10
      .map((user, index) => ({
        rank: index + 1,
        email: user.email,
        username: user.email.split('@')[0],
        score: user.score || 0,
        tricksSubmitted: user.tricksSubmitted || 0,
        kudosReceived: user.kudosReceived || 0,
        lastActive: user.updatedAt || user.createdAt
      }));

    // Cache the result
    leaderboardCache = users;
    cacheTimestamp = now;

    console.log('Returning leaderboard users:', users.length);
    
    // Add cache headers
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    res.status(200).json(users);
    
  } catch (error) {
    console.error('Leaderboard error:', error);
    const { statusCode, message } = handleDynamoError(error);
    res.status(statusCode).json({ error: message });
  }
}
