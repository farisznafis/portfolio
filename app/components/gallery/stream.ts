/**
 * Texture streaming for the hall.
 *
 * Prints are instanced, so their pictures live in texture arrays: one layer
 * ("slot") per print that is near enough to see. Only a window around the
 * camera holds slots: 256 px thumbnails first, the 1024 px wall texture once
 * the camera is close, labels and wing titles drawn on demand. Each array is
 * a fixed GPU budget; when it is full the slot of whatever is farthest away
 * is reused. Nothing pops: a new layer starts at mix 0 and fades in, and a
 * slot is only taken from a print that is out of sight.
 */
import * as THREE from "three";
import { lowerBound, type HallPlan, type Print, type Wing } from "./plan";

/** Metres: thumbnails and labels load this far ahead of and behind the camera. */
const AHEAD = 30;
const BEHIND = 15;
/** The 1024 px texture loads inside this range (a 1 m print is then over 256 px tall on screen). */
const NEAR_AHEAD = 8;
const NEAR_BEHIND = 4;
const FADE = 0.55;

const MB = 1024 * 1024;
const bytes = (w: number, h: number) => (w * h * 4 * 4) / 3; // RGBA8 with its mip chain

export interface Budget {
  /** Total GPU memory for the four arrays. */
  bytes: number;
  thumbs: number;
  labels: number;
  titles: number;
}
export const BUDGET: Record<"high" | "low", Budget> = {
  high: { bytes: 168 * MB, thumbs: 112, labels: 72, titles: 4 },
  low: { bytes: 56 * MB, thumbs: 64, labels: 40, titles: 2 },
};

/** A texture array whose layers are written one at a time, straight from an image or canvas. */
class SlotArray {
  readonly texture: THREE.DataArrayTexture;
  /** slot -> item, item -> slot; -1 is empty. */
  readonly owner: Int32Array;
  readonly slot: Int32Array;

  constructor(
    private renderer: THREE.WebGLRenderer,
    readonly width: number,
    readonly height: number,
    slots: number,
    items: number,
    srgb: boolean,
  ) {
    const texture = new THREE.DataArrayTexture(null, width, height, slots);
    texture.format = THREE.RGBAFormat;
    texture.type = THREE.UnsignedByteType;
    texture.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true; // allocates the full chain; layers are filled by put()
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    texture.source.dataReady = false;
    texture.needsUpdate = true;
    renderer.initTexture(texture);
    this.texture = texture;
    this.owner = new Int32Array(slots).fill(-1);
    this.slot = new Int32Array(items).fill(-1);
  }

  /** A free slot, else the slot of the item `distance` puts farthest away beyond `keep`; -1 if every slot is in use nearby. */
  take(item: number, distance: (item: number) => number, keep: number, evicted: (item: number) => void) {
    let best = -1;
    let far = keep;
    for (let s = 0; s < this.owner.length; s++) {
      const current = this.owner[s];
      if (current < 0) {
        best = s;
        break;
      }
      const d = distance(current);
      if (d > far) {
        far = d;
        best = s;
      }
    }
    if (best < 0) return -1;
    const previous = this.owner[best];
    if (previous >= 0) {
      this.slot[previous] = -1;
      evicted(previous);
    }
    this.owner[best] = item;
    this.slot[item] = best;
    return best;
  }

  put(slot: number, source: TexImageSource) {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const handle = (this.renderer.properties.get(this.texture) as { __webglTexture: WebGLTexture }).__webglTexture;
    this.renderer.state.bindTexture(gl.TEXTURE_2D_ARRAY, handle);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, slot, this.width, this.height, 1, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.generateMipmap(gl.TEXTURE_2D_ARRAY);
  }

  clear() {
    this.owner.fill(-1);
    this.slot.fill(-1);
  }
}

export type Loader = (print: Print, size: 256 | 1024) => Promise<TexImageSource>;
export interface Painters {
  /** null when the photo has nothing to put on a label. */
  label(print: Print): HTMLCanvasElement | null;
  title(wing: Wing): HTMLCanvasElement;
}

