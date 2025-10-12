const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

// Initialize DynamoDB client with default credentials
const client = new DynamoDBClient({ 
  region: 'eu-west-1' // Use the region from your AWS config
});
const docClient = DynamoDBDocumentClient.from(client);

const sampleTricks = [
  {
    title: "Perfect Turkish Tea Brewing",
    description: "Learn the authentic way to brew Turkish tea using a double teapot system for the perfect strength and flavor.",
    steps: [
      "Fill the bottom kettle with water and bring to boil",
      "Add loose tea leaves to the top teapot",
      "Pour boiling water over tea leaves",
      "Let it steep for 15-20 minutes",
      "Serve by mixing strong tea with hot water to taste"
    ],
    country: "Turkey",
    countryCode: "TR",
    difficulty: "medium",
    tags: ["tea", "turkish", "brewing", "traditional"],
    authorName: "Mehmet Özkan",
    authorEmail: "mehmet@example.com",
    category: "cooking",
    kudos: 45,
    views: 250,
    comments: 8
  },
  {
    title: "Japanese 5-Minute Room Organization",
    description: "The KonMari-inspired quick method to organize any room in just 5 minutes using the 'one-touch rule'.",
    steps: [
      "Set a 5-minute timer",
      "Pick up items and put them in their designated place immediately",
      "If an item doesn't have a place, create one or discard it",
      "Work clockwise around the room",
      "Finish by wiping down one surface"
    ],
    country: "Japan",
    countryCode: "JP",
    difficulty: "easy",
    tags: ["organization", "cleaning", "japanese", "quick"],
    authorName: "Yuki Tanaka",
    authorEmail: "yuki@example.com",
    category: "cleaning",
    kudos: 38,
    views: 200,
    comments: 12
  },
  {
    title: "French Cooking: Perfect Omelette Technique",
    description: "Master the classic French omelette with this foolproof technique used in professional kitchens.",
    steps: [
      "Heat butter in non-stick pan over medium-low heat",
      "Beat 3 eggs with salt and pepper",
      "Pour eggs into pan and stir gently with fork",
      "When eggs start to set, stop stirring and let cook 30 seconds",
      "Fold omelette in half and slide onto plate"
    ],
    country: "France",
    countryCode: "FR",
    difficulty: "medium",
    tags: ["cooking", "french", "eggs", "technique"],
    authorName: "Marie Dubois",
    authorEmail: "marie@example.com",
    category: "cooking",
    kudos: 32,
    views: 180,
    comments: 6
  },
  {
    title: "German Efficiency: 2-Minute Desk Setup",
    description: "Organize your workspace for maximum productivity using German engineering principles.",
    steps: [
      "Clear everything from your desk",
      "Place only essential items within arm's reach",
      "Use the 'one-minute rule' for quick tasks",
      "Keep a small notebook for immediate thoughts",
      "End each day by resetting to this clean state"
    ],
    country: "Germany",
    countryCode: "DE",
    difficulty: "easy",
    tags: ["productivity", "organization", "workspace", "efficiency"],
    authorName: "Hans Mueller",
    authorEmail: "hans@example.com",
    category: "productivity",
    kudos: 28,
    views: 160,
    comments: 4
  },
  {
    title: "Italian Pasta Water Secret",
    description: "The secret Italian technique for using pasta water to create restaurant-quality sauces at home.",
    steps: [
      "Save 1 cup of starchy pasta cooking water before draining",
      "Add pasta water gradually to your sauce while mixing",
      "The starch helps bind sauce to pasta perfectly",
      "Adjust consistency with more pasta water as needed",
      "Finish with fresh herbs and cheese"
    ],
    country: "Italy",
    countryCode: "IT",
    difficulty: "easy",
    tags: ["cooking", "italian", "pasta", "sauce"],
    authorName: "Giuseppe Romano",
    authorEmail: "giuseppe@example.com",
    category: "cooking",
    kudos: 25,
    views: 140,
    comments: 9
  },
  {
    title: "Canadian Winter Car Hack",
    description: "Essential Canadian trick to prevent your car from freezing and ensure easy winter starts.",
    steps: [
      "Mix 3 parts vinegar with 1 part water in spray bottle",
      "Spray on windshield the night before to prevent ice",
      "Keep a small bag of kitty litter in trunk for traction",
      "Warm up your car key with a lighter if lock is frozen",
      "Park facing east so morning sun helps melt ice"
    ],
    country: "Canada",
    countryCode: "CA",
    difficulty: "easy",
    tags: ["winter", "car", "canadian", "weather"],
    authorName: "Sarah Thompson",
    authorEmail: "sarah@example.com",
    category: "travel",
    kudos: 35,
    views: 190,
    comments: 11
  }
];

