const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);

async function testKudosRestriction() {
  const testUserEmail = 'test@example.com';
  const testTrickId = 'test-trick-123';

  console.log('Testing kudos restriction...');

  try {
    // First, create a test trick
    await docClient.send(new PutCommand({
      TableName: 'TrickShare-Tricks',
      Item: {
        id: testTrickId,
        title: 'Test Trick',
        description: 'A test trick',
        steps: ['Step 1'],
        country: 'Test Country',
        countryCode: 'TC',
        difficulty: 'easy',
        tags: ['test'],
        authorName: 'Test Author',
        authorEmail: 'author@test.com',
        kudos: 0,
        views: 0,
        comments: 0,
        status: 'approved',
        createdAt: new Date().toISOString()
      }
    }));

    // Test the kudos API endpoint
    const response1 = await fetch('http://localhost:3000/api/tricks/' + testTrickId + '/kudos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail: testUserEmail })
    });

    const result1 = await response1.json();
    console.log('First kudos attempt:', result1);

    // Try to give kudos again (should fail)
    const response2 = await fetch('http://localhost:3000/api/tricks/' + testTrickId + '/kudos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail: testUserEmail })
    });

    const result2 = await response2.json();
    console.log('Second kudos attempt:', result2);

    // Check user kudos
    const response3 = await fetch(`http://localhost:3000/api/user/kudos?userEmail=${encodeURIComponent(testUserEmail)}`);
    const result3 = await response3.json();
    console.log('User kudos:', result3);

    console.log('Test completed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Only run if server is running
if (process.argv.includes('--run')) {
  testKudosRestriction();
} else {
  console.log('Run with --run flag when server is running on localhost:3000');
}
