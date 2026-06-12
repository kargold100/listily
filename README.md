# 🌿 Listily.au — Australian Business Directory & Opportunities Board

Australia's community-powered local business directory and Seek-style opportunities board.
Find businesses, jobs, apprenticeships, internships and volunteering — all in your suburb.

---

## 📦 What's included

| File | Purpose |
|------|---------|
| `docs/index.html` | Homepage — hero search, industry grid, opportunities strip |
| `docs/directory.html` | Full business directory with sidebar filters |
| `docs/opportunities.html` | Seek-style two-panel opportunities board |
| `docs/register.html` | Business registration + opportunity posting form |
| `docs/admin.html` | Admin dashboard — approve/reject/analytics |
| `docs/css/base.css` | Concept B logo, design tokens, shared styles |
| `docs/css/home.css` | Homepage-specific styles |
| `docs/css/directory.css` | Directory layout |
| `docs/css/opportunities.css` | Opportunities two-panel layout |
| `docs/css/register.css` | Multi-step registration form |
| `docs/css/admin.css` | Admin dashboard |
| `docs/js/data.js` | Business + opportunity database |
| `docs/js/utils.js` | Shared helpers (security, dates, modals) |
| `docs/js/home.js` | Homepage logic |
| `docs/js/directory.js` | Directory filters and pagination |
| `docs/js/opportunities.js` | Opportunities filtering |
| `docs/js/register.js` | Multi-step form logic |
| `docs/js/admin.js` | Admin dashboard logic |
| `docs/_headers` | Security headers (Netlify / Cloudflare Pages) |
| `docs/robots.txt` | Search engine crawl rules |
| `netlify.toml` | Netlify build + headers + redirect config |
| `.github/workflows/deploy.yml` | GitHub Actions — security scan + Pages deploy |

---

## 🏗️ One-time setup — push code to GitHub

Both hosting options (Netlify and GitHub Pages) need your code on GitHub first.

