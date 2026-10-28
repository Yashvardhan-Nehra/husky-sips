import { useEffect, useState, type FormEvent } from 'react';
import { siteConfig } from '@/config/site.config';
import { getVisibleRecipes } from '@/config/selectors';
import { submitForm } from '@/lib/submit';
import { emailOrPhone, isoDateNotPast, maxLen, mustBeChecked, positiveInt, required, validateFields, hasErrors, type Errors } from '@/lib/validation';
import { useFormTiming } from '@/lib/hooks';
import { track, EVENTS } from '@/lib/analytics';
import { TextField, TextArea, SelectField, CheckboxField } from '@/components/ui/Field';
import { FormStatus, type FormState } from '@/components/ui/FormStatus';
import { Button } from '@/components/ui/Button';
import { Honeypot, UnavailableBanner, CONTACT_HINT } from './formShared';
import { useTurnstile } from './useTurnstile';

type Field = 'name' | 'contact' | 'eventType' | 'date' | 'time' | 'cityVenue' | 'quantity' | 'menu' | 'format' | 'personalization' | 'notes' | 'consent' | 'marketing';

const EVENT_TYPES = ['Corporate gathering', 'Wedding or celebration', 'Run club or community event', 'Other'];
const MAX_LOGO_BYTES = 5 * 1024 * 1024;
const LOGO_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'application/pdf'];

export type ServiceFormat = 'pre-packed' | 'chilled-delivery' | 'staffed-counter';

