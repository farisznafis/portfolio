/**
 * Surfaces and light for the hall. There is not one three.js light in the
 * scene: every picture light is a small analytic spot evaluated in the
 * shaders of the surfaces it can reach (wall, floor, mat, frame, label), so a
 * thousand prints cost a thousand instances, not a thousand lights.
 */
import * as THREE from "three";
import { HALL, type HallPlan } from "./plan";

export const NIGHT = "#0a0f11";
/** Darkness the hall falls into, in linear light: night with a breath of teal. */
const FOG = new THREE.Color(0.0045, 0.0105, 0.012);

/* ── Baked noise ───────────────────────────────────────────────────────── */

function random(seed: number) {
  let x = seed;
  return () => ((x = (x * 1664525 + 1013904223) >>> 0) / 4294967296);
}

type Wrap = (x: number, y: number, reach: number, paint: (dx: number, dy: number) => void) => void;

/**
 * A seamless 512 px tile: `strokes` paints the red channel, green is per-pixel grain.
 *
 * Built to cost milliseconds, because it runs while the page transition is
 * playing: strokes are drawn sharp on a GPU canvas and softened once at the
 * end (a filter per stroke, or a canvas that is read back, costs seconds).
 */
function tile(strokes: (ctx: CanvasRenderingContext2D, rnd: () => number, wrap: Wrap) => void, blur: number, seed: number) {
  const N = 512;
  const PAD = 16;
  const sheet = (size: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    return [canvas, canvas.getContext("2d")!] as const;
  };
  const rnd = random(seed);
  const around = [-N, 0, N];

  const [raw, draw] = sheet(N);
  draw.fillStyle = "rgb(128,0,0)";
  draw.fillRect(0, 0, N, N);
  // A stroke is repeated only across the edges it actually reaches.
  strokes(draw, rnd, (x, y, reach, paint) => {
    for (const dx of around)
      for (const dy of around) if (x + dx + reach > 0 && x + dx - reach < N && y + dy + reach > 0 && y + dy - reach < N) paint(dx, dy);
  });

  // The tile laid around itself, so the one blur wraps across its edges.
  const [wide, lay] = sheet(N + PAD * 2);
  for (const dx of around) for (const dy of around) lay.drawImage(raw, PAD + dx, PAD + dy);
  const [canvas, ctx] = sheet(N);
  if (blur > 0) ctx.filter = `blur(${blur}px)`;
  ctx.drawImage(wide, -PAD, -PAD);
  ctx.filter = "none";

  // Grain goes into green additively: no reading the canvas back.
  const [grain, speckle] = sheet(N);
  const image = speckle.createImageData(N, N);
  for (let i = 0; i < image.data.length; i += 4) {
    image.data[i + 1] = rnd() * 255;
    image.data[i + 3] = 255;
  }
  speckle.putImageData(image, 0, 0);
  ctx.globalCompositeOperation = "lighter";
  ctx.drawImage(grain, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  return texture;
}

/** Trowelled plaster: overlapping arcs, each a sweep of the float. */
const makePlaster = () =>
  tile(
    (ctx, rnd, wrap) => {
      ctx.lineCap = "round";
      for (let i = 0; i < 300; i++) {
        const x = rnd() * 512;
        const y = rnd() * 512;
        const radius = 30 + rnd() * 130;
        const from = rnd() * 6.28;
        const sweep = 0.5 + rnd() * 1.3;
        const width = 3 + rnd() * 26;
        ctx.lineWidth = width;
        ctx.strokeStyle = `rgba(${rnd() > 0.5 ? 255 : 0},0,0,${0.03 + rnd() * 0.09})`;
        wrap(x, y, radius + width, (dx, dy) => {
          ctx.beginPath();
          ctx.arc(x + dx, y + dy, radius, from, from + sweep);
          ctx.stroke();
        });
      }
    },
    1.4,
    7,
  );

/** Power-floated concrete: slow mottling, no pattern. */
const makeConcrete = () =>
  tile(
    (ctx, rnd, wrap) => {
      for (let i = 0; i < 220; i++) {
        const x = rnd() * 512;
        const y = rnd() * 512;
        const radius = 24 + rnd() * 110;
        const tone = rnd() > 0.5 ? 255 : 0;
        const alpha = 0.04 + rnd() * 0.1;
        wrap(x, y, radius, (dx, dy) => {
          const fill = ctx.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, radius);
          fill.addColorStop(0, `rgba(${tone},0,0,${alpha})`);
          fill.addColorStop(1, `rgba(${tone},0,0,0)`);
          ctx.fillStyle = fill;
          ctx.fillRect(x + dx - radius, y + dy - radius, radius * 2, radius * 2);
        });
      }
    },
    0,
    19,
  );

/* ── GLSL shared by every surface ──────────────────────────────────────── */

