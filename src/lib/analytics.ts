/**
 * Lightweight analytics. Events are named for what actually happened —
 * a click is never recorded as a sale.
 */
export const EVENTS = {
  MENU_VIEWED: 'menu_viewed',
  POPUP_SELECTED: 'popup_selected',
  RESERVATION_STARTED: 'reservation_started',
  RESERVATION_COMPLETED: 'reservation_completed', // request received, not a paid sale
  EVENT_ENQUIRY_SUBMITTED: 'event_enquiry_submitted',
  FUTURE_RANGE_INTEREST_SUBMITTED: 'future_range_interest_submitted',
  COMMUNITY_REQUEST_SUBMITTED: 'community_request_submitted',
  UPDATES_SIGNUP_SUBMITTED: 'updates_signup_submitted',
  SAVED_SIP_SHARED: 'saved_sip_shared',
  EPISODE_PLAYED: 'episode_played',
} as const;

export type AnalyticsEvent = (typeof EVENTS)[keyof typeof EVENTS];
export type AnalyticsProps = Record<string, string | number | boolean | null>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT as string | undefined;

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
  const payload = { event, ...props, ts: Date.now(), path: typeof location !== 'undefined' ? location.pathname : '' };
  try {
    if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
      window.dataLayer.push(payload);
    }
    if (endpoint && typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon(endpoint, new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    } else if (endpoint && typeof fetch === 'function') {
      void fetch(endpoint, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => undefined);
    }
    if (import.meta.env.DEV) {
      console.debug('[analytics]', payload);
    }
  } catch {
    /* analytics must never break the page */
  }
}
