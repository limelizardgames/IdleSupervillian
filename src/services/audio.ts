/** Tiny synthesized sound effects via WebAudio — no audio files needed. */
type Sfx = 'tap' | 'buy' | 'upgrade' | 'chest' | 'coin' | 'fanfare' | 'error' | 'hero' | 'click' | 'build';

class AudioService {
  private ctx: AudioContext | null = null;
  enabled = true;
  private muted = false;
  private lastTap = 0;

  private ac(): AudioContext | null {
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    return this.ctx;
  }

  setMuted(m: boolean) { this.muted = m; }

  private tone(freq: number, dur: number, type: OscillatorType, vol: number, delay = 0, slideTo?: number) {
    const ctx = this.ac();
    if (!ctx) return;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  play(s: Sfx) {
    if (!this.enabled || this.muted) return;
    switch (s) {
      case 'tap': {
        const now = performance.now();
        if (now - this.lastTap < 45) return;
        this.lastTap = now;
        this.tone(520 + Math.random() * 160, 0.08, 'square', 0.04);
        break;
      }
      case 'click': this.tone(700, 0.05, 'triangle', 0.05); break;
      case 'buy': this.tone(660, 0.07, 'triangle', 0.08); this.tone(990, 0.09, 'triangle', 0.07, 0.05); break;
      case 'upgrade': [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.12, 'triangle', 0.07, i * 0.06)); break;
      case 'coin': this.tone(988, 0.06, 'square', 0.05); this.tone(1319, 0.2, 'square', 0.05, 0.06); break;
      case 'chest': [392, 523, 659, 784, 1046, 1318].forEach((f, i) => this.tone(f, 0.18, 'triangle', 0.07, i * 0.07)); break;
      case 'fanfare': [523, 523, 523, 698, 880, 784, 1046].forEach((f, i) => this.tone(f, 0.22, 'sawtooth', 0.04, i * 0.11)); break;
      case 'error': this.tone(200, 0.15, 'sawtooth', 0.05, 0, 120); break;
      case 'hero': this.tone(300, 0.3, 'sawtooth', 0.04, 0, 900); break;
      case 'build': this.tone(180, 0.1, 'square', 0.05); this.tone(140, 0.1, 'square', 0.05, 0.1); break;
    }
  }
}

export const audio = new AudioService();
