import { TwitterApi, TweetV2, UserV2 } from 'twitter-api-v2';
import { BotConfig, TwitterMention, AnalysisContext } from './types';

export class TwitterService {
  private client: TwitterApi;
  private lastProcessedTweetId: string | null = null;

  constructor(config: BotConfig) {
    this.client = new TwitterApi({
      appKey: config.twitterApiKey,
      appSecret: config.twitterApiSecret,
      accessToken: config.twitterAccessToken,
      accessSecret: config.twitterAccessTokenSecret,
    });
  }

  async checkForMentions(botUsername: string): Promise<TwitterMention[]> {
    try {
      // Search for any mentions of the bot (removed the strict "analysis" requirement)
      const mentions = await this.client.v2.search(`@${botUsername}`, {
        'tweet.fields': ['created_at', 'conversation_id', 'in_reply_to_user_id', 'referenced_tweets'],
        'user.fields': ['username'],
        expansions: ['author_id'],
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

  async getOriginalTweet(mention: TwitterMention): Promise<string> {
    try {
      // If this is a reply, get the original tweet from the conversation
      if (mention.conversation_id && mention.conversation_id !== mention.id) {
        const originalTweet = await this.client.v2.singleTweet(mention.conversation_id, {
          'tweet.fields': ['text'],
        });
        return originalTweet.data.text;
      }
      
      // If there are referenced tweets, try to get the quoted/replied tweet
      if (mention.referenced_tweets && mention.referenced_tweets.length > 0) {
        const referencedTweet = mention.referenced_tweets[0];
        if (referencedTweet.type === 'replied_to' || referencedTweet.type === 'quoted') {
          const tweet = await this.client.v2.singleTweet(referencedTweet.id, {
            'tweet.fields': ['text'],
          });
          return tweet.data.text;
        }
      }
      
      // Fallback to the mention text itself
      return mention.text;
    } catch (error) {
      console.error('Error getting original tweet:', error);
      return mention.text;
    }
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
      const [originalTweet, userInfo] = await Promise.all([
        this.getOriginalTweet(mention),
        this.getUserInfo(mention.author_id),
      ]);

      if (!userInfo) {
        return null;
      }

      return {
        originalTweet,
        mentionText: mention.text,
        username: userInfo.username,
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