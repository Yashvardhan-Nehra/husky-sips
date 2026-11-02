# Brand assets (required before launch)

Place the approved files here and point `brand` in `src/config/site.config.ts` at them.

| File | Purpose | Notes |
| --- | --- | --- |
| `huskysips-logo.svg` (or `.png` @2x) | Header + footer logo | The existing puppy-with-can logo, unchanged lettering. |
| `huskysips-mascot.png` (transparent, ≥ 320px) | Small brand character for loading, empty and confirmation states | Must be the existing puppy. Never shown handling food. |
| `huskysips-wordmark.svg` | Optional: lettering only, for the label preview tool | Only if it exists as a separate approved file. |

`huskysips-logo.png` (full lockup, transparent background) and `huskysips-mascot.png` (head-only crop of the same artwork) are in place and referenced from the config. The footer keeps the text wordmark because the logo's brown lettering would not read on the dark green footer. If a wordmark file is missing the site falls back to the text wordmark; if the mascot is removed it falls back to a neutral paw placeholder.
