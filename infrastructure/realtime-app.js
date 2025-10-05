const cdk = require('aws-cdk-lib');
const { RealtimeStack } = require('../lib/realtime-stack.ts');

const app = new cdk.App();

new RealtimeStack(app, 'RealtimeStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
