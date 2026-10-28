import { describe, expect, it } from 'vitest';
import { project } from '@/components/map/IndiaMap';
import { INDIA_VIEWBOX } from '@/data/india-map';

describe('map projection', () => {
  it('places well-known cities inside the viewBox in the right relative positions', () => {
    const delhi = project(28.6139, 77.209);
    const mumbai = project(19.076, 72.8777);
    const chennai = project(13.0827, 80.2707);
    const kolkata = project(22.5726, 88.3639);
    for (const p of [delhi, mumbai, chennai, kolkata]) {
      expect(p.x).toBeGreaterThan(0);
      expect(p.x).toBeLessThan(INDIA_VIEWBOX.width);
      expect(p.y).toBeGreaterThan(0);
      expect(p.y).toBeLessThan(INDIA_VIEWBOX.height);
    }
    expect(delhi.y).toBeLessThan(mumbai.y); // north is up
    expect(mumbai.x).toBeLessThan(kolkata.x); // west is left
    expect(chennai.y).toBeGreaterThan(kolkata.y); // Chennai is further south
  });
});
