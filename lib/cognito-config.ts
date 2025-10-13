import { Amplify } from 'aws-amplify';

const cognitoConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || '',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-west-1'
    }
  }
};

if (typeof window !== 'undefined') {
  Amplify.configure(cognitoConfig);
}

export default cognitoConfig;