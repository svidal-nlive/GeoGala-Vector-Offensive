# Product Requirements Document (PRD)
**Geo Gala: Vector Offensive**

---

## 1. Executive Summary

**Geo Gala: Vector Offensive** is a modern arcade fixed-shooter that reimagines the *Chicken Invaders* formula through geometric abstraction and neon aesthetics. Players pilot a triangle fighter through waves of intelligent geometric enemies representing mathematical factions—Order, Chaos, Fractal, and Singularity—in a hypnotic bullet-ballet experience.

**Core Promise:** Deliver the joyful arcade pacing of classic wave shooters refined into a sleek, geometry-driven experience that is simple to play, endlessly replayable, and visually hypnotic across devices.

---

## 2. Goals & Success Metrics

### Primary Goals
1. **Arcade Purity:** Recreate the "one-more-wave" compulsion loop with clear progression and instant restart.
2. **Visual Distinction:** Establish a signature aesthetic (Geometry Wars meets Tron) that is instantly recognizable.
3. **Cross-Platform Excellence:** Deliver pixel-perfect mobile-first responsive design with seamless desktop scaling.
4. **Deep Mastery Curve:** Support casual play and hardcore scoring through modular upgrade systems.

### Success Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| **Session Length** | 8–12 minutes average | Analytics |
| **Return Rate (D1)** | >40% | Analytics |
| **60 FPS Maintenance** | 95%+ of frames | Performance monitoring |
| **Mobile Load Time** | <3s on 4G | Lighthouse |
| **Lighthouse Score** | 90+ Performance, 100 Accessibility | Automated testing |
| **Wave Completion Rate (W1-5)** | >80% | Telemetry |
| **Upgrade Engagement** | >60% players unlock 3+ weapon tiers | Telemetry |

---

## 3. Target Audience

### Primary Personas

**The Commuter (Mobile-First)**
- Age: 22–35
- Platform: Mobile (iOS/Android browsers)
- Session: 5–10 minutes during transit
- Motivation: Quick skill-based entertainment, visible progression
- Needs: Touch-optimized controls, instant resume, offline capability

**The Desktop Scorer (Hardcore)**
- Age: 25–45
- Platform: Desktop browsers (Chrome, Firefox, Edge)
- Session: 30–60 minutes
- Motivation: Leaderboard competition, mastery, optimal builds
- Needs: Keyboard precision, detailed stats, replay value

**The Casual Explorer**
- Age: 18–50
- Platform: Any
- Session: 10–20 minutes
- Motivation: Visual experience, low-pressure fun
- Needs: Forgiving difficulty curve, clear tutorials, aesthetic satisfaction

---

## 4. Scope & Features

### MVP (Phase 1)
- Single canvas rendering (60 FPS, DPR-aware)
- Triangle player ship with WASD/Arrow/Touch movement
- Basic projectile weapon with 3 power levels
- 5 wave types with simple formation patterns
- Score system with combo multiplier
- Weapon heat mechanic
- Pickup magnet system
- Pause/Resume functionality
- Mobile-responsive HUD

### Phase 2 (Polish)
- 4 geometric factions with unique behaviors
- 10 weapon cores with modular upgrades
- Synergy node system (passive bonuses)
- Missiles and screen-clearing nukes
- Boss waves (every 10 waves)
- Leaderboard integration
- Sound effects and adaptive music
- Tutorial overlay
- Settings panel (volume, graphics quality)

### Phase 3 (Release)
- Campaign mode (30 waves with narrative)
- Endless mode
- Challenge modes (speedrun, no-upgrade, etc.)
- Achievements/badges
- Replay recording
- Social sharing
- PWA offline support
- Localization (EN, ES, FR, DE, JP)

### Explicitly Out of Scope
- Multiplayer/co-op
- Procedural generation (waves are hand-designed)
- 3D rendering
- External dependencies (frameworks, physics engines)
- Monetization (free-to-play, premium, or ads) — deferred to post-launch

---

## 5. Platform Priorities

| Platform | Priority | Resolution | Input |
|----------|----------|------------|-------|
| **Mobile Browsers** | P0 | 360×640 → 414×896 | Touch |
| **Desktop Browsers** | P0 | 1280×720 → 1920×1080 | Keyboard |
| **Tablet** | P1 | 768×1024 → 1024×768 | Touch |
| **Gamepad** | P2 | — | Controller API |

