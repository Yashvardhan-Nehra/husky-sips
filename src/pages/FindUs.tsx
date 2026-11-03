import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '@/config/site.config';
import { canPreorder, getUpcomingPopUps, getVisibleRecipes, getRecipe } from '@/config/selectors';
import { summarizeSales } from '@/lib/sales';
import { formatDate, formatDateShort, formatNumber, formatWindow } from '@/lib/format';
import { usePageMeta } from '@/lib/hooks';
import { track, EVENTS } from '@/lib/analytics';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Notice } from '@/components/ui/Notice';
import { IndiaMap, type MapPin } from '@/components/map/IndiaMap';
import { UpdatesForm } from '@/components/forms/UpdatesForm';
import { CommunityForm } from '@/components/forms/CommunityForm';
import { ReservationForm } from '@/components/forms/ReservationForm';

type Tab = 'popups' | 'journey';

export default function FindUs() {
  usePageMeta('Find Us', 'Confirmed HuskySips pop-ups and the verified journey so far, city by city.');
  const location = useLocation();
  const [tab, setTab] = useState<Tab>('popups');
  const [selected, setSelected] = useState<string | null>(null);
  const upcoming = getUpcomingPopUps();
  const recipes = getVisibleRecipes();
  const sales = useMemo(() => summarizeSales(siteConfig.sales.records), []);
  const home = siteConfig.homeBase;

  useEffect(() => {
    const id = location.hash.slice(1);
    if (id && upcoming.some((p) => p.id === id)) {
      setTab('popups');
      setSelected(id);
    }
  }, [location.hash, upcoming]);

  const popupPins: MapPin[] = useMemo(
    () => [
      ...upcoming.map((p) => ({ id: p.id, lat: p.lat, lng: p.lng, label: p.city, kind: 'popup' as const, detail: p.date ? `${p.status}, ${formatDateShort(p.date)}` : p.status })),
      ...(home ? [{ id: 'home', lat: home.lat, lng: home.lng, label: home.city, kind: 'home' as const, detail: 'home base' }] : []),
    ],
    [upcoming, home],
  );
  const journeyPins: MapPin[] = useMemo(() => (sales.status === 'ok' ? sales.byLocation.map((l) => ({ id: l.key, lat: l.lat, lng: l.lng, label: l.city, kind: 'sales' as const, detail: `${formatNumber(l.units)} cans` })) : []), [sales]);

  function selectPopUp(id: string) {
    setSelected(id);
    track(EVENTS.POPUP_SELECTED, { popUp: id });
    document.getElementById(id)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Find Us</span>
          <h1>Pop-ups and the journey so far</h1>
          <p className="lead">Two different things: where you can get HuskySips next, and where paid cans have already been fulfilled. A past pin never means current stock.</p>
          <div className="tabs" role="tablist" aria-label="Map view" style={{ marginTop: 20 }}>
            <button className="tab" role="tab" id="tab-popups" aria-selected={tab === 'popups'} aria-controls="panel-popups" onClick={() => setTab('popups')}>
              Find a pop-up
            </button>
            <button className="tab" role="tab" id="tab-journey" aria-selected={tab === 'journey'} aria-controls="panel-journey" onClick={() => setTab('journey')}>
              Our journey so far
            </button>
          </div>
        </div>
      </section>

      <Section tight style={{ paddingTop: 0 }}>
        <div className="find-us__layout">
          <div className="map-card">
            <IndiaMap pins={tab === 'popups' ? popupPins : journeyPins} selectedId={selected} onSelect={tab === 'popups' ? selectPopUp : undefined} title={tab === 'popups' ? 'Map of India showing confirmed pop-up locations' : 'Map of India showing cities where paid cans have been fulfilled'} />
            <div className="map-legend" aria-hidden="true">
              {tab === 'popups' ? (
                <>
                  <span>
                    <i style={{ background: 'var(--map-popup)' }} /> Confirmed pop-up
                  </span>
                  {home && (
                    <span>
                      <i style={{ background: 'var(--map-home)' }} /> Home base
                    </span>
                  )}
                </>
              ) : (
                <span>
                  <i style={{ background: 'var(--map-sales)' }} /> Verified paid cans fulfilled
                </span>
              )}
            </div>
          </div>

          <div>
            {tab === 'popups' ? (
              <div id="panel-popups" role="tabpanel" aria-labelledby="tab-popups" className="stack">
                <h2 style={{ marginBottom: 4 }}>Confirmed pop-ups</h2>
                {upcoming.length === 0 ? (
                  <EmptyState title="No pop-up is confirmed yet." body="We only list events once the venue, date and time are fixed. Leave your details and we’ll message you when the first one is.">
                    <a className="btn btn--primary" href="#updates">
                      Get launch updates
                    </a>
                  </EmptyState>
                ) : (
                  <ul className="location-list">
                    {upcoming.map((p) => (
                      <li key={p.id} id={p.id} className={['location', selected === p.id ? 'is-selected' : ''].join(' ').trim()}>
                        <div className="location__head">
                          <h3>{p.name}</h3>
                          <Badge variant={p.status === 'confirmed' ? 'success' : 'info'} dot>
                            {p.status === 'confirmed' ? 'Confirmed' : p.status}
                          </Badge>
                        </div>
                        <div className="location__meta">
                          <span>
                            <Icon name="pin" size={16} /> {p.venue}, {p.city}, {p.state}
                          </span>
                          <span>
                            <Icon name="calendar" size={16} /> {p.date ? formatDate(p.date) : 'Date to be confirmed'}
                          </span>
                          {p.window && (
                            <span>
                              <Icon name="clock" size={16} /> {formatWindow(p.window)}
                            </span>
                          )}
                        </div>
                        <p className="small" style={{ margin: 0 }}>
                          <strong>Menu:</strong> {p.menuRecipeIds.length ? p.menuRecipeIds.map((id) => getRecipe(id)?.name ?? id).join(', ') : 'To be announced'}
                        </p>
                        {p.note && <p className="small muted">{p.note}</p>}
                        {canPreorder(p) ? <ReservationForm popUp={p} recipes={recipes.filter((r) => p.menuRecipeIds.includes(r.id))} /> : <p className="small muted">Walk up and buy on the day. Reservations are not open for this event.</p>}
                        <span className="location__updated">Last updated {formatDateShort(p.lastUpdated)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div id="panel-journey" role="tabpanel" aria-labelledby="tab-journey" className="stack">
                <h2 style={{ marginBottom: 4 }}>Our journey so far</h2>
                {sales.status === 'untracked' && (
                  <Notice variant="neutral">
                    <p>
                      <strong>Sales tracking is not connected yet.</strong> We’ll show verified paid cans by city here once the first sales are reconciled. Missing data is not the same as zero.
                    </p>
                  </Notice>
                )}
                {sales.status === 'none' && <EmptyState title="The journey starts here." body="No paid cans have been fulfilled yet. The first verified sale will light up the map." />}
                {sales.status === 'ok' && (
                  <>
                    <p className="muted">
                      {formatNumber(sales.total)} verified paid cans across {sales.byLocation.length} {sales.byLocation.length === 1 ? 'location' : 'locations'}. Historical — not current stock.
                      {siteConfig.sales.lastVerifiedAt && ` Last verified ${formatDateShort(siteConfig.sales.lastVerifiedAt)}.`}
                      {!siteConfig.sales.live && ' Updated manually.'}
                    </p>
                    <ul className="location-list">
                      {sales.byLocation.map((l) => (
                        <li key={l.key} className="location">
                          <div className="location__head">
                            <h3>{l.locationName}</h3>
                            <Badge variant="outline">Fulfilled</Badge>
                          </div>
                          <div className="location__meta">
                            <span>
                              <Icon name="pin" size={16} /> {l.city}, {l.state}
                            </span>
                          </div>
                          <span className="location__units">{formatNumber(l.units)} cans</span>
                          <span className="location__updated">Last updated {formatDateShort(l.lastUpdated)}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <p className="fine">Counts are paid units fulfilled, minus refunds. Cancelled orders, free samples and test batches are excluded. Bulk orders count once, by fulfilled quantity.</p>
                <ButtonLink to="/story" variant="secondary" icon="arrow">
                  Read the story
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section eyebrow="Help us choose" title="Where next?" intro="Tell us where you’d like a pop-up, or leave your details for the next confirmed date." tight>
        <div className="grid grid--2">
          <CommunityForm />
          <UpdatesForm />
        </div>
      </Section>
    </>
  );
}
