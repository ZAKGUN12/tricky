import { NextApiRequest, NextApiResponse } from 'next';
import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-west-1'
});

const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, code } = req.body;

  try {
    const command = new ConfirmSignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: code
    });

    await client.send(command);
    
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Verification error:', error);
    return res.status(400).json({ 
      error: error.message || 'Verification failed' 
    });
  }
}
