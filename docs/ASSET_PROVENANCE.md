# Asset Provenance

- `public/header-guitar.jpg`, `public/icon-portrait.jpg` and
  `public/projects/*.png`: pre-existing repository assets. Their original
  licensing and authorship remain with the repository owner; not independently
  established in this continuation.
- `public/hero-guitar-wide.webp`: redesign asset already present on continuation.
  Exact production history was not retained in the checkpoint; do not claim
  verified photography authorship or AI generation provenance.
- `public/noise.png`: texture already present on continuation. Exact production
  history was not retained. Used solely as a decorative raster texture.
- `public/models/guitar.glb`: "ibanez jem guitar" by **abazibiz**, from
  [Sketchfab](https://sketchfab.com/3d-models/ibanez-jem-guitar-daeadd913644438aa3096bb357a02016),
  licensed **CC-BY-4.0** — attribution is required by the licence, so this entry
  is not optional bookkeeping. The same credit is embedded in the file itself
  (`asset.extras.author`, `asset.extras.source`). Shipped upright by
  `scripts/upright-guitar-glb.mjs`, which rewrites the GLB JSON chunk in place so
  the embedded textures survive. Consumed by
  `src/components/hero/IdentityObject.tsx` as the particle source asset.

  Two things to know before touching it:

  - The `scripts/*.mjs` pipeline that produced the current file is
    `transform-guitar-glb.mjs` → `upright-guitar-glb.mjs`, and the second one
    mutates the asset **in place**. It is not idempotent: running it twice wraps
    the rotation a second time.
  - `scripts/generate-guitar-glb.mjs` writes a *different* guitar — a
    self-contained procedural low-poly body with no textures and no third-party
    licence — to the **same path**. Running it silently replaces the CC-BY asset.
    That is the one to reach for if the 4 MB download ever needs to go away.
