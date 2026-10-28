import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { draftsVisible } from '@/config/selectors';
import { useScrollManager } from '@/lib/hooks';
import { LoadingState } from '@/components/ui/EmptyState';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
  useScrollManager();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<LoadingState />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      {draftsVisible() && (
        <div className="dev-ribbon" aria-hidden="true">
          Preview: draft content visible
        </div>
      )}
    </>
  );
}
