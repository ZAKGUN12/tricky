import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Mock trending data - replace with real DynamoDB query
  const trending = [
    { id: '1', title: 'Quick Phone Battery Saver', kudos: 234, comments: 45, trend: 'up' },
    { id: '2', title: 'Perfect Coffee Every Time', kudos: 189, comments: 32, trend: 'up' },
    { id: '3', title: 'Instant Wrinkle Remover', kudos: 156, comments: 28, trend: 'stable' },
    { id: '4', title: 'Speed Reading Technique', kudos: 143, comments: 19, trend: 'down' },
    { id: '5', title: 'Memory Palace Method', kudos: 128, comments: 24, trend: 'up' }
  ];

  res.json(trending);
}
