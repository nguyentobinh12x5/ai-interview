import axios from 'axios';

export class TTSService {
  private static instance: TTSService;
  private eventListeners: { [key: string]: Function[] } = {};

  private constructor() {}

  static getInstance(): TTSService {
    if (!this.instance) {
      this.instance = new TTSService();
    }
    return this.instance;
  }

  async synthesize(text: string): Promise<ArrayBuffer> {
    try {
      const response = await axios.post(
        'https://service-api.beatinterview.com/api/tts',
        {
          text,
          voiceCode: 'U0005'
        },
        {
          responseType: 'arraybuffer',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('TTS API Error:', error);
      throw error;
    }
  }

  on(event: string, callback: Function) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  removeListener(event: string, callback: Function) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(
        (cb) => cb !== callback
      );
    }
  }

  public emit(event: string) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach((callback) => callback());
    }
  }
} 