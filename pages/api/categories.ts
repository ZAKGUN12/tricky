import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { categorizeAllTricks } from '../../lib/categoryMatcher';
import { fromIni } from '@aws-sdk/credential-providers';

const client = new DynamoDBClient({ 
  region: 'eu-west-1',
  credentials: fromIni({ profile: 'default' })
});
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const command = new ScanCommand({
        TableName: 'TrickShare-Tricks',
        ProjectionExpression: 'category, title, description'
      });

      const result = await docClient.send(command);
      const tricks = result.Items || [];
      
      const categoryCounts = categorizeAllTricks(tricks);

      const categories = [
        { id: 'cooking', name: 'Food & Cooking', icon: '🍳', count: categoryCounts.cooking },
        { id: 'cleaning', name: 'Cleaning', icon: '🧹', count: categoryCounts.cleaning },
        { id: 'technology', name: 'Technology', icon: '📱', count: categoryCounts.technology },
        { id: 'health', name: 'Health', icon: '🍎', count: categoryCounts.health },
        { id: 'travel', name: 'Travel', icon: '✈️', count: categoryCounts.travel },
      ].filter(cat => cat.count > 0);
      
      res.status(200).json(categories);
    } catch (error) {
      console.error('Error in categories API:', error);
      res.status(500).json({ error: 'Failed to fetch categories from database' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
