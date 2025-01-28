import { EventEmitter, SpeechQueue } from "./speechCore";

class SpeechSynthesisManager extends EventEmitter {
  private static instance: SpeechSynthesisManager;
  private synthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private queue: SpeechQueue;
  private voices: SpeechSynthesisVoice[] = [];
  private voicesInitialized = false;

  private constructor() {
    super();
    this.synthesis = window.speechSynthesis;
    this.queue = new SpeechQueue();
    this.initVoices();
    this.setupEventListeners();
  }

  private initVoices(): void {
    const handleVoicesChanged = () => {
      this.voices = window.speechSynthesis.getVoices();
      if (!this.voicesInitialized && this.voices.length > 0) {
        this.voicesInitialized = true;
        this.emit("voicesInitialized", this.voices);
      }
    };

    handleVoicesChanged();
    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
  }

  private setupEventListeners(): void {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.stop();
      }
    });

    window.addEventListener("beforeunload", () => {
      this.stop();
    });
  }

  static getInstance(): SpeechSynthesisManager {
    if (!SpeechSynthesisManager.instance) {
      SpeechSynthesisManager.instance = new SpeechSynthesisManager();
    }
    return SpeechSynthesisManager.instance;
  }

  setVoice(voice: SpeechSynthesisVoice): void {
    this.selectedVoice = voice;
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  getVoicesByLanguage(language: string): SpeechSynthesisVoice[] {
    return this.voices.filter((voice) =>
      voice.lang.startsWith(language.split("-")[0])
    );
  }

  private createUtterance(text: string): SpeechSynthesisUtterance {
    const utterance = new SpeechSynthesisUtterance(text);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = 1;
    utterance.pitch = 1;
    return utterance;
  }

  async speak(text: string): Promise<void> {
    this.stop();

    return this.queue.add(async () => {
      return new Promise((resolve, reject) => {
        try {
          const utterance = this.createUtterance(text);
          this.currentUtterance = utterance;

          utterance.onstart = () => this.emit("speechStart");
          utterance.onend = () => {
            this.currentUtterance = null;
            this.emit("speechEnd");
            resolve();
          };
          utterance.onerror = (event) => {
            this.currentUtterance = null;
            this.emit("speechError", event);
            event.error === "interrupted" ? resolve() : reject(event);
          };

          this.synthesis.cancel();
          setTimeout(() => {
            this.synthesis.speak(utterance);
          }, 100);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  stop(): void {
    this.queue.clear();
    if (this.synthesis.speaking || this.synthesis.pending) {
      this.synthesis.cancel();
      this.currentUtterance = null;
      this.emit("speechEnd");
    }
  }
}

export default SpeechSynthesisManager;
