const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);

async function indexDatabase() {
  console.log('🔍 TRICKSHARE DATABASE INDEX\n');
  console.log('=' .repeat(50));

  try {
    // Index Tricks Table
    console.log('\n📝 TRICKS TABLE (TrickShare-Tricks)');
    console.log('-'.repeat(30));
    
    const tricksCommand = new ScanCommand({
      TableName: 'TrickShare-Tricks'
    });
    
    const tricksResult = await docClient.send(tricksCommand);
    const tricks = tricksResult.Items || [];
    
    console.log(`Total Tricks: ${tricks.length}`);
    
    // Group by country
    const tricksByCountry = {};
    let totalViews = 0;
    let totalKudos = 0;
    let totalComments = 0;
    
    tricks.forEach(trick => {
      const country = trick.countryCode || 'Unknown';
      if (!tricksByCountry[country]) {
        tricksByCountry[country] = [];
      }
      tricksByCountry[country].push(trick);
      totalViews += trick.views || 0;
      totalKudos += trick.kudos || 0;
      totalComments += trick.comments || 0;
    });
    
    console.log('\nTricks by Country:');
    Object.entries(tricksByCountry).forEach(([country, countryTricks]) => {
      console.log(`  ${country}: ${countryTricks.length} tricks`);
    });
    
    console.log(`\nEngagement Stats:`);
    console.log(`  Total Views: ${totalViews.toLocaleString()}`);
    console.log(`  Total Kudos: ${totalKudos.toLocaleString()}`);
    console.log(`  Total Comments: ${totalComments.toLocaleString()}`);
    
    // Show top tricks
    const topTricks = tricks
      .sort((a, b) => (b.kudos || 0) - (a.kudos || 0))
      .slice(0, 5);
    
    console.log('\nTop 5 Tricks by Kudos:');
    topTricks.forEach((trick, index) => {
      console.log(`  ${index + 1}. "${trick.title}" - ${trick.kudos} kudos (${trick.countryCode})`);
    });

    // Index Users Table
    console.log('\n👥 USERS TABLE (TrickShare-Users)');
    console.log('-'.repeat(30));
    
    const usersCommand = new ScanCommand({
      TableName: 'TrickShare-Users'
    });
    
    const usersResult = await docClient.send(usersCommand);
    const users = usersResult.Items || [];
    
    console.log(`Total Users: ${users.length}`);
    
    if (users.length > 0) {
      const totalScore = users.reduce((sum, user) => sum + (user.score || 0), 0);
      const totalTricksSubmitted = users.reduce((sum, user) => sum + (user.tricksSubmitted || 0), 0);
      const totalKudosReceived = users.reduce((sum, user) => sum + (user.kudosReceived || 0), 0);
      
      console.log(`\nUser Stats:`);
      console.log(`  Total Score: ${totalScore.toLocaleString()}`);
      console.log(`  Total Tricks Submitted: ${totalTricksSubmitted}`);
      console.log(`  Total Kudos Received: ${totalKudosReceived}`);
      console.log(`  Average Score: ${Math.round(totalScore / users.length)}`);
      
      // Top users
      const topUsers = users
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 5);
      
      console.log('\nTop 5 Users by Score:');
      topUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.email} - ${user.score} points`);
      });
    }

    // Index Comments Table
    console.log('\n💬 COMMENTS TABLE (TrickShare-Comments)');
    console.log('-'.repeat(30));
    
    try {
      const commentsCommand = new ScanCommand({
        TableName: 'TrickShare-Comments'
      });
      
      const commentsResult = await docClient.send(commentsCommand);
      const comments = commentsResult.Items || [];
      
      console.log(`Total Comments: ${comments.length}`);
      
      if (comments.length > 0) {
        // Group by trick
        const commentsByTrick = {};
        comments.forEach(comment => {
          const trickId = comment.trickId;
          if (!commentsByTrick[trickId]) {
            commentsByTrick[trickId] = [];
          }
          commentsByTrick[trickId].push(comment);
        });
        
        console.log(`Comments distributed across ${Object.keys(commentsByTrick).length} tricks`);
        
        // Most commented tricks
        const mostCommented = Object.entries(commentsByTrick)
          .sort(([,a], [,b]) => b.length - a.length)
          .slice(0, 3);
        
        console.log('\nMost Commented Tricks:');
        mostCommented.forEach(([trickId, trickComments], index) => {
          const trick = tricks.find(t => t.id === trickId);
          const title = trick ? trick.title : 'Unknown Trick';
          console.log(`  ${index + 1}. "${title}" - ${trickComments.length} comments`);
        });
      }
    } catch (error) {
      console.log('Comments table not found or empty');
    }

    // Summary
    console.log('\n📊 DATABASE SUMMARY');
    console.log('='.repeat(30));
    console.log(`🎯 ${tricks.length} tricks from ${Object.keys(tricksByCountry).length} countries`);
    console.log(`👥 ${users.length} active users`);
    console.log(`💬 ${comments?.length || 0} comments`);
    console.log(`👁️ ${totalViews.toLocaleString()} total views`);
    console.log(`👍 ${totalKudos.toLocaleString()} total kudos`);
    
    const avgKudosPerTrick = tricks.length > 0 ? Math.round(totalKudos / tricks.length) : 0;
    const avgViewsPerTrick = tricks.length > 0 ? Math.round(totalViews / tricks.length) : 0;
    
    console.log(`\n📈 ENGAGEMENT METRICS:`);
    console.log(`Average kudos per trick: ${avgKudosPerTrick}`);
    console.log(`Average views per trick: ${avgViewsPerTrick}`);
    
  } catch (error) {
    console.error('Error indexing database:', error);
  }
}

// Run the indexing
indexDatabase();
