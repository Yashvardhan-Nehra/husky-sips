import { useEffect, useId, useState } from 'react';
import { siteConfig } from '@/config/site.config';
import { getFeaturedRecipe } from '@/config/selectors';
import { TextField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';

const MAX_TEXT = 60;
const MAX_LOGO_BYTES = 5 * 1024 * 1024;
const LOGO_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];

/**
 * Label preview for personalised event cans. The HuskySips identity and required product
 * information stay fixed; only the event text and an optional logo change. Nothing is uploaded —
 * the logo stays in the browser until the enquiry form sends it.
 */
export function LabelPreview({ onUseInEnquiry }: { onUseInEnquiry?: (text: string) => void }) {
  const [text, setText] = useState('Your occasion · Your name');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();
  const id = useId();
  const recipe = getFeaturedRecipe();
  const fssai = siteConfig.registration.fssaiNumber;

  useEffect(() => () => {
    if (logoUrl) URL.revokeObjectURL(logoUrl);
  }, [logoUrl]);

  function onLogo(file: File | null) {
    setError(undefined);
    if (logoUrl) URL.revokeObjectURL(logoUrl);
    if (!file) return setLogoUrl(null);
    if (!LOGO_TYPES.includes(file.type)) return setError('Use a PNG, JPG or SVG for the preview.');
    if (file.size > MAX_LOGO_BYTES) return setError('Keep the logo under 5 MB.');
    setLogoUrl(URL.createObjectURL(file));
  }

  const safeText = text.slice(0, MAX_TEXT);
  const line1 = safeText.length > 28 ? safeText.slice(0, safeText.lastIndexOf(' ', 28) > 8 ? safeText.lastIndexOf(' ', 28) : 28) : safeText;
  const line2 = safeText.slice(line1.length).trim();

  return (
    <div className="label-tool">
      <div className="label-preview">
        <svg className="label-svg" viewBox="0 0 420 300" role="img" aria-label={`Label preview reading ${safeText || 'your event text'}`}>
          <defs>
            <linearGradient id={`${id}-paper`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbf9f2" />
              <stop offset="100%" stopColor="#f1ead9" />
            </linearGradient>
            <clipPath id={`${id}-logo`}>
              <rect x="300" y="24" width="96" height="60" rx="8" />
            </clipPath>
          </defs>
          <rect x="4" y="4" width="412" height="292" rx="26" fill={`url(#${id}-paper)`} stroke="#183b2a" strokeOpacity="0.2" strokeWidth="2" />
          <rect x="18" y="18" width="384" height="264" rx="18" fill="none" stroke="#183b2a" strokeOpacity="0.14" strokeDasharray="4 6" />
          {/* HuskySips identity (fixed) */}
          <text className="label-brand" x="32" y="62" fontSize="30">
            Husky<tspan className="sips">Sips</tspan>
          </text>
          <text className="label-fine" x="34" y="80" fontSize="11">
            Sip the drink. Eat the fruit.
          </text>
          {/* Optional logo */}
          {logoUrl ? (
            <image href={logoUrl} x="300" y="24" width="96" height="60" preserveAspectRatio="xMidYMid meet" clipPath={`url(#${id}-logo)`} />
          ) : (
            <g>
              <rect x="300" y="24" width="96" height="60" rx="8" fill="#fff" stroke="#183b2a" strokeOpacity="0.2" strokeDasharray="3 4" />
              <text x="348" y="58" textAnchor="middle" className="label-fine">
                your logo
              </text>
            </g>
          )}
          {/* Event text */}
          <rect x="32" y="112" width="356" height="92" rx="14" fill="#183b2a" />
          <text className="label-event" x="210" y={line2 ? 150 : 164} textAnchor="middle" fontSize={line1.length > 22 ? 20 : 26} fill="#f7f3e8">
            {line1 || 'Your occasion · Your name'}
          </text>
          {line2 && (
            <text className="label-event" x="210" y="184" textAnchor="middle" fontSize={line2.length > 22 ? 18 : 22} fill="#f2c84b">
              {line2}
            </text>
          )}
          {/* Required product information (fixed) */}
          <text className="label-fine" x="32" y="232">
            {recipe ? recipe.name : 'Fruit Refresher'} · Fruit pieces inside · Keep refrigerated
          </text>
          <text className="label-fine" x="32" y="248">
            {siteConfig.pack.sizeLabel ?? 'Pack size TBC'} · Ingredients & batch on the Ingredients & Care page
          </text>
          <text className="label-fine" x="32" y="264">
            {fssai ? `FSSAI ${fssai}` : 'Registration details to be added once issued'} · Consume by: see batch sticker
          </text>
        </svg>
      </div>
      <div className="stack">
        <TextField label="Event text" hint={`Up to ${MAX_TEXT} characters. Keep names, dates and short messages.`} maxLength={MAX_TEXT} value={text} onChange={(e) => setText(e.target.value)} />
        <div className="field file-input">
          <label className="field__label" htmlFor={`${id}-file`}>
            Logo<span className="field__optional">(optional)</span>
          </label>
          <span className="field__hint">PNG, JPG or SVG. Stays on your device until you send the enquiry.</span>
          <input id={`${id}-file`} type="file" accept={LOGO_TYPES.join(',')} onChange={(e) => onLogo(e.target.files?.[0] ?? null)} />
          {error && (
            <span className="field__error" role="alert">
              {error}
            </span>
          )}
        </div>
        <p className="fine">The HuskySips mark and the product information lines stay on every label. The preview is approximate; final artwork is confirmed with your order.</p>
        {onUseInEnquiry && (
          <Button variant="secondary" icon="arrow" onClick={() => onUseInEnquiry(safeText)}>
            Use this text in my enquiry
          </Button>
        )}
      </div>
    </div>
  );
}
