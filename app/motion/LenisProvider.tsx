"use client";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "./gsap";

type SmoothScrollApi = {
  /** Programmatic scroll to a CSS selector or pixel offset. */
  scrollTo: (target: string | number, offset?: number) => void;
};

const SmoothScrollContext = createContext<SmoothScrollApi>({
  scrollTo: () => {},
});

/**
 * Lenis smooth scrolling wired into GSAP's ticker so ScrollTrigger pins and
 * scrubs stay perfectly in phase with the eased scroll position.
 *
 * Disabled entirely under prefers-reduced-motion - the site falls back to
 * native scrolling and every animation collapses to its static end state.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Native scrolling under reduced motion; anchors use scrollIntoView.
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.15,
      // Same family as the signature easing: fast start, long settle.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Pins measure against the document; refresh once fonts settle.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback((target: string | number, offset = 0) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { offset });
      return;
    }
    // Reduced-motion fallback: instant jump for numbers, auto for selectors.
    if (typeof target === "number") {
      window.scrollTo({ top: target });
      return;
    }
    document.querySelector(target)?.scrollIntoView();
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

/** Access the shared smooth-scroll controller (safe on any client tree). */
export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}
