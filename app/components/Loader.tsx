"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type IntroState = {
  /** True once the loader has finished (or been skipped) - entrances may play. */
  done: boolean;
};

const IntroContext = createContext<IntroState>({ done: false });

/** Gate entrance choreography behind the loader: `const { done } = useIntro()`. */
export function useIntro() {
  return useContext(IntroContext);
}

const SESSION_KEY = "fz-intro-seen";
const COUNT_MS = 1400;
const HOLD_MS = 260;

/**
 * Cinematic entry sequence: wordmark fades in, a counter accelerates to 100,
 * a hairline tracks progress, then the whole sheet wipes upward to reveal
 * the hero. Shown once per browser session; skipped instantly under
 * prefers-reduced-motion.
 *
 * The counter writes straight to a DOM node inside a rAF loop - no React
 * state churn at 60fps.
 */
export function IntroProvider({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"count" | "exit" | "done">("count");
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* storage unavailable - show the loader normally */
    }

    if (reduce || seen) {
      setPhase("done");
      return;
    }

    document.documentElement.style.overflow = "hidden";

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      const eased = 1 - Math.pow(1 - t, 3); // accelerate into the finish
      const value = Math.round(eased * 100);
      if (countRef.current) countRef.current.textContent = String(value);
      if (barRef.current)
        barRef.current.style.transform = `scaleX(${eased})`;

      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      window.setTimeout(() => {
        document.documentElement.style.overflow = "";
        setPhase("exit");
        window.setTimeout(() => {
          try {
            sessionStorage.setItem(SESSION_KEY, "1");
          } catch {
            /* ignore */
          }
          setPhase("done");
        }, 900);
      }, HOLD_MS);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, [reduce]);

  return (
    <IntroContext.Provider value={{ done: phase === "done" }}>
      {children}
      <AnimatePresence>
        {phase !== "done" && (
          <motion.div
            key="loader"
            aria-label="Loading portfolio"
            role="status"
            className="fixed inset-0 z-[90] flex flex-col justify-between overflow-hidden bg-night px-6 pb-8 pt-10 sm:px-10"
            initial={{ clipPath: "inset(0 0 0% 0)" }}
            animate={
              phase === "exit"
                ? { clipPath: "inset(0 0 100% 0)" }
                : { clipPath: "inset(0 0 0% 0)" }
            }
            transition={
              phase === "exit"
                ? { duration: 0.9, ease: [0.76, 0, 0.24, 1] }
                : { duration: 0.3 }
            }
          >
            {/* Wordmark */}
            <motion.p
              className="font-mono text-xs uppercase tracking-[0.45em] text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.6 }}
            >
              Faris Znafis
            </motion.p>

            {/* Counter */}
            <div className="flex items-end justify-between">
              <span className="sr-only">Loading portfolio</span>
              <span
                className="font-display text-hero leading-none tracking-tighter text-ink"
                aria-hidden="true"
              >
                <span ref={countRef}>00</span>
                <span className="text-accent">%</span>
              </span>
            </div>

            {/* Progress hairline */}
            <div
              className="absolute inset-x-0 bottom-0 h-px bg-line"
              aria-hidden="true"
            >
              <div
                ref={barRef}
                className="h-full w-full origin-left bg-accent"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </IntroContext.Provider>
  );
}
