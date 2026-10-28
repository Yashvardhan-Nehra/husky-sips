import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { siteConfig } from '@/config/site.config';
import { getActiveCollection, getVisibleRecipes } from '@/config/selectors';
import { decodeSip } from '@/lib/savedSip';
import { usePageMeta } from '@/lib/hooks';
import { track, EVENTS } from '@/lib/analytics';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { ButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Notice } from '@/components/ui/Notice';
import { ProductCard } from '@/components/product/ProductCard';
import { SipBuilder } from '@/components/builder/SipBuilder';

export default function Menu() {
  usePageMeta('Menu', 'This week’s HuskySips Fruit Refreshers: recipe, ingredients, price and where to get them.');
  const recipes = getVisibleRecipes();
  const collection = getActiveCollection();
  const [params] = useSearchParams();
  const sharedSip = useMemo(() => decodeSip(params.get('sip')), [params]);

  useEffect(() => {
    track(EVENTS.MENU_VIEWED, { recipes: recipes.length });
  }, [recipes.length]);

  useEffect(() => {
    if (sharedSip) document.getElementById('builder')?.scrollIntoView({ block: 'start' });
  }, [sharedSip]);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">{collection?.name ?? 'Menu'}</span>
          <h1>This week’s menu</h1>
          <p className="lead">{recipes.length === 1 ? 'One signature drink, made properly. More combinations follow once this one is right.' : 'Signature combinations, validated and ready for pop-up days.'}</p>
        </div>
      </section>

      <Section tight style={{ paddingTop: 0 }}>
        {recipes.length === 0 ? (
          <EmptyState title="Our first Fruit Refresher is being finalised." body="Recipe, price and pack size will appear here once approved. No guesses in the meantime.">
            <ButtonLink to="/find-us#updates">Get launch updates</ButtonLink>
          </EmptyState>
        ) : (
          <div className="stack" style={{ gap: 32 }}>
            {recipes.map((r, i) => (
              <ProductCard key={r.id} recipe={r} featured={i === 0} />
            ))}
          </div>
        )}
        <div style={{ marginTop: 24 }}>
          <Notice variant="neutral">
            <p>
              Drinks are prepared in advance and kept chilled — not mixed to order. Taste descriptions are ours; product photographs replace illustrations as soon as the first batch is shot.
            </p>
          </Notice>
        </div>
      </Section>

      <Section
        id="builder"
        tone="leaf"
        eyebrow={siteConfig.flags.customization ? 'Build your own' : 'Preview the experience'}
        title={siteConfig.flags.customization ? 'Build your own HuskySips.' : 'Where this is going: choose your base, choose your fruits.'}
        intro={
          <>
            {siteConfig.flags.customization ? 'Fixed portions, your combination.' : 'A preview of the full HuskySips experience. The launch menu above is what you can buy today.'}{' '}
            {sharedSip && (
              <Badge variant="citrus" title="Loaded from a shared link">
                Saved Sip loaded
              </Badge>
            )}
          </>
        }
        tabIndex={-1}
      >
        <SipBuilder initial={sharedSip} />
      </Section>
    </>
  );
}