const COMMON = /* glsl */ `
uniform sampler2D uPlaster;
uniform sampler2D uConcrete;
uniform vec3 uFog;
uniform float uDim;
uniform float uFocus;
uniform float uEnd;
uniform float uTime;

const float TRACK_Y = 3.14;
const float TRACK_OUT = 1.05;
const float HALL_H = ${HALL.height.toFixed(3)};
const float HALF = ${HALL.half.toFixed(3)};
const float FRAME_D = ${HALL.depth.toFixed(4)};
const float BAR = ${HALL.bar.toFixed(4)};
const vec3 TEAL = vec3(0.0, 0.46, 0.38);

float sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
float fogAt(vec3 P) {
  float d = distance(P, cameraPosition) / 30.0;
  return 1.0 - exp(-d * d);
}
vec3 ambient() { return vec3(0.064, 0.078, 0.088) * (1.0 - 0.62 * uDim); }
/* No two lamps are the same colour temperature. */
vec3 warm(float seed) { return mix(vec3(1.0, 0.80, 0.58), vec3(1.0, 0.87, 0.70), fract(seed * 5.3)); }
vec3 spotAt(vec3 C, float seed) {
  return vec3(C.x - sign(C.x) * TRACK_OUT, TRACK_Y, C.z + (fract(seed * 7.13) - 0.5) * 0.12);
}
/* A point on the wall that holds C: p.x to the viewer's right, p.y up, depth into the room. */
vec3 onWall(vec3 C, vec2 p, float depth) {
  float side = sign(C.x);
  return vec3(C.x - side * depth, C.y + p.y, C.z + side * p.x);
}

/*
 * One picture light: a track spot off the wall, aimed (never quite truly) at
 * its print. Irradiance at P on a surface facing N. The beam is a little
 * elliptical and lopsided, with a faint spill ring, because real lamps are.
 * kind 1 is the wide wash on a title wall.
 */
float beam(vec3 P, vec3 N, vec3 C, float seed, float kind) {
  float j1 = fract(seed * 7.13), j2 = fract(seed * 3.71), j3 = fract(seed * 11.3);
  vec3 S = spotAt(C, seed);
  vec3 A = C + vec3(0.0, (j2 - 0.5) * 0.10 + 0.04, (j3 - 0.5) * 0.08);
  vec3 L = S - P;
  float d2 = dot(L, L);
  L *= inversesqrt(d2);
  vec3 ax = normalize(A - S);
  vec3 bx = normalize(cross(ax, vec3(0.0, 1.0, 0.0)));
  vec3 by = cross(bx, ax);
  float f = dot(-L, ax);
  vec2 q = vec2(dot(-L, bx), dot(-L, by)) / max(f, 1e-3);
  q.x *= mix(1.0, 0.27, kind) * (0.92 + 0.2 * j2);
  q.y *= 0.95 + 0.16 * j1;
  q.y += q.x * q.x * 0.5 * (j3 - 0.5);
  float r = length(q);
  float inner = mix(0.17, 0.22, kind), outer = mix(0.74, 1.3, kind);
  float cone = 1.0 - smoothstep(inner, outer, r);
  cone = cone * cone * (1.0 + 0.5 * cone) / 1.5;
  cone += 0.035 * (1.0 - smoothstep(outer * 0.8, outer * 1.9, r));
  return step(0.0, f) * cone * max(dot(N, L), 0.0) / d2 * mix(9.5, 8.0, kind) * (0.88 + 0.24 * j3);
}

/* Trowelled plaster under light raking down from above: albedo times relief. */
vec3 plaster(vec3 P, vec3 N, float rake) {
  vec2 uv = abs(N.x) > 0.5 ? P.zy : P.xy;
  vec2 up = uv + vec2(0.0, 0.01);
  float h = texture2D(uPlaster, uv * 0.66).r * 0.6 + texture2D(uPlaster, uv * 1.9 + 0.31).r * 0.4;
  float hu = texture2D(uPlaster, up * 0.66).r * 0.6 + texture2D(uPlaster, up * 1.9 + 0.31).r * 0.4;
  float grain = texture2D(uPlaster, uv * 4.1).g;
  return vec3(0.084, 0.100, 0.114) * (0.90 + 0.20 * h) * (0.95 + 0.10 * grain) * (1.0 + (h - hu) * 2.7 * rake);
}
/* A shadow-gap skirting at the floor, and the dark where wall meets ceiling. */
float wallAO(float y) {
  float gap = smoothstep(0.07, 0.082, y);
  return mix(0.12, 1.0, gap) * mix(0.6, 1.0, smoothstep(0.08, 0.6, y)) * mix(0.55, 1.0, smoothstep(HALL_H, HALL_H - 0.5, y));
}
/* The room behind the closed door is lit: its light leaks under the leaf and thins out across the end wall. */
float doorLeak(vec3 P) {
  vec2 q = vec2(abs(P.x) - 0.5, P.y - 2.15);
  float edge = q.y > 0.0 ? length(vec2(max(q.x, 0.0), q.y)) : abs(q.x);
  float sill = length(vec2(max(q.x, 0.0), P.y));
  return (0.006 / (edge * edge * 60.0 + 0.05) + 0.3 / (sill * sill * 22.0 + 0.2)) * step(P.z - uEnd, 0.3);
}
vec3 concrete(vec3 P) {
  vec2 uv = P.xz;
  float m = texture2D(uConcrete, uv * 0.11).r * 0.6 + texture2D(uConcrete, uv * 0.37 + 0.5).r * 0.4;
  float speck = texture2D(uConcrete, uv * 1.9).g;
  float joint = smoothstep(0.003, 0.008, abs(fract(P.z / 3.0) - 0.5) * 3.0 - 1.492);
  return vec3(0.046, 0.050, 0.052) * (0.7 + 0.6 * m) * (0.92 + 0.16 * speck) * mix(1.0, 0.45, joint);
}
`;

