/**
 * Attract mode as a pure function of time, so `?t=` can freeze any moment
 * and a still rendered twice is identical.
 */

export interface BookState {
  /** Page position: 0 = closed on the cover, n = spread n fully open. */
  p: number;
  /** Spread 2 pull tab, 0..1. */
  tab: number;
  /** Spread 4 paper plane along its route, 0..1. */
  plane: number;
  /** Spread 5 sky wheel, 0 = dusk, 1 = night. */
  wheel: number;
  /** Spread 5 contact card, 0..1. */
  card: number;
}

export const SPREADS = 5;
export const LOOP = 36;
/** Time at which each spread (0 = cover) has just come to rest. */
export const DWELL = [0, 2.8, 6.7, 11.9, 15.9, 21.8];
/** How far a "half" view is from fully open. */
const HALF = 0.2;

export const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const seg = (t: number, start: number, length: number) => smooth((t - start) / length);

export function stateAt(time: number): BookState {
  const t = ((time % LOOP) + LOOP) % LOOP;
  return {
    p:
      seg(t, 0.9, 1.9) +
      seg(t, 5.0, 1.7) +
      seg(t, 10.2, 1.7) +
      seg(t, 14.2, 1.7) +
      seg(t, 19.6, 2.2) -
      5 * seg(t, 31.4, 4),
    tab: seg(t, 7.2, 0.9) - seg(t, 9.3, 0.7),
    plane: seg(t, 16.3, 2.6) - seg(t, 30, 0.5),
    wheel: seg(t, 22.6, 3.6) - seg(t, 32, 1),
    card: seg(t, 26.6, 1.1) - seg(t, 30.4, 0.9),
  };
}

/**
 * `?view=` names a state: cover, spread-1..5, half-1..5, engineer.
 * `?t=` alone freezes attract mode at that second; with a view it only sets
 * the mechanisms (wheel, tabs, plane). Returns null when neither is given.
 */
export function frozenState(view: string | null, t: number | null): BookState | null {
  const at = t === null ? null : stateAt(t);
  if (!view) return at;
  const match = /^(spread|half)-([1-5])$/.exec(view);
  const n = match ? Number(match[2]) : view === "engineer" ? 5 : 0;
  const open = match?.[1] !== "half";
  const rest: BookState = {
    p: open ? n : n - HALF,
    tab: open && n === 2 ? 1 : 0,
    plane: open && n === 4 ? 0.62 : 0,
    wheel: open && n === 5 ? 1 : 0,
    card: open && n === 5 ? 1 : 0,
  };
  return at ? { ...at, p: rest.p } : rest;
}
