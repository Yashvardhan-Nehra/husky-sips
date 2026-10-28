# Integration checklist

Work through these before `npm run build` is deployed publicly.

## Forms (required)
- [ ] Provide a backend or form service that accepts `POST` JSON and replies `2xx` with `{"ok":true,"id":"…"}`.
      Payload shape: `{ kind, submittedAt, turnstileToken, ...fields }` where `kind` ∈
      `event-enquiry | community-request | launch-updates | future-range-interest | reservation-request`.
      Event enquiries may include `logo: { name, type, size, dataUrl }` (≤ 5 MB).
- [ ] Set `VITE_FORMS_ENDPOINT` in `.env.local` / hosting env. Until then the site shows an honest "not connected" state.
- [ ] Rate-limit and validate server-side (never trust the client); store only what the privacy policy says.
- [ ] Send a receipt/notification to the HuskySips inbox; reply manually — nothing is auto-confirmed.
- [ ] In dev, submissions are appended to `.local/submissions.jsonl` by the Vite dev handler (git-ignored).

## Spam protection
- [x] Honeypot field + minimum fill time (2.5 s) — client side, built in.
- [ ] Optional: Cloudflare Turnstile — set `VITE_TURNSTILE_SITE_KEY`; verify the token server-side with the secret key.

## Analytics
- [ ] Either push `window.dataLayer` into your tag manager, or set `VITE_ANALYTICS_ENDPOINT` (JSON beacon).
      Events: `menu_viewed`, `popup_selected`, `reservation_started`, `reservation_completed` (request received, not a sale),
      `event_enquiry_submitted`, `future_range_interest_submitted`, `community_request_submitted`, `updates_signup_submitted`,
      `saved_sip_shared`, `episode_played`. No event is ever treated as a sale.
- [ ] Update the Privacy page with the provider actually used.

## Hosting
- [ ] Static host (Netlify, Vercel, Cloudflare Pages, S3+CloudFront…). SPA fallback: serve `index.html` for all routes.
- [ ] Set `VITE_SITE_URL` to the public origin (used for canonical/share links).
- [ ] Headers: `Content-Security-Policy` (self + fonts self + `challenges.cloudflare.com` if Turnstile + media CDN),
      `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, HSTS.
- [ ] Cache: immutable for `/assets/*` hashed files; `no-store` on form endpoints.
- [ ] Video: host `episode-*.mp4` on a CDN or an unlisted video platform and update `episodes[].video.src`;
      the local files are git-ignored. Consider 720p + adaptive if a platform is used.
- [ ] Favicon / OG image: replace `public/favicon.svg` and set an **absolute** `og:image` URL in `index.html` once the logo and a real product photo exist.

## Content & config
- [ ] Fill `src/config/site.config.ts` per `docs/LAUNCH_INFO_REQUIRED.md`; set `status: 'approved'` only after review.
- [ ] Set `flags.previewDrafts` to `false` for production (default `'dev'` already hides drafts in builds).
- [ ] Review policies (`src/content/policies.ts`) and set `reviewed: true` with `lastUpdated`.
- [ ] Verify the India map renders correctly for your audience; the boundary data follows Survey of India.

## Performance checks
- [ ] Run Lighthouse on mobile: targets LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. The hero image is preloaded and sized; GSAP loads lazily.
- [ ] Confirm the hero `<picture>` renditions exist (`npm run assets:images`) before deploying.

## Accessibility checks
- [ ] Keyboard-only pass of header, forms, map pins (Enter/Space), builder, label tool.
- [ ] Screen-reader pass: form errors announce; success/error status regions announce.
- [ ] `prefers-reduced-motion` shows the static assembly with the skip link.
