# 🎬 KICKOFF MESSAGE – Phase 02: Research Curator

## Agent: Phase 02: Research Curator

### Objective

Synthesize external research and create a comprehensive implementation roadmap for *GeoGala: Vector Offensive*, establishing the technical direction and decision points for Phase 03 (MVP Scaffold).

### Context

**Game Title:** GeoGala: Vector Offensive

**Concept Pitch:**  
A modern vertical fixed-shooter inspired by Galaga and Chicken Invaders. Pilot an evolving triangle ship against intelligent geometric factions (Triangles, Squares, Hexagons, Diamonds) in rhythm-based waves. Each run layers deep weapon mods, ship evolutions, and synergy nodes for near-endless build variety. **Simple to shoot, absurdly deep to upgrade.**

**Tech Baseline:**  
Vanilla HTML/CSS/JS (ES modules), single DPR-aware Canvas 2D, 60 FPS hard target, WCAG AA accessibility, mobile-safe (keyboard, gamepad, touch).

**Existing Documentation:**  
Phase 01 has delivered:

- `01-Game-Design-Document.md` — full game spec (8 sections)
- `02-Technical-Architecture.md` — system design (11 sections, code patterns)
- `03-Visual-Style-Guide.md` — rendering & colors (WCAG AA verified)
- `04-Audio-Strategy.md` — Web Audio API strategy
- `05-Input-Spec.md` — keyboard, gamepad, touch spec
- `Testing.md` — performance targets & QA matrix
- Root config: `package.json`, `vite.config.js`, `index.html`, `.eslintrc.json`, `.prettierrc.json`

### Key Constraints

- No frameworks (Vanilla JS only)
- Canvas 2D (DPR-aware scaling)
- 60 FPS hard floor (frame budget: 12ms render, 3ms update, 2ms audio)
- ≤ 50 ms input latency
- WCAG AA accessibility
- Mobile-first safe-areas, notches
- 3 input methods: Keyboard, Gamepad, Touch
- Web Audio (music loops, SFX)

### Research Scope

Validate and document decisions on:

#### 1. Game Loop Architecture

- RAF-based or setInterval for 60 FPS?
- requestAnimationFrame with delta-time handling
- Profiling strategy (FPS counter, frame budgets)

#### 2. Canvas Rendering Optimization

- Immediate-mode rendering vs. retained state
- Batching strategies (reduce draw calls per frame)
- Off-screen canvas for layers? (or single-canvas approach)
- Text rendering performance (HUD labels)

#### 3. Collision Detection

- AABB (axis-aligned bounding box) as primary broad-phase
- Circle or pixel-perfect for fine-grained?
- Spatial partitioning strategy (grid, quadtree, or simple?)
- Performance benchmarks for wave size (8–15 shapes)

#### 4. Entity Management

- Object pooling for bullets (thousands per run)
- Preallocated arrays vs. linked lists
- Entity lifecycle (spawn, update, draw, destroy)

#### 5. Input Handling

- Gamepad polling interval (every frame? every 10ms?)
- Deadzone implementation (0.15 radial tested?)
- Pointer vs. keyboard priority resolution
- Mobile touch aiming (aim-follow vs. drag-to-aim)

#### 6. Web Audio Setup

- Context resume on first user interaction (required on mobile)
- Music loop seamlessness (GaplessInfo vs. manual timing)
- SFX polyphonic limit (simultaneous sources cap?)
- Gain ramping smoothness (Exponential vs. linear)

#### 7. State Management