### Prerequisites
- [Git](https://git-scm.com/downloads) installed on your computer
- A [GitHub account](https://github.com/join) (free)

### Step 1 — Create a GitHub repository

1. Go to **github.com/new**
2. Repository name: `listily`
3. Set to **Public** (required for free GitHub Pages; fine for Netlify either way)
4. **Do NOT** tick "Add a README file" — you're pushing existing code
5. Click **Create repository**

### Step 2 — Push your code

Open Terminal (Mac/Linux) or Git Bash (Windows), navigate to the unzipped `listily/` folder, then run:

```bash
# Initialise git
git init

# Stage all files
git add .

# First commit
git commit -m "Listily.au — initial launch 🌿"

# Rename default branch to main
git branch -M main

# Connect to your GitHub repo (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/listily.git

# Push
git push -u origin main
```

You'll be prompted for your GitHub username and password (or a [Personal Access Token](https://github.com/settings/tokens) if you have 2FA enabled).

---

## 🚀 Option A — Deploy on Netlify (recommended)

**Why Netlify?**
- The `netlify.toml` and `_headers` files in this project work natively
- All HTTP security headers are applied at the CDN level (A+ on securityheaders.com)
- Every push to `main` auto-deploys in ~15 seconds
- Preview deployments for every pull request
- Free SSL certificate, custom domain support
- 100 GB bandwidth / month on the free tier

### Step 1 — Create a Netlify account

Go to **[app.netlify.com](https://app.netlify.com)** → click **Sign up with GitHub**. Authorise Netlify to access your GitHub account.

### Step 2 — Import your repository

1. On the Netlify dashboard click **Add new site** → **Import an existing project**
2. Click **GitHub**
3. If prompted, click **Configure Netlify on GitHub** and grant access to your `listily` repo
4. Select the `listily` repository

### Step 3 — Configure build settings

Netlify will detect a static site. Confirm these settings:

| Setting | Value |
|---------|-------|
| Branch to deploy | `main` |
| Base directory | *(leave blank)* |
| Build command | *(leave blank — no build needed)* |
| Publish directory | `docs` |

Click **Deploy site**.

### Step 4 — Your site is live

In ~15 seconds Netlify deploys your site to a URL like:

```
https://listily-a1b2c3.netlify.app
```

You can rename this in **Site settings → General → Site name**.

### Step 5 — Verify security headers

Visit **[securityheaders.com](https://securityheaders.com)** and enter your Netlify URL.
You should see an **A** or **A+** rating. The `netlify.toml` applies all headers at the HTTP level.

### Step 6 — Set up auto-deploy (already active)

Auto-deploy is on by default. Every time you push to `main`, Netlify rebuilds and redeploys automatically. Test it:

```bash
# Make a small change, e.g. edit docs/index.html
git add .
git commit -m "Test auto-deploy"
git push
```

Watch the **Deploys** tab in your Netlify dashboard — a new deploy starts within seconds.

### Step 7 — Add deploy notifications (optional)

Netlify → **Site settings** → **Notifications** → **Add notification** → Email.
You'll receive an email on every successful deploy and any failures.

### Step 8 — Add a custom domain (optional)

1. Netlify dashboard → **Domain management** → **Add custom domain**
2. Enter your domain, e.g. `listily.com.au`
3. Netlify shows you the DNS records to add at your registrar:

   | Type | Name | Value |
   |------|------|-------|
   | `CNAME` | `www` | `listily-a1b2c3.netlify.app` |
   | `A` | `@` | `75.2.60.5` |

4. Add these at your registrar (VentraIP, Crazy Domains, GoDaddy, etc.)
5. Back in Netlify, click **Verify DNS configuration**
6. SSL certificate is provisioned automatically via Let's Encrypt within 2–5 minutes

---

## 🚀 Option B — Deploy on GitHub Pages

**When to choose this:**
GitHub Pages is simpler to set up but has one limitation: it cannot set custom HTTP response headers. The `<meta>` fallbacks in each HTML file cover most security controls, but for a full A+ security rating, use Netlify or Cloudflare Pages.

### Step 1 — Push code to GitHub

(Same as the one-time setup above — if you've already done this, skip ahead.)

### Step 2 — Enable GitHub Pages

1. Go to your `listily` repository on GitHub
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select **GitHub Actions**
4. That's it — the `.github/workflows/deploy.yml` file handles everything

### Step 3 — Your site is live

After your first push, the Actions workflow runs automatically. You can watch it under the **Actions** tab. In ~60 seconds your site is at:

```
https://YOUR-USERNAME.github.io/listily/
```

### Step 4 — Update robots.txt

Open `docs/robots.txt` and replace `YOUR-USERNAME` with your actual GitHub username in the sitemap URL.

```bash
# Edit the file, then:
git add docs/robots.txt
git commit -m "Update robots.txt with correct sitemap URL"
git push
```

### Step 5 — Watch the auto-deploy workflow

Every push to `main` triggers the workflow automatically:

1. Go to your repo → **Actions** tab
2. You'll see the "Deploy Listily to GitHub Pages" workflow running
3. It runs a security scan (Gitleaks + JS pattern checks) first
4. If the scan passes, it deploys to Pages
5. You'll get a GitHub notification if anything fails

### Step 6 — Add a custom domain (optional)

1. Repo → **Settings** → **Pages** → **Custom domain**
2. Enter your domain, e.g. `listily.com.au`
3. At your domain registrar, add a `CNAME` record:
   - Name: `www`
   - Value: `YOUR-USERNAME.github.io`
4. GitHub automatically provisions an SSL certificate

> **Note:** GitHub Pages with a custom domain + Cloudflare proxy gives you the best of both worlds — free hosting plus full HTTP security headers from Cloudflare's Transform Rules.

---

## 🔁 Day-to-day workflow (both platforms)

Once deployed, your update process is simply:

```bash
# 1. Make your changes (edit data.js, update HTML, etc.)

# 2. Stage changes
git add .

# 3. Commit with a descriptive message
git commit -m "Add: new Point Cook businesses"

# 4. Push — auto-deploy starts immediately
git push
```

**Netlify:** live in ~15 seconds  
**GitHub Pages:** live in ~60 seconds (security scan runs first)

---

## 🔒 Security controls

| Control | Netlify | GitHub Pages |
|---------|---------|--------------|
| CSP (Content Security Policy) | ✅ HTTP header via `netlify.toml` | ⚠️ `<meta>` fallback only |
| X-Frame-Options | ✅ HTTP header | ⚠️ `<meta>` fallback |
| X-Content-Type-Options | ✅ HTTP header | ⚠️ `<meta>` fallback |
| HSTS (1 year) | ✅ HTTP header | ⚠️ Meta only |
| XSS escaping | ✅ `escHtml()` in all JS | ✅ Same |
| Secret detection | ✅ Gitleaks on every push | ✅ Gitleaks on every push |
| Pattern scanning | ✅ GitHub Actions | ✅ GitHub Actions |
| External link safety | ✅ `rel="noopener noreferrer"` | ✅ Same |
| Admin brute force | ⚠️ Add Netlify Identity in Phase 2 | ⚠️ Add Cloudflare Access |

---

## 🔑 Admin access

Demo credentials (change these before going to production):

| Username | Password |
|----------|----------|
| `admin` | `admin123` |

To change them, edit the `ADMIN` object in `docs/js/admin.js`:

```javascript
const ADMIN = { u: "your-username", p: "your-strong-password" };
```

> ⚠️ This is client-side auth — fine for a static demo/MVP. For production, use Netlify Identity, Cloudflare Access, or a proper backend with server-side authentication.

---

## 🗺️ Roadmap

### Phase 2 — Persistent backend
- [ ] Google Sheets via Apps Script for business and opportunity submissions
- [ ] Email notifications to admin on new submissions
- [ ] Approval/rejection emails to submitters

### Phase 3 — Maps & location
- [ ] Google Maps in business detail modal
- [ ] Geolocation-based "Near me" search
- [ ] Postcode radius search (5km, 10km, 20km)

### Phase 4 — Business accounts
- [ ] Business owner login (Supabase Auth or Firebase)
- [ ] Self-service listing editing + hours management
- [ ] Photo and logo uploads
- [ ] "Claim your listing" flow

### Phase 5 — Job-seeker features
- [ ] Save opportunities (localStorage → backend)
- [ ] Email job alerts by type + suburb + industry
- [ ] Apply via Listily — CV upload without leaving the site
- [ ] "I'm looking for work" profile for local jobseekers

### Phase 6 — Community trust
- [ ] Star ratings and reviews for businesses
- [ ] "Still accurate?" prompts after 6 months
- [ ] Report a listing (inaccurate / closed / spam)
- [ ] Verified badge for claimed businesses

### Phase 7 — Growth
- [ ] Multilingual — Tamil, Vietnamese, Arabic, Punjabi, Mandarin
- [ ] SEO suburb pages (`/vic/point-cook/plumbers`)
- [ ] Featured listing tiers (free basic / paid promoted)
- [ ] Sponsored opportunity slots
- [ ] REST API for third-party integration
- [ ] React Native mobile apps (iOS + Android)

---

## 📝 Licence

MIT — free to use, fork and adapt with attribution.
