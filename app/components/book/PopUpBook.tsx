"use client";

/*
 * THE POP-UP BOOK — rules of the medium
 *
 * One medium: a fine-press pop-up book, photographed at night. Every frame
 * obeys these, or it is wrong.
 *
 * EDGE     Everything is cut from flat card with a real thickness. The stock
 *          is duplex: warm cotton faces over a teal core, so every cut edge
 *          is a thin teal line. No part bends, stretches or tapers; curves
 *          exist only as cut outlines. Corners are eased, never razor sharp.
 * INK      Letterpress in three flat inks: black, a teal duller than the
 *          screen token, and gold foil (titles, the year, one accent a
 *          spread). No gradients: tone is made with rules and solids. Each
 *          ink sits a hair out of register, thins in the middle, darkens at
 *          its rim and leaves an impression in the stock.
 * SURFACE  Paper is rough and matte with a felt tooth; cloth is woven and
 *          takes a soft sheen; foil is a mirror that is bright only where it
 *          catches a softbox and dark elsewhere, with pinholes where it did
 *          not take. Nothing glows. Nothing is glossy plastic.
 * FLAWS    Scores crack the face fibres and let the core show in flecks;
 *          some glue tabs keep a faint sheen; tabs are visible, because a
 *          person glued them.
 * LIGHT    One warm key from the upper left with contact-hardening shadows,
 *          a faint teal fill from the right, and darkness beyond the felt.
 * MOTION   Only what paper can do: a leaf turns about the spine, a wing
 *          hinges on its glue line, a deck stays parallel to its page, a
 *          tab slides, a wheel turns on its rivet. Every pose is solved from
 *          the page angle; nothing is keyframed, nothing passes through
 *          anything else.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import clsx from "clsx";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type MutableRefObject, type RefObject } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { getBook, type BookView } from "../../lib/content/book";
import { useLang } from "../../lib/i18n";
import { useIntro } from "../Loader";
import { installSoftShadows, makeEnvironment, makeFelt, makeGrid, NIGHT, SHADOW_FAR, SHADOW_NEAR } from "./materials";
import { Book, type HandleKind, type Pick } from "./model";
import { loadFonts, makeType } from "./press";
import { BookSound } from "./sound";
import { DWELL, frozenState, smooth, SPREADS, stateAt, type BookState } from "./timeline";

const KEYS = ["p", "tab", "plane", "wheel", "card"] as const;
const IDLE_BEFORE_ATTRACT = 4.5;

interface Control {
  turn(direction: number): void;
  counts: number[];
}
interface StageProps {
  view: BookView;
  low: boolean;
  frozen: BookState | null;
  reduce: boolean;
  engineer: boolean;
  sound: MutableRefObject<BookSound | null>;
  wrap: RefObject<HTMLDivElement | null>;
  link: RefObject<HTMLAnchorElement | null>;
  control: MutableRefObject<Control | null>;
  onSpread(spread: number): void;
  onFail(): void;
}

function Stage({ view, low, frozen, reduce, engineer, sound, wrap, link, control, onSpread, onFail }: StageProps) {
  const { gl, scene, camera, size, setDpr } = useThree();
  const dpr = useThree((state) => state.viewport.dpr);
  const post = useRef<EffectComposer | null>(null);
  const [built, setBuilt] = useState(0);
  const book = useRef<Book | null>(null);
  const table = useRef<{ mesh: THREE.Mesh; felt: THREE.Material; grid: THREE.Material } | null>(null);
  const latest = useRef({ view, engineer, onSpread, onFail });
  latest.current = { view, engineer, onSpread, onFail };
  const pointer = useRef(new THREE.Vector2());
  const bounceLight = useRef<THREE.PointLight | null>(null);
  const run = useRef({
    mode: frozen || reduce ? ("manual" as const) : ("attract" as "attract" | "manual"),
    canAttract: !frozen && !reduce,
    state: frozen ?? (reduce ? (frozenState("half-1", null) as BookState) : stateAt(0)),
    from: stateAt(0),
    blend: 1,
    clock: 0,
    idle: 0,
    dragging: false,
    tween: null as null | { from: number; to: number; t: number },
    px: 0,
    py: 0,
    spread: -1,
    printed: null as BookView | null,
    // Frame-time governor.
    dpr: Math.min(window.devicePixelRatio || 1, low ? 1.5 : 2),
    frames: 0,
    acc: 0,
    n: 0,
    slow: 0,
  });

  // Set: lights, felt, environment, and the book itself.
  useEffect(() => {
    let dead = false;
    const undoShadows = installSoftShadows(low);
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFShadowMap;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.05;
    setDpr(run.current.dpr);

    // Ambient occlusion in the creases between layers. Cheap devices go without.
    const frame = low ? null : new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
    const occlusion = low ? null : new GTAOPass(scene, camera, 1, 1);
    if (frame && occlusion) {
      occlusion.blendIntensity = 0.9;
      occlusion.updateGtaoMaterial({ radius: 2.2, distanceExponent: 1.5, thickness: 1.4, samples: 12 });
      const composer = new EffectComposer(gl, frame);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(occlusion);
      composer.addPass(new OutputPass());
      post.current = composer;
    }

    const environment = makeEnvironment(gl);
    scene.environment = environment.texture;
    scene.environmentIntensity = 1;
    scene.background = new THREE.Color(NIGHT);
    scene.fog = new THREE.Fog(NIGHT, 150, 330);

    // One warm key from the upper left, a faint teal fill from the right.
    const key = new THREE.SpotLight("#ffdcb4", 5.2, 0, 0.36, 1, 0);
    key.position.set(-62, 96, 58);
    key.target.position.set(2, 0, -2);
    key.castShadow = true;
    key.shadow.mapSize.setScalar(low ? 1024 : 2048);
    key.shadow.camera.near = SHADOW_NEAR;
    key.shadow.camera.far = SHADOW_FAR;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.08;
    const fill = new THREE.DirectionalLight("#dfe7e9", 0.24);
    fill.position.set(80, 30, 25);
    const ambient = new THREE.HemisphereLight("#2b3538", "#050607", 0.5);
    const felt = makeFelt();
    const grid = makeGrid();
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), felt.material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    table.current = { mesh, felt: felt.material, grid: grid.material };
    const set = new THREE.Group();
    // Colour that bounces: the teal core and inks tint what stands near them.
    // It hangs among the standing layers, too far from any page to read as a light.
    const bounce = new THREE.PointLight("#19c2b2", 0, 13, 2);
    bounce.position.set(0, 6.5, -4.5);
    bounceLight.current = bounce;
    set.add(key, key.target, fill, ambient, bounce, mesh);
    scene.add(set);

    void (async () => {
      const copy = latest.current.view;
      const type = makeType(copy.lang);
      await loadFonts(type, JSON.stringify(copy));
      if (dead) return;
      const made = new Book(copy, type, low ? 22 : 32);
      made.update(run.current.state);
      // Print what the first frames show; the rest follows a face at a time.
      made.bakeNear(run.current.state.p, 1e9, 1.4);
      scene.add(made.root);
      book.current = made;
      run.current.printed = copy;
      control.current = {
        counts: made.counts,
        turn(direction) {
          const r = run.current;
          const at = r.tween ? r.tween.to : r.state.p;
          const to = direction > 0 ? Math.min(SPREADS, Math.floor(at + 1e-3) + 1) : Math.max(0, Math.ceil(at - 1e-3) - 1);
          r.mode = "manual";
          r.idle = 0;
          if (reduce) r.state.p = to;
          else r.tween = { from: r.state.p, to, t: 0 };
        },
      };
      setBuilt((n) => n + 1);
    })();

    return () => {
      dead = true;
      undoShadows();
      post.current?.dispose();
      post.current = null;
      occlusion?.dispose();
      frame?.dispose();
      book.current?.dispose();
      book.current = null;
      control.current = null;
      scene.remove(set);
      scene.environment = null;
      scene.fog = null;
      environment.dispose();
      key.dispose();
      mesh.geometry.dispose();
      for (const item of [felt.map, felt.material, grid.map, grid.material]) item.dispose();
    };
  }, [gl, scene, camera, low, reduce, setDpr, control]);

  useEffect(() => {
    post.current?.setPixelRatio(dpr);
    post.current?.setSize(size.width, size.height);
  }, [built, dpr, size.width, size.height]);

  // Language: reprint. Engineer's view: swap the picture for the plan.
  useEffect(() => {
    const made = book.current;
    if (!made) return;
    made.setEngineer(engineer);
    if (table.current) table.current.mesh.material = engineer ? table.current.grid : table.current.felt;
    scene.fog = engineer ? null : new THREE.Fog(NIGHT, 150, 330);
    if (run.current.printed === view) return;
    let dead = false;
    const type = makeType(view.lang);
    void loadFonts(type, JSON.stringify(view)).then(() => {
      if (dead || book.current !== made) return;
      made.setCopy(view, type);
      run.current.printed = view;
    });
    return () => {
      dead = true;
    };
  }, [built, view, engineer, scene]);

  // Pointer: hover labels, page drags, tabs, wheel and slider.
  useEffect(() => {
    const el = gl.domElement;
    const host = wrap.current;
    if (!host) return;
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const cast = (e: { clientX: number; clientY: number }) => {
      const box = el.getBoundingClientRect();
      ndc.set(((e.clientX - box.left) / box.width) * 2 - 1, -((e.clientY - box.top) / box.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      return raycaster;
    };
    const pickAt = (e: { clientX: number; clientY: number }) => book.current?.pick(cast(e), run.current.state.p) ?? null;
    // ContextCursor reads data-cursor on pointerover, so re-announce when the label changes.
    const label = (text: string | null) => {
      if ((host.dataset.cursor ?? null) === text) return;
      if (text) host.dataset.cursor = text;
      else delete host.dataset.cursor;
      el.style.cursor = text ? "grab" : "";
      host.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
    };
    const labelFor = (pick: Pick | null) => label(pick ? (pick.kind === "turn" ? "Turn" : "Pull") : null);

    let grip: null | { kind: "turn"; leaf: number; u: number; offset: number } | { kind: HandleKind } = null;
    const turnFraction = (leaf: number, u: number) => {
      const x = book.current?.gutterX(raycaster.ray, leaf + 1) ?? 0;
      return Math.acos(Math.min(1, Math.max(-1, x / u))) / Math.PI;
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const pick = pickAt(e);
      const made = book.current;
      if (!pick || !made) return;
      const r = run.current;
      r.mode = "manual";
      r.tween = null;
      r.dragging = true;
      r.idle = 0;
      if (pick.kind === "turn") grip = { ...pick, offset: r.state.p - pick.leaf - turnFraction(pick.leaf, pick.u) };
      else {
        made.dragStart(pick.kind, raycaster.ray);
        grip = pick;
      }
      el.setPointerCapture(e.pointerId);
      // Only while a drag is live: the page scrolls normally the rest of the time.
      host.setAttribute("data-lenis-prevent", "");
      el.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      pointer.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      );
      if (!grip) return labelFor(pickAt(e));
      cast(e);
      const r = run.current;
      r.idle = 0;
      if (grip.kind === "turn")
        r.state.p = grip.leaf + Math.min(1, Math.max(0, turnFraction(grip.leaf, grip.u) + grip.offset));
      else book.current?.dragMove(grip.kind, raycaster.ray, r.state);
    };
    const up = (e: PointerEvent) => {
      if (!grip) return;
      const r = run.current;
      // A page let go within a breath of flat settles; anywhere else it stays where it was left.
      const near = Math.round(r.state.p);
      if (grip.kind === "turn" && Math.abs(r.state.p - near) < 0.06 && r.state.p !== near)
        r.tween = { from: r.state.p, to: near, t: 0.7 };
      grip = null;
      r.dragging = false;
      r.idle = 0;
      host.removeAttribute("data-lenis-prevent");
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      el.style.cursor = "";
      labelFor(pickAt(e));
    };
    const leave = () => {
      if (!grip) label(null);
    };
    // A finger that lands on a page corner or a tab drags it; anywhere else it scrolls the page.
    const touch = (e: TouchEvent) => {
      if (e.touches.length === 1 && pickAt(e.touches[0])) e.preventDefault();
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("touchstart", touch, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("touchstart", touch);
      label(null);
      host.removeAttribute("data-lenis-prevent");
    };
  }, [gl, camera, wrap]);

  const target = useMemo(() => new THREE.Vector3(), []);
  const corner = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, raw) => {
    const made = book.current;
    if (!made) return;
    const r = run.current;
    const s = r.state;
    const dt = Math.min(raw, 0.05);
    const before = { ...s };

    if (r.mode === "attract") {
      r.clock += dt;
      const goal = stateAt(r.clock);
      if (r.blend < 1) {
        r.blend = Math.min(1, r.blend + dt / 1.2);
        const k = smooth(r.blend);
        for (const key of KEYS) s[key] = r.from[key] + (goal[key] - r.from[key]) * k;
      } else Object.assign(s, goal);
    } else {
      if (r.tween) {
        r.tween.t = Math.min(1, r.tween.t + dt / 1.1);
        s.p = r.tween.from + (r.tween.to - r.tween.from) * smooth(r.tween.t);
        if (r.tween.t >= 1) r.tween = null;
      }
      if (!r.dragging && !r.tween) r.idle += dt;
      if (r.canAttract && r.idle > IDLE_BEFORE_ATTRACT) {
        // Pick the story up from the spread the viewer left it on.
        r.mode = "attract";
        r.clock = DWELL[Math.round(s.p)];
        r.from = { ...s };
        r.blend = 0;
      }
    }

    made.update(s);
    // The bounce belongs to a spread at rest; a leaf in the air would catch it like a lamp.
    if (bounceLight.current) bounceLight.current.intensity = 2.2 * Math.pow(Math.abs(2 * (s.p - Math.floor(s.p)) - 1), 6);
    const printing = made.bakeNear(s.p, 5) > 0;

    // Camera: fitted to the window, with a few degrees of parallax under the pointer.
    r.px += (pointer.current.x - r.px) * Math.min(1, dt * 3);
    r.py += (pointer.current.y - r.py) * Math.min(1, dt * 3);
    const tan = Math.tan((15 * Math.PI) / 180);
    const closed = 1 - smooth(s.p);
    // Closed, the book is half as wide: come in closer.
    const aspect = size.width / size.height;
    const distance = Math.max(21.5 / tan, (aspect < 1 ? 27 : 34) / (tan * aspect)) * (1 - 0.3 * closed);
    // The dark starts behind the book, however far back a narrow window pushes the camera.
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.near = distance + 60;
      scene.fog.far = distance + 250;
    }
    const drift = r.mode === "attract" ? Math.sin(r.clock * 0.4) * 0.04 : 0;
    const azimuth = r.px * 0.15 + drift;
    const elevation = 0.69 - r.py * 0.06;
    // Closed, the book lies on the right half of the table.
    target.set(closed * 12.3, 4.2 - 3 * closed, 1.5);
    camera.position.set(
      target.x + distance * Math.sin(azimuth) * Math.cos(elevation),
      target.y + distance * Math.sin(elevation),
      target.z + distance * Math.cos(azimuth) * Math.cos(elevation),
    );
    camera.lookAt(target);

    const spread = Math.min(SPREADS, Math.max(0, Math.round(s.p)));
    if (spread !== r.spread) {
      r.spread = spread;
      latest.current.onSpread(spread);
    }

    // The email on the contact card is a real link, laid over its print.
    const anchor = link.current;
    if (anchor) {
      const show = s.card > 0.85 && s.p > SPREADS - 0.02 && !latest.current.engineer;
      anchor.style.visibility = show ? "visible" : "hidden";
      if (show) {
        const { mesh, x0, y0, x1, y1 } = made.emailBox;
        mesh.updateWorldMatrix(true, false);
        let left = Infinity;
        let top = Infinity;
        let right = -Infinity;
        let bottom = -Infinity;
        for (const [x, y] of [
          [x0, y0],
          [x1, y0],
          [x1, y1],
          [x0, y1],
        ]) {
          corner.set(x, y, 0.03).applyMatrix4(mesh.matrixWorld).project(camera);
          const sx = (corner.x * 0.5 + 0.5) * size.width;
          const sy = (-corner.y * 0.5 + 0.5) * size.height;
          left = Math.min(left, sx);
          right = Math.max(right, sx);
          top = Math.min(top, sy);
          bottom = Math.max(bottom, sy);
        }
        anchor.style.transform = `translate(${left}px, ${top}px)`;
        anchor.style.width = `${right - left}px`;
        anchor.style.height = `${bottom - top}px`;
      }
    }

    const audio = sound.current;
    if (audio && dt > 0) {
      const speed =
        Math.abs(s.p - before.p) / dt + (Math.abs(s.tab - before.tab) + Math.abs(s.card - before.card)) / dt;
      audio.slide(speed);
      const landed = (p: number) => Math.abs(p - Math.round(p)) < 1e-3;
      if (landed(s.p) && !landed(before.p)) audio.thump();
      if (Math.floor(s.wheel * 14) !== Math.floor(before.wheel * 14)) audio.tick();
    }

    // Frames running long: give up resolution first, then hand over to the still.
    if (++r.frames > 45 && !printing && raw < 1) {
      r.acc += raw;
      if (++r.n >= 90) {
        const average = r.acc / r.n;
        r.acc = r.n = 0;
        if (average > 1 / 45) {
          if (r.dpr > 0.6) setDpr((r.dpr = Math.max(0.6, r.dpr - 0.25)));
          else if (average > 1 / 28 && ++r.slow >= 2) latest.current.onFail();
        }
      }
    }

    // Taking the render over (priority 1): the photograph goes through the occlusion pass, the plan does not.
    if (post.current && !latest.current.engineer) post.current.render();
    else gl.render(scene, camera);
  }, 1);

  return null;
}

export default function PopUpBook({ onFail }: { onFail(): void }) {
  const { lang, content } = useLang();
  const { done } = useIntro();
  const reduce = useReducedMotion() ?? false;
  const copy = content.book;
  const view = useMemo(() => getBook(lang, content), [lang, content]);

  const wrap = useRef<HTMLDivElement>(null);
  const link = useRef<HTMLAnchorElement>(null);
  const control = useRef<Control | null>(null);
  const sound = useRef<BookSound | null>(null);
  const [engineer, setEngineer] = useState(false);
  const [audible, setAudible] = useState(false);
  const [spread, setSpread] = useState(0);
  const [visible, setVisible] = useState(true);

  // `?t=` and `?view=` are read once: they describe a still, not a mode to toggle.
  const [setup] = useState(() => {
    const query = new URLSearchParams(window.location.search);
    const t = query.get("t");
    const named = query.get("view");
    return {
      frozen: frozenState(named, t === null || Number.isNaN(Number(t)) ? null : Number(t)),
      engineer: named === "engineer",
      low: window.matchMedia("(pointer: coarse), (max-width: 820px)").matches,
    };
  });
  useEffect(() => setEngineer(setup.engineer), [setup.engineer]);

  // Pause the loop when nobody can see it.
  useEffect(() => {
    const host = wrap.current;
    if (!host) return;
    let onScreen = true;
    const sync = () => setVisible(onScreen && document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    observer.observe(host);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "e" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      setEngineer((on) => !on);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  useEffect(
    () => () => {
      sound.current?.dispose();
      sound.current = null;
    },
    [],
  );
  const toggleSound = () => {
    if (sound.current) {
      sound.current.dispose();
      sound.current = null;
    } else sound.current = new BookSound();
    setAudible(Boolean(sound.current));
  };

  const text = "transition-colors hover:text-ink";
  const counts = control.current?.counts;

  return (
    <div ref={wrap} className="absolute inset-0 touch-pan-y select-none">
      <Canvas
        shadows
        dpr={1}
        frameloop={done && visible ? "always" : "never"}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ fov: 30, near: 8, far: 700, position: [0, 56, 66] }}
      >
        <Stage
          view={view}
          low={setup.low}
          frozen={setup.frozen}
          reduce={reduce}
          engineer={engineer}
          sound={sound}
          wrap={wrap}
          link={link}
          control={control}
          onSpread={setSpread}
          onFail={onFail}
        />
      </Canvas>

      {/* Falloff to the edges of the frame; the plan view is lit evenly. */}
      {engineer ? null : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 75% 70% at 48% 56%, transparent 52%, rgba(10,15,17,0.78) 100%)" }}
        />
      )}

      <a
        ref={link}
        href={`mailto:${view.kumamoto.email}`}
        aria-label={content.contact.emailAria}
        data-cursor="Write"
        className="absolute left-0 top-0 block rounded-[4px] text-transparent"
        style={{ visibility: "hidden" }}
      >
        {view.kumamoto.email}
      </a>

      {engineer ? (
        <div className="pointer-events-none absolute bottom-16 right-0 container-x w-auto text-right font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          <p className="text-ink">
            {spread === 0 ? copy.engineer.cover : copy.engineer.spread.replace("{n}", String(spread))}
            {spread > 0 && counts ? ` — ${copy.engineer.parts.replace("{count}", String(counts[spread]))}` : null}
          </p>
          {counts ? (
            <p className="mt-2">
              {counts.slice(1).map((count, i) => (
                <span key={i} className={clsx("ml-4", i + 1 === spread && "text-accent-bright")}>
                  {String(i + 1).padStart(2, "0")}·{count}
                </span>
              ))}
            </p>
          ) : null}
          <p className="mt-2 flex justify-end gap-5">
            <span className="text-ink">— {copy.engineer.cut}</span>
            <span className="text-accent-bright">- - {copy.engineer.fold}</span>
            <span className="text-amber">■ {copy.engineer.glue}</span>
          </p>
        </div>
      ) : null}

      <div className="absolute bottom-6 left-0 container-x flex w-auto flex-wrap gap-x-6 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        <button type="button" className={text} onClick={() => control.current?.turn(-1)}>
          ← {copy.controls.prev}
        </button>
        <button type="button" className={text} onClick={() => control.current?.turn(1)}>
          {copy.controls.next} →
        </button>
        <button type="button" className={text} aria-pressed={engineer} onClick={() => setEngineer((on) => !on)}>
          {engineer ? copy.controls.engineerOff : copy.controls.engineerOn}
        </button>
        <button type="button" className={text} aria-pressed={audible} onClick={toggleSound}>
          {audible ? copy.controls.soundOff : copy.controls.soundOn}
        </button>
      </div>
    </div>
  );
}
