# Geo Gala: Vector Offensive

**A modern arcade fixed-shooter featuring geometric factions in a neon bullet ballet**

---

## 🎮 Overview

**Geo Gala: Vector Offensive** is a browser-based arcade game that reimagines the classic *Chicken Invaders* formula through geometric abstraction and neon aesthetics. Pilot a triangle fighter through waves of intelligent geometric enemies representing mathematical factions—Order, Chaos, Fractal, and Singularity—in a hypnotic bullet-ballet experience.

**Core Experience:**
- 🎯 Arcade purity: "one-more-wave" compulsion loop
- ✨ Visual distinction: Geometry Wars meets Tron
- 📱 Cross-platform: Mobile-first responsive design
- 🎨 Deep mastery: Modular weapon upgrades and synergy systems

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or 20.x
- npm 9.x+
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+)

### Installation

```powershell
# Clone repository
git clone https://github.com/YOUR_USERNAME/GeoGala-Vector-Offensive.git
cd GeoGala-Vector-Offensive

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```powershell
npm run build
npm run preview
```

---

## 📖 Documentation

**Complete documentation available in `/docs/`:**

| Document | Description |
|----------|-------------|
| [PRD.md](docs/PRD.md) | Product Requirements (scope, metrics, audience) |
| [GDD.md](docs/GDD.md) | Game Design (mechanics, enemies, progression) |
| [TDD.md](docs/TDD.md) | Technical Design (architecture, systems) |
| [StyleGuide.md](docs/StyleGuide.md) | Visual/UI standards, color tokens |
| [Architecture.md](docs/Architecture.md) | System diagrams, data flow |
| [Systems-API.md](docs/Systems-API.md) | API reference for game systems |
| [Balance.md](docs/Balance.md) | Gameplay tuning values |
| [Assets.md](docs/Assets.md) | Asset manifest, licensing |
| **[Asset-Enhancement-Spec.md](docs/Asset-Enhancement-Spec.md)** | **🎨 Visual asset specifications & rendering** |
| **[Visual-Asset-Atlas.md](docs/Visual-Asset-Atlas.md)** | **🎨 Asset reference & implementation guide** |
| [Testing.md](docs/Testing.md) | QA matrix, performance budgets |
| [Release.md](docs/Release.md) | Build & deployment guide |
| [Security.md](docs/Security.md) | Security policies, MCP tools |
| [DevEnv.md](docs/DevEnv.md) | Development setup |
| [Automation.md](docs/Automation.md) | CI/CD workflows |
| [Glossary.md](docs/Glossary.md) | Project terminology |
| [Notes.md](docs/Notes.md) | Research & explorations |

---

## 🎯 Features

### MVP (Phase 1)
- ✅ Single canvas rendering (60 FPS, DPR-aware)
- ✅ Triangle player ship with WASD/Touch movement
- ✅ 5 wave types with formation patterns
- ✅ Weapon heat mechanic
- ✅ Pickup magnet system
- ✅ Mobile-responsive HUD

### Planned (Phase 2)
- 🔲 4 geometric factions with unique behaviors
- 🔲 10 weapon cores with modular upgrades
- 🔲 Boss waves (every 10 waves)
- 🔲 Leaderboard integration
- 🔲 Sound effects and music

### Future (Phase 3)
- 🔲 Campaign mode (30 waves with narrative)
- 🔲 Endless mode
- 🔲 Achievements/badges
- 🔲 PWA offline support

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML5 + CSS3 + ES2020 JavaScript (modules)
- **Rendering:** Canvas 2D API with DPR scaling
- **Build Tool:** Vite (dev server + production bundling)
- **Audio:** Web Audio API
- **Storage:** LocalStorage (settings, high scores)
- **Deployment:** Netlify / Vercel / GitHub Pages

**No frameworks. No external dependencies in production.**

---

## 🎨 Design Philosophy

1. **Clarity Over Spectacle** — Every visual element serves gameplay readability
2. **Geometric Purity** — No organic shapes, no gradients (except glows)
3. **Neon Precision** — High-contrast outlines with chromatic glow effects
4. **Responsive Scaling** — All elements scale proportionally across devices

**Color Palette:**
- Player: Cyan (`#00FFFF`)
- Order Faction: Mint Green (`#00FF88`)
- Chaos Faction: Coral Orange (`#FF6B35`)
- Fractal Faction: Purple (`#8B5CF6`)
- Singularity Faction: Gold (`#FFD60A`)

