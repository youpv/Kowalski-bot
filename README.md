# 🐧 Kowalski Analysis Bot

A Twitter bot that responds as Kowalski from Madagascar when people request analysis! When someone mentions the bot with "Kowalski, analysis", it provides humorous yet insightful responses using AI.

## Features

- 🐧 **Authentic Kowalski Personality**: Responds with military precision and intellectual curiosity
- 🤖 **AI-Powered Analysis**: Uses Google's Gemini AI for cost-effective responses
- 📊 **Context-Aware**: Analyzes the original tweet being replied to
- ⚡ **Real-time Monitoring**: Continuously monitors for mentions
- 🛡️ **Rate Limit Handling**: Built-in protections for Twitter API limits
- 📈 **Health Monitoring**: Simple web interface for monitoring bot status

## How It Works

1. Someone tweets: `@YourBot Kowalski, analysis` (as a reply to another tweet)
2. The bot detects the mention
3. Gets context from the original tweet
4. Generates a Kowalski-style analysis using Gemini AI
5. Replies with military precision and humor!

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- Twitter Developer Account
- Google AI Studio Account (for Gemini API)

### 2. Twitter API Setup

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new project and app
3. Generate your API keys:
   - API Key
   - API Secret Key
   - Access Token
   - Access Token Secret
4. Make sure your app has **Read and Write** permissions

### 3. Google Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key for later use

### 4. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd TwitterBot

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### 5. Configuration

Edit the `.env` file with your credentials:

```env
# Twitter API v2 Credentials
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key

# Bot Configuration
BOT_USERNAME=your_bot_username_without_@
CHECK_INTERVAL_MINUTES=2

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 6. Running the Bot

```bash
# Development mode (with auto-restart)
npm run dev

# Production build and run
npm run build
npm start

# Watch mode for development
npm run watch
```

## Usage

Once the bot is running:

1. **Health Check**: Visit `http://localhost:3000/health` to check bot status
2. **Status**: Visit `http://localhost:3000/status` for general information

To test the bot:
1. Create a tweet
2. Reply to that tweet with: `@YourBotUsername Kowalski, analysis`
3. Watch for the bot's response!

## Example Interactions

**User tweets**: `"Just saw the most amazing sunset! 🌅"`

**Someone replies**: `@KowalskiBot Kowalski, analysis`

**Bot responds**: `Analysis complete! According to my calculations, this sunset exhibits optimal chromatic distribution. Tactical assessment: 94% probability of romantic evening success. Recommended action: proceed with date night, soldier! 🐧`

## Bot Personality

Kowalski responds with:
- Military terminology and precision
- Scientific analysis and calculations
- Humor and Madagascar references
- Genuine insights about the content
- Characteristic phrases like "Analysis complete!" and "According to my calculations..."

## API Costs

- **Twitter API v2**: Free tier allows up to 50,000 tweets per month
- **Google Gemini**: Very cost-effective, typically <$0.01 per analysis

## Deployment Options

### Local Development
```bash
npm run dev
```

### Production Server
```bash
npm run build
npm start
```

### Docker (Optional)
```bash
docker build -t kowalski-bot .
docker run -d --env-file .env -p 3000:3000 kowalski-bot
```

### Cloud Deployment
- **Railway**: Easy deployment with git integration
- **Heroku**: Classic platform-as-a-service
- **DigitalOcean App Platform**: Simple containerized deployment
- **Google Cloud Run**: Serverless container deployment

## Project Structure

```
src/
├── index.ts          # Main application entry point
├── bot.ts            # Core bot orchestration logic
├── twitter.ts        # Twitter API interactions
├── gemini.ts         # Google Gemini AI service
├── config.ts         # Configuration and environment setup
└── types.ts          # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use and modify as needed!

## Troubleshooting

### Common Issues

1. **Bot not responding**: Check the logs for API errors and rate limits
2. **Authentication errors**: Verify all API keys are correct
3. **Permission errors**: Ensure Twitter app has Read and Write permissions
4. **Rate limits**: The bot includes built-in delays to handle rate limits

### Debug Mode

Set `NODE_ENV=development` for detailed logging.

## Support

For issues and questions:
1. Check the logs at the console
2. Test API credentials manually
3. Verify bot username is correct
4. Check Twitter API quota usage

---

**Made with 🐧 by a fan of Madagascar's finest analyst!** 