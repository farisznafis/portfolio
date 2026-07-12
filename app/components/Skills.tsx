"use client";

import { motion, useReducedMotion } from "framer-motion";
import { skillGroups } from "../lib/data";
import { EASE } from "../lib/motion";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function Skills() {
  const reduce = useReducedMotion();

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative z-10 mx-auto max-w-6xl px-5 py-24 sm:py-32"
    >
      <SectionHeading
        headingId="skills-heading"
        eyebrow="Skills"
        title="Tools I reach for every day"
        description="Grouped by how I actually use them — foundations, the layer that brings life, and the practices that keep everything shippable."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {skillGroups.map((group, groupIndex) => (
          <Reveal key={group.title} delay={groupIndex * 0.1} className="h-full">
            <div className="glass h-full rounded-2xl p-6 transition-colors hover:border-accent/40 sm:p-7">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                0{groupIndex + 1}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold text-ink">{group.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{group.blurb}</p>

              <ul className="mt-6 space-y-5">
                {group.skills.map((skill, skillIndex) => (
                  <li key={skill.name}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm font-medium text-ink">{skill.name}</span>
                      <span className="font-mono text-xs text-muted">{skill.level}%</span>
                    </div>
                    <div
                      role="meter"
                      aria-valuenow={skill.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${skill.name} proficiency`}
                      className="mt-2 h-1 overflow-hidden rounded-full bg-white/8"
                    >
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-accent to-accent-bright"
                        style={{ width: `${skill.level}%`, originX: 0 }}
                        initial={{ scaleX: reduce ? 1 : 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{
                          duration: 1,
                          delay: 0.15 + skillIndex * 0.08,
                          ease: EASE,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
