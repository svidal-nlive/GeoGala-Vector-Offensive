# Testing & QA Guide
**Geo Gala: Vector Offensive**

---

## 1. Testing Strategy

**Approach:** Manual QA + automated checks + real-device testing

**Test Pyramid:**
- 70% Manual (gameplay feel, balance, UX)
- 20% Integration (system interactions)
- 10% Unit (utility functions, math)

---

## 2. Performance Budgets

### 2.1 Frame Rate Targets

| Device Tier | Target FPS | Min FPS | Max Frame Time |
|-------------|------------|---------|----------------|
| **Desktop** | 60 | 58 | 17ms |
| **Mobile High** | 60 | 55 | 18ms |
| **Mobile Low** | 30 | 28 | 35ms |

**Measurement:**
```javascript
// In-game performance monitor
const fpsSamples = [];
function measureFPS() {
  const fps = 1000 / deltaTime;
  fpsSamples.push(fps);
  if (fpsSamples.length > 60) fpsSamples.shift();
  
  const avgFPS = fpsSamples.reduce((a, b) => a + b) / fpsSamples.length;
  if (avgFPS < 55) console.warn(`Low FPS: ${avgFPS.toFixed(1)}`);
}
```

**Test Scenarios:**
- 50 enemies + 100 projectiles + 200 particles
- Boss fight (wave 10, 20, 30)
- Nuke explosion (full screen effects)

### 2.2 Load Time Budgets

| Metric | Target | Max |
|--------|--------|-----|
| **First Contentful Paint (FCP)** | <1s | <1.5s |
| **Largest Contentful Paint (LCP)** | <2s | <3s |
| **Time to Interactive (TTI)** | <3s | <5s |
| **Total Bundle Size** | <200 KB | <300 KB |

**Testing Tool:** Lighthouse (Chrome DevTools)

**Test Conditions:**
- Network: Fast 3G throttling
- CPU: 4× slowdown
- Device: Mobile emulation (Moto G4)

### 2.3 Lighthouse Score Targets

| Category | Target | Minimum |
|----------|--------|---------|
| **Performance** | 95+ | 90 |
| **Accessibility** | 100 | 95 |
| **Best Practices** | 100 | 95 |
| **SEO** | 100 | 90 |

---

## 3. QA Test Matrix

### 3.1 Functional Tests

#### Core Gameplay
| Test ID | Scenario | Expected Result | Priority |
|---------|----------|-----------------|----------|
| FN-001 | Player movement (WASD) | Ship moves smoothly in all directions | P0 |
| FN-002 | Player movement (Touch) | Virtual joystick controls ship | P0 |
| FN-003 | Player firing (Space) | Projectiles spawn and move forward | P0 |
| FN-004 | Player collision (enemy) | HP decreases, i-frames activate | P0 |
| FN-005 | Enemy spawn (wave 1) | 8 scouts appear in wedge formation | P0 |
| FN-006 | Enemy destruction | Enemy HP → 0 triggers explosion | P0 |
| FN-007 | Power-up drop | Destroyed enemy spawns pickup (40% chance) | P0 |
| FN-008 | Power-up collect | Player touches pickup → effect applied | P0 |
| FN-009 | Wave clear | All enemies dead → clear screen appears | P0 |
| FN-010 | Heat mechanic | Firing increases heat bar | P0 |
| FN-011 | Overheat | Heat = 100% → weapon disabled 2s | P0 |
| FN-012 | Missile launch | Shift → missile spawns, homes on enemy | P1 |
| FN-013 | Nuke activation | Ctrl → screen-clear explosion | P1 |
| FN-014 | Player death | HP = 0 → game over screen | P0 |
| FN-015 | Pause/Resume | Esc → freeze game, Esc → resume | P0 |

#### UI/UX
| Test ID | Scenario | Expected Result | Priority |
|---------|----------|-----------------|----------|
| UI-001 | Main menu display | Title, buttons visible, no overlap | P0 |
| UI-002 | Start button click | Transition to gameplay | P0 |
| UI-003 | HUD display | Score, HP, heat, power visible | P0 |
| UI-004 | Score update | Enemy kill → score increments immediately | P0 |
| UI-005 | HP indicator | Visual matches actual HP value | P0 |
| UI-006 | Heat bar animation | Smooth fill/drain, color changes | P1 |
| UI-007 | Wave clear overlay | Displays score breakdown, auto-dismiss | P0 |
| UI-008 | Game over screen | Final score, retry/menu buttons | P0 |
| UI-009 | Settings panel | Volume sliders functional | P1 |
| UI-010 | Mobile touch targets | Buttons ≥44px, easy to tap | P0 |

