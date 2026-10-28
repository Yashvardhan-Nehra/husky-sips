import type { HTMLAttributes, ReactNode } from 'react';

interface Props extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  tone?: 'default' | 'forest' | 'leaf';
  tight?: boolean;
  center?: boolean;
  children: ReactNode;
  as?: 'section' | 'div';
}

export function Section({ eyebrow, title, intro, tone = 'default', tight, center, children, className, as: Tag = 'section', ...rest }: Props) {
  const classes = ['section', tone !== 'default' ? `section--${tone}` : '', tight ? 'section--tight' : '', className ?? ''].filter(Boolean).join(' ');
  return (
    <Tag className={classes} {...rest}>
      <div className="container">
        {(eyebrow || title || intro) && (
          <div className={['section-head', center ? 'section-head--center' : ''].join(' ').trim()}>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {title && <h2>{title}</h2>}
            {intro && <p className="lead">{intro}</p>}
          </div>
        )}
        {children}
      </div>
    </Tag>
  );
}
