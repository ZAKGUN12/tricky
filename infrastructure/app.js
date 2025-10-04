#!/usr/bin/env node
const cdk = require('aws-cdk-lib');
const { TrickShareStack } = require('./stack');

const app = new cdk.App();
new TrickShareStack(app, 'TrickShareStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'eu-west-1'
  }
});