export const LABEL_PX = { w: 384, h: 192 };
export const TITLE_PX = { w: 2048, h: 512 };

export class Streamer {
  readonly thumbs: SlotArray;
  readonly walls: SlotArray;
  readonly labels: SlotArray;
  readonly titles: SlotArray;
  /** Per print: thumb layer, wall layer, thumb mix, wall mix. */
  readonly tex: Float32Array;
  /** Per print and per wing: layer, fade. */
  readonly labelLayer: Float32Array;
  readonly titleLayer: Float32Array;
  /** The window of `plan.order` that currently holds textures. */
  lo = 0;
  hi = 0;
  painters: Painters | null = null;
  onLoad: () => void = () => {};

  private busy = new Uint8Array(0);
  private retry: Float64Array;
  private blank: Uint8Array;
  private flights = 0;
  private dead = false;
  private scratch = document.createElement("canvas");

  constructor(
    renderer: THREE.WebGLRenderer,
    private plan: HallPlan,
    private load: Loader,
    budget: Budget,
  ) {
    const n = plan.prints.length;
    const fixed = budget.thumbs * bytes(256, 256) + budget.labels * bytes(LABEL_PX.w, LABEL_PX.h) + budget.titles * bytes(TITLE_PX.w, TITLE_PX.h);
    const walls = Math.max(2, Math.floor((budget.bytes - fixed) / bytes(1024, 1024)));
    this.thumbs = new SlotArray(renderer, 256, 256, budget.thumbs, n, true);
    this.walls = new SlotArray(renderer, 1024, 1024, walls, n, true);
    this.labels = new SlotArray(renderer, LABEL_PX.w, LABEL_PX.h, budget.labels, n, false);
    this.titles = new SlotArray(renderer, TITLE_PX.w, TITLE_PX.h, budget.titles, plan.wings.length, false);
    this.tex = new Float32Array((n + plan.wings.length) * 4);
    this.labelLayer = new Float32Array(n * 2);
    this.titleLayer = new Float32Array(plan.wings.length * 2);
    this.busy = new Uint8Array(n * 2);
    this.retry = new Float64Array(n);
    this.blank = new Uint8Array(n);
  }

  /** Language changed: every label and title is redrawn (and fades in again). */
  resetText(painters: Painters) {
    this.painters = painters;
    this.labels.clear();
    this.titles.clear();
    this.labelLayer.fill(0);
    this.titleLayer.fill(0);
    this.blank.fill(0);
  }

