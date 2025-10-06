const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);

const interestingTricks = [
  {
    title: 'Banana Ripening Control',
    description: 'Control banana ripening speed using this simple storage trick',
    steps: ['Separate bananas from the bunch', 'Wrap stems in plastic wrap', 'Store ripe bananas in fridge to slow ripening', 'Keep unripe ones at room temperature with apples to speed up'],
    country: 'BR',
    countryCode: 'BR',
    difficulty: 'easy',
    tags: ['food', 'storage', 'fruit'],
    authorName: 'carlos.travel@example.com',
    authorEmail: 'carlos.travel@example.com',
    kudos: 42,
    views: 234,
    comments: 7
  },
  {
    title: 'WiFi Password QR Code',
    description: 'Create a QR code for your WiFi so guests can connect instantly',
    steps: ['Go to qifi.org or similar QR generator', 'Enter your WiFi name and password', 'Generate and print the QR code', 'Frame it and place near your entrance'],
    country: 'JP',
    countryCode: 'JP',
    difficulty: 'easy',
    tags: ['technology', 'wifi', 'guests', 'qr-code'],
    authorName: 'david.tech@example.com',
    authorEmail: 'david.tech@example.com',
    kudos: 67,
    views: 412,
    comments: 15
  },
  {
    title: 'Frozen Grapes Ice Cubes',
    description: 'Use frozen grapes as ice cubes that won\'t water down your drinks',
    steps: ['Wash and dry grapes thoroughly', 'Remove from stems and freeze on a tray', 'Store in freezer bags once frozen', 'Use in wine, cocktails, or any cold drink'],
    country: 'FR',
    countryCode: 'FR',
    difficulty: 'easy',
    tags: ['drinks', 'party', 'wine', 'entertaining'],
    authorName: 'sarah.chef@example.com',
    authorEmail: 'sarah.chef@example.com',
    kudos: 55,
    views: 298,
    comments: 11
  },
  {
    title: 'Rubber Band Phone Stand',
    description: 'Create an instant phone stand using just rubber bands and a book',
    steps: ['Take a thick book or notebook', 'Wrap 2-3 rubber bands around it vertically', 'Slide your phone between the rubber bands and book cover', 'Adjust angle by changing rubber band position'],
    country: 'IN',
    countryCode: 'IN',
    difficulty: 'easy',
    tags: ['diy', 'phone', 'office', 'productivity'],
    authorName: 'emma.diy@example.com',
    authorEmail: 'emma.diy@example.com',
    kudos: 38,
    views: 187,
    comments: 6
  },
  {
    title: 'Envelope Budgeting Method',
    description: 'Control spending with physical cash envelopes for each budget category',
    steps: ['Calculate monthly budget for each category (groceries, entertainment, etc.)', 'Label envelopes for each category', 'Put allocated cash in each envelope at month start', 'Only spend from the designated envelope', 'When envelope is empty, you\'re done spending in that category'],
    country: 'US',
    countryCode: 'US',
    difficulty: 'medium',
    tags: ['finance', 'budgeting', 'money', 'savings'],
    authorName: 'james.finance@example.com',
    authorEmail: 'james.finance@example.com',
    kudos: 73,
    views: 456,
    comments: 18
  },
  {
    title: 'Shower Steam Face Treatment',
    description: 'Turn your shower into a spa with this simple skincare trick',
    steps: ['Start your shower on hot to create steam', 'Apply a face mask before getting in', 'Let the steam open your pores for 5-10 minutes', 'Rinse off mask with lukewarm water', 'Follow with cold water to close pores'],
    country: 'KR',
    countryCode: 'KR',
    difficulty: 'easy',
    tags: ['skincare', 'beauty', 'spa', 'self-care'],
    authorName: 'lisa.wellness@example.com',
    authorEmail: 'lisa.wellness@example.com',
    kudos: 49,
    views: 267,
    comments: 9
  },
  {
    title: 'Dryer Sheet Shoe Deodorizer',
    description: 'Keep shoes fresh overnight with this simple trick',
    steps: ['Take used dryer sheets (they still work!)', 'Place one sheet in each shoe before bed', 'Leave overnight', 'Remove in morning for fresh-smelling shoes'],
    country: 'SE',
    countryCode: 'SE',
    difficulty: 'easy',
    tags: ['shoes', 'cleaning', 'odor', 'laundry'],
    authorName: 'anna.lifehacks@example.com',
    authorEmail: 'anna.lifehacks@example.com',
    kudos: 34,
    views: 156,
    comments: 5
  },
  {
    title: 'Airplane Mode Battery Boost',
    description: 'Charge your phone 2x faster with this simple setting change',
    steps: ['Turn on airplane mode before plugging in charger', 'Your phone stops searching for signals and using background apps', 'Charging speed increases significantly', 'Turn off airplane mode when fully charged'],
    country: 'SG',
    countryCode: 'SG',
    difficulty: 'easy',
    tags: ['phone', 'battery', 'charging', 'travel'],
    authorName: 'david.tech@example.com',
    authorEmail: 'david.tech@example.com',
    kudos: 61,
    views: 389,
    comments: 12
  },
  {
    title: 'Bread Clip Cable Labels',
    description: 'Organize cables using bread clips as free cable labels',
    steps: ['Save bread clips instead of throwing them away', 'Write on them with permanent marker (USB, HDMI, etc.)', 'Clip them onto the corresponding cables', 'Never confuse cables again!'],
    country: 'NL',
    countryCode: 'NL',
    difficulty: 'easy',
    tags: ['organization', 'cables', 'office', 'recycling'],
    authorName: 'emma.diy@example.com',
    authorEmail: 'emma.diy@example.com',
    kudos: 45,
    views: 203,
    comments: 8
  },
  {
    title: 'Pomodoro Technique with Music',
    description: 'Boost productivity by combining Pomodoro with specific music playlists',
    steps: ['Create 25-minute focus playlists (instrumental/ambient)', 'Create 5-minute break playlists (upbeat)', 'Start focus playlist and work until it ends', 'Take break when break playlist plays', 'Repeat 4 cycles, then take longer break'],
    country: 'IT',
    countryCode: 'IT',
    difficulty: 'medium',
    tags: ['productivity', 'focus', 'music', 'time-management'],
    authorName: 'mike.productivity@example.com',
    authorEmail: 'mike.productivity@example.com',
    kudos: 58,
    views: 334,
    comments: 14
  },
  {
    title: 'Hotel Room Security Check',
    description: 'Quick security check routine for any hotel room',
    steps: ['Check door locks and deadbolt work properly', 'Look for hidden cameras (check smoke detectors, mirrors)', 'Test balcony door locks if applicable', 'Locate emergency exits', 'Use door wedge or portable lock for extra security'],
    country: 'AU',
    countryCode: 'AU',
    difficulty: 'medium',
    tags: ['travel', 'safety', 'security', 'hotel'],
    authorName: 'carlos.travel@example.com',
    authorEmail: 'carlos.travel@example.com',
    kudos: 52,
    views: 278,
    comments: 10
  },
  {
    title: 'Microwave Lemon Juice Hack',
    description: 'Get 3x more juice from lemons with this 30-second trick',
    steps: ['Roll lemon on counter while pressing down', 'Microwave for 20-30 seconds', 'Let cool for 1 minute', 'Cut and squeeze - you\'ll get much more juice!'],
    country: 'MX',
    countryCode: 'MX',
    difficulty: 'easy',
    tags: ['cooking', 'citrus', 'kitchen', 'microwave'],
    authorName: 'sarah.chef@example.com',
    authorEmail: 'sarah.chef@example.com',
    kudos: 41,
    views: 219,
    comments: 7
  }
];

async function addInterestingTricks() {
  console.log('🚀 Adding more interesting tricks...\n');
  
  for (const trick of interestingTricks) {
    try {
      const trickData = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...trick,
        status: 'approved',
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 14).toISOString() // Random date within last 2 weeks
      };
      
      await docClient.send(new PutCommand({
        TableName: 'TrickShare-Tricks',
        Item: trickData
      }));
      
      console.log(`✅ Added: ${trick.title} (${trick.country})`);
    } catch (error) {
      console.log(`❌ Failed to add ${trick.title}:`, error.message);
    }
  }
  
  console.log(`\n🎉 Added ${interestingTricks.length} more interesting tricks!`);
  console.log('Your platform now has diverse content from around the world:');
  console.log('🍌 Food & Kitchen hacks');
  console.log('📱 Technology & Phone tricks');
  console.log('💰 Finance & Money management');
  console.log('✈️ Travel & Safety tips');
  console.log('🧘 Wellness & Self-care');
  console.log('🔧 DIY & Organization');
  console.log('⚡ Productivity & Focus');
  console.log('\nCountries represented: BR, JP, FR, IN, KR, SE, SG, NL, IT, AU, MX');
}

addInterestingTricks().catch(console.error);
