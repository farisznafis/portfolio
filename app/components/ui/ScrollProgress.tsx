"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { SPRING } from "../../lib/motion";

/**
 * Thin scroll-progress line for the navbar bottom edge - scroll acting as
 * the page timeline. Transform-only (scaleX) and hidden from the
 * accessibility tree. The navbar leaves it out under prefers-reduced-motion
 * (decided after hydration; deciding it here during render fails hydration).
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smoothed = useSpring(scrollYProgress, SPRING.progress);

  return (
    <div aria-hidden="true" className="h-px bg-line">
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-accent via-accent-bright to-amber"
        style={{ scaleX: smoothed }}
      />
    </div>
  );
}
