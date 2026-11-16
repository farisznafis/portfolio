/**
 * The book as an object: binding, leaves, and five spreads of card
 * mechanisms, each solved from the angle of the two pages it is glued to.
 *
 * Units are centimetres. A page is 24 x 30. Every part is a flat card with a
 * thickness and a teal core; nothing stretches. Mechanisms used:
 *
 *   V-fold          two wings hinged on glue lines that meet at the gutter;
 *                   the crease is found from the two glue-line directions.
 *   parallel fold   a box across a V-fold's crease: each face stays parallel
 *                   to the opposite wing (spread 1).
 *   floating layer  decks held parallel to their page by legs that copy a
 *                   two-bar "tent" across the gutter (spreads 3 and 4).
 *   slider, wheel, pull tabs: parts that ride on a page, a deck or a wing.
 */
import * as THREE from "three";
import type { BookView } from "../../lib/content/book";
import { bake, type Art, type Baked, type Base, type Layers, type Painter, type Type } from "./press";
import { smooth, type BookState } from "./timeline";

export const PW = 24;
export const PH = 30;
const TL = 0.16; // leaf
const TC = 0.3; // cover board with its pastedown
const TP = 0.09; // pop-up card
const THICK = [TC, TL, TL, TL, TL, TC];
const DEG = Math.PI / 180;
const TAB_PULL = 9;
const CARD_PULL = 4.6;
/** Rivet of the sky wheel, on the sky panel's sheet. */
const WX = 9.2;
const WY = 7.2;
/** The plane's route across the sea, in flat spread coordinates. */
const ROUTE: [V2, V2] = [
  [-11.4, -2.2],
  [10.8, 4.9],
];

type V2 = [number, number];

/* ── Outlines ──────────────────────────────────────────────────────────── */

const rect = (x0: number, y0: number, x1: number, y1: number): V2[] => [
  [x0, y0],
  [x1, y0],
  [x1, y1],
  [x0, y1],
];
const arc = (cx: number, cy: number, r: number, a0: number, a1: number, n = 28): V2[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as V2;
  });
/** Rectangle with rounded corners; `r` per corner: bottom-left, bottom-right, top-right, top-left. */
function roundRect(x0: number, y0: number, x1: number, y1: number, r: [number, number, number, number]): V2[] {
  const corner = (cx: number, cy: number, radius: number, a: number, x: number, y: number): V2[] =>
    radius ? arc(cx, cy, radius, a, a + Math.PI / 2, 6) : [[x, y]];
  return [
    ...corner(x0 + r[0], y0 + r[0], r[0], Math.PI, x0, y0),
    ...corner(x1 - r[1], y0 + r[1], r[1], -Math.PI / 2, x1, y0),
    ...corner(x1 - r[2], y1 - r[2], r[2], 0, x1, y1),
    ...corner(x0 + r[3], y1 - r[3], r[3], Math.PI / 2, x0, y1),
  ];
}
const mirror = (p: V2[]): V2[] => p.map(([x, y]) => [-x, y] as V2);
/** A hand-cut island: an ellipse whose radius wanders. */
const blob = (cx: number, cy: number, rx: number, ry: number, wobble: number[], turn = 0): V2[] =>
  Array.from({ length: 40 }, (_, i) => {
    const a = (i / 40) * Math.PI * 2;
    const k = 1 + wobble.reduce((sum, amp, n) => sum + amp * Math.sin((n + 2) * a + n * 1.7), 0);
    const x = rx * k * Math.cos(a);
    const y = ry * k * Math.sin(a);
    return [cx + x * Math.cos(turn) - y * Math.sin(turn), cy + x * Math.sin(turn) + y * Math.cos(turn)] as V2;
  });
/** Keep the half of a polygon on one side of x = 0. */
function clipX(p: V2[], side: number): V2[] {
  const out: V2[] = [];
  for (let i = 0; i < p.length; i++) {
    const a = p[i];
    const b = p[(i + 1) % p.length];
    const ain = a[0] * side >= 0;
    const bin = b[0] * side >= 0;
    if (ain) out.push(a);
    if (ain !== bin && a[0] !== 0 && b[0] !== 0) out.push([0, a[1] + ((b[1] - a[1]) * -a[0]) / (b[0] - a[0])]);
  }
  return out;
}
function signedArea(p: V2[]) {
  let a = 0;
  for (let i = 0; i < p.length; i++) {
    const q = p[(i + 1) % p.length];
    a += p[i][0] * q[1] - q[0] * p[i][1];
  }
  return a / 2;
}
const wound = (p: V2[], ccw: boolean) => (signedArea(p) > 0 === ccw ? p : [...p].reverse());

/**
 * A card: front face (+z, group 0), back face (group 1), cut edge (group 2).
 * Face UVs are in centimetres so printed textures and tiling stock share
 * them; the back face is mirrored so its print reads the right way round.
 * Edge UVs run 0..1 across the thickness, for the duplex stripe.
 */
