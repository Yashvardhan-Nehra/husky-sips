import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { siteConfig } from '@/config/site.config';
import { canPreorder, getAvailabilityStatement, getPrimaryCta, getUpcomingPopUps, getVisibleRecipes, draftsVisible } from '@/config/selectors';
import type { PopUp } from '@/config/types';

const popUp = (over: Partial<PopUp> = {}): PopUp => ({
  id: 'p1',
  name: 'Sunday Market',
  venue: 'Park',
  city: 'Bengaluru',
  state: 'Karnataka',
  lat: 12.97,
  lng: 77.59,
  status: 'confirmed',
  date: '2999-01-01',
  window: { start: '10:00', end: '14:00' },
  menuRecipeIds: ['watermelon-kiwi'],
  preorder: null,
  note: null,
  lastUpdated: '2026-11-01',
  ...over,
});

describe('selectors', () => {
  const originalPopUps = siteConfig.popUps;
  const originalFlags = { ...siteConfig.flags };
  beforeEach(() => {
    siteConfig.popUps = [];
  });
  afterEach(() => {
    siteConfig.popUps = originalPopUps;
    siteConfig.flags = { ...originalFlags };
    vi.unstubAllEnvs();
  });

  it('switches the primary CTA when no pop-up is confirmed', () => {
    expect(getPrimaryCta().label).toBe('Get launch updates');
    siteConfig.popUps = [popUp()];
    expect(getPrimaryCta().label).toBe('Find the next pop-up');
  });

  it('ignores past, tentative and cancelled events', () => {
    siteConfig.popUps = [popUp({ date: '2000-01-01' }), popUp({ id: 'p2', status: 'tentative' }), popUp({ id: 'p3', status: 'cancelled' })];
    expect(getUpcomingPopUps()).toHaveLength(0);
    expect(getAvailabilityStatement()).toMatch(/to be announced/i);
  });

  it('only allows preorders when every operational field is configured', () => {
    siteConfig.flags.preorders = true;
    expect(canPreorder(popUp())).toBe(false);
    expect(canPreorder(popUp({ preorder: { stockAllocated: 50, priceInr: 150, cutoff: '2999-01-01T00:00:00', pickupWindow: { start: '10:00', end: '12:00' } } }))).toBe(true);
    expect(canPreorder(popUp({ preorder: { stockAllocated: 50, priceInr: null, cutoff: '2999-01-01T00:00:00', pickupWindow: { start: '10:00', end: '12:00' } } }))).toBe(false);
    siteConfig.flags.preorders = false;
    expect(canPreorder(popUp({ preorder: { stockAllocated: 50, priceInr: 150, cutoff: '2999-01-01T00:00:00', pickupWindow: { start: '10:00', end: '12:00' } } }))).toBe(false);
  });

  it('hides draft recipes unless drafts are previewed', () => {
    siteConfig.flags.previewDrafts = false;
    vi.stubEnv('VITE_PREVIEW_DRAFTS', 'false');
    expect(draftsVisible()).toBe(false);
    expect(getVisibleRecipes()).toHaveLength(0);
    vi.stubEnv('VITE_PREVIEW_DRAFTS', 'true');
    expect(getVisibleRecipes().length).toBeGreaterThan(0);
  });
});
