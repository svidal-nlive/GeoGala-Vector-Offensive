# GeoGala: Vector Offensive — Testing & Performance

## 1. Performance Targets

### 1.1 Frame Rate & Latency

| Metric | Target | Acceptable | Failure |
| --- | --- | --- | --- |
| **FPS** | 60 FPS (constant) | 55+ FPS (98% of time) | < 48 FPS persistent |
| **Frame Time (avg)** | 16.67 ms | ≤ 18 ms | > 20 ms |
| **Frame Time (p95)** | 16.67 ms | ≤ 20 ms | > 33 ms |
| **Input Latency** | ≤ 33 ms | ≤ 50 ms | > 100 ms |
| **Audio Latency** | ≤ 20 ms | ≤ 50 ms | > 100 ms |

### 1.2 Frame Budget Allocation (16.67 ms per frame @ 60 FPS)

```plaintext
Total: 16.67 ms per frame

┌─────────────────────────────────────┐
│ Render (Canvas Draw)  │  12 ms (72%)  │  Shape drawing, HUD, effects
│ Update (Logic)         │  3 ms (18%)   │  Movement, collision, state
│ Audio                  │  2 ms (12%)   │  Playback, gain updates
│ GC / Jank Buffer       │  1.67 ms      │  Reserve for garbage collection
└─────────────────────────────────────┘
```

---

## 2. Browser & Device Testing Matrix

### 2.1 Desktop Browsers

| Browser | Version | Target FPS | Notes |
| --- | --- | --- | --- |
| Chrome | 120+ | 60 | Baseline; excellent Canvas performance |
| Firefox | 121+ | 60 | Good performance; test DPR scaling |
| Safari | 17+ | 60 | Requires testing on macOS; iOS Safari separate |
| Edge | 120+ | 60 | Chromium-based; similar to Chrome |

### 2.2 Mobile Devices

| Device | OS | Screen | Target FPS | Notes |
| --- | --- | --- | --- | --- |
| iPhone 15 | iOS 17+ | 6.1" | 60 | High DPR (3x), test safe-areas |
| iPhone SE | iOS 17+ | 4.7" | 60 | Lower-end device, monitor perf |
| Samsung S24 | Android 14+ | 6.2" | 60 | High DPR (2–3x) |
| Google Pixel 8 | Android 14+ | 6.2" | 60 | Reference Android |
| iPad Pro 12.9" | iPadOS 17+ | 12.9" | 60 | Larger canvas, test scaling |

---

## 3. Test Suites

### 3.1 Functional Testing

#### Core Gameplay

- [ ] **Wave Generation:** Formations spawn correctly, timing is consistent
- [ ] **Enemy Behavior:** Triangles dive, squares wall, hexagons pulse, diamonds buff
- [ ] **Player Input:**
  - Keyboard: Movement, firing, focus mode all respond within 1 frame
  - Gamepad: Analog sticks normalized, triggers responsive
  - Touch: Aim-follow on mobile, fire on screen contact
- [ ] **Collision Detection:** Bullet-vs-enemy, player-vs-enemy, pickup detection all accurate
- [ ] **Wave Clear:** All enemies eliminated → wave completes, resources awarded
- [ ] **Boss Encounters:** Bosses spawn at wave 10/20/30, behavior patterns active
- [ ] **Upgrade System:** Panel appears, selections apply, resources persist

#### UI/UX

- [ ] **Pause:** Pause button stops game, UI visible, unpause resumes
- [ ] **Upgrade Panel:** Slide-up animation smooth, options readable, buttons responsive
- [ ] **HUD Updates:** Wave counter, credits, health bars refresh every frame
- [ ] **Color Contrast:** All text passes WCAG AA (4.5:1 ratio) on mobile safe-areas

#### Audio

- [ ] **Music Loops:** Track plays, loops seamlessly, no pops
- [ ] **SFX Playback:** Fire, impact, pickup SFX play in correct contexts
- [ ] **Mute Toggle:** Mute button silences all audio, unmute restores volume
- [ ] **Volume Controls:** Sliders adjust music/SFX independently

