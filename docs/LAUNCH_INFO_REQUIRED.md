# Information still required before public launch

Everything below is currently `null`, empty, or marked `draft` in `src/config/site.config.ts` (unless noted). The site shows honest empty states until each is filled.

## Product
1. **Approved base name** and **full ingredient list** (no proportions) — `catalog.bases[0]`, set `status: 'approved'`.
2. **Signature recipe(s)** — confirm name, fruits, taste description; set `status: 'approved'`. The draft "Watermelon Kiwi Refresher" is a placeholder.
3. **Pack size** (e.g. "330 ml can") — `pack.sizeLabel`.
4. **Price** — `pack.priceInr`.
5. **Availability** — `pack.availability` (`pop-up` once selling).
6. **Actual product photographs** — `recipes[].photo` (replaces the illustrative render in the hero, menu and poster).
7. **Allergen statement** per recipe — `recipes[].allergens`.
8. **Storage & consumption instructions** — `recipes[].storage` and `care.*` (preparation, storage, consume-within, batch identification). Do not state shelf life before testing.
9. **Claims** — enable `no-added-sugar` / `no-added-preservatives` only after formulation review, with `approvedOn` and `approvedBy`.

## Pop-ups & sales
10. **Confirmed pop-ups** — venue, city, date, selling window, menu — `popUps[]`. Only confirmed events are shown.
11. **Preorder settings** per event (stock, price, cutoff, pickup window) and `flags.preorders = true` if reservations should open.
12. **Verified sales records** — `sales.records` (public location only, fulfilled − refunded, verified flag) and `sales.lastVerifiedAt`. Leave `null` until tracking exists.
13. **Home base city** (public city only) — `homeBase`.

## Business
14. **Contact details** — email, WhatsApp, phone, Instagram, YouTube — `contact.*`.
15. **Legal name, registered address, FSSAI number** (once issued) — `registration.*`.
16. **Event capacity, service areas, chilled-delivery / staffed-counter availability** — `eventOrders.*`. Minimum order and deposit stay unset until decided.
17. **Policies**: confirm placeholders in Privacy, Terms, Pickup/Delivery/Cancellation; set `reviewed: true`.

## Brand assets
18. **Puppy logo file** (unchanged) and **mascot cut-out** — `public/assets/brand/`, then `brand.logo` / `brand.mascot`.
19. **Favicon and OG image** derived from the approved logo and a real photo.
20. **Approved episode cuts** — confirm which Episode 1 and Episode 2 files are final; set `episodes[].status = 'approved'`; host on a CDN.
21. **Real preparation photographs** for the Ingredients & Care page — `care.photos`.

## Technical
22. **Form backend endpoint** — `VITE_FORMS_ENDPOINT`.
23. **Analytics destination** — `VITE_ANALYTICS_ENDPOINT` or tag manager; name the provider in the Privacy page.
24. **Public site URL** — `VITE_SITE_URL`.
25. Optional: **Turnstile site key** — `VITE_TURNSTILE_SITE_KEY`.
