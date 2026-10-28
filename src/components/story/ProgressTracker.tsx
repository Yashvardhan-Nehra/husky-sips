import { useMemo } from 'react';
import { siteConfig } from '@/config/site.config';
import { progressPercent, summarizeSales } from '@/lib/sales';
import { formatDateShort, formatNumber, daysUntil } from '@/lib/format';

/** Verified progress toward the goal. Never animates past the real number; untracked ≠ zero. */
export function ProgressTracker() {
  const { goal, sales } = siteConfig;
  const summary = useMemo(() => summarizeSales(sales.records), [sales.records]);
  const total = summary.status === 'ok' ? summary.total : 0;
  const pct = progressPercent(total, goal.targetCans);
  const days = daysUntil(goal.deadline);

  return (
    <div className="progress" role="group" aria-label="Progress toward the goal">
      <div className="progress__nums">
        <div>
          <span className="progress__big">{summary.status === 'untracked' ? '—' : formatNumber(total)}</span>
          <div className="small muted">verified paid cans</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="progress__big">{formatNumber(goal.targetCans)}</span>
          <div className="small muted">goal by {formatDateShort(goal.deadline)}</div>
        </div>
      </div>
      <div className="progress__bar" role="progressbar" aria-valuemin={0} aria-valuemax={goal.targetCans} aria-valuenow={summary.status === 'untracked' ? undefined : total} aria-valuetext={summary.status === 'untracked' ? 'Sales tracking not yet connected' : `${total} of ${goal.targetCans} cans`}>
        <div className="progress__fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="small muted" style={{ margin: 0 }}>
        {summary.status === 'untracked' && 'Sales tracking is not connected yet — this is not a zero, it is unknown.'}
        {summary.status === 'none' && 'The journey starts here. No paid cans yet.'}
        {summary.status === 'ok' && `${pct.toFixed(0)}% of the way.`}
        {days > 0 ? ` ${days} days to go.` : days === 0 ? ' Today is the deadline.' : ' Deadline passed.'}
        {sales.lastVerifiedAt && ` Verified ${formatDateShort(sales.lastVerifiedAt)}.`}
        {!sales.live && summary.status !== 'untracked' && ' Updated manually.'}
      </p>
    </div>
  );
}
