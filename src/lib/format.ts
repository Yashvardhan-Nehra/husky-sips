const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const NUM = new Intl.NumberFormat('en-IN');
const DATE = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
const DATE_SHORT = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export function formatInr(n: number): string {
  return INR.format(n);
}
export function formatNumber(n: number): string {
  return NUM.format(n);
}
export function formatDate(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  return Number.isNaN(d.getTime()) ? iso : DATE.format(d);
}
export function formatDateShort(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  return Number.isNaN(d.getTime()) ? iso : DATE_SHORT.format(d);
}
function to12h(hhmm: string): string {
  const [hStr = '0', m = '00'] = hhmm.split(':');
  const h = Number(hStr);
  const suffix = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === '00' ? `${h12} ${suffix}` : `${h12}:${m} ${suffix}`;
}
export function formatWindow(w: { start: string; end: string }): string {
  return `${to12h(w.start)} – ${to12h(w.end)}`;
}
export function daysUntil(iso: string, now: Date = new Date()): number {
  const d = new Date(`${iso}T00:00:00`);
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - start.getTime()) / 86_400_000);
}
