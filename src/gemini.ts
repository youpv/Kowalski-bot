import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisContext, KowalskiResponse } from './types';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateKowalskiAnalysis(context: AnalysisContext): Promise<KowalskiResponse> {
    const prompt = this.buildPrompt(context);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const analysis = response.text();
      
      return {
        analysis: this.formatResponse(analysis),
        confidence: this.determineConfidence(analysis)
      };
    } catch (error) {
      console.error('Error generating Kowalski analysis:', error);
      return this.getFallbackResponse();
    }
  }

  private buildPrompt(context: AnalysisContext): string {
    return `You are Kowalski from Madagascar - the intellectual, military-minded penguin who loves analysis and strategy. You're responding to someone who tagged you for analysis.

Context:
- Someone mentioned you saying "Kowalski, analysis" 
- The original tweet they want analyzed: "${context.originalTweet}"
- The user who asked: @${context.username}

Respond as Kowalski would - with military precision, intellectual curiosity, but also his characteristic quirks. Be helpful and insightful, but maintain his personality. Keep it under 240 characters to fit Twitter's limits.

Your response should:
1. Acknowledge the request in a military fashion
2. Provide actual analysis or insight about the tweet
3. Include some of Kowalski's characteristic language/phrases
4. Be genuinely useful while staying in character
5. Add a touch of humor

Examples of Kowalski's speech patterns:
- "Analysis complete, Skipper!"
- "According to my calculations..."
- "Fascinating! The data suggests..."
- "My tactical assessment indicates..."
- "Probability of success: [percentage]"

Generate your response:`;
  }

  private formatResponse(response: string): string {
    // Clean up the response and ensure it fits Twitter's character limit
    let cleaned = response.trim();
    
    // Remove any quotes if the AI wrapped the response
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
      cleaned = cleaned.slice(1, -1);
    }
    
    // Ensure it's under Twitter's character limit (280 chars, but leave room for mentions)
    if (cleaned.length > 240) {
      cleaned = cleaned.substring(0, 237) + '...';
    }
    
    return cleaned;
  }

  private determineConfidence(response: string): 'high' | 'medium' | 'low' {
    // Simple heuristic based on response characteristics
    if (response.includes('calculations') || response.includes('data') || response.includes('analysis')) {
      return 'high';
    } else if (response.includes('suggests') || response.includes('indicates')) {
      return 'medium';
    }
    return 'low';
  }

  private getFallbackResponse(): KowalskiResponse {
    const fallbacks = [
      "Analysis complete! However, my systems are experiencing technical difficulties. Recommend trying again later, soldier!",
      "Tactical assessment: My circuits are temporarily scrambled. Please standby for recalibration!",
      "According to my calculations... wait, my calculator is broken. This is most irregular!",
      "Analysis inconclusive due to system malfunction. Kowalski requires maintenance immediately!",
    ];
    
    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    
    return {
      analysis: randomFallback,
      confidence: 'low'
    };
  }
} 