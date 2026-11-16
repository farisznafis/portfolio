/**
 * The book's three sounds, all synthesised: the dry slide of heavy card, the
 * soft thump of a page landing, the ratchet tick of the wheel. Only ever
 * constructed from the "Enable sound" click.
 */
export class BookSound {
  private ctx = new AudioContext();
  private out = this.ctx.createGain();
  private slideGain = this.ctx.createGain();
  private noise: AudioBufferSourceNode;

  constructor() {
    const { ctx } = this;
    this.out.gain.value = 0.9;
    this.out.connect(ctx.destination);
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    this.noise = ctx.createBufferSource();
    this.noise.buffer = buffer;
    this.noise.loop = true;
    // Card on card: band-limited hiss, no body.
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 2400;
    band.Q.value = 0.7;
    this.slideGain.gain.value = 0;
    this.noise.connect(band).connect(this.slideGain).connect(this.out);
    this.noise.start();
  }

  /** Call every frame with how fast card is moving (0 = still). */
  slide(speed: number) {
    this.slideGain.gain.setTargetAtTime(Math.min(0.1, speed * 0.06), this.ctx.currentTime, 0.06);
  }

  thump() {
    const { ctx } = this;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(92, now);
    osc.frequency.exponentialRampToValueAtTime(44, now + 0.16);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain).connect(this.out);
    osc.start(now);
    osc.stop(now + 0.24);
    this.burst(700, 0.16, 0.07, "lowpass");
  }

  tick() {
    this.burst(3800, 0.12, 0.018, "highpass");
  }

  private burst(frequency: number, level: number, length: number, type: BiquadFilterType) {
    const { ctx } = this;
    const now = ctx.currentTime;
    const source = ctx.createBufferSource();
    source.buffer = this.noise.buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(level, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + length);
    source.connect(filter).connect(gain).connect(this.out);
    source.start(now, Math.random());
    source.stop(now + length + 0.02);
  }

  dispose() {
    this.noise.stop();
    void this.ctx.close();
  }
}
