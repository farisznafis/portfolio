"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useActiveSection } from "../../hooks/useActiveSection";
import { SPRING } from "../../lib/motion";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

const SECTION_IDS = SECTIONS.map((s) => s.id);

/** Fixed dot navigation on the right edge — shows which "page" is active. */
export function PageIndicator() {
  const active = useActiveSection(SECTION_IDS);
  const reduce = useReducedMotion();

  return (
    <nav
      aria-label="Page sections"
      className="page-indicator hidden md:flex"
    >
      {SECTIONS.map((section) => {
        const isActive = active === section.id;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-label={section.label}
            aria-current={isActive ? "true" : undefined}
            className={`page-dot${isActive ? " page-dot--active" : ""}`}
          >
            {isActive && !reduce && (
              <motion.span
                layoutId="page-dot-glow"
                className="absolute inset-0 rounded-full"
                transition={SPRING.glow}
              />
            )}
          </a>
        );
      })}
    </nav>
  );
}
