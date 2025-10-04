#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { TrickShareStack } from './stack.js';

const app = new cdk.App();
new TrickShareStack(app, 'TrickShareStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'eu-west-1'
  }
});
