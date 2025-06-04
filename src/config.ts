import dotenv from 'dotenv';
import { BotConfig } from './types';

dotenv.config();

function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config: BotConfig = {
  twitterApiKey: getRequiredEnvVar('TWITTER_API_KEY'),
  twitterApiSecret: getRequiredEnvVar('TWITTER_API_SECRET'),
  twitterAccessToken: getRequiredEnvVar('TWITTER_ACCESS_TOKEN'),
  twitterAccessTokenSecret: getRequiredEnvVar('TWITTER_ACCESS_TOKEN_SECRET'),
  geminiApiKey: getRequiredEnvVar('GEMINI_API_KEY'),
  botUsername: getRequiredEnvVar('BOT_USERNAME'),
  checkIntervalMinutes: parseInt(process.env.CHECK_INTERVAL_MINUTES || '2', 10),
};

export const serverConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
}; 