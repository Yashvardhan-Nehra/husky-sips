/**
 * Asset manifest for the scroll-driven assembly stage.
 *
 * Every layer renders from a built-in vector illustration unless `src` points at a supplied
 * transparent raster (PNG/WebP) or SVG of the given size. Sizes are in stage units — the stage
 * viewBox is 420 × 560. Export rasters at 2× (840 × 1120) for crisp results.
 *
 * The supplied composite renders are references only, not an animation asset pack, and are
 * never stretched into a fake transparent can.
 */
export type StageLayerId =
  | 'pedestal'
  | 'container-back'
  | 'liquid'
  | 'pour-stream'
  | 'container-front'
  | 'lid'
  | `fruit:${string}`
  | `extra:${string}`
  | 'poster'
  | 'static-steps';

export interface StageLayer {
  id: StageLayerId;
  label: string;
  /** Path under /assets/stage, or null to use the built-in vector fallback. */
  src: string | null;
  size: { width: number; height: number };
  format: 'png-alpha' | 'webp-alpha' | 'svg' | 'image-sequence';
  notes: string;
}

export const STAGE_VIEWBOX = { width: 420, height: 560 } as const;

export const STAGE_LAYERS: StageLayer[] = [
  { id: 'pedestal', label: 'Pedestal (dark green stone)', src: null, size: { width: 300, height: 90 }, format: 'png-alpha', notes: 'Top-down lit, soft shadow baked in. Reference: "HuskySips on a Forest Stone Pedestal".' },
  { id: 'container-back', label: 'Empty container — back wall', src: null, size: { width: 180, height: 330 }, format: 'png-alpha', notes: 'Transparent can body without the front highlights so liquid and fruit sit between back and front layers.' },
  { id: 'liquid', label: 'Liquid fill', src: null, size: { width: 160, height: 300 }, format: 'image-sequence', notes: 'Optional rendered pour sequence (24–48 frames) clipped to the container; otherwise the vector fill animates.' },
  { id: 'pour-stream', label: 'Pour stream', src: null, size: { width: 40, height: 240 }, format: 'png-alpha', notes: 'Vertical stream with soft edges; opacity is animated.' },
  { id: 'fruit:watermelon', label: 'Watermelon cube', src: null, size: { width: 64, height: 64 }, format: 'png-alpha', notes: 'Edible portion size, cut cube with a hint of rind.' },
  { id: 'fruit:kiwi', label: 'Kiwi slice', src: null, size: { width: 64, height: 64 }, format: 'png-alpha', notes: 'Round slice, slightly tilted.' },
  { id: 'fruit:pineapple', label: 'Pineapple wedge', src: null, size: { width: 72, height: 64 }, format: 'png-alpha', notes: 'Only used if the recipe includes pineapple.' },
  { id: 'fruit:orange', label: 'Orange segment', src: null, size: { width: 64, height: 56 }, format: 'png-alpha', notes: 'Only used if the recipe includes orange.' },
  { id: 'fruit:coconut', label: 'Tender coconut chunk', src: null, size: { width: 60, height: 56 }, format: 'png-alpha', notes: 'Only used if the recipe includes coconut.' },
  { id: 'extra:mint', label: 'Mint sprig', src: null, size: { width: 60, height: 48 }, format: 'png-alpha', notes: 'Shown only when the recipe has an extra.' },
  { id: 'extra:chia', label: 'Chia seeds', src: null, size: { width: 60, height: 40 }, format: 'png-alpha', notes: 'Shown only when the recipe has an extra.' },
  { id: 'container-front', label: 'Container front highlights / reflection', src: null, size: { width: 180, height: 330 }, format: 'png-alpha', notes: 'Specular highlights and condensation, mostly transparent.' },
  { id: 'lid', label: 'Lid (separate)', src: null, size: { width: 190, height: 50 }, format: 'png-alpha', notes: 'Metal lid, seated pose.' },
  { id: 'poster', label: 'Finished-product poster', src: '/assets/reference/pedestal-1080.webp', size: { width: 1080, height: 1440 }, format: 'webp-alpha', notes: 'Used for the reduced-motion/static version. Currently the illustrative render; replace with an approved product photograph.' },
  { id: 'static-steps', label: 'Static reduced-motion explanation', src: null, size: { width: 0, height: 0 }, format: 'svg', notes: 'Rendered as an ordered list of steps alongside the poster (see StaticAssembly).' },
];

export function getStageLayer(id: StageLayerId): StageLayer | undefined {
  return STAGE_LAYERS.find((l) => l.id === id);
}
