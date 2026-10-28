import type { ReactNode } from 'react';
import { isSubmissionAvailable } from '@/lib/submit';
import { Notice } from '@/components/ui/Notice';

/** Hidden honeypot field: bots fill it, humans never see it. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="honeypot" aria-hidden="true">
      <label htmlFor="website-url">Leave this field empty</label>
      <input id="website-url" name="website" type="text" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/** Honest banner shown when no backend is connected. The form still validates but cannot send. */
export function UnavailableBanner({ children }: { children?: ReactNode }) {
  if (isSubmissionAvailable()) return null;
  return (
    <Notice>
      <p>
        <strong>Form submissions aren’t connected yet.</strong> You can fill this in, but it won’t be sent until our enquiry inbox is live. {children}
      </p>
    </Notice>
  );
}

export const CONTACT_HINT = 'Email or phone number (with country code if outside India).';
