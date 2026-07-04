# Cognitif Group Limited — website

## Important: caching fix in this version
vercel.json previously set a 1-year immutable cache on all /assets/ files, including
the CSS. That's likely why earlier fixes didn't visibly take effect — browsers and
Vercel's edge could keep serving the old stylesheet after redeploy. Fixed: images keep
the long cache (they're safe to cache hard since filenames change when replaced), but
CSS/JS now revalidate every time, and the stylesheet is linked with ?v=2 to force a
fresh fetch regardless of what's cached. If you edit the CSS again in future, bump that
version number (?v=3, etc.) to guarantee it isn't served stale.

## What changed this round
- Removed the "Attractors and repulsion trenches / Reading the signature" section from
  the Semantic Bathymetry page.
- Technology page: back to four cards, same size and format (Petalyx, Ontologos, Semba,
  Insightvault). The two images were removed last round because the ".ai" suffix was
  baked into the picture itself, not because of anything else.
- About page: removed the IP Protected panel, added the founder photo.

## Deploying
Push this folder to your GitHub repo (Add file → Upload files, overwrite everything).
Vercel redeploys automatically.
