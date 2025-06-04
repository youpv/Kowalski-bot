import { TwitterApi, TweetV2, UserV2 } from 'twitter-api-v2';
import { BotConfig, TwitterMention, AnalysisContext, TwitterMedia } from './types';

export class TwitterService {
  private client: TwitterApi;
  private lastProcessedTweetId: string | null = null;
  private lastSearchTime: number = 0;
  private minSearchInterval: number = 60000; // 1 minute minimum between searches

  constructor(config: BotConfig) {
    this.client = new TwitterApi({
      appKey: config.twitterApiKey,
      appSecret: config.twitterApiSecret,
      accessToken: config.twitterAccessToken,
      accessSecret: config.twitterAccessTokenSecret,
    });
  }

  async checkForMentions(botUsername: string): Promise<TwitterMention[]> {
    // Check if we should skip this search due to rate limiting
    const now = Date.now();
    const timeSinceLastSearch = now - this.lastSearchTime;
    
    if (timeSinceLastSearch < this.minSearchInterval) {
      const waitTime = this.minSearchInterval - timeSinceLastSearch;
      console.log(`⏰ Skipping search, last search was ${Math.round(timeSinceLastSearch/1000)}s ago. Waiting ${Math.round(waitTime/1000)}s more.`);
      return [];
    }
    
    this.lastSearchTime = now;

    try {
      // Search for any mentions of the bot (removed the strict "analysis" requirement)
      const mentions = await this.searchWithRateLimit(`@${botUsername}`, {
        'tweet.fields': ['created_at', 'conversation_id', 'in_reply_to_user_id', 'referenced_tweets', 'attachments'],
        'user.fields': ['username'],
        'media.fields': ['type', 'url', 'preview_image_url', 'width', 'height'],
        expansions: ['author_id', 'attachments.media_keys'],
        max_results: 10,
        since_id: this.lastProcessedTweetId || undefined,
      });

      const mentionTweets: TwitterMention[] = [];
      
      if (mentions.data && Array.isArray(mentions.data)) {
        for (const tweet of mentions.data) {
          // Check if this is actually a mention requesting analysis
          if (this.isAnalysisRequest(tweet.text, botUsername)) {
            mentionTweets.push({
              id: tweet.id,
              text: tweet.text,
              author_id: tweet.author_id!,
              conversation_id: tweet.conversation_id!,
              in_reply_to_user_id: tweet.in_reply_to_user_id,
              referenced_tweets: tweet.referenced_tweets,
              created_at: tweet.created_at!,
              attachments: tweet.attachments,
            });
          }
        }

        // Update the last processed tweet ID
        if (mentions.data.length > 0) {
          this.lastProcessedTweetId = mentions.data[0].id;
        }
      }

      return mentionTweets;
    } catch (error) {
      console.error('Error checking for mentions:', error);
      return [];
    }
  }

