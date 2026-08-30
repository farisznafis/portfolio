"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { SPRING } from "../../lib/motion";

/**
 * Thin scroll-progress line for the navbar bottom edge - scroll acting as
 * the page timeline. Transform-only (scaleX) and hidden from the
 * accessibility tree. Fully static under prefers-reduced-motion.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothed = useSpring(scrollYProgress, SPRING.progress);

  if (reduce) return null;

  return (
    <div aria-hidden="true" className="h-px bg-line">
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-accent via-accent-bright to-amber"
        style={{ scaleX: smoothed }}
      />
    </div>
  );
}
