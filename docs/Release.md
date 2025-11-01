# Release & Deployment Guide
**Geo Gala: Vector Offensive**

---

## 1. Build Process

### 1.1 Development Build

```powershell
# Install dependencies
npm install

# Start dev server
npm run dev
```

**Dev Server:**
- URL: http://localhost:3000
- Hot reload enabled
- Source maps included
- No minification

### 1.2 Production Build

```powershell
# Build for production
npm run build

# Preview production build
npm run preview
```

**Output:**
- Directory: `dist/`
- Files: Minified JS/CSS, hashed filenames
- Size: ~130 KB (gzipped)

---

## 2. Deployment Targets

### 2.1 Netlify (Recommended)

**Setup:**
1. Connect GitHub repo to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18.x

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

**Deployment:**
```powershell
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### 2.2 Vercel

**Setup:**
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Follow prompts

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "headers": [
    {
      "source": "/(.*).js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2.3 GitHub Pages

**Setup:**
1. Update `vite.config.js`:
```javascript
export default {
  base: '/GeoGala-Vector-Offensive/' // repo name
};
```

2. Build and deploy:
```powershell
npm run build
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

**Automated via GitHub Actions:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 2.4 Itch.io

**Packaging:**
1. Build production bundle
2. Zip `dist/` folder
3. Upload to itch.io
4. Set viewport to "Fullscreen button"

**index.html Adjustments:**
```html
<!-- Add itch.io fullscreen API -->
<script src="https://static.itch.io/api.js"></script>
<script>
  if (typeof itchio !== 'undefined') {
    itchio.setFullscreen(true);
  }
</script>
```

---

## 3. Pre-Deployment Checklist

### 3.1 Code Quality

- [ ] All P0 tests passing
- [ ] No console errors in production build
- [ ] ESLint warnings resolved
- [ ] Code comments for complex logic
- [ ] TODO/FIXME items addressed or documented

### 3.2 Performance

- [ ] Lighthouse Performance ≥90
- [ ] Bundle size <200 KB (gzipped)
- [ ] 60 FPS on target devices
- [ ] Load time <3s on 4G

### 3.3 Assets

- [ ] All audio files attributed (CREDITS.txt)
- [ ] No unused assets in build
- [ ] Image assets optimized (if added later)
- [ ] Fonts loaded efficiently

### 3.4 Configuration

- [ ] Correct base URL in vite.config.js
- [ ] Cache headers configured
- [ ] CORS headers (if using external APIs)
- [ ] CSP headers set

### 3.5 Content

- [ ] README.md complete
- [ ] LICENSE file included
- [ ] Privacy policy (if collecting analytics)
- [ ] Credits screen populated

---

## 4. Versioning Strategy

**Semantic Versioning:** MAJOR.MINOR.PATCH

**Examples:**
- `1.0.0` — Initial release
- `1.1.0` — New feature (weapon cores)
- `1.0.1` — Bug fix

**Tagging Releases:**
```powershell
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

**Changelog (CHANGELOG.md):**
```markdown
# Changelog

## [1.0.0] - 2025-11-15
### Added
- Initial release with 30 waves
- 4 geometric factions
- Power-up system
- Touch/keyboard/gamepad controls

### Known Issues
- Safari audio latency on iOS <14
```

---

## 5. Rollback Procedure

**If Critical Bug in Production:**

1. **Immediate:**
   ```powershell
   # Revert to previous commit
   git revert HEAD
   git push origin main
   ```

2. **Netlify/Vercel:**
   - Dashboard → Deployments → Select previous build → "Publish"

3. **GitHub Pages:**
   ```powershell
   git checkout gh-pages
   git reset --hard <previous-commit-hash>
   git push origin gh-pages --force
   ```

4. **Communication:**
   - Post notice on itch.io/social media
   - Document bug in GitHub Issues
   - Set timeline for fix

---

## 6. Post-Deployment Monitoring

### 6.1 Analytics Setup (Optional)

**Plausible Analytics (Privacy-friendly):**
```html
<script defer data-domain="geogala.example.com" 
        src="https://plausible.io/js/script.js"></script>
