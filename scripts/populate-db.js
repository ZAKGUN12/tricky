const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);

const mockUsers = [
  { email: 'sarah.chef@example.com', score: 85, tricksSubmitted: 8, kudosReceived: 12 },
  { email: 'mike.productivity@example.com', score: 120, tricksSubmitted: 12, kudosReceived: 24 },
  { email: 'anna.lifehacks@example.com', score: 95, tricksSubmitted: 9, kudosReceived: 14 },
  { email: 'david.tech@example.com', score: 75, tricksSubmitted: 7, kudosReceived: 10 },
  { email: 'lisa.wellness@example.com', score: 110, tricksSubmitted: 11, kudosReceived: 20 },
  { email: 'carlos.travel@example.com', score: 65, tricksSubmitted: 6, kudosReceived: 8 },
  { email: 'emma.diy@example.com', score: 90, tricksSubmitted: 9, kudosReceived: 15 },
  { email: 'james.finance@example.com', score: 80, tricksSubmitted: 8, kudosReceived: 11 }
];

const mockTricks = [
  {
    id: Date.now().toString() + '1',
    title: 'Perfect Pasta Water Trick',
    description: 'Save pasta water to make your sauce silky and restaurant-quality',
    steps: ['Boil pasta in well-salted water', 'Reserve 1 cup pasta water before draining', 'Add pasta water gradually to your sauce while mixing'],
    country: 'IT',
    countryCode: 'IT',
    difficulty: 'easy',
    tags: ['cooking', 'pasta', 'italian'],
    authorName: 'sarah.chef@example.com',
    authorEmail: 'sarah.chef@example.com',
    kudos: 24,
    views: 156,
    comments: 8,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: Date.now().toString() + '2',
    title: '2-Minute Rule for Productivity',
    description: 'If a task takes less than 2 minutes, do it immediately instead of adding it to your todo list',
    steps: ['When you think of a small task, check if it takes under 2 minutes', 'If yes, do it right away', 'If no, add it to your proper todo list'],
    country: 'US',
    countryCode: 'US',
    difficulty: 'easy',
    tags: ['productivity', 'time-management', 'habits'],
    authorName: 'mike.productivity@example.com',
    authorEmail: 'mike.productivity@example.com',
    kudos: 45,
    views: 289,
    comments: 12,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: Date.now().toString() + '3',
    title: 'Ice Cube Wrinkle Remover',
    description: 'Remove wrinkles from clothes using ice cubes in the dryer',
    steps: ['Put wrinkled clothes in dryer', 'Add 3-4 ice cubes', 'Run on high heat for 10 minutes', 'Hang immediately after cycle'],
    country: 'CA',
    countryCode: 'CA',
    difficulty: 'easy',
    tags: ['laundry', 'clothing', 'lifehack'],
    authorName: 'anna.lifehacks@example.com',
    authorEmail: 'anna.lifehacks@example.com',
    kudos: 38,
    views: 201,
    comments: 6,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: Date.now().toString() + '4',
    title: 'Phone Battery Optimization',
    description: 'Extend your phone battery life with these simple settings changes',
    steps: ['Enable dark mode to save OLED battery', 'Turn off background app refresh for unused apps', 'Reduce screen brightness and use auto-brightness', 'Disable location services for non-essential apps'],
    country: 'DE',
    countryCode: 'DE',
    difficulty: 'medium',
    tags: ['technology', 'battery', 'smartphone'],
    authorName: 'david.tech@example.com',
    authorEmail: 'david.tech@example.com',
    kudos: 31,
    views: 178,
    comments: 9,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: Date.now().toString() + '5',
    title: 'Morning Hydration Boost',
    description: 'Start your day with this simple hydration trick for better energy',
    steps: ['Keep a glass of water by your bed', 'Drink it immediately upon waking', 'Add a pinch of sea salt and lemon for electrolytes'],
    country: 'AU',
    countryCode: 'AU',
    difficulty: 'easy',
    tags: ['health', 'morning-routine', 'hydration'],
    authorName: 'lisa.wellness@example.com',
    authorEmail: 'lisa.wellness@example.com',
    kudos: 29,
    views: 145,
    comments: 5,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: Date.now().toString() + '6',
    title: 'Packing Cubes Alternative',
    description: 'Use ziplock bags as budget packing cubes for organized travel',
    steps: ['Get gallon-size ziplock bags', 'Roll clothes tightly and place in bags', 'Press out air before sealing', 'Label bags by category (shirts, pants, etc.)'],
    country: 'ES',
    countryCode: 'ES',
    difficulty: 'easy',
    tags: ['travel', 'packing', 'organization'],
    authorName: 'carlos.travel@example.com',
    authorEmail: 'carlos.travel@example.com',
    kudos: 22,
    views: 134,
    comments: 4,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
  }
];

async function populateUsers() {
  console.log('Adding mock users...');
  
  for (const user of mockUsers) {
    try {
      await docClient.send(new PutCommand({
        TableName: 'TrickShare-Users',
        Item: {
          ...user,
          createdAt: new Date().toISOString()
        }
      }));
      console.log(`✅ Added user: ${user.email}`);
    } catch (error) {
      console.log(`❌ Failed to add user ${user.email}:`, error.message);
    }
  }
}

async function populateTricks() {
  console.log('Adding mock tricks...');
  
  for (const trick of mockTricks) {
    try {
      await docClient.send(new PutCommand({
        TableName: 'TrickShare-Tricks',
        Item: trick
      }));
      console.log(`✅ Added trick: ${trick.title}`);
    } catch (error) {
      console.log(`❌ Failed to add trick ${trick.title}:`, error.message);
    }
  }
}

async function populateComments() {
  console.log('Adding mock comments...');
  
  const comments = [
    { trickId: mockTricks[0].id, text: 'This changed my pasta game forever!', authorName: 'mike.productivity@example.com' },
    { trickId: mockTricks[0].id, text: 'Works great with any sauce type', authorName: 'anna.lifehacks@example.com' },
    { trickId: mockTricks[1].id, text: 'Simple but so effective for productivity', authorName: 'sarah.chef@example.com' },
    { trickId: mockTricks[1].id, text: 'I use this rule daily now', authorName: 'david.tech@example.com' },
    { trickId: mockTricks[2].id, text: 'Genius! No more ironing for me', authorName: 'lisa.wellness@example.com' },
    { trickId: mockTricks[3].id, text: 'My battery lasts so much longer now', authorName: 'carlos.travel@example.com' }
  ];

  for (const comment of comments) {
    try {
      await docClient.send(new PutCommand({
        TableName: 'TrickShare-Comments',
        Item: {
          trickId: comment.trickId,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          text: comment.text,
          authorName: comment.authorName,
          createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString()
        }
      }));
      console.log(`✅ Added comment for trick: ${comment.trickId.slice(-1)}`);
    } catch (error) {
      console.log(`❌ Failed to add comment:`, error.message);
    }
  }
}

async function main() {
  console.log('🚀 Starting database population...\n');
  
  await populateUsers();
  console.log('');
  await populateTricks();
  console.log('');
  await populateComments();
  
  console.log('\n🎉 Database population completed!');
  console.log('Your TrickShare platform now has:');
  console.log(`- ${mockUsers.length} active users`);
  console.log(`- ${mockTricks.length} sample tricks`);
  console.log('- Sample comments and interactions');
  console.log('\nVisit your app to see the populated content!');
}

main().catch(console.error);
