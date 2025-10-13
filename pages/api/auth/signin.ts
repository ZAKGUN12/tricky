import { NextApiRequest, NextApiResponse } from 'next';
import { CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-west-1'
});

const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, action, username } = req.body;

  try {
    if (action === 'signup') {
      const command = new SignUpCommand({
        ClientId: CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'preferred_username', Value: username }
        ]
      });

      const response = await client.send(command);
      return res.status(200).json({ success: true, userSub: response.UserSub });
    } else {
      const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: CLIENT_ID,
        AuthParameters: {
          USERNAME: email, // This could be email or username
          PASSWORD: password
        }
      });

      const response = await client.send(command);
      
      if (!response.AuthenticationResult) {
        return res.status(400).json({ error: 'Authentication failed' });
      }

      // Get user info to extract the actual username
      let actualUsername = username;
      try {
        const getUserCommand = new GetUserCommand({
          AccessToken: response.AuthenticationResult.AccessToken
        });
        const userResponse = await client.send(getUserCommand);
        
        // Extract preferred_username from user attributes
        const usernameAttr = userResponse.UserAttributes?.find(attr => attr.Name === 'preferred_username');
        if (usernameAttr?.Value) {
          actualUsername = usernameAttr.Value;
        }
      } catch (error) {
        console.log('Could not fetch user details, using provided username');
      }

      return res.status(200).json({
        AccessToken: response.AuthenticationResult.AccessToken,
        IdToken: response.AuthenticationResult.IdToken,
        RefreshToken: response.AuthenticationResult.RefreshToken,
        username: actualUsername // Return the actual username from Cognito
      });
    }
  } catch (error: any) {
    console.error('Auth error:', error);
    return res.status(400).json({ 
      error: error.message || 'Authentication failed' 
    });
  }
}
