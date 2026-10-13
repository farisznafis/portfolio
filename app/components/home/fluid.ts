import * as THREE from "three";

/**
 * Minimal stable-fluids solver (Stam / BFECC advection) on a low-res
 * half-float grid. Only the velocity field is simulated; its magnitude is
 * what the hero uses as a reveal mask. Params mirror landonorris.com's
 * OFF+BRAND setup, with dt/dissipation scaled by frame time so 60/120/144 Hz
 * screens all feel the same.
 */

const PARAMS = {
  resolution: 0.1, // grid cells per CSS px
  cursorSize: 18, // splat radius, in cells
  mouseForce: 50,
  dissipation: 0.96, // per 60 Hz frame
  dt: 0.014, // per 60 Hz frame
  poissonIterations: 4,
};

const vert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const advectFrag = /* glsl */ `
uniform sampler2D velocity;
uniform float dt;
uniform float dissipation;
uniform vec2 fboSize;
varying vec2 vUv;
void main() {
  vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
  // BFECC: advect back, forward, correct the error, advect again.
  vec2 velOld = texture2D(velocity, vUv).xy;
  vec2 spotOld = vUv - velOld * dt * ratio;
  vec2 velNew1 = texture2D(velocity, spotOld).xy;
  vec2 spotNew2 = spotOld + velNew1 * dt * ratio;
  vec2 spotNew3 = vUv - (spotNew2 - vUv) / 2.0;
  vec2 vel2 = texture2D(velocity, spotNew3).xy;
  vec2 spotOld2 = spotNew3 - vel2 * dt * ratio;
  gl_FragColor = vec4(texture2D(velocity, spotOld2).xy * dissipation, 0.0, 1.0);
}`;

const forceVert = /* glsl */ `
uniform vec2 center;
uniform vec2 scale;
uniform vec2 px;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy * scale * 2.0 * px + center, 0.0, 1.0);
}`;

const forceFrag = /* glsl */ `
uniform vec2 force;
varying vec2 vUv;
void main() {
  float d = 1.0 - min(length((vUv - 0.5) * 2.0), 1.0);
  gl_FragColor = vec4(force * d * d, 0.0, 1.0);
}`;

const divergenceFrag = /* glsl */ `
uniform sampler2D velocity;
uniform vec2 px;
uniform float dt;
varying vec2 vUv;
void main() {
  float x0 = texture2D(velocity, vUv - vec2(px.x, 0.0)).x;
  float x1 = texture2D(velocity, vUv + vec2(px.x, 0.0)).x;
  float y0 = texture2D(velocity, vUv - vec2(0.0, px.y)).y;
  float y1 = texture2D(velocity, vUv + vec2(0.0, px.y)).y;
  gl_FragColor = vec4((x1 - x0 + y1 - y0) / 2.0 / dt);
}`;

const poissonFrag = /* glsl */ `
uniform sampler2D pressure;
uniform sampler2D divergence;
uniform vec2 px;
varying vec2 vUv;
void main() {
  float p0 = texture2D(pressure, vUv + vec2(px.x * 2.0, 0.0)).r;
  float p1 = texture2D(pressure, vUv - vec2(px.x * 2.0, 0.0)).r;
  float p2 = texture2D(pressure, vUv + vec2(0.0, px.y * 2.0)).r;
  float p3 = texture2D(pressure, vUv - vec2(0.0, px.y * 2.0)).r;
  gl_FragColor = vec4((p0 + p1 + p2 + p3) / 4.0 - texture2D(divergence, vUv).r);
}`;

const pressureFrag = /* glsl */ `
uniform sampler2D pressure;
uniform sampler2D velocity;
uniform vec2 px;
uniform float dt;
varying vec2 vUv;
void main() {
  float p0 = texture2D(pressure, vUv + vec2(px.x, 0.0)).r;
  float p1 = texture2D(pressure, vUv - vec2(px.x, 0.0)).r;
  float p2 = texture2D(pressure, vUv + vec2(0.0, px.y)).r;
  float p3 = texture2D(pressure, vUv - vec2(0.0, px.y)).r;
  vec2 v = texture2D(velocity, vUv).xy - vec2(p0 - p1, p2 - p3) * 0.5 * dt;
  gl_FragColor = vec4(v, 0.0, 1.0);
}`;

export class Fluid {
  private renderer: THREE.WebGLRenderer;
  private camera = new THREE.Camera();
  private scene = new THREE.Scene();
  private quad: THREE.Mesh;
  private forceScene = new THREE.Scene();
  private forceMesh: THREE.Mesh;
  private size = new THREE.Vector2();
  private px = new THREE.Vector2();
  private fbos: Record<"vel0" | "vel1" | "div" | "p0" | "p1", THREE.WebGLRenderTarget>;
  private mats: Record<"advect" | "force" | "div" | "poisson" | "pressure", THREE.ShaderMaterial>;

