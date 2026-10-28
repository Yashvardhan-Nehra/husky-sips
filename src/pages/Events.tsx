import { useState } from 'react';
import { siteConfig } from '@/config/site.config';
import { getVisibleRecipes } from '@/config/selectors';
import { usePageMeta } from '@/lib/hooks';
import { Section } from '@/components/ui/Section';
import { Picture } from '@/components/ui/Picture';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LabelPreview } from '@/components/label/LabelPreview';
import { EventEnquiryForm, type ServiceFormat } from '@/components/forms/EventEnquiryForm';
import type { ImageAsset } from '@/config/types';

const HERO_ART: ImageAsset = { name: 'kiwi-citrus-splash', alt: 'Illustration of a HuskySips can with kiwi and orange pieces in a warm citrus splash', widths: [640, 1080], aspect: '3/4', illustrative: true };

const OCCASIONS = [
  { title: 'Corporate gatherings', body: 'Offsites, launches and Friday wind-downs. Cans with your team’s name or event, kept chilled for the moment.', icon: 'spark' as const },
  { title: 'Weddings and celebrations', body: 'A refreshing welcome drink with the couple’s names, or a thank-you can for guests to take home.', icon: 'leaf' as const },
  { title: 'Run clubs and community events', body: 'Real fruit at the finish line. Labels for your club, your route, or your Sunday.', icon: 'pin' as const },
];

export default function Events() {
  usePageMeta('Events & Bulk', 'Personalised HuskySips cans for corporate gatherings, weddings, run clubs and community events.');
  const { eventOrders } = siteConfig;
  const recipes = getVisibleRecipes();
  const [personalization, setPersonalization] = useState('');
  const [format, setFormat] = useState<ServiceFormat>('pre-packed');

  function jumpToEnquiry(f: ServiceFormat) {
    setFormat(f);
    document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    (document.getElementById('enquiry') as HTMLElement | null)?.focus({ preventScroll: true });
  }

  return (
    <>
      <section className="events-hero">
        <div className="container events-hero__grid">
          <div>
            <span className="eyebrow" style={{ color: 'var(--citrus)' }}>
              Events & Bulk
            </span>
            <h1>Your occasion. Your name. Your HuskySips.</h1>
            <p className="lead">Personalised labels on our validated signature drinks. We start with what we know we can make well, and tell you exactly what we can do for your date.</p>
            <div className="cluster">
              <a className="btn btn--on-forest btn--lg" href="#enquiry">
                Start an enquiry <Icon name="arrow" className="btn__icon" />
              </a>
              <a className="btn btn--on-forest-secondary btn--lg" href="#label">
                Preview a label
              </a>
            </div>
          </div>
          <Picture image={HERO_ART} sizes="(max-width: 899px) 80vw, 420px" />
        </div>
      </section>

      <Section eyebrow="Made for" title="Three kinds of occasion we love.">
        <div className="occasions">
          {OCCASIONS.map((o) => (
            <div className="occasion" key={o.title}>
              <div className="occasion__icon">
                <Icon name={o.icon} />
              </div>
              <h3>{o.title}</h3>
              <p className="muted" style={{ margin: 0 }}>
                {o.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="leaf" eyebrow="How we can serve you" title="Three ways to enquire." intro="Pick the one that fits. We confirm capacity, timing and pricing for every request individually — there is no fixed minimum order or deposit published yet.">
        <div className="grid grid--3">
          <div className="option-card">
            <Badge variant="success" dot>
              Available to enquire
            </Badge>
            <h3>Personalised pre-packed drinks</h3>
            <p className="muted">Signature recipes with your custom event label, chilled and ready for collection or hand-over.</p>
            <Button variant="primary" icon="arrow" onClick={() => jumpToEnquiry('pre-packed')}>
              Enquire
            </Button>
          </div>
          <div className={['option-card', eventOrders.chilledDeliveryEnabled ? '' : 'option-card--disabled'].join(' ').trim()}>
            <Badge variant={eventOrders.chilledDeliveryEnabled ? 'success' : 'neutral'} dot>
              {eventOrders.chilledDeliveryEnabled ? 'Where serviceable' : 'Not yet serviceable'}
            </Badge>
            <h3>Chilled event delivery</h3>
            <p className="muted">{eventOrders.chilledDeliveryEnabled ? `Currently serving: ${eventOrders.serviceAreas.join(', ')}.` : 'We will list service areas as soon as chilled delivery is ready. Mention it in your enquiry if you need it.'}</p>
            <Button variant={eventOrders.chilledDeliveryEnabled ? 'primary' : 'secondary'} icon="arrow" onClick={() => jumpToEnquiry(eventOrders.chilledDeliveryEnabled ? 'chilled-delivery' : 'pre-packed')}>
              {eventOrders.chilledDeliveryEnabled ? 'Enquire' : 'Ask about delivery'}
            </Button>
          </div>
          <div className={['option-card', eventOrders.staffedCounterEnabled ? '' : 'option-card--disabled'].join(' ').trim()}>
            <Badge variant={eventOrders.staffedCounterEnabled ? 'success' : 'neutral'} dot>
              {eventOrders.staffedCounterEnabled ? 'Available' : 'Coming later'}
            </Badge>
            <h3>Staffed customization counter</h3>
            <p className="muted">{eventOrders.staffedCounterEnabled ? 'Guests choose their fruit at a HuskySips counter run by our team.' : 'A build-your-own counter is part of the plan, but not something we offer yet.'}</p>
            {eventOrders.staffedCounterEnabled ? (
              <Button variant="primary" icon="arrow" onClick={() => jumpToEnquiry('staffed-counter')}>
                Enquire
              </Button>
            ) : (
              <Badge variant="outline">Not available yet</Badge>
            )}
          </div>
        </div>
        {eventOrders.capacityNote && <p className="fine" style={{ marginTop: 16 }}>{eventOrders.capacityNote}</p>}
        {recipes.length > 0 && (
          <p className="fine" style={{ marginTop: 16 }}>
            Menu for events: {recipes.map((r) => r.name).join(', ')}. Custom recipe changes are not offered at this stage.
          </p>
        )}
      </Section>

      <Section id="label" eyebrow="Label preview" title="See your name on the can." intro="Type your event text and drop in a logo. The HuskySips mark and the product information stay in place." tabIndex={-1}>
        <LabelPreview
          onUseInEnquiry={(t) => {
            setPersonalization(t);
            jumpToEnquiry(format);
          }}
        />
      </Section>

      <Section tight>
        <EventEnquiryForm initialPersonalization={personalization} initialFormat={format} />
      </Section>
    </>
  );
}
