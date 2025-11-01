# Automation & CI/CD
**Geo Gala: Vector Offensive**

---

## 1. GitHub Actions Workflows

### 1.1 Continuous Integration

**`.github/workflows/ci.yml`:**

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  lint:
    name: Lint Code
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
  
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build project
        run: npm run build
      
      - name: Check bundle size
        run: |
          SIZE=$(du -sk dist | cut -f1)
          if [ $SIZE -gt 500 ]; then
            echo "Bundle size exceeds 500 KB"
            exit 1
          fi
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
          retention-days: 7
```

### 1.2 Lighthouse CI

**`.github/workflows/lighthouse.yml`:**

```yaml
name: Lighthouse CI

on:
  pull_request:
    branches: [ main ]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:4173/
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### 1.3 Auto-Deploy to Netlify

**`.github/workflows/deploy.yml`:**

```yaml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: './dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 2. MCP Automation Jobs

### 2.1 Automated Documentation Updates

**Task:** Keep GDD balance tables in sync with code

**MCP Agent Workflow:**

1. Monitor changes to `src/data/factions.js`
2. Extract enemy stats
3. Update `docs/Balance.md` tables
4. Create PR with changes

**Example Trigger:**

```javascript
// In factions.js
export const ORDER_SCOUT_HP = 1; // Base value

// MCP watches for changes to this file
// Extracts constants → updates docs/Balance.md
// Commits: "docs(balance): sync Scout HP with code"
```

### 2.2 Asset Audit

**Task:** Verify all audio files are attributed

**MCP Check:**

```javascript
// Pseudo-code
const audioFiles = listDir('assets/audio/');
const creditsFile = readFile('assets/audio/CREDITS.txt');

audioFiles.forEach(file => {
  if (!creditsFile.includes(file)) {
    createIssue({
      title: `Missing attribution: ${file}`,
      labels: ['asset', 'compliance']
    });
  }
});
```

### 2.3 Changelog Generation

**Task:** Auto-generate CHANGELOG.md from commits

**GitHub Action:**

```yaml
name: Generate Changelog

on:
  release:
    types: [created]

jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Generate changelog
        uses: orhun/git-cliff-action@v2
        with:
          config: cliff.toml
          args: --latest
        env:
          OUTPUT: CHANGELOG.md
      
      - name: Commit changelog
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add CHANGELOG.md
          git commit -m "docs: update CHANGELOG for ${{ github.event.release.tag_name }}"
          git push
```

---

## 3. Pre-Commit Hooks (Husky)

### 3.1 Setup Husky

```powershell
npm install --save-dev husky lint-staged
npx husky install
```

**`.husky/pre-commit`:**

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

**package.json:**

```json
{
  "lint-staged": {
    "*.js": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,html,md}": [
      "prettier --write"
    ]
  }
}
```

**Effect:** Auto-format and lint files before commit

---

## 4. Scheduled Tasks

### 4.1 Weekly Dependency Updates

**`.github/workflows/update-deps.yml`:**

```yaml
name: Update Dependencies

on:
  schedule:
    - cron: '0 9 * * 1' # Every Monday at 9 AM UTC

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Update dependencies
        run: |
          npm update
          npm audit fix
      
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          commit-message: "chore(deps): update dependencies"
          title: "Weekly Dependency Update"
          body: "Automated dependency updates"
          branch: chore/update-deps
          labels: dependencies
```

### 4.2 Monthly Security Audit

**`.github/workflows/security-audit.yml`:**

```yaml
name: Security Audit

on:
  schedule:
    - cron: '0 0 1 * *' # First day of month

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run npm audit
        run: npm audit --audit-level=moderate
      
      - name: Create issue if vulnerabilities found
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: 'Security vulnerabilities detected',
              body: 'npm audit found vulnerabilities. Run `npm audit fix` locally.',
              labels: ['security', 'urgent']
            })
```

---

## 5. Release Automation

### 5.1 Semantic Release

**Setup:**

```powershell
npm install --save-dev semantic-release @semantic-release/git @semantic-release/changelog
```

**`.releaserc.json`:**

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/git",
    "@semantic-release/github"
  ]
}
```

**GitHub Action:**

