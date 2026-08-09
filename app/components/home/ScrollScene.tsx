"use client";

import { useScroll, useTransform, motion, useReducedMotion, type MotionValue } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import clsx from "clsx";
import { useLang } from "../../lib/i18n";
import { RolloverText } from "../ui/RolloverText";

// The WebGL canvas is client-only and code-split so it never blocks first paint.
const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => null,
});

/**
 * A ~4-screen scroll journey. A sticky full-viewport particle wave sits behind
 * four 2D "beats" that fade through as you scroll. The shared scroll progress
 * (0→1) is written into a ref that the 3D scene reads each frame, so the wave
 * and the copy move as one.
 */
export function ScrollScene() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const { content } = useLang();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Mirror framer's scroll progress into a plain ref for the r3f render loop.
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      progressRef.current = v;
    });
  }, [scrollYProgress]);

  // Reduced-motion: skip the tall scroll rig, show a calm static summary.
  if (reduce) {
    return <StaticFallback />;
  }

  return (
    <section
      ref={containerRef}
      aria-label={content.hero.ariaSection}
      className="relative bg-night"
      style={{ height: "420vh" }}
    >
      {/* Sticky stage — 3D wave + the current 2D beat */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* 3D particle wave — decorative, hidden from assistive tech */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Scene progressRef={progressRef} />
        </div>

        {/* Ambient gradient wash for legibility */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-night/70 via-night/10 to-night/80"
        />

        {/* ── Beat 1 — one-liner + role ─────────────────────────────────── */}
        <Beat progress={scrollYProgress} range={[0.0, 0.06, 0.2, 0.26]}>
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent sm:text-sm">
              {content.home.intro.kicker}
            </p>
            <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl">
              {content.home.intro.line1}
              <br />
              <span className="text-accent">{content.home.intro.line2}</span>
            </h2>
            <p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-ink/70 sm:text-base">
              {content.home.intro.blurb}
            </p>
          </div>
        </Beat>

        {/* ── Beat 2 — three pillars ────────────────────────────────────── */}
        <Beat progress={scrollYProgress} range={[0.28, 0.36, 0.5, 0.58]}>
          <div className="mx-auto w-full max-w-5xl px-6">
            <div className="grid gap-5 md:grid-cols-2">
              {content.home.pillars.map((pillar, index) => (
                <div
                  key={pillar.title}
                  className={clsx(
                    "glass rounded-2xl p-6 text-left sm:p-7",
                    index === 0 && "md:col-span-2",
                  )}
                >
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {pillar.title}
                  </h3>
                  <p
                    className={clsx(
                      "mt-2 text-sm leading-relaxed text-muted",
                      index === 0 && "md:max-w-2xl",
                    )}
                  >
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Beat>

        {/* ── Beat 3 — stats ────────────────────────────────────────────── */}
        <Beat progress={scrollYProgress} range={[0.6, 0.68, 0.8, 0.88]}>
          <div className="mx-auto w-full max-w-4xl px-6">
            <dl className="grid grid-cols-1 gap-10 text-center sm:grid-cols-3">
              {content.home.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center">
                  <dd className="m-0 font-display text-5xl font-bold text-ink sm:text-6xl md:text-7xl">
                    <span className="text-gradient">
                      {stat.value}
                      {stat.suffix}
                    </span>
                  </dd>
                  <dt className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </Beat>

        {/* ── Beat 4 — CTA into the site ────────────────────────────────── */}
        <Beat progress={scrollYProgress} range={[0.9, 0.95, 1.01, 1.02]}>
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
              {content.home.make1}{" "}
              <span className="text-gradient">{content.home.make2}</span>
            </h2>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/work"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-medium text-on-accent transition-all hover:scale-[1.03] hover:bg-accent-bright hover:shadow-lg hover:shadow-accent/30 active:scale-95"
              >
                <RolloverText text={content.home.explore} /> <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full border border-line bg-night/40 px-6 py-3 text-sm font-medium text-ink backdrop-blur-md transition-colors hover:border-accent/50 hover:bg-night/60"
              >
                <RolloverText text={content.home.getInTouch} />
              </Link>
            </div>
          </div>
        </Beat>
      </div>
    </section>
  );
}

/**
 * A single 2D beat, absolutely centered on the sticky stage. Its opacity and
 * vertical drift are driven by four scroll keyframes: [fadeInStart, fullIn,
 * fullOut, fadeOutEnd]. Only the active beat is visible + interactive.
 *
 * Keyframes at or beyond 1 mean "never fade out" (the final beat): they are
 * clamped away because scroll-driven offsets must stay within [0, 1].
 */
function Beat({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number, number, number];
  children: React.ReactNode;
}) {
  const [a, b, c, d] = range;
  // A beat whose fade-out sits at/after the end of the scroll never exits.
  const persists = c >= 1 || d > 1;
  const offsets = persists ? [a, b] : [a, b, c, d];
  const opacity = useTransform(progress, offsets, persists ? [0, 1] : [0, 1, 1, 0]);
  const y = useTransform(progress, offsets, persists ? [60, 0] : [60, 0, 0, -60]);
  const scale = useTransform(
    progress,
    offsets,
    persists ? [0.96, 1] : [0.96, 1, 1, 1.02],
  );
  // Disable pointer events unless the beat is on screen
  const pointer = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));

  return (
    <motion.div
      style={{ opacity, y, scale, pointerEvents: pointer }}
      className="absolute inset-0 z-20 flex items-center justify-center"
    >
      {children}
    </motion.div>
  );
}

/** Calm, non-animated version for reduced-motion users. */
function StaticFallback() {
  const { content } = useLang();
  return (
    <section
      aria-label={content.hero.ariaSection}
      className="relative border-t border-line bg-night px-6 py-24"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent">
          {content.home.intro.kicker}
        </p>
        <h2 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
          {content.home.intro.line1} <span className="text-accent">{content.home.intro.line2}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted">
          {content.home.intro.blurb}
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-5 md:grid-cols-2">
        {content.home.pillars.map((pillar, index) => (
          <div
            key={pillar.title}
            className={clsx(
              "glass rounded-2xl p-6 sm:p-7",
              index === 0 && "md:col-span-2",
            )}
          >
            <h3 className="mt-3 font-display text-xl font-semibold text-ink">{pillar.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{pillar.description}</p>
          </div>
        ))}
      </div>

      <dl className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-10 text-center sm:grid-cols-3">
        {content.home.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <dd className="m-0 font-display text-5xl font-bold text-gradient">
              {stat.value}
              {stat.suffix}
            </dd>
            <dt className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>

      <div className="mx-auto mt-16 flex max-w-2xl flex-wrap items-center justify-center gap-3">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-medium text-on-accent transition-colors hover:bg-accent-bright"
        >
          {content.home.explore} <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-accent/50"
        >
          {content.home.getInTouch}
        </Link>
      </div>
    </section>
  );
}
