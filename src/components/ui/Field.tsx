import { useId, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface BaseProps {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}

function Label({ id, label, optional }: { id: string; label: string; optional?: boolean }) {
  return (
    <label className="field__label" htmlFor={id}>
      {label}
      {optional && <span className="field__optional">(optional)</span>}
    </label>
  );
}

function describedBy(hintId: string, errorId: string, hint?: string, error?: string) {
  return [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;
}

export function TextField({ label, hint, error, optional, id: givenId, ...rest }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  const autoId = useId();
  const id = givenId ?? autoId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  return (
    <div className={['field', error ? 'field--error' : ''].join(' ').trim()}>
      <Label id={id} label={label} optional={optional} />
      {hint && (
        <span className="field__hint" id={hintId}>
          {hint}
        </span>
      )}
      <input id={id} className="field__input" aria-invalid={error ? true : undefined} aria-describedby={describedBy(hintId, errorId, hint, error)} required={!optional} {...rest} />
      {error && (
        <span className="field__error" id={errorId} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export function TextArea({ label, hint, error, optional, id: givenId, maxLength, value, ...rest }: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const autoId = useId();
  const id = givenId ?? autoId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const len = typeof value === 'string' ? value.length : 0;
  return (
    <div className={['field', error ? 'field--error' : ''].join(' ').trim()}>
      <Label id={id} label={label} optional={optional} />
      {hint && (
        <span className="field__hint" id={hintId}>
          {hint}
        </span>
      )}
      <textarea id={id} className="field__textarea" aria-invalid={error ? true : undefined} aria-describedby={describedBy(hintId, errorId, hint, error)} maxLength={maxLength} value={value} required={!optional} {...rest} />
      {maxLength && (
        <span className="field__count" aria-live="polite">
          {len}/{maxLength}
        </span>
      )}
      {error && (
        <span className="field__error" id={errorId} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export function SelectField({ label, hint, error, optional, id: givenId, children, ...rest }: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const autoId = useId();
  const id = givenId ?? autoId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  return (
    <div className={['field', error ? 'field--error' : ''].join(' ').trim()}>
      <Label id={id} label={label} optional={optional} />
      {hint && (
        <span className="field__hint" id={hintId}>
          {hint}
        </span>
      )}
      <select id={id} className="field__select" aria-invalid={error ? true : undefined} aria-describedby={describedBy(hintId, errorId, hint, error)} required={!optional} {...rest}>
        {children}
      </select>
      {error && (
        <span className="field__error" id={errorId} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export function CheckboxField({ label, error, id: givenId, ...rest }: { label: React.ReactNode; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const autoId = useId();
  const id = givenId ?? autoId;
  const errorId = `${id}-error`;
  return (
    <div className={['field', error ? 'field--error' : ''].join(' ').trim()}>
      <label className={['check', error ? 'check--error' : ''].join(' ').trim()} htmlFor={id}>
        <input type="checkbox" id={id} aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined} {...rest} />
        <span>{label}</span>
      </label>
      {error && (
        <span className="field__error" id={errorId} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
