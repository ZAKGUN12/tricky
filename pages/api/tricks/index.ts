import { NextApiRequest, NextApiResponse } from 'next';

// Use mock data for static export
import { getTricks, addTrick, searchTricks } from '../../../lib/mockData';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { country, language, tag, search } = req.query;
    
    let tricks = getTricks();

    // Apply search first if provided
    if (search && typeof search === 'string') {
      tricks = searchTricks(search);
    }

    // Then apply other filters
    if (country) tricks = tricks.filter(t => t.countryCode === country);
    if (language) tricks = tricks.filter(t => t.languageCode === language);
    if (tag) tricks = tricks.filter(t => t.tags?.includes(tag as string));

    res.json({ 
      tricks: tricks.sort((a, b) => b.kudos - a.kudos),
      total: tricks.length 
    });
  }

  if (req.method === 'POST') {
    try {
      // Basic validation
      const { title, description, steps, countryCode, tags } = req.body;
      
      if (!title || !description || !steps || !steps[0] || !countryCode) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (title.length > 100) {
        return res.status(400).json({ error: 'Title too long' });
      }

      if (description.length > 200) {
        return res.status(400).json({ error: 'Description too long' });
      }

      if (steps.length > 3) {
        return res.status(400).json({ error: 'Too many steps' });
      }

      const newTrick = addTrick(req.body);
      res.json({ success: true, id: newTrick.id, trick: newTrick });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create trick' });
    }
  }
}
