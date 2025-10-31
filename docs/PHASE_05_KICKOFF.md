# 🎮 PHASE 05: QA & Performance Tuner — KICKOFF

**Date:** October 31, 2025  
**Agent:** QA & Performance Tuner  
**Objective:** Validate MVP gameplay loop, profile frame budget compliance, optimize for 60 FPS across desktop & mobile, ensure cross-platform stability.

---

## 1. CONTEXT

### 1.1 Game Summary

**Title:** GeoGala: Vector Offensive  
**Genre:** Arcade Space Shooter  
**Core Loop:**

- Player dodges/destroys wave-spawned enemies (5 waves total)
- Collect loot (scrap, synergy) for progression
- Aim with pointer/joystick, fire with space/touch
- Survive all waves → Victory screen

**MVP Status:** ✅ COMPLETE (Sprints 1–5)

### 1.2 Tech Baseline

| Component | Spec |
|-----------|------|
| **Build Tool** | Vite v7.1.12 + Terser minification |
| **Language** | TypeScript + ESLint v9 (0 errors, 12 warnings) |
| **Rendering** | Canvas 2D, DPR-aware (800×600 logical) |
| **Entity Pooling** | 65 pre-allocated objects (1 player, 15 enemies, 50 bullets) |
| **Audio** | Web Audio API (SFX pool of 6, music looping, gain ducking) |
| **Input** | Keyboard, Pointer, Touch (virtual joystick), Gamepad |
| **UI** | Glassmorphic (blur, gradients, animations) |
| **Bundle** | 32.70 KB (8.86 KB gzipped) — 83.6% under 200 KB limit |

### 1.3 MVP Features Delivered

- ✅ **Sprint 1:** Wave system (5 waves, 4 factions), loot drops, damage calc, HUD
- ✅ **Sprint 2:** Enemy faction shapes, player visuals, particle effects, wave transitions
- ✅ **Sprint 3:** Collision detection, entity lifecycle, game over state
- ✅ **Sprint 4:** Audio integration (SFX pool, music, ducking), input wiring
- ✅ **Sprint 5:** Mobile touch controls (virtual joystick + fire button)

---

## 2. PERFORMANCE BUDGET

### 2.1 Frame Budget (16.67 ms per frame @ 60 FPS)

```
Total: 16.67 ms per frame (60 FPS target)

┌─────────────────────────────────────┐
│ Render (Canvas)      │ 12 ms (72%)  │
│ Update (Logic)       │  3 ms (18%)  │
│ Audio (Gain/SFX)     │  2 ms (12%)  │
│ GC / Reserve Buffer  │ 1.67 ms      │
└─────────────────────────────────────┘
```

### 2.2 Performance Targets

| Metric | Target | Acceptable | Failure |
|--------|--------|-----------|---------|
| **FPS** | 60 FPS (const) | 55+ FPS (98% of frames) | < 48 FPS persistent |
| **Avg Frame Time** | 16.67 ms | ≤ 18 ms | > 20 ms |
| **P95 Frame Time** | 16.67 ms | ≤ 20 ms | > 33 ms |
| **Input Latency** | ≤ 33 ms | ≤ 50 ms | > 100 ms |
| **Audio Latency** | ≤ 20 ms | ≤ 50 ms | > 100 ms |

### 2.3 Subsystem Budgets

- **Collision checks:** < 3 ms per frame (spatial grid query)
- **Canvas rendering:** < 12 ms per frame (shape draw + HUD)
- **Audio gain updates:** < 2 ms per frame (exponential ramp scheduling)
- **Entity pooling:** 0 GC spikes during normal gameplay

---

## 3. QA SCOPE

### 3.1 Full Playthrough Validation

**Objective:** Complete all 5 waves without crashes or major jank.

**Test Case 1: Wave Progression**
- [ ] Start game → Wave 1 spawns (3 Triangle enemies)
- [ ] Destroy all 3 Triangles
- [ ] Wave 1 complete → Transition fade
- [ ] Wave 2 spawns (3 Squares + 2 Triangles)
- [ ] Continue waves 3–5 to completion
- [ ] Victory screen displays final score + best score
- [ ] Press Space to retry → Game resets cleanly

