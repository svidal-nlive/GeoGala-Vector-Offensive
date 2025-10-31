# 🎬 KICKOFF MESSAGE – Phase 04: Docs-to-Code Builder (MVP)

## Agent: Phase 04: Docs-to-Code Builder

### Objective

Implement the GeoGala: Vector Offensive MVP core game loop across 5 development sprints, translating all validated architectural decisions and Phase 03 scaffolding into a playable vertical shooter with 60 FPS performance, full input/audio integration, and collision-based gameplay.

### Context

**Game Title:** GeoGala: Vector Offensive

**Concept Pitch:**  
A modern vertical fixed-shooter inspired by Galaga and Chicken Invaders. Pilot an evolving triangle ship against intelligent geometric factions (Triangles, Squares, Hexagons, Diamonds) in rhythm-based waves. Each run layers deep weapon mods, ship evolutions, and synergy nodes for near-endless build variety. **Simple to shoot, absurdly deep to upgrade.**

**Tech Baseline:**  
Vanilla HTML/CSS/JS (ES modules), single DPR-aware Canvas 2D, 60 FPS hard target, WCAG AA accessibility, mobile-safe (keyboard, gamepad, touch).

**Phase 03 Deliverables (Scaffold Complete):**

- `src/` — 14 core game files (main.ts, GameState, Renderer, Entity pool, Player, Enemy, Bullet, InputHandler, AudioManager, CollisionSystem, StorageManager, utilities)
- `index.html`, `styles.css` — Viewport meta, safe-area CSS, WCAG AA colors
- `eslint.config.js` — ESLint v9 + TypeScript
- `public/audio/` — Audio placeholder stubs
- Branch: `scaffold/phase-03` (2 commits, 48 files, 6,749 insertions)
- Validation: ✅ 60 FPS RAF baseline, ✅ ESLint 0 errors, ✅ Vite dev server running, ✅ Input detection working, ✅ Canvas DPR-aware

**Validated Architectural Decisions (from Phase 02 Research):**

1. **Game Loop:** RAF + delta-time (16.67ms budget @ 60 FPS)
2. **Rendering:** Canvas 2D, DPR-aware, pixel-grid aligned
3. **Input:** Gamepad (0.15 radial deadzone) > Keyboard > Pointer/Touch
4. **Audio:** Web Audio context.resume() on user interaction, loopStart/loopEnd loops, 4–8 SFX pool
5. **Collision:** AABB broad-phase circle detection
6. **Entity Pooling:** 65 pre-allocated objects (1 player, 15 enemies, 50 bullets)
7. **State:** localStorage for workshop; run-state ephemeral
8. **Mobile:** env(safe-area-inset-*) CSS, viewport-fit=cover, screen.orientation.lock('portrait')

### Key Constraints

- No frameworks (Vanilla JS only)
- Canvas 2D (DPR-aware scaling)
- 60 FPS hard floor (frame budget: 12ms render, 3ms update, 2ms audio, 1.67ms reserve)
- ≤ 50 ms input latency
- WCAG AA accessibility (4.5:1 text contrast, 3:1 UI, focus indicators)
- 3 input methods: Keyboard, Gamepad, Touch
- Web Audio (music loops, SFX pooling, gain ducking)
- Vite build pipeline with tree-shaking, minification
- Bundle size ≤ 200 KB (gzipped)

### Implementation Roadmap (5 Sprints)

---

## **SPRINT 1: Game Loop Logic & Wave System**

**Objective:** Implement deterministic game simulation with wave spawning, enemy AI, and state progression.

### Deliverables

1. **Wave Progression Engine** (`src/WaveManager.ts`)
   - Define wave patterns per faction (Triangle, Square, Hexagon, Diamond)
   - Wave #1–5: Progressive difficulty (enemy count, speed, fire rate)
   - Wave spawn rate: ~1 enemy per 0.5 sec at start of wave
   - All enemies spawned at top, move down in formation
   - Methods: `startWave(waveNum)`, `spawnEnemy()`, `getWaveProgress()`, `isWaveComplete()`

