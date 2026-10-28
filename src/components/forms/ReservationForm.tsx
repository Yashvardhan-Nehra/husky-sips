import { useState, type FormEvent } from 'react';
import type { PopUp, Recipe } from '@/config/types';
import { canPreorder } from '@/config/selectors';
import { submitForm } from '@/lib/submit';
import { emailOrPhone, mustBeChecked, positiveInt, required, validateFields, hasErrors, type Errors } from '@/lib/validation';
import { useFormTiming } from '@/lib/hooks';
import { track, EVENTS } from '@/lib/analytics';
import { formatDate, formatInr, formatWindow } from '@/lib/format';
import { TextField, CheckboxField, SelectField } from '@/components/ui/Field';
import { FormStatus, type FormState } from '@/components/ui/FormStatus';
import { Button } from '@/components/ui/Button';
import { Honeypot, UnavailableBanner, CONTACT_HINT } from './formShared';
import { useTurnstile } from './useTurnstile';

type Field = 'name' | 'contact' | 'recipe' | 'quantity' | 'consent';

/**
 * Reservation REQUEST for pickup at a configured pop-up. Checkout is not connected, so this
 * never shows a payment success — it asks for a reservation that is confirmed by a human.
 */
export function ReservationForm({ popUp, recipes }: { popUp: PopUp; recipes: Recipe[] }) {
  const [values, setValues] = useState<Record<Field, string>>({ name: '', contact: '', recipe: recipes[0]?.id ?? '', quantity: '1', consent: 'false' });
  const [errors, setErrors] = useState<Errors<Field>>({});
  const [honeypot, setHoneypot] = useState('');
  const [state, setState] = useState<FormState>({ kind: 'idle' });
  const [touched, setTouched] = useState(false);
  const startedAt = useFormTiming();
  const turnstile = useTurnstile(touched);
  const set = (k: Field) => (v: string) => setValues((s) => ({ ...s, [k]: v }));

  if (!canPreorder(popUp) || !popUp.preorder) return null;
  const { preorder } = popUp;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (state.kind === 'idle') track(EVENTS.RESERVATION_STARTED, { popUp: popUp.id });
    const errs = validateFields(values, {
      name: [required('Your name')],
      contact: [required('A contact method'), emailOrPhone],
      recipe: [required('A drink')],
      quantity: [required('Quantity'), positiveInt('Quantity')],
      consent: [mustBeChecked('Please confirm we may contact you to confirm the reservation.')],
    });
    setErrors(errs);
    if (hasErrors(errs)) return;
    setState({ kind: 'submitting' });
    const result = await submitForm('reservation-request', { popUpId: popUp.id, name: values.name.trim(), contact: values.contact.trim(), recipeId: values.recipe, quantity: Number(values.quantity), consent: true }, { startedAt: startedAt.current, honeypot, turnstileToken: turnstile.token });
    setState({ kind: 'done', result });
    if (result.ok) {
      track(EVENTS.RESERVATION_COMPLETED, { popUp: popUp.id, quantity: Number(values.quantity) });
      turnstile.reset();
    }
  }

  const done = state.kind === 'done' && state.result.ok;

  return (
    <form className="form card card--flat" onSubmit={onSubmit} noValidate onFocus={() => setTouched(true)} aria-labelledby={`reserve-${popUp.id}`}>
      <h4 id={`reserve-${popUp.id}`} style={{ margin: 0 }}>
        Reserve for pickup
      </h4>
      <p className="small muted" style={{ margin: 0 }}>
        {preorder.priceInr !== null && `${formatInr(preorder.priceInr)} per drink · `}
        {popUp.date && `${formatDate(popUp.date)} · `}
        {preorder.pickupWindow && `pickup ${formatWindow(preorder.pickupWindow)} · `}
        pay at pickup. Reservations close {preorder.cutoff ? formatDate(preorder.cutoff) : 'before the event'}.
      </p>
      <UnavailableBanner />
      {!done && (
        <>
          <div className="form__row form__row--2">
            <TextField label="Name" value={values.name} onChange={(e) => set('name')(e.target.value)} error={errors.name} autoComplete="name" />
            <TextField label="Contact" hint={CONTACT_HINT} value={values.contact} onChange={(e) => set('contact')(e.target.value)} error={errors.contact} />
          </div>
          <div className="form__row form__row--2">
            <SelectField label="Drink" value={values.recipe} onChange={(e) => set('recipe')(e.target.value)} error={errors.recipe}>
              {recipes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </SelectField>
            <TextField label="Quantity" type="number" inputMode="numeric" min={1} max={preorder.stockAllocated ?? undefined} value={values.quantity} onChange={(e) => set('quantity')(e.target.value)} error={errors.quantity} />
          </div>
          <CheckboxField label="You may contact me to confirm this reservation." checked={values.consent === 'true'} onChange={(e) => set('consent')(e.target.checked ? 'true' : 'false')} error={errors.consent} />
          <Honeypot value={honeypot} onChange={setHoneypot} />
          {turnstile.enabled && <div ref={turnstile.containerRef} />}
          <div className="form__actions">
            <Button type="submit" disabled={state.kind === 'submitting'} icon="arrow">
              Request reservation
            </Button>
          </div>
        </>
      )}
      <FormStatus state={state} successTitle="Reservation request received." successBody="We’ll confirm by message before the event. Payment happens at pickup — nothing has been charged." />
    </form>
  );
}