const sampleUsers = [
  {
    email: "mehmet@example.com",
    score: 150,
    tricksSubmitted: 3,
    kudosReceived: 45,
    createdAt: new Date().toISOString()
  },
  {
    email: "yuki@example.com",
    score: 120,
    tricksSubmitted: 2,
    kudosReceived: 38,
    createdAt: new Date().toISOString()
  },
  {
    email: "marie@example.com",
    score: 95,
    tricksSubmitted: 2,
    kudosReceived: 32,
    createdAt: new Date().toISOString()
  },
  {
    email: "hans@example.com",
    score: 80,
    tricksSubmitted: 1,
    kudosReceived: 28,
    createdAt: new Date().toISOString()
  },
  {
    email: "giuseppe@example.com",
    score: 75,
    tricksSubmitted: 1,
    kudosReceived: 25,
    createdAt: new Date().toISOString()
  }
];

async function insertTricks() {
  console.log('🚀 Starting to insert sample tricks...');
  
  for (const trick of sampleTricks) {
    const trickData = {
      ...trick,
      id: uuidv4(),
      status: 'approved',
      createdAt: new Date().toISOString()
    };

    try {
      await docClient.send(new PutCommand({
        TableName: 'TrickShare-Tricks',
        Item: trickData
      }));
      console.log(`✅ Inserted trick: ${trick.title}`);
    } catch (error) {
      console.error(`❌ Failed to insert trick: ${trick.title}`, error.message);
    }
  }
}

async function insertUsers() {
  console.log('👥 Starting to insert sample users...');
  
  for (const user of sampleUsers) {
    try {
      await docClient.send(new PutCommand({
        TableName: 'TrickShare-Users',
        Item: user
      }));
      console.log(`✅ Inserted user: ${user.email}`);
    } catch (error) {
      console.error(`❌ Failed to insert user: ${user.email}`, error.message);
    }
  }
}

async function checkExistingData() {
  try {
    const tricksResult = await docClient.send(new ScanCommand({
      TableName: 'TrickShare-Tricks',
      Select: 'COUNT'
    }));
    
    const usersResult = await docClient.send(new ScanCommand({
      TableName: 'TrickShare-Users',
      Select: 'COUNT'
    }));
    
    console.log(`📊 Current data: ${tricksResult.Count} tricks, ${usersResult.Count} users`);
    return { tricks: tricksResult.Count, users: usersResult.Count };
  } catch (error) {
    console.error('❌ Error checking existing data:', error.message);
    return { tricks: 0, users: 0 };
  }
}

async function main() {
  console.log('🔧 TrickShare Database Setup');
  console.log('============================');
  
  // Check existing data
  const existing = await checkExistingData();
  
  // Insert tricks
  await insertTricks();
  
  // Insert users
  await insertUsers();
  
  // Final check
  console.log('\n📈 Final status:');
  await checkExistingData();
  
  console.log('\n🎉 Database setup complete!');
  console.log('Your TrickShare app now has real data from DynamoDB.');
}

// Run the script
main().catch(console.error);
