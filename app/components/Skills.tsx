"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLang } from "../lib/i18n";
import { EASE } from "../lib/motion";
import { MaskedText } from "./ui/MaskedText";

export function Skills() {
  const reduce = useReducedMotion();
  const { content } = useLang();

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative z-10 min-h-[100dvh] pt-28"
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
          <h2
            id="skills-heading"
            className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl"
          >
            <MaskedText text={content.skills.heading} delay={0.1} />
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            {content.skills.subtitle}
          </p>
        </motion.div>

        {/* Skill groups — grouped lists with hairlines, no cards */}
        <div className="mt-14 grid gap-x-16 gap-y-14 md:grid-cols-2">
          {content.skills.groups.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              initial={reduce ? {} : { opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.1 + groupIndex * 0.12, ease: EASE }}
            >
              <h3 className="font-display text-xl font-semibold text-ink">
                {group.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted">{group.blurb}</p>
              <ul className="mt-6 border-t border-line">
                {group.skills.map((skill, skillIndex) => (
                  <motion.li
                    key={skill.name}
                    className="flex items-center justify-between border-b border-line py-3.5"
                    initial={reduce ? {} : { opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.25 + skillIndex * 0.06, ease: EASE }}
                  >
                    <span className="text-sm font-medium text-ink">{skill.name}</span>
                    <span className="h-1 w-6 rounded-full bg-accent/60" aria-hidden="true" />
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
