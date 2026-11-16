/**
 * The press: bakes one printed face into two textures.
 *
 *   map  - what the eye sees (sRGB): stock, flat inks, foil colour
 *   data - what the light feels (linear): R = height, G = roughness, B = metalness
 *
 * A face is printed like letterpress. Each ink is a separate pass with its
 * own mask, pressed a hair out of register with the others. Ink is thinner in
 * the middle and darker at the rim where it was squeezed out, every pass
 * leaves an impression in the stock, and foil only takes where it took.
 */
import * as THREE from "three";
import type { Lang } from "../../types/common";

export type InkName = "black" | "teal" | "night" | "foil" | "blind" | "score";
export type Draw = (ctx: CanvasRenderingContext2D) => void;
/** Print one pass: everything `draw` fills or strokes becomes that ink. */
export type Layers = (ink: InkName, draw: Draw) => void;
export type Painter = (L: Layers, T: Type) => void;
export type Base = "paper" | "cloth";

/** A face to print. (x0, y0) is its top-left in the painter's units (cm, y down). */
export interface Art {
  base: Base;
  x0: number;
  y0: number;
  w: number;
  h: number;
  paint?: Painter;
}
export interface Baked {
  map: THREE.CanvasTexture;
  data: THREE.CanvasTexture;
}

/* ── Type ──────────────────────────────────────────────────────────────── */

export interface TextOpts {
  /** Font size in cm. */
  size: number;
  role?: "display" | "body" | "mono";
  weight?: number;
  align?: CanvasTextAlign;
  /** Letter spacing in em. */
  track?: number;
  /** Wrap width in cm. */
  width?: number;
  lead?: number;
  upper?: boolean;
}
export interface Type {
  lang: Lang;
  families: string[];
  /** Draws wrapped text; returns the baseline of the line after the last one. */
  text(ctx: CanvasRenderingContext2D, s: string, x: number, y: number, o: TextOpts): number;
}

export function makeType(lang: Lang): Type {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string) => css.getPropertyValue(name).trim() || "sans-serif";
  const jp = v("--font-noto-sans-jp");
  const stack = (latin: string) => (lang === "ja" ? `${jp}, ${latin}` : `${latin}, ${jp}`);
  const fam = {
    display: stack(v("--font-space-grotesk")),
    body: stack(v("--font-geist")),
    mono: `${v("--font-jetbrains-mono")}, ${jp}`,
  };
  return {
    lang,
    families: [fam.display, fam.body, fam.mono],
    text(ctx, raw, x, y, o) {
      const s = o.upper ? raw.toUpperCase() : raw;
      const m = ctx.getTransform();
      const k = m.a;
      const px = o.size * k;
      ctx.save();
      // Draw in device pixels: sub-pixel font sizes under a scale transform are unreliable.
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.font = `${o.weight ?? 400} ${px}px ${fam[o.role ?? "body"]}`;
      ctx.textAlign = o.align ?? "left";
      ctx.textBaseline = "alphabetic";
      if ("letterSpacing" in ctx) ctx.letterSpacing = `${(o.track ?? 0) * px}px`;
      const lines: string[] = [];
      if (o.width) {
        // Latin words stay whole; CJK breaks per character.
        let line = "";
        for (const tok of s.match(/[\x21-\x7e -ɏ]+|\s+|./gu) ?? []) {
          if (line && ctx.measureText((line + tok).trimEnd()).width > o.width * k) {
            lines.push(line.trimEnd());
            line = tok.trim() ? tok : "";
          } else line += tok;
        }
        if (line.trim()) lines.push(line.trimEnd());
      } else lines.push(s);
      let yy = y;
      for (const line of lines) {
        ctx.fillText(line, m.a * x + m.e, m.d * yy + m.f);
        yy += (o.lead ?? 1.32) * o.size;
      }
      ctx.restore();
      return yy;
    },
  };
}

/** Site fonts are only fetched once something uses them; make sure the press has them. */
export async function loadFonts(type: Type, sample: string) {
  await document.fonts.ready;
  const jobs: Promise<unknown>[] = [];
  for (const family of type.families)
    for (const weight of [400, 500, 600, 700])
      jobs.push(document.fonts.load(`${weight} 24px ${family}`, sample).catch(() => undefined));
  await Promise.all(jobs);
}

/* ── Stock ─────────────────────────────────────────────────────────────── */

const NS = 256;
let white: Uint8Array | undefined;
let tooth: Uint8Array;
let blotch: Uint8Array;

