import type { CSSProperties } from 'react';
import type { Recipe } from './types';

/**
 * ============================================================
 *  INGREDIENT-DRIVEN COLOUR PALETTES
 * ============================================================
 *
 *  The global HuskySips identity (deep green / green-black / warm off-white) lives in
 *  src/styles/tokens.css. This file holds the *recipe* layer on top of it:
 *
 *  • Every ingredient has a palette taken from its natural colour (beetroot → burgundy,
 *    carrot → amber-orange, amla → leafy green …).
 *  • A recipe's palette is derived automatically from its ingredients — the strongest
 *    pigment becomes the dominant accent, the next one the supporting accent, and any leafy
 *    ingredient becomes the botanical accent. Add a fruit to the config and it just works.
 *  • `RECIPE_PALETTES` lets a specific recipe (by id) pin an exact, hand-tuned palette.
 *
 *  Components receive the palette as `--rp-*` CSS custom properties (see `paletteVars`);
 *  stylesheets read them with a global fallback, e.g. `var(--rp-primary, var(--forest))`,
 *  so anything outside a recipe context keeps the brand palette.
 *
 *  Contrast rules (checked by src/test/palette.test.ts):
 *  • `primary` / `primaryHover` carry warm-white text at ≥ 4.5:1.
 *  • `ink` is safe for small text on cream, on the ingredient tint and on the card surface.
 *  • `secondary` and `leaf` are decorative only (glows, icons, dots) and never carry text.
 */

export interface IngredientPalette {
  /** Display name, for documentation and debugging. */
  name: string;
  /** Pigment strength 0–100. The strongest ingredient in a recipe becomes the dominant accent. */
  weight: number;
  /** Deep accent for headings and primary buttons (warm-white text ≥ 4.5:1). */
  primary: string;
  /** Hover / pressed shade of `primary`, slightly darker. */
  primaryHover: string;
  /** The ingredient's natural bright colour. Decorative only: glows, icons, dots. */
  secondary: string;
  /** Small-text-safe shade (≥ 4.5:1 on cream and on `tint`). */
  ink: string;
  /** A very light wash of the ingredient: backgrounds, chips, secondary buttons. */
  tint: string;
  /** Botanical green that naturally accompanies the ingredient (rind, leaf, stem). Decorative only. */
  leaf: string;
  /** Leafy / herbal ingredients are preferred as the botanical accent of a mixed recipe. */
  botanical?: true;
}

/** Neutral anchors shared by every recipe palette. */
export const RECIPE_NEUTRALS = {
  /** Warm cream section background (slightly warmer than the page cream). */
  bg: '#f8f1e4',
  /** Warm ivory card surface. */
  surface: '#fffdf7',
  /** Deep charcoal body text inside recipe sections. */
  ink: '#25231f',
  /** Warm white used for text on dark accent fills. */
  onPrimary: '#fffdf7',
  /** Default botanical pair when a recipe has no leafy ingredient of its own. */
  leaf: '#567a43',
  leafInk: '#44612f',
  leafTint: '#e8eedb',
} as const;

