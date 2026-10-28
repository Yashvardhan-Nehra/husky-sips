import { siteConfig } from './site.config';
import type { Base, ClaimControl, Extra, Fruit, PopUp, Recipe, ReviewStatus } from './types';

/* ---------- Draft visibility ---------- */

export function draftsVisible(): boolean {
  const flag = siteConfig.flags.previewDrafts;
  if (flag === true) return true;
  if (flag === 'dev' && import.meta.env.DEV) return true;
  return import.meta.env.VITE_PREVIEW_DRAFTS === 'true';
}

export function isVisible(status: ReviewStatus): boolean {
  return status === 'approved' || draftsVisible();
}

/* ---------- Catalog ---------- */

export function getBase(id: string): Base | undefined {
  return siteConfig.catalog.bases.find((b) => b.id === id);
}
export function getFruit(id: string): Fruit | undefined {
  return siteConfig.catalog.fruits.find((f) => f.id === id);
}
export function getExtra(id: string | null): Extra | undefined {
  return id ? siteConfig.catalog.extras.find((e) => e.id === id) : undefined;
}
export function getVisibleBases(): Base[] {
  return siteConfig.catalog.bases.filter((b) => isVisible(b.status));
}
export function getVisibleFruits(): Fruit[] {
  return siteConfig.catalog.fruits.filter((f) => isVisible(f.status));
}
export function getVisibleExtras(): Extra[] {
  return siteConfig.catalog.extras.filter((e) => isVisible(e.status));
}

/* ---------- Recipes & collections ---------- */

export function getActiveCollection() {
  return siteConfig.collections.find((c) => c.id === siteConfig.activeCollectionId) ?? null;
}

export function getVisibleRecipes(): Recipe[] {
  const collection = getActiveCollection();
  const ids = collection?.recipeIds ?? [];
  return ids
    .map((id) => siteConfig.recipes.find((r) => r.id === id))
    .filter((r): r is Recipe => !!r && isVisible(r.status));
}

export function getRecipe(id: string): Recipe | undefined {
  return siteConfig.recipes.find((r) => r.id === id);
}

/** The single recipe featured in the hero and the assembly animation. */
export function getFeaturedRecipe(): Recipe | null {
  return getVisibleRecipes()[0] ?? null;
}

export function getRecipeFruits(recipe: Recipe): Fruit[] {
  return recipe.fruitIds.map(getFruit).filter((f): f is Fruit => !!f);
}

/* ---------- Claims ---------- */

export function getEnabledClaims(): ClaimControl[] {
  return siteConfig.claims.filter((c) => c.enabled && c.approvedOn !== null);
}

/* ---------- Pop-ups ---------- */

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Confirmed events today or later (date unknown = still listed, flagged in UI). */
export function getUpcomingPopUps(now: string = todayIso()): PopUp[] {
  return siteConfig.popUps
    .filter((p) => p.status === 'confirmed' && (p.date === null || p.date >= now))
    .sort((a, b) => (a.date ?? '9999').localeCompare(b.date ?? '9999'));
}

export function hasConfirmedPopUp(): boolean {
  return getUpcomingPopUps().length > 0;
}

/** Preordering is only offered when every operational field is configured. */
export function canPreorder(popUp: PopUp): boolean {
  if (!siteConfig.flags.preorders) return false;
  const p = popUp.preorder;
  if (!p) return false;
  return p.stockAllocated !== null && p.stockAllocated > 0 && p.priceInr !== null && p.cutoff !== null && p.pickupWindow !== null;
}

/* ---------- Calls to action ---------- */

export interface Cta {
  label: string;
  to: string;
}

export function getPrimaryCta(): Cta {
  return hasConfirmedPopUp()
    ? { label: 'Find the next pop-up', to: '/find-us' }
    : { label: 'Get launch updates', to: '/find-us#updates' };
}

export const SECONDARY_CTA: Cta = { label: 'Plan an event', to: '/events' };

export function getAvailabilityStatement(): string {
  if (hasConfirmedPopUp()) return 'Available at selected local pop-ups.';
  return 'Launching at selected local pop-ups. Dates to be announced.';
}

/* ---------- Contact / registration ---------- */

export function hasAnyContact(): boolean {
  const c = siteConfig.contact;
  return !!(c.email || c.phone || c.whatsapp || c.instagram || c.youtube);
}
