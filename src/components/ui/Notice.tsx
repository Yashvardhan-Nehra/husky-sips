import type { ReactNode } from 'react';
import { Icon } from './Icon';

export function Notice({ variant = 'default', children }: { variant?: 'default' | 'info' | 'warn' | 'neutral'; children: ReactNode }) {
  return (
    <div className={['notice', variant !== 'default' ? `notice--${variant}` : ''].filter(Boolean).join(' ')}>
      <Icon name="info" className="notice__icon" />
      <div>{children}</div>
    </div>
  );
}
