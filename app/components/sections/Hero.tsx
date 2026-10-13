"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue, useReducedMotion, useTransform, type MotionValue, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { heroImages, heroName } from "../../content/profile";
import { useLang } from "../../lib/i18n";
import { DUR, EASE } from "../../lib/motion";
import { useIntro } from "../Loader";
import { MaskedText } from "../ui/MaskedText";
import { RolloverText } from "../ui/RolloverText";
import { Magnetic } from "../ui/Magnetic";
import { useSmoothScroll } from "../../motion/LenisProvider";

// WebGL fluid reveal: client-only and split out so three.js never blocks the hero's first paint.
const FluidReveal = dynamic(() => import("../home/FluidReveal").then((m) => m.FluidReveal), {
  ssr: false,
  loading: () => null,
});

// ─── Cursor parallax config ──────────────────────────────────────────────────
const PARALLAX_MAX = 28;
const BASE_PARALLAX = 1;
const REVEAL_PARALLAX = 1.35;
const UI_PARALLAX = 0.25;
const BASE_SCALE = 1.06; // oversize so edges never reveal gaps
const REVEAL_SCALE = 1.09;

const INITIAL = -999; // cursor guard: no parallax until the pointer first moves

/** Normalized parallax offset (-1..1) for a motion value, zero before first move. */
function useParallaxAxis(value: MotionValue<number>) {
  return useTransform(value, (v) => {
    if (v === INITIAL) return 0;
    return Math.max(-1, Math.min(1, v / window.innerWidth - 0.5));
  });
}

// Entrance choreography - gated on the loader finishing.
const fadeRise: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, delay, ease: EASE },
  }),
};

