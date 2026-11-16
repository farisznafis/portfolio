"use client";

/*
 * THE GALLERY AFTER HOURS — rules of the medium
 *
 * One medium: a real exhibition hall, photographed by an architectural
 * photographer after closing. Every frame obeys these, or it is wrong.
 *
 * SURFACE  Walls are matte teal-charcoal plaster, trowelled by hand: the
 *          sweeps only show where light rakes down them. The floor is dark
 *          power-floated concrete with saw-cut joints; it is polished, not
 *          mirrored, so it returns the light pools as long soft smears and
 *          never an image. The ceiling is low, black, and carries two
 *          recessed lighting tracks. Frames are thin black lacquer or dark
 *          oak with an eased arris; mats are thick cotton board with a 45°
 *          bevelled window; glazing shows nothing head-on and a pale glare
 *          only at grazing angles. Nothing glows. Nothing is plastic.
 * LIGHT    The building is dark. Each print has one warm spot on the track,
 *          1.05 m off the wall: brightest on the print, a teardrop on the
 *          plaster, gone before the next frame. Between pools there is only
 *          a breath of ambient and a cool teal that leaks under the closed
 *          door at the far end. Amber exists as lamp colour and as one short
 *          painted rule per wing, nowhere else. Light adds; it never fills.
 * FLAWS    No two lamps share a colour temperature, an aim or a beam shape.
 *          Frames hang a few millimetres high or low and a hair off level.
 *          Frames throw shadows down the wall and their lips shade the mat.
 *          Paint thins on the high spots of the plaster. Dust shows only
 *          where it crosses a beam close to the lens.
 * CAMERA   A person, 1.55 m to the eye, walking the centre line at the pace
 *          of the page scroll, with the faint sway of footsteps. The head
 *          turns a few degrees toward the pointer. It never flies except to
 *          step up to one print, square and close, and back again. The lens
 *          stays 52° and the exposure never changes. On an upright phone,
 *          which has no pointer and a narrow view, the lens is 70° and the
 *          head turns to the next print by itself.
 * SCALE    Geometry is instanced and lit analytically (no three.js lights),
 *          so a thousand prints are a thousand instances. Pictures stream
 *          into texture arrays for a window around the camera (stream.ts).
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type MutableRefObject, type RefObject } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { localized } from "../../lib/content/common";
import { mediaUrl, photoFacts } from "../../lib/content/gallery";
import { G_EASE, gsap } from "../../motion/gsap";
import type { Lang } from "../../types/common";
import { loadFonts, makeType, type Type } from "../book/press";
import { fixtureCanvas } from "./fixture";
import { alongOf, attractAt, HALL, lightboxRect, lowerBound, scrollOf, stationOf, type HallPlan } from "./plan";
import { buildFrame, buildPool, buildShell, makeMaterials, NIGHT, type HallMaterials } from "./materials";
import type { GallerySound } from "./sound";
import { BUDGET, LABEL_PX, loadImage, Streamer, TITLE_PX, type Loader, type Painters } from "./stream";

const TITLE_Y = 1.72;
const FOV = 52;

export interface HallProps {
  plan: HallPlan;
  lang: Lang;
  /** "{count} prints", for the wing title walls. */
  printsLabel: string;
  low: boolean;
  reduce: boolean;
  /** False while nobody can see the hall: Index view, hidden tab, loader still up. */
  running: boolean;
  /** The lightbox is over the hall: draw only when something changes. */
  covered: boolean;
  attract: boolean;
  /** `?t=`: attract mode frozen at this second. */
  frozen: number | null;
  /** The print the camera stands in front of, or null to walk. */
  focus: number | null;
  sound: MutableRefObject<GallerySound | null>;
  onOpen(index: number): void;
  onArrive(): void;
  onFail(): void;
}

