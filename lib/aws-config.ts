export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'eu-west-1_3ckjVhgRq',
      userPoolClientId: '2sukplim9dhaugu4e1gf01ji7h',
      identityPoolId: 'eu-west-1:73491b39-99e4-4090-a775-aafa9047aa07',
      loginWith: {
        email: true
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true
        },
        given_name: {
          required: true
        }
      },
      allowGuestAccess: true,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: false
      }
    }
  }
};
