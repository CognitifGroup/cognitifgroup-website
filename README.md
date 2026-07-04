# Cognitif Group Limited — website

Static site. Five pages: Home, Semantic Bathymetry™, Petalyx™, About Us, Privacy Statement.
No build step, no framework — plain HTML/CSS/JS. Deploys to Vercel as-is.

## Before you deploy — fill in the placeholders

Two files have bracketed placeholders that must be replaced with real information.
Do this before the site goes live; don't ship it with placeholders in.

**`privacy.html`**
- `[insert ICO registration number]` (appears twice) — your actual ICO register entry number. If Cognitif Group Limited isn't yet registered as a fee-payer with the ICO, do that first at ico.org.uk — it's a legal requirement for most UK organisations processing personal data, separate from the ICO Innovation Advice case.
- `[insert registered office address]` (appears twice) — the address on the Companies House record for Company No. 17154680.
- `[insert date]` / `[insert version]` — when you publish it.
- The cookie and retention sections currently say what's missing rather than inventing numbers — fill those in once your analytics/retention decisions are actually made.

**`assets/js` / footer** — the contact address is set to `info@cognitifgroup.ai` throughout. Change it in each HTML file (footer, and the two `mailto:` buttons) if you want a different mailbox, and make sure that mailbox actually exists and is monitored before publishing.

## Deploying to Vercel (free tier)

You said you're on the free tier already, so this assumes an existing Vercel account.

### Step 1 — Get the code into a Git repository

Vercel deploys from Git (GitHub, GitLab, or Bitbucket). Easiest path with GitHub:

1. Create a new empty repository on GitHub, e.g. `cognitifgroup-website`. Don't add a README/license from GitHub's side — you already have this folder.
2. On your machine, inside this folder, run:
   ```
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/cognitifgroup-website.git
   git push -u origin main
   ```

If you'd rather not use Git at all, Vercel also supports dragging a folder straight into the dashboard (see Step 2, option B) — but Git is worth doing anyway, since it gives you version history and automatic redeploys whenever you push a change.

### Step 2 — Import the project into Vercel

**Option A — via GitHub (recommended):**
1. Go to vercel.com/new.
2. Click "Import" next to the `cognitifgroup-website` repo (authorise Vercel's GitHub app if it asks).
3. Framework Preset: leave it as "Other" — there's no framework here, just static files.
4. Build command: leave blank. Output directory: leave blank (root). There's nothing to build.
5. Click **Deploy**.

**Option B — drag and drop (no Git):**
1. Install the Vercel CLI: `npm i -g vercel`.
2. From inside this folder, run `vercel`. Follow the prompts (log in, confirm the project name, confirm the directory). It'll give you a live `*.vercel.app` URL in under a minute.
3. Run `vercel --prod` when you're happy, to promote it to the production URL.

Either way, you'll land on a working site at something like `cognitifgroup-website.vercel.app`.

### Step 3 — Point cognitifgroup.ai at it

You said the domain is registered with GoDaddy. Two ways to connect it; use whichever you're more comfortable with.

**Option A — point nameservers at Vercel (simplest, but Vercel then manages all your DNS, including any existing email records)**

Given you've already migrated mail to Migadu on this domain, **don't do this one without also re-adding your Migadu MX/SPF/DKIM records inside Vercel's DNS panel** — switching nameservers wipes out GoDaddy-side DNS and email will stop working until those records exist on the new side. Given that risk, Option B below is the safer default for you.

**Option B — keep GoDaddy DNS, just add records for the site (recommended in your case)**

1. In the Vercel dashboard, open the project → **Settings → Domains**.
2. Type `cognitifgroup.ai` and click **Add**.
3. Vercel will show you one or two DNS records to create — typically an `A` record for the root domain (`@`) pointing at `76.76.21.21`, and/or a `CNAME` for `www` pointing at `cname.vercel-dns.com`. Use exactly what Vercel shows you in your dashboard at the time — these values are occasionally revised, and screenshots in guides go stale.
4. Log into GoDaddy → **My Products → DNS** for cognitifgroup.ai.
5. Add the record(s) Vercel gave you. Leave your existing Migadu MX, SPF, and DKIM records untouched — you're only adding the new A/CNAME entries, not replacing anything mail-related.
6. Back in Vercel, wait for the domain status to flip from "Invalid Configuration" to "Valid" — this can take a few minutes up to a few hours depending on DNS propagation.
7. Vercel issues an SSL certificate automatically once the domain validates. No action needed there.

### Step 4 — Confirm

Once the domain shows "Valid" in Vercel:
- Visit `https://cognitifgroup.ai` and check all five pages load and the nav works.
- Send yourself a test email to whatever address the site's Contact links point at, to confirm mail still works post-DNS-change.
- Check the site on a phone — the nav collapses to a menu button under ~780px width.

## Making changes later

- Edit the HTML/CSS directly — there's no build step.
- If you deployed via GitHub: commit and push; Vercel redeploys automatically.
- If you deployed via CLI: run `vercel --prod` again from this folder.

## File structure

```
index.html                   Home
semantic-bathymetry.html     Semantic Bathymetry™
petalyx.html                 Petalyx™
about.html                   About Us
privacy.html                 Privacy Statement
assets/css/style.css         All styling
assets/js/main.js            Mobile nav toggle only
assets/img/                  Logo, favicon, diagram
vercel.json                  Caching + security headers
```
