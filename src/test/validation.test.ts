import { describe, expect, it } from 'vitest';
import { email, emailOrPhone, hasErrors, isoDateNotPast, maxLen, mustBeChecked, phone, positiveInt, required, validateFields } from '@/lib/validation';

describe('validators', () => {
  it('required rejects blank strings', () => {
    expect(required('Name')('  ')).toMatch(/required/);
    expect(required('Name')('Tarun')).toBeNull();
  });
  it('email accepts valid and blank, rejects invalid', () => {
    expect(email('')).toBeNull();
    expect(email('a@b.co')).toBeNull();
    expect(email('not-an-email')).not.toBeNull();
  });
  it('phone accepts Indian numbers with or without +91', () => {
    expect(phone('9876543210')).toBeNull();
    expect(phone('+91 98765 43210')).toBeNull();
    expect(phone('12345')).not.toBeNull();
  });
  it('emailOrPhone accepts either', () => {
    expect(emailOrPhone('hello@huskysips.in')).toBeNull();
    expect(emailOrPhone('+919876543210')).toBeNull();
    expect(emailOrPhone('nope')).not.toBeNull();
  });
  it('maxLen enforces a limit', () => {
    expect(maxLen(3)('abcd')).not.toBeNull();
    expect(maxLen(3)('abc')).toBeNull();
  });
  it('positiveInt only accepts whole numbers above zero', () => {
    expect(positiveInt()('0')).not.toBeNull();
    expect(positiveInt()('2.5')).not.toBeNull();
    expect(positiveInt()('12')).toBeNull();
  });
  it('isoDateNotPast rejects yesterday', () => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    expect(isoDateNotPast(y.toISOString().slice(0, 10))).not.toBeNull();
    expect(isoDateNotPast('2999-01-01')).toBeNull();
    expect(isoDateNotPast('garbage')).not.toBeNull();
  });
  it('mustBeChecked requires "true"', () => {
    expect(mustBeChecked('tick it')('false')).toBe('tick it');
    expect(mustBeChecked('tick it')('true')).toBeNull();
  });
});

describe('validateFields', () => {
  it('returns the first failing rule per field', () => {
    const errors = validateFields({ name: '', contact: 'x' }, { name: [required('Name'), maxLen(5)], contact: [emailOrPhone] });
    expect(errors.name).toMatch(/required/);
    expect(errors.contact).toBeTruthy();
    expect(hasErrors(errors)).toBe(true);
    expect(hasErrors({})).toBe(false);
  });
});
