class AudioEngine {
  private context: AudioContext | null = null;

  init() {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playNote(frequency: number, duration: number = 0.5) {
    if (!this.context) this.init();
    if (!this.context) return;

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);

    gainNode.gain.setValueAtTime(0.5, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.start();
    oscillator.stop(this.context.currentTime + duration);
  }

  playSuccess() {
    this.playNote(523.25, 0.1);
    setTimeout(() => this.playNote(659.25, 0.3), 100);
  }

  playError() {
    this.playNote(220, 0.2);
  }
}

export const audioEngine = new AudioEngine();