---

## 🎮 Controls

### Desktop
- **Movement:** WASD or Arrow Keys
- **Fire:** Spacebar (hold) or Auto-fire
- **Missile:** Shift
- **Nuke:** Ctrl
- **Pause:** Esc or P

### Mobile
- **Movement:** Virtual joystick (left side of screen)
- **Fire:** Auto-fire (always on)
- **Missile/Nuke:** Tap buttons (right side)
- **Pause:** Three-finger tap or menu button

### Gamepad (Phase 2)
- **Movement:** Left stick
- **Fire:** Right trigger (RT)
- **Missile:** Right bumper (RB)
- **Nuke:** Left bumper (LB)

---

## 📊 Performance Targets

| Metric | Target | Critical |
|--------|--------|----------|
| **Frame Time** | 16.67ms (60 FPS) | 20ms |
| **Bundle Size** | <200 KB (gzipped) | <300 KB |
| **Load Time (4G)** | <3s | <5s |
| **Lighthouse Performance** | 95+ | 90 |

---

## 🤝 Contributing

**Currently solo development.** Contributions will be accepted post-MVP launch.

**For bug reports:**
1. Check existing [Issues](https://github.com/YOUR_USERNAME/GeoGala-Vector-Offensive/issues)
2. Use bug report template (`.github/ISSUE_TEMPLATE/bug.md`)
3. Include browser, OS, and reproduction steps

---

## 📜 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) file for details.

**Third-party assets:**
- All audio licensed under CC0/CC BY (see `assets/audio/CREDITS.txt`)
- Fonts: Google Fonts (Open Font License)

---

## 🙏 Credits

**Concept & Development:** [Your Name]

**Inspiration:**
- *Chicken Invaders* (InterAction Studios) — Arcade pacing
- *Geometry Wars* (Bizarre Creations) — Neon aesthetic
- *Galaga* (Namco) — Fixed-shooter foundation

**Tools:**
- Vite (Evan You)
- MDN Web Docs (Mozilla)
- Context7 (Upstash) — Documentation retrieval

---

## 🔗 Links

- **Play Online:** [https://geogala.example.com](https://geogala.example.com) *(Coming soon)*
- **Itch.io:** [https://itch.io/geogala](https://itch.io/geogala) *(Coming soon)*
- **GitHub:** [https://github.com/YOUR_USERNAME/GeoGala-Vector-Offensive](https://github.com/YOUR_USERNAME/GeoGala-Vector-Offensive)

---

## 📅 Roadmap

| Phase | Target Date | Features |
|-------|-------------|----------|
| **MVP (v1.0.0)** | 2025-12-15 | Core gameplay, 30 waves |
| **Polish (v1.1.0)** | 2026-01-15 | Weapon cores, bosses, audio |
| **Content (v2.0.0)** | 2026-03-01 | Campaign, challenges, PWA |

---

## ❓ FAQ

**Q: Is this open source?**  
A: Yes, MIT licensed. Free to play, free to modify.

**Q: Will there be multiplayer?**  
A: No plans for multiplayer in current roadmap.

**Q: Mobile browser support?**  
A: Yes! Mobile-first design. Works on iOS Safari 14+ and Chrome Android 90+.

**Q: How do I report a bug?**  
A: Open an issue with browser, OS, and steps to reproduce.

---

**STATUS: PHASE 01 COMPLETE** — Documentation pack generated and ready for development.

---

*Built with 💙 for arcade enthusiasts everywhere.*
