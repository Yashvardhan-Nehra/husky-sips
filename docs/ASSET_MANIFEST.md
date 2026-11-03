# Asset manifest

## 1. Assembly-stage layers (scroll animation)

Stage viewBox: **420 × 560** units. Export rasters at 2× (840 × 1120 canvas) with transparent backgrounds.
Each layer currently renders from a built-in vector illustration. To replace one, drop the file in
`public/assets/stage/` and set `src` for that layer in `src/assets/stage-manifest.ts`.

| Layer id | What | Size (units) | Format | Status |
| --- | --- | --- | --- | --- |
| `pedestal` | Dark green stone pedestal with baked shadow | 300 × 90 | PNG alpha | vector fallback in use |
| `container-back` | Empty transparent can, back wall only | 180 × 330 | PNG alpha | vector fallback in use |
| `liquid` | Rendered pour sequence (24–48 frames) or single fill plate | 160 × 300 | image sequence | vector fill animates |
| `pour-stream` | Soft-edged vertical stream | 40 × 240 | PNG alpha | vector fallback in use |
| `fruit:watermelon` | Watermelon cube, edible portion size | 64 × 64 | PNG alpha | vector fallback in use |
| `fruit:kiwi` | Kiwi slice | 64 × 64 | PNG alpha | vector fallback in use |
| `fruit:pineapple` | Pineapple wedge (only if in a recipe) | 72 × 64 | PNG alpha | vector fallback in use |
| `fruit:orange` | Orange segment (only if in a recipe) | 64 × 56 | PNG alpha | vector fallback in use |
| `fruit:coconut` | Tender coconut chunk (only if in a recipe) | 60 × 56 | PNG alpha | vector fallback in use |
| `extra:mint` | Mint sprig (only if recipe has an extra) | 60 × 48 | PNG alpha | vector fallback in use |
| `extra:chia` | Chia seeds (only if recipe has an extra) | 60 × 40 | PNG alpha | vector fallback in use |
| `container-front` | Front highlights, reflection, condensation | 180 × 330 | PNG alpha | vector fallback in use |
| `lid` | Separate metal lid, seated pose | 190 × 50 | PNG alpha | vector fallback in use |
| `poster` | Finished-product poster (static / reduced motion) | 1080 × 1440 | WebP/JPG | **illustrative render in use — needs real photo** |
| `static-steps` | Reduced-motion step list | — | rendered by `StaticAssembly` | done |

Only the fruit in the selected signature recipe is animated. Timing (percent of section scroll):
0–15 container floats in · 15–35 pour · 35–65 fruit, one at a time · 65–78 extra (or "future feature" copy) ·
78–90 lid · 90–100 hero pose. Reverses naturally on scroll-up. `prefers-reduced-motion` shows the static version.

## 2. Reference artwork (supplied, illustrative)

Source PNGs (1086 × 1448) in `raw-assets/images/`, renditions in `public/assets/reference/` via `npm run assets:images`.
These are AI/3D composites. They are labelled "Illustrative" everywhere they appear and must never stand in for
product photos, hygiene evidence, customer reactions or facilities.

| File | Used on |
| --- | --- |
| `pedestal` | Home hero, menu card, poster (until a real photo exists) |
| `impossible-angle` | Story hero |
| `kiwi-citrus-splash` | Events hero |
| `levitating`, `golden-splash`, `sage-splash`, `watermelon-splash` | available, currently unused |

Not used on purpose: "pops out over an Indian street" and "anamorphic billboard" (imply advertising deployments that have not happened).

## 3. Brand

| File | Status |
| --- | --- |
| Puppy logo (existing, unchanged lettering) | supplied — `public/assets/brand/huskysips-logo.png` (background removed, 512px) |
| Mascot cut-out (puppy only, transparent) | supplied — `public/assets/brand/huskysips-mascot.png`, a head-only crop of the logo artwork |
| Favicon from the logo mark | supplied — `public/favicon.png` + `public/apple-touch-icon.png`, cropped from the logo |
| Fonts | self-hosted: Fredoka (display), Nunito (body) — `public/fonts/`, OFL |

## 4. Video

| Episode | Master used | Web file | Poster |
| --- | --- | --- | --- |
| 1 | `HuskySips_Episode_01_Final_Revised.mp4` (latest by date) | `public/media/episode-01-540p.mp4` (54 MB) | `episode-01-poster` (faceless) |
| 2 | `HuskySips_EP2_SoftVoice_MovingHusky_HD.mp4` (per README: latest) | `public/media/episode-02-540p.mp4` (48 MB) | `episode-02-poster` |

Captions are burned in; transcripts from the SRT files are shown as text. Video loads only on click (`preload="metadata"` after play).
**Confirm which cut is approved** and host the files on a CDN/video platform (see integration checklist) — the 540p files are still heavy for mobile.

## 5. Map

`src/data/india-map.ts` — India outline from DataMeet (`Country/india-soi.geojson`, Survey of India boundaries), CC BY 4.0, simplified
to 2.3 k points (27 KB). Regenerate with `npm run assets:map` after dropping a new GeoJSON in `raw-assets/map/`.
Attribution is printed under the map.
