import * as Tone from 'tone';

class AudioEngine {
  private recorderSynth: Tone.Sampler | Tone.Synth | null = null;
  private drumSynth: Tone.MembraneSynth | null = null;
  private percussionSynth: Tone.NoiseSynth | null = null;
  private initialized = false;

  async init() {
    if (this.initialized) return;
    await Tone.start();
    
    // Create a synth that mimics a recorder/flute
    this.recorderSynth = new Tone.Synth({
      oscillator: {
        type: "triangle"
      },
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.5,
        release: 0.8
      }
    }).toDestination();

    this.drumSynth = new Tone.MembraneSynth().toDestination();
    this.percussionSynth = new Tone.NoiseSynth({
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0
      }
    }).toDestination();

    this.initialized = true;
  }

  playNote(frequency: number, duration: string | number = "4n", type: 'piano' | 'recorder' | 'drum' = 'piano') {
    if (!this.initialized) this.init();
    
    if (type === 'recorder' && this.recorderSynth) {
      this.recorderSynth.triggerAttackRelease(frequency, duration);
    } else {
      // Default fallback
      const synth = new Tone.Synth().toDestination();
      synth.triggerAttackRelease(frequency, duration);
    }
  }

  playDrum() {
    if (!this.initialized) this.init();
    if (this.drumSynth) {
      this.drumSynth.triggerAttackRelease("C1", "8n");
    }
  }

  playPercussion(duration: string | number = "16n") {
    if (!this.initialized) this.init();
    if (this.percussionSynth) {
      this.percussionSynth.triggerAttackRelease(duration);
    }
  }

  playSuccess() {
    if (!this.initialized) this.init();
    const synth = new Tone.PolySynth().toDestination();
    synth.triggerAttackRelease(["C4", "E4", "G4"], "8n");
  }

  playError() {
    if (!this.initialized) this.init();
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease("G2", "8n");
  }
}

export const audioEngine = new AudioEngine();
