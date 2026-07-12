"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "../../lib/motion";

type PageTransitionProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Wraps page content with a premium entrance animation.
 * Fades + slides up + deblurs on mount.
 * Respects prefers-reduced-motion.
 */
export function PageTransition({ children, className = "" }: PageTransitionProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={
        reduce
          ? { opacity: 1 }
          : { opacity: 0, y: 40, filter: "blur(8px)" }
      }
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
