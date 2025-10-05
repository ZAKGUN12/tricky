import { NextApiRequest, NextApiResponse } from 'next';
import { toggleFavorite } from '../../../../lib/mockData';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const isFavorited = toggleFavorite(id as string, userId);
    res.json({ success: true, favorited: isFavorited });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
}