### 3.2 Cross-Platform Tests

#### Desktop Browsers
| Browser | Version | OS | Status | Notes |
|---------|---------|-----|--------|-------|
| Chrome | 90+ | Windows | ⬜ Not Tested | Primary target |
| Chrome | 90+ | macOS | ⬜ Not Tested | |
| Firefox | 88+ | Windows | ⬜ Not Tested | |
| Firefox | 88+ | macOS | ⬜ Not Tested | |
| Edge | 90+ | Windows | ⬜ Not Tested | |
| Safari | 14+ | macOS | ⬜ Not Tested | WebKit quirks |

#### Mobile Browsers
| Browser | Device | OS | Status | Notes |
|---------|--------|-----|--------|-------|
| Chrome | Pixel 5 | Android 11 | ⬜ Not Tested | |
| Chrome | Galaxy S21 | Android 12 | ⬜ Not Tested | |
| Safari | iPhone 12 | iOS 14 | ⬜ Not Tested | Touch controls critical |
| Safari | iPhone SE | iOS 15 | ⬜ Not Tested | Low-end test |
| Chrome | OnePlus 7 | Android 10 | ⬜ Not Tested | |

### 3.3 Input Method Tests

| Input | Test | Expected | Priority |
|-------|------|----------|----------|
| **Keyboard** | WASD movement | Smooth 8-directional | P0 |
| **Keyboard** | Arrow keys movement | Same as WASD | P0 |
| **Keyboard** | Space auto-fire | Continuous shooting | P0 |
| **Keyboard** | Shift missile | Single missile fired | P1 |
| **Touch** | Virtual joystick | Proportional movement | P0 |
| **Touch** | Auto-fire | Fires without input | P0 |
| **Touch** | Button taps | Responsive, no delay | P0 |
| **Gamepad** | Left stick movement | Analog movement | P2 |
| **Gamepad** | RT firing | Auto-fire while held | P2 |

### 3.4 Responsive Design Tests

| Viewport | Resolution | Orientation | Expected Layout |
|----------|------------|-------------|-----------------|
| Mobile S | 360×640 | Portrait | Compact HUD, large touch zones |
| Mobile M | 375×667 | Portrait | Same as Mobile S |
| Mobile L | 414×896 | Portrait | Same, more vertical space |
| Tablet | 768×1024 | Portrait | Larger HUD text, same layout |
| Tablet | 1024×768 | Landscape | Desktop layout preview |
| Desktop S | 1280×720 | Landscape | Full HUD, keyboard controls |
| Desktop M | 1920×1080 | Landscape | Same, scaled up |
| Desktop L | 2560×1440 | Landscape | Same, max quality |

---

## 4. Accessibility Tests

### 4.1 WCAG Compliance

| Test ID | Criterion | Requirement | Status |
|---------|-----------|-------------|--------|
| A11Y-001 | Color Contrast | 4.5:1 minimum (text) | ⬜ |
| A11Y-002 | Color Contrast | 3:1 minimum (UI elements) | ⬜ |
| A11Y-003 | Touch Targets | ≥44×44 CSS pixels | ⬜ |
| A11Y-004 | Keyboard Navigation | All actions accessible | ⬜ |
| A11Y-005 | Focus Indicators | Visible on all interactive elements | ⬜ |
| A11Y-006 | Text Scaling | Readable at 200% zoom | ⬜ |
| A11Y-007 | Reduced Motion | Disable particles/shake option | ⬜ |
| A11Y-008 | Screen Reader | Meaningful labels on buttons | ⬜ |

### 4.2 Colorblind Testing

**Simulation Tools:**
- Chrome DevTools (Rendering > Emulate vision deficiencies)
- Colorblind Web Page Filter

**Test Cases:**
- [ ] Player ship visible against all backgrounds
- [ ] Faction colors distinguishable by shape
- [ ] UI warnings (heat, low HP) clear without color
- [ ] Pickups identifiable by icon, not just color

---

## 5. Balance Testing

### 5.1 Difficulty Curve Validation

**Playtest Protocol:**
- 10 first-time players
- No instructions beyond basic controls
- Record wave reached on first attempt

