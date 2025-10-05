import { NextApiRequest, NextApiResponse } from 'next';
import { getUserFavorites, getUserKudos, getTricksByAuthor } from '../../../../lib/mockData';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const userId = id as string;
    
    const favorites = getUserFavorites(userId);
    const kudos = getUserKudos(userId);
    const userTricks = getTricksByAuthor(userId);
    
    const stats = {
      tricksShared: userTricks.length,
      totalKudos: userTricks.reduce((sum, trick) => sum + trick.kudos, 0),
      kudosGiven: kudos.length,
      favoritesCount: favorites.length
    };
    
    res.json({ 
      favorites, 
      kudos, 
      stats,
      tricks: userTricks
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
}