**Test Case 2: Enemy Behavior**
- [ ] Triangle enemies: Linear downward movement (red, equilateral shape)
- [ ] Square enemies: Sinusoidal left-right movement (red, square shape)
- [ ] Hexagon enemies: Spiral movement pattern (red, hexagon shape)
- [ ] Diamond enemies: Erratic/random movement (red, diamond shape)
- [ ] All enemies fire projectiles downward
- [ ] Enemy death triggers shrink + fade animation
- [ ] Loot spawns on enemy death (scrap + synergy)

**Test Case 3: Player Mechanics**
- [ ] Player movement: Full-screen Chicken Invaders style (inertia-based)
- [ ] Aiming: Follows input direction (keyboard/pointer/joystick)
- [ ] Firing: Bullets spawn at player position, travel at 300 px/s
- [ ] Health system: Decreases on enemy hit, displays on HUD bar
- [ ] Shield visual: Shows when health > 50%
- [ ] Game over: Triggered when player health ≤ 0

**Test Case 4: Scoring & Resources**
- [ ] Enemy kill: +100 score (× multiplier)
- [ ] Multiplier: Increases 0.1× per consecutive kill, resets after 2s idle
- [ ] Loot collect: Auto-collect scrap/synergy within pickup radius
- [ ] HUD: Score, multiplier, resources display update in real-time

### 3.2 Frame Budget Profiling

**Objective:** Measure frame time distribution, identify bottlenecks.

**Tools:** Chrome DevTools Performance tab (or equivalent)

**Test Case 1: Baseline FPS**
- [ ] Idle (no entities): 60 FPS stable, p95 < 18 ms
- [ ] 5 entities on-screen: 60 FPS, p95 < 18 ms
- [ ] 15 entities on-screen: 60 FPS, p95 ≤ 20 ms (acceptable)
- [ ] 25 entities on-screen (stress): 60 FPS minimum, p95 ≤ 25 ms (acceptable)

**Test Case 2: Subsystem Profiling**
- [ ] Collision checks: < 3 ms (measure with 15+ entities)
- [ ] Canvas rendering: < 12 ms (measure draw time)
- [ ] Audio gain updates: < 2 ms (measure during music ducking)
- [ ] Entity update: < 3 ms (movement, AI, state changes)

**Test Case 3: GC Stability**
- [ ] Run full game (all 5 waves): No major GC pauses (> 16.67 ms)
- [ ] Entity pool: Verify no new allocations during gameplay
- [ ] Audio pool: Verify SFX sources reused (no buffer leaks)

**Measurement Method:**
```javascript
// In-game debug HUD (press 'D'):
FPS: <current>
P95: <p95 frame time in ms>
Entities: <active count>
Wave: <progress>
```

### 3.3 Mobile Performance

**Target Devices:**
- iPhone 15 (iOS 17+, 3x DPR)
- iPhone SE (iOS 17+, 2x DPR, lower-end)
- Samsung S24 (Android 14+, 2.5x DPR)
- Google Pixel 8 (Android 14+, 2x DPR)
- iPad Pro 12.9" (iPadOS 17+, 2x DPR)

**Test Case 1: Touch Controls**
- [ ] Virtual joystick (left half): Drag to move player
- [ ] Fire button (right half): Tap to fire bullets
- [ ] Multi-touch: Joystick + fire button simultaneously
- [ ] Visual feedback: Joystick/button glow on touch
- [ ] Responsiveness: No lag, smooth input tracking

**Test Case 2: Screen Adaptation**
- [ ] Safe-area handling: No HUD overlap with notch/cutout
- [ ] DPR scaling: Canvas crisp at all device DPRs
- [ ] Orientation: Landscape mode optimal (portrait fallback acceptable)

**Test Case 3: FPS on Mobile**
- [ ] iPhone 15: 60 FPS stable (high-end)
- [ ] iPhone SE: 55+ FPS (lower-end, acceptable)
- [ ] Samsung S24: 60 FPS stable
- [ ] Google Pixel 8: 60 FPS stable
- [ ] iPad Pro: 60 FPS stable

### 3.4 Browser Compatibility

