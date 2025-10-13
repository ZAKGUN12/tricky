import { CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand, ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-west-1'
});

const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;

export const signInWithCognito = async (email: string, password: string) => {
  const command = new InitiateAuthCommand({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password
    }
  });

  const response = await client.send(command);
  
  if (!response.AuthenticationResult) {
    throw new Error('Authentication failed');
  }

  return response.AuthenticationResult;
};

export const signUpWithCognito = async (email: string, password: string, username: string) => {
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
  return response;
};

export const confirmSignUp = async (email: string, code: string) => {
  const command = new ConfirmSignUpCommand({
    ClientId: CLIENT_ID,
    Username: email,
    ConfirmationCode: code
  });

  const response = await client.send(command);
  return response;
};
