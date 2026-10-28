import type { ReactNode } from 'react';

type Variant = 'neutral' | 'draft' | 'info' | 'success' | 'warn' | 'citrus' | 'outline';

export function Badge({ variant = 'neutral', dot, children, title }: { variant?: Variant; dot?: boolean; children: ReactNode; title?: string }) {
  return (
    <span className={['badge', variant !== 'neutral' ? `badge--${variant}` : '', dot ? 'badge--dot' : ''].filter(Boolean).join(' ')} title={title}>
      {children}
    </span>
  );
}

/** Shown on anything that is still awaiting approval; only visible when drafts are previewed. */
export function DraftBadge({ what = 'content' }: { what?: string }) {
  return (
    <Badge variant="draft" title={`This ${what} is a draft awaiting approval and is hidden in production.`}>
      Draft · awaiting approval
    </Badge>
  );
}

export function IllustrativeBadge() {
  return (
    <Badge variant="outline" title="Design reference, not a photograph of the purchasable product.">
      Illustrative
    </Badge>
  );
}