**Target Browsers:**
- Chrome 120+
- Firefox 121+
- Safari 17+ (desktop)
- Safari 17+ (iOS)
- Edge 120+

**Test Case 1: Rendering**
- [ ] Canvas 2D rendering consistent across all browsers
- [ ] Glassmorphic UI (blur filters, gradients) render correctly
- [ ] Text rendering (HUD) readable on all browsers

**Test Case 2: Audio**
- [ ] Web Audio API working on all browsers
- [ ] Audio context resume on first user interaction
- [ ] SFX playback (fire, hit, collect) audible and timed
- [ ] Music loops seamlessly
- [ ] Gain ducking smooth on all browsers

**Test Case 3: Input**
- [ ] Keyboard input (WASD, arrows, space) functional
- [ ] Pointer/mouse input working
- [ ] Touch input (mobile) functional
- [ ] Gamepad input (if connected) functional

### 3.5 Accessibility & UX

**Test Case 1: WCAG AA Contrast**
- [ ] HUD text (white #ffffff on glassmorphic): 4.5:1 contrast ✓
- [ ] UI text (muted blue #b6c3ff on bg): ≥ 4.5:1 contrast
- [ ] Health bar (green→yellow→red): Color + shape differentiation

**Test Case 2: Debug HUD**
- [ ] Press 'D': Toggle debug mode
- [ ] Display: FPS, P95 frame time, entity count, wave progress
- [ ] Positioning: Bottom-left, non-intrusive

**Test Case 3: Reduced Motion**
- [ ] Check: CSS `prefers-reduced-motion: reduce` supported
- [ ] Animations: Particle effects, transitions still functional but simplified

**Test Case 4: Input Accessibility**
- [ ] Keyboard: WASD + Space fully playable (no mouse required)
- [ ] Gamepad: All controls accessible (if available)
- [ ] Touch: Mobile controls clear and large enough to tap (40px+ minimum)

---

## 4. OPTIMIZATION STRATEGY

### 4.1 Expected Bottlenecks

1. **Canvas rendering:** Large number of draw calls with blur filters
2. **Collision checks:** Broad-phase grid query could exceed 3ms
3. **Audio gain updates:** Exponential ramp scheduling (unlikely but possible)
4. **GC spikes:** Entity allocation during wave transitions

### 4.2 Optimization Techniques (if needed)

**Render Optimization:**
- Batch canvas state changes (reduce ctx.save/restore calls)
- Cache text metrics (HUD measurements)
- Pre-render static gradients to off-screen canvas
- Reduce blur filter complexity (use `will-change` CSS hint)

**Collision Optimization:**
- Verify spatial grid cell size is optimal (~50px)
- Profile broad-phase query time (log with timestamps)
- Consider quadtree if grid proves insufficient

**Audio Optimization:**
- Verify SFX pool size (currently 6) is sufficient
- Profile gain update time (exponential ramp scheduling)
- Cache buffer source gain nodes where possible

**GC Optimization:**
- Verify all pools are pre-allocated and reused
- Check for array allocations in hot paths (update loop)
- Use object reuse instead of new allocations

### 4.3 Measurement & Profiling

**Chrome DevTools Performance Tab:**
```
1. Open DevTools (F12)
2. Go to Performance tab
3. Click record
4. Play 1–2 waves of game
5. Stop recording
6. Analyze frame time chart:
   - Look for spikes > 20ms (indicates bottleneck)
   - Identify subsystem (rendering, scripting, painting)
   - Screenshot/note for optimization
```

**Real-time In-Game Profiling:**
```
1. Press 'D' to enable debug HUD
2. Monitor FPS (should be 60)
3. Monitor P95 (should be ≤ 20 ms)
4. If P95 > 20ms, identify frame causing spike
5. Use browser devtools to profile that specific frame
```

---

## 5. CONSTRAINTS & RULES

- ✅ **No new features** — QA & optimization only
- ✅ **Bundle size:** Must remain < 200 KB (currently 8.86 KB gzip, ample budget)
- ✅ **60 FPS non-negotiable** — Acceptable lower bound is 55 FPS (98% of time)
- ✅ **No breaking changes** — Game loop architecture preserved
- ✅ **All commits preserved** — Use new branch `qa/perf` for optimization commits

---

## 6. DELIVERABLES

### 6.1 Testing Documentation

**File:** `docs/Testing.md` — Update with profiling results:
- FPS histogram (min, avg, max, p95)
- Frame time breakdown by subsystem (render, update, audio, GC)
- Browser/device test matrix (✓ pass, ✗ fail, ~ partial)
- Accessibility audit checklist

### 6.2 Optimization Commits (if needed)

**Branch:** `qa/perf`

**Commit format:**
```
perf(subsystem): brief optimization

- Detailed change
- Impact: <metric before> → <metric after>
- Measured with: <tool used>
```

**Example:**
```
perf(render): cache HUD text metrics

- Pre-measure "Score:" text width at startup
- Avoid measureText() calls in render loop
- Impact: P95 16.8ms → 16.4ms (0.4ms improvement)
- Measured with: Chrome DevTools Performance tab
```

### 6.3 Pull Request

**Title:** `perf: meet FPS & Lighthouse targets`

**Description:**
```
## Performance Profiling Results

### FPS Metrics
- Baseline (idle): 60 FPS, P95: 16.2ms ✓
- Heavy load (20 entities): 60 FPS, P95: 19.8ms ✓
- Mobile (iPhone SE): 58 FPS, P95: 20.1ms ✓

### Optimizations Applied
- [List any perf commits here]

### Browser/Device Testing
| Device | FPS | P95 | Status |
|--------|-----|-----|--------|
| Chrome 120 | 60 | 16.3ms | ✓ |
| Firefox 121 | 60 | 17.1ms | ✓ |
| Safari 17 | 60 | 16.8ms | ✓ |
| iPhone 15 | 60 | 16.5ms | ✓ |
| iPhone SE | 58 | 20.1ms | ✓ |
| Samsung S24 | 60 | 16.7ms | ✓ |

### Accessibility Audit
- WCAG AA contrast: ✓
- Keyboard playable: ✓
- Touch controls: ✓
- Reduced motion: ✓
```

### 6.4 Checklist File

**File:** `docs/checklists/05-qa-perf-checklist.md`

Track progress on all QA tasks, subsystem profiling, and optimization commits.

---

## 7. TIMELINE

| Step | Estimate | Status |
|------|----------|--------|
| Full playthrough testing | 30 min | Not started |
| Frame budget profiling | 1 hour | Not started |
| Mobile testing | 45 min | Not started |
| Browser compatibility | 30 min | Not started |
| Accessibility audit | 15 min | Not started |
| Optimization (if needed) | 1–2 hours | Conditional |
| Documentation & PR | 30 min | Not started |
| **Total** | **4–5.5 hours** | |

---

## 8. SUCCESS CRITERIA

### ✅ PASS (MVP Ready)
- FPS: 60 FPS stable on desktop, 55+ FPS on mobile
- P95 frame time: ≤ 20 ms
- All 5 waves complete without crashes
- Audio, touch, keyboard all functional
- WCAG AA contrast verified
- Bundle: < 200 KB gzipped (currently 8.86 KB ✓)

### ⚠️ CONDITIONAL (Acceptable with caveats)
- P95: 20–25 ms (slight budget overrun, optimization recommended)
- Mobile FPS: 50–55 FPS on lower-end devices (acceptable if optimized)

### ❌ FAIL (MVP Not Ready)
- FPS: < 48 FPS persistent
- Crashes during full playthrough
- Input latency > 100 ms
- Audio not working on any target browser

---

## 9. NEXT STEPS

1. **Setup:** Create `docs/checklists/05-qa-perf-checklist.md`
2. **Test:** Execute all test cases from Section 3
3. **Profile:** Use Chrome DevTools to measure frame budget
4. **Optimize:** Apply fixes if P95 > 20 ms
5. **Document:** Update `docs/Testing.md` with results
6. **PR:** Open `perf: meet FPS & Lighthouse targets`
7. **Finish:** Record `STATUS: DONE` in checklist

---

**Status:** 🟡 KICKOFF COMPLETE — Ready for QA Phase

**Agent Handoff:** QA & Performance Tuner is ready to begin testing and profiling.

