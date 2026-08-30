import type { Transition } from "framer-motion";

/**
 * Motion tokens - the single source of truth for timing, easing, and travel
 * distances. CSS-driven animations mirror these through the custom properties
 * declared in globals.css (:root - --ease-signature, --duration-*). Keep both
 * in sync when tuning.
 */

/** Signature easing used across the site - a soft, confident deceleration. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Duration scale in seconds. */
export const DUR = {
  /** Text/button rollovers and small state flips. */
  micro: 0.4,
  /** Menu panels, list entrances. */
  fast: 0.6,
  /** Standard element reveals. */
  base: 0.7,
  /** Headline and section reveals. */
  slow: 0.9,
  /** Route-transition cover wipe. */
  cover: 0.8,
} as const;

/** Stagger intervals in seconds. */
export const STAGGER = {
  /** Per-word offset in masked headline reveals. */
  words: 0.05,
  /** Menu links. */
  menu: 0.055,
  /** Sibling blocks inside a section. */
  items: 0.09,
} as const;

/** Shared spring presets for layout-linked elements. */
export const SPRING = {
  /** Active pill sliding between nav/filter items. */
  pill: { type: "spring", stiffness: 400, damping: 34 } satisfies Transition,
  /** Page-indicator glow dot. */
  glow: { type: "spring", stiffness: 350, damping: 28 } satisfies Transition,
  /** Smoothing for the navbar scroll-progress line. */
  progress: { stiffness: 140, damping: 26, mass: 0.4 },
} as const;
