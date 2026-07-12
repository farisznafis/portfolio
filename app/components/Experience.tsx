"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import clsx from "clsx";
import { experience } from "../lib/data";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 65%"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative z-10 border-y border-line bg-white/[0.02] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          headingId="experience-heading"
          eyebrow="Experience"
          title="The road so far"
          description="From freelance MVPs to leading frontend on products used by hundreds of teams."
        />

        <div ref={timelineRef} className="relative mt-14 max-w-3xl">
          {/* Track + scroll-driven progress line */}
          <div aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-white/10" />
          <motion.div
            aria-hidden="true"
            className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-accent via-accent-bright to-amber"
            style={{ scaleY: reduce ? 1 : lineScale }}
          />

          <ol className="space-y-14">
            {experience.map((item) => (
              <li key={`${item.company}-${item.period}`} className="relative pl-10">
                <span
                  aria-hidden="true"
                  className={clsx(
                    "absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 bg-night",
                    item.current ? "border-accent animate-pulse-dot" : "border-white/30",
                  )}
                />
                <Reveal>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                    {item.period}
                    {item.current && (
                      <span className="ml-3 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 normal-case tracking-normal text-accent">
                        Now
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
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies used">
                    {item.stack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-line bg-white/5 px-3 py-1 font-mono text-xs text-muted"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
