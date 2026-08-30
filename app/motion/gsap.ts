import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Central GSAP setup. Import { gsap, ScrollTrigger } from here instead of
 * the packages directly so ScrollTrigger is always registered exactly once.
 *
 * Motion tokens (durations / easings) live in ../lib/motion.ts for framer
 * motion, and are mirrored as CSS custom properties in globals.css. The GSAP
 * side reuses the same values through the helpers below.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Signature easing - soft, confident deceleration (matches EASE in lib/motion). */
export const G_EASE = "power3.out";

/** Scrub easing for pinned storytelling - linear, so scroll owns the pacing. */
export const G_SCRUB = "none";

/** Default ScrollTrigger refresh priority bookkeeping after loader/fonts. */
export function refreshScrollTriggers() {
  if (typeof window === "undefined") return;
  ScrollTrigger.refresh();
}

export { gsap, ScrollTrigger };