export function Hero() {
  const { done } = useIntro();
  const reduce = useReducedMotion();
  const { content } = useLang();
  const { scrollTo } = useSmoothScroll();

  // Smoothed cursor position as motion values: updates never re-render React.
  const mouse = useRef({ x: INITIAL, y: INITIAL });
  const smooth = useRef({ x: INITIAL, y: INITIAL });
  const rafRef = useRef<number>(0);
  const smoothX = useMotionValue(INITIAL);
  const smoothY = useMotionValue(INITIAL);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    let prev = performance.now();
    const loop = (now: number) => {
      // Frame-rate independent damping: same feel on 60 Hz and 144 Hz screens.
      const k = 1 - Math.exp(-Math.min(now - prev, 50) * 0.0063);
      prev = now;
      const dx = mouse.current.x - smooth.current.x;
      const dy = mouse.current.y - smooth.current.y;
      if (Math.abs(dx) > 0.08 || Math.abs(dy) > 0.08) {
        smooth.current.x += dx * k;
        smooth.current.y += dy * k;
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

  // Parallax offsets per depth. Zeroed under reduced motion and until first move.
  const nx = useParallaxAxis(smoothX);
  const ny = useParallaxAxis(smoothY);

  const baseX = useTransform(nx, (v) => (reduce ? 0 : v * PARALLAX_MAX * BASE_PARALLAX));
  const baseY = useTransform(ny, (v) => (reduce ? 0 : v * PARALLAX_MAX * BASE_PARALLAX));
  const revealX = useTransform(nx, (v) => (reduce ? 0 : v * PARALLAX_MAX * REVEAL_PARALLAX));
  const revealY = useTransform(ny, (v) => (reduce ? 0 : v * PARALLAX_MAX * REVEAL_PARALLAX));
  const uiX = useTransform(nx, (v) => (reduce ? 0 : v * PARALLAX_MAX * -UI_PARALLAX));
  const uiY = useTransform(ny, (v) => (reduce ? 0 : v * PARALLAX_MAX * -UI_PARALLAX));

  const gate = reduce || done;

  return (
    <section id="home" aria-label={content.hero.ariaSection} className="relative isolate w-full">
      <div className="relative w-full overflow-hidden bg-night" style={{ height: "100dvh" }}>
        {/* Layer 1 - base portrait with Ken Burns zoom-out on load */}
        <motion.div
          className="absolute inset-0 z-10"
          style={{ x: baseX, y: baseY, scale: BASE_SCALE, willChange: "transform" }}
          aria-hidden="true"
        >
          <div
            className={`absolute inset-0 bg-cover bg-top bg-no-repeat ${reduce ? "" : "hero-zoom"}`}
            style={{ backgroundImage: `url(${heroImages.base})` }}
          />
        </motion.div>

        {/* Layer 2 - second portrait revealed through a fluid cursor trail */}
        <div className="absolute inset-0 z-20" aria-hidden="true">
          <FluidReveal image={heroImages.reveal} scale={REVEAL_SCALE} offsetX={revealX} offsetY={revealY} />
        </div>

        {/* Layer 3 - vignette for legibility */}
        <div
          className="pointer-events-none absolute inset-0 z-30 bg-linear-to-t from-night/85 via-night/5 to-night/45"
          aria-hidden="true"
        />

        {/* ── Top-left - statement + metadata rail ─────────────────────────── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-40"
          style={{ x: uiX, y: uiY, willChange: "transform" }}
        >
          <motion.div
            className="container-x pt-24 sm:pt-28"
            initial={gate ? false : "hidden"}
            animate="show"
            custom={0.05}
            variants={fadeRise}
          >
            {content.hero.statement ? (
              <p className="max-w-xs text-lede leading-snug text-ink/90 sm:max-w-sm">
                {content.hero.statement}
              </p>
            ) : null}
            {(
              content.hero.role ||
              content.hero.metaLocation ||
              content.hero.metaAvailability
            ) ? (
              <ul className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                {content.hero.role ? (
                  <li className="text-ink">
                    {content.hero.role}
                  </li>
                ) : null}

                {content.hero.metaLocation ? (
                  <li>
                    {content.hero.metaLocation}
                  </li>
                ) : null}

                {content.hero.metaAvailability ? (
                  <li className="text-accent-bright">
                    {content.hero.metaAvailability}
                  </li>
                ) : null}
              </ul>
            ) : null}
          </motion.div>
        </motion.div>

        {/* ── Bottom - oversized name + CTAs + spotlight hint ──────────────── */}
        <div className="absolute inset-x-0 bottom-0 z-40">
          <div className="container-x pb-8 sm:pb-10">
            <h1 className="font-display uppercase leading-[0.82] tracking-[-0.03em]">
              <span className="block text-hero text-outline">
                <MaskedText text={heroName.line1} onMount play={done} delay={0.15} />
              </span>
              <span className="-mt-[0.06em] block text-hero leading-[0.82] tracking-[-0.03em]">
                <span className="text-outline">
                  <MaskedText
                    text={heroName.line2Filled}
                    onMount
                    play={done}
                    delay={0.32}
                  />
                </span>

                <span className="text-outline">
                  <MaskedText
                    text={heroName.line2Outline}
                    onMount
                    play={done}
                    delay={0.32}
                  />
                </span>
              </span>
            </h1>

            <div className="mt-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
              <motion.div
                className="pointer-events-auto flex flex-wrap items-center gap-3"
                initial={gate ? false : "hidden"}
                animate="show"
                custom={0.55}
                variants={fadeRise}
              >
                <Magnetic>
                  <a
                    href="#work"
                    data-cursor="View"
                    onClick={(event) => {
                      event.preventDefault();
                      scrollTo("#work");
                    }}
                    className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-medium text-on-accent transition-transform active:scale-[0.97]"
                  >
                    <RolloverText text={content.hero.ctaWork ?? ""} />
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href="#contact"
                    onClick={(event) => {
                      event.preventDefault();
                      scrollTo("#contact");
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-night/40 px-6 py-3 text-sm font-medium text-ink backdrop-blur-md transition-colors hover:border-accent/60"
                  >
                    <RolloverText text={content.hero.ctaTouch ?? ""} />
                  </a>
                </Magnetic>
              </motion.div>

              {content.hero.hint ? (
                <motion.p
                  className="hidden max-w-[220px] text-right font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-muted/80 md:block"
                  initial={gate ? false : "hidden"}
                  animate="show"
                  custom={0.7}
                  variants={fadeRise}
                >
                  {content.hero.hint}
                </motion.p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
