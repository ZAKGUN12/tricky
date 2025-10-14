import { NextApiRequest, NextApiResponse } from 'next';
import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-west-1'
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No valid token provided' });
  }

  const accessToken = authHeader.substring(7);

  try {
    const command = new GetUserCommand({
      AccessToken: accessToken
    });

    const response = await client.send(command);
    
    // Extract user attributes safely
    const attributes = response.UserAttributes || [];
    const email = attributes.find(attr => attr.Name === 'email')?.Value || '';
    const preferredUsername = attributes.find(attr => attr.Name === 'preferred_username')?.Value || '';
    
    return res.status(200).json({
      username: response.Username,
      email,
      name: preferredUsername || email.split('@')[0],
      preferredUsername,
      sub: attributes.find(attr => attr.Name === 'sub')?.Value || ''
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return res.status(401).json({ 
      error: 'Invalid or expired token' 
    });
  }
}
