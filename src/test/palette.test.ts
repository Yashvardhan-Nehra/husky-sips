import { describe, expect, it } from 'vitest';
import {
  BRAND_INGREDIENT_PALETTE,
  INGREDIENT_ALIASES,
  INGREDIENT_PALETTES,
  RECIPE_NEUTRALS,
  RECIPE_PALETTES,
  WCAG_AA_TEXT,
  contrastRatio,
  derivePalette,
  getIngredientPalette,
  getRecipePalette,
  hexToRgb,
  paletteVars,
  resolveIngredientKey,
  rgba,
} from '@/config/palette';
import { siteConfig } from '@/config/site.config';

const CREAM = '#f7f4e9';

describe('colour maths', () => {
  it('parses hex and builds rgba', () => {
    expect(hexToRgb('#8f2038')).toEqual([143, 32, 56]);
    expect(hexToRgb('#fff')).toEqual([255, 255, 255]);
    expect(rgba('#8f2038', 0.2)).toBe('rgba(143, 32, 56, 0.2)');
  });
  it('computes WCAG contrast symmetrically', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1);
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 1);
    expect(contrastRatio('#142b21', CREAM)).toBeGreaterThan(13);
  });
});

describe('ingredient palettes meet WCAG AA where they carry text', () => {
  for (const [key, p] of Object.entries(INGREDIENT_PALETTES)) {
    it(`${key}: primary/hover take warm-white text, ink reads on cream, tint and surface`, () => {
      expect(contrastRatio(RECIPE_NEUTRALS.onPrimary, p.primary)).toBeGreaterThanOrEqual(WCAG_AA_TEXT);
      expect(contrastRatio(RECIPE_NEUTRALS.onPrimary, p.primaryHover)).toBeGreaterThanOrEqual(WCAG_AA_TEXT);
      expect(contrastRatio(p.ink, CREAM)).toBeGreaterThanOrEqual(WCAG_AA_TEXT);
      expect(contrastRatio(p.ink, p.tint)).toBeGreaterThanOrEqual(WCAG_AA_TEXT);
      expect(contrastRatio(p.ink, RECIPE_NEUTRALS.surface)).toBeGreaterThanOrEqual(WCAG_AA_TEXT);
      expect(contrastRatio(RECIPE_NEUTRALS.ink, p.tint)).toBeGreaterThanOrEqual(WCAG_AA_TEXT);
      expect(p.weight).toBeGreaterThanOrEqual(0);
      expect(p.weight).toBeLessThanOrEqual(100);
    });
  }
  it('every alias points at a real palette', () => {
    for (const target of Object.values(INGREDIENT_ALIASES)) expect(INGREDIENT_PALETTES[target]).toBeDefined();
  });
  it('resolves ids, aliases and unknowns', () => {
    expect(resolveIngredientKey('watermelon')).toBe('watermelon');
    expect(resolveIngredientKey('Indian-Gooseberry')).toBe('amla');
    expect(resolveIngredientKey('dragonfruit')).toBeNull();
    expect(resolveIngredientKey(null)).toBeNull();
    expect(getIngredientPalette('beet').primary).toBe(INGREDIENT_PALETTES.beetroot!.primary);
    expect(getIngredientPalette('unknown')).toBe(BRAND_INGREDIENT_PALETTE);
  });
});

