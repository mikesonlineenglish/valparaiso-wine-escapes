# Site facts to confirm

Facts flagged during development because the source copy didn't state them clearly enough
to put in structured data (schema.org) without guessing. Fill in and tell Claude, or edit
directly in the referenced data file.

## Winery addressLocality (src/data/wineries.ts)

These three wineries' copy doesn't say which locality/comuna the actual winery estate
sits in (only which valley they source grapes from, which isn't the same thing), so
`addressLocality` was left out of their entries rather than guessed:

- **Emiliana Organic Vineyards** (`slug: "emiliana"`) — farms across six valleys; which one
  is the visitor-facing estate in?
- **Matetic Vineyards** (`slug: "matetic"`) — estate is in the Rosario Valley, but that's a
  valley name, not an official comuna. Is it Lo Abarca, or another named locality?
- **Morandé** (`slug: "morande"`) — text describes Pablo Morandé's history planting in
  Casablanca Valley and fruit sourced from five valleys, but doesn't say where the winery's
  own cellar/estate is today.

Once you confirm, add `addressLocality: "..."` to that winery's object in
[src/data/wineries.ts](../src/data/wineries.ts).
