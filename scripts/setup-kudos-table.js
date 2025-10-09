const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-1' });

async function createKudosTable() {
  const params = {
    TableName: 'TrickShare-Kudos',
    KeySchema: [
      { AttributeName: 'userEmail', KeyType: 'HASH' },
      { AttributeName: 'trickId', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'userEmail', AttributeType: 'S' },
      { AttributeName: 'trickId', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  };

  try {
    await client.send(new CreateTableCommand(params));
    console.log('TrickShare-Kudos table created successfully');
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('TrickShare-Kudos table already exists');
    } else {
      console.error('Error creating table:', error);
    }
  }
}

createKudosTable();
