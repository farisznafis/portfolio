"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { DUR, EASE } from "../../lib/motion";
import { ScrollTrigger } from "../../motion/gsap";

type PageTransitionProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Tracks whether a page has already been shown this session, so the cover
 * wipe only plays for client-side route changes - never on first load,
 * where the hero owns the entrance. Reading it in render is hydration-safe:
 * it only becomes true after the first page's effects run.
 */
let firstPageShown = false;

/**
 * Wraps page content with a premium entrance:
 * 1. on route changes, a two-tone cover (accent over night) wipes upward -
 *    the "cover → reveal" route-transition pattern, entrance-only so
 *    navigation never depends on the animation;
 * 2. content fades + slides up + deblurs beneath it.
 * Transform-only, unmounts the cover when done, and honors
 * prefers-reduced-motion with a plain fade.
 */
export function PageTransition({ children, className = "" }: PageTransitionProps) {
  const reduce = useReducedMotion();
  const [isRouteChange] = useState(() => typeof window !== "undefined" && firstPageShown);
  const [coverDone, setCoverDone] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    firstPageShown = true;
  }, []);

  /**
   * Once the entrance finishes, strip the inline transform/filter framer
   * leaves on the wrapper. A lingering `filter`/`transform` turns this div
   * into the containing block for `position: fixed`, which silently breaks
   * ScrollTrigger's fixed-position pins (e.g. the WorkReel horizontal reel
   * leaves a long empty pin-spacer behind it). Re-measure triggers after
   * clearing so every pin lines up with the clean ancestor chain.
   */
  const handleEnterComplete = () => {
    const el = contentRef.current;
    if (el) {
      el.style.transform = "";
      el.style.filter = "";
      el.style.willChange = "";
    }
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  const showCover = isRouteChange && !reduce && !coverDone;

  return (
    <>
      {showCover && (
        <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true">
          <motion.div
            className="absolute inset-0 origin-top bg-night"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: DUR.cover, ease: EASE, delay: DUR.cover / 8 }}
            onAnimationComplete={() => setCoverDone(true)}
          />
          <motion.div
            className="absolute inset-0 origin-top bg-accent"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: DUR.cover, ease: EASE }}
          />
        </div>
      )}
      <motion.div
        ref={contentRef}
        className={className}
        initial={
          reduce
            ? { opacity: 1 }
            : { opacity: 0, y: 40, filter: "blur(8px)" }
        }
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          duration: DUR.cover,
          ease: EASE,
          delay: !reduce && isRouteChange ? DUR.cover / 4 : 0,
        }}
        onAnimationComplete={handleEnterComplete}
      >
        {children}
      </motion.div>
    </>
  );
}
