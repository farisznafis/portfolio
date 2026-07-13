"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DUR, EASE, STAGGER } from "../../lib/motion";

type MaskedTextProps = {
  text: string;
  className?: string;
  /** Seconds before the first word starts rising. */
  delay?: number;
  /** Words rendered with the .text-gradient accent treatment. */
  accentWords?: readonly string[];
  /** Animate on mount (hero) instead of on scroll into view. */
  onMount?: boolean;
};

/**
 * Headline reveal in the SplitText style: each word sits inside an
 * overflow-hidden mask and rises into place with a small stagger.
 * Transform + opacity only, so it stays on the compositor.
 * Falls back to static text under prefers-reduced-motion.
 */
export function MaskedText({
  text,
  className,
  delay = 0,
  accentWords = [],
  onMount = false,
}: MaskedTextProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  const wordClass = (word: string) =>
    accentWords.includes(word) ? "text-gradient" : undefined;

  if (reduce) {
    return (
      <span className={className}>
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className={wordClass(word)}>
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    );
  }

  const trigger = onMount
    ? { animate: { y: "0%", opacity: 1 } }
    : { whileInView: { y: "0%", opacity: 1 } };

  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom"
        >
          <motion.span
            className={`inline-block will-change-transform ${wordClass(word) ?? ""}`}
            initial={{ y: "110%", opacity: 0 }}
            {...trigger}
            viewport={onMount ? undefined : { once: true, amount: 0.6 }}
            transition={{
              duration: DUR.slow,
              delay: delay + i * STAGGER.words,
              ease: EASE,
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}
