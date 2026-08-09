"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
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

// ─── RevealLayer ─────────────────────────────────────────────────────────────
/**
 * Renders the second (reveal) image visible only inside a soft circular mask
 * that follows the cursor. A hidden <canvas> draws a radial gradient at the
 * cursor position; its dataURL drives the CSS mask on the reveal <div>.
 *
 * To swap in your own photos, update heroImages in app/lib/data.ts.
 */
function RevealLayer({
  image,
  cursorX,
  cursorY,
}: {
  image: string;
  cursorX: number;
  cursorY: number;
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

  // Re-draw the gradient mask every time the smoothed cursor moves.
  useEffect(() => {
    const canvas = canvasRef.current;
    const layer  = layerRef.current;
    const ctx    = canvas?.getContext("2d");
    if (!canvas || !layer || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const g = ctx.createRadialGradient(
      cursorX, cursorY, 0,
      cursorX, cursorY, SPOTLIGHT_R,
    );
    g.addColorStop(0,    "rgba(255,255,255,1)");
    g.addColorStop(0.4,  "rgba(255,255,255,1)");
    g.addColorStop(0.6,  "rgba(255,255,255,0.75)");
    g.addColorStop(0.75, "rgba(255,255,255,0.4)");
    g.addColorStop(0.88, "rgba(255,255,255,0.12)");
    g.addColorStop(1,    "rgba(255,255,255,0)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    const mask = `url(${canvas.toDataURL()})`;
    layer.style.maskImage        = mask;
    layer.style.webkitMaskImage  = mask;
    layer.style.maskSize         = "100% 100%";
    (layer.style as CSSStyleDeclaration & { webkitMaskSize: string }).webkitMaskSize = "100% 100%";
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

// ─── Hero ────────────────────────────────────────────────────────────────────
export function Hero() {
  // Smoothed cursor position that feeds the spotlight.
  const mouse  = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });
  const [interacted, setInteracted] = useState(false);
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { content } = useLang();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      setInteracted(true);
    };
    window.addEventListener("mousemove", onMove);

    const loop = () => {
      const dx = mouse.current.x - smooth.current.x;
      const dy = mouse.current.y - smooth.current.y;
      if (Math.abs(dx) > 0.08 || Math.abs(dy) > 0.08) {
        smooth.current.x += dx * 0.1;
        smooth.current.y += dy * 0.1;
        setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Parallax offset for a given depth factor, derived from the already-smoothed
  // cursor position. Zeroed until the pointer first moves (initial -999 guard)
  // and under prefers-reduced-motion.
  const parallax = (depth: number) => {
    if (!interacted || prefersReducedMotion) return { x: 0, y: 0 };
    const nx = Math.max(-1, Math.min(1, cursorPos.x / window.innerWidth - 0.5));
    const ny = Math.max(-1, Math.min(1, cursorPos.y / window.innerHeight - 0.5));
    return { x: nx * PARALLAX_MAX * depth, y: ny * PARALLAX_MAX * depth };
  };

  const baseOffset   = parallax(BASE_PARALLAX);
  const revealOffset = parallax(REVEAL_PARALLAX);
  const uiOffset     = parallax(-UI_PARALLAX);
  const imageStyle   = (o: { x: number; y: number }, s: number) =>
    `translate3d(${o.x}px, ${o.y}px, 0) scale(${s})`;
  const uiStyle      = (o: { x: number; y: number }) =>
    `translate3d(${o.x}px, ${o.y}px, 0)`;

  return (
    <section id="home" aria-label={content.hero.ariaSection} className="relative w-full">

      {/* ── Full-screen canvas ──────────────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden bg-night"
        style={{ height: "100dvh" }}
      >

        {/* Layer 1 — base image with Ken Burns zoom-out on load */}
        <div
          className="absolute inset-0 z-10"
          style={{ transform: imageStyle(baseOffset, BASE_SCALE), willChange: "transform" }}
          aria-hidden="true"
        >
          <div
            className="hero-zoom absolute inset-0 bg-cover bg-top bg-no-repeat top-2"
            style={{ backgroundImage: `url(${heroImages.base})` }}
            aria-hidden="true"
          />
        </div>

        {/* Layer 2 — spotlight-revealed second image */}
        <div
          className="absolute inset-0 z-20"
          style={{ transform: imageStyle(revealOffset, REVEAL_SCALE), willChange: "transform" }}
          aria-hidden="true"
        >
          <RevealLayer
            image={heroImages.reveal}
            cursorX={cursorPos.x}
            cursorY={cursorPos.y}
          />
        </div>

        {/* Layer 3 — vignette for legibility */}
        <div
          className="pointer-events-none absolute inset-0 z-40 bg-linear-to-t from-night/80 via-transparent to-night/50"
          aria-hidden="true"
        />

        {/* ── Heading — top-center ─────────────────────────────────────────── */}
        <div
          className="pointer-events-none absolute inset-0 z-50"
          style={{ transform: uiStyle(uiOffset), willChange: "transform" }}
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
        </div>

        {/* ── Bottom-left — intro paragraph ────────────────────────────────── */}
        <div
          className="pointer-events-none absolute inset-0 z-50 hidden sm:block"
          style={{ transform: uiStyle(uiOffset), willChange: "transform" }}
        >
          <div
            className="hero-anim hero-fade absolute bottom-14 left-10 max-w-[260px] md:left-14"
            style={{ animationDelay: "0.7s" }}
          >
            <p className="text-sm leading-relaxed text-ink/80">
              {content.hero.intro.replace("{name}", site.name)}
            </p>
          </div>
        </div>

        {/* ── Bottom-right — hint + CTAs ───────────────────────────────────── */}
        <div
          className="pointer-events-none absolute inset-0 z-50"
          style={{ transform: uiStyle(uiOffset), willChange: "transform" }}
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
        </div>

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
