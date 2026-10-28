import { useEffect, useId, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getPrimaryCta, SECONDARY_CTA } from '@/config/selectors';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { BrandLogo } from './BrandLogo';

export const MAIN_ROUTES = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Menu' },
  { to: '/find-us', label: 'Find Us' },
  { to: '/events', label: 'Events & Bulk' },
  { to: '/story', label: 'Our Story' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const drawerId = useId();
  const location = useLocation();
  const primary = getPrimaryCta();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="header">
      <div className="container">
        <div className="header__inner">
          <BrandLogo />
          <nav className="nav" aria-label="Main">
            {MAIN_ROUTES.map((r) => (
              <NavLink key={r.to} to={r.to} end={r.end}>
                {r.label}
              </NavLink>
            ))}
          </nav>
          <div className="header__actions">
            <ButtonLink to={SECONDARY_CTA.to} variant="secondary">
              {SECONDARY_CTA.label}
            </ButtonLink>
            <ButtonLink to={primary.to} variant="primary" icon="arrow">
              {primary.label}
            </ButtonLink>
          </div>
          <div className="cluster header__cta-mobile">
            <ButtonLink to={primary.to} variant="primary" size="sm">
              {primary.label}
            </ButtonLink>
            <button type="button" className="header__burger" aria-expanded={open} aria-controls={drawerId} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
              <Icon name={open ? 'close' : 'menu'} />
            </button>
          </div>
        </div>
        {open && (
          <nav className="drawer" id={drawerId} aria-label="Main (mobile)">
            {MAIN_ROUTES.map((r) => (
              <NavLink key={r.to} to={r.to} end={r.end}>
                {r.label}
              </NavLink>
            ))}
            <div className="drawer__actions">
              <ButtonLink to={primary.to} variant="primary" block icon="arrow">
                {primary.label}
              </ButtonLink>
              <ButtonLink to={SECONDARY_CTA.to} variant="secondary" block>
                {SECONDARY_CTA.label}
              </ButtonLink>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
