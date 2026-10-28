import { useState, type FormEvent } from 'react';
import { submitForm } from '@/lib/submit';
import { emailOrPhone, required, validateFields, hasErrors, mustBeChecked, type Errors } from '@/lib/validation';
import { useFormTiming } from '@/lib/hooks';
import { track, EVENTS } from '@/lib/analytics';
import { TextField, CheckboxField } from '@/components/ui/Field';
import { FormStatus, type FormState } from '@/components/ui/FormStatus';
import { Button } from '@/components/ui/Button';
import { Honeypot, UnavailableBanner, CONTACT_HINT } from './formShared';
import { useTurnstile } from './useTurnstile';

type Field = 'contact' | 'city' | 'consent';

export function UpdatesForm({ title = 'Get launch updates' }: { title?: string }) {
  const [values, setValues] = useState<Record<Field, string>>({ contact: '', city: '', consent: 'false' });
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
      contact: [required('A contact method'), emailOrPhone],
      consent: [mustBeChecked('Please confirm we may contact you about the launch.')],
    });
    setErrors(errs);
    if (hasErrors(errs)) return;
    setState({ kind: 'submitting' });
    const result = await submitForm('launch-updates', { contact: values.contact.trim(), city: values.city.trim() || null, consent: true }, { startedAt: startedAt.current, honeypot, turnstileToken: turnstile.token });
    setState({ kind: 'done', result });
    if (result.ok) {
      track(EVENTS.UPDATES_SIGNUP_SUBMITTED, { city: values.city.trim() || null });
      setValues({ contact: '', city: '', consent: 'false' });
      turnstile.reset();
    }
  }

  const done = state.kind === 'done' && state.result.ok;

  return (
    <form className="form card" id="updates" onSubmit={onSubmit} noValidate onFocus={() => setTouched(true)} aria-labelledby="updates-title">
      <h3 id="updates-title" style={{ margin: 0 }}>
        {title}
      </h3>
      <p className="muted" style={{ margin: 0 }}>
        We’ll message you once when the next pop-up is confirmed.
      </p>
      <UnavailableBanner />
      {!done && (
        <>
          <TextField label="How should we reach you?" hint={CONTACT_HINT} value={values.contact} onChange={(e) => set('contact')(e.target.value)} error={errors.contact} autoComplete="email" inputMode="email" />
          <TextField label="Your city" optional value={values.city} onChange={(e) => set('city')(e.target.value)} autoComplete="address-level2" />
          <CheckboxField label="Yes, send me a message when a pop-up near me is confirmed." checked={values.consent === 'true'} onChange={(e) => set('consent')(e.target.checked ? 'true' : 'false')} error={errors.consent} />
          <Honeypot value={honeypot} onChange={setHoneypot} />
          {turnstile.enabled && <div ref={turnstile.containerRef} />}
          <div className="form__actions">
            <Button type="submit" disabled={state.kind === 'submitting'} icon="arrow">
              Keep me posted
            </Button>
          </div>
        </>
      )}
      <FormStatus state={state} successTitle="You’re on the list." successBody="We’ll be in touch when a pop-up date is confirmed." />
    </form>
  );
}