const FINISH = /* glsl */ `
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`;

/* Per-print instance data, shared by the pool, reflection, frame, face and lamp meshes. */
const PRINT = /* glsl */ `
attribute vec3 aCenter;
attribute vec4 aSize;   // outer half-size, image half-size
attribute vec4 aMisc;   // seed, kind (0 print, 1 title wash), oak, roll
attribute vec3 aTint;
attribute vec4 aTex;    // thumb layer, wall layer, thumb mix, wall mix
attribute float aHover;
varying vec3 vWorld;
varying vec3 vC;
varying vec4 vSize;
varying vec4 vMisc;
varying float vLit;
varying float vMe;
bool gone() { return abs(aCenter.z - cameraPosition.z) > 75.0; }
void instance() {
  vC = aCenter;
  vSize = aSize;
  vMisc = aMisc;
  vMe = 1.0 - step(0.5, abs(float(gl_InstanceID) - uFocus));
  vLit = mix(1.0 - 0.86 * uDim, 1.0, vMe) * (1.0 + 0.42 * aHover);
}
vec2 rolled(vec2 p) {
  float a = aMisc.w * (1.0 - uDim * vMe);
  return mat2(cos(a), sin(a), -sin(a), cos(a)) * p;
}
`;
const PRINT_IN = /* glsl */ `
varying vec3 vWorld;
varying vec3 vC;
varying vec4 vSize;
varying vec4 vMisc;
varying float vLit;
varying float vMe;
`;

const shell = {
  vertex: /* glsl */ `
    attribute float aKind;
    varying vec3 vWorld;
    varying vec3 vN;
    varying float vKind;
    void main() {
      vWorld = position;
      vN = normal;
      vKind = aKind;
      gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
    }`,
  fragment: /* glsl */ `
    ${COMMON}
    varying vec3 vWorld;
    varying vec3 vN;
    varying float vKind;
    void main() {
      vec3 P = vWorld;
      vec3 N = normalize(vN);
      vec3 V = normalize(cameraPosition - P);
      float toEnd = max(P.z - uEnd, 0.0);
      // Cool light from the far end: it leaks under the closed door and thins out up the hall.
      vec3 cool = TEAL * (0.010 + 0.07 * exp(-toEnd / 7.0) * exp(-P.y * 1.15)) * (0.55 - 0.45 * N.z);
      vec3 light = ambient() + cool * (1.0 - 0.5 * uDim);
      vec3 col;
      if (vKind < 0.5) {
        // Walls across the hall darken into their corners.
        float corner = abs(N.z) > 0.5 ? mix(0.45, 1.0, smoothstep(0.0, 1.1, HALF - abs(P.x))) : 1.0;
        col = plaster(P, N, 0.35) * wallAO(P.y) * light * corner;
        col += plaster(P, N, 1.0) * TEAL * doorLeak(P) * 1.6;
      } else if (vKind < 1.5) {
        float edge = mix(0.5, 1.0, smoothstep(0.0, 0.7, HALF - abs(P.x)));
        col = concrete(P) * light * edge;
        float leak = exp(-toEnd * 1.6) * exp(-pow(P.x / (0.5 + toEnd * 0.2), 2.0));
        col += concrete(P) * TEAL * leak * 1.2;
        // Polished, not mirrored: a long cool sheen toward the vanishing point.
        vec3 R = reflect(-V, vec3(0.0, 1.0, 0.0));
        float fres = 0.035 + 0.965 * pow(1.0 - max(V.y, 0.0), 5.0);
        float gloss = texture2D(uConcrete, P.xz * 0.37).r;
        float streak = exp(-pow(P.x / (0.45 + toEnd * 0.09), 2.0));
        col += TEAL * fres * pow(max(dot(R, normalize(vec3(0.0, 0.10, -1.0))), 0.0), 40.0) * (0.01 + 0.2 * streak * exp(-toEnd / 9.0)) * (0.6 + 0.8 * gloss);
      } else if (vKind < 2.5) {
        // Ceiling: matte black with two recessed lighting tracks.
        float track = abs(abs(P.x) - (HALF - TRACK_OUT));
        float slot = 1.0 - smoothstep(0.028, 0.034, track);
        float lip = (1.0 - smoothstep(0.034, 0.05, track)) * (1.0 - slot);
        float edge = mix(0.5, 1.0, smoothstep(0.0, 0.6, HALF - abs(P.x)));
        col = vec3(0.030, 0.034, 0.036) * light * edge * (1.0 - 0.9 * slot) * (1.0 + 0.6 * lip);
      } else if (vKind < 3.5) {
        // The closed door: painted steel, brushed top to bottom.
        float brush = texture2D(uPlaster, vec2(P.x * 6.0, P.y * 0.3)).g;
        col = vec3(0.040, 0.058, 0.062) * (0.85 + 0.3 * brush) * light * 2.2;
        col += TEAL * 0.012 * pow(1.0 - max(dot(N, V), 0.0), 3.0);
        col += vec3(0.05, 0.07, 0.075) * TEAL * doorLeak(P) * (abs(P.x) > 0.5 ? 1.6 : 0.25);
      } else {
        col = TEAL * 1.5;
      }
      gl_FragColor = vec4(mix(col, uFog, fogAt(P)), 1.0);
      ${FINISH}
    }`,
};