```

**Custom Events:**
```javascript
// Track wave progression
EventBus.on('wave:clear', (data) => {
  plausible('Wave Clear', { props: { wave: data.waveIndex } });
});
```

### 6.2 Error Tracking

**Sentry (Free tier):**
```javascript
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "YOUR_DSN",
  environment: "production",
  tracesSampleRate: 0.1
});
```

### 6.3 Metrics to Monitor

| Metric | Target | Tool |
|--------|--------|------|
| **Uptime** | 99.9% | StatusCake, UptimeRobot |
| **Load Time** | <3s | Google Analytics, Plausible |
| **Error Rate** | <0.1% | Sentry |
| **Player Retention (D1)** | >40% | Custom analytics |
| **Average Session** | 8-12 min | Custom analytics |

---

## 7. Hotfix Process

**For Critical Bugs:**

1. Create hotfix branch:
   ```powershell
   git checkout -b hotfix/critical-bug-name
   ```

2. Fix issue, test locally

3. Merge and deploy:
   ```powershell
   git checkout main
   git merge hotfix/critical-bug-name
   git push origin main
   ```

4. Tag hotfix release:
   ```powershell
   git tag -a v1.0.1 -m "Hotfix: Fix missile bug"
   git push origin v1.0.1
   ```

**Hotfix Criteria:**
- Game-breaking (can't progress past wave X)
- Data loss (high scores wiped)
- Security vulnerability

---

## 8. A/B Testing (Phase 2)

**Test Variants:**
- Difficulty tuning (enemy HP ±20%)
- UI layouts (HUD positioning)
- Weapon balance (fire rate adjustments)

**Implementation:**
```javascript
const variant = Math.random() < 0.5 ? 'A' : 'B';

if (variant === 'A') {
  enemy.hp = 1;
} else {
  enemy.hp = 1.2; // 20% more HP
}

// Track variant
plausible('Variant Test', { props: { variant, waveReached } });
```

---

## 9. Release Schedule

### 9.1 MVP Release (v1.0.0)

**Target Date:** 2025-12-15

**Scope:**
- 30 waves
- Basic weapon system
- Touch/keyboard controls
- 4 factions

### 9.2 Polish Update (v1.1.0)

**Target Date:** 2026-01-15

**Scope:**
- Weapon cores & synergy nodes
- Boss encounters
- Leaderboard
- Audio polish

### 9.3 Content Update (v2.0.0)

**Target Date:** 2026-03-01

**Scope:**
- Campaign mode
- Daily challenges
- Achievements
- PWA offline support

---

## 10. Deployment Automation

**GitHub Actions Workflow:**
```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 11. CDN Configuration (Optional)

**For Audio Assets:**

1. Upload `/assets/audio/` to Cloudflare R2 or AWS S3
2. Update audio loading:
```javascript
const CDN_URL = 'https://cdn.example.com/audio/';
await AudioManager.load('menu_theme', CDN_URL + 'menu_theme.mp3');
```

**Benefits:**
- Faster global loading
- Reduced hosting costs
- Better caching

---

## 12. Security Checklist

- [ ] HTTPS enforced
- [ ] CSP headers configured
- [ ] No API keys in client code
- [ ] Input validation on all user data
- [ ] Rate limiting (if backend added)
- [ ] CORS properly configured

---

## 13. Legal Compliance

- [ ] Privacy policy (if analytics used)
- [ ] Cookie consent (if EU traffic)
- [ ] COPPA compliance (if targeting <13)
- [ ] License file (MIT) included
- [ ] Attribution for third-party assets

---

**Version:** 1.0  
**Last Updated:** 2025-11-01  
**Status:** ✅ Approved for development
