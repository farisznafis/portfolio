"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Accessibility, Gauge, Sparkles } from "lucide-react";
import { site } from "../lib/data";
import { useLang } from "../lib/i18n";
import { EASE } from "../lib/motion";
import { MaskedText } from "./ui/MaskedText";

const PRINCIPLE_ICONS = [Gauge, Sparkles, Accessibility];

export function About() {
  const reduce = useReducedMotion();
  const { content } = useLang();

  const facts = [
    { label: content.about.factLabels.name, value: site.name },
    { label: content.about.factLabels.basedIn, value: site.location },
    { label: content.about.factLabels.focus, value: content.about.focusValue },
    { label: content.about.factLabels.currently, value: content.about.currentlyValue },
  ] as const;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative z-10 min-h-[100dvh] pt-28 border-y border-line bg-white/[0.02]"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-14 px-5 py-24 sm:py-32 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          {/* Heading */}
          <h2
            id="about-heading"
            className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl"
          >
            <MaskedText text={content.about.heading} delay={0.1} />
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
              {content.about.p1a}
              <span className="text-ink">{content.about.p1Strong}</span>
              {content.about.p1b}
            </p>
            <p>
              {content.about.p2a}
              <span className="text-ink">{content.about.p2Strong}</span>
              {content.about.p2b}
            </p>
          </motion.div>

          {/* Principles — hairline list, no cards */}
          <ul className="mt-10 border-t border-line">
            {content.about.principles.map((principle, index) => {
              const Icon = PRINCIPLE_ICONS[index] ?? Sparkles;
              return (
                <motion.li
                  key={principle.title}
                  className="flex gap-4 border-b border-line py-5 sm:gap-5"
                  initial={reduce ? {} : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.25 + index * 0.1, ease: EASE }}
                >
                  <Icon
                    size={20}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-accent"
                  />
                  <div>
                    <h3 className="font-display text-base font-semibold text-ink">
                      {principle.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {principle.description}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
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
            <dl className="divide-y divide-line">
              {facts.map((fact, i) => (
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
              {content.about.blockquote}
            </blockquote>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
