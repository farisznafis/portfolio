"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Accessibility, Gauge, Sparkles } from "lucide-react";
import { aboutPrinciples, site } from "../lib/data";
import { EASE } from "../lib/motion";
import { MaskedText } from "./ui/MaskedText";

const PRINCIPLE_ICONS = [Gauge, Sparkles, Accessibility];

const PROFILE_FACTS = [
  { label: "Name", value: site.name },
  { label: "Based in", value: site.location },
  { label: "Focus", value: "Interactive product UI" },
  { label: "Currently", value: "Senior Frontend Engineer" },
] as const;

export function About() {
  const reduce = useReducedMotion();

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative z-10 min-h-screen pt-28 border-y border-line bg-white/[0.02]"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-14 px-5 py-24 sm:py-32 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          {/* Eyebrow */}
          <motion.p
            className="font-mono text-xs uppercase tracking-[0.3em] text-accent"
            initial={reduce ? {} : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            About
          </motion.p>

          {/* Heading */}
          <h2
            id="about-heading"
            className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl"
          >
            <MaskedText text="Engineer by discipline, designer at heart" delay={0.1} />
          </h2>

          {/* Animated separator line */}
          <motion.div
            className="mt-6 h-px w-full bg-gradient-to-r from-accent via-accent-bright/40 to-transparent"
            initial={reduce ? {} : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
            style={{ transformOrigin: "left center" }}
          />

          {/* Body text */}
          <motion.div
            className="mt-6 space-y-5 leading-relaxed text-muted"
            initial={reduce ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          >
            <p>
              I started out cutting PSDs into pixel-perfect pages, and never lost that obsession
              with detail. Over the last six years it grew into something bigger:{" "}
              <span className="text-ink">building product interfaces that move with intent</span> —
              where every transition explains state, and every hover rewards curiosity.
            </p>
            <p>
              Today I work across the whole frontend surface: design systems, WebGL moments,
              performance budgets, and the unglamorous glue in between. My favorite projects sit{" "}
              <span className="text-ink">right where engineering rigor meets craft</span>.
            </p>
          </motion.div>

          {/* Principle cards */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {aboutPrinciples.map((principle, index) => {
              const Icon = PRINCIPLE_ICONS[index] ?? Sparkles;
              return (
                <motion.div
                  key={principle.title}
                  className="group h-full rounded-xl border border-line bg-white/[0.03] p-5 transition-colors hover:border-accent/40"
                  initial={reduce ? {} : { opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.3 + index * 0.1, ease: EASE }}
                >
                  <Icon
                    size={20}
                    aria-hidden="true"
                    className="text-accent transition-transform duration-300 group-hover:-translate-y-0.5"
                  />
                  <h3 className="mt-4 font-display text-base font-semibold text-ink">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {principle.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Profile sheet */}
        <motion.div
          className="lg:pt-16"
          initial={reduce ? {} : { opacity: 0, x: 60, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, delay: 0.15, ease: EASE }}
        >
          <div className="glass rounded-2xl p-7 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              Profile
            </p>
            <dl className="mt-6 divide-y divide-line">
              {PROFILE_FACTS.map((fact, i) => (
                <motion.div
                  key={fact.label}
                  className="flex items-baseline justify-between gap-6 py-4"
                  initial={reduce ? {} : { opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: EASE }}
                >
                  <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                    {fact.label}
                  </dt>
                  <dd className="m-0 text-right text-sm font-medium text-ink">{fact.value}</dd>
                </motion.div>
              ))}
            </dl>
            <blockquote className="mt-6 border-l-2 border-accent pl-4 text-sm italic leading-relaxed text-muted">
              &ldquo;The best interfaces disappear — what remains is how they made you
              feel.&rdquo;
            </blockquote>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
