import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-1' });
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
      
      // Smart category detection with keyword matching
      const categoryCounts = {
        cooking: 0,
        cleaning: 0,
        technology: 0,
        health: 0,
        travel: 0,
        productivity: 0
      };

      tricks.forEach((trick: any) => {
        const category = trick.category?.toLowerCase() || '';
        const title = trick.title?.toLowerCase() || '';
        const description = trick.description?.toLowerCase() || '';
        const content = `${title} ${description}`;

        // Direct category match
        if (categoryCounts.hasOwnProperty(category)) {
          categoryCounts[category as keyof typeof categoryCounts]++;
        }
        // Smart keyword detection for technology
        else if (content.includes('tech') || content.includes('app') || content.includes('phone') || 
                 content.includes('computer') || content.includes('digital') || content.includes('software') ||
                 content.includes('internet') || content.includes('online') || content.includes('productivity')) {
          categoryCounts.technology++;
        }
        // Default to cooking for food-related content
        else if (content.includes('cook') || content.includes('recipe') || content.includes('food') ||
                 content.includes('tea') || content.includes('coffee') || content.includes('pasta') ||
                 content.includes('bread') || content.includes('sauce') || content.includes('spice')) {
          categoryCounts.cooking++;
        }
        // Travel keywords
        else if (content.includes('travel') || content.includes('car') || content.includes('winter') ||
                 content.includes('trip') || content.includes('journey')) {
          categoryCounts.travel++;
        }
        // Cleaning keywords
        else if (content.includes('clean') || content.includes('organize') || content.includes('tidy')) {
          categoryCounts.cleaning++;
        }
        // Health keywords
        else if (content.includes('health') || content.includes('exercise') || content.includes('diet')) {
          categoryCounts.health++;
        }
        // Default fallback
        else {
          categoryCounts.cooking++;
        }
      });

      const categories = [
        { id: 'cooking', name: 'Food & Cooking', icon: '🍳', count: categoryCounts.cooking },
        { id: 'cleaning', name: 'Cleaning', icon: '🧹', count: categoryCounts.cleaning },
        { id: 'technology', name: 'Technology', icon: '📱', count: categoryCounts.technology + categoryCounts.productivity },
        { id: 'health', name: 'Health', icon: '🍎', count: categoryCounts.health },
        { id: 'travel', name: 'Travel', icon: '✈️', count: categoryCounts.travel },
      ].filter(cat => cat.count > 0);
      
      res.status(200).json(categories);
    } catch (error) {
      console.error('Error in categories API:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
