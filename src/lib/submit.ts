/**
 * Form submission with an honest unavailable state.
 * The endpoint comes from VITE_FORMS_ENDPOINT. In `vite dev` it is a local dev handler
 * (see vite.config.ts). In production it must be a real, authenticated backend / form service.
 * No success message is ever shown unless the server confirmed receipt.
 */
export type FormKind =
  | 'event-enquiry'
  | 'community-request'
  | 'launch-updates'
  | 'future-range-interest'
  | 'reservation-request';

export type SubmitResult =
  | { ok: true; id: string | null }
  | { ok: false; reason: 'unavailable' | 'spam' | 'network' | 'server' | 'invalid' };

export interface SubmitMeta {
  /** performance.now() when the form mounted — too-fast submissions are treated as spam. */
  startedAt: number;
  /** Hidden honeypot field value — must be empty. */
  honeypot: string;
  /** Optional Turnstile token when the site key is configured. */
  turnstileToken?: string | null;
}

export const MIN_FILL_MS = 2500;
const TIMEOUT_MS = 15000;

export function getFormsEndpoint(): string | null {
  const e = (import.meta.env.VITE_FORMS_ENDPOINT as string | undefined)?.trim();
  return e ? e : null;
}

export function isSubmissionAvailable(): boolean {
  return getFormsEndpoint() !== null;
}

export function getTurnstileSiteKey(): string | null {
  const k = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined)?.trim();
  return k ? k : null;
}

export async function submitForm(kind: FormKind, payload: Record<string, unknown>, meta: SubmitMeta, now: number = performance.now()): Promise<SubmitResult> {
  const endpoint = getFormsEndpoint();
  if (!endpoint) return { ok: false, reason: 'unavailable' };
  if (meta.honeypot.trim() !== '' || now - meta.startedAt < MIN_FILL_MS) return { ok: false, reason: 'spam' };
  if (getTurnstileSiteKey() && !meta.turnstileToken) return { ok: false, reason: 'invalid' };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ kind, submittedAt: new Date().toISOString(), turnstileToken: meta.turnstileToken ?? null, ...payload }),
      signal: controller.signal,
    });
    if (!res.ok) return { ok: false, reason: res.status >= 500 ? 'server' : 'invalid' };
    let id: string | null = null;
    try {
      const data = (await res.json()) as { ok?: boolean; id?: string };
      if (data.ok === false) return { ok: false, reason: 'server' };
      id = typeof data.id === 'string' ? data.id : null;
    } catch {
      /* non-JSON 2xx is still a confirmed receipt */
    }
    return { ok: true, id };
  } catch {
    return { ok: false, reason: 'network' };
  } finally {
    clearTimeout(timer);
  }
}