export const INGREDIENT_PALETTES: Record<string, IngredientPalette> = {
  /* ---- Fruits currently in the catalogue ---- */
  watermelon: { name: 'Watermelon', weight: 90, primary: '#b9383a', primaryHover: '#9e2c2e', secondary: '#e35d5b', ink: '#8e2628', tint: '#f8e1de', leaf: '#5f8a4a' },
  kiwi: { name: 'Kiwi', weight: 60, primary: '#4a7324', primaryHover: '#3c5f1c', secondary: '#8dbe48', ink: '#3e6120', tint: '#e9f0da', leaf: '#4a7324', botanical: true },
  pineapple: { name: 'Pineapple', weight: 65, primary: '#9c6a0e', primaryHover: '#80560b', secondary: '#f2c14e', ink: '#7a5308', tint: '#fbefc9', leaf: '#4f7a3a' },
  orange: { name: 'Orange', weight: 70, primary: '#b8500c', primaryHover: '#9a420a', secondary: '#f28c28', ink: '#9a420a', tint: '#fbe6d2', leaf: '#4f7a3a' },
  coconut: { name: 'Tender coconut', weight: 30, primary: '#6b4a2e', primaryHover: '#54391f', secondary: '#a98b6a', ink: '#5c3f27', tint: '#f3ece1', leaf: '#5f8a4a' },

  /* ---- Extras ---- */
  mint: { name: 'Mint', weight: 40, primary: '#2f6b3f', primaryHover: '#255532', secondary: '#7dbe8a', ink: '#2b5e39', tint: '#e2f0e4', leaf: '#2f6b3f', botanical: true },
  chia: { name: 'Chia', weight: 20, primary: '#3f3a36', primaryHover: '#2e2a27', secondary: '#8a807a', ink: '#3f3a36', tint: '#eeeae4', leaf: '#5f8a4a' },

  /* ---- Morning Kickstarters / detox ingredients ---- */
  beetroot: { name: 'Beetroot', weight: 100, primary: '#8f2038', primaryHover: '#761a2e', secondary: '#b83250', ink: '#7e1c31', tint: '#f1dde0', leaf: '#567a43' },
  carrot: { name: 'Carrot', weight: 80, primary: '#b35a12', primaryHover: '#944a0e', secondary: '#e88732', ink: '#8f4710', tint: '#fbe8d4', leaf: '#567a43' },
  amla: { name: 'Amla', weight: 50, primary: '#567a43', primaryHover: '#456335', secondary: '#9db873', ink: '#44612f', tint: '#e8eedb', leaf: '#567a43', botanical: true },
  lemon: { name: 'Lemon', weight: 55, primary: '#7d6e0c', primaryHover: '#665a0a', secondary: '#f3d94a', ink: '#6b5e0a', tint: '#fbf4c9', leaf: '#6e9a4f' },
  cucumber: { name: 'Cucumber', weight: 45, primary: '#3f7a4f', primaryHover: '#326240', secondary: '#a8d08d', ink: '#356642', tint: '#e5f0e3', leaf: '#3f7a4f', botanical: true },
  ginger: { name: 'Ginger', weight: 40, primary: '#8f6b2e', primaryHover: '#745626', secondary: '#d7b46a', ink: '#74561f', tint: '#f4ead6', leaf: '#6e9a4f' },
  turmeric: { name: 'Turmeric', weight: 75, primary: '#a8650a', primaryHover: '#8a5308', secondary: '#f0a51c', ink: '#8a5308', tint: '#fcebca', leaf: '#6e9a4f' },
  tulsi: { name: 'Tulsi', weight: 35, primary: '#4f6e3a', primaryHover: '#40592f', secondary: '#8fae6e', ink: '#425d30', tint: '#e7eddc', leaf: '#4f6e3a', botanical: true },
  lemongrass: { name: 'Lemongrass', weight: 35, primary: '#5f6c1d', primaryHover: '#4d5718', secondary: '#c6d06a', ink: '#59651b', tint: '#f0f3d6', leaf: '#5f6c1d', botanical: true },
  aloe: { name: 'Aloe vera', weight: 30, primary: '#3f7a62', primaryHover: '#336250', secondary: '#9bd2b8', ink: '#346552', tint: '#e3f1ea', leaf: '#3f7a62', botanical: true },

  /* ---- Likely future fruits ---- */
  mango: { name: 'Mango', weight: 85, primary: '#a65a08', primaryHover: '#8a4a07', secondary: '#f7a823', ink: '#8f4e08', tint: '#fcebcf', leaf: '#4f7a3a' },
  pomegranate: { name: 'Pomegranate', weight: 95, primary: '#a01e3a', primaryHover: '#83182f', secondary: '#d63a5a', ink: '#8a1a33', tint: '#f6dde2', leaf: '#4f7a3a' },
  guava: { name: 'Pink guava', weight: 60, primary: '#b0405b', primaryHover: '#93354c', secondary: '#f0a2b0', ink: '#9a3e55', tint: '#fae6ea', leaf: '#5f8a4a' },
  lime: { name: 'Lime', weight: 55, primary: '#4f7a1e', primaryHover: '#3f6218', secondary: '#a5d43a', ink: '#3e6118', tint: '#ebf3d2', leaf: '#4f7a1e', botanical: true },
  mosambi: { name: 'Mosambi', weight: 50, primary: '#6b7510', primaryHover: '#565e0d', secondary: '#d7e05a', ink: '#5f680f', tint: '#f3f5d1', leaf: '#6e9a4f' },
  papaya: { name: 'Papaya', weight: 70, primary: '#ae4f22', primaryHover: '#90411c', secondary: '#f7944d', ink: '#9a4621', tint: '#fbe5d5', leaf: '#4f7a3a' },
  jamun: { name: 'Jamun', weight: 90, primary: '#4a2a5e', primaryHover: '#38204a', secondary: '#8a5ba5', ink: '#4a2a5e', tint: '#ece2f1', leaf: '#5f8a4a' },
  strawberry: { name: 'Strawberry', weight: 90, primary: '#b4213a', primaryHover: '#951b30', secondary: '#e8475f', ink: '#951b30', tint: '#f9dfe3', leaf: '#4f7a3a' },
  apple: { name: 'Apple', weight: 60, primary: '#a8322e', primaryHover: '#8b2824', secondary: '#de5a52', ink: '#8b2824', tint: '#f8e1dc', leaf: '#5f8a4a' },
  grape: { name: 'Black grape', weight: 85, primary: '#5b2e6e', primaryHover: '#472357', secondary: '#9c6ab5', ink: '#4f2760', tint: '#eee4f2', leaf: '#5f8a4a' },
  banana: { name: 'Banana', weight: 40, primary: '#846b0c', primaryHover: '#6b570a', secondary: '#f2d45c', ink: '#6e5a0a', tint: '#fbf3cf', leaf: '#6e9a4f' },
  muskmelon: { name: 'Muskmelon', weight: 55, primary: '#a06224', primaryHover: '#84511e', secondary: '#f4b570', ink: '#8f5a22', tint: '#fbebd7', leaf: '#6e9a4f' },
  lychee: { name: 'Lychee', weight: 55, primary: '#b2434e', primaryHover: '#93363f', secondary: '#e98591', ink: '#93363f', tint: '#f9e2e4', leaf: '#5f8a4a' },
  peach: { name: 'Peach', weight: 60, primary: '#aa5230', primaryHover: '#8c4328', secondary: '#f5a57e', ink: '#984a2b', tint: '#fbe6db', leaf: '#6e9a4f' },
  blueberry: { name: 'Blueberry', weight: 85, primary: '#3a3f7a', primaryHover: '#2d3160', secondary: '#6f74b8', ink: '#363a70', tint: '#e5e6f3', leaf: '#5f8a4a' },
  rose: { name: 'Rose', weight: 65, primary: '#b23c5e', primaryHover: '#93314d', secondary: '#ec8aa7', ink: '#93314d', tint: '#fae3ea', leaf: '#5f8a4a' },
  sugarcane: { name: 'Sugarcane', weight: 35, primary: '#686d22', primaryHover: '#54581c', secondary: '#c9cf7e', ink: '#5e6220', tint: '#f1f2d9', leaf: '#6e9a4f' },
};

