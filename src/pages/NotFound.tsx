import { usePageMeta } from '@/lib/hooks';
import { ButtonLink } from '@/components/ui/Button';
import { Mascot } from '@/components/ui/Mascot';

export default function NotFound() {
  usePageMeta('Page not found');
  return (
    <section className="not-found">
      <div className="container stack">
        <Mascot size="lg" label="Lost puppy" />
        <h1>That page wandered off.</h1>
        <p className="lead" style={{ marginInline: 'auto' }}>
          Let’s get you back to something refreshing.
        </p>
        <div className="cluster" style={{ justifyContent: 'center' }}>
          <ButtonLink to="/" icon="arrow">
            Back home
          </ButtonLink>
          <ButtonLink to="/menu" variant="secondary">
            See the menu
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
