export class AudioManager {
  private gainNode: GainNode | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private isInitialized = false;

  async init() {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.isInitialized = true;
    } catch (error) {
      console.error("Web Audio API is not supported in this browser.");
    }
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = volume;
    }
    if (this.currentAudio) {
      this.currentAudio.volume = volume;
    }
  }

  async playAudio(audioUrl: string): Promise<void> {
    await this.init();

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    // For development/testing when audio files don't exist
    if (!audioUrl.startsWith("http")) {
      return new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return new Promise((resolve) => {
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      if (this.audioContext && this.gainNode) {
        const source = this.audioContext.createMediaElementSource(audio);
        source.connect(this.gainNode);
      }

      audio.onended = () => {
        this.currentAudio = null;
        resolve();
      };

      audio.onerror = () => {
        this.currentAudio = null;
        // Resolve instead of reject for development/testing
        resolve();
      };

      audio.play().catch(() => {
        this.currentAudio = null;
        // Resolve instead of reject for development/testing
        resolve();
      });
    });
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
  }
}
