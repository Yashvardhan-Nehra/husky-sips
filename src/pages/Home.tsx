import { lazy, Suspense } from 'react';
import { siteConfig } from '@/config/site.config';
import { getAvailabilityStatement, getFeaturedRecipe, getPrimaryCta, getRecipeFruits, getUpcomingPopUps, SECONDARY_CTA } from '@/config/selectors';
import { usePageMeta, useReducedMotion } from '@/lib/hooks';
import { ButtonLink } from '@/components/ui/Button';
import { Picture } from '@/components/ui/Picture';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge, DraftBadge } from '@/components/ui/Badge';
import { draftsVisible } from '@/config/selectors';
import { StaticAssembly } from '@/components/stage/StaticAssembly';
import { ProductCard } from '@/components/product/ProductCard';
import { ProgressTracker } from '@/components/story/ProgressTracker';
import { UpdatesForm } from '@/components/forms/UpdatesForm';
import { formatDate } from '@/lib/format';

const AssemblyScroll = lazy(() => import('@/components/stage/AssemblyScroll'));

export default function Home() {
  usePageMeta('', siteConfig.brand.description);
  const recipe = getFeaturedRecipe();
  const primary = getPrimaryCta();
  const reduced = useReducedMotion();
  const upcoming = getUpcomingPopUps();
  const heroImage = recipe?.photo ?? recipe?.illustration ?? null;
  const fruits = recipe ? getRecipeFruits(recipe) : [];
  const availabilityLabel = !recipe ? 'Being finalised' : upcoming.length > 0 || siteConfig.pack.availability === 'pop-up' ? 'Available now' : siteConfig.pack.availability === 'sold-out' ? 'Sold out for now' : 'Launching soon';

  return (
    <>
      {/* ---------- First screen: what, what's available, where ---------- */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__grid">
          <div className="hero__copy">
            <span className="eyebrow">Fruit Refreshers · Chilled, with real fruit pieces</span>
            <h1 id="hero-title">{siteConfig.brand.tagline}</h1>
            <p className="lead">{siteConfig.brand.description}</p>
            <div className="hero__actions">
              <ButtonLink to={primary.to} size="lg" icon="arrow">
                {primary.label}
              </ButtonLink>
              <ButtonLink to={SECONDARY_CTA.to} size="lg" variant="secondary">
                {SECONDARY_CTA.label}
              </ButtonLink>
            </div>
            <p className="hero__availability">{getAvailabilityStatement()}</p>
            <div className="hero__facts">
              <div className="hero__fact">
                <strong>{recipe ? recipe.name : 'First recipe'}</strong>
                <span>{availabilityLabel}</span>
              </div>
              <div className="hero__fact">
                <strong>{fruits.length ? fruits.map((f) => f.name).join(' + ') : 'Real fruit'}</strong>
                <span>Pieces you can eat</span>
              </div>
              <div className="hero__fact">
                <strong>{upcoming[0] ? `${upcoming[0].city}` : 'Local pop-ups'}</strong>
                <span>{upcoming[0]?.date ? formatDate(upcoming[0].date) : 'Dates to be announced'}</span>
              </div>
            </div>
          </div>
          <div className="hero__visual">
            {heroImage ? (
              <Picture image={heroImage} priority sizes="(max-width: 899px) 92vw, 520px" showLabel={false} />
            ) : (
              <EmptyState title="Product photo coming" body="We’ll show the real can here as soon as the first batch is photographed." />
            )}
            {heroImage && (
              <span className="hero__visual-note cluster">
                {heroImage.illustrative && <Badge variant="outline">Illustrative render</Badge>}
                {draftsVisible() && recipe?.status === 'draft' && <DraftBadge what="recipe" />}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Signature scroll-driven assembly ---------- */}
      {recipe ? (
        reduced ? (
          <StaticAssembly recipe={recipe} />
        ) : (
          <Suspense
            fallback={
              <div className="assembly__placeholder" aria-busy="true">
                <span className="muted">Loading the assembly…</span>
              </div>
            }
          >
            <AssemblyScroll recipe={recipe} />
          </Suspense>
        )
      ) : (
        <Section tone="leaf" eyebrow="How it works" title="Choose a base, add fruit, enjoy." intro="The long-term HuskySips experience: choose your base, choose your fruits, choose an optional extra, enjoy your drink. The launch starts smaller: one approved base and one or two signature drinks.">
          <ol className="steps">
            <li>
              <div>
                <h4>Start with the base.</h4>
                <p>A clean, chilled base poured into a transparent can.</p>
              </div>
            </li>
            <li>
              <div>
                <h4>Add the fruit you love.</h4>
                <p>Real, edible fruit pieces, cut small enough to enjoy from the can.</p>
              </div>
            </li>
            <li>
              <div>
                <h4>Finish your way.</h4>
                <p>Optional extras are a future customization feature.</p>
              </div>
            </li>
            <li>
              <div>
                <h4>Sip the drink. Eat the fruit.</h4>
                <p>That is the whole idea.</p>
              </div>
            </li>
          </ol>
        </Section>
      )}

      {/* ---------- This week's menu ---------- */}
      <Section id="after-assembly" eyebrow="This week’s menu" title="One drink, made properly." intro="We launch with one signature Fruit Refresher so we can get it right before adding more." tabIndex={-1}>
        {recipe ? (
          <ProductCard recipe={recipe} featured />
        ) : (
          <EmptyState title="Our first Fruit Refresher is being finalised." body="The recipe, price and pack size will appear here once approved.">
            <ButtonLink to="/find-us#updates" variant="secondary">
              Get launch updates
            </ButtonLink>
          </EmptyState>
        )}
      </Section>

      {/* ---------- Journey ---------- */}
      <Section tone="forest" eyebrow="The journey" title={siteConfig.goal.label} intro="Tarun is building HuskySips from his own kitchen and documenting the whole process — including the parts that don’t work.">
        <div className="grid grid--2">
          <ProgressTracker />
          <div className="stack">
            <p>Every number here is verified paid cans, updated by hand after each sale is reconciled. No projections, no samples, no tests.</p>
            <div className="cluster">
              <ButtonLink to="/story" variant="on-forest" icon="arrow">
                Watch the episodes
              </ButtonLink>
              <ButtonLink to="/find-us" variant="on-forest-secondary">
                See the journey map
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------- Updates ---------- */}
      <Section eyebrow="Stay close" title="Know when the next pop-up is confirmed." intro="One message when a date is fixed. No newsletters unless you ask for them." tight>
        <div className="grid grid--2">
          <UpdatesForm />
          <div className="card card--flat">
            <h3>Planning something?</h3>
            <p className="muted">Personalised cans for corporate gatherings, weddings and celebrations, run clubs and community events.</p>
            <ButtonLink to="/events" variant="secondary" icon="arrow">
              Plan an event
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
