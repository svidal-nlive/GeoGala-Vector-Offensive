# Development Environment Setup
**Geo Gala: Vector Offensive**

---

## 1. Prerequisites

### 1.1 Required Software

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 18.x or 20.x | Runtime for Vite |
| **npm** | 9.x+ | Package manager |
| **Git** | 2.x+ | Version control |
| **VS Code** | Latest | Recommended editor |

### 1.2 Installation

**Windows (PowerShell):**
```powershell
# Install Node.js (via winget)
winget install OpenJS.NodeJS.LTS

# Verify installation
node --version
npm --version
git --version
```

**macOS:**
```bash
# Install via Homebrew
brew install node git

# Verify
node --version
npm --version
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git

node --version
npm --version
```

---

## 2. Project Setup

### 2.1 Clone Repository

```powershell
# Clone
git clone https://github.com/YOUR_USERNAME/GeoGala-Vector-Offensive.git
cd GeoGala-Vector-Offensive

# Install dependencies
npm install
```

### 2.2 VS Code Extensions (Recommended)

**Install via Extensions panel or CLI:**
```powershell
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-js-profile-flame
code --install-extension github.copilot
```

**Recommended Extensions:**
- **ESLint** — JavaScript linting
- **Prettier** — Code formatting
- **JavaScript Debugger** — Built-in
- **GitHub Copilot** — AI assistance (optional)

### 2.3 VS Code Settings

**`.vscode/settings.json`:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.css": "css"
  },
  "[javascript]": {
    "editor.tabSize": 2
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

---

## 3. Development Workflow

### 3.1 Start Dev Server

```powershell
npm run dev
```

**Output:**
```
  VITE v5.0.0  ready in 450 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.100:3000/
  ➜  press h + enter to show help
```

**Features:**
- Hot Module Replacement (HMR)
- Instant file changes
- Source maps for debugging

### 3.2 Build for Production

```powershell
npm run build
```

**Output:**
```
vite v5.0.0 building for production...
✓ 45 modules transformed.
dist/index.html                  0.50 kB
dist/assets/index-a1b2c3d4.js   130.20 kB │ gzip: 45.30 kB
✓ built in 1.23s
```

### 3.3 Preview Production Build

```powershell
npm run preview
```

**Output:**
```
  ➜  Local:   http://localhost:4173/
  ➜  Network: http://192.168.1.100:4173/
```

---

## 4. Code Style & Linting

### 4.1 ESLint Configuration

**`.eslintrc.json`:**
```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2021,
    "sourceType": "module"
  },
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-unused-vars": ["warn"],
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

**Run linter:**
```powershell
npm run lint
```

### 4.2 Prettier Configuration

**`.prettierrc`:**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "avoid"
}
```

**Format code:**
```powershell
npx prettier --write "src/**/*.js"
```

### 4.3 EditorConfig

**`.editorconfig`:**
```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,json,css,html}]
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false
```

---

## 5. Debugging

### 5.1 Browser DevTools

**Chrome DevTools Shortcuts:**
- `F12` — Open DevTools
- `Ctrl+Shift+I` — Inspect element
- `Ctrl+Shift+J` — Console
- `Ctrl+Shift+P` — Command palette

**Performance Profiling:**
1. Open DevTools → Performance tab
2. Click "Record" (red dot)
3. Play game for 10-30 seconds
4. Stop recording
5. Analyze flame chart for bottlenecks

### 5.2 VS Code Debugging

**`.vscode/launch.json`:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src",
      "sourceMaps": true
    }
  ]
}
```

**Usage:**
1. Set breakpoints in VS Code (click left gutter)
2. Press `F5` to start debugging
3. Chrome launches with debugger attached

### 5.3 Console Debugging

```javascript
// In-game debug overlay
if (import.meta.env.DEV) {
  window.DEBUG = {
    showHitboxes: false,
    godMode: false,
    fps: 0,
    entityCount: 0
  };
  
  // Toggle with console
  // > DEBUG.showHitboxes = true
}
```

---

## 6. Git Workflow

### 6.1 Branch Strategy

**Main Branches:**
- `main` — Production-ready code
- `develop` — Integration branch (not used for solo dev)

**Feature Branches:**
```powershell
# Create feature branch
git checkout -b feature/weapon-cores