/** Alternative ids and spellings that map onto a canonical ingredient palette. */
export const INGREDIENT_ALIASES: Record<string, string> = {
  'indian-gooseberry': 'amla',
  gooseberry: 'amla',
  beet: 'beetroot',
  'tender-coconut': 'coconut',
  'sweet-lime': 'mosambi',
  'musk-melon': 'muskmelon',
  cantaloupe: 'muskmelon',
  'holy-basil': 'tulsi',
  basil: 'tulsi',
  'lemon-grass': 'lemongrass',
  'aloe-vera': 'aloe',
  haldi: 'turmeric',
  'black-grape': 'grape',
  'pink-guava': 'guava',
  'fresh-mint': 'mint',
  'chia-seeds': 'chia',
};

/** Palette used when no ingredient is recognised: stays inside the brand's green palette. */
export const BRAND_INGREDIENT_PALETTE: IngredientPalette = {
  name: 'HuskySips',
  weight: 0,
  primary: '#142b21',
  primaryHover: '#243b2d',
  secondary: '#a8b89a',
  ink: '#566a4a',
  tint: '#e6eadf',
  leaf: '#73905f',
};

/** A fully resolved palette for one recipe section. */
export interface RecipePalette {
  /** Canonical ingredient keys that contributed, dominant first. */
  sources: string[];
  /** Dominant accent: primary buttons, key highlights. */
  primary: string;
  primaryHover: string;
  /** Dominant ingredient's natural bright colour (decorative: stage glow, icons). */
  secondary: string;
  /** Heading colour: `primary` when it reads at ≥ 4.5:1 on cream, otherwise the darker ink. */
  heading: string;
  /** Small-text-safe shade of the dominant accent. */
  accentInk: string;
  /** Supporting accent from the second ingredient (decorative) with its text-safe pair. */
  support: string;
  supportTint: string;
  supportInk: string;
  /** Botanical / leaf accent (decorative) with its text-safe pair and wash. */
  botanical: string;
  botanicalInk: string;
  botanicalTint: string;
  /** Backgrounds: warm cream section, soft ingredient wash, ivory card surface. */
  bg: string;
  bg2: string;
  surface: string;
  /** Body text and text on the primary fill. */
  ink: string;
  onPrimary: string;
  /** Borders derived from the dominant accent (dusty, low alpha). */
  line: string;
  lineStrong: string;
  /** Warm-toned shadows derived from the dominant accent. */
  shadowSm: string;
  shadow: string;
  shadowLg: string;
}

