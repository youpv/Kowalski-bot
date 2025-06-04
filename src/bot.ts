import { TwitterService } from './twitter';
import { GeminiService } from './gemini';
import { BotConfig } from './types';

export class KowalskiBot {
  private twitterService: TwitterService;
  private geminiService: GeminiService;
  private config: BotConfig;
  private isRunning: boolean = false;

  constructor(config: BotConfig) {
    this.config = config;
    this.twitterService = new TwitterService(config);
    this.geminiService = new GeminiService(config.geminiApiKey);
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    console.log('🐧 Kowalski Bot is starting up...');
    console.log(`Monitoring mentions of @${this.config.botUsername}`);
    console.log(`Check interval: ${this.config.checkIntervalMinutes} minutes`);
    
    // Start the monitoring loop
    this.monitorMentions();
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    console.log('🐧 Kowalski Bot is shutting down...');
  }

  private async monitorMentions(): Promise<void> {
    while (this.isRunning) {
      try {
        await this.processMentions();
      } catch (error) {
        console.error('Error in monitoring loop:', error);
      }

      // Wait for the specified interval before checking again
      await this.sleep(this.config.checkIntervalMinutes * 60 * 1000);
    }
  }

  private async processMentions(): Promise<void> {
    try {
      const mentions = await this.twitterService.checkForMentions(this.config.botUsername);
      
      if (mentions.length === 0) {
        console.log('No new mentions found');
        return;
      }

      console.log(`Found ${mentions.length} new mentions to process`);

      for (const mention of mentions) {
        await this.processSingleMention(mention);
        // Small delay between processing mentions to avoid rate limits
        await this.sleep(1000);
      }
    } catch (error) {
      console.error('Error processing mentions:', error);
    }
  }

  private async processSingleMention(mention: any): Promise<void> {
    try {
      console.log(`Processing mention from tweet ID: ${mention.id}`);

      // Build context for analysis
      const context = await this.twitterService.buildAnalysisContext(mention);
      if (!context) {
        console.log('Could not build context for mention, skipping');
        return;
      }

      console.log(`Analyzing tweet for @${context.username}: "${context.originalTweet}"`);

      // Generate Kowalski's analysis
      const kowalskiResponse = await this.geminiService.generateKowalskiAnalysis(context);
      
      console.log(`Generated analysis: "${kowalskiResponse.analysis}"`);
      console.log(`Confidence level: ${kowalskiResponse.confidence}`);

      // Reply to the tweet
      const success = await this.twitterService.replyToTweet(
        mention.id,
        kowalskiResponse.analysis,
        context.username
      );

      if (success) {
        console.log(`✅ Successfully replied to @${context.username}`);
      } else {
        console.log(`❌ Failed to reply to @${context.username}`);
      }

    } catch (error) {
      console.error('Error processing single mention:', error);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Health check method
  async healthCheck(): Promise<{ status: string; isRunning: boolean; timestamp: number }> {
    return {
      status: 'ok',
      isRunning: this.isRunning,
      timestamp: Date.now(),
    };
  }
} 