import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand, GetCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { userEmail } = req.body;

  if (!userEmail) {
    return res.status(400).json({ error: 'User email required' });
  }

  try {
    if (req.method === 'POST') {
      return await handleGiveKudos(req, res, id as string, userEmail);
    } else if (req.method === 'DELETE') {
      return await handleRemoveKudos(req, res, id as string, userEmail);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Kudos API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGiveKudos(req: NextApiRequest, res: NextApiResponse, trickId: string, userEmail: string) {
  // Check if user already gave kudos
  const existingKudo = await docClient.send(new GetCommand({
    TableName: 'TrickShare-Kudos',
    Key: { userEmail, trickId }
  }));

  if (existingKudo.Item) {
    return res.status(409).json({ error: 'Already gave kudos to this trick' });
  }

  // Get trick to find author
  const trickResult = await docClient.send(new GetCommand({
    TableName: 'TrickShare-Tricks',
    Key: { id: trickId }
  }));

  if (!trickResult.Item) {
    return res.status(404).json({ error: 'Trick not found' });
  }

  // Record the kudo
  await docClient.send(new PutCommand({
    TableName: 'TrickShare-Kudos',
    Item: {
      userEmail,
      trickId,
      createdAt: new Date().toISOString()
    }
  }));

  // Increment trick kudos count
  await docClient.send(new UpdateCommand({
    TableName: 'TrickShare-Tricks',
    Key: { id: trickId },
    UpdateExpression: 'ADD kudos :inc',
    ExpressionAttributeValues: {
      ':inc': 1
    }
  }));

  // Update user stats
  const authorEmail = trickResult.Item.authorEmail;
  if (authorEmail && authorEmail !== 'anonymous') {
    await docClient.send(new UpdateCommand({
      TableName: 'TrickShare-Users',
      Key: { email: authorEmail },
      UpdateExpression: 'ADD kudosReceived :inc, score :points',
      ExpressionAttributeValues: {
        ':inc': 1,
        ':points': 5
      }
    }));
  }

  res.status(200).json({ success: true });
}

async function handleRemoveKudos(req: NextApiRequest, res: NextApiResponse, trickId: string, userEmail: string) {
  // Check if kudo exists
  const existingKudo = await docClient.send(new GetCommand({
    TableName: 'TrickShare-Kudos',
    Key: { userEmail, trickId }
  }));

  if (!existingKudo.Item) {
    return res.status(404).json({ error: 'Kudo not found' });
  }

  // Get trick to find author
  const trickResult = await docClient.send(new GetCommand({
    TableName: 'TrickShare-Tricks',
    Key: { id: trickId }
  }));

  if (!trickResult.Item) {
    return res.status(404).json({ error: 'Trick not found' });
  }

  // Remove the kudo
  await docClient.send(new DeleteCommand({
    TableName: 'TrickShare-Kudos',
    Key: { userEmail, trickId }
  }));

  // Decrement trick kudos count
  await docClient.send(new UpdateCommand({
    TableName: 'TrickShare-Tricks',
    Key: { id: trickId },
    UpdateExpression: 'ADD kudos :dec',
    ExpressionAttributeValues: {
      ':dec': -1
    }
  }));

  // Update user stats
  const authorEmail = trickResult.Item.authorEmail;
  if (authorEmail && authorEmail !== 'anonymous') {
    await docClient.send(new UpdateCommand({
      TableName: 'TrickShare-Users',
      Key: { email: authorEmail },
      UpdateExpression: 'ADD kudosReceived :dec, score :points',
      ExpressionAttributeValues: {
        ':dec': -1,
        ':points': -5
      }
    }));
  }

  res.status(200).json({ success: true });
}
