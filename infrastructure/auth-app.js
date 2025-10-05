#!/usr/bin/env node
const cdk = require('aws-cdk-lib');
const { AuthStack } = require('./auth-stack');

const app = new cdk.App();
new AuthStack(app, 'TrickShareAuthStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'eu-west-1'
  }
});
