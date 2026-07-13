"use client";

import { motion, useReducedMotion } from "framer-motion";
import { skillGroups } from "../lib/data";
import { EASE } from "../lib/motion";
import { MaskedText } from "./ui/MaskedText";

export function Skills() {
  const reduce = useReducedMotion();

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative z-10 min-h-screen pt-28"
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
            Skills
          </p>
          <h2
            id="skills-heading"
            className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl"
          >
            <MaskedText text="Tools I reach for every day" delay={0.1} />
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            Grouped by how I actually use them — foundations, the layer that
            brings life, and the practices that keep everything shippable.
          </p>
        </motion.div>

        {/* Skill cards */}
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {skillGroups.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              className="glass h-full rounded-2xl p-6 transition-colors hover:border-accent/40 sm:p-7"
              initial={reduce ? {} : { opacity: 0, y: 50, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.15 + groupIndex * 0.12, ease: EASE }}
            >
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
                      <motion.span
                        className="font-mono text-xs text-muted"
                        initial={reduce ? {} : { opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.4 + skillIndex * 0.1 }}
                      >
                        {skill.level}%
                      </motion.span>
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
                          duration: 1.2,
                          delay: 0.3 + skillIndex * 0.1,
                          ease: EASE,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
