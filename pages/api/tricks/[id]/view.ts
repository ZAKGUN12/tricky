import { NextApiRequest, NextApiResponse } from 'next';
import { addView } from '../../../../lib/mockData';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    addView(id as string);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add view' });
  }
}
