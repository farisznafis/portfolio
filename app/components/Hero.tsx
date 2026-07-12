"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Mail } from "lucide-react";
import { heroStats, marqueeStack, site } from "../lib/data";
import { EASE } from "../lib/motion";
import { Counter } from "./ui/Counter";
import { Magnetic } from "./ui/Magnetic";

const HEADLINE: { word: string; gradient?: boolean }[] = [
  { word: "Building" },
  { word: "interfaces" },
  { word: "that" },
  { word: "feel" },
  { word: "alive.", gradient: true },
];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative flex min-h-screen flex-col justify-between overflow-hidden pt-28"
    >
      {/* Blueprint grid, fading downward */}
      <div className="mesh-line pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 pb-16">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="flex flex-wrap items-center gap-x-5 gap-y-3"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-4 py-2 text-sm text-ink">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse-dot" aria-hidden="true" />
            {site.availability}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            {site.role} — {site.location}
          </span>
        </motion.div>

        <h1 className="mt-8 max-w-5xl font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-7xl lg:text-8xl">
          {HEADLINE.map((item, index) => (
            <span
              key={item.word}
              className="mr-[0.28em] inline-block overflow-hidden pb-1 align-bottom last:mr-0"
            >
              <motion.span
                className={item.gradient ? "text-gradient inline-block" : "inline-block"}
                initial={{ y: reduce ? "0%" : "110%", opacity: reduce ? 0 : 1 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.25 + index * 0.09, ease: EASE }}
              >
                {item.word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
          className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
        >
          I&apos;m {site.name} — a frontend engineer who blends motion design, 3D, and
          product thinking to ship web experiences people remember.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Magnetic className="inline-block">
            <a
              href="#work"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-bright"
            >
              View my work <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </Magnetic>
          <Magnetic className="inline-block">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-accent/50 hover:bg-white/10"
            >
              Get in touch <Mail size={17} aria-hidden="true" />
            </a>
          </Magnetic>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-16 flex flex-wrap items-end justify-between gap-8"
        >
          <dl className="flex flex-wrap gap-10 sm:gap-14">
            {heroStats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="order-last font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  {stat.label}
                </dt>
                <dd className="m-0 font-display text-4xl font-semibold text-ink sm:text-5xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </dl>

          <a
            href="#work"
            className="hidden items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-muted transition-colors hover:text-ink sm:inline-flex"
          >
            Scroll
            <motion.span
              aria-hidden="true"
              animate={reduce ? undefined : { y: [0, 5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex"
            >
              <ArrowDown size={14} />
            </motion.span>
          </a>
        </motion.div>
      </div>

      {/* Stack marquee — the hero's baseline */}
      <div className="marquee relative border-y border-line bg-white/[0.02] py-4">
        <div className="marquee-track animate-marquee flex w-max items-center gap-10">
          {[...marqueeStack, ...marqueeStack].map((item, index) => (
            <span
              key={`${item}-${index}`}
              aria-hidden={index >= marqueeStack.length}
              className="flex items-center gap-10 whitespace-nowrap font-mono text-sm uppercase tracking-[0.25em] text-muted"
            >
              {item}
              <span className="text-accent" aria-hidden="true">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
