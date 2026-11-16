/**
 * The hall's two sounds, both synthesised: the room tone of a large empty
 * building at night, and soft footsteps on concrete that follow the walk.
 * Only ever constructed from the "Enable sound" click.
 */
export class GallerySound {
  private ctx = new AudioContext();
  private out = this.ctx.createGain();
  private noise: AudioBufferSourceNode;
  private stride = 0;

  constructor() {
    const { ctx } = this;
    this.out.gain.value = 0.9;
    this.out.connect(ctx.destination);
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const samples = buffer.getChannelData(0);
    // Brown noise: air handling somewhere far off.
    let last = 0;
    for (let i = 0; i < samples.length; i++) samples[i] = last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    this.noise = ctx.createBufferSource();
    this.noise.buffer = buffer;
    this.noise.loop = true;
    const low = ctx.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.value = 220;
    const tone = ctx.createGain();
    tone.gain.value = 0;
    tone.gain.setTargetAtTime(1.1, ctx.currentTime, 1.2);
    this.noise.connect(low).connect(tone).connect(this.out);
    this.noise.start();
  }

  /** Call every frame with the metres walked so far and the current speed; a step lands every stride. */
  walk(distance: number, speed: number) {
    const stride = Math.floor(distance / 0.72);
    if (stride === this.stride) return;
    this.stride = stride;
    if (speed < 0.12 || speed > 6) return;
    const { ctx } = this;
    const now = ctx.currentTime;
    // A soft sole on concrete: a short low knock and a breath of grit.
    const source = ctx.createBufferSource();
    source.buffer = this.noise.buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = stride % 2 ? 260 : 310;
    filter.Q.value = 0.9;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(Math.min(0.9, 0.35 + speed * 0.25), now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    source.connect(filter).connect(gain).connect(this.out);
    source.start(now, Math.random() * 2);
    source.stop(now + 0.22);
  }

  dispose() {
    this.noise.stop();
    void this.ctx.close();
  }
}
