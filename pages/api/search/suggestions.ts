import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q } = req.query;
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Query parameter required' });
  }

  try {
    const suggestions = await getSuggestions(q.toLowerCase());
    res.status(200).json(suggestions);
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
}

async function getSuggestions(query: string) {
  const suggestions: Array<{text: string; type: string; count?: number}> = [];

  // Get trick titles
  const tricksCommand = new ScanCommand({
    TableName: 'TrickShare-Tricks',
    FilterExpression: 'contains(#title, :query) OR contains(#desc, :query)',
    ExpressionAttributeNames: {
      '#title': 'title',
      '#desc': 'description'
    },
    ExpressionAttributeValues: {
      ':query': query
    },
    Limit: 5
  });

  const tricksResult = await docClient.send(tricksCommand);
  tricksResult.Items?.forEach(item => {
    suggestions.push({
      text: item.title,
      type: 'trick',
      count: item.views
    });
  });

  // Get popular tags (mock implementation - you'd store these separately)
  const popularTags = ['cooking', 'cleaning', 'organization', 'productivity', 'health'];
  popularTags
    .filter(tag => tag.includes(query))
    .forEach(tag => {
      suggestions.push({
        text: tag,
        type: 'tag',
        count: Math.floor(Math.random() * 100)
      });
    });

  // Get countries
  const countries = [
    { name: 'Turkey', code: 'TR' },
    { name: 'Japan', code: 'JP' },
    { name: 'Germany', code: 'DE' },
    { name: 'France', code: 'FR' }
  ];
  
  countries
    .filter(country => country.name.toLowerCase().includes(query))
    .forEach(country => {
      suggestions.push({
        text: country.name,
        type: 'country',
        count: Math.floor(Math.random() * 50)
      });
    });

  return suggestions.slice(0, 8);
}
