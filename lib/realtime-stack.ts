import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class RealtimeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Notifications table for real-time features
    const notificationsTable = new dynamodb.Table(this, 'NotificationsTable', {
      tableName: 'TrickShare-Notifications',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // Activities table for live feed
    const activitiesTable = new dynamodb.Table(this, 'ActivitiesTable', {
      tableName: 'TrickShare-Activities',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // Output table names
    new cdk.CfnOutput(this, 'NotificationsTableName', {
      value: notificationsTable.tableName
    });

    new cdk.CfnOutput(this, 'ActivitiesTableName', {
      value: activitiesTable.tableName
    });
  }
}
