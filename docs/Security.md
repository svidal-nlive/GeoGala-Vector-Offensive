# Security & MCP Tools Reference
**Geo Gala: Vector Offensive**

---

## 1. Security Overview

**Threat Model:** Browser-based game with no server-side components (Phase 1)

**Security Principles:**
1. Client-side only (no sensitive data)
2. No external API calls post-load
3. LocalStorage for non-sensitive data only
4. Content Security Policy enforced

---

## 2. Content Security Policy (CSP)

**Meta Tag (index.html):**
```html
<meta http-equiv="Content-Security-Policy" 
      content="
        default-src 'self';
        script-src 'self';
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' data:;
        media-src 'self';
        connect-src 'self';
        frame-ancestors 'none';
        base-uri 'self';
        form-action 'none';
      ">
```

**Explanation:**
- `default-src 'self'` — Only load resources from same origin
- `style-src ... 'unsafe-inline'` — Allow inline styles for performance
- `font-src ... fonts.gstatic.com` — Google Fonts CDN
- `frame-ancestors 'none'` — Prevent clickjacking
- `form-action 'none'` — No forms in this app

---

## 3. LocalStorage Security

### 3.1 Data Stored

**Safe to Store:**
- High scores (public data)
- Settings (volume, difficulty)
- Unlocked upgrades (game progress)
- Statistics (play time, total kills)

**Never Store:**
- Passwords
- Personal information
- Payment details
- Session tokens (if backend added)

### 3.2 Storage Schema

```javascript
// Prefix all keys to avoid collisions
const STORAGE_PREFIX = 'geogala:';

const storage = {
  get(key) {
    try {
      const data = localStorage.getItem(STORAGE_PREFIX + key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Storage read error:', e);
      return null;
    }
  },
  
  set(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage write error:', e);
      return false;
    }
  },
  
  remove(key) {
    localStorage.removeItem(STORAGE_PREFIX + key);
  },
  
  clear() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(STORAGE_PREFIX))
      .forEach(k => localStorage.removeItem(k));
  }
};
```

### 3.3 Data Validation

```javascript
// Validate before trusting stored data
function loadSettings() {
  const settings = storage.get('settings');
  
  // Default settings
  const defaults = {
    sfxVolume: 0.7,
    musicVolume: 0.5,
    difficulty: 'normal'
  };
  
  if (!settings) return defaults;
  
  // Validate ranges
  return {
    sfxVolume: Math.max(0, Math.min(1, settings.sfxVolume ?? defaults.sfxVolume)),
    musicVolume: Math.max(0, Math.min(1, settings.musicVolume ?? defaults.musicVolume)),
    difficulty: ['easy', 'normal', 'hard'].includes(settings.difficulty) 
      ? settings.difficulty 
      : defaults.difficulty
  };
}
```

---

## 4. Input Validation

### 4.1 User Input Sources

**Current (Phase 1):**
- Keyboard (trusted browser API)
- Touch (trusted browser API)
- Gamepad (trusted browser API)

**Future (Phase 2+):**
- Text input (username for leaderboard) → **Requires validation**

### 4.2 Validation Rules (Phase 2)

```javascript
// Username validation
function validateUsername(input) {
  // 3-16 characters, alphanumeric + underscores only
  const pattern = /^[a-zA-Z0-9_]{3,16}$/;
  
  if (!pattern.test(input)) {
    throw new Error('Invalid username format');
  }
  
  // Sanitize for display (encode HTML entities)
  return input.replace(/[<>&"']/g, (char) => {
    const entities = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return entities[char];
  });
}
```

---

## 5. Allowed MCP Tools

**For Documentation & Development Agents:**

### 5.1 File System Tools
- `create_file` — Generate docs, code, configs
- `replace_string_in_file` — Edit existing files
- `read_file` — Read project context
- `list_dir` — Explore structure

### 5.2 GitHub MCP Tools
- `mcp_github_github_create_branch` — Create feature branches
- `mcp_github_github_create_pull_request` — Open PRs
- `mcp_github_github_push_files` — Batch file commits
- `mcp_github_github_create_or_update_file` — Single file updates
- `mcp_github_github_list_commits` — View history
- `mcp_github_github_search_code` — Find references

### 5.3 Context Tools
- `semantic_search` — Find relevant code
- `grep_search` — Pattern matching
- `file_search` — Locate files

### 5.4 Forbidden Tools
- ❌ `run_in_terminal` with `rm -rf` or destructive commands
- ❌ Network requests to external APIs (except documented ones)
- ❌ Modifying `.git/` directly
- ❌ Installing unvetted npm packages

---

## 6. Token Scopes & Permissions

**GitHub Personal Access Token (for MCP):**

**Required Scopes:**
- `repo` — Full repository access (read/write)
- `workflow` — Update GitHub Actions

**Not Required:**
- `admin:org` — No organization management
- `delete_repo` — Never delete repositories
- `user:email` — No personal data access

**Rotation Policy:**
- Rotate token every 90 days
- Revoke immediately if compromised
- Store in environment variable (`.env`), never commit

