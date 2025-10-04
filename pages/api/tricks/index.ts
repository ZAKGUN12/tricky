import { NextApiRequest, NextApiResponse } from 'next';

// Use mock data for static export
import { getTricks, addTrick } from '../../../lib/mockData';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { country, language, tag } = req.query;
    
    let tricks = getTricks();

    if (country) tricks = tricks.filter(t => t.countryCode === country);
    if (language) tricks = tricks.filter(t => t.languageCode === language);
    if (tag) tricks = tricks.filter(t => t.tags?.includes(tag as string));

    res.json({ tricks: tricks.sort((a, b) => b.kudos - a.kudos) });
  }

  if (req.method === 'POST') {
    const newTrick = addTrick(req.body);
    res.json({ success: true, id: newTrick.id });
  }
}
