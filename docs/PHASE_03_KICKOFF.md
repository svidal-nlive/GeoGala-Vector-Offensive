# 🎬 KICKOFF MESSAGE – Phase 03: Project Scaffolder

## Agent: Phase 03: Project Scaffolder

### Objective

Bootstrap the GeoGala: Vector Offensive project structure with validated architectural decisions from Phase 02 research, establishing the file hierarchy, build pipeline, dev harness, and core entity templates ready for Phase 04 (MVP implementation).

### Context

**Game Title:** GeoGala: Vector Offensive

**Concept Pitch:**  
A modern vertical fixed-shooter inspired by Galaga and Chicken Invaders. Pilot an evolving triangle ship against intelligent geometric factions (Triangles, Squares, Hexagons, Diamonds) in rhythm-based waves. Each run layers deep weapon mods, ship evolutions, and synergy nodes for near-endless build variety. **Simple to shoot, absurdly deep to upgrade.**

**Tech Baseline:**  
Vanilla HTML/CSS/JS (ES modules), single DPR-aware Canvas 2D, 60 FPS hard target, WCAG AA accessibility, mobile-safe (keyboard, gamepad, touch).

**Phase 02 Deliverables (Research Complete):**

- `/docs/Notes.md` — 56 authoritative research bullets across 8 topics (Canvas, Input, Audio, Performance, A11y, State, Collision, Profiling)
- `/docs/research/visited.json` — Cached 17 canonical URLs (MDN, W3C, webkit.org, web.dev); no re-fetch required
- `/docs/checklists/02-research-checklist.md` — All 13 research tasks complete; audit trail logged

**Validated Decisions from Phase 02:**

1. **Game Loop:** RAF + delta-time (avoids frame skew on high-refresh displays)
2. **Canvas Rendering:** DPR-aware scaling, pixel-grid alignment, Path2D pre-computation
3. **Input Priority:** Gamepad (0.15 radial deadzone) > Keyboard > Pointer/Touch
4. **Audio:** Web Audio context.resume() on first user interaction; loopStart/loopEnd seamless loops; 4–8 polyphonic SFX pooling; GainNode ducking
5. **Collision:** AABB broad-phase + optional spatial grid (fallback if checks > 3ms)
6. **Entity Pooling:** Pre-allocate 65 objects (15 enemies + 50 bullets); reuse throughout run
7. **State:** localStorage for workshop upgrades (~5–10 MB JSON); run-state ephemeral (in-memory)
8. **Mobile Safe-Areas:** `env(safe-area-inset-*)` CSS; `viewport-fit=cover`; `screen.orientation.lock('portrait')`

### Key Constraints

- No frameworks (Vanilla JS only)
- Canvas 2D (DPR-aware scaling)
- 60 FPS hard floor (frame budget: 12ms render, 3ms update, 2ms audio, 1.67ms reserve)
- ≤ 50 ms input latency
- WCAG AA accessibility (4.5:1 text contrast, 3:1 UI)
- Mobile-first safe-areas, notches, dynamic viewport units
- 3 input methods: Keyboard, Gamepad, Touch
- Web Audio (music loops, SFX pooling)
- Vite build pipeline with tree-shaking, minification
- Bundle size ≤ 200 KB (gzipped)

### Scaffold Deliverables (Expected on Branch `scaffold/phase-03`)

#### Folder Structure

