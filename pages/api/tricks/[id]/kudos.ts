import { NextApiRequest, NextApiResponse } from 'next';
import { UpdateCommand, GetCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLES, handleDynamoError } from '../../../../lib/aws-config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { userEmail } = req.body;

  if (!userEmail) {
    return res.status(400).json({ error: 'User email required' });
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Valid trick ID required' });
  }

  try {
    if (req.method === 'POST') {
      return await handleToggleKudos(req, res, id, userEmail);
    } else if (req.method === 'GET') {
      return await handleGetKudosStatus(req, res, id, userEmail);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Kudos API error:', error);
    const { statusCode, message } = handleDynamoError(error);
    return res.status(statusCode).json({ error: message });
  }
}

async function handleToggleKudos(req: NextApiRequest, res: NextApiResponse, trickId: string, userEmail: string) {
  try {
    // Get current state in parallel
    const [existingKudo, trick] = await Promise.all([
      docClient.send(new GetCommand({
        TableName: TABLES.KUDOS,
        Key: { userEmail, trickId }
      })),
      docClient.send(new GetCommand({
        TableName: TABLES.TRICKS,
        Key: { id: trickId }
      }))
    ]);

    if (!trick.Item) {
      return res.status(404).json({ error: 'Trick not found' });
    }

    const hasKudos = !!existingKudo.Item;
    const currentKudos = trick.Item.kudos || 0;
    const newKudosCount = hasKudos ? Math.max(0, currentKudos - 1) : currentKudos + 1;
    const kudosChange = hasKudos ? -1 : 1;
    const scoreChange = hasKudos ? -5 : 5;

    // Atomic transaction
    const transactItems: any[] = [
      {
        Update: {
          TableName: TABLES.TRICKS,
          Key: { id: trickId },
          UpdateExpression: 'SET kudos = :newCount, updatedAt = :now',
          ExpressionAttributeValues: {
            ':newCount': newKudosCount,
            ':now': new Date().toISOString()
          },
          ConditionExpression: 'attribute_exists(id)'
        }
      }
    ];

    if (hasKudos) {
      transactItems.push({
        Delete: {
          TableName: TABLES.KUDOS,
          Key: { userEmail, trickId },
          ConditionExpression: 'attribute_exists(userEmail)'
        }
      });
    } else {
      transactItems.push({
        Put: {
          TableName: TABLES.KUDOS,
          Item: {
            userEmail,
            trickId,
            createdAt: new Date().toISOString()
          },
          ConditionExpression: 'attribute_not_exists(userEmail)'
        }
      });
    }

    // Update author's score if not anonymous
    if (trick.Item.authorEmail && trick.Item.authorEmail !== 'anonymous' && trick.Item.authorEmail !== userEmail) {
      transactItems.push({
        Update: {
          TableName: TABLES.USERS,
          Key: { email: trick.Item.authorEmail },
          UpdateExpression: 'ADD score :scoreChange, kudosReceived :kudosChange SET updatedAt = :now',
          ExpressionAttributeValues: {
            ':scoreChange': scoreChange,
            ':kudosChange': kudosChange,
            ':now': new Date().toISOString()
          }
        }
      });
    }

    await docClient.send(new TransactWriteCommand({
      TransactItems: transactItems
    }));
    
    // Return consistent response format
    res.status(200).json({
      success: true,
      hasKudos: !hasKudos,
      newKudosCount: newKudosCount,
      kudosCount: newKudosCount, // For backward compatibility
      action: hasKudos ? 'removed' : 'added'
    });

  } catch (error: any) {
    if (error.name === 'TransactionCanceledException') {
      return res.status(409).json({ 
        error: 'Kudos operation conflict, please try again' 
      });
    }
    
    const { statusCode, message } = handleDynamoError(error);
    res.status(statusCode).json({ error: message });
  }
}

async function handleGetKudosStatus(req: NextApiRequest, res: NextApiResponse, trickId: string, userEmail: string) {
  try {
    const [kudoResult, trickResult] = await Promise.all([
      docClient.send(new GetCommand({
        TableName: TABLES.KUDOS,
        Key: { userEmail, trickId }
      })),
      docClient.send(new GetCommand({
        TableName: TABLES.TRICKS,
        Key: { id: trickId },
        ProjectionExpression: 'kudos'
      }))
    ]);

    const kudosCount = trickResult.Item?.kudos || 0;

    res.status(200).json({
      hasKudos: !!kudoResult.Item,
      kudosCount: kudosCount,
      newKudosCount: kudosCount // For consistency
    });

  } catch (error) {
    const { statusCode, message } = handleDynamoError(error);
    res.status(statusCode).json({ error: message });
  }
}
