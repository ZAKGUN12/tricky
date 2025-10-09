import { Amplify } from 'aws-amplify';

const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || 'us-east-1_example',
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || 'example',
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        email: true,
        username: false
      }
    }
  }
};

Amplify.configure(awsConfig);

export default awsConfig;
