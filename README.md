# Cognitif Group Limited — website

Static site: Home, Semantic Bathymetry™, Petalyx™, Technology, About Us, Privacy Statement.
Plain HTML/CSS/JS, no build step, no framework. Deploys to Vercel as-is.

## Before you publish
Open `privacy.html` and fill in `[insert date]` near the top, plus the cookie and
retention sections once those are decided.

One editorial call worth knowing about: on Home and About, I kept the "no personal
data / no consent mechanism" claims from your pitch deck copy, but reworded the
"no data controller liability" line to "designed to contain no personal data" rather
than asserting the liability conclusion outright — that's a legal conclusion, not a
design fact, and you've got the ICO Innovation Advice case open on exactly this
question. Worth a look before publishing regardless of what I did with it.

## Deploying to Vercel (free tier)
Same as before: push this folder to your GitHub repo (Add file → Upload files,
overwrite everything), Vercel redeploys automatically. If the domain's already
connected, no further Vercel/GoDaddy steps are needed.

## File structure
```
index.html                   Home
semantic-bathymetry.html     Semantic Bathymetry™
petalyx.html                 Petalyx™
technology.html               Technology (four-layer architecture)
about.html                   About Us + IP
privacy.html                 Privacy Statement
assets/css/style.css         All styling
assets/js/main.js            Mobile nav toggle only
assets/img/                  Logo, favicon, and diagrams from your materials
vercel.json                  Caching + security headers
```
