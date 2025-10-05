import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

const dynamodb = new DynamoDBClient({ region: 'eu-west-1' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await dynamodb.send(new ScanCommand({
      TableName: 'TrickShare-Activities',
      Limit: 20,
      ScanIndexForward: false
    }));

    const activities = result.Items?.map(item => ({
      id: item.id.S,
      type: item.type?.S || 'activity',
      userName: item.userName?.S || 'Anonymous',
      trickTitle: item.trickTitle?.S || 'Unknown Trick',
      timestamp: item.timestamp?.S || new Date().toISOString()
    })) || [];

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
}