/**
 * Hand-tuned palettes pinned to a recipe id. A recipe without an entry here is derived from
 * its ingredients automatically. Keys must match `Recipe.id` in site.config.ts.
 */
export const RECIPE_PALETTES: Record<string, Partial<RecipePalette> & { ingredients: string[] }> = {
  /** ABC Juice — amla, beetroot, carrot. Beetroot burgundy leads; carrot and amla support. */
  'abc-juice': {
    ingredients: ['beetroot', 'carrot', 'amla'],
    primary: '#8f2038',
    primaryHover: '#761a2e',
    secondary: '#b83250',
    heading: '#8f2038',
    accentInk: '#7e1c31',
    support: '#e88732',
    botanical: '#567a43',
    bg: '#f8f1e4',
    bg2: '#f1dde0',
    ink: '#25231f',
    onPrimary: '#fffdf7',
  },
};

/* ---------- Colour maths (sRGB, WCAG 2.x) ---------- */

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export const WCAG_AA_TEXT = 4.5;

/* ---------- Derivation ---------- */

export function resolveIngredientKey(id: string | null | undefined): string | null {
  if (!id) return null;
  const key = id.toLowerCase().trim();
  if (INGREDIENT_PALETTES[key]) return key;
  const alias = INGREDIENT_ALIASES[key];
  return alias && INGREDIENT_PALETTES[alias] ? alias : null;
}

export function getIngredientPalette(id: string | null | undefined): IngredientPalette {
  const key = resolveIngredientKey(id);
  return key ? INGREDIENT_PALETTES[key]! : BRAND_INGREDIENT_PALETTE;
}

function shadowsFor(primary: string): Pick<RecipePalette, 'shadowSm' | 'shadow' | 'shadowLg'> {
  return {
    shadowSm: `0 1px 2px ${rgba(primary, 0.06)}, 0 2px 8px ${rgba(primary, 0.06)}`,
    shadow: `0 2px 6px ${rgba(primary, 0.06)}, 0 12px 32px ${rgba(primary, 0.12)}`,
    shadowLg: `0 8px 20px ${rgba(primary, 0.12)}, 0 28px 64px ${rgba(primary, 0.18)}`,
  };
}

/**
 * Build a palette from a list of ingredient ids (fruits, extras, anything in the catalogue).
 * Order of the input does not matter: pigment weight decides which ingredient leads.
 */
