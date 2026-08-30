"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLang } from "../../lib/i18n";

// The WebGL canvas is client-only and code-split so it never blocks first paint.
const Scene = dynamic(() => import("../home/Scene"), { ssr: false, loading: () => null });

/**
 * Tokenize the statement for scrubbing: latin text splits on spaces, CJK
 * text splits per character (no reliable word boundaries).
 */
function tokenize(text: string): string[] {
  if (/[\u3000-\u30ff\u4e00-\u9fff]/.test(text)) return [...text];
  return text.split(" ");
}

/** One token whose opacity is driven by a slice of the section's scroll. */
function ScrubToken({
  progress,
  range,
  accent,
  spaced,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
  spaced: boolean;
  children: ReactNode;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={accent ? "text-gradient" : undefined}
    >
      {children}
      {/* Latin tokens need their separating space back after splitting */}
      {spaced ? " " : null}
    </motion.span>
  );
}

/**
 * The manifesto: a pinned stage where the particle wave breathes behind a
 * statement that illuminates word by word as the visitor scrolls. The wave
 * reads the same scroll progress, so type and field move as one.
 *
 * Reduced motion: no pin, no canvas - a calm static statement.
 */
export function Manifesto() {
  const reduce = useReducedMotion();
  const { content } = useLang();
  const containerRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [waveActive, setWaveActive] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Mirror scroll progress into a plain ref for the render loop.
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      progressRef.current = v;
    });
  }, [scrollYProgress]);

  // Only render frames while the pinned stage is actually on screen.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setWaveActive(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const tokens = useMemo(
    () => tokenize(content.manifesto.lead).filter((t) => t !== ""),
    [content.manifesto.lead],
  );
  const accentFrom = Math.floor(tokens.length * 0.82);
  const spaced = /[\u3000-\u30ff\u4e00-\u9fff]/.test(content.manifesto.lead) === false;

  const supportOpacity = useTransform(scrollYProgress, [0.6, 0.78], [0, 1]);
  const supportY = useTransform(scrollYProgress, [0.6, 0.82], [28, 0]);

  if (reduce) {
    return (
      <section
        aria-label={content.manifesto.ariaSection}
        className="border-y border-line bg-white/[0.02] py-32"
      >
        <div className="container-x">
          <p className="max-w-4xl font-display text-section font-semibold leading-tight tracking-tight text-ink sm:text-title">
            {content.manifesto.lead}
          </p>
          <p className="mt-8 max-w-xl leading-relaxed text-muted">
            {content.manifesto.support}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      aria-label={content.manifesto.ariaSection}
      className="relative"
      style={{ height: "260vh" }}
    >
      <div className="sticky top-0 flex h-[100dvh] items-center overflow-hidden">
        {/* Particle wave - decorative atmosphere, desktop only */}
        <div className="absolute inset-0 z-0 hidden md:block" aria-hidden="true">
          <Scene progressRef={progressRef} active={waveActive} />
        </div>

        {/* Legibility wash */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-linear-to-b from-night/70 via-night/10 to-night/80"
        />

        <div className="container-x relative z-20">
          <p className="max-w-5xl font-display text-title font-semibold leading-[1.18] tracking-tight sm:text-display sm:leading-[1.08]">
            {tokens.map((token, index) => {
              const span = 0.55 / tokens.length;
              const start = 0.04 + index * span;
              return (
                <ScrubToken
                  key={`${token}-${index}`}
                  progress={scrollYProgress}
                  range={[start, Math.min(1, start + span * 2.2)]}
                  accent={index >= accentFrom}
                  spaced={spaced}
                >
                  {token}
                </ScrubToken>
              );
            })}
          </p>

          <motion.p
            style={{ opacity: supportOpacity, y: supportY }}
            className="mt-10 max-w-xl text-lede leading-relaxed text-muted"
          >
            {content.manifesto.support}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