/*
 * The pool: what one lamp adds to the wall and floor around its print.
 * With MIRROR the same wall is drawn upside down under the floor, smeared by
 * the floor's polish: the cheap, blurred reflection.
 */
const pool = {
  vertex: /* glsl */ `
    ${COMMON}
    ${PRINT}
    varying vec3 vEdge;
    void main() {
      if (gone()) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
      instance();
      float side = sign(aCenter.x);
      float reach = mix(2.0, 3.9, aMisc.y);
      vec3 P = vec3(side * (HALF - 0.003), position.y * HALL_H, aCenter.z + position.x * reach);
      #ifdef MIRROR
        P.y = -P.y;
      #else
        if (position.z > 0.5) P = vec3(side * (HALF - position.y * 2.7), 0.003, P.z);
      #endif
      vEdge = position;
      vWorld = P;
      gl_Position = projectionMatrix * viewMatrix * vec4(P, 1.0);
    }`,
  fragment: /* glsl */ `
    ${COMMON}
    ${PRINT_IN}
    varying vec3 vEdge;
    void main() {
      float seed = vMisc.x, kind = vMisc.y;
      float side = sign(vC.x);
      vec3 N = vec3(-side, 0.0, 0.0);
      vec3 w = warm(seed);
      float fade = 1.0 - smoothstep(0.82, 1.0, abs(vEdge.x));
      vec3 col;
      #ifdef MIRROR
        vec3 P = vec3(vWorld.x, -vWorld.y, vWorld.z);
        vec3 toMirror = vWorld - cameraPosition;
        vec3 F = cameraPosition + toMirror * (cameraPosition.y / (cameraPosition.y - vWorld.y));
        float polish = texture2D(uConcrete, F.xz * 0.37).r;
        float smear = 0.3 + P.y;
        P.z += (polish - 0.5) * 0.22 * smear;
        P.y += (texture2D(uConcrete, F.xz * 0.9).g - 0.5) * 0.16 * smear;
        float I = beam(P, N, vC, seed, kind);
        col = vec3(0.084, 0.100, 0.114) * I * w;
        if (kind < 0.5) {
          float soft = 0.2 + 0.16 * P.y;
          float inside = 1.0 - smoothstep(-soft, soft, sdBox(vec2(P.z - vC.z, P.y - vC.y), vSize.xy - BAR));
          col = mix(col, vec3(0.5) * I * w, inside * 0.8);
        }
        vec3 V = normalize(cameraPosition - F);
        // Capped: far down the hall a polished floor still is not a mirror.
        float fres = min(0.07 + 0.93 * pow(1.0 - max(V.y, 0.0), 4.0), 0.4);
        col *= 1.25 * fres * (0.55 + 0.7 * polish) * (1.0 - fogAt(F)) * (1.0 - smoothstep(0.75, 1.0, vEdge.y));
      #else
        vec3 P = vWorld;
        if (vEdge.z < 0.5) {
          float I = beam(P, N, vC, seed, kind);
          if (kind < 0.5) {
            // The frame stands off the wall and throws a shadow down it.
            vec3 S = spotAt(vC, seed);
            vec3 Q = P + (S - P) * (FRAME_D / max(abs(S.x - P.x), 1e-3));
            I *= mix(0.12, 1.0, smoothstep(-0.014, 0.03, sdBox(vec2(Q.z - vC.z, Q.y - vC.y), vSize.xy)));
            I *= mix(0.72, 1.0, smoothstep(0.0, 0.06, sdBox(vec2(P.z - vC.z, P.y - vC.y), vSize.xy)));
          }
          col = plaster(P, N, 1.0) * wallAO(P.y) * I * w;
        } else {
          // Spill on the floor, and the lit wall bouncing back onto it.
          float I = beam(P, vec3(0.0, 1.0, 0.0), vC, seed, kind);
          float dz = P.z - vC.z;
          float bounce = 0.11 * exp(-(HALF - abs(P.x)) * 1.2) * exp(-dz * dz / mix(1.3, 5.0, kind));
          col = concrete(P) * (I + bounce) * w * (1.0 - smoothstep(0.7, 1.0, vEdge.y));
        }
        col *= 1.0 - fogAt(P);
      #endif
      gl_FragColor = vec4(col * fade * vLit, 1.0);
      ${FINISH}
    }`,
};