```text
GeoGala - Vector Offensive/
├── src/
│   ├── main.js                          # Entry point: RAF loop bootstrap
│   ├── GameState.ts                     # Central run-state manager
│   ├── Renderer.ts                      # Canvas DPR-aware wrapper
│   ├── CollisionSystem.ts               # AABB broad-phase detector
│   ├── Entity.ts                        # Base class: Player, Enemy, Bullet
│   ├── Player.ts                        # Ship controller
│   ├── Enemy.ts                         # Geometric faction AI
│   ├── Bullet.ts                        # Projectile pooling
│   ├── InputHandler.ts                  # Keyboard/Gamepad/Pointer unified API
│   ├── AudioManager.ts                  # Web Audio context + SFX pooling
│   ├── StorageManager.ts                # localStorage wrapper (workshop persistence)
│   └── utils/
│       ├── math.ts                      # Vector2, collision helpers
│       ├── performance.ts               # FPS counter, frame budget profiling
│       └── constants.ts                 # Game constants (speeds, colors, deadzone)
├── public/
│   ├── index.html                       # Updated with viewport meta, safe-area CSS
│   ├── styles.css                       # WCAG AA safe colors, mobile safe-area padding
│   ├── audio/
│   │   ├── music.mp3                    # Placeholder (will be decoded via Web Audio)
│   │   └── sfx/
│   │       ├── fire.mp3
│   │       ├── hit.mp3
│   │       └── upgrade.mp3
├── docs/
│   ├── 01-Game-Design-Document.md       # (existing)
│   ├── 02-Technical-Architecture.md     # (existing)
│   ├── 03-Visual-Style-Guide.md         # (existing)
│   ├── 04-Audio-Strategy.md             # (existing)
│   ├── 05-Input-Spec.md                 # (existing)
│   ├── Testing.md                       # (existing)
│   ├── Notes.md                         # Research notes (Phase 02)
│   ├── research/
│   │   └── visited.json                 # (existing)
│   └── checklists/
│       ├── 00-orchestrator-checklist.md # (existing)
│       ├── 01-phase-01-checklist.md     # (existing)
│       └── 02-research-checklist.md     # (existing)
├── package.json                         # (existing, validated)
├── vite.config.js                       # (existing, validated)
├── index.html                           # (existing, update meta)
├── .eslintrc.json                       # (existing)
├── .prettierrc.json                     # (existing)
├── .env.example                         # (existing)
├── .gitignore                           # (existing)
└── README.md                            # (existing)
```

#### Core Files to Generate

1. **`src/main.js`** — RAF-based game loop with delta-time accumulation
   - Bootstrap AudioContext (resume on first user input)
   - Lock screen orientation to portrait
   - Init GameState, Renderer, InputHandler, AudioManager, CollisionSystem
   - Frame budget profiling (log p95 frame times every 60 frames)
   - Render loop: clear → update(dt) → collision check → draw

