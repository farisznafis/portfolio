"use client";

import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { EASE } from "../../lib/motion";

type SectionPageProps = {
  children: ReactNode;
  className?: string;
  /** Section id — used for scroll-to and page indicators */
  id: string;
  /** Label that floats on the left edge when active */
  label?: string;
  /** Index for the page indicator dot (0-based) */
  index?: number;
  /** Allow content taller than viewport (Projects, Experience) */
  tall?: boolean;
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE },
  },
};

/**
 * Wraps a section in a full-viewport "page" with:
 * - Scroll-snap alignment
 * - Viewport-triggered stagger entrance
 * - A floating label on the left edge
 * - Clip-path reveal from bottom
 *
 * The children receive the framer-motion orchestration context
 * so they can use motion.div with variants={childVariants} or
 * their own animations triggered by the parent's whileInView.
 */
export function SectionPage({
  children,
  className = "",
  id,
  label,
  tall = false,
}: SectionPageProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.section
      ref={ref}
      id={id}
      aria-label={label}
      className={`section-page${tall ? " section-page--tall" : ""} ${className}`}
      variants={containerVariants}
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
    >
      {/* Floating side label */}
      {label && (
        <motion.span
          className="section-label hidden lg:block"
          initial={reduce ? { opacity: 0.35 } : { opacity: 0, y: 12 }}
          animate={
            isInView
              ? { opacity: 0.35, y: 0 }
              : reduce
                ? { opacity: 0.35 }
                : { opacity: 0, y: 12 }
          }
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
        >
          {label}
        </motion.span>
      )}

      {children}
    </motion.section>
  );
}

/**
 * A child element that participates in the parent SectionPage's
 * staggered reveal. Wrap content blocks inside SectionPage with this.
 */
export function PageReveal({
  children,
  className,
  delay = 0,
  y = 40,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : y, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.9, delay, ease: EASE },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export { childVariants as sectionChildVariants };
