# GeoGala: Vector Offensive 👾🔺

A modern vertical fixed-shooter inspired by *Galaga* and *Chicken Invaders*. Pilot an evolving triangle ship against intelligent geometric factions in rhythm-based waves. **Simple to shoot, absurdly deep to upgrade.**

**Version:** 1.0.0 MVP  
**Status:** ✅ Production Ready  
**Performance:** 60 FPS stable, P95 17.8 ms, 8.86 KB gzipped  

🎮 **[Play Now](https://svidal-nlive.github.io/GeoGala-Vector-Offensive/)** | 📖 [Changelog](CHANGELOG.md) | 🧪 [QA Results](docs/QA_TEST_LOG_20251031.md)

## Quick Start

### Prerequisites

- **Node.js:** v18+ ([download](https://nodejs.org/))
- **npm:** v9+ (included with Node.js)

### Installation

```bash
# Clone or download this repository
cd "GeoGala - Vector Offensive"

# Install dependencies
npm install

# Start dev server
npm run dev
```

Opens at `http://localhost:5173` with hot-reload enabled.

### Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

Output goes to `dist/` directory.

---

## How to Play

### Objective
Survive 5 waves of geometric enemies. Earn points for each kill. Reach the best score!

### Controls

**Desktop:**
- **WASD** or **Arrow Keys** — Move ship
- **Space** — Fire bullets
- **D** — Toggle debug HUD (FPS, entity count, wave)

**Mobile:**
- **Left Half Screen** — Virtual joystick (drag to move)
- **Right Half Screen** — Fire button (press to shoot)

### Gameplay

1. **Wave 1-5:** Enemies spawn at the top with increasing complexity
2. **Kill Enemies:** Each enemy destroyed = 100 × multiplier points
3. **Multiplier:** Increases with consecutive kills (2x, 3x, 4x, etc.)
4. **Loot:** Destroyed enemies drop scrap (collected automatically)
5. **Health:** Player starts with 3 HP. Enemy hits deal 5 damage
6. **Game Over:** When health reaches 0, press Restart to try again

### Tips

- **Build Multiplier:** Don't waste shots — consecutive kills = higher rewards
- **Movement:** Use inertia to your advantage (smooth curved paths)
- **Safe Zones:** Top and bottom corners provide brief respite
- **Wave 5:** Maximum challenge with 11 simultaneous enemies

---

## Performance Baseline

**MVP meets all targets:**

| Metric | Achieved | Target | Status |
|--------|----------|--------|--------|
| **FPS** | 60 stable | 60 | ✅ |
| **P95 Frame Time** | 17.8 ms | ≤ 20 ms | ✅ |
| **Bundle Size** | 8.86 KB (gz) | < 200 KB | ✅ |
| **Frame Drops** | 0 / 5-wave run | 0 | ✅ |
| **Crashes** | 0 | 0 | ✅ |

See [Testing.md](docs/Testing.md) and [QA_TEST_LOG_20251031.md](docs/QA_TEST_LOG_20251031.md) for detailed profiling.

---

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start dev server with hot-reload |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check code style (ESLint) |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format code (Prettier) |
| `npm run format:check` | Check formatting compliance |

---

## Documentation

Full design and technical documentation in the `docs/` folder:

- **[01-Game-Design-Document.md](docs/01-Game-Design-Document.md)** — Gameplay mechanics, enemy types, upgrade system
- **[02-Technical-Architecture.md](docs/02-Technical-Architecture.md)** — Systems design, Canvas API, performance budgets
- **[03-Visual-Style-Guide.md](docs/03-Visual-Style-Guide.md)** — Colors, shapes, rendering, accessibility
- **[04-Audio-Strategy.md](docs/04-Audio-Strategy.md)** — Web Audio API, music loops, SFX
- **[05-Input-Spec.md](docs/05-Input-Spec.md)** — Keyboard, gamepad, touch controls
- **[Testing.md](docs/Testing.md)** — Performance targets, QA matrix, device matrix

---

## Browser Support

**Desktop & Mobile — All Modern Browsers:**

| Browser | Version | Status |
| --- | --- | --- |
| Chrome | 120+ | ✅ Full (60 FPS, P95 17.8 ms) |
| Firefox | 121+ | ✅ Full (60 FPS, P95 18.1 ms) |
| Safari | 17+ | ✅ Full (60 FPS, P95 17.5 ms) |
| Edge | 120+ | ✅ Full (60 FPS, P95 17.9 ms) |
| iOS Safari | 17+ | ✅ Full (touch, safe-areas) |
| Android Chrome | 120+ | ✅ Full (touch, notches) |

---

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start dev server with hot-reload |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check code style (ESLint) |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format code (Prettier) |
| `npm run format:check` | Check formatting compliance |

---

## Documentation

Full design and technical documentation in the `docs/` folder:

- **[01-Game-Design-Document.md](docs/01-Game-Design-Document.md)** — Gameplay mechanics, enemy types, upgrade system
- **[02-Technical-Architecture.md](docs/02-Technical-Architecture.md)** — Systems design, Canvas API, performance budgets
- **[03-Visual-Style-Guide.md](docs/03-Visual-Style-Guide.md)** — Colors, shapes, rendering, accessibility
- **[04-Audio-Strategy.md](docs/04-Audio-Strategy.md)** — Web Audio API, music loops, SFX
- **[05-Input-Spec.md](docs/05-Input-Spec.md)** — Keyboard, gamepad, touch controls
- **[Testing.md](docs/Testing.md)** — Performance targets, QA matrix, device matrix

---

## Tech Stack

- **Rendering:** HTML5 Canvas 2D (DPR-aware)
- **Language:** TypeScript (strict mode)
- **Build Tool:** Vite v7.1.12
- **Bundler:** Rollup (via Vite)
- **Minifier:** Terser
- **Code Quality:** ESLint v9 + Prettier
- **Target Frame Rate:** 60 FPS
- **Audio:** Web Audio API (SFX pool + music)
- **Input:** Keyboard + Pointer + Touch (virtual joystick)
- **Storage:** localStorage (best score persistence)

---

## Project Structure

```plaintext
.
├── index.html               # Entry point
├── src/
│   ├── main.ts              # Game loop & initialization
│   ├── Player.ts            # Player ship (movement + firing)
│   ├── Enemy.ts             # Enemy entities (4 types with AI)
│   ├── Bullet.ts            # Projectile entity
│   ├── Renderer.ts          # Canvas 2D rendering (DPR-aware)
│   ├── CollisionSystem.ts   # Circle-circle hit detection
│   ├── InputHandler.ts      # Keyboard input
│   ├── TouchControls.ts     # Virtual joystick + fire button
│   ├── AudioManager.ts      # Web Audio API (SFX pool, music)
│   ├── GameState.ts         # Game state machine
│   ├── StorageManager.ts    # localStorage (best score)
│   └── utils/
│       ├── constants.ts      # Colors, physics, budgets
│       ├── math.ts           # Utility functions (distance, normalize, etc.)
│       └── performance.ts    # Performance monitoring
├── docs/                     # Documentation pack
│   ├── CHANGELOG.md          # Version history & features
│   ├── PHASE_05_QA_SUMMARY.md # QA test results
│   ├── QA_TEST_LOG_20251031.md # Detailed test execution
│   ├── Testing.md            # Performance baselines
│   ├── 01-Game-Design-Document.md
│   ├── 02-Technical-Architecture.md
│   ├── 03-Visual-Style-Guide.md
│   ├── 04-Audio-Strategy.md
│   ├── 05-Input-Spec.md
│   └── checklists/
│       ├── 01-docs-pack-checklist.md
│       ├── 02-research-checklist.md
│       ├── 03-scaffold-checklist.md
│       ├── 05-qa-perf-checklist.md
│       └── 06-release-checklist.md
├── public/                   # Static assets (audio, images)
│   └── audio/
│       └── sfx/              # Sound effects
├── dist/                     # Production build (generated)
├── package.json              # Dependencies & scripts
├── vite.config.js            # Vite configuration
├── tsconfig.json             # TypeScript config
├── eslint.config.js          # ESLint rules
├── .gitignore                # Git ignore patterns
├── LICENSE                   # MIT License
├── README.md                 # This file
└── CHANGELOG.md              # Version history

```

---

## Development Workflow

1. **Make changes** in `src/`
2. **Dev server** auto-reloads on save:  
   ```bash
   npm run dev
   ```
3. **Check code:**  
   ```bash
   npm run lint          # Check style
   npm run lint:fix      # Auto-fix issues
   ```
4. **Build production:**  
   ```bash
   npm run build         # Output to dist/
   npm run preview       # Test locally
   ```
5. **Deploy** the `dist/` folder to GitHub Pages or static host

---

## Future Roadmap

### Phase 07+: Post-MVP Features

**Leverages 2.2 ms P95 headroom from current frame budget:**

- **Boss Battles:** Mid-wave and final bosses with unique AI patterns
- **Upgrade System:** Power-ups (rate of fire, damage multiplier, shield)
- **Wave Expansion:** 10+ waves with escalating difficulty
- **Leaderboard:** Cloud-sync for high scores
- **Story Mode:** Narrative progression between waves
- **Achievements:** Unlockable badges for milestones
- **Visual Effects:** Enhanced particle system and animations
- **Music System:** Full dynamic soundtrack with mixing

---

## Accessibility

- **WCAG 2.1 AA** compliance (color contrast 18.5:1 on HUD, requirement 4.5:1)
- **Keyboard navigation:** WASD + Space + D fully functional
- **Touch-friendly:** Virtual joystick (40px radius) + fire button
- **Reduced motion:** CSS media query support
- **Color-blind safe:** UI not color-dependent

---

## Credits

**Concept & Design:**  
GeoGala: Vector Offensive is a spiritual successor to *Galaga* and *Chicken Invaders*, modernized for the web with geometric aesthetics and high-performance canvas rendering.

**Technologies:**  
Vite, TypeScript, Canvas 2D, Web Audio API, ESLint

**License:**  
MIT — See [LICENSE](LICENSE) file.

---

## Contributing

Contributions welcome! Please:

1. Follow code style (ESLint + Prettier)
2. Test on desktop and mobile
3. Document changes in `docs/` folder
4. Keep 60 FPS performance target in mind

---

## Support & Feedback

- **GitHub Issues:** Bug reports and feature requests  
- **GitHub Discussions:** Ideas and feedback  
- **Documentation:** See `docs/` folder for technical details  
- **QA Results:** See [QA_TEST_LOG_20251031.md](docs/QA_TEST_LOG_20251031.md)

---

## Happy Gaming 🎮

Start with `npm run dev` and enjoy the high-octane arcade action!

**Play online:** [Vector Offensive MVP](https://svidal-nlive.github.io/GeoGala-Vector-Offensive/)

````
