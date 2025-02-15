import { TTSService } from './ttsService';

class SpeechSynthesisManager {
  private static instance: SpeechSynthesisManager;
  private ttsService: TTSService;
  private audioContext?: AudioContext;
  private currentSource?: AudioBufferSourceNode;
  private isPlaying: boolean = false;

  private constructor() {
    this.ttsService = TTSService.getInstance();
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  static getInstance(): SpeechSynthesisManager {
    if (!this.instance) {
      this.instance = new SpeechSynthesisManager();
    }
    return this.instance;
  }

  async speak(text: string): Promise<void> {
    if (!this.audioContext && typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    try {
      this.stop();
      
      const audioData = await this.ttsService.synthesize(text);
      // Create a copy of the ArrayBuffer before decoding
      const audioDataCopy = audioData.slice(0);
      const audioBuffer = await this.audioContext!.decodeAudioData(audioDataCopy);
      
      this.currentSource = this.audioContext!.createBufferSource();
      this.currentSource.buffer = audioBuffer;
      this.currentSource.connect(this.audioContext!.destination);
      
      this.currentSource.onended = () => {
        this.isPlaying = false;
        this.ttsService.emit('speechEnd');
      };

      this.isPlaying = true;
      this.ttsService.emit('speechStart');
      this.currentSource.start();
    } catch (error) {
      console.error('Speech synthesis error:', error);
      this.isPlaying = false;
      this.ttsService.emit('speechEnd');
    }
  }

  stop(): void {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (e) {
        // Ignore errors if source was already stopped
      }
      this.currentSource = undefined;
    }
    this.isPlaying = false;
  }

  on(event: string, callback: Function) {
    this.ttsService.on(event, callback);
  }

  removeListener(event: string, callback: Function) {
    this.ttsService.removeListener(event, callback);
  }
}

export default SpeechSynthesisManager;