**Target Distribution:**
| Wave Reached | % of Players |
|--------------|--------------|
| Wave 1-3 | <10% |
| Wave 4-7 | 30-40% |
| Wave 8-12 | 30-40% |
| Wave 13+ | 10-20% |

**Adjustments if:**
- >50% fail before wave 5 → Reduce enemy HP
- >50% reach wave 10+ → Increase difficulty scaling

### 5.2 Weapon Balance Tests

**Metrics:**
- Time to clear wave 5 with each weapon core
- Heat buildup rate during sustained fire
- Effective range (projectile hit rate)

**Target:**
- All cores clear wave 5 within 60-90s
- No single core >25% faster than average

---

## 6. Audio Tests

| Test | Expected | Status |
|------|----------|--------|
| Music loops seamlessly | No gap/click between loops | ⬜ |
| SFX volume consistent | All sounds ~equal loudness | ⬜ |
| No audio clipping | Max simultaneous sounds = 32 | ⬜ |
| Music/SFX balance | Music doesn't overpower SFX | ⬜ |
| Mute button works | Instant silence | ⬜ |
| Volume sliders | Smooth adjustment | ⬜ |
| Audio latency | <100ms input → SFX | ⬜ |

---

## 7. Edge Case Tests

| Test | Scenario | Expected |
|------|----------|----------|
| EC-001 | 0 HP + pickup health | HP restored before death | P0 |
| EC-002 | Overheat during cooldown | No double penalty | P1 |
| EC-003 | Missile fired with 0 ammo | Button disabled/no action | P1 |
| EC-004 | Pause during death animation | Animation completes, then pause | P1 |
| EC-005 | Rapid tab switching (desktop) | Game auto-pauses | P1 |
| EC-006 | Screen rotation (mobile) | Layout adjusts without crash | P0 |
| EC-007 | Disconnect during gameplay (offline PWA) | Game continues unaffected | P2 |
| EC-008 | LocalStorage full | Graceful degradation (no save) | P2 |

---

## 8. Regression Tests

**After Each Major Change:**
- [ ] Run full FN test suite
- [ ] Check Lighthouse score
- [ ] Test on 3 devices (desktop, mobile high, mobile low)
- [ ] Verify no console errors

**Automated Checks (Pre-Commit):**
```json
// package.json
{
  "scripts": {
    "test": "vitest run",
    "lint": "eslint src/",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 9. User Acceptance Testing (UAT)

**Criteria for MVP Release:**
- [ ] All P0 tests passing
- [ ] Lighthouse Performance ≥90
- [ ] 60 FPS on iPhone 12 / Pixel 5
- [ ] Zero critical bugs
- [ ] <5 minor bugs
- [ ] Positive feedback from 8/10 playtesters

**Feedback Collection:**
- Post-game survey (embedded or external form)
- Metrics: Fun rating (1-10), Difficulty (too easy/just right/too hard), "Would play again?"

---

## 10. Bug Reporting Template

```markdown
### Bug Report

**ID:** BUG-XXX  
**Severity:** Critical / Major / Minor / Trivial  
**Priority:** P0 / P1 / P2  

**Environment:**
- Browser: Chrome 98
- OS: Windows 11
- Device: Desktop

**Steps to Reproduce:**
1. Start game
2. Reach wave 3
3. Press Shift to fire missile
4. [Missile doesn't spawn]

**Expected:** Missile launches and homes on enemy  
**Actual:** Nothing happens, cooldown still triggers  

**Frequency:** Always / Often / Sometimes / Rare  

**Screenshot/Video:** [Link]  
**Console Errors:** [Paste logs]
```

---

## 11. Test Execution Checklist

**Pre-Alpha (Internal):**
- [ ] All P0 functional tests
- [ ] Desktop Chrome only
- [ ] Basic performance check

**Alpha (Closed Testing):**
- [ ] All P0 + P1 tests
- [ ] 3 browsers (Chrome, Firefox, Safari)
- [ ] 2 mobile devices
- [ ] Lighthouse audit

**Beta (Public):**
- [ ] All tests (P0-P2)
- [ ] 6+ browsers
- [ ] 5+ mobile devices
- [ ] Community bug reports tracked

**Release Candidate:**
- [ ] Zero P0/P1 bugs
- [ ] All acceptance criteria met
- [ ] Final Lighthouse audit
- [ ] Sign-off from lead developer

---

**Version:** 1.0  
**Last Updated:** 2025-11-01  
**Status:** ✅ Approved for development
