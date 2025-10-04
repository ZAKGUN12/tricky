import { NextApiRequest, NextApiResponse } from 'next';
import { addKudos } from '../../../../lib/mockData';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  addKudos(id as string);
  res.json({ success: true });
}
