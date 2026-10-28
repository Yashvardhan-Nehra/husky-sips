export type Rule = (value: string) => string | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Indian mobile numbers (10 digits, optionally +91 / 0 prefix) or general international numbers. */
const PHONE_RE = /^(\+?\d[\d\s-]{7,15}\d)$/;

export const required =
  (label = 'This field'): Rule =>
  (v) =>
    v.trim() ? null : `${label} is required.`;

export const maxLen =
  (n: number, label = 'This field'): Rule =>
  (v) =>
    v.length <= n ? null : `${label} must be ${n} characters or fewer.`;

export const email: Rule = (v) => (!v.trim() || EMAIL_RE.test(v.trim()) ? null : 'Enter a valid email address.');

export const phone: Rule = (v) => {
  const t = v.trim();
  if (!t) return null;
  const digits = t.replace(/\D/g, '');
  if (!PHONE_RE.test(t) || digits.length < 10 || digits.length > 15) return 'Enter a valid phone number.';
  return null;
};

/** Accepts an email or a phone number — used for "contact method". */
export const emailOrPhone: Rule = (v) => {
  const t = v.trim();
  if (!t) return null;
  if (EMAIL_RE.test(t)) return null;
  return phone(t) === null ? null : 'Enter an email address or phone number we can reach you on.';
};

export const isoDateNotPast: Rule = (v) => {
  if (!v) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return 'Enter a valid date.';
  return d < today ? 'Choose a date from today onwards.' : null;
};

export const positiveInt =
  (label = 'Quantity'): Rule =>
  (v) => {
    if (!v.trim()) return null;
    const n = Number(v);
    return Number.isInteger(n) && n > 0 ? null : `${label} must be a whole number above zero.`;
  };

export const mustBeChecked =
  (message: string): Rule =>
  (v) =>
    v === 'true' ? null : message;

export type Errors<T extends string> = Partial<Record<T, string>>;

export function validateFields<T extends string>(values: Record<T, string>, rules: Partial<Record<T, Rule[]>>): Errors<T> {
  const errors: Errors<T> = {};
  for (const key of Object.keys(rules) as T[]) {
    const list = rules[key] ?? [];
    const value = values[key] ?? '';
    for (const rule of list) {
      const err = rule(value);
      if (err) {
        errors[key] = err;
        break;
      }
    }
  }
  return errors;
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean);
}
