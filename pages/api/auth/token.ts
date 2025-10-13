import { NextApiRequest, NextApiResponse } from 'next';
import { rateLimit } from '../../../lib/rateLimit';

// Rate limiting for auth endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10 // limit each IP to 10 auth attempts per 15 minutes
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply rate limiting
  await new Promise<void>((resolve) => {
    limiter(req, res, resolve);
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Authorization code required' });
  }

  try {
    const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;

    if (!domain || !clientId || !redirectUri) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const tokenResponse = await fetch(`https://${domain}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        code,
        redirect_uri: redirectUri
      })
    });

    if (!tokenResponse.ok) {
      // Don't expose detailed error information
      return res.status(400).json({ error: 'Authentication failed' });
    }

    const tokens = await tokenResponse.json();
    res.status(200).json(tokens);
  } catch (error) {
    // Generic error message for security
    res.status(500).json({ error: 'Authentication failed' });
  }
}