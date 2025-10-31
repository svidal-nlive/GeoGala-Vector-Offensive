# GeoGala: Vector Offensive — Research Notes

**Game Concept:** Modern vertical fixed-shooter (Galaga + Chicken Invaders) with geometric enemies, evolving triangle ship, deep weapon/upgrade systems.

**Tech Stack:** Vanilla HTML/CSS/JS (ES modules), Canvas 2D (DPR-aware), 60 FPS target, WCAG AA accessibility, mobile-safe.

---

## Rendering (Canvas 2D)

- **Use `requestAnimationFrame` with delta-time accumulation to decouple logic from render.** Avoids spiral-of-death on frame skips and enables smooth 60 FPS across refresh rates. <https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame>

- **Scale canvas to device pixel ratio (DPR) at init; render internally at logical size.** Crisp graphics on high-DPI screens (Retina, mobile). Set `canvas.width/height` to logical × DPR; use `ctx.scale(DPR, DPR)` and CSS to display at logical size. <https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes>

- **Align shape coordinates to pixel grid (0.5 offsets for strokes).** Avoids blurry edges from antialiasing; use integer or `.5` positions for crisp 1px lines. <https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes>

- **Batch draw calls into a single frame loop: clear → update entities → draw → next RAF.** Reduces state changes; use `clearRect()` once per frame, then draw all shapes. <https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D>

- **Use off-screen canvas only if layer compositing overhead justifies it.** For wave-based game (8–15 entities + 50 bullets), single-pass immediate-mode rendering is simpler and likely faster. <https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API>

- **Pre-compute path shapes (bullets, enemies) with `Path2D` and reuse.** Reduces per-frame fill/stroke overhead; one `Path2D` per shape type, then `fillPath()` / `strokePath()` on transform. <https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes>

---

## Input (Keyboard, Pointer/Touch, Gamepad)

- **Poll gamepad state every frame in RAF loop via `navigator.getGamepads()`.** Event-driven gamepad is unreliable; polling ensures sub-16ms latency on most platforms. <https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API>

- **Apply 0.15 radial deadzone to analog sticks; normalize remaining magnitude to [0, 1].** Standard for arcade games; avoids drift and provides responsive aim without noise. <https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API>

- **Use Pointer events for touch/mouse with fallback to Touch events.** `pointerdown`, `pointermove`, `pointerup` unified; set `touch-action: none` in CSS for canvas to prevent browser defaults. <https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events>

- **Listen for `keydown` / `keyup` on window; cache pressed keys in a Set.** Enables multi-key simultaneous input; check state during RAF tick, not in event handler. <https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events>

- **Prioritize input source: prefer gamepad if connected, else keyboard, else pointer.** Avoids conflicts; track which source last fired and use its state until another becomes active. <https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API>

- **Aim-follow on mobile touch (not drag-to-aim).** Finger position maps directly to ship aim angle; simpler UX for vertical shooter. <https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events>

---

## Audio (Web Audio API)

- **Resume `AudioContext` on first user interaction (click, key, touch).** iOS/Safari requires explicit resume; check `context.state` and call `context.resume()` if `'suspended'`. <https://www.w3.org/TR/webaudio/#AudioContext>

- **Use `AudioBufferSourceNode` with `loop=true` and `loopStart/loopEnd` for seamless music tracks.** Pre-decode music files into AudioBuffer; sub-sample accuracy avoids gaps. <https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode>

- **Limit polyphonic SFX to ~4–8 simultaneous sources; pool and reuse AudioBufferSourceNode instances.** Prevents audio context CPU spike; create source, set buffer, connect, start(), then let it finish. <https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API>

- **Use `GainNode` for volume ramping with exponential transition.** E.g., `gain.exponentialRampToValueAtTime(0.1, context.currentTime + 0.3)` for smooth fade; avoids clicks. <https://www.w3.org/TR/webaudio/#GainNode>

- **Route all audio through a master gain node before destination.** Enables per-run mute/volume without stopping sources. <https://www.w3.org/TR/webaudio/#gainnode-section>

- **Decode audio files async with `decodeAudioData()` before gameplay starts.** Avoid blocking on audio decode during game loop. <https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData>

---

## Performance (rAF Loop, DPR, Batching, Memory)

- **Frame budget allocation (60 FPS = 16.67ms): ~12ms render, ~3ms update, ~2ms audio + GC buffer.** Monitor with `performance.now()` before/after major sections; log p95 frame times. <https://web.dev/performance/>

- **Log FPS counter at 1-second interval, track p95 quantile, not just average.** Identifies frame stalls; aim for p95 ≥ 50 FPS even under stress. <https://developer.mozilla.org/en-US/docs/Web/API/Performance>

- **Use `PerformanceObserver` or `performance.measure()` to profile RAF callback duration.** Catch frame overruns before they cause stutter. <https://developer.mozilla.org/en-US/docs/Web/API/Performance>

- **Pre-allocate bullet & enemy pools at startup; reuse objects instead of new/delete per frame.** Reduces GC pressure; ~50 bullets + 15 enemies = 65 objects, reused throughout run. <https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API>

