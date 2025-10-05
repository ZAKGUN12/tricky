import { NextApiRequest, NextApiResponse } from 'next';
import { addKudos } from '../../../../lib/mockData';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const { userId } = req.body;
    
    const result = addKudos(id as string);
    
    if (!result.success) {
      return res.status(400).json({ error: 'Already gave kudos to this trick' });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update kudos' });
  }
}
