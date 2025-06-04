# 🚀 Quick Setup Guide

Get your Kowalski Analysis Bot running for FREE on GitHub Actions in minutes!

## Prerequisites Checklist

- [ ] GitHub account (free)
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

## 3. Fork & Deploy

### Fork the Repository
1. Go to this repository on GitHub
2. Click **"Fork"** (top right)
3. Fork to your account

### Add GitHub Secrets
1. In **your forked repo**: Settings → Secrets and variables → Actions
2. Click **"New repository secret"** for each:
   ```
   TWITTER_API_KEY → your_api_key_here
   TWITTER_API_SECRET → your_api_secret_here
   TWITTER_ACCESS_TOKEN → your_access_token_here
   TWITTER_ACCESS_TOKEN_SECRET → your_access_token_secret_here
   GEMINI_API_KEY → your_gemini_key_here
   BOT_USERNAME → your_bot_username_without_@
   ```

### Deploy (Automatic!)
The bot is now deployed! GitHub Actions will:
- ✅ Run every 2 minutes automatically
- ✅ Check for mentions
- ✅ Reply as Kowalski
- ✅ All for FREE!

## 4. Test & Verify

### Check It's Running
1. Go to your repo's **Actions** tab
2. You should see "Kowalski Analysis Bot" workflows running
3. Click on a run to see logs

### Test the Bot
1. Create a test tweet from any account
2. Reply: `@YourBotUsername Kowalski, analysis`
3. Wait up to 2 minutes for response!

### Manual Test
- Go to **Actions** tab
- Click **"Kowalski Analysis Bot"**
- Click **"Run workflow"** button
- Watch it run immediately!

## 5. Monitor Your Bot

### GitHub Actions Dashboard
- **Actions tab**: See all runs and their status
- **Green checkmarks**: Successful runs
- **Red X's**: Failed runs (click to debug)

### View Logs
1. Click any workflow run
2. Click "Run Kowalski Bot"
3. See detailed logs of what happened

## Common Issues & Solutions

### ❌ Bot Not Responding
**Check:**
- Actions tab for failed runs
- GitHub Secrets are correctly set
- Bot username matches the one in secrets
- Twitter app has Read & Write permissions

### ❌ Workflow Not Running
**Solutions:**
- Enable Actions in your repo settings
- Check if you have any workflow failures
- Try manual trigger: Actions → Run workflow

### ❌ Authentication Errors  
**Fix:**
- Double-check all GitHub Secrets
- Regenerate Twitter access tokens
- Ensure tokens are for the BOT account, not your main account

## GitHub Actions Benefits

- ✅ **Completely FREE**: 2,000 minutes/month (you'll use ~720)
- ✅ **No server management**: GitHub handles everything
- ✅ **Automatic updates**: Push code changes and they deploy instantly
- ✅ **Built-in monitoring**: See exactly what's happening
- ✅ **Reliable**: Runs on GitHub's infrastructure

## Next Steps

### Customize Your Bot
- Edit `src/gemini.ts` to change Kowalski's personality
- Modify the cron schedule in `.github/workflows/kowalski-bot.yml`
- Add more trigger phrases beyond "analysis"

### Monitor Performance
- Check Actions tab daily for any issues
- Monitor your Twitter API usage in developer portal
- Watch for rate limit warnings in logs

### Scale Up (Optional)
If you need more than GitHub's free tier:
- Use your GitHub Education Pack credits
- Deploy to DigitalOcean ($200 free credit)
- Upgrade to GitHub Pro for more Actions minutes

---

🎉 **That's it!** Your bot is now running 24/7 for free and will respond to mentions every 2 minutes!

Need help? Check the main README.md for detailed troubleshooting. 