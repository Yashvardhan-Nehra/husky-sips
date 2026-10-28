import { siteConfig } from '@/config/site.config';

type Size = 'sm' | 'md' | 'lg';

/**
 * Small brand character for loading, empty and confirmation states.
 * Renders the supplied puppy once `brand.mascot` is set; until then a neutral paw placeholder
 * (deliberately NOT a redrawn puppy). Never shown handling food.
 */
export function Mascot({ size = 'md', bounce = false, label }: { size?: Size; bounce?: boolean; label?: string }) {
  const m = siteConfig.brand.mascot;
  const className = ['mascot', size !== 'md' ? `mascot--${size}` : '', bounce ? 'mascot--bounce' : ''].filter(Boolean).join(' ');
  if (m) {
    return (
      <span className={className}>
        <img src={m.src} width={m.width} height={m.height} alt={label ?? 'HuskySips puppy'} loading="lazy" />
      </span>
    );
  }
  return (
    <span className={className} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <svg viewBox="0 0 48 48" fill="currentColor" focusable="false">
        <ellipse cx="24" cy="31" rx="10" ry="8.5" />
        <circle cx="12" cy="20" r="4.2" />
        <circle cx="19.5" cy="13" r="4.2" />
        <circle cx="28.5" cy="13" r="4.2" />
        <circle cx="36" cy="20" r="4.2" />
      </svg>
    </span>
  );
}
