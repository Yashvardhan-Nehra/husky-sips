import { Notice } from '@/components/ui/Notice';

/** Shown on policy pages until the business has reviewed the text. */
export function ReviewBanner({ reviewed, lastUpdated }: { reviewed: boolean; lastUpdated: string | null }) {
  if (reviewed) {
    return lastUpdated ? <p className="fine">Last updated {lastUpdated}.</p> : null;
  }
  return (
    <Notice>
      <p>
        <strong>Draft — under business review.</strong> Highlighted items are placeholders. This text has not been approved for reliance and will be finalised before launch.
      </p>
    </Notice>
  );
}
