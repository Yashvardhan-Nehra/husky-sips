import { siteConfig } from '@/config/site.config';
import { getEnabledClaims, getVisibleBases, getVisibleRecipes, getRecipeFruits, draftsVisible } from '@/config/selectors';
import { usePageMeta } from '@/lib/hooks';
import { Picture } from '@/components/ui/Picture';
import { Notice } from '@/components/ui/Notice';
import { DraftBadge } from '@/components/ui/Badge';

function Fact({ label, value, fallback }: { label: string; value: string | null; fallback: string }) {
  return (
    <>
      <dt>{label}</dt>
      <dd className={value ? undefined : 'unset'}>{value ?? fallback}</dd>
    </>
  );
}

export default function IngredientsCare() {
  usePageMeta('Ingredients & Care', 'What goes into HuskySips, how it is prepared and how to store it.');
  const { care, registration } = siteConfig;
  const bases = getVisibleBases();
  const recipes = getVisibleRecipes();
  const claims = getEnabledClaims();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Trust</span>
          <h1>Ingredients & Care</h1>
          <p className="lead">Verified information only. Anything not yet confirmed is marked as such rather than guessed.</p>
        </div>
      </section>

      <section className="section section--tight" style={{ paddingTop: 0 }}>
        <div className="container grid grid--2">
          <div className="card">
            <h3>What’s inside</h3>
            {bases.length === 0 && <p className="muted">The approved base and its full ingredient list will be published after formulation review.</p>}
            {bases.map((b) => (
              <div key={b.id} className="stack">
                <div className="cluster">
                  <h4 style={{ margin: 0 }}>{b.name}</h4>
                  {draftsVisible() && b.status === 'draft' && <DraftBadge what="base" />}
                </div>
                {b.ingredients.length ? (
                  <ul className="ingredient-chips">
                    {b.ingredients.map((i) => (
                      <li key={i.name}>
                        {i.name}
                        {i.allergen ? ' (allergen)' : ''}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted">Full ingredient list to be published after formulation approval.</p>
                )}
              </div>
            ))}
            {recipes.map((r) => (
              <div key={r.id} className="stack" style={{ marginTop: 16 }}>
                <h4 style={{ margin: 0 }}>{r.name} — fruit</h4>
                <ul className="ingredient-chips">
                  {getRecipeFruits(r).map((f) => (
                    <li key={f.id}>{f.portionLabel}</li>
                  ))}
                </ul>
              </div>
            ))}
            <h4>Claims</h4>
            {claims.length ? (
              <ul>
                {claims.map((c) => (
                  <li key={c.id}>
                    <strong>{c.label}.</strong> {c.companion}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">No nutrition or ingredient claims are made until formulation review is complete.</p>
            )}
          </div>

          <div className="card">
            <h3>Preparation, storage and batches</h3>
            <dl className="facts">
              <Fact label="Preparation" value={care.preparation} fallback="Preparation standards to be published with the first batch." />
              <Fact label="Storage" value={care.storage} fallback="Keep refrigerated. Detailed guidance to be confirmed." />
              <Fact label="Consume within" value={care.consumeWithin} fallback="To be confirmed after shelf-life testing — we will not guess." />
              <Fact label="Allergens" value={care.allergens} fallback="Allergen statement to be confirmed per recipe." />
              <Fact label="Batch identification" value={care.batchIdentification} fallback="Batch codes begin with the first production run." />
              <Fact label="Registration" value={registration.fssaiNumber ? `FSSAI ${registration.fssaiNumber}` : null} fallback="Registration details will be displayed once issued." />
            </dl>
            {care.lastReviewed && <p className="fine">Last reviewed {care.lastReviewed}.</p>}
            <Notice variant="info">
              <p>Sealing the can keeps it tidy, not shelf-stable. HuskySips is a fresh, chilled product.</p>
            </Notice>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Behind the counter</span>
            <h2>Preparation standards</h2>
            <p className="lead">Real photographs of where and how the drinks are prepared will be shown here. Illustrations are never used as evidence of hygiene practices.</p>
          </div>
          {care.photos.length ? (
            <div className="grid grid--3">
              {care.photos.map((p) => (
                <Picture key={p.name} image={p} sizes="(max-width: 679px) 100vw, 33vw" />
              ))}
            </div>
          ) : (
            <Notice variant="neutral">
              <p>Preparation photographs are pending. They will be added after the first production run is documented.</p>
            </Notice>
          )}
        </div>
      </section>
    </>
  );
}