/** Wrapped box blur of a tile, stretched back to the full 0..255 range. */
function soften(src: Uint8Array, r: number) {
  let a = Float32Array.from(src);
  for (let pass = 0; pass < 4; pass++) {
    const b = new Float32Array(NS * NS);
    const horizontal = pass % 2 === 0;
    for (let y = 0; y < NS; y++)
      for (let x = 0; x < NS; x++) {
        let sum = 0;
        for (let d = -r; d <= r; d++)
          sum += horizontal ? a[y * NS + ((x + d) & 255)] : a[((y + d) & 255) * NS + x];
        b[y * NS + x] = sum;
      }
    a = b;
  }
  let lo = Infinity;
  let hi = -Infinity;
  for (const value of a) {
    lo = Math.min(lo, value);
    hi = Math.max(hi, value);
  }
  return Uint8Array.from(a, (value) => ((value - lo) / (hi - lo)) * 255);
}

function initNoise() {
  if (white) return;
  // Seeded, so a still rendered twice is the same still.
  let seed = 0x2f6e2b1;
  const rnd = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  white = Uint8Array.from({ length: NS * NS }, () => rnd() * 256);
  tooth = soften(white, 1);
  blotch = soften(white, 7);
}

type RGB = [number, number, number];
const PAPER: RGB = [237, 230, 215];
const CLOTH: RGB = [10, 31, 35];
const CORE: RGB = [26, 150, 138];
const INKS: Record<"black" | "teal" | "night", RGB> = {
  black: [26, 27, 29],
  teal: [22, 128, 119],
  night: [12, 30, 36],
};
/** Foil: the amber token pulled towards real gold, so it reads as metal and not as yellow. */
const GOLD: RGB = (() => {
  const c = new THREE.Color("#ffc700").lerp(new THREE.Color().setRGB(1, 0.84, 0.58), 0.3);
  const hex = c.getHex();
  return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255];
})();

/** Registration error per ink, in pixels. */
const REGISTER: Record<InkName, [number, number]> = {
  black: [0, 0],
  night: [0, 0],
  teal: [0.7, -0.45],
  foil: [-0.5, 0.55],
  blind: [0, 0],
  score: [0, 0],
};

let scratchA: HTMLCanvasElement | undefined;
let scratchB: HTMLCanvasElement | undefined;

