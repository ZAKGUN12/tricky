const cdk = require('aws-cdk-lib');
const iam = require('aws-cdk-lib/aws-iam');

class GitHubOIDCStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // GitHub OIDC Provider
    const githubProvider = new iam.OpenIdConnectProvider(this, 'GitHubOIDCProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
      thumbprints: ['6938fd4d98bab03faadb97b34396831e3780aea1']
    });

    // IAM Role for GitHub Actions
    const githubRole = new iam.Role(this, 'GitHubActionsRole', {
      roleName: 'GitHubActions-TrickShare-Role',
      assumedBy: new iam.WebIdentityPrincipal(
        githubProvider.openIdConnectProviderArn,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com'
          },
          StringLike: {
            'token.actions.githubusercontent.com:sub': 'repo:ZAKGUN12/tricky:*'
          }
        }
      ),
      description: 'Role for GitHub Actions to deploy TrickShare',
      maxSessionDuration: cdk.Duration.hours(1)
    });

    // Attach necessary policies
    githubRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('PowerUserAccess')
    );

    // Additional permissions for CDK
    githubRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'iam:CreateRole',
        'iam:DeleteRole',
        'iam:AttachRolePolicy',
        'iam:DetachRolePolicy',
        'iam:PutRolePolicy',
        'iam:DeleteRolePolicy',
        'iam:GetRole',
        'iam:PassRole',
        'iam:TagRole',
        'iam:UntagRole'
      ],
      resources: ['*']
    }));

    // Outputs
    new cdk.CfnOutput(this, 'GitHubActionsRoleArn', {
      value: githubRole.roleArn,
      description: 'ARN of the GitHub Actions IAM Role'
    });

    new cdk.CfnOutput(this, 'OIDCProviderArn', {
      value: githubProvider.openIdConnectProviderArn,
      description: 'ARN of the GitHub OIDC Provider'
    });
  }
}

module.exports = { GitHubOIDCStack };
