import { describe, expect, it } from 'vitest';
import { netUnits, progressPercent, summarizeSales } from '@/lib/sales';
import type { SalesRecord } from '@/config/types';

const rec = (over: Partial<SalesRecord> = {}): SalesRecord => ({
  id: 'r1',
  locationName: 'Sunday Market',
  city: 'Bengaluru',
  state: 'Karnataka',
  lat: 12.97,
  lng: 77.59,
  date: '2026-11-15',
  kind: 'pop-up',
  fulfilledUnits: 40,
  refundedUnits: 2,
  verified: true,
  lastUpdated: '2026-11-16',
  ...over,
});

describe('netUnits', () => {
  it('subtracts refunds from fulfilled units', () => {
    expect(netUnits(rec())).toBe(38);
  });
  it('never goes negative', () => {
    expect(netUnits(rec({ fulfilledUnits: 1, refundedUnits: 5 }))).toBe(0);
  });
  it('ignores unverified records', () => {
    expect(netUnits(rec({ verified: false }))).toBe(0);
  });
});

describe('summarizeSales', () => {
  it('reports untracked when records are null (not zero)', () => {
    expect(summarizeSales(null)).toEqual({ status: 'untracked' });
  });
  it('reports none for an empty, tracked list', () => {
    expect(summarizeSales([])).toEqual({ status: 'none', total: 0, byLocation: [] });
  });
  it('groups by location and counts bulk once by fulfilled quantity', () => {
    const s = summarizeSales([rec(), rec({ id: 'r2', fulfilledUnits: 10, refundedUnits: 0, lastUpdated: '2026-11-20' }), rec({ id: 'b1', kind: 'bulk', locationName: 'Office offsite', city: 'Pune', state: 'Maharashtra', fulfilledUnits: 120, refundedUnits: 0 })]);
    expect(s.status).toBe('ok');
    if (s.status !== 'ok') return;
    expect(s.total).toBe(38 + 10 + 120);
    expect(s.byLocation[0]?.locationName).toBe('Office offsite');
    expect(s.byLocation[1]?.units).toBe(48);
    expect(s.byLocation[1]?.lastUpdated).toBe('2026-11-20');
  });
  it('treats fully refunded or unverified records as no sales', () => {
    expect(summarizeSales([rec({ verified: false }), rec({ fulfilledUnits: 3, refundedUnits: 3 })])).toEqual({ status: 'none', total: 0, byLocation: [] });
  });
});

describe('progressPercent', () => {
  it('clamps between 0 and 100', () => {
    expect(progressPercent(0, 1000)).toBe(0);
    expect(progressPercent(500, 1000)).toBe(50);
    expect(progressPercent(5000, 1000)).toBe(100);
    expect(progressPercent(10, 0)).toBe(0);
  });
});
