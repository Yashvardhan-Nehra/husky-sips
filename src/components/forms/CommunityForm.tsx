import { useState, type FormEvent } from 'react';
import { submitForm } from '@/lib/submit';
import { emailOrPhone, maxLen, required, validateFields, hasErrors, type Errors } from '@/lib/validation';
import { useFormTiming } from '@/lib/hooks';
import { track, EVENTS } from '@/lib/analytics';
import { TextField, TextArea, CheckboxField } from '@/components/ui/Field';
import { FormStatus, type FormState } from '@/components/ui/FormStatus';
import { Button } from '@/components/ui/Button';
import { Honeypot, UnavailableBanner, CONTACT_HINT } from './formShared';
import { useTurnstile } from './useTurnstile';

type Field = 'city' | 'venue' | 'contact' | 'notify';

/** "Bring HuskySips to my community" — a request, never a confirmed location. */
export function CommunityForm() {
  const [values, setValues] = useState<Record<Field, string>>({ city: '', venue: '', contact: '', notify: 'false' });
  const [errors, setErrors] = useState<Errors<Field>>({});
  const [honeypot, setHoneypot] = useState('');
  const [state, setState] = useState<FormState>({ kind: 'idle' });
  const [touched, setTouched] = useState(false);
  const startedAt = useFormTiming();
  const turnstile = useTurnstile(touched);
  const set = (k: Field) => (v: string) => setValues((s) => ({ ...s, [k]: v }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validateFields(values, {
      city: [required('City'), maxLen(80, 'City')],
      venue: [maxLen(240, 'Venue idea')],
      contact: [emailOrPhone],
    });
    setErrors(errs);
    if (hasErrors(errs)) return;
    setState({ kind: 'submitting' });
    const result = await submitForm('community-request', { city: values.city.trim(), venue: values.venue.trim() || null, contact: values.contact.trim() || null, notify: values.notify === 'true' }, { startedAt: startedAt.current, honeypot, turnstileToken: turnstile.token });
    setState({ kind: 'done', result });
    if (result.ok) {
      track(EVENTS.COMMUNITY_REQUEST_SUBMITTED, { city: values.city.trim() });
      setValues({ city: '', venue: '', contact: '', notify: 'false' });
      turnstile.reset();
    }
  }

  const done = state.kind === 'done' && state.result.ok;

  return (
    <form className="form card" id="community" onSubmit={onSubmit} noValidate onFocus={() => setTouched(true)} aria-labelledby="community-title" tabIndex={-1}>
      <h3 id="community-title" style={{ margin: 0 }}>
        Bring HuskySips to my community
      </h3>
      <p className="muted" style={{ margin: 0 }}>
        Tell us where you’d like to see a pop-up. Requests help us plan — they are not confirmed locations.
      </p>
      <UnavailableBanner />
      {!done && (
        <>
          <TextField label="City" value={values.city} onChange={(e) => set('city')(e.target.value)} error={errors.city} autoComplete="address-level2" />
          <TextArea label="Venue or event idea" optional hint="A market, campus, office park, run club…" maxLength={240} value={values.venue} onChange={(e) => set('venue')(e.target.value)} error={errors.venue} />
          <TextField label="Contact" optional hint={`Only if you’d like a reply. ${CONTACT_HINT}`} value={values.contact} onChange={(e) => set('contact')(e.target.value)} error={errors.contact} />
          <CheckboxField label="Let me know if a pop-up is confirmed in this city." checked={values.notify === 'true'} onChange={(e) => set('notify')(e.target.checked ? 'true' : 'false')} />
          <Honeypot value={honeypot} onChange={setHoneypot} />
          {turnstile.enabled && <div ref={turnstile.containerRef} />}
          <div className="form__actions">
            <Button type="submit" disabled={state.kind === 'submitting'} icon="pin" variant="accent">
              Send request
            </Button>
          </div>
        </>
      )}
      <FormStatus state={state} successTitle="Request received." successBody="Thanks — we read every one when planning where to go next." />
    </form>
  );
}
