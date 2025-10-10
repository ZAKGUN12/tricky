import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Return hardcoded categories for now to ensure it works
      const categories = [
        { id: 'cooking', name: 'Cooking', description: 'Kitchen tips and recipes', icon: '🍳', createdAt: '2024-01-10T10:00:00Z' },
        { id: 'cleaning', name: 'Cleaning', description: 'House cleaning tips', icon: '🧹', createdAt: '2024-01-10T10:01:00Z' },
        { id: 'technology', name: 'Technology', description: 'Tech tips and tricks', icon: '📱', createdAt: '2024-01-10T10:02:00Z' },
        { id: 'health', name: 'Health', description: 'Wellness and fitness', icon: '🍎', createdAt: '2024-01-10T10:03:00Z' },
        { id: 'travel', name: 'Travel', description: 'Travel tips and hacks', icon: '✈️', createdAt: '2024-01-10T10:04:00Z' },
      ];
      
      res.status(200).json({ categories });
    } catch (error) {
      console.error('Error in categories API:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
