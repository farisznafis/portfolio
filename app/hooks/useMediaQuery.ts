"use client";

import { useEffect, useState } from "react";

/**
 * Subscribes to a CSS media query. Returns false during SSR/first paint,
 * then tracks the live value. Used to scale motion down on small viewports.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}