---

## 7. Dependency Security

### 7.1 Vite (Dev Dependency)

**Version Pinning:**
```json
{
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

**Security Practices:**
- Run `npm audit` before each release
- Update Vite within major version (minor/patch updates)
- Review changelogs for security fixes

### 7.2 No Runtime Dependencies

**Phase 1:** Zero production dependencies (vanilla JS)

**Phase 2+:** If adding libraries, require:
- [ ] Active maintenance (commit in last 6 months)
- [ ] >1000 weekly downloads
- [ ] No critical vulnerabilities (`npm audit`)
- [ ] Compatible license (MIT, Apache 2.0, ISC)

---

## 8. Browser Security Features

### 8.1 Sandbox Attributes (for iframe embeds)

**If embedding on third-party sites:**
```html
<iframe src="https://geogala.example.com" 
        sandbox="allow-scripts allow-same-origin"
        allow="fullscreen; gamepad">
</iframe>
```

**Permissions:**
- `allow-scripts` — Required for JavaScript
- `allow-same-origin` — LocalStorage access
- `fullscreen` — Fullscreen API
- `gamepad` — Gamepad API

**Denied by default:**
- Forms, popups, top navigation

### 8.2 Permissions Policy

```html
<meta http-equiv="Permissions-Policy" 
      content="
        camera=(),
        microphone=(),
        geolocation=(),
        payment=(),
        usb=()
      ">
```

**Explanation:**
- Explicitly deny unused APIs
- Prevent accidental permission prompts

---

## 9. XSS Prevention

**Attack Vectors:**

### 9.1 Stored XSS (Phase 2: Leaderboard)

**Scenario:** Malicious username injected into leaderboard

**Prevention:**
```javascript
// Encode output
function renderLeaderboard(entries) {
  return entries.map(entry => {
    const safeName = escapeHTML(entry.username);
    return `<li>${safeName}: ${entry.score}</li>`;
  }).join('');
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
```

### 9.2 DOM-based XSS

**Scenario:** User input directly manipulated into DOM

**Prevention:**
- Use `textContent` instead of `innerHTML`
- Validate all user input
- Never use `eval()` or `Function()` constructor

---

## 10. HTTPS Enforcement

**Netlify/Vercel:** Automatic HTTPS

**Manual Setup (if self-hosting):**
```nginx
# nginx config
server {
    listen 80;
    server_name geogala.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name geogala.example.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

---

## 11. Rate Limiting (Phase 2: Backend)

**If adding leaderboard API:**

```javascript
// Express.js example
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later.'
});

app.use('/api/', limiter);
```

**Limits:**
- Leaderboard submit: 10 per hour per IP
- Leaderboard fetch: 60 per hour per IP

---

## 12. Privacy Compliance

### 12.1 GDPR (EU Users)

**If collecting analytics:**

**Requirements:**
- [ ] Cookie consent banner
- [ ] Privacy policy page
- [ ] Data deletion mechanism
- [ ] No tracking without consent

**Minimal Implementation:**
```html
<div id="cookie-banner" style="display:none;">
  This site uses cookies for analytics. 
  <button onclick="acceptCookies()">Accept</button>
  <button onclick="declineCookies()">Decline</button>
</div>
```

### 12.2 COPPA (US Users <13)

**Current:** No data collection → COPPA-compliant

**If adding user accounts:**
- Require parental consent for users <13
- Do not collect email, name, or location from minors

---

## 13. Incident Response Plan

**If Security Breach Detected:**

1. **Immediate:**
   - Disable affected feature
   - Roll back to previous build
   - Post notice on game page

2. **Investigation (24h):**
   - Identify vulnerability
   - Assess data exposure (if any)
   - Document incident

3. **Remediation (48h):**
   - Patch vulnerability
   - Deploy fix
   - Notify users (if data compromised)

4. **Post-Mortem (1 week):**
   - Write incident report
   - Update security docs
   - Add regression tests

**Contact:** [Developer Email]

---

## 14. Security Checklist (Pre-Release)

- [ ] CSP header configured
- [ ] HTTPS enforced
- [ ] No API keys in client code
- [ ] LocalStorage data validated on read
- [ ] XSS prevention in all dynamic content
- [ ] npm audit shows zero vulnerabilities
- [ ] Third-party scripts reviewed (none currently)
- [ ] Privacy policy (if analytics added)
- [ ] Permissions-Policy header set
- [ ] Rate limiting (if backend added)

---

## 15. Secure Development Practices

**Code Review:**
- All PRs require approval before merge
- Check for hardcoded secrets (API keys, tokens)
- Validate input handling

**Secret Management:**
```powershell
# .env (never commit)
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
NETLIFY_TOKEN=nfp_xxxxxxxxxxxx

# Load in code
# (Vite auto-loads .env in dev, use env vars in prod)
```

**Gitignore:**
```
.env
.env.local
.env.production
node_modules/
dist/
*.log
```

---

**Version:** 1.0  
**Last Updated:** 2025-11-01  
**Status:** ✅ Approved for development
