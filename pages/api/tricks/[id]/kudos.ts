import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    // Get trick to find author
    const trickResult = await docClient.send(new GetCommand({
      TableName: 'TrickShare-Tricks',
      Key: { id: id as string }
    }));

    if (!trickResult.Item) {
      return res.status(404).json({ error: 'Trick not found' });
    }

    // Update trick kudos
    const result = await docClient.send(new UpdateCommand({
      TableName: 'TrickShare-Tricks',
      Key: { id: id as string },
      UpdateExpression: 'SET kudos = kudos + :inc',
      ExpressionAttributeValues: { ':inc': 1 },
      ReturnValues: 'UPDATED_NEW'
    }));

    // Update author's kudos received if they have an email
    if (trickResult.Item.authorEmail && trickResult.Item.authorEmail !== 'anonymous') {
      try {
        await docClient.send(new UpdateCommand({
          TableName: 'TrickShare-Users',
          Key: { email: trickResult.Item.authorEmail },
          UpdateExpression: 'ADD kudosReceived :inc, score :points',
          ExpressionAttributeValues: { 
            ':inc': 1,
            ':points': 5 // 5 points for receiving kudos
          }
        }));
      } catch (error) {
        console.log('User kudos update failed:', error);
      }
    }

    res.status(200).json({ 
      success: true, 
      kudos: result.Attributes?.kudos || 0 
    });
  } catch (error) {
    console.error('Kudos error:', error);
    res.status(500).json({ error: 'Failed to update kudos' });
  }
}
