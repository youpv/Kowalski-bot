# 🐧 Kowalski Analysis Bot

A Twitter bot that responds as Kowalski from Madagascar when people request analysis! When someone mentions the bot with "Kowalski, analysis", it provides humorous yet insightful responses using AI.

## Features

- 🐧 **Authentic Kowalski Personality**: Responds with military precision and intellectual curiosity
- 🤖 **AI-Powered Analysis**: Uses Google's Gemini AI for cost-effective responses
- 🖼️ **Image Analysis**: Analyzes photos, charts, screenshots, and visual content!
- 📊 **Context-Aware**: Analyzes the original tweet being replied to (text + images)
- ⚡ **Real-time Monitoring**: Continuously monitors for mentions via GitHub Actions
- 🛡️ **Rate Limit Handling**: Built-in protections for Twitter API limits
- 🚀 **Serverless Deployment**: Runs completely free on GitHub Actions

## How It Works

1. Someone mentions your bot with various trigger phrases (see examples below)
2. GitHub Actions runs the bot every 5 minutes
3. Bot detects the mention and gets context from the original tweet
4. **NEW**: Downloads and analyzes any images in the tweet
5. Generates a Kowalski-style analysis using Gemini AI (with vision!)
6. Replies with military precision and humor!

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed (for local testing)
- GitHub account
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

### 4. Fork & Clone

```bash
# Fork this repository on GitHub
# Then clone your fork
git clone https://github.com/yourusername/TwitterBot.git
cd TwitterBot

# Install dependencies (for local testing)
npm install
```

### 5. GitHub Secrets Configuration

In your GitHub repository:

1. **Go to Settings → Secrets and variables → Actions**
2. **Add these Repository Secrets**:
   ```
   TWITTER_API_KEY=your_twitter_api_key
   TWITTER_API_SECRET=your_twitter_api_secret
   TWITTER_ACCESS_TOKEN=your_access_token
   TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret
   GEMINI_API_KEY=your_gemini_api_key
   BOT_USERNAME=your_bot_username_without_@
   ```

### 6. Deploy

```bash
# Push to your GitHub repository
git add .
git commit -m "Configure Kowalski bot"
git push origin main

# GitHub Actions will automatically start running every 5 minutes!
```

## Usage

Once deployed:

1. **Monitor**: Check the Actions tab in your GitHub repo for bot activity
2. **Test**: Try mentioning your bot with any of these trigger phrases:
   - `@AskKowalski analysis`
   - `@AskKowalski what do you think?`
   - `@AskKowalski Kowalski, analysis`
   - `@AskKowalski analyze this`
   - `@AskKowalski tactical assessment`
   - `@AskKowalski thoughts?`
3. **Debug**: View logs in the GitHub Actions runs

To test locally:
1. Create a `.env` file with your credentials
2. Run `npm test` to see mock responses
3. Run `npm run test-twitter` to test API connections

## Example Interactions

**Trigger Options:**
The bot responds to various natural phrases:
- `@AskKowalski analysis` ✅
- `@AskKowalski what do you think?` ✅
- `@AskKowalski Kowalski, analysis` ✅
- `@AskKowalski analyze this achievement` ✅
- `@AskKowalski tactical assessment please` ✅
- `@AskKowalski thoughts on this?` ✅
- `@AskKowalski break it down` ✅

**Example Thread:**

**User tweets**: `"Just deployed my first app! 🚀"` + screenshot

**Someone replies**: `@AskKowalski analysis`

**Bot responds**: `@username Analysis complete! According to my calculations, this deployment exhibits 87% probability of success indicators. Visual reconnaissance confirms clean UI design patterns. Tactical assessment: recommend monitoring protocols and celebration rations, soldier! 🐧`

**Another Example with Images:**

**User tweets**: `"Rate my homemade pizza! 🍕"` + photo

**Someone replies**: `@AskKowalski what do you think?`

**Bot responds**: `@username Visual reconnaissance confirms: exceptional crust formation and optimal cheese distribution patterns detected! My tactical assessment: 98.2% success probability. Mission accomplished, chef! 🐧🍕`

## Bot Personality

Kowalski responds with:
- Military terminology and precision
- Scientific analysis and calculations  
- Humor and Madagascar references
- Genuine insights about the content
- Characteristic phrases like "Analysis complete!" and "According to my calculations..."

## Deployment Details

### GitHub Actions Benefits
- ✅ **100% Free**: 2,000 minutes/month free tier
- ✅ **No server management**: Completely serverless
- ✅ **Automatic scaling**: Handles traffic spikes
- ✅ **Reliable**: GitHub's infrastructure
- ✅ **Easy monitoring**: Built-in logs and notifications
- ✅ **Rate limit handling**: Smart retry logic for Twitter API

### Usage Calculations
- **Runs every 5 minutes** = 288 runs/month (reduced to avoid rate limits)
- **~1-2 minutes per run** = 288-576 minutes/month used
- **Well within GitHub's 2,000 free minutes!**

### Rate Limit Protection
The bot includes smart rate limit handling:
- ⏰ **Automatic retry** with exponential backoff
- 🛡️ **Graceful degradation** when limits are hit
- 📊 **Rate limit monitoring** with detailed logs
- ⚡ **Optimized scheduling** (5-minute intervals)

## Project Structure

```
src/
├── index.ts          # Traditional server mode (for local dev)
├── bot-runner.ts     # Single-run mode (for GitHub Actions)
├── bot.ts            # Core bot orchestration logic
├── twitter.ts        # Twitter API interactions
├── gemini.ts         # Google Gemini AI service
├── config.ts         # Configuration and environment setup
├── types.ts          # TypeScript type definitions
└── test.ts           # Demo functionality

.github/workflows/
└── kowalski-bot.yml  # GitHub Actions workflow
```

## Local Development

For testing and development:

```bash
# Test AI responses (mock mode)
npm test

# Test Twitter API connection
npm run test-twitter

# Run single bot check (like GitHub Actions does)
npm run bot-run

# Run in continuous mode (traditional server)
npm run dev
```

## Monitoring

- **GitHub Actions**: Check the Actions tab for run history
- **Logs**: View detailed logs for each run
- **Manual Trigger**: Use "Run workflow" button for testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm test`
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **Bot not responding**: Check GitHub Actions logs for errors
2. **Authentication errors**: Verify all secrets are correctly set
3. **Permission errors**: Ensure Twitter app has Read & Write permissions
4. **Rate limits**: GitHub Actions includes built-in delays

### Debug Steps

1. Check the **Actions** tab for failed runs
2. Review the **logs** for specific errors
3. Test locally with `npm run test-twitter`
4. Verify all **GitHub Secrets** are correctly set

## License

MIT License - feel free to use and modify as needed!

---

**Made with 🐧 by a fan of Madagascar's finest analyst!** 