/**
 * The hall, computed from the data. Nothing here is placed by hand: adding a
 * photo or a series changes the JSON and the building follows.
 *
 * `s` is metres walked from the first wing's threshold; the hall runs down
 * world -Z, so z = -s. The left wall is x = -HALL.half, the right x = +HALL.half.
 */
import type { Gallery, GalleryPhoto, GallerySeries } from "../../types/gallery";

export const HALL = {
  half: 3,
  height: 3.3,
  eye: 1.55,
  /** Where the camera stands at scroll 0, and the entrance wall behind it. */
  start: -2.6,
  back: -5,
  /** Page pixels scrolled per metre walked. */
  px: 220,
  /** Frame bar width, mat margin, and how far the frame stands off the wall. */
  bar: 0.022,
  mat: 0.11,
  depth: 0.034,
  gap: 1.2,
  titleWidth: 4.4,
  titleHeight: 1.1,
  /** Doorways between wings: jambs this wide, a header this low, this thick. */
  jamb: 0.75,
  head: 2.7,
  portal: 0.4,
  label: { w: 0.16, h: 0.08 },
} as const;

export interface Print {
  index: number;
  photo: GalleryPhoto;
  series: GallerySeries;
  wing: number;
  /** -1 left wall, +1 right wall. */
  side: -1 | 1;
  s: number;
  y: number;
  /** Image half-size and outer frame half-size, metres. */
  iw: number;
  ih: number;
  hw: number;
  hh: number;
  seed: number;
  /** A frame never hangs perfectly level. Radians. */
  roll: number;
  labelS: number;
  labelY: number;
}

export interface Wing {
  index: number;
  series: GallerySeries;
  s0: number;
  s1: number;
  titleS: number;
  first: number;
  count: number;
  oak: boolean;
}

export interface HallPlan {
  prints: Print[];
  wings: Wing[];
  /** The end wall with the closed door. */
  end: number;
  /** The last place the camera may stand. */
  last: number;
  /** Print indices by distance along the hall, and those distances. */
  order: Int32Array;
  along: Float32Array;
}

const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export function planHall(gallery: Gallery): HallPlan {
  const prints: Print[] = [];
  const wings: Wing[] = [];
  let s = 0;

  for (const series of gallery.series) {
    const photos = gallery.photos.filter((photo) => photo.seriesId === series.id);
    if (photos.length === 0) continue;
    const wing: Wing = { index: wings.length, series, s0: s, s1: s, titleS: s + 1.3 + HALL.titleWidth / 2, first: prints.length, count: photos.length, oak: wings.length % 2 === 1 };
    // The title takes the start of the left wall; the right wall hangs from the door.
    const cursor = { [-1]: s + 1.3 + HALL.titleWidth + 1.1, [1]: s + 1.7 };
    for (const photo of photos) {
      const ratio = photo.width / photo.height;
      // The long edge is fixed; the short edge follows the photo. Never cropped, never stretched.
      const iw = ratio >= 1 ? (ratio > 1.9 ? 1.35 : 0.95) / 2 : 0.52 * ratio;
      const ih = iw / ratio;
      const hw = iw + HALL.mat + HALL.bar;
      const hh = ih + HALL.mat + HALL.bar;
      // Walls take turns, so a short wing still hangs on both.
      const side = (prints.length - wing.first) % 2 === 0 ? 1 : -1;
      const seed = hash(prints.length + 1);
      const at = cursor[side] + hw;
      cursor[side] = at + hw + HALL.gap;
      const y = 1.5 + (hash(prints.length + 77) - 0.5) * 0.008;
      prints.push({
        index: prints.length,
        photo,
        series,
        wing: wing.index,
        side,
        s: at,
        y,
        iw,
        ih,
        hw,
        hh,
        seed,
        roll: (hash(prints.length + 191) - 0.5) * 0.006,
        // To the right of the work as you face it, bottom edges level.
        labelS: at - side * (hw + 0.1 + HALL.label.w / 2),
        labelY: y - hh + HALL.label.h / 2,
      });
    }
    wing.s1 = Math.max(cursor[-1], cursor[1]) - HALL.gap + 1.3;
    s = wing.s1 + HALL.portal;
    wings.push(wing);
  }

  const end = (wings.at(-1)?.s1 ?? 6) + 2.4;
  const order = Int32Array.from(prints.map((p) => p.index).sort((a, b) => prints[a].s - prints[b].s));

  if (process.env.NODE_ENV !== "production") {
    // Self-check: neighbours on one wall never touch, and nothing hangs in a doorway.
    for (const side of [-1, 1]) {
      const wall = [...order].map((i) => prints[i]).filter((p) => p.side === side);
      for (let i = 1; i < wall.length; i++)
        console.assert(wall[i].s - wall[i].hw - (wall[i - 1].s + wall[i - 1].hw) > 0.6, "gallery layout: frames overlap", wall[i - 1], wall[i]);
    }
    for (const p of prints) console.assert(p.s - p.hw > wings[p.wing].s0 && p.s + p.hw < wings[p.wing].s1, "gallery layout: frame outside its wing", p);
  }

  return { prints, wings, end, last: end - 3.4, order, along: Float32Array.from(order, (i) => prints[i].s) };
}

/** First position in `along` that is >= s. */
export function lowerBound(along: Float32Array, s: number) {
  let lo = 0;
  let hi = along.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (along[mid] < s) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** Attract mode as a pure function of time, so `?t=` can freeze any moment: a slow stroll in from the entrance. */
export const attractAt = (t: number) => {
  const u = Math.max(0, t - 0.4);
  return HALL.start + 0.6 * (u - 1.4 * (1 - Math.exp(-u / 1.4)));
};

export const scrollOf = (s: number) => Math.max(0, (s - HALL.start) * HALL.px);
export const alongOf = (scroll: number) => HALL.start + scroll / HALL.px;

/** Where the camera stands to look at a print while walking. */
export const stationOf = (print: Print) => print.s - 1.2;

/**
 * The screen rectangle the open photo occupies. The camera flies until the
 * 3D print's picture fills exactly this rectangle, so the HTML image can fade
 * in on top of it without moving a pixel. Room is left around it for the mat
 * and frame, under it for the caption.
 */
export function lightboxRect(width: number, height: number, print: Pick<Print, "iw" | "ih">) {
  const top = 92;
  const boxW = width * 0.9;
  const boxH = Math.max(160, height - top - 142);
  const ratio = print.iw / print.ih;
  const border = (HALL.mat + HALL.bar) / (2 * print.ih); // mat + frame, as a fraction of the picture's height
  const h = Math.min(boxW / (ratio + 2 * border), boxH / (1 + 2 * border));
  const w = h * ratio;
  return { left: (width - w) / 2, top: top + (boxH - h) / 2, width: w, height: h };
}
