export interface BotConfig {
  twitterApiKey: string;
  twitterApiSecret: string;
  twitterAccessToken: string;
  twitterAccessTokenSecret: string;
  geminiApiKey: string;
  botUsername: string;
  checkIntervalMinutes: number;
}

export interface TwitterMedia {
  media_key: string;
  type: 'photo' | 'video' | 'animated_gif';
  url?: string;
  preview_image_url?: string;
  width?: number;
  height?: number;
}

export interface TwitterMention {
  id: string;
  text: string;
  author_id: string;
  conversation_id: string;
  in_reply_to_user_id?: string;
  referenced_tweets?: Array<{
    type: string;
    id: string;
  }>;
  created_at: string;
  attachments?: {
    media_keys?: string[];
  };
}

export interface TwitterUser {
  id: string;
  username: string;
  name: string;
}

export interface AnalysisContext {
  originalTweet: string;
  mentionText: string;
  username: string;
  media?: TwitterMedia[];
}

export interface KowalskiResponse {
  analysis: string;
  confidence: 'high' | 'medium' | 'low';
} 