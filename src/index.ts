import express from 'express';
import { KowalskiBot } from './bot';
import { config, serverConfig } from './config';

const app = express();
app.use(express.json());

let bot: KowalskiBot;

async function startBot() {
  try {
    console.log('🐧 Initializing Kowalski Analysis Bot...');
    
    bot = new KowalskiBot(config);
    await bot.start();
    
    console.log('✅ Bot started successfully!');
  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
}

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    if (bot) {
      const health = await bot.healthCheck();
      res.json(health);
    } else {
      res.status(503).json({ status: 'error', message: 'Bot not initialized' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Health check failed' });
  }
});

// Status endpoint
app.get('/status', (req, res) => {
  res.json({
    service: 'Kowalski Analysis Bot',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🐧 Received SIGINT, gracefully shutting down...');
  
  if (bot) {
    await bot.stop();
  }
  
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🐧 Received SIGTERM, gracefully shutting down...');
  
  if (bot) {
    await bot.stop();
  }
  
  process.exit(0);
});

// Start the server
app.listen(serverConfig.port, () => {
  console.log(`🚀 Server running on port ${serverConfig.port}`);
  console.log(`📋 Health check: http://localhost:${serverConfig.port}/health`);
  console.log(`📊 Status: http://localhost:${serverConfig.port}/status`);
  
  // Start the bot
  startBot();
});

export default app; 