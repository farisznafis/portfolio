"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useTransform, type MotionValue, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { heroImages, heroName } from "../../lib/data";
import { useLang } from "../../lib/i18n";
import { DUR, EASE } from "../../lib/motion";
import { useIntro } from "../Loader";
import { MaskedText } from "../ui/MaskedText";
import { RolloverText } from "../ui/RolloverText";
import { Magnetic } from "../ui/Magnetic";
import { useSmoothScroll } from "../../motion/LenisProvider";

// ─── Spotlight radius ────────────────────────────────────────────────────────
const SPOTLIGHT_R = 260;

// ─── Cursor parallax config ──────────────────────────────────────────────────
const PARALLAX_MAX = 28;
const BASE_PARALLAX = 1;
const REVEAL_PARALLAX = 1.35;
const UI_PARALLAX = 0.25;
const BASE_SCALE = 1.06; // oversize so edges never reveal gaps
const REVEAL_SCALE = 1.09;

const INITIAL = -999; // cursor guard: no parallax until the pointer first moves

/**
 * Renders the second (reveal) portrait visible only inside a soft circular
 * mask that follows the cursor. A hidden canvas draws a radial gradient at
 * the cursor position; its dataURL drives the CSS mask on the reveal layer.
 * Redraws coalesce to one draw per frame - no React re-renders on movement.
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
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => {
      const c = canvasRef.current;
      if (!c) return;
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    let scheduled = false;

    const draw = () => {
      const canvas = canvasRef.current;
      const layer = layerRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !layer || !ctx) return;

      const cx = cursorX.get();
      const cy = cursorY.get();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, SPOTLIGHT_R);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.4, "rgba(255,255,255,1)");
      g.addColorStop(0.6, "rgba(255,255,255,0.75)");
      g.addColorStop(0.75, "rgba(255,255,255,0.4)");
      g.addColorStop(0.88, "rgba(255,255,255,0.12)");
      g.addColorStop(1, "rgba(255,255,255,0)");

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, SPOTLIGHT_R, 0, Math.PI * 2);
      ctx.fill();

      const mask = `url(${canvas.toDataURL()})`;
      layer.style.maskImage = mask;
      layer.style.webkitMaskImage = mask;
      layer.style.maskSize = "100% 100%";
      (layer.style as CSSStyleDeclaration & { webkitMaskSize: string }).webkitMaskSize =
        "100% 100%";
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
      {/* Hidden canvas - used only to generate the mask dataURL */}
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
    <section id="home" aria-label={content.hero.ariaSection} className="relative w-full">
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

        {/* Layer 2 - spotlight-revealed second portrait */}
        <motion.div
          className="absolute inset-0 z-20"
          style={{ x: revealX, y: revealY, scale: REVEAL_SCALE, willChange: "transform" }}
          aria-hidden="true"
        >
          <RevealLayer image={heroImages.reveal} cursorX={smoothX} cursorY={smoothY} />
        </motion.div>

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
            <p className="max-w-xs text-lede leading-snug text-ink/90 sm:max-w-sm">
              {content.hero.statement}
            </p>
            <ul className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              <li className="text-ink">{content.hero.role}</li>
              <li>{content.hero.metaLocation}</li>
              <li className="text-accent-bright">{content.hero.metaAvailability}</li>
            </ul>
          </motion.div>
        </motion.div>

        {/* ── Bottom - oversized name + CTAs + spotlight hint ──────────────── */}
        <div className="absolute inset-x-0 bottom-0 z-40">
          <div className="container-x pb-8 sm:pb-10">
            <h1 className="font-display uppercase leading-[0.82] tracking-[-0.03em]">
              <span className="block text-hero text-ink">
                <MaskedText text={heroName.line1} onMount play={done} delay={0.15} />
              </span>
              <span className="-mt-[0.06em] block text-hero text-outline">
                <MaskedText text={heroName.line2} onMount play={done} delay={0.32} />
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
                    <RolloverText text={content.hero.ctaWork} />
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
                    <RolloverText text={content.hero.ctaTouch} />
                  </a>
                </Magnetic>
              </motion.div>

              <motion.p
                className="hidden max-w-[220px] text-right font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-muted/80 md:block"
                initial={gate ? false : "hidden"}
                animate="show"
                custom={0.7}
                variants={fadeRise}
              >
                {content.hero.hint}
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