```yaml
name: Release

on:
  push:
    branches: [ main ]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: npx semantic-release
```

---

## 6. Performance Monitoring

### 6.1 Bundle Size Tracking

**`.github/workflows/bundle-size.yml`:**

```yaml
name: Bundle Size Check

on: [pull_request]

jobs:
  size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Analyze bundle size
        uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

---

## 7. Issue Templates

### 7.1 Bug Report

**`.github/ISSUE_TEMPLATE/bug.md`:**

```markdown
---
name: Bug Report
about: Report a bug or unexpected behavior
title: '[BUG] '
labels: bug
assignees: ''
---

## Description
<!-- Clear and concise description of the bug -->

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Observe error

## Expected Behavior
<!-- What should happen -->

## Actual Behavior
<!-- What actually happens -->

## Environment
- Browser: [e.g., Chrome 98]
- OS: [e.g., Windows 11]
- Device: [e.g., Desktop, iPhone 12]

## Screenshots
<!-- If applicable -->

## Console Errors
<!-- Paste any error messages from browser console -->
```

### 7.2 Feature Request

**`.github/ISSUE_TEMPLATE/feature.md`:**

```markdown
---
name: Feature Request
about: Suggest a new feature or enhancement
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## Feature Description
<!-- Clear and concise description of the feature -->

## Use Case
<!-- Why is this feature needed? Who benefits? -->

## Proposed Solution
<!-- How might this be implemented? -->

## Alternatives Considered
<!-- Other approaches you've thought about -->

## Additional Context
<!-- Mockups, examples, references -->
```

---

## 8. Project Board Automation

**GitHub Projects (Beta):**

**Workflow: Issue → In Progress → Review → Done**

**Automation Rules:**

1. New issue → Add to "Backlog" column
2. Issue assigned → Move to "In Progress"
3. PR opened → Move to "Review"
4. PR merged → Move to "Done"

**Setup:**

```yaml
# .github/workflows/project-automation.yml
name: Project Board Automation

on:
  issues:
    types: [opened, assigned]
  pull_request:
    types: [opened, closed]

jobs:
  automate:
    runs-on: ubuntu-latest
    steps:
      - uses: alex-page/github-project-automation-plus@v0.8.1
        with:
          project: Geo Gala Development
          column: In Progress
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

---

## 9. Notification Integrations

### 9.1 Discord Webhook (Optional)

**`.github/workflows/discord-notify.yml`:**

```yaml
name: Discord Notifications

on:
  push:
    branches: [ main ]
  release:
    types: [published]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Send Discord notification
        uses: sarisia/actions-status-discord@v1
        with:
          webhook: ${{ secrets.DISCORD_WEBHOOK }}
          title: "Geo Gala Deployed"
          description: "New version deployed to production"
```

---

## 10. MCP Agent Tasks (Custom)

### 10.1 Balance Sync Agent

**Trigger:** On commit to `src/data/factions.js`

**Actions:**

1. Extract enemy stats from code
2. Compare with `docs/Balance.md`
3. If diff > 10%, create PR with updated tables
4. Notify in PR: "Balance values updated from code"

### 10.2 Asset Compliance Agent

**Trigger:** Weekly cron

**Actions:**

1. Scan `/assets/audio/` for new files
2. Check `CREDITS.txt` for attribution
3. If missing, create issue with template
4. Suggest attribution format

### 10.3 Documentation Freshness Agent

**Trigger:** Monthly

**Actions:**

1. Check "Last Updated" dates in all `/docs/` files
2. If >90 days old, create reminder issue
3. Suggest review checklist

---

## 11. Automation Checklist

**Pre-Launch:**

- [ ] CI workflow passing
- [ ] Lighthouse CI configured
- [ ] Auto-deploy to staging
- [ ] Pre-commit hooks active
- [ ] Issue templates created
- [ ] PR template created

**Post-Launch:**

- [ ] Release automation
- [ ] Dependency updates scheduled
- [ ] Security audits scheduled
- [ ] Performance monitoring
- [ ] Discord notifications (optional)

---

**Version:** 1.0  
**Last Updated:** 2025-11-01  
**Status:** ✅ Approved for development
