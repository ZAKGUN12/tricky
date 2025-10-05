#!/usr/bin/env node
const cdk = require('aws-cdk-lib');
const { GitHubOIDCStack } = require('./oidc-stack');

const app = new cdk.App();
new GitHubOIDCStack(app, 'GitHubOIDCStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'eu-west-1'
  }
});
