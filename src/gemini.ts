import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisContext, KowalskiResponse } from './types';
import axios from 'axios';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateKowalskiAnalysis(context: AnalysisContext): Promise<KowalskiResponse> {
    const prompt = this.buildPrompt(context);
    
    try {
      let result;
      
      // Check if we have images to analyze
      if (context.media && context.media.length > 0) {
        console.log(`🖼️ Analyzing ${context.media.length} image(s) along with text`);
        result = await this.analyzeWithImages(prompt, context.media);
      } else {
        console.log('📝 Analyzing text only');
        result = await this.model.generateContent(prompt);
      }
      
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

  private async analyzeWithImages(prompt: string, media: any[]): Promise<any> {
    const imageParts = [];
    
    for (const mediaItem of media) {
      if (mediaItem.type === 'photo' && mediaItem.url) {
        try {
          console.log(`📥 Downloading image: ${mediaItem.url}`);
          const imageData = await this.downloadImage(mediaItem.url);
          
          imageParts.push({
            inlineData: {
              data: imageData,
              mimeType: 'image/jpeg'
            }
          });
        } catch (error) {
          console.error(`Failed to download image ${mediaItem.url}:`, error);
          // Continue with other images if one fails
        }
      }
    }
    
    if (imageParts.length === 0) {
      // Fallback to text-only if no images could be processed
      return await this.model.generateContent(prompt);
    }
    
    // Combine text prompt with images
    const parts = [{ text: prompt }, ...imageParts];
    return await this.model.generateContent(parts);
  }

  private async downloadImage(url: string): Promise<string> {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KowalskiBot/1.0)'
      }
    });
    
    // Convert to base64
    return Buffer.from(response.data).toString('base64');
  }

  private buildPrompt(context: AnalysisContext): string {
    const hasImages = context.media && context.media.length > 0;
    
    let basePrompt = `You are Kowalski from Madagascar - the intellectual, military-minded penguin who loves analysis and strategy. You're responding to someone who tagged you for analysis.

Context:
- Someone mentioned you asking for analysis
- The original tweet text: "${context.originalTweet}"
- The user who asked: @${context.username}`;

    if (hasImages) {
      basePrompt += `
- IMPORTANT: The tweet also contains ${context.media!.length} image(s) that you can see and should analyze along with the text`;
    }

    basePrompt += `

Respond as Kowalski would - with military precision, intellectual curiosity, but also his characteristic quirks. Be helpful and insightful, but maintain his personality. Keep it under 240 characters to fit Twitter's limits.

Your response should:
1. Acknowledge the request in a military fashion
2. Provide actual analysis or insight about the content ${hasImages ? '(both text AND images)' : ''}
3. Include some of Kowalski's characteristic language/phrases
4. Be genuinely useful while staying in character
5. Add a touch of humor`;

    if (hasImages) {
      basePrompt += `
6. Comment on visual elements you observe in the image(s) - be specific about what you see`;
    }

    basePrompt += `

Examples of Kowalski's speech patterns:
- "Analysis complete, Skipper!"
- "According to my calculations..."
- "Fascinating! The data suggests..."
- "My tactical assessment indicates..."
- "Probability of success: [percentage]"
- "Visual reconnaissance confirms..." (when analyzing images)

Generate your response:`;

    return basePrompt;
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