/** Lettering is drawn white-on-black into the red channel; the wing's amber rule goes into green. */
function makePainters(type: Type, lang: Lang, printsLabel: string): Painters {
  const sheet = (w: number, h: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    return {
      canvas,
      ctx,
      wipe() {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#f00";
      },
    };
  };
  const label = sheet(LABEL_PX.w, LABEL_PX.h);
  const title = sheet(TITLE_PX.w, TITLE_PX.h);
  return {
    label(print) {
      const facts = photoFacts(print.photo, lang);
      const lines = [[facts.place, facts.date].filter(Boolean).join(", "), facts.camera].filter(Boolean) as string[];
      if (!facts.title && lines.length === 0) return null;
      const { ctx } = label;
      const width = LABEL_PX.w - 56;
      label.wipe();
      let y = 56;
      if (facts.title) y = type.text(ctx, facts.title, 28, y, { size: 25, role: "mono", weight: 500, width, lead: 1.25 }) + 8;
      for (const line of lines) y = type.text(ctx, line, 28, y, { size: 18, role: "mono", width, lead: 1.3 });
      return label.canvas;
    },
    title(wing) {
      const { ctx } = title;
      const name = localized(wing.series.title, lang) ?? "";
      title.wipe();
      let size = 250;
      ctx.font = `600 ${size}px ${type.families[0]}`;
      const measured = ctx.measureText(name).width;
      if (measured > TITLE_PX.w - 80) size *= (TITLE_PX.w - 80) / measured;
      let y = 44 + size * 0.78;
      type.text(ctx, name, 22, y, { size, role: "display", weight: 600, track: -0.02 });
      y += 46;
      ctx.fillStyle = "#0f0";
      ctx.fillRect(26, y, 150, 8);
      ctx.fillStyle = "#f00";
      y += 62;
      const description = localized(wing.series.description, lang);
      if (description) y = type.text(ctx, description, 26, y, { size: 30, role: "mono", width: 1500, lead: 1.4 });
      type.text(ctx, printsLabel.replace("{count}", String(wing.count)), 26, y, { size: 28, role: "mono", upper: true, track: 0.14 });
      return title.canvas;
    },
  };
}

interface World {
  materials: HallMaterials;
  streamer: Streamer;
  dynamic: THREE.InstancedBufferAttribute[];
  hover: THREE.InstancedBufferAttribute;
  composer: EffectComposer | null;
  /** Shaders have finished compiling; nothing is drawn before that. */
  ready: boolean;
}

