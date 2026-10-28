import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon, type IconName } from './Icon';

type Variant = 'primary' | 'secondary' | 'accent' | 'citrus' | 'ghost' | 'on-forest' | 'on-forest-secondary';
type Size = 'sm' | 'md' | 'lg';

function cls(variant: Variant, size: Size, block: boolean | undefined, extra?: string) {
  return ['btn', `btn--${variant}`, size !== 'md' ? `btn--${size}` : '', block ? 'btn--block' : '', extra ?? ''].filter(Boolean).join(' ');
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  icon?: IconName;
  iconPosition?: 'start' | 'end';
  className?: string;
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', block, icon, iconPosition = 'end', className, children, ...rest }: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={cls(variant, size, block, className)} {...rest}>
      {icon && iconPosition === 'start' && <Icon name={icon} className="btn__icon" />}
      {children}
      {icon && iconPosition === 'end' && <Icon name={icon} className="btn__icon" />}
    </button>
  );
}

interface LinkProps extends CommonProps {
  to: string;
  external?: boolean;
  'aria-label'?: string;
}

export function ButtonLink({ to, external, variant = 'primary', size = 'md', block, icon, iconPosition = 'end', className, children, ...rest }: LinkProps) {
  const inner = (
    <>
      {icon && iconPosition === 'start' && <Icon name={icon} className="btn__icon" />}
      {children}
      {icon && iconPosition === 'end' && <Icon name={icon} className="btn__icon" />}
    </>
  );
  if (external) {
    return (
      <a href={to} className={cls(variant, size, block, className)} target="_blank" rel="noopener noreferrer" {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={to} className={cls(variant, size, block, className)} {...rest}>
      {inner}
    </Link>
  );
}
