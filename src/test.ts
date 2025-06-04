import 'dotenv/config';
import { GeminiService } from './gemini';
import { AnalysisContext } from './types';

// Test script to demonstrate Kowalski's analysis capabilities
async function testKowalskiAnalysis() {
  // Note: You'll need a real Gemini API key for this to work
  const geminiApiKey = process.env.GEMINI_API_KEY;
  
  if (!geminiApiKey) {
    console.log('🐧 Test mode: No Gemini API key provided');
    console.log('This would normally generate AI-powered Kowalski responses');
    showMockResponses();
    return;
  }

  const geminiService = new GeminiService(geminiApiKey);

  const testCases: AnalysisContext[] = [
    {
      originalTweet: "Just saw the most amazing sunset! The colors were incredible 🌅",
      mentionText: "@AskKowalski analysis",
      username: "nature_lover"
    },
    {
      originalTweet: "Why does my code work on my machine but not in production? 😭",
      mentionText: "@AskKowalski what do you think?",
      username: "frustrated_dev"
    },
    {
      originalTweet: "Pizza is the ultimate food. You can have it for breakfast, lunch, AND dinner!",
      mentionText: "@AskKowalski Kowalski, analysis",
      username: "food_philosopher"
    },
    {
      originalTweet: "Just finished my first marathon! 🏃‍♂️ My legs are jelly but I'm so proud!",
      mentionText: "@AskKowalski analyze this achievement",
      username: "marathon_runner"
    },
    {
      originalTweet: "Should I quit my job to become a professional gamer? 🎮",
      mentionText: "@AskKowalski tactical assessment please",
      username: "career_question"
    }
  ];

  console.log('🐧 Testing Kowalski Analysis Bot with real AI...\n');

  for (const testCase of testCases) {
    console.log(`📝 Original Tweet: "${testCase.originalTweet}"`);
    console.log(`👤 Requested by: @${testCase.username}`);
    
    try {
      const response = await geminiService.generateKowalskiAnalysis(testCase);
      console.log(`🐧 Kowalski: ${response.analysis}`);
      console.log(`📊 Confidence: ${response.confidence}`);
    } catch (error) {
      console.log(`❌ Error: ${error}`);
    }
    
    console.log('─'.repeat(60));
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

function showMockResponses() {
  const mockResponses = [
    {
      tweet: "Just saw the most amazing sunset! The colors were incredible 🌅",
      response: "Analysis complete! According to my calculations, this sunset exhibits optimal chromatic distribution. Tactical assessment: 94% probability of romantic evening success. Recommended action: proceed with photo documentation, soldier! 🐧"
    },
    {
      tweet: "Why does my code work on my machine but not in production? 😭",
      response: "Analysis complete! Classic environment differential detected. My tactical assessment: 87% probability of missing dependencies or configuration variance. Recommended strategy: implement proper containerization, recruit! 🐧"
    },
    {
      tweet: "Pizza is the ultimate food. You can have it for breakfast, lunch, AND dinner!",
      response: "Fascinating analysis, soldier! My calculations confirm pizza's nutritional versatility coefficient at 96.7%. Tactical note: recommend balanced dietary protocols for optimal penguin performance! 🐧"
    }
  ];

  console.log('🐧 Mock Kowalski Analysis Responses:\n');

  mockResponses.forEach((mock, index) => {
    console.log(`Test Case ${index + 1}:`);
    console.log(`📝 Tweet: "${mock.tweet}"`);
    console.log(`🐧 Kowalski: ${mock.response}`);
    console.log('─'.repeat(60));
  });

  console.log('\n💡 To see real AI responses, set up your GEMINI_API_KEY in the .env file!');
}

// Run the test if this file is executed directly
if (require.main === module) {
  testKowalskiAnalysis().catch(console.error);
} 