  constructor(renderer: THREE.WebGLRenderer, width: number, height: number) {
    this.renderer = renderer;
    // iOS lacks float-linear filtering; half-float works everywhere.
    const rt = () =>
      new THREE.WebGLRenderTarget(1, 1, {
        type: THREE.HalfFloatType,
        depthBuffer: false,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
      });
    this.fbos = { vel0: rt(), vel1: rt(), div: rt(), p0: rt(), p1: rt() };

    const mat = (fragmentShader: string, uniforms: Record<string, THREE.IUniform>) =>
      new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader, uniforms, depthTest: false });
    this.mats = {
      advect: mat(advectFrag, {
        velocity: { value: null },
        dt: { value: PARAMS.dt },
        dissipation: { value: PARAMS.dissipation },
        fboSize: { value: this.size },
      }),
      force: new THREE.ShaderMaterial({
        vertexShader: forceVert,
        fragmentShader: forceFrag,
        uniforms: {
          force: { value: new THREE.Vector2() },
          center: { value: new THREE.Vector2() },
          scale: { value: new THREE.Vector2(PARAMS.cursorSize, PARAMS.cursorSize) },
          px: { value: this.px },
        },
        blending: THREE.AdditiveBlending,
        depthTest: false,
      }),
      div: mat(divergenceFrag, { velocity: { value: null }, px: { value: this.px }, dt: { value: PARAMS.dt } }),
      poisson: mat(poissonFrag, { pressure: { value: null }, divergence: { value: null }, px: { value: this.px } }),
      pressure: mat(pressureFrag, {
        pressure: { value: null },
        velocity: { value: null },
        px: { value: this.px },
        dt: { value: PARAMS.dt },
      }),
    };

    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.mats.advect);
    this.scene.add(this.quad);
    this.forceMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.mats.force);
    this.forceScene.add(this.forceMesh);
    this.resize(width, height);
  }

  /** Velocity field; `length(texture.xy)` is the reveal mask. */
  get texture() {
    return this.fbos.vel0.texture;
  }

  resize(width: number, height: number) {
    this.size.set(Math.max(1, Math.round(width * PARAMS.resolution)), Math.max(1, Math.round(height * PARAMS.resolution)));
    this.px.set(1 / this.size.x, 1 / this.size.y);
    for (const fbo of Object.values(this.fbos)) fbo.setSize(this.size.x, this.size.y);
  }

  private pass(material: THREE.ShaderMaterial, target: THREE.WebGLRenderTarget) {
    this.quad.material = material;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * @param frame  frame time relative to 60 Hz (1 = 16.7 ms)
   * @param pointer cursor in NDC (-1..1, y up)
   * @param delta  cursor movement this frame, in NDC
   */
  update(frame: number, pointer: THREE.Vector2, delta: THREE.Vector2) {
    const { advect, force, div, poisson, pressure } = this.mats;
    const dt = PARAMS.dt * frame;

    advect.uniforms.velocity.value = this.fbos.vel0.texture;
    advect.uniforms.dt.value = dt;
    advect.uniforms.dissipation.value = Math.pow(PARAMS.dissipation, frame);
    this.pass(advect, this.fbos.vel1);

    // Splat the cursor's velocity into the field (additive, on top of the advected state).
    if (delta.x !== 0 || delta.y !== 0) {
      const sx = PARAMS.cursorSize * this.px.x;
      const sy = PARAMS.cursorSize * this.px.y;
      force.uniforms.force.value.set((delta.x / 2) * PARAMS.mouseForce, (delta.y / 2) * PARAMS.mouseForce);
      force.uniforms.center.value.set(
        THREE.MathUtils.clamp(pointer.x, -1 + sx + this.px.x * 2, 1 - sx - this.px.x * 2),
        THREE.MathUtils.clamp(pointer.y, -1 + sy + this.px.y * 2, 1 - sy - this.px.y * 2),
      );
      this.renderer.autoClear = false;
      this.renderer.setRenderTarget(this.fbos.vel1);
      this.renderer.render(this.forceScene, this.camera);
      this.renderer.autoClear = true;
    }

    div.uniforms.velocity.value = this.fbos.vel1.texture;
    div.uniforms.dt.value = dt;
    this.pass(div, this.fbos.div);

    let src = this.fbos.p0;
    let dst = this.fbos.p1;
    poisson.uniforms.divergence.value = this.fbos.div.texture;
    for (let i = 0; i < PARAMS.poissonIterations; i++) {
      poisson.uniforms.pressure.value = src.texture;
      this.pass(poisson, dst);
      [src, dst] = [dst, src];
    }

    pressure.uniforms.pressure.value = src.texture;
    pressure.uniforms.velocity.value = this.fbos.vel1.texture;
    pressure.uniforms.dt.value = dt;
    this.pass(pressure, this.fbos.vel0);
    this.renderer.setRenderTarget(null);
  }

  dispose() {
    for (const fbo of Object.values(this.fbos)) fbo.dispose();
    for (const m of Object.values(this.mats)) m.dispose();
    this.quad.geometry.dispose();
    this.forceMesh.geometry.dispose();
  }
}