export function bake(art: Art, ppc: number, T: Type, into?: Baked): Baked {
  initNoise();
  const w = Math.max(8, Math.round(art.w * ppc));
  const h = Math.max(8, Math.round(art.h * ppc));
  const mapCanvas = (into?.map.image as HTMLCanvasElement) ?? document.createElement("canvas");
  const dataCanvas = (into?.data.image as HTMLCanvasElement) ?? document.createElement("canvas");
  mapCanvas.width = dataCanvas.width = w;
  mapCanvas.height = dataCanvas.height = h;
  const col = new Uint8ClampedArray(w * h * 4);
  const dat = new Uint8ClampedArray(w * h * 4);
  const wh = white as Uint8Array;

  // Stock.
  // Four pixels per thread: divides the 256px noise tile, so cloth tiles without a seam.
  const pitch = 4;
  for (let y = 0, i = 0; y < h; y++)
    for (let x = 0; x < w; x++, i += 4) {
      const n = (x & 255) + ((y & 255) << 8);
      const n1 = wh[n] / 255;
      if (art.base === "paper") {
        const bl = blotch[((x >> 1) & 255) + (((y >> 1) & 255) << 8)] / 255;
        const t = tooth[n] / 255;
        const fibre = n1 > 0.992 ? 0.93 : 1;
        const k = (0.955 + 0.06 * bl + 0.03 * (t - 0.5)) * fibre;
        col[i] = PAPER[0] * k;
        col[i + 1] = PAPER[1] * k;
        col[i + 2] = PAPER[2] * (k - 0.02 * (1 - bl));
        dat[i] = 128 + (t - 0.5) * 64 + (bl - 0.5) * 20;
        dat[i + 1] = 232 + n1 * 14;
      } else {
        // Plain weave: warp and weft take turns on top.
        const cx = Math.floor(x / pitch);
        const cy = Math.floor(y / pitch);
        const warp = ((cx + cy) & 1) === 0;
        const f = warp ? x / pitch - cx : y / pitch - cy;
        const thread = wh[warp ? (cx * 7) & 255 : ((cy * 13) & 255) << 8] / 255;
        const rise = Math.sin(Math.PI * f) * (0.75 + 0.25 * n1);
        const k = (0.5 + 0.75 * rise) * (0.86 + 0.28 * thread);
        col[i] = CLOTH[0] * k;
        col[i + 1] = CLOTH[1] * k;
        col[i + 2] = CLOTH[2] * k;
        dat[i] = 70 + 150 * rise;
        dat[i + 1] = 205 + 30 * n1;
      }
      col[i + 3] = dat[i + 3] = 255;
    }

  // Ink passes.
  const a = (scratchA ??= document.createElement("canvas"));
  const b = (scratchB ??= document.createElement("canvas"));
  const blur = Math.max(1.2, ppc / 18);
  const press: Layers = (ink, draw) => {
    a.width = b.width = w;
    a.height = b.height = h;
    const ca = a.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
    const cb = b.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
    const [rx, ry] = REGISTER[ink];
    ca.setTransform(ppc, 0, 0, ppc, -art.x0 * ppc + rx, -art.y0 * ppc + ry);
    ca.fillStyle = ca.strokeStyle = "#000";
    ca.lineCap = ca.lineJoin = "round";
    draw(ca);
    cb.filter = `blur(${blur}px)`;
    cb.drawImage(a, 0, 0);
    const ma = ca.getImageData(0, 0, w, h).data;
    const mb = cb.getImageData(0, 0, w, h).data;
    const rgb = ink === "foil" ? GOLD : ink === "score" ? CORE : INKS[ink as "black"];
    for (let y = 0, i = 0; y < h; y++)
      for (let x = 0; x < w; x++, i += 4) {
        const m = ma[i + 3] / 255;
        const soft = mb[i + 3] / 255;
        if (m === 0 && soft === 0) continue;
        const n = (x & 255) + ((y & 255) << 8);
        const n1 = wh[(n + 7919) & 65535] / 255;
        if (ink === "blind") {
          dat[i] -= 170 * soft;
          dat[i + 1] -= 30 * soft;
          const k = 1 - 0.3 * soft;
          col[i] *= k;
          col[i + 1] *= k;
          col[i + 2] *= k;
        } else if (ink === "score") {
          // A tight fold cracks the face fibres: the core shows in flecks, the ridge stands proud.
          const fleck = n1 > 0.52 ? m * 0.55 : 0;
          col[i] += (rgb[0] - col[i]) * fleck;
          col[i + 1] += (rgb[1] - col[i + 1]) * fleck;
          col[i + 2] += (rgb[2] - col[i + 2]) * fleck;
          dat[i] += 60 * soft - 30 * fleck;
        } else if (ink === "foil") {
          // Tiny breaks: pinholes everywhere, ragged where the edge did not take.
          const took = n1 < 0.03 || (soft < 0.62 && n1 < 0.38) ? 0 : m;
          const streak = tooth[((x >> 2) & 255) + ((y & 255) << 8)] / 255;
          col[i] += (rgb[0] - col[i]) * took;
          col[i + 1] += (rgb[1] - col[i + 1]) * took;
          col[i + 2] += (rgb[2] - col[i + 2]) * took;
          dat[i] -= 115 * soft;
          dat[i + 1] += (28 + 42 * streak - dat[i + 1]) * took;
          dat[i + 2] = Math.max(dat[i + 2], 255 * took);
        } else {
          const bl = blotch[((x >> 1) & 255) + (((y >> 1) & 255) << 8)] / 255;
          const rim = Math.min(1, m * (1 - soft) * 2.2);
          const salt = n1 < 0.03 ? 0.4 : 1;
          const cover = Math.min(1, m * (0.86 + 0.1 * bl + 0.3 * rim) * salt);
          const dark = 1 - 0.38 * rim;
          col[i] += (rgb[0] * dark - col[i]) * cover;
          col[i + 1] += (rgb[1] * dark - col[i + 1]) * cover;
          col[i + 2] += (rgb[2] * dark - col[i + 2]) * cover;
          dat[i] -= 62 * soft;
          dat[i + 1] += (176 - dat[i + 1]) * cover;
        }
      }
  };
  art.paint?.(press, T);

  (mapCanvas.getContext("2d") as CanvasRenderingContext2D).putImageData(new ImageData(col, w, h), 0, 0);
  (dataCanvas.getContext("2d") as CanvasRenderingContext2D).putImageData(new ImageData(dat, w, h), 0, 0);

  if (into) {
    into.map.needsUpdate = into.data.needsUpdate = true;
    return into;
  }
  const map = new THREE.CanvasTexture(mapCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  const data = new THREE.CanvasTexture(dataCanvas);
  for (const texture of [map, data]) {
    texture.anisotropy = 8;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  }
  return { map, data };
}
