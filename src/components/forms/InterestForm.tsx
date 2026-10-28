import { useState, type FormEvent } from 'react';
import type { FutureRange } from '@/config/types';
import { submitForm } from '@/lib/submit';
import { emailOrPhone, required, validateFields, hasErrors, type Errors } from '@/lib/validation';
import { useFormTiming } from '@/lib/hooks';
import { track, EVENTS } from '@/lib/analytics';
import { TextField, SelectField } from '@/components/ui/Field';
import { FormStatus, type FormState } from '@/components/ui/FormStatus';
import { Button } from '@/components/ui/Button';
import { Honeypot, UnavailableBanner, CONTACT_HINT } from './formShared';
import { useTurnstile } from './useTurnstile';

type Field = 'range' | 'contact';

/** Notification interest for future ranges — not an order. */
export function InterestForm({ ranges }: { ranges: FutureRange[] }) {
  const [values, setValues] = useState<Record<Field, string>>({ range: ranges[0]?.id ?? '', contact: '' });
  const [errors, setErrors] = useState<Errors<Field>>({});
  const [honeypot, setHoneypot] = useState('');
  const [state, setState] = useState<FormState>({ kind: 'idle' });
  const [touched, setTouched] = useState(false);
  const startedAt = useFormTiming();
  const turnstile = useTurnstile(touched);
  const set = (k: Field) => (v: string) => setValues((s) => ({ ...s, [k]: v }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validateFields(values, { range: [required('A range')], contact: [required('A contact method'), emailOrPhone] });
    setErrors(errs);
    if (hasErrors(errs)) return;
    setState({ kind: 'submitting' });
    const result = await submitForm('future-range-interest', { range: values.range, contact: values.contact.trim() }, { startedAt: startedAt.current, honeypot, turnstileToken: turnstile.token });
    setState({ kind: 'done', result });
    if (result.ok) {
      track(EVENTS.FUTURE_RANGE_INTEREST_SUBMITTED, { range: values.range });
      setValues((s) => ({ ...s, contact: '' }));
      turnstile.reset();
    }
  }

  const done = state.kind === 'done' && state.result.ok;

  return (
    <form className="form card card--flat" onSubmit={onSubmit} noValidate onFocus={() => setTouched(true)} aria-labelledby="interest-title">
      <h3 id="interest-title" style={{ margin: 0 }}>
        Tell me when a range launches
      </h3>
      <p className="muted" style={{ margin: 0 }}>
        A notification, not an order. These ranges are in development and have no date yet.
      </p>
      <UnavailableBanner />
      {!done && (
        <>
          <SelectField label="Which range?" value={values.range} onChange={(e) => set('range')(e.target.value)} error={errors.range}>
            {ranges.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </SelectField>
          <TextField label="Contact" hint={CONTACT_HINT} value={values.contact} onChange={(e) => set('contact')(e.target.value)} error={errors.contact} />
          <Honeypot value={honeypot} onChange={setHoneypot} />
          {turnstile.enabled && <div ref={turnstile.containerRef} />}
          <div className="form__actions">
            <Button type="submit" variant="secondary" disabled={state.kind === 'submitting'}>
              Notify me
            </Button>
          </div>
        </>
      )}
      <FormStatus state={state} successTitle="Noted." successBody="We’ll let you know if and when that range is ready." />
    </form>
  );
}
