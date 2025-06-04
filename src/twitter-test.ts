import { TwitterApi } from 'twitter-api-v2';
import { config } from './config';

async function testTwitterConnection() {
  console.log('🐧 Testing Twitter API connection for @AskKowalski...\n');

  try {
    // Initialize Twitter client
    const client = new TwitterApi({
      appKey: config.twitterApiKey,
      appSecret: config.twitterApiSecret,
      accessToken: config.twitterAccessToken,
      accessSecret: config.twitterAccessTokenSecret,
    });

    console.log('✅ Twitter client initialized');

    // Test 1: Verify credentials by getting bot account info
    console.log('📋 Testing credentials...');
    const me = await client.v2.me();
    console.log(`✅ Authenticated as: @${me.data.username} (${me.data.name})`);
    
    if (me.data.username.toLowerCase() !== config.botUsername.toLowerCase()) {
      console.log(`⚠️  Warning: Authenticated user (${me.data.username}) doesn't match BOT_USERNAME (${config.botUsername})`);
    }

    // Test 2: Post a test tweet
    console.log('\n🐧 Posting test tweet...');
    const testTweet = await client.v2.tweet({
      text: "🐧 Analysis systems online! Testing communication protocols... All systems nominal, soldier! #TestTweet"
    });
    
    console.log(`✅ Test tweet posted! ID: ${testTweet.data.id}`);
    console.log(`🔗 View at: https://twitter.com/${me.data.username}/status/${testTweet.data.id}`);

    // Test 3: Search for mentions (this is what the bot will do)
    console.log('\n🔍 Testing mention search...');
    const mentions = await client.v2.search(`@${config.botUsername}`, {
      max_results: 10,
      'tweet.fields': ['created_at', 'author_id'],
    });
    
    const mentionCount = mentions.data && Array.isArray(mentions.data) ? mentions.data.length : 0;
    console.log(`✅ Found ${mentionCount} recent mentions of @${config.botUsername}`);

    // Test 4: Clean up - delete the test tweet
    console.log('\n🧹 Cleaning up test tweet...');
    await client.v2.deleteTweet(testTweet.data.id);
    console.log('✅ Test tweet deleted');

    console.log('\n🎉 All tests passed! Your bot is ready to deploy!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run build');
    console.log('2. Run: npm start');
    console.log('3. Try mentioning @AskKowalski with "Kowalski, analysis"');

  } catch (error: any) {
    console.error('\n❌ Test failed:', error);
    
    if (error?.code === 401) {
      console.log('\n🔧 Troubleshooting tips:');
      console.log('- Check your API keys are correct');
      console.log('- Ensure access tokens are for @AskKowalski account');
      console.log('- Verify app has Read & Write permissions');
    }
  }
}

// Run the test
testTwitterConnection(); 