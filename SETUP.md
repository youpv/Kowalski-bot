# 🚀 Quick Setup Guide

Get your Kowalski Analysis Bot running in minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Twitter Developer Account
- [ ] Google AI Studio Account

## 1. API Keys Setup

### Twitter API (Required)
1. Visit [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new project and app
3. Set permissions to **Read and Write**
4. Generate your keys:
   - API Key
   - API Secret Key
   - Access Token  
   - Access Token Secret

### Google Gemini API (Required)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key

## 2. Bot Account Setup

1. Create a new Twitter account for your bot
2. Set a clear profile bio mentioning it's a bot
3. Add a profile picture (penguin recommended! 🐧)
4. Note the username (without @)

## 3. Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

## 4. Configuration

Edit `.env` file:

```env
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret_here
GEMINI_API_KEY=your_gemini_key_here
BOT_USERNAME=your_bot_username_without_@
```

## 5. Test & Run

```bash
# Test the AI responses (mock mode)
npm test

# Build the project
npm run build

# Start the bot
npm start
```

## 6. Verify It's Working

1. Visit `http://localhost:3000/health` - should show bot status
2. Create a test tweet
3. Reply with: `@YourBotUsername Kowalski, analysis`
4. Wait for the response!

## Common Issues

**Bot not responding?**
- Check logs in terminal
- Verify API keys are correct
- Ensure bot username matches .env file
- Check Twitter API quota

**Build errors?**
- Run `npm install` again
- Check Node.js version (needs 18+)

**Permission errors?**
- Verify Twitter app has Read & Write permissions
- Regenerate access tokens after permission change

## Next Steps

- Monitor the bot logs for mentions
- Adjust `CHECK_INTERVAL_MINUTES` for different polling rates
- Deploy to cloud for 24/7 operation
- Customize Kowalski's personality in `src/gemini.ts`

---

Need help? Check the full README.md for detailed documentation! 