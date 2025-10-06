import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const command = new QueryCommand({
        TableName: 'TrickShare-Comments',
        KeyConditionExpression: 'trickId = :trickId',
        ExpressionAttributeValues: { ':trickId': id as string },
        ScanIndexForward: false // Latest first
      });

      const result = await docClient.send(command);
      res.status(200).json(result.Items || []);
      
    } else if (req.method === 'POST') {
      const { text, authorName } = req.body;
      
      const comment = {
        id: Date.now().toString(),
        trickId: id as string,
        text,
        authorName,
        kudos: 0,
        createdAt: new Date().toISOString()
      };

      // Add comment
      await docClient.send(new PutCommand({
        TableName: 'TrickShare-Comments',
        Item: comment
      }));

      // Increment comment count on trick
      await docClient.send(new UpdateCommand({
        TableName: 'TrickShare-Tricks',
        Key: { id: id as string },
        UpdateExpression: 'SET comments = comments + :inc',
        ExpressionAttributeValues: { ':inc': 1 }
      }));

      res.status(201).json(comment);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
