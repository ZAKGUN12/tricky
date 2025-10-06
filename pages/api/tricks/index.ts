import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { country, search, difficulty } = req.query;
      
      const command = new ScanCommand({
        TableName: 'TrickShare-Tricks',
        FilterExpression: buildFilterExpression({ country, search, difficulty }),
        ExpressionAttributeValues: buildExpressionValues({ country, search, difficulty })
      });

      const result = await docClient.send(command);
      res.status(200).json(result.Items || []);
      
    } else if (req.method === 'POST') {
      const trick = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString(),
        kudos: 0,
        views: 0,
        comments: 0,
        status: 'approved'
      };

      // Save trick
      await docClient.send(new PutCommand({
        TableName: 'TrickShare-Tricks',
        Item: trick
      }));

      // Update user stats if authorEmail provided
      if (req.body.authorEmail && req.body.authorEmail !== 'anonymous') {
        try {
          await docClient.send(new UpdateCommand({
            TableName: 'TrickShare-Users',
            Key: { email: req.body.authorEmail },
            UpdateExpression: 'ADD tricksSubmitted :inc SET score = if_not_exists(score, :zero) + :points',
            ExpressionAttributeValues: {
              ':inc': 1,
              ':zero': 0,
              ':points': 10 // 10 points for submitting a trick
            }
          }));
        } catch (error) {
          console.log('User stats update failed:', error);
          // Don't fail the trick creation if user stats update fails
        }
      }

      res.status(201).json(trick);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

function buildFilterExpression(filters: any) {
  const expressions = [];
  if (filters.country) expressions.push('countryCode = :country');
  if (filters.difficulty) expressions.push('difficulty = :difficulty');
  if (filters.search) expressions.push('contains(title, :search) OR contains(description, :search)');
  return expressions.length > 0 ? expressions.join(' AND ') : undefined;
}

function buildExpressionValues(filters: any) {
  const values: any = {};
  if (filters.country) values[':country'] = filters.country;
  if (filters.difficulty) values[':difficulty'] = filters.difficulty;
  if (filters.search) values[':search'] = filters.search;
  return Object.keys(values).length > 0 ? values : undefined;
}
