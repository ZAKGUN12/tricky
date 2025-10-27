import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchGetCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);

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
          'TrickShare-Kudos': {
            Keys: chunk
          }
        }
      }));

      if (result.Responses && result.Responses['TrickShare-Kudos']) {
        result.Responses['TrickShare-Kudos'].forEach(item => {
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
    res.status(500).json({ error: 'Failed to get kudos status' });
  }
}