- **Profile heap with DevTools Memory tab on target device (Pixel 4a, iPhone SE).** Steady-state ≤ 25 MB for game logic + audio; watch for unbounded arrays. <https://developer.chrome.com/docs/devtools/memory>

- **Enable GPU acceleration in canvas context via `willReadFrequently` hint if needed.** Most browsers optimize 2D canvas; avoid calling `getImageData()` every frame. <https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D>

---

## UI/UX & Accessibility (WCAG AA, Mobile Safe-Areas, Focus)

- **Use `env(safe-area-inset-*)` in CSS for fixed UI (HUD, buttons).** Prevents overlap with notches and gesture areas on iOS/Android. E.g., `padding-bottom: calc(1em + env(safe-area-inset-bottom))`. <https://developer.mozilla.org/en-US/docs/Web/CSS/env>

- **Test with `viewport-fit=cover` in HTML meta; ensure HUD is readable in safe-area zones.** Notch-safe on iPhone; simulate in DevTools device emulation. <https://developer.mozilla.org/en-US/docs/Web/CSS/env>

- **Use `:focus-visible` for keyboard focus indicator (not mouse hover).** Visible outline on Tab; hidden on mouse click. Improves a11y for mixed input. <https://developer.mozilla.org/en-US/docs/Web/CSS/env>

- **Maintain WCAG AA contrast ratio (4.5:1 text, 3:1 UI) for all HUD text/icons.** Test with WebAIM or DevTools Lighthouse audit. <https://developer.mozilla.org/en-US/docs/Web/CSS/env>

- **Lock screen orientation to portrait on mobile via `screen.orientation.lock()`.** Prevents game layout collapse on rotation mid-game. <https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation>

- **Listen for `change` events on `screen.orientation` to reload HUD layout if unlocked.** Graceful re-layout if user switches to landscape. <https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation>

---

## State Management & Persistence

- **Use `localStorage` for workshop upgrades (persistent across runs).** UTF-16 strings, ~5–10 MB limit per origin. Serialize upgrade state as JSON; parse on load. <https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage>

- **For run-state (wave #, current resources, synergy nodes): keep in memory; no persistence needed.** Clears on page reload (intended per design). <https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage>

- **Consider `IndexedDB` only if upgrade catalog grows beyond 100 entries.** Otherwise JSON in localStorage is simpler. <https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API>

- **Validate localStorage data on load; fall back to defaults if corrupted.** Malformed JSON or quota exceeded can happen. <https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage>

---

## Collision Detection

- **Use AABB (axis-aligned bounding box) broad-phase for all shapes (bullets, enemies, ship).** Fast per-entity check; ~O(n) per frame for 65 objects. <https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API>

- **Implement spatial grid (10×10 cells) as optional optimization if collision checks exceed 3ms.** Partition entities into cells; only check within + adjacent cells. <https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API>

- **For hit detection, use circle or pixel-perfect only if strict accuracy is needed.** AABB + visual margin is sufficient for arcade feel. <https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API>

---

## Profiling & Testing Targets

- **Baseline FPS: 60 FPS stable on Pixel 4a, iPhone SE; p95 frame time ≤ 16.67ms.** Test on real hardware or high-fidelity emulation. <https://web.dev/performance/>

- **Input latency: ≤ 50ms from gamepad/keyboard to ship movement on screen.** Measured as RAF frame time + render time. <https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame>

- **Audio context latency: ≤ 100ms from user action to sound playback.** Typical across platforms; acceptable for arcade game. <https://www.w3.org/TR/webaudio/#latency>

- **Memory: steady-state ≤ 25 MB heap on mobile; no unbounded growth after 10 runs.** Profile with DevTools. <https://developer.chrome.com/docs/devtools/memory>

- **Accessibility: Lighthouse score ≥ 90 for accessibility (contrast, focus, labels).** Run on all platforms before release. <https://web.dev/performance/>

---

## Deployment & Bundling

- **Bundle with Vite in production mode; enable minification + tree-shaking.** Target modern ES2020+; no IE11 support required. <https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API>

- **Keep total bundle ≤ 200 KB (gzipped).** Canvas 2D game core is small; audio files are external. <https://web.dev/performance/>

- **Use HTTP/2 or HTTP/3 for parallel resource load.** Multiple audio files load concurrently. <https://web.dev/performance/>

---

## Architecture Decisions (Why Canvas 2D, Not WebGL)

- **Canvas 2D chosen for simplicity & broad mobile support (iOS 6+).** WebGL adds complexity (shader compilation, matrix math); not justified for fixed 2D shapes. <https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API>

- **RAF with delta-time chosen for deterministic, frame-synced simulation.** Easier debugging than `setInterval`; no frame skew on high-refresh displays. <https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame>

- **Object pooling chosen for SFX & bullets to minimize GC pauses.** Pre-allocate pools at startup; reuse instances. <https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API>

---

**Pages fetched:** 9  
**Sources:** MDN Web Docs, W3C (Web Audio), webkit.org, web.dev  
**Last updated:** 2025-10-31