  private async searchWithRateLimit(query: string, params: any, retries = 3): Promise<any> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await this.client.v2.search(query, params);
        console.log('✅ Twitter API search successful');
        return result;
      } catch (error: any) {
        if (error.code === 429) {
          // Rate limit hit
          const resetTime = error.rateLimit?.reset || Date.now() / 1000 + 900; // Default 15 min
          const waitTime = Math.max(0, resetTime - Date.now() / 1000);
          
          console.log(`⏳ Rate limit hit. Reset time: ${new Date(resetTime * 1000).toISOString()}`);
          console.log(`⏰ Wait time: ${Math.round(waitTime / 60)} minutes`);
          
          if (attempt === retries) {
            console.log('🚫 Final retry attempt failed due to rate limits');
            // Return empty result instead of crashing
            return { data: [] };
          }
          
          // Exponential backoff: wait longer on each retry
          const backoffTime = Math.min(waitTime, 300) * attempt; // Max 5 min per attempt
          console.log(`🔄 Retrying in ${Math.round(backoffTime)} seconds (attempt ${attempt}/${retries})`);
          
          await this.sleep(backoffTime * 1000);
        } else {
          // Non-rate-limit error, throw immediately
          throw error;
        }
      }
    }
    
    // This shouldn't be reached, but just in case
    return { data: [] };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getOriginalTweet(mention: TwitterMention): Promise<{ text: string; media?: TwitterMedia[] }> {
    try {
      // If this is a reply, get the original tweet from the conversation
      if (mention.conversation_id && mention.conversation_id !== mention.id) {
        const originalTweet = await this.client.v2.singleTweet(mention.conversation_id, {
          'tweet.fields': ['text', 'attachments'],
          'media.fields': ['type', 'url', 'preview_image_url', 'width', 'height'],
          expansions: ['attachments.media_keys'],
        });
        
        const media = this.extractMediaFromResponse(originalTweet);
        return {
          text: originalTweet.data.text,
          media
        };
      }
      
      // If there are referenced tweets, try to get the quoted/replied tweet
      if (mention.referenced_tweets && mention.referenced_tweets.length > 0) {
        const referencedTweet = mention.referenced_tweets[0];
        if (referencedTweet.type === 'replied_to' || referencedTweet.type === 'quoted') {
          const tweet = await this.client.v2.singleTweet(referencedTweet.id, {
            'tweet.fields': ['text', 'attachments'],
            'media.fields': ['type', 'url', 'preview_image_url', 'width', 'height'],
            expansions: ['attachments.media_keys'],
          });
          
          const media = this.extractMediaFromResponse(tweet);
          return {
            text: tweet.data.text,
            media
          };
        }
      }
      
      // Fallback to the mention text itself (check if mention has media)
      return {
        text: mention.text,
        media: undefined // Mentions themselves rarely have media we want to analyze
      };
    } catch (error) {
      console.error('Error getting original tweet:', error);
      return { text: mention.text };
    }
  }

  private extractMediaFromResponse(tweetResponse: any): TwitterMedia[] | undefined {
    const media: TwitterMedia[] = [];
    
    if (tweetResponse.includes?.media) {
      for (const mediaItem of tweetResponse.includes.media) {
        // Only include photos for analysis (videos and gifs are more complex)
        if (mediaItem.type === 'photo' && mediaItem.url) {
          media.push({
            media_key: mediaItem.media_key,
            type: mediaItem.type,
            url: mediaItem.url,
            preview_image_url: mediaItem.preview_image_url,
            width: mediaItem.width,
            height: mediaItem.height,
          });
        }
      }
    }
    
    return media.length > 0 ? media : undefined;
  }

  async getUserInfo(userId: string): Promise<{ username: string; name: string } | null> {
    try {
      const user = await this.client.v2.user(userId, {
        'user.fields': ['username', 'name'],
      });
      
      return {
        username: user.data.username,
        name: user.data.name,
      };
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  }

  async replyToTweet(tweetId: string, message: string, username: string): Promise<boolean> {
    try {
      const replyText = `@${username} ${message}`;
      
      await this.client.v2.tweet({
        text: replyText,
        reply: {
          in_reply_to_tweet_id: tweetId,
        },
      });
      
      console.log(`Successfully replied to tweet ${tweetId}`);
      return true;
    } catch (error) {
      console.error('Error replying to tweet:', error);
      return false;
    }
  }

  async buildAnalysisContext(mention: TwitterMention): Promise<AnalysisContext | null> {
    try {
      const [originalTweetData, userInfo] = await Promise.all([
        this.getOriginalTweet(mention),
        this.getUserInfo(mention.author_id),
      ]);

      if (!userInfo) {
        return null;
      }

      return {
        originalTweet: originalTweetData.text,
        mentionText: mention.text,
        username: userInfo.username,
        media: originalTweetData.media,
      };
    } catch (error) {
      console.error('Error building analysis context:', error);
      return null;
    }
  }

  private isAnalysisRequest(text: string, botUsername: string): boolean {
    const lowerText = text.toLowerCase();
    const lowerBotUsername = botUsername.toLowerCase();
    
    // Must contain the bot mention
    if (!lowerText.includes(`@${lowerBotUsername}`)) {
      return false;
    }
    
    // Check for various analysis trigger words/phrases
    const analysisTriggers = [
      'analysis',
      'analyze',
      'what do you think',
      'thoughts',
      'opinion',
      'assessment',
      'evaluate',
      'kowalski,',
      'break it down',
      'explain',
      'tactical'
    ];
    
    return analysisTriggers.some(trigger => lowerText.includes(trigger));
  }
} 