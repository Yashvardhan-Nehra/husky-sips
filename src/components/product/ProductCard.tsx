import { siteConfig } from '@/config/site.config';
import type { Recipe } from '@/config/types';
import { canPreorder, draftsVisible, getBase, getEnabledClaims, getExtra, getRecipeFruits, getUpcomingPopUps } from '@/config/selectors';
import { formatDate, formatInr, formatWindow } from '@/lib/format';
import { Picture } from '@/components/ui/Picture';
import { Badge, DraftBadge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { StageScene } from '@/components/stage/StageScene';


function availabilityText(): { label: string; variant: 'success' | 'info' | 'warn' | 'neutral' } {
  const upcoming = getUpcomingPopUps();
  if (upcoming.length) return { label: 'Available at upcoming pop-ups', variant: 'success' };
  switch (siteConfig.pack.availability) {
    case 'pop-up':
      return { label: 'Available at selected pop-ups', variant: 'success' };
    case 'preorder':
      return { label: 'Preorder for pickup', variant: 'info' };
    case 'sold-out':
      return { label: 'Sold out for now', variant: 'warn' };
    case 'unavailable':
      return { label: 'Not currently available', variant: 'neutral' };
    default:
      return { label: 'Coming soon to local pop-ups', variant: 'info' };
  }
}

export function ProductCard({ recipe, featured = false }: { recipe: Recipe; featured?: boolean }) {
  const base = getBase(recipe.baseId) ?? null;
  const fruits = getRecipeFruits(recipe);
  const extra = getExtra(recipe.extraId) ?? null;
  const claims = getEnabledClaims();
  const { pack } = siteConfig;
  const image = recipe.photo ?? recipe.illustration;
  const availability = availabilityText();
  const upcoming = getUpcomingPopUps();
  const preorderable = upcoming.find(canPreorder);

  return (
    <article className="menu-card" aria-labelledby={`recipe-${recipe.id}`}>
      <div className="menu-card__media">
        {image ? <Picture image={image} sizes="(max-width: 799px) 100vw, 40vw" priority={featured} showLabel={false} /> : <StageScene base={base} fruits={fruits} extra={extra} pose="final" title={`Illustration of ${recipe.name}`} />}
        {!recipe.photo && (
          <span className="picture__caption" style={{ left: 'auto', right: 12 }}>
            <Badge variant="citrus">Concept illustration — photo coming</Badge>
          </span>
        )}
      </div>
      <div className="menu-card__body">
        <div className="menu-card__title-row">
          <h3 id={`recipe-${recipe.id}`}>{recipe.name}</h3>
          <Badge variant={availability.variant} dot>
            {availability.label}
          </Badge>
          {draftsVisible() && recipe.status === 'draft' && <DraftBadge what="recipe" />}
        </div>
        <div className="menu-card__tags">
          {recipe.tasteTags.map((t) => (
            <Badge key={t} variant="info">
              {t}
            </Badge>
          ))}
        </div>
        <p className="menu-card__taste">{recipe.taste}</p>

        <h4 style={{ marginBottom: 6 }}>What’s in it</h4>
        <ul className="ingredient-chips">
          <li>{base ? base.name : 'Base to be confirmed'}</li>
          {fruits.map((f) => (
            <li key={f.id}>{f.portionLabel}</li>
          ))}
          {extra && <li>{extra.name}</li>}
        </ul>
        {base && base.ingredients.length > 0 && <p className="small muted">Base ingredients: {base.ingredients.map((i) => i.name).join(', ')}.</p>}

        {claims.length > 0 && (
          <div className="menu-card__claims">
            {claims.map((c) => (
              <span className="menu-card__claim" key={c.id}>
                <Icon name="check" size={18} /> {c.label}
                {c.companion && <small> · {c.companion}</small>}
              </span>
            ))}
          </div>
        )}

        <div className="menu-card__price-row">
          {pack.priceInr !== null ? <span className="menu-card__price">{formatInr(pack.priceInr)}</span> : <span className="menu-card__price unset">Price confirmed at launch</span>}
          <span className="muted">{pack.sizeLabel ?? 'Pack size to be confirmed'}</span>
        </div>
        {pack.note && <p className="small muted">{pack.note}</p>}

        <dl className="facts">
          <dt>Allergens</dt>
          <dd className={recipe.allergens ? undefined : 'unset'}>{recipe.allergens ? recipe.allergens.join(', ') : 'Allergen statement to be confirmed'}</dd>
          <dt>Storage</dt>
          <dd className={recipe.storage ? undefined : 'unset'}>{recipe.storage ?? 'Keep refrigerated. Full guidance on the Ingredients & Care page.'}</dd>
        </dl>

        <div className="menu-card__pickup">
          <h4>Pickup & service</h4>
          {upcoming.length ? (
            <ul style={{ paddingLeft: 18, margin: '0 0 12px' }}>
              {upcoming.slice(0, 3).map((p) => (
                <li key={p.id}>
                  <strong>{p.name}</strong>, {p.city}
                  {p.date ? ` · ${formatDate(p.date)}` : ''}
                  {p.window ? ` · ${formatWindow(p.window)}` : ''}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted small">Pop-up pickup only. The first confirmed dates will be listed on Find Us.</p>
          )}
          <div className="cluster menu-card__actions">
            {preorderable ? (
              <ButtonLink to={`/find-us#${preorderable.id}`} icon="arrow">
                Reserve for pickup
              </ButtonLink>
            ) : (
              <ButtonLink to={upcoming.length ? '/find-us' : '/find-us#updates'} icon="arrow">
                {upcoming.length ? 'Find a pop-up' : 'Get launch updates'}
              </ButtonLink>
            )}
            <ButtonLink to="/events" variant="secondary">
              Order for an event
            </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
}
