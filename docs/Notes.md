# Research & Notes
**Geo Gala: Vector Offensive**

---

## Purpose
This document is a scratchpad for research findings, design explorations, and technical notes during development. Items here may migrate to formal documentation once validated.

---

## Rendering Techniques

### Canvas vs WebGL Performance
**Question:** Should we consider WebGL for particle effects?

**Research:**
- Canvas 2D sufficient for <500 particles at 60 FPS (tested on Pixel 5)
- WebGL overhead not justified for 2D geometric shapes
- Decision: Stick with Canvas 2D

**References:**
- [MDN: Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- Benchmark: 300 triangles @ 60 FPS on mobile

---

## Audio Synthesis

### Procedural SFX Generation
**Idea:** Generate SFX at runtime using Web Audio instead of loading files

**Pros:**
- Zero audio file size
- Infinite variations

**Cons:**
- Complex implementation
- Hard to achieve polished sound

**Decision:** Deferred to Phase 3 (use pre-made SFX for launch)

**Tools to Explore:**
- Bfxr for prototyping
- ZzFX for tiny runtime synth

---

## Enemy AI Patterns

### Swarm Intelligence
**Question:** Should enemies coordinate beyond formations?

**Ideas:**
- Flocking behavior (boids algorithm)
- Emergent pincer maneuvers
- Difficulty scaling: solo → duo → swarm tactics

**Complexity:** High (200+ lines)
**Priority:** P2 (post-launch)

**References:**
- [Red Blob Games: Boids](https://www.redblobgames.com/blog/2023/11/11/boids/)

---

## Performance Optimizations

### OffscreenCanvas for Pre-rendering
**Concept:** Pre-render static background grid once, blit to main canvas

**Implementation:**
```javascript
const offscreen = new OffscreenCanvas(800, 600);
const ctx = offscreen.getContext('2d');
// Draw grid once
ctx.strokeStyle = '#151B2E';
for (let x = 0; x < 800; x += 50) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, 600);
  ctx.stroke();
}

// In render loop
mainCtx.drawImage(offscreen, 0, 0);
```

**Tested:** 5ms → 0.5ms per frame (10× improvement)
**Status:** Implement in Phase 1

---

## Input Latency Reduction

### Predicted Movement
**Problem:** 16ms latency feels sluggish on 60 FPS

**Solution:** Extrapolate player position 1 frame ahead
```javascript
const predictedX = player.x + player.vx * (dt / 1000);
const predictedY = player.y + player.vy * (dt / 1000);
// Use predicted position for rendering only
```

**Trade-off:** Slightly jerky on input change
**Status:** Test in alpha builds

---

## Faction Lore Expansion

### Order Faction Philosophy
**Theme:** Hierarchy and structural integrity

**Visual Motif:** Perfect equilateral triangles, synchronized movements

**Potential Dialogue (Boss):**
> "Chaos is inefficiency. Perfection demands unity."

### Chaos Faction Philosophy
**Theme:** Entropy and creative destruction

**Visual Motif:** Asymmetric polygons, erratic tumbling

**Potential Dialogue (Boss):**
> "Order breeds stagnation. Embrace the unpredictable."

**Status:** Phase 3 (narrative mode)

---

## Localization Strategy

### Language Priority
1. English (EN) — Primary
2. Spanish (ES) — 20% of audience
3. French (FR) — EU market
4. German (DE) — EU market
5. Japanese (JP) — Arcade culture appeal

### Translation Scope
**Phase 1 (MVP):**
- UI text only (buttons, HUD labels)
- ~50 strings

**Phase 2:**
- Faction names, power-up descriptions
- ~200 strings

**Phase 3:**
- Campaign dialogue
- ~1000 strings

**Tool:** i18next library (deferred to Phase 2)

---

## Accessibility Research

### Screen Reader Support
**Challenge:** Game is visual, real-time

**Potential Solution:**
- Text-based mode (auto-play with arrow key dodge prompts)
- Audio cues for enemy positions
- Victory achievable via timing, not precision

**Status:** Exploratory (Phase 3)

---

## Monetization Experiments

### Ethical Monetization Options
1. **Pay-what-you-want** (Itch.io model)
2. **Cosmetic DLC** (ship skins, particle colors)
3. **Tip Jar** (Ko-fi integration)
4. **Premium Version** (campaign + endless mode)

**Non-Options (Hard No):**
- Pay-to-win mechanics
- Energy/timer systems
- Loot boxes

**Status:** Post-launch decision based on reception

---

## Mobile Optimization

### Touch Joystick Sensitivity
**Current:** Linear mapping (1:1)

**Alternative:** Quadratic response curve (gentle center, fast edges)
```javascript
const magnitude = Math.sqrt(dx * dx + dy * dy);
const adjustedMag = Math.pow(magnitude, 1.5); // Quadratic
```

**Test Results:** TBD (alpha playtesters)

---

## Browser Quirks

### Safari Audio Latency (iOS <14)
**Issue:** 200ms delay between input and SFX

**Workaround:**
- Unlock audio on first user interaction
- Pre-load all buffers in suspended state

**Code:**
```javascript
document.addEventListener('touchstart', () => {
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}, { once: true });
```

**Status:** Implemented

---

## Wave Design Patterns

### Difficulty Curve Math
**Formula:** Enemy HP = base × (1 + 0.15 × waveNumber)

**Example:**
- Wave 1: 1 HP
- Wave 10: 2.5 HP
- Wave 20: 4 HP
- Wave 30: 5.5 HP

**Playtest Target:** 50% completion rate at Wave 10

**Status:** In GDD, needs validation

---

## Future Tech Exploration

### WebAssembly for Collision Detection
**Idea:** Rewrite collision system in Rust/AssemblyScript

**Estimated Speedup:** 2-3× (based on industry benchmarks)

**Complexity:** High (requires tooling setup)

**Priority:** P3 (only if hitting perf wall)

---

## Community Features (Phase 3)

### Replay Sharing
**Concept:** Record input stream → share as URL

**Format:**
```json
{
  "version": "1.0.0",
  "seed": 12345,
  "inputs": [
    { "t": 0, "keys": ["KeyW", "Space"] },
    { "t": 16, "keys": ["KeyD"] },
    ...
  ]
}
```

**Encode:** Base64 → URL parameter

**Use Case:** Share high-score runs, tutorials

**Status:** Deferred to Phase 3

---

## Unresolved Questions

1. **Leaderboard Backend:** Supabase vs Firebase vs custom?
2. **Music Composer:** Commission or royalty-free?
3. **Beta Tester Recruitment:** Itch.io? Discord server?
4. **Difficulty Names:** Easy/Normal/Hard or Creative faction names?
5. **Ship Customization:** Skins only or stat modifiers?

---

## Changelog

| Date | Topic | Status |
|------|-------|--------|
| 2025-11-01 | Canvas vs WebGL | Decided (Canvas 2D) |
| 2025-11-01 | OffscreenCanvas | Implement Phase 1 |
| 2025-11-01 | Procedural SFX | Deferred Phase 3 |

---

**Version:** 1.0  
**Last Updated:** 2025-11-01  
**Status:** Living Document
