import type { ReactNode } from 'react';
import { Mascot } from './Mascot';

export function EmptyState({ title, body, children, mascot = true }: { title: string; body?: ReactNode; children?: ReactNode; mascot?: boolean }) {
  return (
    <div className="empty-state" role="status">
      {mascot && <Mascot />}
      <h3>{title}</h3>
      {body && <p>{body}</p>}
      {children && <div className="empty-state__actions cluster">{children}</div>}
    </div>
  );
}

export function LoadingState({ label = 'Pouring…' }: { label?: string }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <Mascot bounce label="Loading" />
      <span>{label}</span>
    </div>
  );
}
