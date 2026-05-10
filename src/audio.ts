import * as Tone from 'tone';

class AudioEngine {
  private pianoSynth: Tone.PolySynth | null = null;
  private recorderSynth: Tone.PolySynth | null = null;
  private drumSynth: Tone.MembraneSynth | null = null;
  private percussionSynth: Tone.NoiseSynth | null = null;
  private successSynth: Tone.PolySynth | null = null;
  private errorSynth: Tone.Synth | null = null;
  private masterLimiter: Tone.Limiter | null = null;
  private masterVolume: Tone.Volume | null = null;
  private compressor: Tone.Compressor | null = null;
  private initialized = false;
  private initializing = false;

  async init() {
    if (this.initialized || this.initializing) return;
    this.initializing = true;
    
    try {
      console.log("Starting audio engine initialization...");
      await Tone.start();
      
      // Improve scheduling stability
      Tone.context.lookAhead = 0.1;
      
      // Master Chain: Volume -> Compressor -> Limiter -> Destination
      this.masterLimiter = new Tone.Limiter(-1).toDestination();
      this.compressor = new Tone.Compressor({
        threshold: -18,
        ratio: 3,
        attack: 0.01,
        release: 0.2
      }).connect(this.masterLimiter);
      
      this.masterVolume = new Tone.Volume(-6).connect(this.compressor);

      // PolySynth setup with explicit voice limits
      this.pianoSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.05, decay: 0.2, sustain: 0.3, release: 0.6 },
      }).connect(this.masterVolume);
      this.pianoSynth.maxPolyphony = 8;

      this.successSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.05, decay: 0.1, sustain: 0.2, release: 0.4 },
      }).connect(this.masterVolume);
      this.successSynth.maxPolyphony = 4;

      this.recorderSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine" }, 
        envelope: { attack: 0.05, decay: 0.1, sustain: 0.4, release: 0.3 },
      }).connect(this.masterVolume);
      this.recorderSynth.maxPolyphony = 6;

      this.drumSynth = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 2,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0.01, release: 0.1 }
      }).connect(this.masterVolume);
      
      this.percussionSynth = new Tone.NoiseSynth({
        envelope: { attack: 0.001, decay: 0.05, sustain: 0 },
        noise: { type: 'white' }
      }).connect(this.masterVolume);

      this.errorSynth = new Tone.Synth({
        oscillator: { type: 'square' },
        envelope: { attack: 0.005, decay: 0.05, sustain: 0, release: 0.05 }
      }).connect(this.masterVolume);

      this.initialized = true;
      console.log("Audio engine initialized. state:", Tone.context.state);
      
      if (Tone.context.state !== 'running') {
        await Tone.context.resume();
      }
    } catch (e) {
      console.error("Audio init error:", e);
    } finally {
      this.initializing = false;
    }
  }

  playNote(frequency: number, duration: string | number = "4n", type: 'piano' | 'recorder' | 'drum' = 'piano') {
    if (!this.initialized) {
      this.init();
      return;
    }

    if (Tone.context.state !== 'running') {
      Tone.context.resume();
    }
    
    try {
      const now = Tone.now();
      if (type === 'recorder' && this.recorderSynth) {
        this.recorderSynth.triggerAttackRelease(frequency, duration, now);
      } else if (type === 'drum' && this.drumSynth) {
        this.drumSynth.triggerAttackRelease(frequency, duration, now);
      } else if (type === 'piano' && this.pianoSynth) {
        this.pianoSynth.triggerAttackRelease(frequency, duration, now);
      }
    } catch (e) {
      console.warn("playNote error", e);
    }
  }

  playDrum() {
    if (!this.initialized) {
      this.init();
      return;
    }

    if (Tone.context.state !== 'running') {
      Tone.context.resume();
    }

    if (this.drumSynth) {
      try {
        const now = Tone.now();
        this.drumSynth.triggerAttackRelease("C2", "8n", now);
      } catch (e) {}
    }
  }

  playPercussion(duration: string | number = "16n") {
    if (!this.initialized) {
      this.init();
      return;
    }

    if (Tone.context.state !== 'running') {
      Tone.context.resume();
    }

    if (this.percussionSynth) {
      try {
        this.percussionSynth.triggerAttackRelease(duration, Tone.now());
      } catch (e) {}
    }
  }

  playSuccess() {
    if (!this.initialized) {
      this.init();
      return;
    }

    if (Tone.context.state !== 'running') {
      Tone.context.resume();
    }

    if (this.successSynth) {
      try {
        this.successSynth.triggerAttackRelease(["C4", "E4", "G4"], "8n", Tone.now());
      } catch (e) {}
    }
  }

  playError() {
    if (!this.initialized) {
      this.init();
      return;
    }

    if (Tone.context.state !== 'running') {
      Tone.context.resume();
    }

    if (this.errorSynth) {
      try {
        this.errorSynth.triggerAttackRelease("G2", "8n", Tone.now());
      } catch (e) {}
    }
  }
}

export const audioEngine = new AudioEngine();
