import { useEffect, useMemo, useState } from 'react';
import { siteConfig } from '@/config/site.config';
import { getBase, getExtra, getFruit, getVisibleBases, getVisibleExtras, getVisibleFruits, draftsVisible } from '@/config/selectors';
import { buildShareUrl, type SipSelection } from '@/lib/savedSip';
import { formatInr } from '@/lib/format';
import { track, EVENTS } from '@/lib/analytics';
import { StageScene } from '@/components/stage/StageScene';
import { Badge, DraftBadge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';

const QTY_MIN = 1;
const QTY_MAX = 12;

/**
 * Reusable 4-step builder. Enabled for ordering only when flags.customization is true;
 * otherwise it is a labelled preview that accepts no orders. Portion sizes are fixed.
 */
export function SipBuilder({ initial }: { initial?: SipSelection | null }) {
  const bases = getVisibleBases();
  const fruits = getVisibleFruits();
  const extras = getVisibleExtras();
  const { maxFruits } = siteConfig.catalog.portions;
  const enabled = siteConfig.flags.customization;

  const [baseId, setBaseId] = useState<string>(initial?.baseId ?? bases.find((b) => b.status === 'approved')?.id ?? bases[0]?.id ?? '');
  const [fruitIds, setFruitIds] = useState<string[]>(initial?.fruitIds ?? []);
  const [extraId, setExtraId] = useState<string | null>(initial?.extraId ?? null);
  const [qty, setQty] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initial) {
      setBaseId(initial.baseId);
      setFruitIds(initial.fruitIds);
      setExtraId(initial.extraId);
    }
  }, [initial]);

  const base = getBase(baseId) ?? null;
  const chosenFruits = fruitIds.map(getFruit).filter((f): f is NonNullable<typeof f> => !!f);
  const extra = getExtra(extraId) ?? null;
  const selection: SipSelection = useMemo(() => ({ baseId, fruitIds, extraId }), [baseId, fruitIds, extraId]);
  const shareUrl = typeof window !== 'undefined' ? buildShareUrl(selection, window.location.origin) : '';
  const price = siteConfig.pack.priceInr;

  function toggleFruit(id: string) {
    setFruitIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : ids.length >= maxFruits ? ids : [...ids, id]));
  }

  async function share() {
    track(EVENTS.SAVED_SIP_SHARED, { base: baseId, fruits: fruitIds.join('+'), extra: extraId });
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Saved Sip', text: 'My HuskySips combination', url: shareUrl });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user cancelled or clipboard unavailable — the URL is still visible in the input */
    }
  }

  return (
    <div className="builder">
      <div className="builder__preview">
        <StageScene base={base} fruits={chosenFruits} extra={extra} pose={chosenFruits.length || base ? 'final' : 'empty'} title="Preview of your combination" />
        <p className="builder__preview-note fine">Preview only — an illustration of your combination, not a photograph of the drink.</p>
      </div>

      <div className="stack">
        {!enabled && (
          <Notice variant="info">
            <p>
              <strong>Preview the experience.</strong> Build-your-own is not open for orders yet. At launch, the signature drinks on this page are what you can buy.
            </p>
          </Notice>
        )}

        <div className="builder__step">
          <h3>
            <span className="num">1</span> Select a base
          </h3>
          <div className="choice-grid" role="radiogroup" aria-label="Base">
            {bases.map((b) => (
              <button key={b.id} type="button" className="choice" role="radio" aria-checked={baseId === b.id} onClick={() => setBaseId(b.id)}>
                <span className="choice__name">{b.name}</span>
                <span className="choice__meta">{b.tasteNote}</span>
                {draftsVisible() && b.status === 'draft' && <DraftBadge what="base" />}
              </button>
            ))}
            {bases.length === 0 && <p className="muted">The approved base will appear here after formulation review.</p>}
          </div>
        </div>

        <div className="builder__step">
          <h3>
            <span className="num">2</span> Select up to {maxFruits} fruits
          </h3>
          <div className="choice-grid" role="group" aria-label="Fruits">
            {fruits.map((f) => {
              const chosen = fruitIds.includes(f.id);
              const full = !chosen && fruitIds.length >= maxFruits;
              return (
                <button key={f.id} type="button" className="choice" aria-pressed={chosen} disabled={!f.available || full} onClick={() => toggleFruit(f.id)} title={!f.available ? 'Not available yet' : full ? `Up to ${maxFruits} fruits` : undefined}>
                  <span className="choice__name">{f.name}</span>
                  <span className="choice__meta">{f.available ? f.portionLabel : 'Not available yet'}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="builder__step">
          <h3>
            <span className="num">3</span> One optional extra
          </h3>
          <div className="choice-grid" role="radiogroup" aria-label="Extra">
            <button type="button" className="choice" role="radio" aria-checked={extraId === null} onClick={() => setExtraId(null)}>
              <span className="choice__name">No extra</span>
              <span className="choice__meta">Keep it simple</span>
            </button>
            {extras.map((x) => (
              <button key={x.id} type="button" className="choice" role="radio" aria-checked={extraId === x.id} disabled={!x.available} onClick={() => setExtraId(x.id)} title={!x.available ? 'Not available yet' : undefined}>
                <span className="choice__name">{x.name}</span>
                <span className="choice__meta">{x.available ? 'Available' : 'Coming later'}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="builder__step builder__summary">
          <h3>
            <span className="num">4</span> Review
          </h3>
          <dl className="facts">
            <dt>Base</dt>
            <dd className={base ? undefined : 'unset'}>{base?.name ?? 'Choose a base'}</dd>
            <dt>Fruits</dt>
            <dd className={chosenFruits.length ? undefined : 'unset'}>{chosenFruits.length ? chosenFruits.map((f) => f.portionLabel).join(' + ') : 'Choose up to two'}</dd>
            <dt>Extra</dt>
            <dd>{extra?.name ?? 'None'}</dd>
            <dt>Portion</dt>
            <dd>{siteConfig.pack.sizeLabel ?? 'Fixed portion — pack size to be confirmed'}</dd>
            <dt>Price</dt>
            <dd className={price === null ? 'unset' : undefined}>{price === null ? 'To be confirmed' : formatInr(price)}</dd>
            <dt>Quantity</dt>
            <dd>
              <div className="cluster">
                <Button variant="ghost" size="sm" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(QTY_MIN, q - 1))} disabled={!enabled}>
                  −
                </Button>
                <span aria-live="polite">{qty}</span>
                <Button variant="ghost" size="sm" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(QTY_MAX, q + 1))} disabled={!enabled}>
                  +
                </Button>
              </div>
            </dd>
            <dt>Pickup / service</dt>
            <dd className="unset">Pop-up pickup once ordering opens. Not available for delivery.</dd>
          </dl>
          <div className="cluster" style={{ marginTop: 16 }}>
            {enabled ? (
              <ButtonLink to="/find-us" icon="arrow">
                Choose a pickup pop-up
              </ButtonLink>
            ) : (
              <Badge variant="citrus">Ordering not open yet</Badge>
            )}
          </div>
        </div>

        <div className="card card--flat builder__share">
          <h4 style={{ margin: 0 }}>Save this Sip</h4>
          <p className="small muted" style={{ margin: 0 }}>
            Share your combination with a link — no account needed.
          </p>
          <div className="share-url">
            <input readOnly value={shareUrl} aria-label="Shareable link for this combination" onFocus={(e) => e.currentTarget.select()} />
            <Button variant="secondary" size="sm" icon="share" onClick={share} disabled={!base}>
              {copied ? 'Copied' : 'Share'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