export function derivePalette(ingredientIds: ReadonlyArray<string | null | undefined>): RecipePalette {
  const keys = Array.from(new Set(ingredientIds.map(resolveIngredientKey).filter((k): k is string => !!k)));
  const ranked = keys.map((k) => ({ key: k, p: INGREDIENT_PALETTES[k]! })).sort((a, b) => b.p.weight - a.p.weight);

  const dominant = ranked[0]?.p ?? BRAND_INGREDIENT_PALETTE;
  const second = ranked[1]?.p ?? dominant;
  const leafy = ranked.find((r, i) => i > 0 && r.p.botanical)?.p ?? null;

  const botanical = leafy ? leafy.primary : dominant.leaf;
  const botanicalInk = leafy ? leafy.ink : RECIPE_NEUTRALS.leafInk;
  const botanicalTint = leafy ? leafy.tint : RECIPE_NEUTRALS.leafTint;

  const heading = contrastRatio(dominant.primary, RECIPE_NEUTRALS.bg) >= WCAG_AA_TEXT ? dominant.primary : dominant.ink;

  return {
    sources: ranked.map((r) => r.key),
    primary: dominant.primary,
    primaryHover: dominant.primaryHover,
    secondary: dominant.secondary,
    heading,
    accentInk: dominant.ink,
    support: second.secondary,
    supportTint: second.tint,
    supportInk: second.ink,
    botanical,
    botanicalInk,
    botanicalTint,
    bg: RECIPE_NEUTRALS.bg,
    bg2: dominant.tint,
    surface: RECIPE_NEUTRALS.surface,
    ink: RECIPE_NEUTRALS.ink,
    onPrimary: RECIPE_NEUTRALS.onPrimary,
    line: rgba(dominant.primary, 0.2),
    lineStrong: rgba(dominant.primary, 0.36),
    ...shadowsFor(dominant.primary),
  };
}

/** Palette for a recipe: the pinned entry in `RECIPE_PALETTES` if present, else derived from its ingredients. */
export function getRecipePalette(recipe: Pick<Recipe, 'id' | 'fruitIds' | 'extraId'>): RecipePalette {
  const pinned = RECIPE_PALETTES[recipe.id];
  if (pinned) {
    const { ingredients, ...overrides } = pinned;
    const base = derivePalette(ingredients.length ? ingredients : [...recipe.fruitIds, recipe.extraId]);
    const merged = { ...base, ...overrides };
    // keep derived lines/shadows consistent with an overridden primary
    if (overrides.primary && !overrides.line) merged.line = rgba(overrides.primary, 0.2);
    if (overrides.primary && !overrides.lineStrong) merged.lineStrong = rgba(overrides.primary, 0.36);
    if (overrides.primary && !overrides.shadow) Object.assign(merged, shadowsFor(overrides.primary));
    return merged;
  }
  return derivePalette([...recipe.fruitIds, recipe.extraId]);
}

/** CSS custom properties consumed by the stylesheets (`var(--rp-…, fallback)`). */
export function paletteVars(p: RecipePalette): CSSProperties {
  const vars: Record<string, string> = {
    '--rp-primary': p.primary,
    '--rp-primary-hover': p.primaryHover,
    '--rp-secondary': p.secondary,
    '--rp-heading': p.heading,
    '--rp-accent-ink': p.accentInk,
    '--rp-support': p.support,
    '--rp-support-tint': p.supportTint,
    '--rp-support-ink': p.supportInk,
    '--rp-botanical': p.botanical,
    '--rp-botanical-ink': p.botanicalInk,
    '--rp-botanical-tint': p.botanicalTint,
    '--rp-bg': p.bg,
    '--rp-bg-2': p.bg2,
    '--rp-surface': p.surface,
    '--rp-ink': p.ink,
    '--rp-on-primary': p.onPrimary,
    '--rp-line': p.line,
    '--rp-line-strong': p.lineStrong,
    '--rp-shadow-sm': p.shadowSm,
    '--rp-shadow': p.shadow,
    '--rp-shadow-lg': p.shadowLg,
  };
  return vars as CSSProperties;
}
