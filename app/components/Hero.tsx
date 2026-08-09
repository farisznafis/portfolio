"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { heroImages, marqueeStack, site } from "../lib/data";
import { useLang } from "../lib/i18n";
import { MaskedText } from "./ui/MaskedText";
import { RolloverText } from "./ui/RolloverText";
import { useMediaQuery } from "../hooks/useMediaQuery";

// ─── Spotlight radius ────────────────────────────────────────────────────────
const SPOTLIGHT_R = 260;

// ─── Cursor parallax config ──────────────────────────────────────────────────
const PARALLAX_MAX    = 28;  // max px travel at full cursor offset
const BASE_PARALLAX   = 1;   // base image depth
const REVEAL_PARALLAX = 1.35;
const UI_PARALLAX     = 0.25;
const BASE_SCALE      = 1.06; // oversize so edges never reveal gaps
const REVEAL_SCALE    = 1.09;

const INITIAL = -999; // cursor guard: no parallax until the pointer first moves

// ─── RevealLayer ─────────────────────────────────────────────────────────────
/**
 * Renders the second (reveal) image visible only inside a soft circular mask
 * that follows the cursor. A hidden <canvas> draws a radial gradient at the
 * cursor position; its dataURL drives the CSS mask on the reveal <div>.
 *
 * Redraws are driven by the shared motion values, coalesced to one draw per
 * animation frame — no React re-renders happen on cursor movement.
 *
 * To swap in your own photos, update heroImages in app/lib/data.ts.
 */
