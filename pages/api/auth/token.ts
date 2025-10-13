import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Authorization code required' });
  }

  try {
    const tokenResponse = await fetch(`https://${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
        code,
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI || ''
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Token exchange failed');
    }

    const tokens = await tokenResponse.json();
    res.status(200).json(tokens);
  } catch (error) {
    console.error('Token exchange error:', error);
    res.status(500).json({ error: 'Token exchange failed' });
  }
}