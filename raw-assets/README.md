# raw-assets

Source material that scripts transform into web-ready files. Nothing in here is served directly.

- `images/` — supplied composite renders (illustrative, AI-generated). `npm run assets:images` writes
  responsive WebP/JPEG renditions to `public/assets/reference/`.
- `video/` — poster frames extracted from the approved episode masters (same script).
- `map/` — drop `india-soi.geojson` (DataMeet, Survey of India boundary, CC BY 4.0) here and run
  `npm run assets:map` to regenerate `src/data/india-map.ts`.

The composite renders are references, not product photographs. They are labelled "illustrative" wherever they appear.
