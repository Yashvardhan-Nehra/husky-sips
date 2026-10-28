import { useEffect, useRef, useState } from 'react';
import { getTurnstileSiteKey } from '@/lib/submit';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (token: string) => void; 'expired-callback'?: () => void; 'error-callback'?: () => void; theme?: string; size?: string }) => string;
      reset: (id?: string) => void;
    };
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/**
 * Optional Cloudflare Turnstile. Only active when VITE_TURNSTILE_SITE_KEY is set; the widget
 * loads lazily the first time a form is focused. Returns the token (or null) and a container ref.
 */
export function useTurnstile(active: boolean) {
  const siteKey = getTurnstileSiteKey();
  const containerRef = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState<string | null>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey || !active || !containerRef.current || widgetId.current) return;
    const el = containerRef.current;
    const render = () => {
      if (!window.turnstile || widgetId.current) return;
      widgetId.current = window.turnstile.render(el, {
        sitekey: siteKey,
        callback: (t) => setToken(t),
        'expired-callback': () => setToken(null),
        'error-callback': () => setToken(null),
        theme: 'light',
      });
    };
    if (window.turnstile) {
      render();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    const script = existing ?? document.createElement('script');
    if (!existing) {
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', render);
    return () => script.removeEventListener('load', render);
  }, [siteKey, active]);

  const reset = () => {
    if (window.turnstile && widgetId.current) window.turnstile.reset(widgetId.current);
    setToken(null);
  };

  return { enabled: !!siteKey, containerRef, token, reset };
}
