import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const dynamodb = new DynamoDBClient({ region: 'us-east-1' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { trickId, content } = req.body;
    
    const comment = {
      id: { S: Date.now().toString() },
      trickId: { S: trickId },
      content: { S: content },
      timestamp: { S: new Date().toISOString() },
      userId: { S: 'user-123' }, // Get from auth
      userName: { S: 'Anonymous' }
    };

    await dynamodb.send(new PutItemCommand({
      TableName: 'TrickShare-Comments',
      Item: comment
    }));

    // Broadcast to WebSocket clients
    broadcastActivity({
      type: 'comment',
      userName: 'Anonymous',
      trickTitle: 'Some Trick',
      timestamp: new Date().toISOString()
    });

    res.json({ success: true });
  }
}

function broadcastActivity(activity: any) {
  // WebSocket broadcast logic would go here
  console.log('Broadcasting activity:', activity);
}