describe('derivePalette', () => {
  it('lets the strongest pigment lead and uses a leafy ingredient as the botanical accent', () => {
    const p = derivePalette(['kiwi', 'watermelon']);
    expect(p.sources).toEqual(['watermelon', 'kiwi']);
    expect(p.primary).toBe(INGREDIENT_PALETTES.watermelon!.primary);
    expect(p.support).toBe(INGREDIENT_PALETTES.kiwi!.secondary);
    expect(p.botanical).toBe(INGREDIENT_PALETTES.kiwi!.primary);
    expect(p.botanicalInk).toBe(INGREDIENT_PALETTES.kiwi!.ink);
    expect(p.bg2).toBe(INGREDIENT_PALETTES.watermelon!.tint);
  });
  it('derives the ABC combination as burgundy + carrot + amla without a pinned entry', () => {
    const p = derivePalette(['amla', 'carrot', 'beetroot']);
    expect(p.sources).toEqual(['beetroot', 'carrot', 'amla']);
    expect(p.primary).toBe('#8f2038');
    expect(p.support).toBe('#e88732');
    expect(p.botanical).toBe('#567a43');
  });
  it('falls back to the brand palette for unknown or empty ingredients', () => {
    expect(derivePalette([]).primary).toBe(BRAND_INGREDIENT_PALETTE.primary);
    expect(derivePalette(['dragonfruit', null, undefined]).sources).toEqual([]);
  });
  it('uses the ink shade for headings when the primary is too light on cream', () => {
    for (const [key, ing] of Object.entries(INGREDIENT_PALETTES)) {
      const p = derivePalette([key]);
      expect(contrastRatio(p.heading, p.bg)).toBeGreaterThanOrEqual(WCAG_AA_TEXT);
      if (contrastRatio(ing.primary, p.bg) < WCAG_AA_TEXT) expect(p.heading).toBe(ing.ink);
    }
  });
  it('uses the dominant leaf when no secondary ingredient is leafy', () => {
    const p = derivePalette(['carrot', 'orange']);
    expect(p.botanical).toBe(INGREDIENT_PALETTES.carrot!.leaf);
    expect(p.botanicalInk).toBe(RECIPE_NEUTRALS.leafInk);
  });
  it('ignores order and duplicates', () => {
    expect(derivePalette(['kiwi', 'watermelon', 'kiwi'])).toEqual(derivePalette(['watermelon', 'kiwi']));
  });
});

describe('getRecipePalette', () => {
  it('derives from the configured recipe ingredients', () => {
    const recipe = siteConfig.recipes[0]!;
    const p = getRecipePalette(recipe);
    expect(p).toEqual(derivePalette([...recipe.fruitIds, recipe.extraId]));
  });
  it('applies the pinned ABC Juice palette exactly as specified', () => {
    const p = getRecipePalette({ id: 'abc-juice', fruitIds: ['amla', 'beetroot', 'carrot'], extraId: null });
    expect(p.primary).toBe('#8f2038');
    expect(p.secondary).toBe('#b83250');
    expect(p.support).toBe('#e88732');
    expect(p.botanical).toBe('#567a43');
    expect(p.bg).toBe('#f8f1e4');
    expect(p.bg2).toBe('#f1dde0');
    expect(p.ink).toBe('#25231f');
    expect(p.onPrimary).toBe('#fffdf7');
    expect(p.line).toBe(rgba('#8f2038', 0.2));
    expect(p.shadow).toContain(rgba('#8f2038', 0.12));
    expect(RECIPE_PALETTES['abc-juice']!.ingredients).toContain('beetroot');
  });
  it('a pinned palette with an unknown recipe id falls back to derivation', () => {
    const p = getRecipePalette({ id: 'not-pinned', fruitIds: ['lemon', 'ginger'], extraId: 'mint' });
    expect(p.sources).toEqual(['lemon', 'ginger', 'mint']);
    expect(p.botanical).toBe(INGREDIENT_PALETTES.mint!.primary);
  });
});

describe('paletteVars', () => {
  it('exposes every palette channel as an --rp-* custom property', () => {
    const vars = paletteVars(derivePalette(['beetroot'])) as Record<string, string>;
    const keys = Object.keys(vars);
    expect(keys.length).toBeGreaterThanOrEqual(20);
    expect(keys.every((k) => k.startsWith('--rp-'))).toBe(true);
    expect(vars['--rp-primary']).toBe('#8f2038');
    expect(vars['--rp-on-primary']).toBe('#fffdf7');
    expect(vars['--rp-shadow-lg']).toContain('rgba(143, 32, 56');
  });
});
