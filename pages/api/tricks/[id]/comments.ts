import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      return await handleGet(req, res, id as string);
    } else if (req.method === 'POST') {
      return await handlePost(req, res, id as string);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Comments API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse, trickId: string) {
  const command = new QueryCommand({
    TableName: 'TrickShare-Comments',
    KeyConditionExpression: 'trickId = :trickId',
    ExpressionAttributeValues: {
      ':trickId': trickId
    },
    ScanIndexForward: false // Sort by newest first
  });

  const result = await docClient.send(command);
  const comments = result.Items || [];

  res.status(200).json(comments);
}

async function handlePost(req: NextApiRequest, res: NextApiResponse, trickId: string) {
  const { text, authorName, authorEmail } = req.body;

  // Validation
  if (!text || !authorName || !authorEmail) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (text.length > 500) {
    return res.status(400).json({ error: 'Comment too long' });
  }

  const comment = {
    trickId,
    id: uuidv4(),
    text: text.trim(),
    authorName,
    authorEmail,
    createdAt: new Date().toISOString()
  };

  // Save comment
  await docClient.send(new PutCommand({
    TableName: 'TrickShare-Comments',
    Item: comment
  }));

  // Update trick comment count
  await docClient.send(new UpdateCommand({
    TableName: 'TrickShare-Tricks',
    Key: { id: trickId },
    UpdateExpression: 'ADD comments :inc',
    ExpressionAttributeValues: {
      ':inc': 1
    }
  }));

  res.status(201).json(comment);
}
