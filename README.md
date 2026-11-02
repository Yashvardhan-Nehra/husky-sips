# HuskySips — website

**Sip the drink. Eat the fruit.** Launch site for HuskySips, an early-stage Indian fruit-drink brand.

React 19 + TypeScript + Vite, GSAP ScrollTrigger for the scroll-linked assembly, no CSS framework.
Everything a non-developer may need to change lives in one config file and a handful of content files.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173 — drafts visible, forms post to a local dev handler
npm run build      # type-check + production build to dist/
npm run preview    # serve dist/ locally
npm test           # unit tests (vitest)
npm run assets:images   # regenerate responsive images from raw-assets/
```

Node 22+ required.

## Where things live

| Need to change… | Edit |
| --- | --- |
| Base, fruits, recipes, pack size, price, availability, claims, pop-ups, sales, contact, registration, care info, event capacity, episodes, feature flags | `src/config/site.config.ts` |
| Privacy / Terms / Pickup policy text | `src/content/policies.ts` |
| FAQs | `src/content/faqs.ts` |
| Story copy, milestones, transcripts | `src/content/story.ts` |
| Animation layer assets | `src/assets/stage-manifest.ts` + `public/assets/stage/` |
| Brand logo / mascot files | `public/assets/brand/` (then set `brand.logo` / `brand.mascot` in the config) |
| Colours, type, spacing | `src/styles/tokens.css` |
| Recipe / ingredient colour palettes | `src/config/palette.ts` |
| Environment (form endpoint, analytics, Turnstile, site URL) | `.env.local` (copy from `.env.example`) |

## Honesty rules (enforced by the code)

- Anything unknown is `null` or `[]` in the config and renders an honest empty state. Nothing is invented.
- Content carries a `status`. `draft` items show only in `vite dev` (or with `VITE_PREVIEW_DRAFTS=true`) and always carry a "Draft · awaiting approval" badge. A production build with no approved recipe shows "being finalised", not a made-up product.
- Claims such as "No added sugar" render only when `enabled: true` **and** `approvedOn` is set.
- Preordering appears only when `flags.preorders` is on and the pop-up has stock, price, cutoff and pickup window configured. Checkout is not connected: the flow is a reservation *request* and never shows a payment success.
- Forms never pretend to send. Without `VITE_FORMS_ENDPOINT` they show an "not connected yet" state. Success appears only after a 2xx response.
- Sales totals come from verified records only (fulfilled − refunded; bulk counted once). `records: null` is reported as "not tracked", never as zero.
- Policy pages show a "draft — under business review" banner until `reviewed: true`.

## Docs

- `docs/ASSET_MANIFEST.md` — every animation layer, image and video, with sizes and what still needs supplying.
- `docs/INTEGRATION_CHECKLIST.md` — forms backend, analytics, spam protection, hosting, video hosting, fonts, map data.
- `docs/LAUNCH_INFO_REQUIRED.md` — the concise list of facts still needed before public launch.
- `docs/CONTENT_GUIDE.md` — writing rules, colour contrast table, claim rules, reduced-motion behaviour.

## Routes

`/` Home · `/menu` · `/find-us` · `/events` · `/story` · `/ingredients-and-care` · `/faqs` · `/contact` · `/privacy` · `/terms` · `/pickup-delivery-cancellation`

Single-page app: configure the host to serve `index.html` for unknown paths (see the integration checklist).
