const cdk = require('aws-cdk-lib');
const cognito = require('aws-cdk-lib/aws-cognito');

class AuthStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Cognito User Pool
    const userPool = new cognito.UserPool(this, 'TrickShareUserPool', {
      userPoolName: 'TrickShare-Users',
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
        username: false
      },
      autoVerify: {
        email: true
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true
        },
        givenName: {
          required: true,
          mutable: true
        }
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // Cognito User Pool Client
    const userPoolClient = new cognito.UserPoolClient(this, 'TrickShareUserPoolClient', {
      userPool,
      userPoolClientName: 'TrickShare-Web-Client',
      generateSecret: false,
      authFlows: {
        userPassword: true,
        userSrp: true
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true
        },
        scopes: [
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.PROFILE
        ],
        callbackUrls: [
          'http://localhost:3000/auth/callback',
          'https://d1r0brixop73kl.cloudfront.net/auth/callback'
        ],
        logoutUrls: [
          'http://localhost:3000',
          'https://d1r0brixop73kl.cloudfront.net'
        ]
      }
    });

    // Cognito Identity Pool
    const identityPool = new cognito.CfnIdentityPool(this, 'TrickShareIdentityPool', {
      identityPoolName: 'TrickShare Identity Pool',
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [{
        clientId: userPoolClient.userPoolClientId,
        providerName: userPool.userPoolProviderName
      }]
    });

    // Outputs
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
      description: 'Cognito User Pool ID'
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
      description: 'Cognito User Pool Client ID'
    });

    new cdk.CfnOutput(this, 'IdentityPoolId', {
      value: identityPool.ref,
      description: 'Cognito Identity Pool ID'
    });

    new cdk.CfnOutput(this, 'Region', {
      value: this.region,
      description: 'AWS Region'
    });
  }
}

module.exports = { AuthStack };