function cardGeometry(outline: V2[], t: number, holes: V2[][] = []) {
  const rings = [wound(outline, true), ...holes.map((hole) => wound(hole, false))];
  const flat = rings.flat();
  const vectors = rings.map((ring) => ring.map(([x, y]) => new THREE.Vector2(x, y)));
  const pos: number[] = [];
  const nor: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (const [x, y] of flat) {
    pos.push(x, y, t / 2);
    nor.push(0, 0, 1);
    uv.push(x, y);
  }
  for (const [a, b, c] of THREE.ShapeUtils.triangulateShape(vectors[0], vectors.slice(1))) {
    const turn =
      (flat[b][0] - flat[a][0]) * (flat[c][1] - flat[a][1]) - (flat[c][0] - flat[a][0]) * (flat[b][1] - flat[a][1]);
    if (turn > 0) idx.push(a, b, c);
    else idx.push(a, c, b);
  }
  const face = idx.length;
  for (const [x, y] of flat) {
    pos.push(x, y, -t / 2);
    nor.push(0, 0, -1);
    uv.push(-x, y);
  }
  for (let i = 0; i < face; i += 3) idx.push(flat.length + idx[i], flat.length + idx[i + 2], flat.length + idx[i + 1]);
  for (const ring of rings) {
    let run = 0;
    for (let i = 0; i < ring.length; i++) {
      const [ax, ay] = ring[i];
      const [bx, by] = ring[(i + 1) % ring.length];
      const len = Math.hypot(bx - ax, by - ay);
      if (len < 1e-6) continue;
      const base = pos.length / 3;
      pos.push(ax, ay, t / 2, bx, by, t / 2, bx, by, -t / 2, ax, ay, -t / 2);
      for (let k = 0; k < 4; k++) nor.push((by - ay) / len, -(bx - ax) / len, 0);
      uv.push(run, 0, run + len, 0, run + len, 1, run, 1);
      idx.push(base, base + 3, base + 2, base, base + 2, base + 1);
      run += len;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(idx);
  geometry.addGroup(0, face, 0);
  geometry.addGroup(face, face, 1);
  geometry.addGroup(face * 2, idx.length - face * 2, 2);
  return geometry;
}

/* ── Castle ────────────────────────────────────────────────────────────── */

/** One storey: a wall rising to `y`, an eave `ew` wide, a roof closing to `tw` at `ty`. */
type Tier = { y: number; ew: number; ty: number; tw: number };
const roofRight = (t: Tier): V2[] => [
  [t.ew, t.y + 0.05],
  [t.ew + 0.2, t.y + 0.55],
  [(t.ew + t.tw) / 2 - 0.22, (t.y + 0.55 + t.ty) / 2 - 0.2],
  [t.tw, t.ty],
];
function castleOutline(w0: number, tiers: Tier[], peak?: number): V2[] {
  const right: V2[] = [[w0, 0]];
  let w = w0;
  for (const tier of tiers) {
    right.push([w, tier.y], ...roofRight(tier));
    w = tier.tw;
  }
  if (peak) right.push([0.3, peak - 0.4]);
  const left = mirror([...right].reverse());
  return peak ? [...right, [0, peak], ...left] : [...right, ...left];
}
function castlePaint(w0: number, tiers: Tier[], peak?: number): Painter {
  return (L) => {
    L("night", (c) => {
      for (const tier of tiers) {
        const r = roofRight(tier);
        c.beginPath();
        for (const [x, y] of [...r, ...mirror([...r].reverse())]) c.lineTo(x, -y);
        c.fill();
        // Tile ribs fan from the ridge to the eave, left as bare paper.
        c.globalCompositeOperation = "destination-out";
        c.lineWidth = 0.05;
        for (let x = -tier.ew + 0.35; x < tier.ew; x += 0.5) {
          c.beginPath();
          c.moveTo(x, -(tier.y + 0.3));
          c.lineTo((x * tier.tw) / tier.ew, -tier.ty + 0.25);
          c.stroke();
        }
        // A gable let into each side of the wider roofs.
        if (tier.ew > 5.5)
          for (const gx of [-tier.ew * 0.5, tier.ew * 0.5]) {
            c.beginPath();
            c.moveTo(gx - 1.15, -(tier.y + 0.45));
            c.lineTo(gx, -(tier.y + 0.45 + (tier.ty - tier.y) * 0.62));
            c.lineTo(gx + 1.15, -(tier.y + 0.45));
            c.fill();
          }
        c.globalCompositeOperation = "source-over";
      }
    });
    L("teal", (c) => {
      for (const tier of tiers) {
        c.fillRect(-tier.ew - 0.1, -(tier.y + 0.42), tier.ew * 2 + 0.2, 0.12);
        if (tier.ew > 5.5)
          for (const gx of [-tier.ew * 0.5, tier.ew * 0.5]) {
            c.lineWidth = 0.09;
            c.beginPath();
            c.moveTo(gx - 0.95, -(tier.y + 0.55));
            c.lineTo(gx, -(tier.y + 0.4 + (tier.ty - tier.y) * 0.55));
            c.lineTo(gx + 0.95, -(tier.y + 0.55));
            c.stroke();
          }
      }
    });
    L("black", (c) => {
      let w = w0;
      let floor = 0;
      for (const tier of tiers) {
        // Black cladding under the eave, with plaster-white windows left open in it.
        const band = Math.min(1.9, (tier.y - floor) * 0.55);
        c.fillRect(-w, -tier.y, w * 2, band);
        for (let x = -w + 0.55; x < w - 0.6; x += 1.15) c.clearRect(x, -tier.y + band * 0.3, 0.5, band * 0.42);
        w = tier.tw;
        floor = tier.ty;
      }
      c.fillRect(-w0, -0.16, w0 * 2, 0.16);
    });
    if (peak)
      L("foil", (c) => {
        const top = tiers[tiers.length - 1];
        c.fillRect(-top.tw - 0.1, -top.ty - 0.06, top.tw * 2 + 0.2, 0.2);
        c.beginPath();
        c.arc(0, -peak + 0.75, 0.22, 0, Math.PI * 2);
        c.fill();
      });
  };
}
/** Curved stone wall: `top` wide at height `h`, flaring to `base` at the ground. */
const wallOutline = (base: number, top: number, h: number): V2[] => {
  const right = Array.from({ length: 9 }, (_, i) => {
    const f = i / 8;
    return [top + (base - top) * Math.pow(1 - f, 2.3), h * f] as V2;
  });
  return [...right, ...mirror([...right].reverse())];
};
const wallPaint =
  (base: number, h: number): Painter =>
  (L) =>
    L("black", (c) => {
      // Fitted stones, drawn as joints.
      let seed = 11;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      c.lineWidth = 0.04;
      for (let y = 0.55; y < h + 0.5; y += 0.58) {
        c.beginPath();
        c.moveTo(-base, -y + (rnd() - 0.5) * 0.08);
        c.lineTo(base, -y + (rnd() - 0.5) * 0.08);
        c.stroke();
        for (let x = -base + rnd(); x < base; x += 0.7 + rnd() * 0.9) {
          c.beginPath();
          c.moveTo(x, -y);
          c.lineTo(x + (rnd() - 0.5) * 0.18, -y + 0.58);
          c.stroke();
        }
      }
    });

/** A plain hall front: cornice, plinth, rows of windows. Sheet coordinates. */
function facade(L: Layers, x0: number, x1: number, top: number, door = false) {
  L("teal", (c) => {
    c.fillRect(x0, -top, x1 - x0, 0.3);
    c.fillRect(x0, -0.26, x1 - x0, 0.26);
  });
  L("black", (c) => {
    c.fillRect(x0, -top + 0.42, x1 - x0, 0.06);
    const cols = Math.max(1, Math.floor((x1 - x0 - 0.5) / 1.05));
    const step = (x1 - x0) / cols;
    for (let y = -top + 1; y < -1.2; y += 1.55)
      for (let i = 0; i < cols; i++) c.fillRect(x0 + step * (i + 0.5) - 0.2, y, 0.4, 0.85);
    if (door) {
      const cx = (x0 + x1) / 2;
      c.clearRect(cx - 0.7, -2, 1.4, 2);
      c.beginPath();
      c.arc(cx, -1.1, 0.5, Math.PI, 0);
      c.lineTo(cx + 0.5, -0.26);
      c.lineTo(cx - 0.5, -0.26);
      c.fill();
    }
  });
}

/* ── Book ──────────────────────────────────────────────────────────────── */

interface Frame {
  /** Gutter point of the spread, in the book's cross-section. */
  gx: number;
  gy: number;
  /** Angles of the left and right page (0 = lying to the right, pi = to the left). */
  thL: number;
  thR: number;
  /** Opening angle between the pages. */
  phi: number;
}
interface CardOpts {
  outline: V2[];
  holes?: V2[][];
  t?: number;
  /** Spread whose textures and part count this card belongs to (0 = cover). */
  spread: number;
  spreadBack?: number;
  front?: Painter;
  back?: Painter;
  /** "sheet": painter origin on the base line at the crease, y up is negative. "box": origin top-left. */
  space?: "sheet" | "box";
  base?: Base;
  blank?: THREE.Material;
  edge?: THREE.Material;
  folds?: [V2, V2][];
  glue?: boolean;
  count?: boolean;
}
interface Job {
  spread: number;
  art: Art;
  mat: THREE.MeshStandardMaterial;
  u0: number;
  v0: number;
  baked?: Baked;
  done: boolean;
}
interface VFold {
  apex: THREE.Vector3;
  gL: THREE.Vector3;
  gR: THREE.Vector3;
  c: THREE.Vector3;
  L: THREE.Mesh;
  R: THREE.Mesh;
}
interface Tent {
  s: number;
  vL: V2;
  vR: V2;
}
export type HandleKind = "tab" | "plane" | "wheel" | "card";
export type Pick = { kind: "turn"; leaf: number; u: number } | { kind: HandleKind };

const pagePoint = (f: Frame, side: number, u: number, h = 0): V2 => {
  const th = side < 0 ? f.thL : f.thR;
  const c = Math.cos(th);
  const s = Math.sin(th);
  const k = side < 0 ? -1 : 1;
  return [f.gx + u * c - k * h * s, f.gy + u * s + k * h * c];
};
/** Frame of a card lying parallel to a page, authored in flat spread coordinates. */
function pageBasis(m: THREE.Matrix4, f: Frame, side: number, ox: number, oy: number) {
  const th = side < 0 ? f.thL : f.thR;
  const k = side < 0 ? -1 : 1;
  const c = Math.cos(th) * k;
  const s = Math.sin(th) * k;
  m.set(c, 0, -s, ox, s, 0, c, oy, 0, -1, 0, 0, 0, 0, 0, 1);
}
/** Frame of a strut standing along `v` from a point on a page. */
function strutBasis(m: THREE.Matrix4, at: V2, v: V2, length: number) {
  const x = v[0] / length;
  const y = v[1] / length;
  m.set(x, 0, -y, at[0], y, 0, x, at[1], 0, -1, 0, 0, 0, 0, 0, 1);
}

const tmpX = new THREE.Vector3();
const tmpZ = new THREE.Vector3();
const tmpO = new THREE.Vector3();
const tmpM = new THREE.Matrix4();
const tmpRay = new THREE.Ray();

export class Book {
  readonly root = new THREE.Group();
  readonly frames: Frame[] = Array.from({ length: 6 }, () => ({ gx: 0, gy: 0, thL: 0, thR: 0, phi: 0 }));
  /** Parts per spread, pages and binding not counted. Index 0 is the cover. */
  readonly counts = [0, 0, 0, 0, 0, 0];
  /** The printed email on the contact card, for the HTML link laid over it. */
  emailBox!: { mesh: THREE.Mesh; x0: number; y0: number; x1: number; y1: number };

  private view: BookView;
  private type: Type;
  private ppc: number;
  private leaves: THREE.Group[] = [];
  private leafMeshes: THREE.Mesh[] = [];
  private moving: THREE.Group[] = [];
  private statics: THREE.Object3D[][] = [[], [], [], [], [], []];
  private mech: ((f: Frame, s: BookState) => void)[][] = [[], [], [], [], [], []];
  private decals: { mat: THREE.MeshBasicMaterial; spread: number; strength: number }[] = [];
  private handles: { kind: HandleKind; obj: THREE.Object3D; spread: number }[] = [];
  private jobs: Job[] = [];
  private cards: THREE.Mesh[] = [];
  private plan: THREE.Object3D[] = [];
  private owned: { dispose(): void }[] = [];
  private spine!: THREE.Mesh;
  private bands: THREE.Mesh[] = [];
  private skyWing!: THREE.Mesh;
  private dragAt = 0;

  private paper: THREE.MeshStandardMaterial;
  private cloth: THREE.MeshPhysicalMaterial;
  private core: THREE.MeshStandardMaterial;
  private tabStock: THREE.MeshStandardMaterial;
  private ink = new THREE.MeshBasicMaterial({ color: "#0a0f11", polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1, toneMapped: false });
  private glueInk = new THREE.MeshBasicMaterial({ color: "#ffc700", transparent: true, opacity: 0.55, toneMapped: false, depthWrite: false, depthTest: false });
  private cutLine = new THREE.LineBasicMaterial({ color: "#e9eef0", toneMapped: false });
  private foldLine = new THREE.LineDashedMaterial({ color: "#2ee6d6", dashSize: 0.35, gapSize: 0.22, toneMapped: false });
  private decalGeo = new THREE.PlaneGeometry(1, 1);
  private decalMap: THREE.CanvasTexture;

  constructor(view: BookView, type: Type, ppc: number) {
    this.view = view;
    this.type = type;
    this.ppc = ppc;

    // Stock that carries no print shares one tiling texture pair.
    const tile = 256 / ppc;
    const stock = (base: Base) => {
      const baked = bake({ base, x0: 0, y0: 0, w: tile, h: tile }, ppc, type);
      for (const texture of [baked.map, baked.data]) texture.repeat.set(1 / tile, 1 / tile);
      this.owned.push(baked.map, baked.data);
      return baked;
    };
    const paper = stock("paper");
    const cloth = stock("cloth");
    this.paper = new THREE.MeshStandardMaterial({ map: paper.map, bumpMap: paper.data, bumpScale: 0.035, roughness: 0.93 });
    this.tabStock = this.paper.clone();
    this.tabStock.roughness = 0.5; // a faint glue sheen
    // A cut edge of duplex card: two thin cream faces over the teal core.
    const duplex = document.createElement("canvas");
    duplex.width = 2;
    duplex.height = 16;
    const dctx = duplex.getContext("2d") as CanvasRenderingContext2D;
    dctx.fillStyle = "#e6dfcf";
    dctx.fillRect(0, 0, 2, 16);
    dctx.fillStyle = "#17b3a3";
    dctx.fillRect(0, 2, 2, 12);
    const duplexMap = new THREE.CanvasTexture(duplex);
    duplexMap.colorSpace = THREE.SRGBColorSpace;
    this.owned.push(duplexMap);
    this.core = new THREE.MeshStandardMaterial({ map: duplexMap, roughness: 0.85 });
    this.cloth = new THREE.MeshPhysicalMaterial({
      map: cloth.map,
      bumpMap: cloth.data,
      bumpScale: 0.035,
      roughness: 0.86,
      sheen: 0.45,
      sheenRoughness: 0.55,
      sheenColor: new THREE.Color("#2a5558"),
      side: THREE.DoubleSide,
    });

    const shade = document.createElement("canvas");
    shade.width = shade.height = 64;
    const sctx = shade.getContext("2d") as CanvasRenderingContext2D;
    const gradient = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(0,0,0,1)");
    gradient.addColorStop(0.45, "rgba(0,0,0,0.55)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    sctx.fillStyle = gradient;
    sctx.fillRect(0, 0, 64, 64);
    this.decalMap = new THREE.CanvasTexture(shade);
    this.owned.push(this.decalMap, this.decalGeo, this.paper, this.tabStock, this.core, this.cloth, this.ink, this.glueInk, this.cutLine, this.foldLine);

    this.buildBinding();
    for (let i = 1; i <= 5; i++) {
      const group = new THREE.Group();
      this.moving[i] = group;
      this.root.add(group);
    }
    this.spread1();
    this.spread2();
    this.spread3();
    this.spread4();
    this.spread5();
  }

  /* ── Cards, printing, plan ─────────────────────────────────────────── */

  private card(o: CardOpts) {
    const t = o.t ?? TP;
    const xs = o.outline.map((p) => p[0]);
    const ys = o.outline.map((p) => p[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const blank = o.blank ?? this.paper;
    const sheet = o.space === "sheet";
    const face = (paint: Painter | undefined, back: boolean) => {
      if (!paint) return blank;
      const mat = (o.base === "cloth" ? this.cloth : this.paper).clone();
      this.owned.push(mat);
      this.jobs.push({
        spread: back ? (o.spreadBack ?? o.spread) : o.spread,
        mat,
        done: false,
        u0: back ? -maxX : minX,
        v0: minY,
        art: {
          base: o.base ?? "paper",
          w: maxX - minX,
          h: maxY - minY,
          x0: sheet ? (back ? -maxX : minX) : 0,
          y0: sheet ? -maxY : 0,
          paint,
        },
      });
      return mat;
    };
    const geometry = cardGeometry(o.outline, t, o.holes);
    const mesh = new THREE.Mesh(geometry, [face(o.front, false), face(o.back, true), o.edge ?? this.core]);
    mesh.castShadow = mesh.receiveShadow = true;
    mesh.userData.glue = o.glue;
    this.owned.push(geometry);
    this.cards.push(mesh);
    if (o.count !== false) this.counts[o.spread]++;

    // Plan view: the cut line on both faces, fold lines dashed.
    const lines = (segments: [V2, V2][], material: THREE.Material) => {
      const z = t / 2 + 0.012;
      const points: number[] = [];
      for (const [a, b] of segments) for (const s of [z, -z]) points.push(a[0], a[1], s, b[0], b[1], s);
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
      const line = new THREE.LineSegments(g, material);
      line.computeLineDistances();
      line.visible = false;
      mesh.add(line);
      this.plan.push(line);
      this.owned.push(g);
    };
    lines(
      [o.outline, ...(o.holes ?? [])].flatMap((ring) => ring.map((p, i) => [p, ring[(i + 1) % ring.length]] as [V2, V2])),
      this.cutLine,
    );
    if (o.folds) lines(o.folds, this.foldLine);
    return mesh;
  }

  /** Print pending faces, nearest spread first, until the time budget is spent. Returns what is left. */
  bakeNear(p: number, budgetMs: number, reach = 9) {
    const pending = this.jobs.filter((job) => !job.done && Math.abs(job.spread - p) <= reach);
    pending.sort((a, b) => Math.abs(a.spread - p) - Math.abs(b.spread - p));
    const start = performance.now();
    let left = pending.length;
    for (const job of pending) {
      if (performance.now() - start > budgetMs) break;
      const fresh = !job.baked;
      job.baked = bake(job.art, this.ppc, this.type, job.baked);
      if (fresh) {
        const { w, h } = job.art;
        for (const texture of [job.baked.map, job.baked.data]) {
          texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.repeat.set(1 / w, 1 / h);
          texture.offset.set(-job.u0 / w, -job.v0 / h);
          this.owned.push(texture);
        }
        job.mat.map = job.baked.map;
        job.mat.bumpMap = job.mat.roughnessMap = job.mat.metalnessMap = job.baked.data;
        job.mat.roughness = job.mat.metalness = 1;
        job.mat.needsUpdate = true;
      }
      job.done = true;
      left--;
    }
    return left;
  }

  /** New language: every printed face goes back through the press. */
  setCopy(view: BookView, type: Type) {
    this.view = view;
    this.type = type;
    for (const job of this.jobs) job.done = false;
  }

  setEngineer(on: boolean) {
    for (const mesh of this.cards) {
      mesh.userData.real ??= mesh.material;
      mesh.material = on ? (mesh.userData.glue ? this.glueInk : this.ink) : mesh.userData.real;
      mesh.castShadow = !on;
    }
    for (const line of this.plan) line.visible = on;
    for (const decal of this.decals) decal.mat.visible = !on;
    this.spine.visible = !on;
    for (const band of this.bands) band.visible = !on;
  }

  /** Lay a flat part on a page of spread `i`. The part is authored in flat spread coordinates (x < 0 on the left page). */
  private onPage(i: number, side: number, obj: THREE.Object3D, h: number) {
    const leaf = side < 0 ? i - 1 : i;
    const holder = new THREE.Group();
    if (side < 0) holder.rotation.y = Math.PI;
    holder.position.z = (side < 0 ? -1 : 1) * (THICK[leaf] / 2 + h);
    holder.add(obj);
    this.leaves[leaf].add(holder);
    this.statics[i].push(holder);
  }

  /** Soft occlusion where a part meets the page: darkest when the part stands. */
  private contact(i: number, side: number, at: V2, angle: number, length: number, width: number, strength = 0.5) {
    const mat = new THREE.MeshBasicMaterial({ map: this.decalMap, transparent: true, depthWrite: false, opacity: 0 });
    const mesh = new THREE.Mesh(this.decalGeo, mat);
    mesh.position.set(at[0], at[1], 0);
    mesh.rotation.z = angle;
    mesh.scale.set(length, width, 1);
    this.onPage(i, side, mesh, 0.005);
    this.decals.push({ mat, spread: i, strength });
    this.owned.push(mat);
  }

  /** A glue tab lying on a page. */
  private tab(i: number, side: number, outline: V2[]) {
    const mesh = this.card({ outline, t: 0.03, spread: i, glue: true, blank: this.counts[i] % 3 === 0 ? this.tabStock : this.paper });
    this.onPage(i, side, mesh, 0.016);
  }

  /* ── Binding ───────────────────────────────────────────────────────── */

  private buildBinding() {
    const pageOutline = roundRect(0.25, -PH / 2, PW, PH / 2, [0, 0.45, 0.45, 0]);
    const boardOutline = roundRect(0.2, -PH / 2 - 0.35, PW + 0.35, PH / 2 + 0.35, [0, 0.25, 0.25, 0]);
    const paint = this.pagePainters();
    for (let j = 0; j < 6; j++) {
      const leaf = new THREE.Group();
      leaf.matrixAutoUpdate = false;
      const meshes: THREE.Mesh[] = [];
      if (j === 0 || j === 5) {
        // A cloth-covered board, and the pastedown that is the first or last page.
        const outside = j === 0 ? 1 : -1;
        const board = this.card({
          outline: boardOutline,
          t: TC - 0.04,
          spread: 0,
          base: "cloth",
          space: "box",
          blank: this.cloth,
          edge: this.cloth,
          front: j === 0 ? this.coverPainter() : undefined,
          count: false,
        });
        board.position.z = outside * 0.02;
        const paste = this.card({
          outline: pageOutline,
          t: 0.04,
          spread: j === 0 ? 1 : 5,
          space: "box",
          front: j === 5 ? paint["5R"] : undefined,
          back: j === 0 ? paint["1L"] : undefined,
          count: false,
        });
        paste.position.z = -outside * (TC / 2 - 0.02);
        meshes.push(board, paste);
      } else {
        meshes.push(
          this.card({
            outline: pageOutline,
            t: TL,
            spread: j,
            spreadBack: j + 1,
            space: "box",
            front: paint[`${j}R`],
            back: paint[`${j + 1}L`],
            count: false,
          }),
        );
      }
      for (const mesh of meshes) {
        mesh.userData.leaf = j;
        leaf.add(mesh);
        this.leafMeshes.push(mesh);
      }
      this.leaves.push(leaf);
      this.root.add(leaf);
    }

    // Rounded cloth spine between the two boards, and silk head and tail bands.
    const spineGeo = new THREE.BufferGeometry();
    spineGeo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(13 * 2 * 3), 3));
    spineGeo.setAttribute("uv", new THREE.Float32BufferAttribute(new Float32Array(13 * 2 * 2), 2));
    const index: number[] = [];
    for (let i = 0; i < 12; i++) index.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
    spineGeo.setIndex(index);
    this.spine = new THREE.Mesh(spineGeo, this.cloth);
    this.spine.castShadow = this.spine.receiveShadow = true;
    this.spine.frustumCulled = false;
    this.root.add(this.spine);
    const stripes = document.createElement("canvas");
    stripes.width = 16;
    stripes.height = 4;
    const sctx = stripes.getContext("2d") as CanvasRenderingContext2D;
    sctx.fillStyle = "#c79a3a";
    sctx.fillRect(0, 0, 16, 4);
    sctx.fillStyle = "#12766f";
    sctx.fillRect(0, 0, 8, 4);
    const stripeMap = new THREE.CanvasTexture(stripes);
    stripeMap.colorSpace = THREE.SRGBColorSpace;
    stripeMap.wrapT = THREE.RepeatWrapping;
    stripeMap.repeat.set(1, 9);
    stripeMap.rotation = Math.PI / 2;
    const bandGeo = new THREE.CylinderGeometry(0.14, 0.14, 1, 10);
    const bandMat = new THREE.MeshStandardMaterial({ map: stripeMap, roughness: 0.55 });
    this.owned.push(spineGeo, stripeMap, bandGeo, bandMat);
    for (const z of [-PH / 2 + 0.05, PH / 2 - 0.05]) {
      const band = new THREE.Mesh(bandGeo, bandMat);
      band.position.z = z;
      this.bands.push(band);
      this.root.add(band);
    }
  }

  private setLeaf(j: number, ox: number, oy: number, th: number) {
    const c = Math.cos(th);
    const s = Math.sin(th);
    this.leaves[j].matrix.set(c, 0, -s, ox, s, 0, c, oy, 0, -1, 0, 0, 0, 0, 0, 1);
    this.leaves[j].matrixWorldNeedsUpdate = true;
  }

  /**
   * Leaf j is the one in the air. The piles either side are rigid stacks whose
   * top surface is hinged on the turning leaf's own faces, so the two pages of
   * a spread always meet in one gutter line and each pile rests its fore-edge
   * on the table (the thinner pile tilts up to the spine, as a real one does).
   */
  private pose(p: number) {
    const j = Math.min(4, Math.max(0, Math.floor(p)));
    const e = Math.min(1, Math.max(0, p - j));
    const before = (i: number) => THICK.slice(0, i).reduce((a, b) => a + b, 0);
    const after = (i: number) => THICK.slice(i).reduce((a, b) => a + b, 0);
    const gutter = (i: number) => Math.max(before(i), after(i));
    const tilt = (y: number, pile: number) => Math.asin(Math.min(1, Math.max(0, (y - pile) / PW)));

    const from = -tilt(gutter(j), after(j));
    const to = Math.PI + tilt(gutter(j + 1), before(j + 1));
    const th = from + (to - from) * e;
    const half = THICK[j] / 2;
    const py = gutter(j) + (gutter(j + 1) - gutter(j)) * e - half;
    this.setLeaf(j, 0, py, th);
    const nx = -Math.sin(th) * half;
    const ny = Math.cos(th) * half;

    for (const f of this.frames) f.phi = 0;
    // Left pile hangs from the turning leaf's front face.
    let sx = nx;
    let sy = py + ny;
    const tl = tilt(sy, before(j));
    const thL = Math.PI + tl;
    if (j >= 1) Object.assign(this.frames[j], { gx: sx, gy: sy, thL, thR: th, phi: thL - th });
    for (let k = j - 1; k >= 0; k--) {
      const d = THICK[k] / 2;
      this.setLeaf(k, sx + Math.sin(tl) * d, sy - Math.cos(tl) * d, thL);
      sx += Math.sin(tl) * d * 2;
      sy -= Math.cos(tl) * d * 2;
    }
    // Right pile hangs from its back face.
    sx = -nx;
    sy = py - ny;
    const tr = tilt(sy, after(j + 1));
    Object.assign(this.frames[j + 1], { gx: sx, gy: sy, thL: th, thR: -tr, phi: th + tr });
    for (let k = j + 1; k < 6; k++) {
      const d = THICK[k] / 2;
      this.setLeaf(k, sx - Math.sin(tr) * d, sy - Math.cos(tr) * d, -tr);
      sx -= Math.sin(tr) * d * 2;
      sy -= Math.cos(tr) * d * 2;
    }

    // Spine: a cloth arc from the front board's hinge edge to the back board's.
    const edge = (k: number): V2 => {
      const m = this.leaves[k].matrix.elements;
      return [m[12] + m[0] * 0.2, m[13] + m[1] * 0.2];
    };
    const a = edge(0);
    const b = edge(5);
    const chord = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-4;
    const ox = (b[1] - a[1]) / chord;
    const oy = -(b[0] - a[0]) / chord;
    const bulge = chord * 0.75;
    const pos = this.spine.geometry.getAttribute("position") as THREE.BufferAttribute;
    const uv = this.spine.geometry.getAttribute("uv") as THREE.BufferAttribute;
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      const k = 2 * t * (1 - t);
      const x = a[0] + (b[0] - a[0]) * t + ox * bulge * k;
      const y = Math.max(0.03, a[1] + (b[1] - a[1]) * t + oy * bulge * k);
      for (let s = 0; s < 2; s++) {
        const z = (s ? 1 : -1) * (PH / 2 + 0.35);
        pos.setXYZ(i * 2 + s, x, y, z);
        uv.setXY(i * 2 + s, t * chord * 1.6, z);
      }
    }
    pos.needsUpdate = uv.needsUpdate = true;
    this.spine.geometry.computeVertexNormals();
    for (const band of this.bands) {
      band.position.x = (a[0] + b[0]) / 2 + ox * bulge * 0.22;
      band.position.y = Math.max(0.16, (a[1] + b[1]) / 2 + oy * bulge * 0.22);
      band.rotation.z = Math.atan2(b[1] - a[1], b[0] - a[0]) - Math.PI / 2;
      band.scale.y = Math.max(0.5, chord * 0.92);
    }
  }

  update(s: BookState) {
    this.pose(s.p);
    for (let i = 1; i <= 5; i++) {
      const f = this.frames[i];
      const open = f.phi > 0.012;
      this.moving[i].visible = open;
      for (const part of this.statics[i]) part.visible = open;
      if (open) for (const solve of this.mech[i]) solve(f, s);
    }
    for (const decal of this.decals) decal.mat.opacity = decal.strength * smooth(this.frames[decal.spread].phi / Math.PI);
  }

  /* ── Mechanisms ────────────────────────────────────────────────────── */

  /**
   * V-fold. `outline` is the unfolded sheet: crease on x = 0, glue lines on
   * y = 0. `alpha` is the angle between a glue line and the gutter; `dir` +1
   * runs the glue lines towards the reader (wings open like arms), -1 away
   * (wings sweep back like a prow).
   */
  private vfold(i: number, o: { y0: number; alpha: number; dir: number; outline: V2[]; paint?: Painter; holesR?: V2[][] }) {
    const v = { apex: new THREE.Vector3(), gL: new THREE.Vector3(), gR: new THREE.Vector3(), c: new THREE.Vector3() } as VFold;
    const a = o.alpha * DEG;
    const wing = (side: number) => {
      const outline = clipX(o.outline, side);
      const onCrease = outline.filter((p) => Math.abs(p[0]) < 1e-6).map((p) => p[1]);
      const top = Math.max(...onCrease);
      const reach = Math.max(...outline.filter((p) => Math.abs(p[1]) < 1e-6).map((p) => Math.abs(p[0])));
      const paint = o.paint;
      const mesh = this.card({
        outline,
        holes: side > 0 ? o.holesR : undefined,
        spread: i,
        space: "sheet",
        // The score along the crease cracks the surface a little.
        front: paint && ((L, T) => (paint(L, T), L("score", (c) => c.fillRect(-0.07, -top, 0.14, top)))),
        folds: [
          [
            [0, 0],
            [0, top],
          ],
          [
            [0, 0],
            [side * reach, 0],
          ],
        ],
      });
      mesh.matrixAutoUpdate = false;
      this.moving[i].add(mesh);
      // Glue tab behind the wing, and the shade where wing meets page.
      const g: V2 = [side * Math.sin(a), -o.dir * Math.cos(a)];
      const behind: V2 = [side * o.dir * Math.cos(a), Math.sin(a)];
      const at = (s: number, b: number): V2 => [g[0] * s + behind[0] * b, o.y0 + g[1] * s + behind[1] * b];
      this.tab(i, side, [at(0.5, 0), at(reach - 0.3, 0), at(reach - 0.7, 0.8), at(0.9, 0.8)]);
      this.contact(i, side, at(reach / 2, -0.15), Math.atan2(g[1], g[0]), reach + 1.5, 2.4);
      return mesh;
    };
    v.L = wing(-1);
    v.R = wing(1);
    this.mech[i].push((f) => {
      const sa = Math.sin(a);
      const ca = Math.cos(a) * o.dir;
      v.gL.set(Math.cos(f.thL) * sa, Math.sin(f.thL) * sa, ca);
      v.gR.set(Math.cos(f.thR) * sa, Math.sin(f.thR) * sa, ca);
      // The crease is square to both glue lines.
      v.c.crossVectors(v.gL, v.gR);
      const length = v.c.length();
      if (length < 1e-5) return;
      v.c.multiplyScalar(o.dir / length);
      v.apex.set(f.gx, f.gy, -o.y0);
      this.wingBasis(v.L, v, -1, v.apex);
      this.wingBasis(v.R, v, 1, v.apex);
    });
    return v;
  }

  private wingBasis(mesh: THREE.Mesh, v: VFold, side: number, origin: THREE.Vector3) {
    if (side > 0) tmpX.copy(v.gR);
    else tmpX.copy(v.gL).negate();
    tmpZ.crossVectors(tmpX, v.c);
    mesh.matrix.makeBasis(tmpX, v.c, tmpZ).setPosition(origin);
    mesh.matrixWorldNeedsUpdate = true;
  }

  /**
   * Parallel fold across a V-fold's crease: a box whose two faces stay
   * parallel to the opposite wings. `outline` spans x in [0, d].
   */
  private box(i: number, v: VFold, d: number, outline: V2[], paint: Painter) {
    const h0 = Math.max(...outline.filter((p) => p[0] < 1e-6).map((p) => p[1]));
    const h1 = Math.max(...outline.filter((p) => p[0] > d - 1e-6).map((p) => p[1]));
    // Both faces hinge on a wing at x = 0 and meet each other at the far edge.
    const folds = (k: number): [V2, V2][] => [
      [
        [0, 0],
        [0, h0],
      ],
      [
        [k * d, 0],
        [k * d, h1],
      ],
    ];
    const a = this.card({ outline, spread: i, space: "sheet", front: paint, folds: folds(1) });
    // The left-hand face is the same sheet turned over.
    const b = this.card({
      outline: mirror(outline),
      spread: i,
      space: "sheet",
      front: (L, T) => paint((ink, draw) => L(ink, (c) => (c.scale(-1, 1), draw(c))), T),
      folds: folds(-1),
    });
    for (const mesh of [a, b]) {
      mesh.matrixAutoUpdate = false;
      this.moving[i].add(mesh);
    }
    // Their tabs are glued to the wings.
    const tab = (k: number, h: number, wing: THREE.Mesh) => {
      const mesh = this.card({ outline: rect(k * d, 0.3, k * (d + 0.7), h - 0.3), t: 0.03, spread: i, glue: true });
      mesh.position.z = TP / 2 + 0.016;
      wing.add(mesh);
    };
    tab(-1, h0, v.L);
    tab(1, h0, v.R);
    this.mech[i].push(() => {
      this.wingBasis(a, v, 1, tmpO.copy(v.apex).addScaledVector(v.gL, d));
      this.wingBasis(b, v, -1, tmpO.copy(v.apex).addScaledVector(v.gR, d));
    });
  }

  /**
   * Two bars of length `s` rising from each page at `c` from the gutter and
   * meeting in a ridge. Everything that floats copies one of the bars.
   */
  private tent(i: number, o: { c: number; s: number; spans: [number, number][] }) {
    const tent: Tent = { s: o.s, vL: [0, 1], vR: [0, 1] };
    const bars = o.spans.flatMap(([y0, y1]) =>
      [-1, 1].map((side) => {
        const mesh = this.strut(i, side, o.c, o.s, y0, y1);
        return { mesh, side };
      }),
    );
    this.mech[i].push((f) => {
      const a = pagePoint(f, -1, o.c);
      const b = pagePoint(f, 1, o.c);
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const half = Math.hypot(dx, dy) / 2;
      const rise = Math.sqrt(Math.max(o.s * o.s - half * half, 0));
      const px = (a[0] + b[0]) / 2 - (dy / (2 * half)) * rise;
      const py = (a[1] + b[1]) / 2 + (dx / (2 * half)) * rise;
      tent.vL = [px - a[0], py - a[1]];
      tent.vR = [px - b[0], py - b[1]];
      for (const bar of bars) {
        strutBasis(bar.mesh.matrix, bar.side < 0 ? a : b, bar.side < 0 ? tent.vL : tent.vR, o.s);
        bar.mesh.matrixWorldNeedsUpdate = true;
      }
    });
    return tent;
  }

  private strut(i: number, side: number, u: number, s: number, y0: number, y1: number) {
    const mesh = this.card({
      outline: rect(0, y0, s, y1),
      spread: i,
      folds: [
        [
          [0, y0],
          [0, y1],
        ],
        [
          [s, y0],
          [s, y1],
        ],
      ],
    });
    mesh.matrixAutoUpdate = false;
    this.moving[i].add(mesh);
    this.tab(i, side, rect(side * u, y0 + 0.1, side * (u + 0.7), y1 - 0.1));
    return mesh;
  }

  /** A deck floating over one page, held parallel to it by legs that copy the tent. Flat spread coordinates. */
  private deck(i: number, tent: Tent, side: number, o: { outline: V2[]; paint?: Painter; legs: [number, number, number][]; shade: [number, number, number, number] }) {
    const mesh = this.card({ outline: o.outline, spread: i, space: "box", front: o.paint });
    mesh.matrixAutoUpdate = false;
    this.moving[i].add(mesh);
    const legs = o.legs.map(([u, y0, y1]) => ({ u, mesh: this.strut(i, side, u, tent.s, y0, y1) }));
    const [cx, cy, w, h] = o.shade;
    this.contact(i, side, [cx, cy], 0, w, h, 0.42);
    this.mech[i].push((f) => {
      const v = side < 0 ? tent.vL : tent.vR;
      const g = pagePoint(f, side, 0, TP / 2);
      pageBasis(mesh.matrix, f, side, g[0] + v[0], g[1] + v[1]);
      mesh.matrixWorldNeedsUpdate = true;
      for (const leg of legs) {
        strutBasis(leg.mesh.matrix, pagePoint(f, side, leg.u), v, tent.s);
        leg.mesh.matrixWorldNeedsUpdate = true;
      }
    });
    return mesh;
  }

  /* ── Print: cover and pages ────────────────────────────────────────── */

  private coverPainter(): Painter {
    return (L, T) => {
      const { cover, author } = this.view;
      L("blind", (c) => {
        c.lineWidth = 0.14;
        c.strokeRect(1.2, 1.2, 21.2, 28.3);
        T.text(c, cover.sub, 3, 23.9, { size: 0.66, weight: 500 });
        T.text(c, author, 3, 27.1, { size: 0.44, role: "mono", track: 0.18, upper: true });
        T.text(c, cover.edition, 20.9, 27.1, { size: 0.44, role: "mono", track: 0.18, upper: true, align: "right" });
      });
      L("foil", (c) => {
        c.beginPath();
        c.arc(3.75, 5.1, 0.72, 0, Math.PI * 2);
        c.fill();
        c.lineWidth = 0.07;
        for (const r of [1.25, 1.8])
          for (const [a0, a1] of [
            [-0.9, 0.2],
            [2.3, 3.4],
          ]) {
            c.beginPath();
            c.arc(3.75, 5.1, r, a0, a1);
            c.stroke();
          }
        const y = T.text(c, cover.title, 3, 11.4, { size: 2.25, role: "display", weight: 600, width: 18, lead: 1.08, track: -0.02 });
        c.fillRect(3, y - 1.2, 5.2, 0.09);
        c.lineWidth = 0.045;
        c.strokeRect(1.62, 1.62, 20.36, 27.46);
      });
    };
  }

  /** What is letterpressed on the ten page faces, in page coordinates (24 x 30, y down; the gutter is at x = 24 on left pages and x = 0 on right pages). */
  private pagePainters(): Record<string, Painter> {
    const numeral = (L: Layers, T: Type, n: string, x = 2) =>
      L("foil", (c) => T.text(c, n, x, 3.4, { size: 1.5, role: "display", weight: 600 }));
    const mono = { size: 0.4, role: "mono", track: 0.08 } as const;
    return {
      "1L": (L, T) => {
        const y = this.view.yogyakarta;
        numeral(L, T, "01");
        L("black", (c) => {
          T.text(c, y.place, 2, 24.6, { size: 2, role: "display", weight: 600, track: -0.02 });
          T.text(c, y.school, 2, 26.2, { size: 0.62, weight: 500 });
        });
        L("teal", (c) => T.text(c, `${y.program} · ${y.meta}`, 2, 27.3, mono));
      },
      "1R": (L, T) => {
        L("black", (c) => T.text(c, this.view.yogyakarta.caption, 9.5, 25.2, { size: 0.6, width: 12.4 }));
      },
      "2L": (L, T) => {
        const b = this.view.bangkit;
        numeral(L, T, "02");
        L("black", (c) => {
          const y = T.text(c, b.program, 2, 20.6, { size: 1.5, role: "display", weight: 600, width: 19, lead: 1.1, track: -0.02 });
          T.text(c, b.points[0] ?? "", 2, y + 0.3, { size: 0.58, width: 17.5 });
        });
        L("teal", (c) => T.text(c, `${b.path} · ${b.period}`, 2, 19.1, mono));
      },
      "2R": (L, T) => {
        const b = this.view.bangkit;
        L("black", (c) => {
          const y = T.text(c, b.title, 3, 18.7, { size: 0.78, role: "display", weight: 600, width: 18 });
          T.text(c, b.points[1] ?? "", 3, y + 0.25, { size: 0.58, width: 17 });
        });
        L("teal", (c) => {
          T.text(c, `${b.capstoneLabel} →`, 9.6, 23.4, mono);
        });
      },
      "3L": (L, T) => {
        numeral(L, T, "03");
        L("black", (c) =>
          T.text(c, this.view.products.title, 2, 20.9, { size: 1.9, role: "display", weight: 600, width: 20, lead: 1.08, track: -0.02 }),
        );
        L("teal", (c) => T.text(c, this.view.products.roles[0].stack, 2, 26.6, mono));
      },
      "3R": (L, T) => {
        L("teal", (c) => {
          // Models become products: loose nodes on the left, set blocks on the right.
          c.lineWidth = 0.06;
          for (let k = 0; k < 3; k++) {
            c.beginPath();
            c.arc(5.2 + k * 1.9, 5.2 + (k % 2) * 1.1, 0.55, 0, Math.PI * 2);
            c.stroke();
            c.strokeRect(13.2 + k * 2.3, 4.6, 1.7, 2.4 - k * 0.5);
          }
          c.beginPath();
          c.moveTo(5.2, 5.2);
          c.lineTo(7.1, 6.3);
          c.lineTo(9, 5.2);
          c.moveTo(10.3, 5.75);
          c.lineTo(12.2, 5.75);
          c.moveTo(11.7, 5.3);
          c.lineTo(12.2, 5.75);
          c.lineTo(11.7, 6.2);
          c.stroke();
          T.text(c, this.view.products.roles[1].stack, 5, 9.2, mono);
        });
      },
      "4L": (L, T) => {
        L("foil", (c) => T.text(c, "04", 2, 24.9, { size: 1.5, role: "display", weight: 600 }));
        L("black", (c) =>
          T.text(c, this.view.crossing.title, 2, 27.2, { size: 1.7, role: "display", weight: 600, track: -0.02 }),
        );
      },
      "4R": (L, T) => {
        const x = this.view.crossing;
        L("black", (c) => {
          T.text(c, x.company, 2.2, 25.1, { size: 0.6, weight: 600 });
          T.text(c, x.summary, 2.2, 27.1, { size: 0.52, width: 19.5 });
        });
        L("teal", (c) => T.text(c, `${x.role} · ${x.period}`, 2.2, 26, mono));
      },
      "5L": (L, T) => {
        const k = this.view.kumamoto;
        numeral(L, T, "05");
        L("foil", (c) => T.text(c, k.year, 2, 20.9, { size: 2.5, role: "display", weight: 600, track: -0.03 }));
        L("black", (c) => {
          T.text(c, k.title, 2, 23.2, { size: 1.5, role: "display", weight: 600, track: -0.02 });
          T.text(c, `${k.role}, ${k.company}`, 2, 24.6, { size: 0.58, weight: 600, width: 20 });
          T.text(c, k.summary, 2, 26.7, { size: 0.5, width: 19.5 });
        });
        L("teal", (c) => T.text(c, k.period, 2, 25.6, mono));
      },
      "5R": (L, T) => {
        const k = this.view.kumamoto;
        L("teal", (c) => {
          T.text(c, k.location, 2.2, 24.4, mono);
          c.fillRect(2.2, 24.9, 3.2, 0.05);
        });
        L("black", (c) => T.text(c, k.stack, 2.2, 26, { ...mono, width: 9.5, lead: 1.7 }));
      },
    };
  }

  /* ── Spread 1: Yogyakarta ──────────────────────────────────────────── */

  private spread1() {
    // The far ranges of the campus are one V-fold; the halls in front are boxes across its crease.
    const sky: V2[] = [
      [15, 0],
      [15, 5.2],
      [12, 5.2],
      [12, 6.8],
      [8.4, 6.8],
      [8.4, 9],
      [5.6, 9],
      [5.6, 8.2],
      [2.4, 8.2],
      [2.4, 10],
      [-2.4, 10],
      [-2.4, 8.6],
      [-6.2, 8.6],
      [-6.2, 7.2],
      [-9.6, 7.2],
      [-9.6, 9.3],
      [-12.4, 9.3],
      [-12.4, 5.6],
      [-15, 5.6],
      [-15, 0],
    ];
    const v = this.vfold(1, {
      y0: 6,
      alpha: 45,
      dir: 1,
      outline: sky,
      paint: (L) => {
        facade(L, 8.4, 12, 6.8);
        facade(L, 2.4, 8.4, 8.2);
        facade(L, -2.4, 2.4, 10);
        facade(L, -9.6, -2.4, 7.2);
        facade(L, -15, -9.6, 5.6);
        facade(L, 12, 15, 5.2);
      },
    });
    const gable = (d: number, h: number, pitch: number): V2[] => [
      [0, 0],
      [d, 0],
      [d, h],
      [d * 0.5, h + pitch],
      [0, h],
    ];
    this.box(1, v, 3.3, gable(3.3, 8.6, 1), (L) => facade(L, 0, 3.3, 8.6));
    this.box(1, v, 6.2, gable(6.2, 5, 0), (L) => facade(L, 0, 6.2, 5, true));
    this.box(1, v, 9.6, gable(9.6, 2.5, 0), (L) => {
      L("teal", (c) => c.fillRect(0, -2.5, 9.6, 0.26));
      L("black", (c) => {
        // A colonnade along the front terrace.
        for (let x = 0.5; x < 9.4; x += 0.85) c.fillRect(x, -2, 0.16, 2);
        c.fillRect(0, -2.12, 9.6, 0.1);
      });
    });
  }

  /* ── Spread 2: Bangkit Academy ─────────────────────────────────────── */

  private spread2() {
    // Five folded certificates, each a V-fold of the same angle, stepping up towards the back.
    const titles = this.view.bangkit.specialisations;
    for (let k = 0; k < 5; k++) {
      const s = 7.6 + k * 0.3;
      const h = k === 0 ? 6 : 6.2 + k * 2.1;
      this.vfold(2, {
        y0: 0.4 + k * 1.8,
        alpha: 62,
        dir: -1,
        outline: roundRect(-s, 0, s, h, [0, 0, 0.3, 0.3]),
        paint: (L, T) => {
          const b = this.view.bangkit;
          L("teal", (c) => {
            c.lineWidth = 0.07;
            c.strokeRect(-s + 0.55, -h + 0.55, s * 2 - 1.1, h - 1.1);
            c.lineWidth = 0.03;
            c.strokeRect(-s + 0.75, -h + 0.75, s * 2 - 1.5, h - 1.5);
            if (k > 0) T.text(c, `0${k} / 0${titles.length}`, -s + 1.2, -h + 1.75, { size: 0.36, role: "mono", track: 0.1 });
            else T.text(c, b.scoreLabel, 0, -1.25, { size: 0.36, role: "mono", track: 0.12, align: "center", upper: true });
          });
          if (k > 0) L("black", (c) => T.text(c, titles[k - 1] ?? "", -s + 3.3, -h + 1.7, { size: 0.46, weight: 600, width: s * 2 - 4.6 }));
          else {
            L("black", (c) => T.text(c, b.title, 0, -h + 1.75, { size: 0.5, weight: 600, align: "center" }));
            L("foil", (c) => {
              T.text(c, b.score, 0, -2.2, { size: 2.2, role: "display", weight: 600, align: "center", track: -0.02 });
              c.beginPath();
              c.arc(-s + 1.7, -1.5, 0.5, 0, Math.PI * 2);
              c.arc(s - 1.7, -1.5, 0.5, 0, Math.PI * 2);
              c.fill();
            });
          }
        },
      });
    }

    // Pull tab: a strip in a sleeve on the right page. Pulling it out of the fore-edge reveals the capstone line.
    const sleeve = this.card({
      outline: rect(9.3, -12.9, 22.6, -9.3),
      t: 0.05,
      spread: 2,
      space: "box",
      front: (L) =>
        L("blind", (c) => {
          c.lineWidth = 0.05;
          c.strokeRect(0.35, 0.35, 12.6, 2.9);
        }),
    });
    this.onPage(2, 1, sleeve, 0.105);
    const strip = this.card({
      outline: roundRect(0, -1.6, 14.6, 1.6, [0, 0.8, 0.8, 0]),
      t: 0.06,
      spread: 2,
      space: "box",
      front: (L, T) => {
        const b = this.view.bangkit;
        L("teal", (c) => {
          T.text(c, b.capstoneLabel, 4, 0.8, { size: 0.3, role: "mono", track: 0.14, upper: true });
          T.text(c, this.view.pull, 12.55, 1.72, { size: 0.3, role: "mono", track: 0.1, upper: true });
        });
        L("black", (c) => T.text(c, b.capstone, 4, 1.45, { size: 0.42, weight: 500, width: 8 }));
        L("foil", (c) => {
          c.beginPath();
          c.moveTo(13.1, 2.15);
          c.lineTo(13.9, 2.5);
          c.lineTo(13.1, 2.85);
          c.fill();
        });
      },
    });
    strip.position.y = -11.1;
    this.onPage(2, 1, strip, 0.04);
    this.contact(2, 1, [16, -11.1], 0, 15, 5, 0.3);
    this.mech[2].push((_, s) => (strip.position.x = 10.2 + s.tab * TAB_PULL));
    this.handles.push({ kind: "tab", obj: strip, spread: 2 });
  }

  /* ── Spread 3: From models to products ─────────────────────────────── */

  private spread3() {
    const plate = (r: number, w: number, h: number): Painter => (L, T) => {
      const role = this.view.products.roles[r];
      L("teal", (c) => {
        c.lineWidth = 0.06;
        c.strokeRect(0.5, 0.5, w - 1, h - 1);
        T.text(c, role.period, 1.3, h - 1.3, { size: 0.4, role: "mono", track: 0.08 });
      });
      L("black", (c) => {
        const y = T.text(c, role.company, 1.3, 3, { size: 1.5, role: "display", weight: 600, track: -0.02 });
        T.text(c, role.role, 1.3, y - 0.4, { size: 0.62, weight: 600 });
        T.text(c, role.point, 1.3, y + 1, { size: 0.5, width: w - 2.8 });
      });
    };
    // Two decks, one per role, the later one higher: each hangs on its own tent.
    const low = this.tent(3, { c: 1.2, s: 3.4, spans: [[3, 9]] });
    this.deck(3, low, -1, {
      outline: roundRect(-17, -1, -1.2, 11, [0.3, 0.3, 0.3, 0.3]),
      paint: plate(0, 15.8, 12),
      legs: [
        [16.2, 0, 3],
        [16.2, 7, 10],
      ],
      shade: [-9, 5, 18, 14],
    });
    const high = this.tent(3, { c: 1.2, s: 5.6, spans: [[-9, -3]] });
    this.deck(3, high, 1, {
      outline: roundRect(1.2, -11, 17.2, 1, [0.3, 0.3, 0.3, 0.3]),
      paint: plate(1, 16, 12),
      legs: [
        [16.4, -10, -7],
        [16.4, -3, 0],
      ],
      shade: [9.5, -5, 19, 14],
    });
  }

  /* ── Spread 4: Crossing to Kumamoto ────────────────────────────────── */

  private spread4() {
    const tent = this.tent(4, {
      c: 1.5,
      s: 2.4,
      spans: [
        [-7, -4],
        [6, 9],
      ],
    });
    const [a, b] = ROUTE;
    const heading = Math.atan2(b[1] - a[1], b[0] - a[0]);
    // The sea is one deck, creased over the gutter. Deck coordinates sit 1.5 further out than the flat spread.
    const sea = (side: number): Painter => (L, T) => {
      const x0 = side < 0 ? -21.5 : 1.5;
      const X = (x: number) => x + side * 1.5 - x0;
      const Y = (y: number) => 10 - y;
      L("teal", (c) => {
        c.lineWidth = 0.04;
        for (let y = 0.9; y < 18; y += 1.05) {
          c.beginPath();
          for (let x = 0; x <= 20; x += 0.25) c.lineTo(x, y + 0.16 * Math.sin((x - side * x0) * 1.9 + y * 2.1));
          c.stroke();
        }
      });
      L("black", (c) => {
        // The route, dotted, beside the rail the plane rides on.
        for (let t = 0; t <= 1.001; t += 0.022) {
          const x = a[0] + (b[0] - a[0]) * t;
          if (x * side < 0.3) continue;
          c.beginPath();
          c.arc(X(x) + 0.75 * Math.sin(heading), Y(a[1] + (b[1] - a[1]) * t) + 0.75 * Math.cos(heading), 0.07, 0, Math.PI * 2);
          c.fill();
        }
        const end = side < 0 ? a : b;
        T.text(c, side < 0 ? this.view.crossing.from : this.view.crossing.to, X(end[0]) - 2.2, Y(end[1]) + (side < 0 ? 4.4 : -4.3), {
          size: 0.42,
          role: "mono",
          track: 0.14,
          upper: true,
        });
      });
    };
    const decks = [-1, 1].map((side) => {
      const mesh = this.deck(4, tent, side, {
        outline: roundRect(side < 0 ? -21.5 : 1.5, -8, side < 0 ? -1.5 : 21.5, 10, side < 0 ? [0.4, 0, 0, 0.4] : [0, 0.4, 0.4, 0]),
        paint: sea(side),
        legs: [
          [20.6, -7, -4],
          [20.6, 6, 9],
        ],
        shade: [side * 11.5, 1, 23, 20],
      });
      // Rail: a paper strip the plane's runner is looped around.
      const end = side < 0 ? a : b;
      const mid: V2 = [0, a[1] + (b[1] - a[1]) * (-a[0] / (b[0] - a[0]))];
      const nx = -Math.sin(heading) * 0.22;
      const ny = Math.cos(heading) * 0.22;
      const p0: V2 = [end[0] + side * 1.5 + side * 0.9 * Math.cos(heading), end[1] + side * 0.9 * Math.sin(heading)];
      const p1: V2 = [mid[0] + side * 1.5 + side * 0.25, mid[1] + side * 0.25 * Math.tan(heading)];
      const rail = this.card({
        outline: [
          [p0[0] + nx, p0[1] + ny],
          [p0[0] - nx, p0[1] - ny],
          [p1[0] - nx, p1[1] - ny],
          [p1[0] + nx, p1[1] + ny],
        ],
        t: 0.05,
        spread: 4,
      });
      rail.position.z = TP / 2 + 0.11;
      mesh.add(rail);
      return mesh;
    });

    // Islands: stacked card, glued flat to the sea.
    const island = (deck: THREE.Mesh, outline: V2[], level: number, front?: Painter) => {
      const mesh = this.card({ outline, t: 0.07, spread: 4, space: "box", front });
      mesh.position.z = TP / 2 + 0.035 + level * 0.07;
      deck.add(mesh);
    };
    island(decks[0], blob(-14.5, -3.4, 3.6, 1.1, [0.12, 0.08, 0.05], 0.35), 0);
    island(decks[0], blob(-14.8, -3.5, 2.3, 0.6, [0.1, 0.06], 0.35), 1);
    island(decks[0], blob(-9.2, -5.6, 2.6, 0.75, [0.1, 0.1], -0.1), 0);
    island(decks[0], blob(-17.6, 0.6, 1.5, 2.3, [0.14, 0.08], 0.5), 0);
    island(decks[0], blob(-6, -2.2, 1.5, 1.2, [0.16, 0.1], 0.2), 0);
    island(decks[1], blob(14.2, 6, 2.5, 3.3, [0.1, 0.07, 0.05], -0.35), 0);
    island(decks[1], blob(14.3, 6.1, 1.5, 2.2, [0.1, 0.06], -0.35), 1, (L) =>
      L("foil", (c) => {
        // Kumamoto, marked in foil.
        c.beginPath();
        c.arc(1.35, 2.5, 0.2, 0, Math.PI * 2);
        c.fill();
        c.lineWidth = 0.05;
        c.beginPath();
        c.arc(1.35, 2.5, 0.48, 0, Math.PI * 2);
        c.stroke();
      }),
    );

    // The folded paper plane: two wings and a keel on a runner.
    const plane = new THREE.Group();
    const wings = [-1, 1].map((k) => {
      const wing = this.card({
        outline: [
          [1.5, 0],
          [-1.2, 0],
          [-1.35, k * 1.15],
        ],
        t: 0.035,
        spread: 4,
        count: k > 0,
        space: "box",
        // Printed solid, so the plane reads against the sea.
        front: (L) => L("teal", (c) => c.fillRect(-1, -1, 5, 4)),
      });
      plane.add(wing);
      return wing;
    });
    const keel = this.card({
      outline: [
        [1.5, 0],
        [-1.2, 0],
        [-1.2, -0.5],
      ],
      t: 0.05,
      spread: 4,
      count: false,
    });
    keel.rotation.x = Math.PI / 2;
    plane.add(keel);
    const holder = new THREE.Group();
    holder.matrixAutoUpdate = false;
    holder.add(plane);
    this.moving[4].add(holder);
    this.mech[4].push((f, s) => {
      const x = a[0] + (b[0] - a[0]) * s.plane;
      const side = x < 0 ? -1 : 1;
      holder.matrix.copy(decks[side < 0 ? 0 : 1].matrix);
      holder.matrixWorldNeedsUpdate = true;
      // The wings lift as the book opens and press flat as it shuts.
      const lift = smooth((f.phi - 2.2) / 0.9);
      plane.position.set(x + side * 1.5, a[1] + (b[1] - a[1]) * s.plane, TP / 2 + 0.2 + 0.5 * lift);
      plane.rotation.z = heading;
      wings[0].rotation.x = -0.3 * lift;
      wings[1].rotation.x = 0.3 * lift;
      keel.scale.y = 0.05 + 0.95 * lift;
    });
    this.handles.push({ kind: "plane", obj: plane, spread: 4 });
  }

  /* ── Spread 5: Kumamoto, now ───────────────────────────────────────── */

  private spread5() {
    const family = { alpha: 66, dir: -1 };
    // Sky panel: the right wing has an arched window with the sky wheel riveted behind it.
    const treeline: Painter = (L) => {
      L("teal", (c) => {
        c.lineWidth = 0.035;
        for (let y = 2.4; y < 15; y += 0.55 + y * 0.03) {
          c.beginPath();
          c.moveTo(-17, -y);
          c.lineTo(17, -y);
          c.stroke();
        }
      });
      L("black", (c) => {
        c.beginPath();
        c.moveTo(-17, 0);
        for (let x = -17; x <= 17; x += 0.35) c.lineTo(x, -(1.1 + 0.5 * Math.sin(x * 1.7) + 0.35 * Math.sin(x * 4.3 + 1)));
        c.lineTo(17, 0);
        c.fill();
      });
      L("foil", (c) => {
        c.lineWidth = 0.09;
        c.beginPath();
        c.arc(WX, -(WY + 0.6), 6.35, Math.PI, 0);
        c.stroke();
        c.beginPath();
        c.arc(WX, -WY, 0.3, 0, Math.PI * 2);
        c.fill();
      });
    };
    const sky = this.vfold(5, {
      ...family,
      y0: 7.4,
      outline: [
        [17, 0],
        [17, WY],
        ...arc(WX, WY, 7, 0, Math.PI, 40),
        [0, WY],
        [-6, 6.9],
        [-12, 5.6],
        [-17, 4.2],
        [-17, 0],
      ],
      holesR: [[...arc(WX, WY + 0.6, 6, 0, Math.PI, 36)]],
      paint: treeline,
    });
    this.skyWing = sky.R;

    // The wheel: dusk on one half, the Night Signal night and its foil stars on the other.
    const R = 7.8;
    const wheel = this.card({
      outline: Array.from({ length: 144 }, (_, i) => {
        const angle = (i / 144) * Math.PI * 2;
        const r = i % 2 ? R : R - 0.14;
        return [r * Math.cos(angle), r * Math.sin(angle)] as V2;
      }),
      t: 0.06,
      spread: 5,
      space: "box",
      front: (L) => {
        L("teal", (c) => {
          // Dusk: rules that crowd together towards the horizon.
          c.lineWidth = 0.05;
          for (let k = 0; k < 16; k++) {
            const y = R - 0.2 - k * k * 0.03 - k * 0.12;
            const half = Math.sqrt(Math.max(0, R * R - (R - y) * (R - y)));
            c.beginPath();
            c.moveTo(R - half, y);
            c.lineTo(R + half, y);
            c.stroke();
          }
        });
        L("night", (c) => {
          c.beginPath();
          c.arc(R, R, R - 0.45, 0, Math.PI);
          c.fill();
        });
        L("black", (c) => {
          c.lineWidth = 0.05;
          c.beginPath();
          c.arc(R, R, R - 0.3, 0, Math.PI * 2);
          c.stroke();
        });
        L("foil", (c) => {
          // The setting sun, and on the night side a crescent and stars.
          c.beginPath();
          c.arc(R - 3.1, R - 2.4, 1.15, 0, Math.PI * 2);
          c.fill();
          c.beginPath();
          c.arc(R + 3.2, R + 3.9, 1, 0.5, 0.5 + Math.PI * 2);
          c.arc(R + 3.65, R + 3.6, 0.85, 0.5 + Math.PI * 2, 0.5, true);
          c.fill("evenodd");
          let seed = 5;
          const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
          for (let k = 0; k < 46; k++) {
            const angle = 0.12 + rnd() * (Math.PI - 0.24);
            const r = 1 + rnd() * (R - 2);
            const size = 0.07 + rnd() * rnd() * 0.2;
            const x = R + r * Math.cos(angle);
            const y = R + r * Math.sin(angle);
            c.beginPath();
            for (let q = 0; q < 8; q++) {
              const d = q % 2 ? size * 0.35 : size;
              c.lineTo(x + d * Math.cos((q * Math.PI) / 4), y + d * Math.sin((q * Math.PI) / 4));
            }
            c.fill();
          }
        });
      },
    });
    wheel.position.set(WX, WY, -(TP / 2 + 0.06));
    sky.R.add(wheel);
    this.mech[5].push((_, s) => (wheel.rotation.z = -s.wheel * Math.PI));
    this.handles.push({ kind: "wheel", obj: wheel, spread: 5 });

    // The castle: three storeys of keep and two of stone wall, every layer a V-fold of the same angle.
    const keep: [number, number, Tier[], number?][] = [
      [4.9, 3.1, [{ y: 11.2, ew: 4.9, ty: 13.3, tw: 2.5 }, { y: 14.3, ew: 4, ty: 16.6, tw: 0.9 }], 17.5],
      [3.4, 5.3, [{ y: 6.6, ew: 7.3, ty: 8.9, tw: 4.3 }, { y: 9.9, ew: 6, ty: 12, tw: 3.2 }]],
      [1.9, 7.5, [{ y: 3.8, ew: 9.7, ty: 6.3, tw: 6 }]],
    ];
    for (const [y0, w0, tiers, peak] of keep)
      this.vfold(5, { ...family, y0, outline: castleOutline(w0, tiers, peak), paint: castlePaint(w0, tiers, peak) });
    this.vfold(5, { ...family, y0: 0.3, outline: wallOutline(12.5, 9.6, 4.4), paint: wallPaint(12.5, 4.4) });
    this.vfold(5, { ...family, y0: -1.3, outline: wallOutline(15.5, 13.2, 2.5), paint: wallPaint(15.5, 2.5) });

    // Pull tab: the contact card slides out of a sleeve, towards the reader.
    const sleeve = this.card({
      outline: rect(12.7, -14.2, 22.5, -8.7),
      t: 0.05,
      spread: 5,
      space: "box",
      front: (L, T) => {
        L("blind", (c) => {
          c.lineWidth = 0.05;
          c.strokeRect(0.4, 0.4, 9, 4.7);
        });
        L("teal", (c) => {
          T.text(c, `${this.view.pull} ↓`, 4.9, 3.1, { size: 0.36, role: "mono", track: 0.14, upper: true, align: "center" });
        });
      },
    });
    this.onPage(5, 1, sleeve, 0.105);
    const card = this.card({
      outline: roundRect(0, 0, 8.6, 5.4, [0.25, 0.25, 0.25, 0.25]),
      t: 0.06,
      spread: 5,
      space: "box",
      front: (L, T) => {
        const k = this.view.kumamoto;
        L("black", (c) => {
          T.text(c, k.cardLine, 0.6, 1.7, { size: 0.76, role: "display", weight: 600, width: 7.6, lead: 1.1, track: -0.02 });
          T.text(c, k.email, 0.6, 3.6, { size: 0.37, role: "mono" });
        });
        L("foil", (c) => c.fillRect(0.6, 3.95, 7.4, 0.05));
        L("teal", (c) => T.text(c, this.view.author, 0.6, 4.75, { size: 0.3, role: "mono", track: 0.14, upper: true }));
      },
    });
    card.position.x = 13.3;
    this.onPage(5, 1, card, 0.04);
    this.contact(5, 1, [17.6, -12], 0, 12, 8, 0.3);
    this.mech[5].push((_, s) => (card.position.y = -14.9 - s.card * CARD_PULL));
    this.handles.push({ kind: "card", obj: card, spread: 5 });
    this.emailBox = { mesh: card, x0: 0.45, y0: 1.5, x1: 8.1, y1: 2.25 };
  }

  /* ── Pointer ───────────────────────────────────────────────────────── */

  /** What is under the pointer: a mechanism handle, or the turnable outer strip of the top leaf of a pile. */
  pick(raycaster: THREE.Raycaster, p: number): Pick | null {
    const live = this.handles.filter((handle) => this.frames[handle.spread].phi > 2.7);
    const hit = raycaster.intersectObjects(
      live.map((handle) => handle.obj),
      true,
    )[0];
    if (hit) {
      for (let o: THREE.Object3D | null = hit.object; o; o = o.parent) {
        const handle = live.find((candidate) => candidate.obj === o);
        if (handle) return { kind: handle.kind };
      }
    }
    const page = raycaster.intersectObjects(this.leafMeshes, false)[0];
    if (!page) return null;
    const leaf = page.object.userData.leaf as number;
    const j = Math.min(4, Math.floor(p));
    const resting = p - j < 1e-3;
    if (leaf !== j && !(resting && leaf === j - 1) && !(p >= 5 - 1e-3 && leaf === 4)) return null;
    const u = this.leaves[leaf].worldToLocal(page.point.clone()).x;
    return u > PW * 0.68 ? { kind: "turn", leaf, u } : null;
  }

  /** Pointer ray in the local frame of `obj`, cut by its z = 0 plane. */
  private local(obj: THREE.Object3D, ray: THREE.Ray) {
    tmpRay.copy(ray).applyMatrix4(tmpM.copy(obj.matrixWorld).invert());
    const t = -tmpRay.origin.z / tmpRay.direction.z;
    return tmpO.copy(tmpRay.origin).addScaledVector(tmpRay.direction, t);
  }

  /** Where the pointer ray crosses the horizontal plane through a spread's gutter. */
  gutterX(ray: THREE.Ray, spread: number) {
    const y = this.frames[Math.max(1, Math.min(5, spread))].gy;
    return ray.origin.x + (ray.direction.x * (y - ray.origin.y)) / ray.direction.y;
  }

  private handleValue(kind: HandleKind, ray: THREE.Ray) {
    if (kind === "tab") return this.local(this.leaves[2], ray).x / TAB_PULL;
    if (kind === "card") return -this.local(this.leaves[5], ray).y / CARD_PULL;
    if (kind === "wheel") {
      const at = this.local(this.skyWing, ray);
      return -Math.atan2(at.y - WY, at.x - WX) / Math.PI;
    }
    const [a, b] = ROUTE;
    const t = (2.4 - ray.origin.y) / ray.direction.y;
    const x = ray.origin.x + ray.direction.x * t - a[0];
    const y = -(ray.origin.z + ray.direction.z * t) - a[1];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    return (x * dx + y * dy) / (dx * dx + dy * dy);
  }

  dragStart(kind: HandleKind, ray: THREE.Ray) {
    this.dragAt = this.handleValue(kind, ray);
  }

  /** Move a mechanism with the pointer. */
  dragMove(kind: HandleKind, ray: THREE.Ray, s: BookState) {
    const now = this.handleValue(kind, ray);
    let delta = now - this.dragAt;
    if (kind === "wheel") delta -= Math.round(delta / 2) * 2; // angles wrap
    this.dragAt = now;
    s[kind] = Math.min(1, Math.max(0, s[kind] + delta));
  }

  dispose() {
    for (const item of this.owned) item.dispose();
    for (const decal of this.decals) decal.mat.dispose();
    this.root.removeFromParent();
  }
}
