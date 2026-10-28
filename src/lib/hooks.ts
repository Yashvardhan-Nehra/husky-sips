import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function useMediaQuery(query: string): boolean {
  const get = () => (typeof window !== 'undefined' && 'matchMedia' in window ? window.matchMedia(query).matches : false);
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}

const BASE_TITLE = 'HuskySips';

export function usePageMeta(title: string, description?: string): void {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE_TITLE}` : `${BASE_TITLE} — Sip the drink. Eat the fruit.`;
    if (description) {
      let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = 'description';
        document.head.appendChild(tag);
      }
      tag.content = description;
    }
  }, [title, description]);
}

/** Scroll to top on route change, or to the hash target when present. */
export function useScrollManager(): void {
  const { pathname, hash } = useLocation();
  const last = useRef<string>('');
  useEffect(() => {
    const key = pathname + hash;
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ block: 'start' });
        if (el instanceof HTMLElement) el.focus({ preventScroll: true });
        last.current = key;
        return;
      }
    }
    if (last.current.split('#')[0] !== pathname) window.scrollTo({ top: 0 });
    last.current = key;
  }, [pathname, hash]);
}

/** Tracks whether a form has been on screen long enough to be filled by a human. */
export function useFormTiming() {
  const startedAt = useRef<number>(0);
  useEffect(() => {
    startedAt.current = performance.now();
  }, []);
  return startedAt;
}
