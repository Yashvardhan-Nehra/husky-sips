# Content & design guide

## Voice
Warm, plain, specific. Short sentences. Say what is true today; say "to be confirmed" when it is not.
Never imply nationwide delivery, vending, unlimited customization, or on-site preparation.
An enquiry is a request, never a booking. A click is never a sale.

## Claims
- "No added sugar" and "No added preservatives" are controlled claims (`claims[]`). They render only when `enabled` **and** `approvedOn` are set. The sugar claim always carries "Contains naturally occurring sugars."
- Never add diabetes, detox, weight-loss, skin, immunity, low-sugar or fibre claims.
- Taste words (crisp, citrus-forward, mellow, fruity) only when they match the recipe.

## Colour (checked contrast on cream #F7F4E9)
Global identity = deep green + green-black + warm off-white. Tokens live in `src/styles/tokens.css`.

| Token | Hex | Ratio on cream | Use |
| --- | --- | --- | --- |
| `--ink` | #1A2420 | 14.5 : 1 | body text |
| `--forest` | #142B21 | 13.7 : 1 | headings, primary buttons (cream text 13.7 : 1) |
| `--forest-2` | #243B2D | — | hover on forest, moss surfaces |
| `--forest-3` | #0C1812 | — | deepest surfaces (stage, video player) |
| `--muted` | #4F5D55 | 6.3 : 1 | secondary text |
| `--sage-ink` | #566A4A | 5.4 : 1 | small green text, eyebrows, wordmark accent |
| `--sage` | #A8B89A | forest text 7.2 : 1 | accents on forest, highlight badges; never small text on cream |
| `--sage-tint` | #E6EADF | — | supporting sections, info surfaces |
| `--cream-deep` | #EDE7D5 | — | chips, tabs, alternate surfaces |
| `--neutral` | #B7B7AA | — | dividers, inactive marks |
| `--warn-ink` on `--warn-tint` | #5C4812 / #F1E7CC | 7.1 : 1 | draft and review notices |
| `--danger-ink` | #8A2E27 | 7.6 : 1 | errors; `--danger` #9A3B33 fills take warm-white text (6.8 : 1) |

Never use sage, leaf or any ingredient "secondary" colour for small body text on cream.

### Recipe palettes
Each drink is coloured from its own ingredients (`src/config/palette.ts`). The strongest pigment leads, the next supports, and any leafy ingredient becomes the botanical accent. Palettes are injected as `--rp-*` custom properties on the recipe card, the assembly and the hero; everything else stays in the global palette.

| Recipe / ingredient | Primary | Secondary | Botanical | Backgrounds |
| --- | --- | --- | --- | --- |
| ABC Juice (pinned) | #8F2038 burgundy | #B83250 beet red | #567A43 amla green | #F8F1E4 cream · #F1DDE0 blush |
| Watermelon Kiwi (derived) | #B9383A | #E35D5B | #4A7324 kiwi | #F8F1E4 · #F8E1DE |
| Carrot | #B35A12 | #E88732 | #567A43 | #FBE8D4 |
| Lemon | #7D6E0C | #F3D94A | #6E9A4F | #FBF4C9 |
| Cucumber | #3F7A4F | #A8D08D | #3F7A4F | #E5F0E3 |
| Ginger | #8F6B2E | #D7B46A | #6E9A4F | #F4EAD6 |
| Pineapple | #9C6A0E | #F2C14E | #4F7A3A | #FBEFC9 |

Rules enforced by `src/test/palette.test.ts`: primary/hover fills carry warm-white text at ≥ 4.5 : 1; ink shades read at ≥ 4.5 : 1 on cream and on their tint; headings fall back to the ink shade when the primary is too light.

## Type
Fredoka (display, 500–700) for headings and buttons; Nunito (body) for everything else. No handwritten body text, no thin weights.

## Motion
- Scroll-linked assembly uses normal scrolling (sticky stage, GSAP scrub). No scroll hijacking, no autoplay audio, no flashing.
- `prefers-reduced-motion`: static poster + numbered steps + skip link.
- Mascot: small, in loading/empty/confirmation states only. Never handling food or in the preparation area.

## Images
- Every supplied render is `illustrative: true` and badged "Illustrative"; real photographs are `illustrative: false`.
- Always give `width`/`height`/`aspect` so space is reserved (CLS).
