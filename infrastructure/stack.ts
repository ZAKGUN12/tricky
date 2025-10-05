import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class TrickShareStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB table for tricks
    const tricksTable = new dynamodb.Table(this, 'TricksTable', {
      tableName: 'TrickShare-Tricks',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // DynamoDB table for comments
    const commentsTable = new dynamodb.Table(this, 'CommentsTable', {
      tableName: 'TrickShare-Comments',
      partitionKey: { name: 'trickId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // S3 bucket for static hosting
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      bucketName: `trickshare-${this.account}-${this.region}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // IAM role for API access to DynamoDB
    const apiRole = new iam.Role(this, 'ApiRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
      ]
    });

    // Grant DynamoDB permissions
    tricksTable.grantReadWriteData(apiRole);
    commentsTable.grantReadWriteData(apiRole);

    // Deploy static files
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('./out')],
      destinationBucket: websiteBucket
    });

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      }
    });

    // Outputs
    new cdk.CfnOutput(this, 'TricksTableName', {
      value: tricksTable.tableName,
      exportName: 'TrickShare-TricksTableName'
    });

    new cdk.CfnOutput(this, 'CommentsTableName', {
      value: commentsTable.tableName,
      exportName: 'TrickShare-CommentsTableName'
    });

    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: distribution.distributionDomainName,
      exportName: 'TrickShare-WebsiteURL'
    });

    new cdk.CfnOutput(this, 'S3BucketURL', {
      value: websiteBucket.bucketWebsiteUrl,
      exportName: 'TrickShare-S3BucketURL'
    });

    new cdk.CfnOutput(this, 'ApiRoleArn', {
      value: apiRole.roleArn,
      exportName: 'TrickShare-ApiRoleArn'
    });
  }
}
