import { TwitterService } from './twitter';
import { GeminiService } from './gemini';
import { config } from './config';

async function runBotOnce(): Promise<void> {
  console.log('🐧 Kowalski Analysis Bot - Single Run Mode');
  console.log(`Checking for mentions of @${config.botUsername}...`);

  try {
    const twitterService = new TwitterService(config);
    const geminiService = new GeminiService(config.geminiApiKey);

    // Check for new mentions
    const mentions = await twitterService.checkForMentions(config.botUsername);

    if (mentions.length === 0) {
      console.log('✅ No new mentions found - all clear, soldier!');
      return;
    }

    console.log(`🎯 Found ${mentions.length} mention(s) to analyze!`);

    // Process each mention
    for (const mention of mentions) {
      try {
        console.log(`\n📝 Processing mention ID: ${mention.id}`);
        
        // Build context for analysis
        const context = await twitterService.buildAnalysisContext(mention);
        if (!context) {
          console.log('⚠️  Could not build context for mention, skipping');
          continue;
        }

        console.log(`👤 Request from @${context.username}`);
        console.log(`📄 Original tweet: "${context.originalTweet}"`);

        // Generate Kowalski's analysis
        const response = await geminiService.generateKowalskiAnalysis(context);
        console.log(`🧠 Generated analysis: "${response.analysis}"`);

        // Reply to the tweet
        const success = await twitterService.replyToTweet(
          mention.id,
          response.analysis,
          context.username
        );

        if (success) {
          console.log(`✅ Successfully replied to @${context.username}`);
        } else {
          console.log(`❌ Failed to reply to @${context.username}`);
        }

        // Small delay between replies to be nice to the API
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`❌ Error processing mention ${mention.id}:`, error);
      }
    }

    console.log('\n🎉 Mission complete! All mentions processed.');

  } catch (error) {
    console.error('❌ Bot run failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  runBotOnce();
}

export { runBotOnce }; 