const frame = {
  vertex: /* glsl */ `
    ${COMMON}
    ${PRINT}
    attribute vec2 aCorner;
    attribute vec3 aShape;   // inset (0 outer edge, 1 inner), lift (0 wall, 1 front), bar (0 horizontal, 1 vertical)
    varying vec3 vN;
    varying vec3 vShape;
    varying vec2 vLocal;
    void main() {
      if (gone()) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
      instance();
      float side = sign(aCenter.x);
      vLocal = aCorner * (aSize.xy - aShape.x * BAR);
      vShape = aShape;
      vN = vec3(-side * normal.z, normal.y, side * normal.x);
      vWorld = onWall(aCenter, rolled(vLocal), aShape.y * FRAME_D);
      gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
    }`,
  fragment: /* glsl */ `
    ${COMMON}
    ${PRINT_IN}
    varying vec3 vN;
    varying vec3 vShape;
    varying vec2 vLocal;
    void main() {
      vec3 P = vWorld;
      vec3 N = normalize(vN);
      vec3 V = normalize(cameraPosition - P);
      vec3 L = normalize(spotAt(vC, vMisc.x) - P);
      float I = beam(P, N, vC, vMisc.x, 0.0);
      vec3 w = warm(vMisc.x);
      vec2 along = vShape.z < 0.5 ? vLocal : vLocal.yx;
      // Dark oak, grain running the length of each bar; or black satin lacquer.
      float grain = texture2D(uPlaster, vec2(along.x * 0.8, along.y * 16.0) + vMisc.x).r;
      float pore = texture2D(uPlaster, vec2(along.x * 2.0, along.y * 60.0) + vMisc.x).g;
      vec3 oak = vec3(0.052, 0.030, 0.017) * (0.55 + 0.9 * grain) * (0.85 + 0.3 * pore);
      vec3 albedo = mix(vec3(0.014, 0.014, 0.015), oak, vMisc.z);
      float spec = pow(max(dot(N, normalize(L + V)), 0.0), mix(70.0, 22.0, vMisc.z)) * mix(0.30, 0.10, vMisc.z);
      // The eased arris along each front edge catches a line of light.
      float arris = vShape.y > 0.99 ? smoothstep(0.78, 1.0, abs(vShape.x * 2.0 - 1.0)) * 0.035 : 0.0;
      vec3 col = albedo * (I * w + ambient()) + (spec + arris) * I * w;
      gl_FragColor = vec4(mix(col * vLit, uFog, fogAt(P)), 1.0);
      ${FINISH}
    }`,
};

/* Everything behind the glass: mat board, its bevelled window, the print, and the glazing itself. */
const face = {
  vertex: /* glsl */ `
    ${COMMON}
    ${PRINT}
    varying vec2 vLocal;
    varying vec3 vTint;
    varying vec4 vTex;
    void main() {
      if (gone()) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
      instance();
      vLocal = position.xy * (aSize.xy - BAR);
      vTint = aTint;
      vTex = aTex;
      vWorld = onWall(aCenter, rolled(vLocal), FRAME_D * 0.5);
      gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
    }`,
  fragment: /* glsl */ `
    ${COMMON}
    ${PRINT_IN}
    uniform sampler2DArray uThumbs;
    uniform sampler2DArray uWalls;
    varying vec2 vLocal;
    varying vec3 vTint;
    varying vec4 vTex;
    void main() {
      vec3 P = vWorld;
      float seed = vMisc.x;
      float side = sign(vC.x);
      vec3 N = vec3(-side, 0.0, 0.0);
      vec3 V = normalize(cameraPosition - P);
      vec3 w = warm(seed);
      float open = uDim * vMe;
      float I = beam(P, N, vC, seed, 0.0);
      // The frame's lip shades the top of the mat: follow the ray to the lamp up to the lip.
      vec3 S = spotAt(vC, seed);
      vec3 Q = P + (S - P) * (FRAME_D * 0.5 / max(abs(S.x - P.x), 1e-3));
      float lit = 1.0 - smoothstep(-0.002, 0.005, sdBox(vec2(Q.z - vC.z, Q.y - vC.y), vSize.xy - BAR));
      lit = mix(0.22, 1.0, lit);
      vec2 p = vLocal;
      vec2 win = vSize.zw;
      float d = sdBox(p, win);
      vec3 col;
      if (d > 0.0) {
        // Cotton mat board. Its window is cut at 45 degrees: the lower bevel faces the lamp, the upper turns away.
        float fibre = texture2D(uPlaster, p * 9.0 + seed).g;
        vec3 board = vec3(0.80, 0.785, 0.745) * (0.965 + 0.07 * fibre);
        float bevel = 1.0 - smoothstep(0.0038, 0.0048, d);
        float facing = (sdBox(p + vec2(0.0, 0.001), win) - d) / 0.001;
        board = mix(board, vec3(0.90, 0.895, 0.87) * (0.62 - 0.5 * facing), bevel);
        col = board * (I * w * lit + ambient());
      } else {
        vec2 uv = vec2(p.x / win.x, -p.y / win.y) * 0.5 + 0.5;
        vec3 image = mix(vTint, texture(uThumbs, vec3(uv, vTex.x)).rgb, vTex.z);
        image = mix(image, texture(uWalls, vec3(uv, vTex.y)).rgb, vTex.w);
        // The print lies a board's thickness behind the window: a hairline of shadow under the upper bevel.
        float sill = mix(0.5, 1.0, smoothstep(0.0, 0.006, win.y - p.y));
        // Open, the print is lit flat and neutral so the HTML image can take its place.
        vec3 lamp = mix(I * 0.74 * w * sill * lit + ambient() * 0.4, vec3(1.0), open);
        col = (image * 0.97 + 0.004 * (1.0 - open)) * lamp;
      }
      // Glazing: nothing head-on, a pale glare of the room at grazing angles.
      float fres = 0.04 + 0.96 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
      vec3 R = reflect(-V, N);
      vec3 room = uFog * 2.5 + vec3(1.0, 0.74, 0.47) * 0.07 * (0.5 + 0.5 * sin(R.z * 7.0 + P.z * 2.9)) * exp(-pow(R.y * 2.4, 2.0));
      col += room * (fres - 0.04) * (1.0 - open);
      gl_FragColor = vec4(mix(col * vLit, uFog, fogAt(P) * (1.0 - open)), 1.0);
      ${FINISH}
    }`,
};

