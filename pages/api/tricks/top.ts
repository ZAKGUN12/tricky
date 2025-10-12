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
    console.log('Fetching top tricks from DynamoDB...');
    const command = new ScanCommand({
      TableName: 'TrickShare-Tricks'
    });

    const result = await docClient.send(command);
    console.log('DynamoDB response:', { itemCount: result.Items?.length || 0 });
    
    const tricks = result.Items || [];
    console.log('Raw tricks data:', tricks.slice(0, 2)); // Log first 2 items

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

    console.log('Returning top tricks:', topTricks.length);
    res.status(200).json(topTricks);
  } catch (error) {
    console.error('Error fetching top tricks:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch top tricks', details: errorMessage });
  }
}
