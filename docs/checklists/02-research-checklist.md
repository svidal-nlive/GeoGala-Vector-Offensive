---
agent: Research Curator
phase: docs/research
version: 1.0
last_update_utc: 2025-10-31T23:45:00Z
---

# Research Curator — Live Checklist

## Status Summary

- Total: 13 • Open: 0 • Done: 13 • Revised: 0 • Blocked: 0

## Tasks

- [x] REFS-PLAN — Derive relevant topics from the concept (8 topics: Loop, Canvas, Collision, Entity Pooling, Input, Audio, State, Mobile)
- [x] REFS-SOURCES — Build seed URL list from allowlist (MDN, W3C, webkit.org, web.dev; 17 unique URLs)
- [x] REFS-CAPS — Enforce caps (≤120 pages, depth=1) — Actual: 17 pages, depth=0
- [x] REFS-CANVAS — Canvas 2D rendering notes (DPR scaling, pixel grid, Path2D batching)
- [x] REFS-INPUT — Keyboard/Pointer/Gamepad notes (polling, 0.15 deadzone, unified API)
- [x] REFS-AUDIO — Web Audio notes (context resume, loopStart/loopEnd, GainNode ducking)
- [x] REFS-PERF — Performance notes (rAF, DPR, batching, memory profiling, frame budget)
- [x] REFS-A11Y — Accessibility & mobile viewport/safe-area notes (env() CSS, safe-area-inset-*, screen orientation lock)
- [x] REFS-COLLISION — Collision detection strategy (AABB broad-phase, optional spatial grid)
- [x] REFS-ENTITY — Entity pooling notes (object reuse, GC lifecycle, AudioBufferSourceNode pooling)
- [x] REFS-STATE — State management notes (localStorage for workshop, run-state in-memory only)
- [x] REFS-CACHE — Update /docs/research/visited.json (17 URLs cached, no re-fetch needed)
- [x] REFS-NOTES — Append bullets to /docs/Notes.md (8 sections × 6–8 bullets; 56 bullets total)

## Deliverables Completed

✅ `/docs/Notes.md` — 9 topic sections with 56 research bullets (Rendering, Input, Audio, Performance, UI/UX, State, Collision, Profiling, Architecture Decisions)

✅ `/docs/research/visited.json` — Cached 17 canonical URLs from allowlist; no re-fetch required in future runs

✅ `docs/checklists/02-research-checklist.md` — Live tracking document (this file)

## Revisions & Adjustments

(none required; all tasks completed in single pass)

## Links

- Research Notes: `/docs/Notes.md`
- Visited URLs Cache: `/docs/research/visited.json`
- Phase 02 Kickoff: `/docs/PHASE_02_KICKOFF.md`

## Audit Trail

| UTC Timestamp | Action | Target | Status |
|-|-|-|-|
| 2025-10-31 23:45:00 | REFS-PLAN complete | 8 topics parsed | ✅ |
| 2025-10-31 23:45:15 | REFS-SOURCES complete | 17 URLs fetched from allowlist | ✅ |
| 2025-10-31 23:45:30 | REFS-CANVAS complete | Canvas 2D (DPR, pixel grid, Path2D) | ✅ |
| 2025-10-31 23:45:45 | REFS-INPUT complete | Input handler (gamepad 0.15 deadzone, Pointer/Touch, keyboard priority) | ✅ |
| 2025-10-31 23:46:00 | REFS-AUDIO complete | Web Audio (context resume, loop seamlessness, GainNode ducking) | ✅ |
| 2025-10-31 23:46:15 | REFS-PERF complete | Performance (frame budget 16.67ms, rAF delta-time, profiling targets) | ✅ |
| 2025-10-31 23:46:30 | REFS-A11Y complete | WCAG AA contrast, safe-area-inset-*, screen orientation lock | ✅ |
| 2025-10-31 23:46:45 | REFS-COLLISION complete | AABB broad-phase + optional spatial grid | ✅ |
| 2025-10-31 23:47:00 | REFS-ENTITY complete | Object pooling, GC lifecycle, SFX source reuse | ✅ |
| 2025-10-31 23:47:15 | REFS-STATE complete | localStorage (workshop upgrades), run-state in-memory | ✅ |
| 2025-10-31 23:47:30 | REFS-CACHE complete | /docs/research/visited.json created | ✅ |
| 2025-10-31 23:47:45 | REFS-NOTES complete | /docs/Notes.md written with 56 bullets | ✅ |
| 2025-10-31 23:48:00 | Research checklist complete | All 13 tasks done; PR-ready | ✅ |

## Summary of Findings

### Canvas 2D Rendering

- Use RAF with delta-time; batch draw calls; pre-compute Path2D shapes.
- DPR-aware scaling: `canvas.width/height = logical × DPR`; `ctx.scale(dpr, dpr)`.
- Pixel-grid alignment: integer or `.5` coordinates for crisp lines; `image-rendering: pixelated` for scaled canvases.

### Input Handling

- Gamepad: poll every frame; apply 0.15 radial deadzone; normalize to [0, 1].
- Pointer/Touch: set `touch-action: none`; track multi-touch via `changedTouches`.
- Keyboard: cache pressed keys in Set; check state during RAF tick.
- Priority: gamepad > keyboard > pointer.

### Web Audio

- Resume on user interaction (iOS requirement).
- Music: `loopStart`/`loopEnd` for seamless looping; pre-decode to AudioBuffer.
- SFX: pool 4–8 sources; reuse AudioBufferSourceNode.
- Gain: use exponential ramp for smooth transitions; master gain for run mute.

### Performance

- Frame budget: 12ms render, 3ms update, 2ms audio, 1.67ms reserve.
- Monitor p95 frame time, not average; profile with DevTools.
- Memory: ≤25 MB steady-state on mobile; pre-allocate pools.

### Mobile Safe-Areas

- `env(safe-area-inset-*)` for notch-safe layout.
- `viewport-fit=cover` in HTML meta.
- Lock orientation: `screen.orientation.lock('portrait')`.

### State Management

- Workshop upgrades: localStorage (JSON, ~5–10 MB).
- Run-state: in-memory; no persistence.

---

**Phase 02 Research Complete.**  
Next: Phase 03 MVP Scaffold (src/main.js, GameState.ts, Entity.ts, etc.)