/* Lettering on the wall: museum labels (a card, uCard 1) and wing titles (paint on plaster). */
const decal = {
  vertex: /* glsl */ `
    ${COMMON}
    attribute vec3 aCenter;
    attribute vec4 aSpot;    // centre and seed of the lamp that lights it
    attribute vec3 aHalf;    // half-size, owner print (-1 none)
    attribute vec2 aLayer;   // atlas layer, fade
    varying vec3 vWorld;
    varying vec2 vUv;
    varying vec4 vSpot;
    varying vec2 vLayer;
    varying float vLit;
    void main() {
      if (abs(aCenter.z - cameraPosition.z) > 75.0 || aLayer.y <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
      vUv = vec2(position.x, -position.y) * 0.5 + 0.5;
      vSpot = aSpot;
      vLayer = aLayer;
      vLit = mix(1.0 - 0.86 * uDim, 1.0, 1.0 - step(0.5, abs(aHalf.z - uFocus)));
      vWorld = onWall(aCenter, position.xy * aHalf.xy, 0.004);
      gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
    }`,
  fragment: /* glsl */ `
    ${COMMON}
    uniform sampler2DArray uText;
    uniform float uCard;
    varying vec3 vWorld;
    varying vec2 vUv;
    varying vec4 vSpot;
    varying vec2 vLayer;
    varying float vLit;
    void main() {
      vec3 P = vWorld;
      vec3 N = vec3(-sign(P.x), 0.0, 0.0);
      vec4 text = texture(uText, vec3(vUv, vLayer.x));
      vec3 light = beam(P, N, vSpot.xyz, vSpot.w, 1.0 - uCard) * warm(vSpot.w) + ambient();
      vec3 col;
      float alpha;
      if (uCard > 0.5) {
        col = mix(vec3(0.70, 0.69, 0.655), vec3(0.03), text.r) * light;
        alpha = vLayer.y;
      } else {
        // Paint sits thinner on the high spots of the trowel work.
        float tooth = texture2D(uPlaster, P.zy * 3.3).g;
        float ink = text.r + text.g;
        col = mix(vec3(0.74, 0.75, 0.73), vec3(0.95, 0.54, 0.0), text.g / max(ink, 1e-3)) * light * wallAO(P.y);
        alpha = min(ink, 1.0) * vLayer.y * (0.84 + 0.16 * tooth);
      }
      gl_FragColor = vec4(mix(col * vLit, uFog, fogAt(P)), alpha);
      ${FINISH}
    }`,
};

/* The lamp heads on the ceiling track: black cans with a warm lens. */
const lamp = {
  vertex: /* glsl */ `
    ${COMMON}
    ${PRINT}
    varying vec3 vLocal;
    varying vec3 vN;
    void main() {
      if (gone()) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
      instance();
      vLocal = position;
      vN = normal;
      vec3 S = spotAt(aCenter, aMisc.x);
      vWorld = vec3(S.x, HALL_H - 0.085, S.z) + position;
      gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
    }`,
  fragment: /* glsl */ `
    ${COMMON}
    ${PRINT_IN}
    varying vec3 vLocal;
    varying vec3 vN;
    void main() {
      float lens = vN.y < -0.5 ? 1.0 - smoothstep(0.016, 0.024, length(vLocal.xz)) : 0.0;
      vec3 col = vec3(0.008) + warm(vMisc.x) * lens * 2.2 * vLit;
      gl_FragColor = vec4(mix(col, uFog, fogAt(vWorld)), 1.0);
      ${FINISH}
    }`,
};

