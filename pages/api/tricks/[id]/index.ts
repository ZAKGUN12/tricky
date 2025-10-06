import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const command = new GetCommand({
        TableName: 'TrickShare-Tricks',
        Key: { id: id as string }
      });

      const result = await docClient.send(command);
      
      if (!result.Item) {
        return res.status(404).json({ error: 'Trick not found' });
      }

      // Increment view count
      await docClient.send(new UpdateCommand({
        TableName: 'TrickShare-Tricks',
        Key: { id: id as string },
        UpdateExpression: 'SET #views = #views + :inc',
        ExpressionAttributeNames: { '#views': 'views' },
        ExpressionAttributeValues: { ':inc': 1 }
      }));

      res.status(200).json({ ...result.Item, views: (result.Item.views || 0) + 1 });
      
    } else if (req.method === 'PUT') {
      const updates = req.body;
      const updateExpression = Object.keys(updates).map(key => `#${key} = :${key}`).join(', ');
      const expressionAttributeNames = Object.keys(updates).reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {});
      const expressionAttributeValues = Object.keys(updates).reduce((acc, key) => ({ ...acc, [`:${key}`]: updates[key] }), {});

      await docClient.send(new UpdateCommand({
        TableName: 'TrickShare-Tricks',
        Key: { id: id as string },
        UpdateExpression: `SET ${updateExpression}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
      }));

      res.status(200).json({ success: true });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
