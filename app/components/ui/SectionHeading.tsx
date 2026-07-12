"use client";

import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  /** id applied to the h2 for aria-labelledby wiring. */
  headingId?: string;
};

export function SectionHeading({ eyebrow, title, description, headingId }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          id={headingId}
          className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl"
        >
          {title}
        </h2>
      </Reveal>
      {description ? (
        <Reveal delay={0.16}>
          <p className="mt-4 leading-relaxed text-muted">{description}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