/* Dust: only ever seen where it drifts through a beam, near the camera. */
const dust = {
  vertex: /* glsl */ `
    ${COMMON}
    uniform vec4 uSpots[4];
    uniform float uPx;
    attribute float aSeed;
    varying float vGlow;
    void main() {
      vec3 box = vec3(5.6, 2.9, 11.0);
      vec3 p = position * box + vec3(sin(uTime * 0.05 + aSeed * 40.0) * 0.4, -uTime * 0.012 * (0.4 + aSeed), cos(uTime * 0.04 + aSeed * 31.0) * 0.4);
      p.xz = mod(p.xz - cameraPosition.xz, box.xz) - box.xz * 0.5 + cameraPosition.xz;
      p.y = mod(p.y, box.y) + 0.2;
      float glow = 0.0;
      for (int i = 0; i < 4; i++) {
        if (uSpots[i].w < 0.0) continue;
        glow += beam(p, normalize(spotAt(uSpots[i].xyz, uSpots[i].w) - p), uSpots[i].xyz, uSpots[i].w, 0.0);
      }
      vec4 mv = viewMatrix * vec4(p, 1.0);
      vGlow = min(glow * 0.02, 0.22) * smoothstep(6.5, 2.0, -mv.z) * smoothstep(0.15, 0.5, -mv.z) * (1.0 - uDim) * step(abs(p.x), HALF - 0.05);
      gl_PointSize = clamp(uPx * (0.0035 + 0.004 * aSeed) / max(-mv.z, 0.1), 1.0, 3.0);
      gl_Position = projectionMatrix * mv;
    }`,
  fragment: /* glsl */ `
    varying float vGlow;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      gl_FragColor = vec4(vec3(1.0, 0.82, 0.62) * vGlow * (1.0 - smoothstep(0.2, 0.5, d)), 1.0);
      ${FINISH}
    }`,
};

/* ── Materials ─────────────────────────────────────────────────────────── */

export interface HallMaterials {
  uniforms: Record<"uDim" | "uFocus" | "uEnd" | "uTime" | "uPx", { value: number }> & { uSpots: { value: THREE.Vector4[] } };
  shell: THREE.ShaderMaterial;
  pool: THREE.ShaderMaterial;
  mirror: THREE.ShaderMaterial;
  frame: THREE.ShaderMaterial;
  face: THREE.ShaderMaterial;
  label: THREE.ShaderMaterial;
  title: THREE.ShaderMaterial;
  lamp: THREE.ShaderMaterial;
  dust: THREE.ShaderMaterial;
  dispose(): void;
}

export function makeMaterials(textures: Record<"thumbs" | "walls" | "labels" | "titles", THREE.Texture>): HallMaterials {
  const plaster = makePlaster();
  const concrete = makeConcrete();
  const uniforms = {
    uPlaster: { value: plaster },
    uConcrete: { value: concrete },
    uFog: { value: FOG },
    uDim: { value: 0 },
    uFocus: { value: -1 },
    uEnd: { value: 0 },
    uTime: { value: 0 },
    uPx: { value: 1000 },
    uSpots: { value: [0, 1, 2, 3].map(() => new THREE.Vector4(0, 0, 0, -1)) },
    uThumbs: { value: textures.thumbs },
    uWalls: { value: textures.walls },
  };
  const make = (source: { vertex: string; fragment: string }, options: THREE.ShaderMaterialParameters = {}) =>
    new THREE.ShaderMaterial({ uniforms, vertexShader: source.vertex, fragmentShader: source.fragment, ...options });
  // Light is added to what is already there; lettering lies on the wall without fighting it for depth.
  // DoubleSide: the strip's winding flips with the wall it lies on, and again when mirrored.
  const added = { blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 } as const;
  const lettering = { transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 } as const;
  const text = (card: number, atlas: THREE.Texture) =>
    new THREE.ShaderMaterial({
      uniforms: { ...uniforms, uText: { value: atlas }, uCard: { value: card } },
      vertexShader: decal.vertex,
      fragmentShader: decal.fragment,
      ...lettering,
    });
  const materials = {
    shell: make(shell),
    pool: make(pool, { ...added, transparent: true }),
    // Drawn straight after the floor and before the walls, so the walls cover whatever spills past it.
    mirror: make(pool, { ...added, defines: { MIRROR: "" }, depthTest: false }),
    frame: make(frame, { side: THREE.DoubleSide }),
    face: make(face),
    label: text(1, textures.labels),
    title: text(0, textures.titles),
    lamp: make(lamp),
    dust: make(dust, { blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }),
  };
  return {
    uniforms,
    ...materials,
    dispose() {
      plaster.dispose();
      concrete.dispose();
      for (const material of Object.values(materials)) material.dispose();
    },
  };
}

/* ── Geometry ──────────────────────────────────────────────────────────── */

type V3 = [number, number, number];

