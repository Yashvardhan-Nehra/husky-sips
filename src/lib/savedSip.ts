import { siteConfig } from '@/config/site.config';

export interface SipSelection {
  baseId: string;
  fruitIds: string[];
  extraId: string | null;
}

const SEP = '.';
const LIST_SEP = '+';
const NONE = '-';
const ID_RE = /^[a-z0-9-]+$/;

/** Encodes a selection as a short URL-safe string: base.fruit1+fruit2.extra  (extra "-" = none). */
export function encodeSip(sel: SipSelection): string {
  return [sel.baseId, sel.fruitIds.join(LIST_SEP) || NONE, sel.extraId ?? NONE].join(SEP);
}

/** Decodes and validates against the catalog; unknown ids are dropped, invalid input → null. */
export function decodeSip(code: string | null | undefined): SipSelection | null {
  if (!code) return null;
  const parts = code.split(SEP);
  if (parts.length !== 3) return null;
  const [baseId = '', fruitsPart = '', extraPart = ''] = parts;
  if (!ID_RE.test(baseId) || !siteConfig.catalog.bases.some((b) => b.id === baseId)) return null;
  const fruitIds = fruitsPart === NONE ? [] : fruitsPart.split(LIST_SEP).filter((id) => ID_RE.test(id) && siteConfig.catalog.fruits.some((f) => f.id === id));
  const unique = [...new Set(fruitIds)].slice(0, siteConfig.catalog.portions.maxFruits);
  const extraId = extraPart === NONE ? null : siteConfig.catalog.extras.some((e) => e.id === extraPart) ? extraPart : null;
  return { baseId, fruitIds: unique, extraId };
}

export function buildShareUrl(sel: SipSelection, origin: string): string {
  const base = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim() || origin;
  return `${base.replace(/\/$/, '')}/menu?sip=${encodeURIComponent(encodeSip(sel))}`;
}
