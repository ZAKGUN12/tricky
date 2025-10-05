export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'eu-west-1_yZS9dVviI',
      userPoolClientId: '5hdfa24ogh4an99q3njpsf7u89',
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        email: true,
        username: false,
        phone: false
      }
    }
  }
};
