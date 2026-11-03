import { forwardRef, useId, type CSSProperties, type ReactElement } from 'react';
import type { Base, Extra, Fruit } from '@/config/types';
import { EXTRA_SLOT, FRUIT_SLOTS, STAGE, finalLevel, liquidOffsetFor } from './stageLayout';
import { derivePalette, getIngredientPalette } from '@/config/palette';

export type StagePose = 'animated' | 'final' | 'empty';

interface Props {
  base: Base | null;
  fruits: Fruit[];
  extra: Extra | null;
  /** 'animated' leaves initial transforms to the timeline; 'final' / 'empty' render fixed poses. */
  pose?: StagePose;
  compact?: boolean;
  title?: string;
}

const DEFAULT_LIQUID = { top: '#f6d98a', bottom: '#eeb06a' };

/** Stage greens follow the global brand palette (deep forest → almost-black green). */
const STAGE_COLORS = {
  bgCenter: '#2b5240',
  bgMid: '#1b3a2b',
  bgEdge: '#0c1812',
  pedestalTop: '#2e6246',
  pedestalSheen: '#3b7557',
  pedestalFrom: '#27503b',
  pedestalTo: '#0f221a',
  speckle: '#a8b89a',
  metal: ['#9a9e94', '#eceee6', '#bdc0b4', '#8c9088'],
} as const;

/* Fruit vectors take their main fills from the ingredient palettes so illustration and UI agree. */
const WATERMELON = getIngredientPalette('watermelon');
const KIWI = getIngredientPalette('kiwi');
const PINEAPPLE = getIngredientPalette('pineapple');
const ORANGE = getIngredientPalette('orange');
const COCONUT = getIngredientPalette('coconut');
const MINT = getIngredientPalette('mint');

/* ---------- Fruit vectors (edible-portion sized, ~56 units) ---------- */

function WatermelonCube() {
  return (
    <g>
      <path d="M-26 -22 h46 a6 6 0 0 1 6 6 v40 a6 6 0 0 1 -6 6 h-46 a6 6 0 0 1 -6 -6 v-40 a6 6 0 0 1 6 -6z" fill={WATERMELON.secondary} />
      <path d="M-26 -22 h46 a6 6 0 0 1 6 6 v6 h-58 v-6 a6 6 0 0 1 6 -6z" fill="#ef6a6c" opacity="0.9" />
      <path d="M-32 22 h58 a0 0 0 0 1 0 0 v2 a6 6 0 0 1 -6 6 h-46 a6 6 0 0 1 -6 -6z" fill="#cfe3a6" />
      <path d="M-32 26 h58 v2 a6 6 0 0 1 -6 6 h-46 a6 6 0 0 1 -6 -6z" fill={WATERMELON.leaf} opacity="0.85" />
      <ellipse cx="-13" cy="2" rx="2.2" ry="3.4" fill="#2b1b1b" transform="rotate(-35 -13 2)" />
      <ellipse cx="6" cy="-9" rx="2.2" ry="3.4" fill="#2b1b1b" transform="rotate(25 6 -9)" />
      <ellipse cx="10" cy="12" rx="1.9" ry="3" fill="#2b1b1b" transform="rotate(-60 10 12)" />
      <path d="M-20 -14 q8 -4 16 0" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
}

function KiwiSlice() {
  const seeds = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return <ellipse key={i} cx={Math.cos(a) * 15} cy={Math.sin(a) * 15} rx="1.8" ry="2.8" fill="#2a2a2a" transform={`rotate(${(a * 180) / Math.PI + 90} ${Math.cos(a) * 15} ${Math.sin(a) * 15})`} />;
  });
  return (
    <g>
      <circle r="29" fill="#8b6a3a" />
      <circle r="26.5" fill={KIWI.secondary} />
      <circle r="22" fill="#a9d35c" />
      <ellipse rx="8" ry="10" fill="#efe9c6" />
      {seeds}
      <path d="M-14 -16 q10 -8 22 -2" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
}

