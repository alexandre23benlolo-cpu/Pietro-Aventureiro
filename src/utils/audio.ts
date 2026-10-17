/**
 * Web Audio API synthesizer for child-friendly game sounds
 * No external MP3 dependencies, instant playback, zero network latency.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Short gentle pop for UI clicks & object counting
   */
  public playClick(pitch: number = 440) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Audio fallback silent
    }
  }

  /**
   * Cheerful rising major triad for correct answer
   */
  public playCorrect() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + index * 0.07);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + index * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + index * 0.07 + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + index * 0.07);
        osc.stop(this.ctx.currentTime + index * 0.07 + 0.25);
      });
    } catch {
      // Ignore audio error
    }
  }

  /**
   * Sparkle sound for streak bonuses (>= 3, 5, 10)
   */
  public playStreakBonus() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const freqs = [784, 988, 1175, 1319, 1568];
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.05 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.05);
        osc.stop(this.ctx.currentTime + idx * 0.05 + 0.3);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Gentle, soft "boing" for wrong answer - friendly, encouraging rather than discouraging
   */
  public playWrong() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // Ignore
    }
  }

  /**
   * Grand fanfare on mission complete
   */
  public playFanfare() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const chords = [
        { time: 0.0, freqs: [523.25, 659.25, 783.99] }, // C Major
        { time: 0.18, freqs: [523.25, 659.25, 783.99] }, // C Major
        { time: 0.36, freqs: [587.33, 739.99, 880.00] }, // D Major
        { time: 0.54, freqs: [659.25, 830.61, 987.77] }, // E Major
        { time: 0.80, freqs: [783.99, 987.77, 1174.66, 1567.98] }, // G Major high chord
      ];

      chords.forEach((chord) => {
        chord.freqs.forEach((freq) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + chord.time);

          gain.gain.setValueAtTime(0.18, this.ctx.currentTime + chord.time);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + chord.time + 0.45);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(this.ctx.currentTime + chord.time);
          osc.stop(this.ctx.currentTime + chord.time + 0.45);
        });
      });
    } catch {
      // Ignore
    }
  }
}

export const soundCtrl = new SoundController();
