"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { PARALLAX } from "../../lib/motion";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Drift as a percentage of the element's own height (see PARALLAX tokens). */
  strength?: number;
};

/**
 * Scroll-linked vertical parallax for media inside an overflow-hidden mask.
 * The layer is slightly overscaled so the drift never exposes gaps.
 * Drift halves on small viewports and disables under prefers-reduced-motion.
 */
export function Parallax({
  children,
  className,
  strength = PARALLAX.media,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const compact = useMediaQuery("(max-width: 767px)");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const magnitude = reduce ? 0 : compact ? strength / 2 : strength;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${magnitude}%`, `${-magnitude}%`],
  );

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y, scale: magnitude ? 1 + (magnitude * 2) / 100 : 1 }}
    >
      {children}
    </motion.div>
  );
}