function PineappleWedge() {
  return (
    <g>
      <path d="M-30 24 L0 -26 L30 24 Z" fill={PINEAPPLE.secondary} />
      <path d="M-24 22 L0 -16 L24 22 Z" fill="#f7d978" opacity="0.6" />
      <g stroke="#d9a429" strokeWidth="1.5" opacity="0.8">
        <path d="M-16 8 L16 8 M-22 18 L22 18 M-8 -6 L8 -6" />
      </g>
      <g fill="#7a5a2a">
        <circle cx="-8" cy="12" r="1.6" />
        <circle cx="8" cy="12" r="1.6" />
        <circle cx="0" cy="0" r="1.6" />
        <circle cx="-14" cy="20" r="1.4" />
        <circle cx="14" cy="20" r="1.4" />
      </g>
      <path d="M-30 24 L30 24 L30 28 L-30 28 Z" fill="#c98a2b" />
    </g>
  );
}

function OrangeSegment() {
  return (
    <g>
      <path d="M-30 6 A30 30 0 0 1 30 6 Z" fill={ORANGE.secondary} />
      <path d="M-26 6 A26 26 0 0 1 26 6 Z" fill="#fde3b5" />
      <path d="M-23 6 A23 23 0 0 1 23 6 Z" fill="#f7a93a" />
      <g stroke="#fde3b5" strokeWidth="1.6">
        <path d="M0 6 L0 -17 M0 6 L-12 -14 M0 6 L12 -14 M0 6 L-20 -5 M0 6 L20 -5" />
      </g>
      <path d="M-18 -8 q8 -8 18 -6" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
}

function CoconutChunk() {
  return (
    <g>
      <path d="M-26 -10 q10 -18 30 -14 q20 4 20 20 q-2 18 -18 20 q-24 4 -32 -8 q-6 -8 0 -18z" fill={COCONUT.primary} />
      <path d="M-22 -8 q10 -14 26 -11 q16 4 16 16 q-2 14 -15 16 q-20 3 -27 -6 q-5 -6 0 -15z" fill="#fbf7ee" />
      <path d="M-14 -2 q10 -6 22 -2" stroke="#e8dfcd" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
}

function MintSprig() {
  return (
    <g>
      <path d="M0 18 L0 -4" stroke="#3f7a32" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M0 -2 q-20 -2 -24 -22 q20 -2 24 22z" fill={MINT.secondary} />
      <path d="M0 -2 q20 -2 24 -22 q-20 -2 -24 22z" fill="#4c8a3a" />
      <path d="M-4 -6 q-8 -6 -14 -14 M4 -6 q8 -6 14 -14" stroke="#2f5f27" strokeWidth="1.2" fill="none" />
    </g>
  );
}

function ChiaSeeds() {
  const seeds = Array.from({ length: 16 }, (_, i) => <ellipse key={i} cx={((i * 37) % 48) - 24} cy={((i * 23) % 18) - 9} rx="1.6" ry="2.4" fill="#2d2a2a" transform={`rotate(${(i * 53) % 180})`} />);
  return <g>{seeds}</g>;
}

const FRUIT_VECTORS: Record<string, () => ReactElement> = {
  watermelon: WatermelonCube,
  kiwi: KiwiSlice,
  pineapple: PineappleWedge,
  orange: OrangeSegment,
  coconut: CoconutChunk,
};
const EXTRA_VECTORS: Record<string, () => ReactElement> = {
  mint: MintSprig,
  chia: ChiaSeeds,
};

function GenericPiece() {
  return <circle r="24" fill={PINEAPPLE.secondary} stroke={PINEAPPLE.primary} strokeWidth="2" />;
}

/* ---------- Scene ---------- */

export const StageScene = forwardRef<SVGSVGElement, Props>(function StageScene({ base, fruits, extra, pose = 'animated', compact = false, title }, ref) {
  const uid = useId().replace(/:/g, '');
  const colors = base?.liquidColor ?? DEFAULT_LIQUID;
  const palette = derivePalette([...fruits.map((f) => f.id), extra?.id]);
  const isFinal = pose === 'final';
  const isEmpty = pose === 'empty';
  const level = isFinal ? finalLevel(fruits.length, !!extra) : 0;
  const liquidY = liquidOffsetFor(level);
  const { body, inner, neck, lid } = STAGE;
  const label = title ?? `Illustration of a HuskySips drink${fruits.length ? ` with ${fruits.map((f) => f.name.toLowerCase()).join(' and ')}` : ''}`;

  return (
    <svg ref={ref} className={['stage-svg', compact ? 'stage-svg--compact' : ''].join(' ').trim()} viewBox={`0 0 ${STAGE.width} ${STAGE.height}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label={label} focusable="false">
      <defs>
        <radialGradient id={`${uid}-bg`} cx="50%" cy="32%" r="70%">
          <stop offset="0%" stopColor={STAGE_COLORS.bgCenter} />
          <stop offset="55%" stopColor={STAGE_COLORS.bgMid} />
          <stop offset="100%" stopColor={STAGE_COLORS.bgEdge} />
        </radialGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.secondary} stopOpacity="0.5" />
          <stop offset="100%" stopColor={palette.secondary} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-liquid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.top} />
          <stop offset="100%" stopColor={colors.bottom} />
        </linearGradient>
        <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="75%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={`${uid}-metal`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={STAGE_COLORS.metal[0]} />
          <stop offset="30%" stopColor={STAGE_COLORS.metal[1]} />
          <stop offset="55%" stopColor={STAGE_COLORS.metal[2]} />
          <stop offset="100%" stopColor={STAGE_COLORS.metal[3]} />
        </linearGradient>
        <linearGradient id={`${uid}-pedestal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={STAGE_COLORS.pedestalFrom} />
          <stop offset="100%" stopColor={STAGE_COLORS.pedestalTo} />
        </linearGradient>
        <clipPath id={`${uid}-inner`}>
          <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} rx={inner.rx} />
        </clipPath>
        <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* background */}
      <rect width={STAGE.width} height={STAGE.height} rx="28" fill={`url(#${uid}-bg)`} />

      {/* hero glow — revealed at the end */}
      <ellipse data-layer="glow" cx={STAGE.centerX} cy="300" rx="190" ry="220" fill={`url(#${uid}-glow)`} opacity={isFinal ? 1 : 0} />

      {/* pedestal */}
      <g data-layer="pedestal">
        <ellipse cx={STAGE.centerX} cy="528" rx="150" ry="18" fill="#000" opacity="0.35" filter={`url(#${uid}-soft)`} />
        <path d={`M ${STAGE.centerX - 132} ${STAGE.pedestalTopY} h 264 v 34 a 132 20 0 0 1 -264 0 z`} fill={`url(#${uid}-pedestal)`} />
        <ellipse cx={STAGE.centerX} cy={STAGE.pedestalTopY} rx="132" ry="20" fill={STAGE_COLORS.pedestalTop} />
        <ellipse cx={STAGE.centerX} cy={STAGE.pedestalTopY} rx="120" ry="15" fill={STAGE_COLORS.pedestalSheen} opacity="0.5" />
        <g fill={STAGE_COLORS.speckle} opacity="0.25">
          <circle cx="120" cy="474" r="1.2" />
          <circle cx="160" cy="482" r="1" />
          <circle cx="250" cy="486" r="1.4" />
          <circle cx="300" cy="476" r="1" />
          <circle cx="210" cy="490" r="0.9" />
          <circle cx="190" cy="470" r="1.1" />
        </g>
        <ellipse data-layer="contact-shadow" cx={STAGE.centerX} cy={STAGE.pedestalTopY - 2} rx="90" ry="9" fill="#000" opacity={isEmpty ? 0 : 0.35} />
      </g>

      {/* product group: container + contents + lid */}
      <g data-layer="product" style={{ transformOrigin: `${STAGE.centerX}px ${STAGE.pedestalTopY}px`, transformBox: 'view-box' } as CSSProperties}>
        {/* container back wall */}
        <g data-layer="container-back">
          <rect x={body.x} y={body.y} width={body.w} height={body.h} rx={body.rx} fill="#ffffff" fillOpacity="0.07" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="2" />
          <rect x={neck.x} y={neck.y} width={neck.w} height={neck.h} rx="7" fill="#ffffff" fillOpacity="0.06" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="2" />
          <g stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1.2">
            <path d={`M ${neck.x + 6} ${neck.y + 8} h ${neck.w - 12} M ${neck.x + 6} ${neck.y + 16} h ${neck.w - 12}`} />
          </g>
          <ellipse cx={STAGE.centerX} cy={body.y + body.h - 4} rx={body.w / 2 - 8} ry="6" fill="#ffffff" fillOpacity="0.08" />
        </g>

        {/* liquid (clipped to inner body) */}
        <g clipPath={`url(#${uid}-inner)`}>
          <g data-layer="liquid" style={{ transform: `translateY(${liquidY}px)` }}>
            <g data-layer="wave">
              <path
                d={`M ${inner.x - 80} ${inner.y} q 20 -7 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 V ${inner.y + inner.h + 40} H ${inner.x - 80} Z`}
                fill={`url(#${uid}-liquid)`}
              />
              <path d={`M ${inner.x - 80} ${inner.y} q 20 -7 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0`} fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2" />
            </g>
          </g>
          {/* pour stream */}
          <rect data-layer="pour" x={STAGE.centerX - 8} y="-20" width="16" height={inner.y + inner.h + 20} rx="8" fill={colors.top} opacity="0" />
        </g>
        {/* pour stream above the neck (outside clip) */}
        <rect data-layer="pour-top" x={STAGE.centerX - 8} y="-20" width="16" height={inner.y + 20} rx="8" fill={colors.top} opacity="0" />

        {/* splash droplets ride with the liquid level */}
        <g data-layer="splash" style={{ transform: `translateY(${liquidY}px)` }} opacity="0">
          {[-26, -14, 0, 12, 24, 34].map((dx, i) => (
            <ellipse key={i} data-layer="droplet" cx={STAGE.centerX + dx} cy={inner.y - 2} rx={i % 2 ? 2.6 : 3.4} ry={i % 2 ? 3.6 : 4.4} fill={colors.top} opacity="0.95" />
          ))}
        </g>

        {/* fruit pieces */}
        {fruits.map((fruit, i) => {
          const slot = FRUIT_SLOTS[i % FRUIT_SLOTS.length]!;
          const Vector = FRUIT_VECTORS[fruit.id] ?? GenericPiece;
          const style: CSSProperties = isFinal ? { transform: `translate(${slot.x}px, ${slot.y}px) rotate(${slot.r}deg)` } : isEmpty ? { opacity: 0 } : {};
          return (
            <g key={fruit.id + i} data-layer={`fruit:${fruit.id}`} data-slot={i} style={style}>
              <Vector />
            </g>
          );
        })}

        {/* optional extra */}
        {extra && (
          <g data-layer={`extra:${extra.id}`} style={isFinal ? { transform: `translate(${EXTRA_SLOT.x}px, ${EXTRA_SLOT.y}px) rotate(${EXTRA_SLOT.r}deg)` } : isEmpty ? { opacity: 0 } : {}}>
            {(EXTRA_VECTORS[extra.id] ?? GenericPiece)()}
          </g>
        )}

        {/* container front highlights */}
        <g data-layer="container-front">
          <rect x={body.x} y={body.y} width={body.w} height={body.h} rx={body.rx} fill={`url(#${uid}-glass)`} />
          <rect x={body.x + 14} y={body.y + 16} width="12" height={body.h - 40} rx="6" fill="#ffffff" opacity="0.28" />
          <rect x={body.x + body.w - 22} y={body.y + 30} width="5" height={body.h - 70} rx="3" fill="#ffffff" opacity="0.18" />
          <g data-layer="condensation" opacity={isFinal ? 0.7 : 0} fill="#ffffff">
            {[
              [150, 230, 2.2],
              [162, 300, 1.6],
              [145, 360, 2.6],
              [270, 250, 1.8],
              [262, 330, 2.4],
              [280, 400, 1.6],
              [200, 440, 2],
              [236, 420, 1.4],
              [175, 395, 1.5],
              [255, 290, 1.3],
            ].map(([cx, cy, r], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} />
            ))}
          </g>
        </g>

        {/* lid */}
        <g data-layer="lid" style={isFinal ? {} : { opacity: 0, transform: 'translateY(-90px)' }}>
          <rect x={lid.x} y={lid.y} width={lid.w} height={lid.h} rx="11" fill={`url(#${uid}-metal)`} />
          <rect x={lid.x + 6} y={lid.y + 4} width={lid.w - 12} height="6" rx="3" fill="#ffffff" opacity="0.5" />
          <rect x={lid.x + 10} y={lid.y + lid.h - 4} width={lid.w - 20} height="3" rx="1.5" fill="#000" opacity="0.25" />
        </g>
      </g>
    </svg>
  );
});