**Browser Support:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- No IE11 support

---

## 6. User Flows

### First-Time Player
1. Land on page → Auto-play ambient visuals
2. Touch/Click "START" → Brief control tutorial overlay (5s)
3. Wave 1 begins → Simple triangle formation
4. Defeat wave → Collect power-ups → Visual feedback
5. Wave 2 → Introduce heat mechanic warning
6. Complete 5 waves → "Chapter Complete" screen with stats
7. Prompt to continue or return to menu

### Returning Player
1. Land on page → Last session stats visible
2. "CONTINUE" resumes at last wave checkpoint
3. "NEW GAME" starts fresh run
4. Settings accessible from pause menu

### Death Flow
1. Player health depletes → Slow-motion death animation
2. Final score + stats overlay
3. "RETRY" (instant restart) or "MENU" (return to start)
4. No ads, no forced delays

---

## 7. Monetization Strategy

**Current:** None (free web game)

**Post-Launch Options (TBD):**
- Cosmetic ship skins (purchasable)
- "Support the Dev" voluntary donation button
- Itch.io pay-what-you-want model

No pay-to-win mechanics. All gameplay content free.

---

## 8. Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Performance on low-end mobile** | High | Adaptive quality settings, 30 FPS fallback mode |
| **Touch controls feel imprecise** | High | Iterative playtesting, visual feedback (touch halo) |
| **Difficulty curve too steep** | Medium | Difficulty tiers (Easy/Normal/Hard), early wave tuning |
| **Visual fatigue (neon overload)** | Medium | Contrast tuning, optional "calm mode" palette |
| **Browser audio latency** | Low | Pre-load audio, Web Audio API optimization |

---

## 9. Dependencies & Constraints

### Technical Constraints
- Pure vanilla HTML/CSS/JS (ES modules)
- Single `<canvas>` element (2D context)
- No build-time dependencies (Vite for dev server only)
- Total bundle size <500 KB (uncompressed)

### Design Constraints
- Colorblind-safe palettes required
- Minimum touch target size: 44×44 CSS pixels
- All text must scale with viewport (no fixed pixel sizes)

### Timeline Constraints
- MVP target: 4 weeks
- Polish phase: 3 weeks
- Release phase: 2 weeks

---

## 10. Open Questions

1. **Leaderboard Backend:** Self-hosted vs. third-party service (e.g., Supabase, Firebase)?
2. **Scoring Formula:** Linear or exponential scaling for wave difficulty?
3. **Faction Lore:** How much narrative text to include (flavor vs. gameplay focus)?
4. **Tutorial Approach:** Overlay text or interactive embedded prompts?

---

## 11. Approval & Sign-Off

**Document Owner:** [Developer Name]  
**Stakeholders:** Solo developer (all roles)  
**Version:** 1.0  
**Last Updated:** 2025-11-01  

**Status:** ✅ Approved for development

---

## Appendix A: Competitive Analysis

| Game | Strength | Weakness | Lesson for Geo Gala |
|------|----------|----------|---------------------|
| **Chicken Invaders** | Humor, upgrade loop | Dated visuals | Modernize UI, keep pacing |
| **Galaga** | Iconic simplicity | Limited progression | Add meta-progression |
| **Geometry Wars** | Visual polish | Chaotic for newcomers | Balance clarity with intensity |
| **Space Invaders** | Universal recognition | Repetitive | Introduce variety earlier |

---

## Appendix B: Feature Prioritization Matrix

| Feature | Impact | Effort | Priority |
|---------|--------|--------|----------|
| Core shooting loop | 10 | 5 | P0 |
| Weapon heat | 8 | 3 | P0 |
| Touch controls | 10 | 4 | P0 |
| Power-up system | 9 | 4 | P0 |
| Leaderboard | 7 | 8 | P1 |
| Sound effects | 6 | 3 | P1 |
| Boss waves | 8 | 7 | P1 |
| Campaign mode | 5 | 9 | P2 |
| Achievements | 4 | 5 | P2 |
