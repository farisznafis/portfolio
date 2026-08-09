"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import clsx from "clsx";
import { useLang } from "../lib/i18n";
import { EASE } from "../lib/motion";
import { MaskedText } from "./ui/MaskedText";

export function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { content } = useLang();
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 65%"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative z-10 min-h-screen pt-28 border-y border-line bg-white/[0.02]"
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:py-32">
        {/* Heading */}
        <motion.div
          className="max-w-2xl"
          initial={reduce ? {} : { opacity: 0, y: 40, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            {content.experience.eyebrow}
          </p>
          <h2
            id="experience-heading"
            className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl"
          >
            <MaskedText text={content.experience.heading} delay={0.1} />
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            {content.experience.subtitle}
          </p>
        </motion.div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative mt-14 max-w-3xl">
          {/* Track + scroll-driven progress line */}
          <div aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-white/10" />
          <motion.div
            aria-hidden="true"
            className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-accent via-accent-bright to-amber"
            style={{ scaleY: reduce ? 1 : lineScale }}
          />

          <ol className="space-y-14">
            {content.experience.items.map((item, index) => (
              <motion.li
                key={`${item.company}-${item.period}`}
                className="relative pl-10"
                initial={reduce ? {} : { opacity: 0, x: -30, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: index * 0.12, ease: EASE }}
              >
                <span
                  aria-hidden="true"
                  className={clsx(
                    "absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 bg-night",
                    item.current ? "border-accent animate-pulse-dot" : "border-white/30",
                  )}
                />
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                  {item.period}
                  {item.current && (
                    <span className="ml-3 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 normal-case tracking-normal text-accent">
                      {content.experience.now}
                    </span>
                  )}
                </p>
                <h3 className="mt-3 font-display text-xl font-semibold text-ink sm:text-2xl">
                  {item.role} <span className="text-muted">·</span>{" "}
                  <span className="text-accent">{item.company}</span>
                </h3>
                <p className="mt-2 leading-relaxed text-muted">{item.summary}</p>
                <ul className="mt-4 space-y-2">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <span aria-hidden="true" className="mt-[7px] h-1 w-4 shrink-0 rounded-full bg-accent/50" />
                      {point}
                    </li>
                  ))}
                </ul>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label={content.experience.techAria}>
                  {item.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-line bg-white/5 px-3 py-1 font-mono text-xs text-muted"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>

    </section>
  );
}