2. **Enemy AI Patterns** (`src/Enemy.ts` — extend existing)
   - **Triangle:** Linear downward movement, fire every 0.5s at random angle
   - **Square:** Sinusoidal horizontal + downward movement, fire every 0.4s in 4-way pattern
   - **Hexagon:** Spiral descent, fire every 0.3s in rotating 6-way pattern
   - **Diamond:** Erratic movement (change angle every 1s), fire every 0.2s downward
   - All factions: Remove from wave when health ≤ 0

3. **Score & Multiplier System** (`src/GameState.ts` — extend)
   - Base score per enemy: 100 × faction_level
   - Multiplier increases by 0.1× per wave completed (1.0× → 1.1× → 1.2× ... → capped at 2.0×)
   - Bonus for no-hit waves: +10% score
   - Track: score, multiplier, combo counter

4. **Resource Drop System** (`src/LootManager.ts`)
   - Enemy death → drop scrap/synergy nodes at enemy position
   - Scrap (gold particles): 10–25 per enemy (faction-dependent)
   - Synergy nodes (blue crystals): 1 per rare enemy kill
   - Player pickup range: radius + 50 pixels auto-collect on collision
   - Methods: `spawnLoot(x, y, type, amount)`, `collectLoot(player)`

5. **Run State Progression** (`src/GameState.ts` — extend)
   - Track: current wave, enemies alive, player health, total score
   - Conditions: Wave complete = all enemies dead, pause 1s before next wave
   - Conditions: Run end = player health ≤ 0
   - Save run history to localStorage (best score, run count)

6. **Test Harness: Starter Wave** (`src/main.ts` — extend)
   - Spawn Wave 1 on game start
   - Spawn 3 Triangle enemies at 1s intervals
   - Verify wave completion when all enemies killed

### Testing Checklist

- [ ] Wave 1 spawns 3 Triangle enemies correctly
- [ ] Enemies move downward at ~150 px/s
- [ ] Enemies fire projectiles downward
- [ ] Enemy death reduces health, triggers death animation
- [ ] Score updated on enemy death (100 × multiplier)
- [ ] Wave complete triggered after all enemies dead
- [ ] FPS stable at 60 (p95 < 18ms)

---

## **SPRINT 2: Rendering Pipeline & HUD**

**Objective:** Implement visual rendering for all game elements with clean, readable HUD.

### Deliverables