# Work on feature...
git add .
git commit -m "feat: add pulse cannon weapon core"

# Push to remote
git push origin feature/weapon-cores
```

### 6.2 Commit Message Convention

**Format:** `<type>(<scope>): <subject>`

**Types:**
- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation
- `style` — Code formatting (no logic change)
- `refactor` — Code restructuring
- `test` — Adding tests
- `chore` — Maintenance (deps, config)

**Examples:**
```
feat(weapons): add rail spike weapon core
fix(collision): correct hitbox calculation for enemies
docs(readme): update installation instructions
style(renderer): format code with prettier
```

### 6.3 Pull Request Template

**`.github/PULL_REQUEST_TEMPLATE.md`:**
```markdown
## Description
<!-- What does this PR do? -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
<!-- How was this tested? -->

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex logic
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Tested on desktop
- [ ] Tested on mobile (if UI change)
```

---

## 7. Package.json Scripts

**Full Reference:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write \"src/**/*.{js,css,html}\"",
    "test": "echo \"No tests yet\" && exit 0"
  }
}
```

**Usage:**
```powershell
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview build locally
npm run lint      # Check code style
npm run lint:fix  # Auto-fix lint issues
npm run format    # Format with Prettier
```

---

## 8. Environment Variables

### 8.1 Development (.env)

**`.env` (git-ignored):**
```env
# Development
VITE_APP_NAME=Geo Gala: Vector Offensive
VITE_DEBUG=true

# Analytics (optional, Phase 2)
VITE_PLAUSIBLE_DOMAIN=geogala.localhost
```

**Access in code:**
```javascript
const appName = import.meta.env.VITE_APP_NAME;
const isDebug = import.meta.env.VITE_DEBUG === 'true';
```

### 8.2 Production (.env.production)

**`.env.production`:**
```env
VITE_APP_NAME=Geo Gala: Vector Offensive
VITE_DEBUG=false
VITE_PLAUSIBLE_DOMAIN=geogala.example.com
```

---

## 9. Troubleshooting

### 9.1 Common Issues

**Issue:** `npm install` fails with EACCES error

**Solution (Linux/macOS):**
```bash
sudo chown -R $(whoami) ~/.npm
npm install
```

**Issue:** Port 3000 already in use

**Solution:**
```powershell
# Windows: Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in vite.config.js
# server: { port: 3001 }
```

**Issue:** Hot reload not working

**Solution:**
1. Check file watchers limit (Linux):
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```
2. Restart dev server
3. Clear browser cache

**Issue:** ESLint not working in VS Code

**Solution:**
1. Install ESLint extension
2. Reload VS Code (`Ctrl+Shift+P` → "Reload Window")
3. Check `.eslintrc.json` exists

---

## 10. Performance Tips

### 10.1 Dev Server Optimization

**vite.config.js:**
```javascript
export default {
  server: {
    fs: {
      strict: false // Allow serving files outside root
    },
    hmr: {
      overlay: false // Disable error overlay if intrusive
    }
  },
  optimizeDeps: {
    exclude: [] // Exclude large deps from pre-bundling
  }
};
```

### 10.2 Build Optimization

```javascript
export default {
  build: {
    target: 'es2020', // Modern browsers only
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: undefined // Single bundle for small project
      }
    }
  }
};
```

---

## 11. Documentation Workflow

**Updating Docs:**
```powershell
# Edit markdown files in /docs/
code docs/GDD.md

# Commit changes
git add docs/GDD.md
git commit -m "docs(gdd): update weapon balance tables"
```

**Generating Docs (Future):**
```powershell
# JSDoc to HTML (if added)
npm run docs:build
```

---

## 12. Team Collaboration (Future)

**If adding collaborators:**

1. **Invite to GitHub repo:**
   - Settings → Collaborators → Add people

2. **Assign roles:**
   - Maintainer: Full access
   - Contributor: Can create PRs
   - Reviewer: Can approve PRs

3. **Code review process:**
   - All PRs require 1 approval
   - No direct commits to `main`
   - Use GitHub Projects for task tracking

---

**Version:** 1.0  
**Last Updated:** 2025-11-01  
**Status:** ✅ Approved for development