export function EventEnquiryForm({ initialPersonalization = '', initialFormat = 'pre-packed' }: { initialPersonalization?: string; initialFormat?: ServiceFormat }) {
  const recipes = getVisibleRecipes();
  const { eventOrders } = siteConfig;
  const [values, setValues] = useState<Record<Field, string>>({
    name: '',
    contact: '',
    eventType: '',
    date: '',
    time: '',
    cityVenue: '',
    quantity: '',
    menu: recipes[0]?.id ?? 'signature',
    format: initialFormat,
    personalization: initialPersonalization,
    notes: '',
    consent: 'false',
    marketing: 'false',
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [logoError, setLogoError] = useState<string | undefined>();
  const [errors, setErrors] = useState<Errors<Field>>({});
  const [honeypot, setHoneypot] = useState('');
  const [state, setState] = useState<FormState>({ kind: 'idle' });
  const [touched, setTouched] = useState(false);
  const startedAt = useFormTiming();
  const turnstile = useTurnstile(touched);
  const set = (k: Field) => (v: string) => setValues((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    if (initialPersonalization) setValues((s) => ({ ...s, personalization: initialPersonalization }));
  }, [initialPersonalization]);
  useEffect(() => {
    setValues((s) => ({ ...s, format: initialFormat }));
  }, [initialFormat]);

  function onLogo(file: File | null) {
    setLogoError(undefined);
    if (!file) return setLogo(null);
    if (!LOGO_TYPES.includes(file.type)) return setLogoError('Please upload a PNG, JPG, SVG or PDF.');
    if (file.size > MAX_LOGO_BYTES) return setLogoError('Please keep artwork under 5 MB.');
    setLogo(file);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validateFields(values, {
      name: [required('Your name'), maxLen(120, 'Name')],
      contact: [required('A contact method'), emailOrPhone],
      eventType: [required('Event type')],
      date: [required('Event date'), isoDateNotPast],
      cityVenue: [required('City or venue'), maxLen(200, 'City/venue')],
      quantity: [required('Estimated quantity'), positiveInt('Estimated quantity')],
      format: [required('Service format')],
      personalization: [maxLen(60, 'Personalisation text')],
      notes: [maxLen(1000, 'Notes')],
      consent: [mustBeChecked('Please confirm we may contact you about this enquiry.')],
    });
    setErrors(errs);
    if (hasErrors(errs) || logoError) return;
    setState({ kind: 'submitting' });
    track(EVENTS.RESERVATION_STARTED, { kind: 'event-enquiry' });

    let logoPayload: { name: string; type: string; size: number; dataUrl: string } | null = null;
    if (logo) {
      logoPayload = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: logo.name, type: logo.type, size: logo.size, dataUrl: String(reader.result) });
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(logo);
      });
    }

    const result = await submitForm(
      'event-enquiry',
      {
        name: values.name.trim(),
        contact: values.contact.trim(),
        eventType: values.eventType,
        date: values.date,
        time: values.time || null,
        cityVenue: values.cityVenue.trim(),
        estimatedQuantity: Number(values.quantity),
        preferredMenu: values.menu,
        serviceFormat: values.format,
        personalization: values.personalization.trim() || null,
        logo: logoPayload,
        notes: values.notes.trim() || null,
        enquiryConsent: true,
        marketingConsent: values.marketing === 'true',
      },
      { startedAt: startedAt.current, honeypot, turnstileToken: turnstile.token },
    );
    setState({ kind: 'done', result });
    if (result.ok) {
      track(EVENTS.EVENT_ENQUIRY_SUBMITTED, { eventType: values.eventType, format: values.format, quantity: Number(values.quantity) });
      turnstile.reset();
    }
  }

  const done = state.kind === 'done' && state.result.ok;

  return (
    <form className="form card card--pad-lg" id="enquiry" onSubmit={onSubmit} noValidate onFocus={() => setTouched(true)} aria-labelledby="enquiry-title" tabIndex={-1}>
      <div>
        <h3 id="enquiry-title" style={{ marginBottom: 4 }}>
          Event enquiry
        </h3>
        <p className="muted" style={{ margin: 0 }}>
          We’ll confirm what we can do, when, and at what price. Sending this does not book anything yet.
        </p>
      </div>
      <UnavailableBanner />
      {!done && (
        <>
          <div className="form__row form__row--2">
            <TextField label="Name" value={values.name} onChange={(e) => set('name')(e.target.value)} error={errors.name} autoComplete="name" />
            <TextField label="Contact method" hint={CONTACT_HINT} value={values.contact} onChange={(e) => set('contact')(e.target.value)} error={errors.contact} autoComplete="email" />
          </div>
          <div className="form__row form__row--2">
            <SelectField label="Event type" value={values.eventType} onChange={(e) => set('eventType')(e.target.value)} error={errors.eventType}>
              <option value="">Choose…</option>
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </SelectField>
            <TextField label="City / venue" value={values.cityVenue} onChange={(e) => set('cityVenue')(e.target.value)} error={errors.cityVenue} />
          </div>
          <div className="form__row form__row--2">
            <TextField label="Date" type="date" value={values.date} onChange={(e) => set('date')(e.target.value)} error={errors.date} />
            <TextField label="Service time" optional type="time" value={values.time} onChange={(e) => set('time')(e.target.value)} />
          </div>
          <div className="form__row form__row--2">
            <TextField label="Estimated quantity (drinks)" type="number" inputMode="numeric" min={1} value={values.quantity} onChange={(e) => set('quantity')(e.target.value)} error={errors.quantity} />
            <SelectField label="Preferred menu" value={values.menu} onChange={(e) => set('menu')(e.target.value)}>
              {recipes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
              <option value="signature">Signature selection (let us suggest)</option>
            </SelectField>
          </div>

          <fieldset className="fieldset">
            <legend>Service format</legend>
            <div className="radio-cards radio-cards--3">
              <label className="radio-card">
                <input type="radio" name="format" value="pre-packed" checked={values.format === 'pre-packed'} onChange={() => set('format')('pre-packed')} />
                <span className="radio-card__title">Personalised pre-packed drinks</span>
                <span className="radio-card__desc">Cans with your event label, collected or handed over chilled.</span>
              </label>
              <label className="radio-card">
                <input type="radio" name="format" value="chilled-delivery" checked={values.format === 'chilled-delivery'} onChange={() => set('format')('chilled-delivery')} disabled={!eventOrders.chilledDeliveryEnabled} />
                <span className="radio-card__title">Chilled event delivery</span>
                <span className="radio-card__desc">{eventOrders.chilledDeliveryEnabled ? `Where serviceable: ${eventOrders.serviceAreas.join(', ')}.` : 'Not yet serviceable — ask in notes if you need it.'}</span>
              </label>
              <label className="radio-card">
                <input type="radio" name="format" value="staffed-counter" checked={values.format === 'staffed-counter'} onChange={() => set('format')('staffed-counter')} disabled={!eventOrders.staffedCounterEnabled} />
                <span className="radio-card__title">Staffed customization counter</span>
                <span className="radio-card__desc">{eventOrders.staffedCounterEnabled ? 'Build-your-own drinks, served by our team.' : 'Not available yet.'}</span>
              </label>
            </div>
            {errors.format && (
              <span className="field__error" role="alert">
                {errors.format}
              </span>
            )}
          </fieldset>

          <TextField label="Personalisation text" optional hint="Up to 60 characters, printed on the label, e.g. “Priya & Arjun · 14 Feb”." maxLength={60} value={values.personalization} onChange={(e) => set('personalization')(e.target.value)} error={errors.personalization} />

          <div className="field file-input">
            <label className="field__label" htmlFor="logo">
              Logo or artwork<span className="field__optional">(optional)</span>
            </label>
            <span className="field__hint" id="logo-hint">
              PNG, JPG, SVG or PDF up to 5 MB. Only used for your labels.
            </span>
            <input id="logo" type="file" accept={LOGO_TYPES.join(',')} aria-describedby="logo-hint" onChange={(e) => onLogo(e.target.files?.[0] ?? null)} />
            {logoError && (
              <span className="field__error" role="alert">
                {logoError}
              </span>
            )}
          </div>

          <TextArea label="Anything else?" optional maxLength={1000} value={values.notes} onChange={(e) => set('notes')(e.target.value)} error={errors.notes} />

          <CheckboxField label="You may contact me about this enquiry. (Required)" checked={values.consent === 'true'} onChange={(e) => set('consent')(e.target.checked ? 'true' : 'false')} error={errors.consent} />
          <CheckboxField label="Also send me occasional HuskySips news. (Optional)" checked={values.marketing === 'true'} onChange={(e) => set('marketing')(e.target.checked ? 'true' : 'false')} />

          <Honeypot value={honeypot} onChange={setHoneypot} />
          {turnstile.enabled && <div ref={turnstile.containerRef} />}
          <div className="form__actions">
            <Button type="submit" size="lg" disabled={state.kind === 'submitting'} icon="arrow">
              Send enquiry
            </Button>
            <span className="form__legal">We only collect what we need to reply.</span>
          </div>
        </>
      )}
      <FormStatus state={state} successTitle="Your enquiry has been received." successBody="We’ll check availability and reply with options and pricing. Nothing is booked until we confirm in writing." />
    </form>
  );
}
