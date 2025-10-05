import { NextApiRequest, NextApiResponse } from 'next';
import { mockTricks } from '../../../lib/mockData';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(mockTricks);
  } else if (req.method === 'POST') {
    // Mock add trick
    res.status(201).json({ success: true, id: Date.now().toString() });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
