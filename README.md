# GeoGala: Vector Offensive 👾🔺

A modern vertical fixed-shooter inspired by *Galaga* and *Chicken Invaders*. Pilot an evolving triangle ship against intelligent geometric factions in rhythm-based waves. **Simple to shoot, absurdly deep to upgrade.**

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
- **Language:** Vanilla JavaScript (ES modules)
- **Build Tool:** Vite
- **Bundler:** Rollup (via Vite)
- **Code Quality:** ESLint + Prettier
- **Target Frame Rate:** 60 FPS
- **Mobile Support:** iOS Safari, Android Chrome (safe-areas, touch input, gamepad)

---

## Browser Support

| Browser | Version | Status |
| --- | --- | --- |
| Chrome | 120+ | ✓ Full |
| Firefox | 121+ | ✓ Full |
| Safari | 17+ | ✓ Full |
| Edge | 120+ | ✓ Full |
| iOS Safari | 17+ | ✓ Full (touch + safe-areas) |
| Android Chrome | 120+ | ✓ Full (touch + notches) |

---

## Project Structure

```plaintext
.
├── index.html               # Entry point
├── src/
│   └── main.js             # Application entry
├── docs/                    # Documentation pack
│   ├── 01-Game-Design-Document.md
│   ├── 02-Technical-Architecture.md
│   ├── 03-Visual-Style-Guide.md
│   ├── 04-Audio-Strategy.md
│   ├── 05-Input-Spec.md
│   ├── Testing.md
│   └── checklists/
│       └── 01-docs-pack-checklist.md
├── assets/                  # Images, audio, data (future)
├── dist/                    # Production build (generated)
├── package.json             # Dependencies & scripts
├── vite.config.js          # Vite configuration
├── .eslintrc.json          # ESLint rules
├── .prettierrc.json        # Prettier format
├── .gitignore              # Git ignore patterns
├── .env.example            # Environment variables template
├── LICENSE                 # MIT License
└── README.md               # This file
```

---

## Development Workflow

1. **Make changes** in `src/`
2. **Dev server** auto-reloads on save (hot-module replacement)
3. **Check code** with `npm run lint` and `npm run format`
4. **Test** in browser at `http://localhost:5173`
5. **Build** with `npm run build` for production
6. **Deploy** the `dist/` folder to any static host

---

## Performance Targets

- **FPS:** 60 constant (55+ on 98% of frames)
- **Input Latency:** ≤ 50 ms
- **Bundle Size:** ≤ 500 KB uncompressed, ≤ 150 KB gzipped
- **Memory:** ≤ 80 MB peak (desktop), ≤ 60 MB (mobile)
- **Lighthouse:** ≥ 90 (Performance, Accessibility)

See [Testing.md](docs/Testing.md) for detailed metrics.

---

## Accessibility

- **WCAG 2.1 AA** compliance (color contrast ≥ 4.5:1)
- **Keyboard navigation** for all controls
- **Touch-friendly** UI (44×44 px minimum touch targets)
- **Screen reader** support for HUD labels
- **Reduced motion** support for prefers-reduced-motion

---

## Credits

**Design & Concept:**  
GeoGala: Vector Offensive is a spiritual successor to *Galaga* and *Chicken Invaders*, modernized for web with geometric aesthetics.

**License:**  
MIT — See [LICENSE](LICENSE) file.

---

## Contributing

Contributions welcome! Please:

1. Follow the code style (ESLint + Prettier)
2. Test on desktop and mobile devices
3. Document changes in relevant `docs/` files
4. Keep performance targets in mind (60 FPS, ≤ 50 ms input lag)

---

## Support & Feedback

- **Issues:** Open a GitHub issue for bugs or feature requests
- **Discussion:** Use GitHub Discussions for ideas and feedback
- **Docs:** See `docs/` folder for detailed technical documentation

---

## Happy Coding 🎮

Start developing with `npm run dev` and have fun building the ultimate arcade experience!
