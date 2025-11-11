import { NextApiRequest, NextApiResponse } from 'next';
import { BatchGetCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLES, handleDynamoError } from '../../../lib/aws-config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userEmail, trickIds } = req.body;

  if (!userEmail) {
    return res.status(400).json({ error: 'User email required' });
  }

  if (!trickIds || !Array.isArray(trickIds)) {
    return res.status(400).json({ error: 'Trick IDs array required' });
  }

  try {
    // Return empty kudos status if no tricks
    if (trickIds.length === 0) {
      return res.status(200).json({ kudosStatus: {} });
    }

    // Batch get kudos for all tricks
    const keys = trickIds.map(trickId => ({
      userEmail,
      trickId
    }));

    // DynamoDB batch get has a limit of 100 items
    const chunks = [];
    for (let i = 0; i < keys.length; i += 100) {
      chunks.push(keys.slice(i, i + 100));
    }

    const kudosStatus: Record<string, boolean> = {};

    for (const chunk of chunks) {
      const result = await docClient.send(new BatchGetCommand({
        RequestItems: {
          [TABLES.KUDOS]: {
            Keys: chunk
          }
        }
      }));

      if (result.Responses && result.Responses[TABLES.KUDOS]) {
        result.Responses[TABLES.KUDOS].forEach(item => {
          kudosStatus[item.trickId] = true;
        });
      }
    }

    // Set false for tricks that don't have kudos
    trickIds.forEach(trickId => {
      if (!(trickId in kudosStatus)) {
        kudosStatus[trickId] = false;
      }
    });

    res.status(200).json({ kudosStatus });
  } catch (error) {
    console.error('Get user kudos error:', error);
    const { statusCode, message } = handleDynamoError(error);
    
    // Return empty kudos status on error instead of failing
    const kudosStatus: Record<string, boolean> = {};
    trickIds.forEach(trickId => {
      kudosStatus[trickId] = false;
    });
    
    res.status(statusCode === 500 ? 200 : statusCode).json({ 
      kudosStatus,
      warning: statusCode !== 500 ? message : undefined
    });
  }
}
