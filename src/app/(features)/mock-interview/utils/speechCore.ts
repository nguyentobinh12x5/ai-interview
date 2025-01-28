type Listener = (...args: any[]) => void;

export class EventEmitter {
  private events: { [key: string]: Listener[] } = {};

  on(event: string, listener: Listener): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  removeListener(event: string, listener: Listener): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((l) => l !== listener);
  }

  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return;
    this.events[event].forEach((listener) => listener(...args));
  }
}

export class SpeechQueue {
  private queue: (() => Promise<void>)[] = [];
  private isProcessing = false;
  private currentTask: (() => Promise<void>) | null = null;

  async add(task: () => Promise<void>): Promise<void> {
    if (this.currentTask) {
      this.queue = [];
      this.currentTask = null;
      this.isProcessing = false;
    }

    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          this.currentTask = task;
          await task();
          resolve();
        } catch (error) {
          reject(error);
        } finally {
          this.currentTask = null;
        }
      });

      if (!this.isProcessing) {
        this.process().catch(console.error);
      }
    });
  }

  private async process(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;
    while (this.queue.length > 0) {
      const task = this.queue[0];
      try {
        await task();
      } catch (error) {
        console.error("Speech task error:", error);
      }
      if (this.queue[0] === task) {
        this.queue.shift();
      }
    }
    this.isProcessing = false;
  }

  clear(): void {
    this.queue = [];
    this.currentTask = null;
    this.isProcessing = false;
  }
}