/** The room itself, as two meshes: the floor (drawn first, under the reflections) and everything else. */
export function buildShell(plan: HallPlan) {
  const make = () => ({ position: [] as number[], normal: [] as number[], kind: [] as number[] });
  const floor = make();
  const rest = make();
  const quad = (into: ReturnType<typeof make>, a: V3, b: V3, c: V3, d: V3, n: V3, kind: number) => {
    for (const v of [a, b, c, a, c, d]) {
      into.position.push(...v);
      into.normal.push(...n);
      into.kind.push(kind);
    }
  };
  /** A box by its corners; `kind` paints every face. */
  const box = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, kind: number) => {
    quad(rest, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1], kind);
    quad(rest, [x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [0, 0, -1], kind);
    quad(rest, [x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [1, 0, 0], kind);
    quad(rest, [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [-1, 0, 0], kind);
    quad(rest, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0], kind);
  };

  const W = HALL.half;
  const H = HALL.height;
  const near = -HALL.back;
  const far = -plan.end;
  quad(floor, [-W, 0, near], [W, 0, near], [W, 0, far], [-W, 0, far], [0, 1, 0], 1);
  quad(rest, [-W, H, far], [W, H, far], [W, H, near], [-W, H, near], [0, -1, 0], 2);
  quad(rest, [-W, 0, far], [-W, 0, near], [-W, H, near], [-W, H, far], [1, 0, 0], 0);
  quad(rest, [W, 0, near], [W, 0, far], [W, H, far], [W, H, near], [-1, 0, 0], 0);
  quad(rest, [W, 0, near], [-W, 0, near], [-W, H, near], [W, H, near], [0, 0, -1], 0);
  quad(rest, [-W, 0, far], [W, 0, far], [W, H, far], [-W, H, far], [0, 0, 1], 0);

  // Wide doorways between wings.
  for (const wing of plan.wings.slice(1)) {
    const z0 = -wing.s0;
    const z1 = z0 + HALL.portal;
    box(-W, -W + HALL.jamb, 0, H, z0, z1, 0);
    box(W - HALL.jamb, W, 0, H, z0, z1, 0);
    box(-W + HALL.jamb, W - HALL.jamb, HALL.head, H, z0, z1, 0);
  }

  // The closed door at the end: architrave, leaf, lever, and the line of light under it.
  box(-0.57, -0.5, 0, 2.22, far, far + 0.04, 3);
  box(0.5, 0.57, 0, 2.22, far, far + 0.04, 3);
  box(-0.57, 0.57, 2.15, 2.22, far, far + 0.04, 3);
  box(-0.5, 0.5, 0.014, 2.15, far, far + 0.018, 3);
  box(0.33, 0.45, 1.02, 1.042, far + 0.018, far + 0.07, 3);
  quad(rest, [-0.5, 0, far + 0.019], [0.5, 0, far + 0.019], [0.5, 0.014, far + 0.019], [-0.5, 0.014, far + 0.019], [0, 0, 1], 4);

  const geometry = (data: ReturnType<typeof make>) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(data.position, 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(data.normal, 3));
    g.setAttribute("aKind", new THREE.Float32BufferAttribute(data.kind, 1));
    return g;
  };
  return { floor: geometry(floor), rest: geometry(rest) };
}

/** One frame: four mitred bars, each with a front, an outer side and an inner lip. Sized per instance in the shader. */
export function buildFrame() {
  const corner: number[] = [];
  const shape: number[] = [];
  const normal: number[] = [];
  const corners = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ];
  const outward = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];
  for (let k = 0; k < 4; k++) {
    const a = corners[k];
    const b = corners[(k + 1) % 4];
    const [nx, ny] = outward[k];
    const bar = k % 2;
    // Each face: two corners at one (inset, lift), two at another.
    const faces: [number, number, number, number, V3][] = [
      [0, 1, 1, 1, [0, 0, 1]],
      [0, 0, 0, 1, [nx, ny, 0]],
      [1, 1, 1, 0.5, [-nx, -ny, 0]],
    ];
    for (const [inset0, lift0, inset1, lift1, n] of faces) {
      const verts = [
        [a, inset0, lift0],
        [b, inset0, lift0],
        [b, inset1, lift1],
        [a, inset0, lift0],
        [b, inset1, lift1],
        [a, inset1, lift1],
      ] as const;
      for (const [c, inset, lift] of verts) {
        corner.push(c[0], c[1]);
        shape.push(inset, lift, bar);
        normal.push(...n);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array((corner.length / 2) * 3), 3));
  g.setAttribute("aCorner", new THREE.Float32BufferAttribute(corner, 2));
  g.setAttribute("aShape", new THREE.Float32BufferAttribute(shape, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(normal, 3));
  return g;
}

/** The pool's footprint: a strip of wall (z = 0) and a strip of floor in front of it (z = 1). */
export function buildPool(withFloor: boolean) {
  const position = [-1, 0, 0, 1, 0, 0, 1, 1, 0, -1, 0, 0, 1, 1, 0, -1, 1, 0];
  if (withFloor) position.push(-1, 0, 1, 1, 1, 1, 1, 0, 1, -1, 0, 1, -1, 1, 1, 1, 1, 1);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(position, 3));
  return g;
}
