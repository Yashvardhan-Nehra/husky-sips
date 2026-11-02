import { INDIA_OUTLINE_PATH, INDIA_PROJECTION, INDIA_VIEWBOX } from '@/data/india-map';

export type PinKind = 'popup' | 'sales' | 'home';

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  label: string;
  kind: PinKind;
  /** Secondary text for the accessible name, e.g. "confirmed · 15 Nov" or "120 cans". */
  detail?: string;
}

export function project(lat: number, lng: number): { x: number; y: number } {
  const { minLon, pad, sx, sy, yTop } = INDIA_PROJECTION;
  const mercY = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  return { x: pad + (lng - minLon) * sx, y: pad + (yTop - mercY) * sy };
}

/** Marker colours come from the global tokens in src/styles/tokens.css. */
const PIN_COLORS: Record<PinKind, string> = { popup: 'var(--map-popup)', sales: 'var(--map-sales)', home: 'var(--map-home)' };

interface Props {
  pins: MapPin[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  title: string;
}

/**
 * India outline (Survey of India boundary via DataMeet, CC BY 4.0) with city-level pins.
 * Purely presentational; the list beside it is the accessible, keyboard-first alternative.
 */
export function IndiaMap({ pins, selectedId = null, onSelect, title }: Props) {
  const { width, height } = INDIA_VIEWBOX;
  return (
    <div>
      <svg className="india-map" viewBox={`0 0 ${width} ${height}`} role="group" aria-label={title}>
        <title>{title}</title>
        <path className="india-map__land" d={INDIA_OUTLINE_PATH} />
        {pins.map((pin) => {
          const { x, y } = project(pin.lat, pin.lng);
          const selected = pin.id === selectedId;
          const color = PIN_COLORS[pin.kind];
          const name = `${pin.label}${pin.detail ? `, ${pin.detail}` : ''}`;
          return (
            <g key={pin.id} className="india-map__pin" transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`} role={onSelect ? 'button' : undefined} tabIndex={onSelect ? 0 : undefined} aria-label={name} aria-pressed={onSelect ? selected : undefined} onClick={() => onSelect?.(pin.id)} onKeyDown={(e) => {
              if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onSelect(pin.id);
              }
            }}>
              <circle className="ring" r={selected ? 22 : 14} style={{ fill: color }} opacity={0.18} />
              <circle className="core" r={selected ? 9 : 7} style={{ fill: color, stroke: 'var(--surface)' }} strokeWidth={2.5} />
              <text x={14} y={5}>
                {pin.label}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="map-attribution">
        Boundary data: India boundaries by DataMeet India community (Survey of India), CC BY 4.0. Pins show public venues and cities only.
      </p>
    </div>
  );
}