2. **`src/GameState.ts`** — Central run-state object
   - Wave management (current wave #, active enemies, wave progression)
   - Run score, multiplier, resource counters
   - Workshop synergy nodes (player-selected upgrades)
   - Serialization methods for localStorage (save/load workshop upgrades only)

3. **`src/Renderer.ts`** — Canvas DPR-aware wrapper
   - Initialize canvas with DPR scaling (ctx.scale(dpr, dpr))
   - Methods: clear(), drawShape(shape, fill, stroke), drawText(text, x, y, size)
   - Batch rendering pipeline (no state mutations mid-frame)

4. **`src/Entity.ts`** — Base entity class with pooling
   - Abstract: alive, x, y, vx, vy, radius (collision)
   - Methods: update(dt), draw(ctx), reset(x, y, vx, vy)
   - Subclasses: Player, Enemy, Bullet (with specific behavior overrides)

5. **`src/Player.ts`** — Player-controlled ship
   - Position, aim angle, health, fire rate
   - Sync input from InputHandler (keyboard/gamepad/pointer priority)
   - Draw: filled triangle rotated by aim angle
   - Fire bullets into pool on input

6. **`src/Enemy.ts`** — Geometric faction AI
   - Faction type (Triangle, Square, Hexagon, Diamond)
   - Faction-specific AI patterns (placeholder: linear movement + random fire)
   - Health, fire rate, loot drop (upgrade nodes, resources)
   - Draw: faction-specific shape

7. **`src/Bullet.ts`** — Pooled projectile
   - Type: player bullet or enemy projectile
   - Velocity, lifetime, collision check
   - Owner tracking (player or enemy)

8. **`src/InputHandler.ts`** — Unified input API
   - Keyboard state (WASD, Space, Arrow keys)
   - Gamepad polling (axis + button state, deadzone applied)
   - Pointer/Touch tracking (implicit capture, multi-touch)
   - Priority resolution: gamepad > keyboard > pointer
   - Public methods: getAimAngle(), isFiring(), shutdown()

9. **`src/AudioManager.ts`** — Web Audio API wrapper
   - AudioContext lifecycle (resume on first user interaction)
   - Music playback: loopStart/loopEnd (seamless loops)
   - SFX pool: 4–8 reusable AudioBufferSourceNode instances
   - GainNode ducking: reduce music when SFX plays
   - Master gain for run mute

10. **`src/CollisionSystem.ts`** — AABB broad-phase detector
    - Methods: checkCollisions(entities), addGridCell(x, y, entity) [optional]
    - Return list of collision pairs (entity1, entity2)
    - Spatial grid fallback if AABB checks exceed 3ms

11. **`src/StorageManager.ts`** — localStorage wrapper
    - Save/load workshop upgrades (JSON serialization)
    - Validation: fallback to defaults if corrupted
    - Methods: saveUpgrades(nodes), loadUpgrades(), clearRun()

12. **`src/utils/math.ts`** — Helper utilities
    - Vector2 class (add, subtract, magnitude, normalize, dot, cross)
    - AABB collision check
    - Angle normalization
    - Deadzone application (radial 0.15)

13. **`src/utils/performance.ts`** — Profiling harness
    - FPS counter (update every 1 second)
    - Frame time tracker (p95 quantile)
    - Frame budget warning if p95 > 18ms

14. **`src/utils/constants.ts`** — Game constants
    - Ship speed, bullet speed, enemy speed
    - Colors (WCAG AA palette)
    - Gamepad deadzone (0.15)
    - Audio context parameters (polyphony limit, etc.)

#### Configuration Updates

15. **`index.html`** — Update meta tags
    - Add `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
    - Add `<meta name="theme-color" content="...">`
    - Add safe-area CSS for HUD padding

16. **`styles.css`** — Mobile safe-areas + accessibility
    - Set `#game-container` with safe-area padding
    - WCAG AA contrast verified (4.5:1 text, 3:1 UI)
    - `touch-action: none` on canvas
    - `@media (prefers-reduced-motion: reduce)` for accessibility

17. **`package.json`** — Validate dependencies (already present from Phase 01)
    - Ensure vite, eslint, prettier are pinned
    - Add postinstall script if needed for audio file downloads

#### Dev Harness (Optional Starter Features)

- **Debug HUD** overlay showing:
  - Current FPS (real-time)
  - p95 frame time
  - Active entity count
  - Current wave #
  - Toggle with key `D` (debug mode)
  
- **Profiling Console** (optional):
  - Log frame times every 60 frames
  - Detect frame overruns (p95 > 18ms)

### Expected Deliverables PR

**Title:** `scaffold: project skeleton with core entity system`

**Contents:**

- Folder structure as above (16 TypeScript/JS files)
- Updated `index.html` and `styles.css`
- `public/audio/` placeholder files (empty .mp3 stubs)
- All files ESLint/Prettier clean
- Game loop runs at 60 FPS (RAF baseline, no logic yet)
- FPS counter visible in top-left corner (debug mode via key `D`)
- All entities render at correct DPR on Retina/mobile
- Input handler detects keyboard, gamepad, pointer (no logic wired yet)
- AudioContext resume pattern implemented
- localStorage wrapper functional (no data persisted yet)
- No errors in console on modern browsers (Chrome, Safari, Firefox)

### Completion Criteria

- ✅ All 16 source files created and ESLint/Prettier clean
- ✅ Game loop RAF-based, delta-time working, 60 FPS achieved
- ✅ Canvas DPR-aware (test on real device or emulation)
- ✅ Input handler polling gamepad + keyboard + pointer (no priority logic needed yet)
- ✅ Audio context resume pattern verified (test on iOS)
- ✅ Collision system returns empty list (no entities have logic yet)
- ✅ FPS counter visible (top-left, toggle with `D`)
- ✅ All files committed to `scaffold/phase-03` branch
- ✅ PR opened against `main` with description of scaffold structure
- ✅ No lint errors, no console warnings

### Tools (Expected MCPs)

- VS Code file creation & editing
- GitHub branch creation & PR submission
- Terminal for Vite dev server (`npm run dev`)
- ESLint/Prettier validation

### Next Phase (Phase 04)

Once Phase 03 scaffold is merged to `main`, Phase 04 (Docs-to-Code Builder) will implement:

1. **Sprint 1:** Game loop logic, wave spawning, enemy AI patterns
2. **Sprint 2:** Rendering (enemy shapes, player ship, HUD)
3. **Sprint 3:** Collision detection + damage/death
4. **Sprint 4:** Input wiring, audio playback, SFX/music
5. **Sprint 5:** Integration testing, frame budget validation, mobile testing

---

**Finish with:** Create PR `scaffold: project skeleton with core entity system` and **STATUS: DONE** once merged to `main`.
