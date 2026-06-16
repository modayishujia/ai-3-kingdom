import OpenAI from 'openai';

export class AIService {
  private client: OpenAI | null = null;
  private baseUrl: string = '';
  private apiKey: string = '';
  private model: string = '';

  configure(baseUrl: string, apiKey: string, model: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.model = model;
    
    this.client = new OpenAI({
      baseURL: baseUrl,
      apiKey: apiKey
    });
  }

  isConfigured(): boolean {
    return this.client !== null && this.apiKey !== '';
  }

  async chat(messages: { role: string; content: string }[]): Promise<string> {
    if (!this.client) {
      throw new Error('AI service not configured');
    }

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: messages as any,
      temperature: 0.8,
      max_tokens: 2000
    });

    return response.choices[0].message.content || '';
  }

  async chatWithJson(messages: { role: string; content: string }[]): Promise<any> {
    const response = await this.chat(messages);
    try {
      return JSON.parse(response);
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', response);
      throw new Error('Invalid JSON response from AI');
    }
  }
}

export const aiService = new AIService();

