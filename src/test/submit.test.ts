import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MIN_FILL_MS, submitForm } from '@/lib/submit';

describe('submitForm', () => {
  const meta = { startedAt: 0, honeypot: '' };

  beforeEach(() => {
    vi.stubEnv('VITE_FORMS_ENDPOINT', 'https://forms.example/submit');
    vi.stubEnv('VITE_TURNSTILE_SITE_KEY', '');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('reports unavailable when no endpoint is configured', async () => {
    vi.stubEnv('VITE_FORMS_ENDPOINT', '');
    expect(await submitForm('launch-updates', {}, meta, MIN_FILL_MS + 1)).toEqual({ ok: false, reason: 'unavailable' });
  });

  it('rejects honeypot and too-fast submissions as spam without calling the network', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    expect(await submitForm('launch-updates', {}, { ...meta, honeypot: 'bot' }, MIN_FILL_MS + 1)).toEqual({ ok: false, reason: 'spam' });
    expect(await submitForm('launch-updates', {}, meta, 10)).toEqual({ ok: false, reason: 'spam' });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('returns ok with the server id on 2xx', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ ok: true, id: 'abc123' }), { status: 200 }));
    expect(await submitForm('event-enquiry', { name: 'A' }, meta, MIN_FILL_MS + 1)).toEqual({ ok: true, id: 'abc123' });
  });

  it('maps 5xx to server and 4xx to invalid', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 503 }));
    expect(await submitForm('event-enquiry', {}, meta, MIN_FILL_MS + 1)).toEqual({ ok: false, reason: 'server' });
    spy.mockResolvedValue(new Response('', { status: 422 }));
    expect(await submitForm('event-enquiry', {}, meta, MIN_FILL_MS + 1)).toEqual({ ok: false, reason: 'invalid' });
  });

  it('never reports success when the server says ok:false', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ ok: false }), { status: 200 }));
    expect(await submitForm('event-enquiry', {}, meta, MIN_FILL_MS + 1)).toEqual({ ok: false, reason: 'server' });
  });

  it('reports network errors', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('offline'));
    expect(await submitForm('event-enquiry', {}, meta, MIN_FILL_MS + 1)).toEqual({ ok: false, reason: 'network' });
  });
});
