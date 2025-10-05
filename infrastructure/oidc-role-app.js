#!/usr/bin/env node
const cdk = require('aws-cdk-lib');
const { GitHubOIDCRoleStack } = require('./oidc-role');

const app = new cdk.App();
new GitHubOIDCRoleStack(app, 'GitHubOIDCRoleStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'eu-west-1'
  }
});
