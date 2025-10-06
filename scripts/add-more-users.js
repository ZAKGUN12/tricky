const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);

const moreUsers = [
  { email: 'yuki.minimalist@example.com', score: 135, tricksSubmitted: 13, kudosReceived: 27 },
  { email: 'raj.techguru@example.com', score: 98, tricksSubmitted: 9, kudosReceived: 16 },
  { email: 'marie.organizer@example.com', score: 87, tricksSubmitted: 8, kudosReceived: 13 },
  { email: 'alex.traveler@example.com', score: 102, tricksSubmitted: 10, kudosReceived: 18 },
  { email: 'sofia.wellness@example.com', score: 76, tricksSubmitted: 7, kudosReceived: 11 },
  { email: 'chen.productivity@example.com', score: 91, tricksSubmitted: 9, kudosReceived: 14 },
  { email: 'lucas.diy@example.com', score: 68, tricksSubmitted: 6, kudosReceived: 9 },
  { email: 'nina.foodie@example.com', score: 83, tricksSubmitted: 8, kudosReceived: 12 }
];

const additionalComments = [
  { text: 'This is genius! Never thought of using grapes as ice cubes', authorName: 'yuki.minimalist@example.com' },
  { text: 'The QR code trick saved me so much time with guests!', authorName: 'raj.techguru@example.com' },
  { text: 'Finally, a budgeting method that actually works for me', authorName: 'marie.organizer@example.com' },
  { text: 'Hotel security is so important, great checklist!', authorName: 'alex.traveler@example.com' },
  { text: 'My skin feels amazing after trying the shower steam trick', authorName: 'sofia.wellness@example.com' },
  { text: 'Pomodoro + music = productivity game changer', authorName: 'chen.productivity@example.com' },
  { text: 'Bread clips are everywhere now that I know this trick!', authorName: 'lucas.diy@example.com' },
  { text: 'Got so much more juice from my lemons, amazing!', authorName: 'nina.foodie@example.com' }
];

async function addMoreUsers() {
  console.log('👥 Adding more diverse users...\n');
  
  for (const user of moreUsers) {
    try {
      await docClient.send(new PutCommand({
        TableName: 'TrickShare-Users',
        Item: {
          ...user,
          createdAt: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString()
        }
      }));
      console.log(`✅ Added user: ${user.email} (${user.score} points)`);
    } catch (error) {
      console.log(`❌ Failed to add user ${user.email}:`, error.message);
    }
  }
  
  console.log(`\n🎉 Added ${moreUsers.length} more users!`);
  console.log('Your leaderboard now has more competition with users from:');
  console.log('🇯🇵 Japan (Minimalist lifestyle)');
  console.log('🇮🇳 India (Tech expertise)');  
  console.log('🇫🇷 France (Organization)');
  console.log('🇦🇺 Australia (Travel)');
  console.log('🇰🇷 Korea (Wellness)');
  console.log('🇨🇳 China (Productivity)');
  console.log('🇧🇷 Brazil (DIY)');
  console.log('🇮🇹 Italy (Food)');
}

addMoreUsers().catch(console.error);
