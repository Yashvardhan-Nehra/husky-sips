import { describe, expect, it } from 'vitest';
import { decodeSip, encodeSip } from '@/lib/savedSip';

describe('saved sip encoding', () => {
  it('round-trips a selection', () => {
    const sel = { baseId: 'signature-base', fruitIds: ['watermelon', 'kiwi'], extraId: null };
    expect(decodeSip(encodeSip(sel))).toEqual(sel);
  });
  it('drops unknown fruit ids and caps at the portion limit', () => {
    expect(decodeSip('signature-base.watermelon+dragonfruit+kiwi+orange.-')).toEqual({ baseId: 'signature-base', fruitIds: ['watermelon', 'kiwi'], extraId: null });
  });
  it('rejects unknown bases and malformed codes', () => {
    expect(decodeSip('nope.watermelon.-')).toBeNull();
    expect(decodeSip('garbage')).toBeNull();
    expect(decodeSip('')).toBeNull();
    expect(decodeSip('<script>.x.y')).toBeNull();
  });
  it('keeps a known extra and nulls an unknown one', () => {
    expect(decodeSip('signature-base.-.mint')?.extraId).toBe('mint');
    expect(decodeSip('signature-base.-.glitter')?.extraId).toBeNull();
  });
});
