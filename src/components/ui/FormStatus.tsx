import type { SubmitResult } from '@/lib/submit';
import { Icon } from './Icon';
import { Mascot } from './Mascot';

export type FormState = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'done'; result: SubmitResult };

const ERROR_COPY: Record<Exclude<SubmitResult, { ok: true }>['reason'], string> = {
  unavailable: 'Enquiries are not connected yet. Please use the contact details on the Contact page, or check back soon.',
  spam: 'We could not accept that submission. Please check the form and try again.',
  network: 'We could not reach our server. Check your connection and try again — nothing was sent.',
  server: 'Something went wrong on our side and your message was not received. Please try again in a moment.',
  invalid: 'Something in the form was not accepted. Please review the fields and try again.',
};

export function FormStatus({ state, successTitle, successBody }: { state: FormState; successTitle: string; successBody: string }) {
  if (state.kind === 'idle') return <div aria-live="polite" />;
  if (state.kind === 'submitting') {
    return (
      <div className="form-status form-status--pending" role="status" aria-live="polite">
        <Mascot size="sm" bounce label="Sending" />
        <p>Sending…</p>
      </div>
    );
  }
  const { result } = state;
  if (result.ok) {
    return (
      <div className="form-status form-status--success" role="status" aria-live="polite">
        <Mascot size="sm" label="Received" />
        <div>
          <p>
            <strong>{successTitle}</strong>
          </p>
          <p>{successBody}</p>
          {result.id && <p className="small">Reference: {result.id.slice(0, 8)}</p>}
        </div>
      </div>
    );
  }
  const unavailable = result.reason === 'unavailable';
  return (
    <div className={['form-status', unavailable ? 'form-status--unavailable' : 'form-status--error'].join(' ')} role="alert">
      <Icon name="info" />
      <p>{ERROR_COPY[result.reason]}</p>
    </div>
  );
}