#### Input

- [ ] **Keyboard:** All keys map correctly (arrows + WASD, space fire, escape pause)
- [ ] **Gamepad:** Connected gamepad detects, analog sticks map to movement, RT fires
- [ ] **Touch (Mobile):** Pointer movement, firing, pause all functional
- [ ] **Cross-Input:** Can switch between keyboard & gamepad mid-game

### 3.2 Performance Testing

Use Chrome DevTools Lighthouse or Firefox Profiler.

#### Target Metrics

```plaintext
Lighthouse Performance Score: ≥ 90
Lighthouse Accessibility Score: ≥ 90
Lighthouse Best Practices Score: ≥ 90
```

#### Frame Rate Testing

```javascript
// In main.js, log FPS every 1 second
let frameCount = 0;
let lastTime = performance.now();

function logFPS() {
  const now = performance.now();
  const delta = now - lastTime;
  if (delta >= 1000) {
    const fps = (frameCount / delta * 1000).toFixed(1);
    console.log(`FPS: ${fps}`);
    frameCount = 0;
    lastTime = now;
  }
  frameCount++;
}
```

#### CPU Usage (Profiler)

- **Render Phase:** ≤ 12 ms
  - `ctx.fillRect()` + shape drawing ≤ 8 ms
  - HUD text rendering ≤ 3 ms
  - Effects ≤ 1 ms
- **Update Phase:** ≤ 3 ms
  - Entity movement ≤ 1 ms
  - Collision detection ≤ 1.5 ms
  - State updates ≤ 0.5 ms
- **Audio:** ≤ 2 ms
  - Web Audio node processing

#### Memory Usage

- **Peak Heap:** ≤ 80 MB (desktop), ≤ 60 MB (mobile)
- **Steady-State:** ≤ 50 MB (desktop), ≤ 35 MB (mobile)
- **GC Pauses:** ≤ 5 ms, no pauses during boss phases

### 3.3 Visual / Regression Testing

#### Canvas Rendering

- [ ] **Shapes draw correctly:** Triangles point upward, squares rotated, hexagons aligned
- [ ] **Colors accurate:** Cyan `#00ffff`, magenta `#ff0088`, etc. match spec
- [ ] **Glow effects:** Neon edge on player, buff auras on support, boss highlights
- [ ] **No clipping:** All shapes fit on-screen, safe-areas respected on mobile
- [ ] **DPR scaling:** Crisp rendering on 1x, 2x, 3x DPR devices

#### Animation

- [ ] **Smooth motion:** Bullets move linearly, shapes animate at 60 FPS, no stuttering
- [ ] **Impact effects:** Bullet hits enemy → white flash, sound, particle burst
- [ ] **UI transitions:** Upgrade panel slides smoothly, no janky animations

### 3.4 Accessibility Testing

#### WCAG 2.1 AA Compliance

- [ ] **Color Contrast:** All text passes 4.5:1 on backgrounds (verified via `axe` or WAVE)
- [ ] **Keyboard Navigation:** All controls accessible via keyboard (no mouse-only UI)
- [ ] **Focus Indicators:** Buttons/inputs have visible focus rings
- [ ] **Screen Reader:** Game HUD can be navigated with screen reader (pause, wave counter, resources)
- [ ] **Touch Targets:** UI buttons min 44×44 px, spacing 8 px

**Test with:**

- Chrome Lighthouse > Accessibility tab
- axe DevTools browser extension
- NVDA (screen reader on Windows)

### 3.5 Mobile-Specific Testing

#### Safe-Area & Notch Handling

- [ ] **Notch awareness:** Canvas respects safe-areas on iPhone 14/15 Pro
- [ ] **Landscape orientation:** Game responds to device rotation, HUD adapts
- [ ] **Touch safe-zones:** UI buttons not overlapped by notches or home indicators
- [ ] **Zoom prevention:** `viewport-fit=cover` and `user-scalable=no` set correctly

#### Device-Specific

- [ ] **iOS Safari:** Web Audio context resumes on user interaction
- [ ] **Android Chrome:** Touch aim-follow works smoothly, no lag
- [ ] **Low-end device (iPhone SE, Pixel 4a):** Maintain 50+ FPS with reduced particle effects

