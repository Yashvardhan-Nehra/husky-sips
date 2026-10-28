/**
 * Shared geometry and timing for the assembly stage. Both the scroll timeline and the static
 * "final pose" use these numbers so the poses always match.
 */
export const STAGE = {
  width: 420,
  height: 560,
  // transparent container
  body: { x: 115, y: 172, w: 190, h: 296, rx: 24 },
  inner: { x: 121, y: 178, w: 178, h: 284, rx: 18 },
  neck: { x: 127, y: 152, w: 166, h: 26 },
  lid: { x: 118, y: 136, w: 184, h: 22 },
  pedestalTopY: 476,
  centerX: 210,
} as const;

/** Where successive fruit pieces come to rest (inside the container). */
export const FRUIT_SLOTS: ReadonlyArray<{ x: number; y: number; r: number }> = [
  { x: 176, y: 404, r: -10 },
  { x: 250, y: 372, r: 14 },
  { x: 182, y: 318, r: 22 },
  { x: 256, y: 434, r: -16 },
  { x: 214, y: 262, r: 6 },
];

export const EXTRA_SLOT = { x: 236, y: 214, r: -8 } as const;

/** Liquid level (0–1 of inner height) after the pour, before fruit displacement. */
export const POUR_LEVEL = 0.74;
/** Extra level added per fruit piece (displacement). */
export const DISPLACEMENT_PER_FRUIT = 0.035;
export const EXTRA_DISPLACEMENT = 0.012;

/** Timeline positions (percent of scroll). */
export const T = {
  introStart: 0,
  introEnd: 15,
  pourStart: 15,
  pourEnd: 35,
  fruitStart: 35,
  fruitEnd: 65,
  extraStart: 65,
  extraEnd: 78,
  lidStart: 78,
  lidEnd: 90,
  heroStart: 90,
  heroEnd: 100,
} as const;

export function finalLevel(fruitCount: number, hasExtra: boolean): number {
  return Math.min(0.9, POUR_LEVEL + fruitCount * DISPLACEMENT_PER_FRUIT + (hasExtra ? EXTRA_DISPLACEMENT : 0));
}

/** translateY (stage units) for the liquid group at a given level. */
export function liquidOffsetFor(level: number): number {
  return (1 - Math.max(0, Math.min(1, level))) * STAGE.inner.h;
}