function Stage({ wrap, ...props }: HallProps & { wrap: RefObject<HTMLDivElement | null> }) {
  const { plan, low, reduce, lang, printsLabel, focus } = props;
  const { gl, scene, camera, size, setDpr, invalidate } = useThree();
  const dpr = useThree((state) => state.viewport.dpr);
  const [built, setBuilt] = useState(0);
  const world = useRef<World | null>(null);
  const latest = useRef(props);
  latest.current = props;
  const pointer = useRef({ x: 0, y: 0, inside: false });
  const clampS = (s: number) => Math.min(plan.last, Math.max(HALL.start, s));
  const run = useRef({
    s: clampS(alongOf(window.scrollY)),
    walked: 0,
    clock: props.frozen ?? 0,
    attract: props.attract,
    px: 0,
    py: 0,
    glance: 0,
    focus: -1,
    k: 0,
    started: false,
    hot: new Map<number, number>(),
    tween: null as gsap.core.Tween | null,
    // Frame-time governor.
    dpr: Math.min(window.devicePixelRatio || 1, low ? 1.5 : 2),
    frames: 0,
    acc: 0,
    n: 0,
    slow: 0,
  });
  const stations = useMemo(() => Float32Array.from([HALL.start, ...plan.prints.map(stationOf)].sort((a, b) => a - b)), [plan]);

  // Build the hall: one shell, a handful of instanced meshes, the texture arrays.
  useEffect(() => {
    const n = plan.prints.length;
    const total = n + plan.wings.length;
    gl.toneMapping = THREE.NeutralToneMapping;
    gl.toneMappingExposure = 1;
    scene.background = new THREE.Color(NIGHT);
    setDpr(run.current.dpr);

    const load: Loader = (print, px) =>
      process.env.NODE_ENV !== "production" && print.photo.storagePath.startsWith("fixture/")
        ? Promise.resolve(fixtureCanvas(print.photo, px))
        : loadImage(mediaUrl(print.photo, px));
    const streamer = new Streamer(gl, plan, load, BUDGET[low ? "low" : "high"]);
    streamer.onLoad = () => invalidate();
    const materials = makeMaterials({
      thumbs: streamer.thumbs.texture,
      walls: streamer.walls.texture,
      labels: streamer.labels.texture,
      titles: streamer.titles.texture,
    });
    materials.uniforms.uEnd.value = -plan.end;

    // Per-instance data: every print, then one wash of light per wing title.
    const center = new Float32Array(total * 3);
    const sizes = new Float32Array(total * 4);
    const misc = new Float32Array(total * 4);
    const tint = new Float32Array(total * 3);
    const labelAt = new Float32Array(n * 3);
    const labelSpot = new Float32Array(n * 4);
    const labelHalf = new Float32Array(n * 3);
    const titleAt = new Float32Array(plan.wings.length * 3);
    const titleSpot = new Float32Array(plan.wings.length * 4);
    const titleHalf = new Float32Array(plan.wings.length * 3);
    const color = new THREE.Color();
    for (const p of plan.prints) {
      const i = p.index;
      const at = [p.side * HALL.half, p.y, -p.s];
      center.set(at, i * 3);
      sizes.set([p.hw, p.hh, p.iw, p.ih], i * 4);
      misc.set([p.seed, 0, plan.wings[p.wing].oak ? 1 : 0, p.roll], i * 4);
      color.set(p.photo.dominantColor);
      tint.set([color.r, color.g, color.b], i * 3);
      labelAt.set([p.side * HALL.half, p.labelY, -p.labelS], i * 3);
      labelSpot.set([...at, p.seed], i * 4);
      labelHalf.set([HALL.label.w / 2, HALL.label.h / 2, i], i * 3);
    }
    for (const wing of plan.wings) {
      const i = wing.index;
      const at = [-HALL.half, TITLE_Y, -wing.titleS];
      const seed = (0.37 + i * 0.61) % 1;
      center.set(at, (n + i) * 3);
      misc.set([seed, 1, 0, 0], (n + i) * 4);
      titleAt.set(at, i * 3);
      titleSpot.set([...at, seed], i * 4);
      titleHalf.set([HALL.titleWidth / 2, HALL.titleHeight / 2, -1], i * 3);
    }

    const per = (array: Float32Array, itemSize: number, dynamic = false) => {
      const attribute = new THREE.InstancedBufferAttribute(array, itemSize);
      if (dynamic) attribute.setUsage(THREE.DynamicDrawUsage);
      return attribute;
    };
    const hover = per(new Float32Array(total), 1, true);
    const tex = per(streamer.tex, 4, true);
    const labelLayer = per(streamer.labelLayer, 2, true);
    const titleLayer = per(streamer.titleLayer, 2, true);
    const prints = { aCenter: per(center, 3), aSize: per(sizes, 4), aMisc: per(misc, 4), aTint: per(tint, 3), aTex: tex, aHover: hover };
    const instanced = (base: THREE.BufferGeometry, count: number, attributes: Record<string, THREE.InstancedBufferAttribute> = prints) => {
      const geometry = new THREE.InstancedBufferGeometry();
      geometry.index = base.index;
      for (const [name, attribute] of Object.entries(base.attributes)) geometry.setAttribute(name, attribute);
      for (const [name, attribute] of Object.entries(attributes)) geometry.setAttribute(name, attribute);
      geometry.instanceCount = count;
      return geometry;
    };

    const group = new THREE.Group();
    const add = (object: THREE.Mesh | THREE.Points, order: number) => {
      object.frustumCulled = false;
      object.renderOrder = order;
      group.add(object);
    };
    const shell = buildShell(plan);
    const plane = new THREE.PlaneGeometry(2, 2);
    // Draw order is the picture: floor, its reflections, the room, then light and lettering laid over it.
    add(new THREE.Mesh(shell.floor, materials.shell), -2);
    if (!low) add(new THREE.Mesh(instanced(buildPool(false), total), materials.mirror), -1);
    add(new THREE.Mesh(shell.rest, materials.shell), 0);
    add(new THREE.Mesh(instanced(buildFrame(), n), materials.frame), 0);
    add(new THREE.Mesh(instanced(plane, n), materials.face), 0);
    add(new THREE.Mesh(instanced(new THREE.BoxGeometry(0.07, 0.17, 0.07), total), materials.lamp), 0);
    add(new THREE.Mesh(instanced(buildPool(true), total), materials.pool), 1);
    add(new THREE.Mesh(instanced(plane, n, { aCenter: per(labelAt, 3), aSpot: per(labelSpot, 4), aHalf: per(labelHalf, 3), aLayer: labelLayer }), materials.label), 2);
    add(
      new THREE.Mesh(instanced(plane, plan.wings.length, { aCenter: per(titleAt, 3), aSpot: per(titleSpot, 4), aHalf: per(titleHalf, 3), aLayer: titleLayer }), materials.title),
      2,
    );
    if (!low) {
      const motes = 420;
      const position = new Float32Array(motes * 3);
      const seeds = new Float32Array(motes);
      for (let i = 0; i < motes; i++) {
        seeds[i] = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
        for (let a = 0; a < 3; a++) position[i * 3 + a] = Math.abs(Math.sin((i * 3 + a) * 78.233) * 43758.5453) % 1;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
      add(new THREE.Points(geometry, materials.dust), 3);
    }
    scene.add(group);

    // Light is summed in linear HDR and tone-mapped once at the end. Cheap devices draw straight to the screen.
    const target = low ? null : new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
    let composer: EffectComposer | null = null;
    if (target) {
      composer = new EffectComposer(gl, target);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(new OutputPass());
    }

    const made: World = { materials, streamer, dynamic: [tex, labelLayer, titleLayer], hover, composer, ready: false };
    world.current = made;
    // Compile the shaders off the main thread, for the target they will be drawn into, so the
    // page transition keeps its frames. A blocking compile here costs about half a second.
    gl.setRenderTarget(target);
    void gl.compileAsync(scene, camera).then(() => {
      made.ready = true;
      invalidate();
    });
    gl.setRenderTarget(null);
    setBuilt((count) => count + 1);

    return () => {
      world.current = null;
      scene.remove(group);
      group.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) object.geometry.dispose();
      });
      materials.dispose();
      streamer.dispose();
      composer?.dispose();
      target?.dispose();
    };
  }, [gl, scene, camera, plan, low, setDpr, invalidate]);

  useEffect(() => {
    world.current?.composer?.setPixelRatio(dpr);
    world.current?.composer?.setSize(size.width, size.height);
    invalidate();
  }, [built, dpr, size.width, size.height, invalidate]);

  // Lettering: drawn with the site fonts once they have loaded, and again when the language changes.
  useEffect(() => {
    const made = world.current;
    if (!made) return;
    let dead = false;
    const type = makeType(lang);
    const sample = [
      printsLabel,
      ...plan.wings.flatMap((wing) => [wing.series.title[lang], wing.series.description?.[lang]]),
      ...plan.prints.map((print) => Object.values(photoFacts(print.photo, lang)).join(" ")),
    ].join(" ");
    void loadFonts(type, sample).then(() => {
      if (dead || world.current !== made) return;
      made.streamer.resetText(makePainters(type, lang, printsLabel));
      invalidate();
    });
    return () => {
      dead = true;
    };
  }, [built, lang, plan, printsLabel, invalidate]);

  // Which print is under the pointer. Walls are planes, so this is arithmetic, not a raycast over a thousand meshes.
  const pick = useMemo(() => {
    const origin = new THREE.Vector3();
    const dir = new THREE.Vector3();
    return () => {
      origin.copy(camera.position);
      dir.set(pointer.current.x, pointer.current.y, 0.5).unproject(camera).sub(origin).normalize();
      for (const side of [-1, 1]) {
        if (dir.x * side < 1e-4) continue;
        const t = (side * (HALL.half - HALL.depth) - origin.x) / dir.x;
        const y = origin.y + dir.y * t;
        const s = -(origin.z + dir.z * t);
        for (let k = lowerBound(plan.along, s - 1.3); k < plan.order.length && plan.along[k] < s + 1.3; k++) {
          const print = plan.prints[plan.order[k]];
          if (print.side === side && Math.abs(s - print.s) < print.hw && Math.abs(y - print.y) < print.hh) return print.index;
        }
      }
      return -1;
    };
  }, [camera, plan]);

  // Pointer: look, hover, click. Anything that scrolls ends the attract walk.
  useEffect(() => {
    const el = gl.domElement;
    const host = wrap.current;
    const at = pointer.current;
    let pressed: [number, number] | null = null;
    const move = (e: PointerEvent) => {
      const box = el.getBoundingClientRect();
      at.x = ((e.clientX - box.left) / box.width) * 2 - 1;
      at.y = 1 - ((e.clientY - box.top) / box.height) * 2;
      at.inside = true;
    };
    const leave = () => {
      at.inside = false;
    };
    const down = (e: PointerEvent) => {
      pressed = [e.clientX, e.clientY];
    };
    const up = (e: PointerEvent) => {
      if (!pressed) return;
      const travel = Math.hypot(e.clientX - pressed[0], e.clientY - pressed[1]);
      pressed = null;
      if (travel > 8 || run.current.focus >= 0) return;
      move(e);
      const hit = pick();
      if (hit >= 0) latest.current.onOpen(hit);
      if (e.pointerType !== "mouse") at.inside = false;
    };
    const stop = () => {
      run.current.attract = false;
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", stop);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
      if (host) delete host.dataset.cursor;
    };
  }, [gl, pick, wrap]);

  // Stepping up to a print and back. Already standing at one (previous / next), the camera is simply moved.
  useEffect(() => {
    if (!built) return;
    const r = run.current;
    r.tween?.kill();
    r.tween = null;
    if (focus === null) {
      if (r.focus < 0) return;
      const land = () => {
        r.k = 0;
        r.focus = -1;
        r.tween = null;
      };
      if (reduce) land();
      // Held a moment so the HTML image has faded before the print starts to move.
      else r.tween = gsap.to(r, { k: 0, duration: 0.95, delay: 0.16, ease: "power2.inOut", onComplete: land });
    } else {
      r.attract = false;
      const jump = reduce || !r.started || (r.focus >= 0 && r.k > 0.6);
      r.focus = focus;
      const arrive = () => {
        r.k = 1;
        r.tween = null;
        latest.current.onArrive();
      };
      if (jump) arrive();
      else r.tween = gsap.to(r, { k: 1, duration: 1.05, ease: G_EASE, onComplete: arrive });
    }
    invalidate();
  }, [built, focus, reduce, invalidate]);
  useEffect(() => () => void run.current.tween?.kill(), []);

  const scratch = useMemo(() => ({ walk: new THREE.Vector3(), close: new THREE.Vector3(), qWalk: new THREE.Quaternion(), qClose: new THREE.Quaternion(), euler: new THREE.Euler() }), []);

  useFrame((state, raw) => {
    const made = world.current;
    if (!made?.ready) return;
    const p = latest.current;
    const r = run.current;
    const dt = Math.min(raw, 0.05);
    const { walk, close, qWalk, qClose, euler } = scratch;

    if (!p.attract) r.attract = false;
    // Attract mode walks the page itself, so the scroll bar and the camera never disagree.
    if (r.attract && p.frozen === null) {
      r.clock += dt;
      const s = Math.min(plan.last, attractAt(r.clock));
      window.scrollTo(0, scrollOf(s));
      if (s >= plan.last) r.attract = false;
    }
    const goal = clampS(alongOf(window.scrollY));
    const before = r.s;
    // Reduced motion: no glide, the camera stands at the print nearest the scroll position.
    if (reduce) {
      const k = lowerBound(stations, goal);
      r.s = k > 0 && (k === stations.length || goal - stations[k - 1] < stations[k] - goal) ? stations[k - 1] : stations[k];
    } else r.s += (goal - r.s) * (r.started ? 1 - Math.exp(-dt * 7) : 1);
    const speed = Math.abs(r.s - before) / Math.max(dt, 1e-4);
    r.walked += Math.abs(r.s - before);

    const ease = 1 - Math.exp(-dt * 4);
    r.px += ((pointer.current.inside ? pointer.current.x : 0) - r.px) * ease;
    r.py += ((pointer.current.inside ? pointer.current.y : 0) - r.py) * ease;
    const step = reduce ? 0 : (r.walked / 0.72) * Math.PI;
    walk.set(Math.sin(step) * 0.006, HALL.eye + Math.abs(Math.sin(step)) * 0.008, -r.s);
    // Upright phone: a wider lens, and the head turns to the print coming up.
    const upright = size.width < size.height;
    const lens = camera as THREE.PerspectiveCamera;
    if (lens.fov !== (upright ? 70 : FOV)) {
      lens.fov = upright ? 70 : FOV;
      lens.updateProjectionMatrix();
    }
    let glance = 0;
    if (upright) {
      const next = plan.prints[plan.order[lowerBound(plan.along, r.s - 0.4)]];
      if (next && next.s - r.s < 7) glance = -next.side * Math.atan2(HALL.half, Math.max(0.9, next.s - r.s + 0.9)) * 0.72;
    }
    r.glance = reduce ? glance : r.glance + (glance - r.glance) * (1 - Math.exp(-dt * 2.2));
    qWalk.setFromEuler(euler.set(r.py * 0.07, -r.px * 0.17 + r.glance, 0, "YXZ"));

    const tanHalf = Math.tan((lens.fov * Math.PI) / 360);
    if (r.focus >= 0) {
      // Stand where the print's picture fills exactly the lightbox rectangle.
      const print = plan.prints[r.focus];
      const rect = lightboxRect(size.width, size.height, print);
      const d = (print.ih / tanHalf) * (size.height / rect.height);
      const metres = (2 * d * tanHalf) / size.height;
      const ox = rect.left + rect.width / 2 - size.width / 2;
      const oy = rect.top + rect.height / 2 - size.height / 2;
      close.set(print.side * (HALL.half - HALL.depth * 0.5 - d), print.y + oy * metres, -print.s - print.side * ox * metres);
      qClose.setFromEuler(euler.set(0, (-print.side * Math.PI) / 2, 0, "YXZ"));
      camera.position.lerpVectors(walk, close, r.k);
      camera.quaternion.slerpQuaternions(qWalk, qClose, r.k);
    } else {
      camera.position.copy(walk);
      camera.quaternion.copy(qWalk);
    }
    camera.updateMatrixWorld();

    const u = made.materials.uniforms;
    u.uDim.value = r.k;
    u.uFocus.value = r.focus;
    u.uTime.value = p.frozen ?? state.clock.elapsedTime;
    u.uPx.value = (size.height * r.dpr) / (2 * tanHalf);

    const at = -camera.position.z;
    const loading = made.streamer.update(at, dt);
    for (const attribute of made.dynamic) attribute.needsUpdate = true;

    // Dust catches the four nearest lamps.
    const nearest = lowerBound(plan.along, at) - 2;
    u.uSpots.value.forEach((spot, i) => {
      const print = plan.prints[plan.order[nearest + i]];
      if (print) spot.set(print.side * HALL.half, print.y, -print.s, print.seed);
      else spot.w = -1;
    });

    // Hover: the picture light warms up, and the cursor says "View".
    const hit = pointer.current.inside && r.focus < 0 ? pick() : -1;
    const host = wrap.current;
    if (host && (host.dataset.cursor === "View") !== hit >= 0) {
      if (hit >= 0) host.dataset.cursor = "View";
      else delete host.dataset.cursor;
      gl.domElement.style.cursor = hit >= 0 ? "pointer" : "";
      host.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
    }
    if (hit >= 0 && !r.hot.has(hit)) r.hot.set(hit, 0);
    if (r.hot.size > 0) {
      const values = made.hover.array as Float32Array;
      for (const [index, value] of r.hot) {
        const next = value + ((index === hit ? 1 : 0) - value) * (1 - Math.exp(-dt * 7));
        if (index !== hit && next < 0.01) {
          r.hot.delete(index);
          values[index] = 0;
        } else {
          r.hot.set(index, next);
          values[index] = next;
        }
      }
      made.hover.needsUpdate = true;
    }

    p.sound.current?.walk(r.walked, speed);

    // Frames running long: give up resolution first, then hand over to the Index.
    if (!p.covered && p.frozen === null && raw < 1 && ++r.frames > 60) {
      r.acc += raw;
      if (++r.n >= 90) {
        const average = r.acc / r.n;
        r.acc = r.n = 0;
        if (average > 1 / 48) {
          if (r.dpr > 0.7) setDpr((r.dpr = Math.max(0.7, r.dpr - 0.25)));
          else if (average > 1 / 28 && ++r.slow >= 2) p.onFail();
        }
      }
    }

    r.started = true;
    if (made.composer) made.composer.render();
    else gl.render(scene, camera);
    // Covered by the lightbox the loop is on demand: keep drawing only while something is still changing.
    if (p.covered && (loading || r.tween || r.hot.size > 0)) invalidate();
  }, 1);

  return null;
}

export default function Hall(props: HallProps) {
  const wrap = useRef<HTMLDivElement>(null);
  return (
    <div ref={wrap} className="absolute inset-0 touch-pan-y select-none">
      <Canvas
        dpr={1}
        frameloop={!props.running ? "never" : props.covered ? "demand" : "always"}
        gl={{ antialias: props.low, powerPreference: "high-performance" }}
        camera={{ fov: FOV, near: 0.05, far: 160, position: [0, HALL.eye, -HALL.start] }}
      >
        <Stage {...props} wrap={wrap} />
      </Canvas>
    </div>
  );
}