  /** Call every frame with the camera's place along the hall. Returns true while anything is still fading in. */
  update(at: number, dt: number) {
    const { prints, wings, order, along } = this.plan;
    const { tex, labelLayer, titleLayer } = this;
    const distance = (i: number) => Math.abs(prints[i].s - at);
    this.lo = lowerBound(along, at - BEHIND);
    this.hi = lowerBound(along, at + AHEAD);
    const step = dt / FADE;
    let fading = false;
    let painted = 0;
    const want: [number, number, number][] = []; // distance, print, kind (0 thumb, 1 wall)

    for (let k = this.lo; k < this.hi; k++) {
      const i = order[k];
      const ahead = prints[i].s - at;
      const near = ahead > -NEAR_BEHIND && ahead < NEAR_AHEAD;
      const waiting = performance.now() < this.retry[i];
      if (this.thumbs.slot[i] < 0 && !this.busy[i * 2] && !waiting) want.push([Math.abs(ahead), i, 0]);
      if (near && this.walls.slot[i] < 0 && !this.busy[i * 2 + 1] && !waiting) want.push([Math.abs(ahead) + 0.5, i, 1]);

      // Fades. The thumbnail leads; the wall texture crosses over it.
      for (const kind of [0, 1]) {
        const has = (kind ? this.walls : this.thumbs).slot[i] >= 0;
        const mix = tex[i * 4 + 2 + kind];
        if (has && mix < 1) {
          tex[i * 4 + 2 + kind] = Math.min(1, mix + step);
          fading = true;
        }
      }
      if (this.labels.slot[i] >= 0 && labelLayer[i * 2 + 1] < 1) {
        labelLayer[i * 2 + 1] = Math.min(1, labelLayer[i * 2 + 1] + step);
        fading = true;
      }
      // Labels are drawn here, a couple a frame.
      if (this.painters && this.labels.slot[i] < 0 && !this.blank[i] && Math.abs(ahead) < 16 && painted < 2) {
        const canvas = this.painters.label(prints[i]);
        if (!canvas) this.blank[i] = 1;
        else {
          const slot = this.labels.take(i, distance, 18, (old) => (labelLayer[old * 2 + 1] = 0));
          if (slot >= 0) {
            this.labels.put(slot, canvas);
            labelLayer[i * 2] = slot;
            labelLayer[i * 2 + 1] = 0;
            painted++;
            fading = true;
          }
        }
      }
    }

    for (const wing of wings) {
      const w = wing.index;
      const away = Math.abs(wing.titleS - at);
      if (this.titles.slot[w] >= 0) {
        if (titleLayer[w * 2 + 1] < 1) {
          titleLayer[w * 2 + 1] = Math.min(1, titleLayer[w * 2 + 1] + step);
          fading = true;
        }
      } else if (this.painters && away < 45 && painted < 2) {
        const slot = this.titles.take(w, (other) => Math.abs(wings[other].titleS - at), 50, (old) => (titleLayer[old * 2 + 1] = 0));
        if (slot >= 0) {
          this.titles.put(slot, this.painters.title(wing));
          titleLayer[w * 2] = slot;
          titleLayer[w * 2 + 1] = 0;
          painted++;
          fading = true;
        }
      }
    }

    want.sort((a, b) => a[0] - b[0]);
    for (const [, i, kind] of want) {
      if (this.flights >= 6) break;
      this.fetch(i, kind, at);
    }
    return fading || this.flights > 0;
  }

  private fetch(i: number, kind: number, at: number) {
    const { prints } = this.plan;
    const array = kind ? this.walls : this.thumbs;
    this.busy[i * 2 + kind] = 1;
    this.flights++;
    this.load(prints[i], kind ? 1024 : 256)
      .then((source) => {
        if (this.dead) return;
        // A wall texture is kept until its print is well behind; a thumbnail until it leaves the window.
        const slot = array.take(i, (other) => Math.abs(prints[other].s - at), kind ? NEAR_AHEAD + 3 : AHEAD + 4, (old) => (this.tex[old * 4 + 2 + kind] = 0));
        if (slot < 0) return;
        const { scratch } = this;
        scratch.width = array.width;
        scratch.height = array.height;
        // Stretched to fill the layer on a GPU canvas; the shader maps it back to the print's own proportions.
        // (createImageBitmap with resize options was measured: no faster on entry, and it stalls a fast walk.)
        scratch.getContext("2d")!.drawImage(source as CanvasImageSource, 0, 0, array.width, array.height);
        array.put(slot, scratch);
        this.tex[i * 4 + kind] = slot;
        this.tex[i * 4 + 2 + kind] = 0;
        this.onLoad();
      })
      .catch(() => {
        this.retry[i] = performance.now() + 5000;
      })
      .finally(() => {
        this.busy[i * 2 + kind] = 0;
        this.flights--;
      });
  }

  dispose() {
    this.dead = true;
    for (const array of [this.thumbs, this.walls, this.labels, this.titles]) array.texture.dispose();
  }
}

/** Fetch and decode off the main thread. */
export async function loadImage(url: string): Promise<TexImageSource> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return createImageBitmap(await response.blob(), { premultiplyAlpha: "none", colorSpaceConversion: "none" });
}
