"use client";

import { Accessibility, Gauge, Sparkles } from "lucide-react";
import { aboutPrinciples, site } from "../lib/data";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const PRINCIPLE_ICONS = [Gauge, Sparkles, Accessibility];

const PROFILE_FACTS = [
  { label: "Name", value: site.name },
  { label: "Based in", value: site.location },
  { label: "Focus", value: "Interactive product UI" },
  { label: "Currently", value: "Senior Frontend Engineer" },
] as const;

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative z-10 border-y border-line bg-white/[0.02] py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-14 px-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <SectionHeading
            headingId="about-heading"
            eyebrow="About"
            title="Engineer by discipline, designer at heart"
          />
          <Reveal delay={0.2} className="mt-6 space-y-5 leading-relaxed text-muted">
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
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {aboutPrinciples.map((principle, index) => {
              const Icon = PRINCIPLE_ICONS[index] ?? Sparkles;
              return (
                <Reveal key={principle.title} delay={0.1 + index * 0.08}>
                  <div className="group h-full rounded-xl border border-line bg-white/[0.03] p-5 transition-colors hover:border-accent/40">
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
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Profile sheet */}
        <Reveal delay={0.15} className="lg:pt-16">
          <div className="glass rounded-2xl p-7 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              Profile
            </p>
            <dl className="mt-6 divide-y divide-line">
              {PROFILE_FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-baseline justify-between gap-6 py-4"
                >
                  <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                    {fact.label}
                  </dt>
                  <dd className="m-0 text-right text-sm font-medium text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <blockquote className="mt-6 border-l-2 border-accent pl-4 text-sm italic leading-relaxed text-muted">
              &ldquo;The best interfaces disappear — what remains is how they made you
              feel.&rdquo;
            </blockquote>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