- Global game state (wave #, resources, upgrades)
- Per-run state persistence (Alloy accumulation between runs)
- localStorage for workshop upgrades
- Session state (paused, upgrade panel open, etc.)

#### 8. Performance Profiling

- FPS logging strategy (1 sec interval, p95 tracking)
- Memory monitoring (heap usage steady-state)
- Chrome DevTools Lighthouse baseline
- Mobile performance budget (Pixel 4a, iPhone SE)

### Deliverables (to Phase 03)

1. **`docs/RESEARCH_FINDINGS.md`**
   - 8 research sections (architecture, rendering, collision, etc.)
   - Decision matrix (option A vs. B vs. C per topic)
   - Performance benchmarks & estimates
   - Risks & trade-offs identified

2. **`docs/IMPLEMENTATION_ROADMAP.md`**
   - Phase 03 (MVP Scaffold) breakdown:
     - Sprint 1: Core game loop + Canvas setup
     - Sprint 2: Player ship + input handler
     - Sprint 3: Enemy spawning + collision
     - Sprint 4: Upgrade system (MVP)
     - Sprint 5: Audio + Polish
   - Milestones & acceptance criteria
   - Risk mitigation strategies

3. **`docs/API_CONTRACTS.md`** (optional but recommended)
   - GameState interface (public methods)
   - Entity interface (shape, update, draw, takeDamage)
   - InputHandler interface (getVector, firing, aux)
   - AudioManager interface (play, mute, setVolume)
   - Renderer interface (draw, scale, clear)

4. **Updated `Testing.md`** (if new research surfaces)
   - Profiling results & actual frame budgets
   - Device-specific findings
   - Revised FPS targets or budget allocation

5. **Decision Log** (`docs/DECISIONS.md`)
   - Why Canvas 2D (not WebGL)
   - Why RAF-based loop (not setInterval)
   - Entity pooling decision & benchmarks
   - Why this collision strategy over alternatives

### Research Limits & Allowlist

**Max Pages per Source:** 3 (skim-focused)  
**Max Depth:** 2 (don't follow deep rabbit holes)

**Allowlist Domains:**

- MDN Web Docs (canvas, web audio, gamepad, touch)
- developer.mozilla.org (performance APIs)
- caniuse.com (browser support)
- webkit.org (Safari/iOS specifics)
- W3C specs (HTML5, Web Audio)

**Deny Patterns:** No blog clutter, no outdated frameworks, no paywalls

### Key Questions to Answer

1. **Canvas Rendering:** What's the optimal batch size for shapes + bullets at wave 10+ (15+ active entities)?
2. **Collision:** For 12 shapes + 50 bullets per frame, AABB grid vs. simple array iteration—which wins on performance?
3. **Audio Context:** On iOS, what's the best pattern for resuming Web Audio context on first interaction?
4. **Input:** Gamepad polling every frame vs. event-driven—which is more responsive for 50ms input latency target?
5. **State:** localStorage limitations—can we store 100+ workshop upgrade states reliably?
6. **Mobile:** Will safe-area insets + DPR scaling handle iPhone notches + Android gesture areas cleanly?

### Expected PR

- **Title:** `research: implementation findings & roadmap`
- **Branch:** `feature/research-findings`
- **Status:** All research docs + roadmap merged to `main`, ready for Phase 03

### Completion Criteria

- All 8 research topics have decision matrices
- Roadmap is sprint-based (Phase 03 tasks mapped to sprints)
- API contracts are defined (GameState, Entity, Input, Audio, Renderer)
- Decision log explains all trade-offs
- Benchmarks provided (estimated frame budgets, memory usage)
- Phase 03 MVP scope is crystal clear
- Handoff ready for Project Scaffolder

---

## 📋 JSON PAYLOAD

```json
{
  "phase": "02",
  "agentTitle": "Phase 02: Research Curator",
  "objective": "Synthesize external research and create comprehensive implementation roadmap for GeoGala: Vector Offensive.",
  "context": {
    "gameTitle": "GeoGala: Vector Offensive",
    "conceptPitch": "Modern vertical arcade shooter (Galaga + Chicken Invaders) with geometric enemies, evolving triangle ship, deep weapon/upgrade systems. Simple to shoot, absurdly deep to upgrade.",
    "renderStack": "Canvas 2D",
    "inputTargets": "Keyboard, Pointer/Touch, Gamepad",
    "audioScope": "Web Audio (music + SFX)"
  },
  "limits": {
    "maxPages": 3,
    "maxDepth": 2,
    "allowlist": [
      "mdn.mozilla.org",
      "developer.mozilla.org",
      "caniuse.com",
      "webkit.org",
      "w3.org"
    ],
    "denypatterns": [
      "blog clutter",
      "outdated frameworks",
      "paywalls"
    ]
  },
  "deployTarget": null,
  "expectedPRTitle": "research: implementation findings & roadmap",
  "researchTopics": [
    "Game Loop Architecture",
    "Canvas Rendering Optimization",
    "Collision Detection Strategy",
    "Entity Management & Pooling",
    "Input Handling & Deadzone",
    "Web Audio Setup & Seamlessness",
    "State Management & Persistence",
    "Performance Profiling & Budgeting"
  ],
  "deliverables": [
    "docs/RESEARCH_FINDINGS.md",
    "docs/IMPLEMENTATION_ROADMAP.md",
    "docs/API_CONTRACTS.md (optional)",
    "docs/DECISIONS.md",
    "Updated docs/Testing.md (if needed)"
  ],
  "finishSignal": "STATUS: DONE"
}
```

---

**Phase 02 Ready.** Copy the entire content of this file or the JSON payload above to launch the Research Curator agent. ✨
