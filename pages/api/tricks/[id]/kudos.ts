import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand, GetCommand, PutCommand, DeleteCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { userEmail, action } = req.body;

  if (!userEmail) {
    return res.status(400).json({ error: 'User email required' });
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Valid trick ID required' });
  }

  try {
    if (req.method === 'POST') {
      if (action === 'toggle') {
        return await handleToggleKudos(req, res, id, userEmail);
      } else {
        return await handleGiveKudos(req, res, id, userEmail);
      }
    } else if (req.method === 'GET') {
      return await handleGetKudosStatus(req, res, id, userEmail);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Kudos API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleToggleKudos(req: NextApiRequest, res: NextApiResponse, trickId: string, userEmail: string) {
  try {
    // Check if user already gave kudos
    const existingKudo = await docClient.send(new GetCommand({
      TableName: 'TrickShare-Kudos',
      Key: { userEmail, trickId }
    }));

    if (existingKudo.Item) {
      // Remove kudos
      return await handleRemoveKudos(req, res, trickId, userEmail);
    } else {
      // Give kudos
      return await handleGiveKudos(req, res, trickId, userEmail);
    }
  } catch (error) {
    console.error('Toggle kudos error:', error);
    return res.status(500).json({ error: 'Failed to toggle kudos' });
  }
}

async function handleGiveKudos(req: NextApiRequest, res: NextApiResponse, trickId: string, userEmail: string) {
  try {
    // Check if user already gave kudos
    const existingKudo = await docClient.send(new GetCommand({
      TableName: 'TrickShare-Kudos',
      Key: { userEmail, trickId }
    }));

    if (existingKudo.Item) {
      return res.status(409).json({ error: 'Already gave kudos to this trick', hasKudos: true });
    }

    // Get trick to find author and current kudos count
    const trickResult = await docClient.send(new GetCommand({
      TableName: 'TrickShare-Tricks',
      Key: { id: trickId }
    }));

    if (!trickResult.Item) {
      return res.status(404).json({ error: 'Trick not found' });
    }

    const currentKudos = trickResult.Item.kudos || 0;
    const authorEmail = trickResult.Item.authorEmail;

    // Use transaction to ensure consistency
    const transactItems: any[] = [
      {
        Put: {
          TableName: 'TrickShare-Kudos',
          Item: {
            userEmail,
            trickId,
            createdAt: new Date().toISOString()
          },
          ConditionExpression: 'attribute_not_exists(userEmail)'
        }
      },
      {
        Update: {
          TableName: 'TrickShare-Tricks',
          Key: { id: trickId },
          UpdateExpression: 'SET kudos = :newKudos',
          ExpressionAttributeValues: {
            ':newKudos': currentKudos + 1
          }
        }
      }
    ];

    // Update author stats if valid author
    if (authorEmail && authorEmail !== 'anonymous' && authorEmail !== userEmail) {
      transactItems.push({
        Update: {
          TableName: 'TrickShare-Users',
          Key: { email: authorEmail },
          UpdateExpression: 'ADD kudosReceived :inc, score :points',
          ExpressionAttributeValues: {
            ':inc': 1,
            ':points': 5
          }
        }
      });
    }

    await docClient.send(new TransactWriteCommand({
      TransactItems: transactItems
    }));

    res.status(200).json({ 
      success: true, 
      hasKudos: true, 
      newKudosCount: currentKudos + 1 
    });
  } catch (error: any) {
    if (error.name === 'TransactionCanceledException') {
      return res.status(409).json({ error: 'Already gave kudos to this trick', hasKudos: true });
    }
    throw error;
  }
}

async function handleRemoveKudos(req: NextApiRequest, res: NextApiResponse, trickId: string, userEmail: string) {
  try {
    // Check if kudo exists
    const existingKudo = await docClient.send(new GetCommand({
      TableName: 'TrickShare-Kudos',
      Key: { userEmail, trickId }
    }));

    if (!existingKudo.Item) {
      return res.status(404).json({ error: 'Kudo not found', hasKudos: false });
    }

    // Get trick to find author and current kudos count
    const trickResult = await docClient.send(new GetCommand({
      TableName: 'TrickShare-Tricks',
      Key: { id: trickId }
    }));

    if (!trickResult.Item) {
      return res.status(404).json({ error: 'Trick not found' });
    }

    const currentKudos = Math.max(0, (trickResult.Item.kudos || 1) - 1);
    const authorEmail = trickResult.Item.authorEmail;

    // Use transaction to ensure consistency
    const transactItems: any[] = [
      {
        Delete: {
          TableName: 'TrickShare-Kudos',
          Key: { userEmail, trickId }
        }
      },
      {
        Update: {
          TableName: 'TrickShare-Tricks',
          Key: { id: trickId },
          UpdateExpression: 'SET kudos = :newKudos',
          ExpressionAttributeValues: {
            ':newKudos': currentKudos
          }
        }
      }
    ];

    // Update author stats if valid author
    if (authorEmail && authorEmail !== 'anonymous' && authorEmail !== userEmail) {
      transactItems.push({
        Update: {
          TableName: 'TrickShare-Users',
          Key: { email: authorEmail },
          UpdateExpression: 'ADD kudosReceived :dec, score :points',
          ExpressionAttributeValues: {
            ':dec': -1,
            ':points': -5
          }
        }
      });
    }

    await docClient.send(new TransactWriteCommand({
      TransactItems: transactItems
    }));

    res.status(200).json({ 
      success: true, 
      hasKudos: false, 
      newKudosCount: currentKudos 
    });
  } catch (error) {
    console.error('Remove kudos error:', error);
    throw error;
  }
}

async function handleGetKudosStatus(req: NextApiRequest, res: NextApiResponse, trickId: string, userEmail: string) {
  try {
    const existingKudo = await docClient.send(new GetCommand({
      TableName: 'TrickShare-Kudos',
      Key: { userEmail, trickId }
    }));

    res.status(200).json({ 
      hasKudos: !!existingKudo.Item 
    });
  } catch (error) {
    console.error('Get kudos status error:', error);
    return res.status(500).json({ error: 'Failed to get kudos status' });
  }
}
