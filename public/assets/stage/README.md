# Assembly-stage assets

The scroll-driven assembly scene currently uses built-in vector layers (illustrative).
To swap in rendered or photographic layers, export each layer as a transparent PNG/WebP at the
sizes listed in `docs/ASSET_MANIFEST.md`, drop it here, and set its `src` in
`src/assets/stage-manifest.ts`. Layers with a `src` are drawn as images; layers without one fall
back to the vector illustration.
