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
      .slice(0, 10)
      .map(trick => ({
        id: trick.id,
        title: trick.title,
        countryCode: trick.countryCode,
        kudos: trick.kudos || 0,
        views: trick.views || 0,
        authorName: trick.authorName || 'Anonymous'
      }));

    res.status(200).json(topTricks);
  } catch (error) {
    console.error('Error fetching top tricks:', error);
    res.status(500).json({ error: 'Failed to fetch top tricks' });
  }
}