function RevealLayer({
  image,
  cursorX,
  cursorY,
}: {
  image: string;
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layerRef  = useRef<HTMLDivElement>(null);

  // Keep canvas dimensions in sync with the viewport.
  useEffect(() => {
    const sync = () => {
      const c = canvasRef.current;
      if (!c) return;
      c.width  = window.innerWidth;
      c.height = window.innerHeight;
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  // Re-draw the gradient mask whenever the smoothed cursor moves. Change
  // events can fire twice per frame (x and y); coalesce via rAF.
  useEffect(() => {
    let scheduled = false;

    const draw = () => {
      const canvas = canvasRef.current;
      const layer  = layerRef.current;
      const ctx    = canvas?.getContext("2d");
      if (!canvas || !layer || !ctx) return;

      const cx = cursorX.get();
      const cy = cursorY.get();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const g = ctx.createRadialGradient(
        cx, cy, 0,
        cx, cy, SPOTLIGHT_R,
      );
      g.addColorStop(0,    "rgba(255,255,255,1)");
      g.addColorStop(0.4,  "rgba(255,255,255,1)");
      g.addColorStop(0.6,  "rgba(255,255,255,0.75)");
      g.addColorStop(0.75, "rgba(255,255,255,0.4)");
      g.addColorStop(0.88, "rgba(255,255,255,0.12)");
      g.addColorStop(1,    "rgba(255,255,255,0)");

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, SPOTLIGHT_R, 0, Math.PI * 2);
      ctx.fill();

      const mask = `url(${canvas.toDataURL()})`;
      layer.style.maskImage        = mask;
      layer.style.webkitMaskImage  = mask;
      layer.style.maskSize         = "100% 100%";
      (layer.style as CSSStyleDeclaration & { webkitMaskSize: string }).webkitMaskSize = "100% 100%";
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        draw();
      });
    };

    const unsubscribeX = cursorX.on("change", schedule);
    const unsubscribeY = cursorY.on("change", schedule);
    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Hidden canvas — used only to generate the mask dataURL */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0"
        style={{ display: "none" }}
        aria-hidden="true"
      />
      {/* Reveal image, shown only through the gradient mask above */}
      <div
        ref={layerRef}
        className="pointer-events-none absolute inset-0 z-30 bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden="true"
      />
    </>
  );
}

/** Normalized parallax offset (-1..1) for a motion value, zero before first move. */
function useParallaxAxis(value: MotionValue<number>) {
  return useTransform(value, (v) => {
    if (v === INITIAL) return 0;
    return Math.max(-1, Math.min(1, v / window.innerWidth - 0.5));
  });
}

// ─── Hero ────────────────────────────────────────────────────────────────────
export function Hero() {
  // Smoothed cursor position as motion values: updates never re-render React.
  const mouse  = useRef({ x: INITIAL, y: INITIAL });
  const smooth = useRef({ x: INITIAL, y: INITIAL });
  const rafRef = useRef<number>(0);
  const smoothX = useMotionValue(INITIAL);
  const smoothY = useMotionValue(INITIAL);
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { content } = useLang();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const loop = () => {
      const dx = mouse.current.x - smooth.current.x;
      const dy = mouse.current.y - smooth.current.y;
      if (Math.abs(dx) > 0.08 || Math.abs(dy) > 0.08) {
        smooth.current.x += dx * 0.1;
        smooth.current.y += dy * 0.1;
        smoothX.set(smooth.current.x);
        smoothY.set(smooth.current.y);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [smoothX, smoothY]);

  // Parallax offsets per depth, derived from the already-smoothed cursor.
  // Zeroed under prefers-reduced-motion and until the pointer first moves.
  const nx = useParallaxAxis(smoothX);
  const ny = useParallaxAxis(smoothY);

  const baseX   = useTransform(nx, (v) => (prefersReducedMotion ? 0 : v * PARALLAX_MAX * BASE_PARALLAX));
  const baseY   = useTransform(ny, (v) => (prefersReducedMotion ? 0 : v * PARALLAX_MAX * BASE_PARALLAX));
  const revealX = useTransform(nx, (v) => (prefersReducedMotion ? 0 : v * PARALLAX_MAX * REVEAL_PARALLAX));
  const revealY = useTransform(ny, (v) => (prefersReducedMotion ? 0 : v * PARALLAX_MAX * REVEAL_PARALLAX));
  const uiX     = useTransform(nx, (v) => (prefersReducedMotion ? 0 : v * PARALLAX_MAX * -UI_PARALLAX));
  const uiY     = useTransform(ny, (v) => (prefersReducedMotion ? 0 : v * PARALLAX_MAX * -UI_PARALLAX));

  return (
    <section id="home" aria-label={content.hero.ariaSection} className="relative w-full">

      {/* ── Full-screen canvas ──────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden bg-night" style={{ height: "100dvh" }}>

        {/* Layer 1 — base image with Ken Burns zoom-out on load */}
        <motion.div
          className="absolute inset-0 z-10"
          style={{ x: baseX, y: baseY, scale: BASE_SCALE, willChange: "transform" }}
          aria-hidden="true"
        >
          <div
            className="hero-zoom absolute inset-0 bg-cover bg-top bg-no-repeat top-2"
            style={{ backgroundImage: `url(${heroImages.base})` }}
            aria-hidden="true"
          />
        </motion.div>

        {/* Layer 2 — spotlight-revealed second image */}
        <motion.div
          className="absolute inset-0 z-20"
          style={{ x: revealX, y: revealY, scale: REVEAL_SCALE, willChange: "transform" }}
          aria-hidden="true"
        >
          <RevealLayer image={heroImages.reveal} cursorX={smoothX} cursorY={smoothY} />
        </motion.div>

        {/* Layer 3 — vignette for legibility */}
        <div
          className="pointer-events-none absolute inset-0 z-40 bg-linear-to-t from-night/80 via-transparent to-night/50"
          aria-hidden="true"
        />

        {/* ── Heading — top-center ─────────────────────────────────────────── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-50"
          style={{ x: uiX, y: uiY, willChange: "transform" }}
        >
          <div className="absolute inset-x-0 top-[14%] flex flex-col items-center px-5 text-center">
            <h1 className="font-display leading-[0.95] text-ink">
              {/* Line 1 — masked word reveal */}
              <span
                className="block text-5xl font-semibold sm:text-7xl md:text-8xl"
                style={{ letterSpacing: "-0.05em" }}
              >
                <MaskedText text={content.hero.line1} onMount delay={0.25} />
              </span>
              {/* Line 2 — masked word reveal with gradient accent */}
              <span
                className="-mt-1 block text-5xl font-semibold sm:text-7xl md:text-8xl"
                style={{ letterSpacing: "-0.08em" }}
              >
                <MaskedText
                  text={content.hero.line2}
                  onMount
                  delay={0.42}
                  accentWords={content.hero.accentWords}
                />
              </span>
            </h1>
          </div>
        </motion.div>

        {/* ── Bottom-left — intro paragraph ────────────────────────────────── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-50 hidden sm:block"
          style={{ x: uiX, y: uiY, willChange: "transform" }}
        >
          <div
            className="hero-anim hero-fade absolute bottom-14 left-10 max-w-[260px] md:left-14"
            style={{ animationDelay: "0.7s" }}
          >
            <p className="text-sm leading-relaxed text-ink/80">
              {content.hero.intro.replace("{name}", site.name)}
            </p>
          </div>
        </motion.div>

        {/* ── Bottom-right — hint + CTAs ───────────────────────────────────── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-50"
          style={{ x: uiX, y: uiY, willChange: "transform" }}
        >
          <div
            className="hero-anim hero-fade absolute bottom-10 left-5 right-5 flex max-w-full flex-col items-start gap-4 sm:bottom-24 sm:left-auto sm:right-10 sm:max-w-[260px] sm:gap-5 md:right-14"
            style={{ animationDelay: "0.85s" }}
          >
            <p className="text-xs leading-relaxed text-ink/80 sm:text-sm">
              {content.hero.hint}
            </p>
            <div className="pointer-events-auto flex flex-wrap items-center gap-3">
              <Link
                href="/work"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-medium text-on-accent transition-all hover:scale-[1.03] hover:bg-accent-bright hover:shadow-lg hover:shadow-accent/30 active:scale-95"
              >
                <RolloverText text={content.hero.ctaWork} /> <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full border border-line bg-night/40 px-5 py-3 text-sm font-medium text-ink backdrop-blur-md transition-colors hover:border-accent/50 hover:bg-night/60"
              >
                <RolloverText text={content.hero.ctaTouch} /> <Mail size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ── Stack marquee — below the full-screen canvas ──────────────────── */}
      <div className="marquee relative overflow-hidden border-y border-line bg-white/[0.02] py-4">
        <div className="marquee-track animate-marquee flex w-max items-center gap-10">
          {[...marqueeStack, ...marqueeStack].map((item, index) => (
            <span
              key={`${item}-${index}`}
              aria-hidden={index >= marqueeStack.length}
              className="flex items-center gap-10 whitespace-nowrap font-mono text-sm uppercase tracking-[0.25em] text-muted"
            >
              {item}
              <span className="text-accent" aria-hidden="true">✦</span>
            </span>
          ))}
        </div>
      </div>

    </section>
  );
}
