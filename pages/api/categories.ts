import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Return hardcoded categories for now to ensure it works
      const categories = [
        { id: 'cooking', name: 'Cooking', icon: '🍳', count: 15 },
        { id: 'cleaning', name: 'Cleaning', icon: '🧹', count: 8 },
        { id: 'technology', name: 'Technology', icon: '📱', count: 12 },
        { id: 'health', name: 'Health', icon: '🍎', count: 6 },
        { id: 'travel', name: 'Travel', icon: '✈️', count: 9 },
      ];
      
      res.status(200).json(categories);
    } catch (error) {
      console.error('Error in categories API:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