1. **Enemy Faction Shapes** (`src/Renderer.ts` — extend with faction-specific drawing)
   - **Triangle:** Equilateral triangle (pointing down), 12px radius, red (#ff1744)
   - **Square:** Rotated square, 12px half-width, red (#ff1744)
   - **Hexagon:** Regular hexagon, 12px radius, red (#ff1744)
   - **Diamond:** Rotated square on-point (diamond), 12px half-width, red (#ff1744)
   - All with 1px white outline (#ffffff)
   - Flicker on damage (every 50ms for 200ms)

2. **Player Ship Visual Feedback** (`src/Player.ts` — extend)
   - Base ship: Cyan triangle (#00ff88), 15px radius
   - Rotation: Smooth rotation to aim angle (15 frames max rotation)
   - Fire flash: Bright white glow for 1 frame when firing
   - Damage flash: Red tint for 200ms on hit
   - Shield visual (optional): Thin circle outline around ship when health > 50%

3. **Projectile Rendering** (`src/Renderer.ts`)
   - **Player bullets:** Yellow circles (#ffeb3b), 3px radius
   - **Enemy projectiles:** Red circles (#ff1744), 3px radius
   - Trails (optional): 2-frame position history for motion blur effect

4. **HUD Layout** (`src/HUD.ts`)

   ```
   Top-left:
     Wave: 1
     Score: 1,250 (×1.2 multiplier)
     Resources: Scrap 45 | Synergy 2
   
   Top-right (mobile safe-area offset):
     Health: ▓▓▓░░░░░░ (30/100 HP)
   
   Bottom-center (debug mode only, toggle D):
     FPS: 60 | P95: 14.2ms | Entities: 12
   ```

   - Text: Courier New, 14px, white (#ffffff)
   - WCAG AA verified (4.5:1 contrast on navy bg #0a0e27)
   - Methods: `drawHUD(renderer, gameState)`, `drawDebugInfo(renderer, perf)`

5. **Wave Transition Screen** (optional)
   - Display "Wave N" centered on screen for 2 seconds before spawn
   - Fade in/out with reduced motion support

6. **Enemy Death Animation** (optional)
   - Shrink + fade out over 0.3s
   - Particle burst (4 small triangles radiating outward)

### Testing Checklist

- [ ] All 4 enemy types render with correct shapes & colors
- [ ] Player ship rotates smoothly to aim angle
- [ ] Bullets render (yellow player, red enemy)
- [ ] HUD displays score, wave, health, resources
- [ ] HUD positioned in safe-area (no notch overlap on mobile)
- [ ] Debug HUD visible when toggling D key
- [ ] Enemy death animation plays
- [ ] FPS stable at 60 during rendering-heavy scenes

---

## **SPRINT 3: Collision Detection & Damage System**

**Objective:** Implement hit detection, damage calculation, and entity lifecycle management.

### Deliverables

1. **Collision Pair Resolution** (`src/CollisionSystem.ts` — extend)
   - Each frame: check all collision pairs (player-enemy, player-bullet, bullet-enemy)
   - Circle-to-circle: `dist < r1 + r2`
   - Per collision: Apply damage, trigger hit FX, remove projectile

2. **Damage Calculation** (`src/DamageCalculator.ts`)
   - Player bullet hit enemy: 10 damage per bullet (one-shot most basic enemies)
   - Enemy bullet hit player: 5 damage per hit
   - Enemy collision with player: 10 damage (avoid stacking with bullet)
   - Track damage per frame (no multi-hit per frame)

3. **Enemy Death & Loot** (`src/Enemy.ts`, `src/LootManager.ts` — extend)
   - On health ≤ 0:
     - Trigger death animation (shrink + fade)
     - Spawn loot: scrap (10 + faction_level × 5), synergy (0–2 per rare enemy)
     - Play SFX (optional: placeholder)
     - Remove from active enemies
   - Loot type by faction:
     - Triangle: 10 scrap
     - Square: 15 scrap + 1 synergy
     - Hexagon: 20 scrap + 2 synergy
     - Diamond: 25 scrap + 3 synergy

4. **Player Health & Game Over** (`src/GameState.ts` — extend)
   - Player starts with 100 HP
   - On player health ≤ 0:
     - Play "Game Over" state
     - Display final score + best score
     - Show "Press Space to retry" prompt
     - Fade to black over 1s

5. **Loot Collection** (`src/Player.ts`, `src/LootManager.ts` — extend)
   - Player collision with loot: auto-collect (no click needed)
   - Add to GameState resources (scrap, synergy)
   - Loot disappears on collect
   - Collection radius: player.radius + 50px

6. **Frame Budget Validation** (`src/utils/performance.ts` — extend)
   - Log p95 frame time every 10 waves
   - Warn if p95 > 18ms (exceeds 16.67ms + 1.33ms margin)
   - Profile collision checks: target < 3ms

### Testing Checklist

- [ ] Player bullet kills Triangle enemy on 1 hit
- [ ] Enemy bullet deals 5 damage on hit
- [ ] Player health decreases visually (HUD bar)
- [ ] Enemy death triggers animation + loot spawn
- [ ] Player collects loot automatically
- [ ] Score increases on enemy kill
- [ ] Player death triggers "Game Over" state
- [ ] FPS remains 60 with 15+ entities on screen
- [ ] Collision checks < 3ms per frame

---

## **SPRINT 4: Input Wiring & Audio Integration**

**Objective:** Wire input handling to player movement/firing, implement Web Audio playback with sound effects and music.

### Deliverables

1. **Player Input Wiring** (`src/main.ts`, `src/Player.ts` — extend)
   - Input: getInput() from InputHandler (x, y, fire)
   - Movement: Apply input to player.vx, player.vy (normalized, capped at maxSpeed)
   - Firing: If input.fire && canFire(), spawn bullet at player position in aim direction
   - Bullet velocity: cos(aimAngle) × 300 px/s, sin(aimAngle) × 300 px/s
   - Aim angle: Derived from input direction (atan2(y, x))
   - Boundary checking: Clamp player.x to [0, 800], player.y to [500, 600] (keep near bottom)

2. **Audio Context Initialization** (`src/AudioManager.ts` — extend)
   - On first user interaction (click, key, touch):
     - Call audioContext.resume()
     - Load placeholder audio files (optional: use generated tones for testing)
     - Initialize master gain node
   - Status: Log "Audio ready" to console

3. **SFX Playback** (`src/AudioManager.ts` — extend)
   - **Player fire:** Short beep/buzz (0.1s duration)
   - **Enemy fire:** Lower-pitched beep (0.15s)
   - **Enemy death:** Rising tone (0.2s)
   - **Player hit:** Buzzer/error tone (0.2s)
   - **Loot collect:** Coin-like chime (0.3s)
   - Pool 6 sources; play SFX without blocking other sounds

4. **Music Playback** (`src/AudioManager.ts` — extend)
   - Load music file (placeholder or generated)
   - On wave start: Play music with loopStart/loopEnd (seamless loop)
   - Music gain: 0.5 (moderate volume)
   - Stop on game over

5. **Gain Ducking (Audio Mix)** (`src/AudioManager.ts` — extend)
   - When SFX playing: Reduce music gain to 0.3 (duck)
   - When all SFX done: Return music gain to 0.5
   - Transition: 0.1s exponential ramp (smooth)

6. **Audio File Generation (for Testing)** (`src/utils/audioGenerator.ts` — optional)
   - Generate test tones programmatically:
     - Fire: 800 Hz sine, 0.1s
     - Enemy fire: 400 Hz sine, 0.15s
     - Death: 600 Hz → 800 Hz sweep, 0.2s
     - Hit: 200 Hz buzzer, 0.2s
     - Collect: 1000 Hz chime, 0.3s
   - Methods: `generateTone(freq, duration, type)`, `generateSweep(f1, f2, duration)`

### Testing Checklist

- [ ] WASD/arrows move player ship (smooth, no jitter)
- [ ] Gamepad analog stick moves ship with deadzone applied
- [ ] Space or gamepad button fires bullets
- [ ] Aiming follows pointer/gamepad direction
- [ ] Player constrained to bottom area (y ∈ [500, 600])
- [ ] Audio context resumes on first click
- [ ] Fire SFX plays on bullet spawn
- [ ] Enemy death SFX plays on kill
- [ ] Music loops seamlessly
- [ ] Gain ducking: music quiets when SFX plays
- [ ] Input latency ≤ 50ms (visual test: no perceivable lag)
- [ ] FPS stable at 60 during audio playback

---

## **SPRINT 5: Integration Testing & Mobile Validation**

**Objective:** Full game playthrough testing, performance optimization, and cross-platform validation.

### Deliverables

1. **Full Game Loop Walkthrough**
   - Start game → Wave 1 spawns (3 Triangles)
   - Player destroys all enemies
   - Wave 2 spawns (3 Squares + 2 Triangles, harder AI)
   - Player defeats wave 2
   - Repeat waves 3–5 with progressive difficulty
   - Game Over after ~5 minutes (typical run)
   - Verify: Score increases, multiplier stacks, resources accumulate, no crashes

2. **Frame Budget Profiling** (`src/utils/performance.ts` — extend)
   - Target: p95 frame time ≤ 18ms @ 60 FPS
   - Log every 60 frames (1 second)
   - Breakdown: Render time, Update time, Collision time, Audio time
   - Acceptable: 12ms render, 3ms update, 2ms collision, 1ms audio, 1.67ms reserve

3. **Memory Profiling** (Chrome DevTools)
   - Baseline heap: < 20 MB at startup
   - Steady-state heap: < 30 MB after 10 waves
   - Check: No unbounded growth after 30 min gameplay
   - Verify: Entity pooling prevents garbage collection spikes

4. **Mobile Testing** (Pixel 4a, iPhone SE emulation)
   - **Screen orientation:** Lock to portrait via `screen.orientation.lock('portrait')`
   - **Safe-areas:** HUD positioned with `env(safe-area-inset-*)` CSS
   - **Touch input:** Aim ship towards pointer, tap/drag to fire
   - **Gamepad:** Test on Android with Bluetooth gamepad
   - **Performance:** 60 FPS sustained on low-end mobile (Pixel 4a baseline)
   - **Viewport:** Responsive canvas (90vw max on mobile)

5. **Accessibility Audit** (WCAG AA)
   - Contrast ratios: 4.5:1 (text), 3:1 (UI) ✓
   - Focus visible: Keyboard Tab navigation to start/retry buttons
   - Reduced motion: Respect `prefers-reduced-motion: reduce` (no spinning, no flashing > 3 Hz)
   - Screen reader support (optional): Label key UI elements

6. **Cross-Browser Testing**
   - **Chrome** (latest): Baseline
   - **Firefox** (latest): Verify Canvas, Web Audio, Gamepad APIs
   - **Safari** (iOS 15+): Test Audio context resume, safe-areas
   - **Edge** (latest): Gamepad support
   - Acceptable issues: None (all modern browsers supported)

7. **Build Optimization** (`vite.config.js`)
   - `npm run build` → dist/ folder
   - Bundle size: Target ≤ 200 KB gzipped
   - Tree-shake unused code
   - Minify & mangle JS
   - Verify: No console warnings, all assets included

8. **Code Quality & Documentation**
   - ESLint: 0 errors, warnings acceptable (console statements in dev only)
   - Prettier: All files formatted consistently
   - JSDoc comments on public methods
   - README updated with build/dev instructions
   - Checklist updated with completion status

### Testing Checklist

- [ ] 5-wave full playthrough without crashes
- [ ] Score multiplier stacks correctly (×1.0 → 1.1 → 1.2 ... → 2.0)
- [ ] Resources accumulate (scrap + synergy)
- [ ] p95 frame time ≤ 18ms for entire game
- [ ] Heap memory stable (< 30 MB) after 30 min gameplay
- [ ] Mobile portrait lock works
- [ ] Safe-area HUD positioned correctly (no notch overlap)
- [ ] Touch aiming responsive (< 50ms latency)
- [ ] Gamepad input works on Android
- [ ] 60 FPS sustained on Pixel 4a emulation
- [ ] All browsers (Chrome, Firefox, Safari, Edge) load without errors
- [ ] Bundle size ≤ 200 KB gzipped
- [ ] WCAG AA contrast & focus verified
- [ ] Reduced motion mode works (no animations on disabled)
- [ ] All documentation updated

---

## Expected Deliverables PR

**Title:** `feat: MVP core loop with waves, collision, and audio`

**Branch:** `feat/phase-04-mvp` (branched from `scaffold/phase-03` on main)

**Contents:**

- 8 new source files:
  - `src/WaveManager.ts`
  - `src/LootManager.ts`
  - `src/DamageCalculator.ts`
  - `src/HUD.ts`
  - `src/utils/audioGenerator.ts`
  - Sprint-specific extensions to existing files (Entity, Enemy, AudioManager, Renderer, main.ts)

- Updated files:
  - `src/main.ts` — Full game loop integration
  - `src/GameState.ts` — Score, multiplier, resource tracking
  - `src/Player.ts` — Input wiring, health, firing
  - `src/Enemy.ts` — AI patterns, death logic
  - `src/AudioManager.ts` — SFX pool, music playback, gain ducking
  - `src/Renderer.ts` — Enemy shapes, HUD drawing

- Documentation:
  - `docs/checklists/04-mvp-checklist.md` — Integration checklist
  - `docs/IMPLEMENTATION_NOTES.md` — Technical decisions, performance notes

- Build output:
  - `dist/` — Production bundle (if running `npm run build`)

### Completion Criteria

- ✅ Wave 1–5 implement progressive difficulty
- ✅ All 4 enemy factions with unique AI patterns
- ✅ Collision detection working (player-enemy, bullet-enemy)
- ✅ Damage system reduces health, triggers death
- ✅ Score multiplier stacks per wave
- ✅ Resources drop on enemy death, auto-collect
- ✅ Player input wired (movement, firing, aiming)
- ✅ Audio context resumes on first interaction
- ✅ SFX play on events (fire, death, hit, collect)
- ✅ Music loops seamlessly, gain ducking works
- ✅ HUD displays wave, score, health, resources
- ✅ p95 frame time ≤ 18ms (60 FPS stable)
- ✅ Mobile portrait lock, safe-areas, touch input
- ✅ WCAG AA contrast & focus verified
- ✅ Cross-browser testing passed (Chrome, Firefox, Safari, Edge)
- ✅ Bundle ≤ 200 KB gzipped
- ✅ 0 ESLint errors, no console errors in production
- ✅ All sprint 1–5 test checklists passed

### Tools (Expected MCPs)

- VS Code file creation & editing
- Terminal for dev server (`npm run dev`), build (`npm run build`), lint, profiling
- Chrome DevTools for performance profiling & mobile emulation
- GitHub for PR workflow

### Success Metrics

| Metric | Target | Status |
|--------|--------|--------|
| FPS (p95) | ≤ 18 ms | *In Progress* |
| Frame render | ≤ 12 ms | *In Progress* |
| Input latency | ≤ 50 ms | *In Progress* |
| Heap memory | ≤ 30 MB | *In Progress* |
| Bundle size (gzipped) | ≤ 200 KB | *In Progress* |
| WCAG AA contrast | 4.5:1 text, 3:1 UI | *In Progress* |
| Mobile FPS (Pixel 4a) | ≥ 50 FPS p95 | *In Progress* |
| Cross-browser | 0 errors | *In Progress* |

### Timeline (Estimate)

- **Sprint 1 (Wave System):** 3–4 hours
- **Sprint 2 (Rendering):** 2–3 hours
- **Sprint 3 (Collision & Damage):** 2–3 hours
- **Sprint 4 (Input & Audio):** 3–4 hours
- **Sprint 5 (Integration & Testing):** 4–5 hours
- **Total:** ~16–20 hours equivalent work

### Post-Phase 04 (Future Phases)

Once MVP is merged to main:

- **Phase 05 (QA & Performance):** Deep optimization, Lighthouse audit, accessibility polish
- **Phase 06 (Release & Handoff):** Version bump, changelog, GitHub release, deployment to GitHub Pages

---

**Finish with:** Create PR `feat: MVP core loop with waves, collision, and audio` and **STATUS: DONE** once merged to main.

---

### Notes

- Sprints can overlap; prioritize Sprint 1 (game loop logic) before proceeding to rendering
- All code must remain ESLint clean and pass Prettier formatting
- Performance profiling is critical; profile early and often (target frame budget on every sprint)
- Mobile testing should begin in Sprint 4 (input wiring) to catch platform-specific issues
- Audio generation can use Web Audio API programmatically if placeholder files unavailable
- Lean on Phase 02 research notes (`/docs/Notes.md`) for API reference & best practices
