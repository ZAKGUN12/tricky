#!/usr/bin/env node
const cdk = require('aws-cdk-lib');
const { TrickSharePipelineStack } = require('./pipeline-stack');

const app = new cdk.App();
new TrickSharePipelineStack(app, 'TrickSharePipelineStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'eu-west-1'
  }
});