### 3.6 Cross-Browser Testing

#### Compatibility Matrix

| Feature | Chrome | Firefox | Safari | Edge | Notes |
| --- | --- | --- | --- | --- | --- |
| Canvas 2D | ✓ | ✓ | ✓ | ✓ | Baseline |
| Web Audio | ✓ | ✓ | ✓ | ✓ | Context resume required |
| Gamepad API | ✓ | ✓ | ⚠ (partial) | ✓ | Safari limited support |
| Touch Events | ✓ | ✓ | ✓ | ✓ | Use `preventDefault()` |
| LocalStorage | ✓ | ✓ | ✓ | ✓ | For settings persistence |
| ES Modules | ✓ | ✓ | ✓ | ✓ | Via `<script type="module">` |

---

## 4. Build & Deployment Testing

### 4.1 Bundle Analysis

```bash
# Check bundle size
npm run build
echo "Total bundle size:"
du -sh dist/
```

**Targets:**

- **Uncompressed:** ≤ 500 KB (JS + CSS + assets)
- **Gzipped:** ≤ 150 KB

### 4.2 Build Validation

- [ ] **Prod build succeeds:** `npm run build` completes without errors
- [ ] **ES modules resolve:** All imports/exports correct
- [ ] **Source maps present:** Debugging available in production
- [ ] **Asset hashing:** Files have content-based hashes for cache-busting

### 4.3 HTTP Caching Headers

```plaintext
# Static assets (cache 1 year)
Cache-Control: public, max-age=31536000, immutable

# index.html (cache 1 hour)
Cache-Control: public, max-age=3600, must-revalidate

# API responses (no cache)
Cache-Control: no-cache, no-store, must-revalidate
```

---

## 5. QA Checklist (Per Release)

### Pre-Release

- [ ] All functional tests pass
- [ ] FPS ≥ 55 on target devices (desktop & mobile)
- [ ] Input latency ≤ 50 ms
- [ ] No memory leaks (heap stable over 10 min gameplay)
- [ ] Audio plays without stuttering
- [ ] Lighthouse score ≥ 90 (Performance, Accessibility)
- [ ] WCAG AA compliance verified (color contrast, keyboard nav)

### Post-Release

- [ ] Monitor error logs for crashes
- [ ] Gather user feedback on input responsiveness
- [ ] Track performance metrics (real user monitoring)
- [ ] Update known issues in docs/Release.md

---

## 6. Debug Features (Optional)

### 6.1 Debug Menu (Dev Build Only)

```javascript
if (DEBUG_MODE) {
  const debugMenu = {
    toggleHitboxes() {
      SHOW_HITBOXES = !SHOW_HITBOXES;
    },
    toggleFPS() {
      SHOW_FPS = !SHOW_FPS;
    },
    spawn(shapeType) {
      entityManager.add(new window[shapeType](400, 200));
    },
    nextWave() {
      gameState.waveComplete();
    },
    spawnBoss() {
      gameState.spawnBoss(10);
    },
  };

  window.DEBUG = debugMenu;
}
```

**Usage:** `DEBUG.toggleFPS()`, `DEBUG.spawnBoss()`, etc.

### 6.2 Performance Monitoring

```javascript
class PerformanceMonitor {
  update() {
    const memory = performance.memory;
    console.log(`Heap: ${(memory.usedJSHeapSize / 1e6).toFixed(1)} MB`);
    console.log(`External: ${(memory.externalMemoryUsage / 1e6).toFixed(1)} MB`);
  }
}
```

---

## 7. Cross-References

- **Game Design:** See [01-Game-Design-Document.md](01-Game-Design-Document.md) for gameplay rules
- **Architecture:** See [02-Technical-Architecture.md](02-Technical-Architecture.md) for system design
- **Visuals:** See [03-Visual-Style-Guide.md](03-Visual-Style-Guide.md) for rendering specs
- **Input:** See [05-Input-Spec.md](05-Input-Spec.md) for control testing
