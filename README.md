# Cognitif Group Limited — website

Static site: Home, Semantic Bathymetry™, Petalyx™, Technology, About Us, Privacy Statement.
Plain HTML/CSS/JS, no build step, no framework, no external font loading, no analytics.

## What changed in this version
- Removed Google Fonts — system fonts only (Georgia / Arial), same everywhere.
- Unified the two shades of navy into one.
- Removed the two images (layer pipeline, chart room) that had ".ai" suffixes baked into
  the picture itself — replaced with plain HTML cards. Cropped the six-coordinates image
  to remove its baked-in "Semba.ai" subtitle.
- Rewrote the Privacy Statement to state what you told me is actually true: this site
  collects no personal data, shares nothing, transfers nothing internationally. Removed
  the placeholder brackets and the leftover "before publishing" note that should never
  have shipped.
- Removed the duplicated address/company number from the footer on the About page (kept
  it once, in the body).
- Added the topographic background to every page's hero, not just Home.

## Deploying
Push this folder to your GitHub repo (Add file → Upload files, overwrite everything).
Vercel redeploys automatically. Domain and DNS are already configured per your last steps.
