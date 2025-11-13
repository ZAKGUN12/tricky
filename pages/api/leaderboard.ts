import { NextApiRequest, NextApiResponse } from 'next';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
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

    console.log('Calculating leaderboard from tricks data...');
    
    // Get all tricks to calculate user stats
    const tricksResult = await docClient.send(new ScanCommand({
      TableName: TABLES.TRICKS,
      ProjectionExpression: 'authorName, authorEmail, kudos, #status',
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': 'approved'
      }
    }));

    console.log('DynamoDB tricks response:', { itemCount: tricksResult.Items?.length || 0 });
    
    // Calculate user statistics
    const userStats = new Map();
    
    (tricksResult.Items || []).forEach(trick => {
      const email = trick.authorEmail;
      const name = trick.authorName;
      const kudos = trick.kudos || 0;
      
      if (!userStats.has(email)) {
        userStats.set(email, {
          id: email,
          name: name,
          email: email,
          totalKudos: 0,
          totalTricks: 0
        });
      }
      
      const user = userStats.get(email);
      user.totalKudos += kudos;
      user.totalTricks += 1;
    });

    // Convert to array and sort by total score (kudos + tricks * 5)
    const users = Array.from(userStats.values())
      .map(user => ({
        ...user,
        totalScore: user.totalKudos + (user.totalTricks * 5) // Weight tricks more
      }))
      .sort((a, b) => {
        if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
        if (b.totalKudos !== a.totalKudos) return b.totalKudos - a.totalKudos;
        return b.totalTricks - a.totalTricks;
      })
      .slice(0, 10) // Top 10
      .map((user, index) => ({
        ...user,
        rank: index + 1
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
