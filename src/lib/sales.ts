import type { SalesRecord } from '@/config/types';

export interface LocationTotal {
  key: string;
  locationName: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  units: number;
  lastUpdated: string;
}

export type SalesSummary =
  | { status: 'untracked' }
  | { status: 'none'; total: 0; byLocation: [] }
  | { status: 'ok'; total: number; byLocation: LocationTotal[] };

/** Net paid units for one record: fulfilled minus refunded, never below zero. Unverified = 0. */
export function netUnits(r: SalesRecord): number {
  if (!r.verified) return 0;
  return Math.max(0, Math.floor(r.fulfilledUnits) - Math.floor(r.refundedUnits));
}

/**
 * Counts only verified, fulfilled, paid units; subtracts refunds; bulk orders count once by
 * fulfilled quantity. Free samples, test batches and cancelled orders are never recorded here.
 * `records === null` means tracking is not set up — reported as 'untracked', not as zero.
 */
export function summarizeSales(records: SalesRecord[] | null): SalesSummary {
  if (records === null) return { status: 'untracked' };
  const map = new Map<string, LocationTotal>();
  let total = 0;
  for (const r of records) {
    const units = netUnits(r);
    if (units === 0) continue;
    total += units;
    const key = `${r.locationName}|${r.city}`;
    const existing = map.get(key);
    if (existing) {
      existing.units += units;
      if (r.lastUpdated > existing.lastUpdated) existing.lastUpdated = r.lastUpdated;
    } else {
      map.set(key, { key, locationName: r.locationName, city: r.city, state: r.state, lat: r.lat, lng: r.lng, units, lastUpdated: r.lastUpdated });
    }
  }
  if (total === 0) return { status: 'none', total: 0, byLocation: [] };
  return { status: 'ok', total, byLocation: [...map.values()].sort((a, b) => b.units - a.units) };
}

export function progressPercent(total: number, target: number): number {
  if (target <= 0) return 0;
  return Math.max(0, Math.min(100, (total / target) * 100));
}
