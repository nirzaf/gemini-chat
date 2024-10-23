import {
  GoogleGenerativeAI,
} from '@google/generative-ai';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

class GeminiChat {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private chatSession: any = null;
  private apiKeys: string[] = [];
  private currentKeyIndex = 0;
  private retryCount = 0;
  private maxRetries = 3;

  constructor() {
    this.loadSavedKeys();
  }

  private loadSavedKeys() {
    try {
      const savedKeys = localStorage.getItem('gemini-api-keys');
      if (savedKeys) {
        this.apiKeys = JSON.parse(savedKeys);
        this.initializeChat();
      }
    } catch (error) {
      console.error('Failed to load saved API keys:', error);
      this.apiKeys = [];
    }
  }

  private initializeChat() {
    if (this.apiKeys.length === 0) return;

    try {
      this.genAI = new GoogleGenerativeAI(this.apiKeys[this.currentKeyIndex]);
      this.model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-pro-002',
      });

      this.chatSession = this.model.startChat({
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
        },
        history: [],
      });
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      throw new Error('Failed to initialize chat. Please check your API key.');
    }
  }

  setApiKeys(keys: string[]) {
    if (!Array.isArray(keys) || keys.length === 0) {
      throw new Error('Please provide valid API keys');
    }

    this.apiKeys = keys;
    localStorage.setItem('gemini-api-keys', JSON.stringify(keys));
    this.currentKeyIndex = 0;
    this.initializeChat();
  }

  private rotateApiKey() {
    if (this.apiKeys.length <= 1) {
      throw new Error('No alternative API keys available');
    }
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
    this.initializeChat();
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.chatSession) {
      throw new Error('Chat not initialized. Please add API keys first.');
    }

    if (!message.trim()) {
      throw new Error('Message cannot be empty');
    }

    try {
      const result = await this.chatSession.sendMessage(message);
      this.retryCount = 0;
      return result.response.text();
    } catch (error: any) {
      if (error.message?.includes('429') && this.retryCount < this.maxRetries) {
        this.retryCount++;
        this.rotateApiKey();
        return this.sendMessage(message);
      }
      throw new Error(error.message || 'Failed to send message');
    }
  }

  getCurrentKeyIndex(): number {
    return this.currentKeyIndex;
  }

  getApiKeys(): string[] {
    return this.apiKeys;
  }

  resetChat() {
    this.initializeChat();
  }
}

export const geminiChat = new GeminiChat();