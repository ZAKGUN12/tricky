import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  
  // Mock response
  res.status(200).json({ 
    id,
    name: 'Demo User',
    tricksSubmitted: 3,
    totalKudos: 45
  });
}
