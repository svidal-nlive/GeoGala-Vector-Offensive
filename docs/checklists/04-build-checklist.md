---
agent: Docs-to-Code Builder  
phase: build/mvp  
version: 1  
last_update_utc: 2025-10-31T16:41:00Z  
---

# Docs-to-Code Builder — Live Checklist

## Status Summary

- Total: 16 • Open: 4 • Done: 12 • Revised: 0 • Blocked: 0  

## Tasks

- [x] MVP-ENGINE — Implement engine.js (main loop)  
- [x] MVP-SYS-INPUT — Implement input.js (keyboard/touch/gamepad)  
- [x] MVP-SYS-SPAWN — Implement spawn.js (wave logic)  
- [x] MVP-SYS-PHYS — Implement physics.js (velocity/bounds)  
- [x] MVP-SYS-COLL — Implement collision.js (grid + circle tests)  
- [x] MVP-SYS-REND — Implement render.js (Canvas draws)  
- [x] MVP-SYS-UI — Implement ui-sync.js (HUD bindings)  
- [x] MVP-ENT-PLAYER — Create Player entity  
- [x] MVP-ENT-ENEMY — Create Enemy entity  
- [x] MVP-ENT-BULLET — Create Bullet entity (+ pool if needed)  
- [ ] MVP-ENT-EFFECT — Create Effect entity (optional)  
- [x] MVP-HUD — Implement HUD (score/wave/lives)  
- [ ] MVP-HARNESS — Build dev-harness HTML for testing  
- [ ] MVP-CONFIG — Sync docs/Balance.md to config/balance.js  
- [x] MVP-LINTBUILD — Lint and build pass  
- [ ] MVP-PR — Open PR `feat: MVP core loop`  

## Revisions & Adjustments

(task-id, rev#, timestamp, summary, link)

## Links

(PRs, Issues)

## Audit Trail

| UTC Timestamp | Action | Target | Link |
|-|-|-|-|
| 2025-10-31T00:00:00Z | Start | Phase 04 Build | - |
| 2025-10-31T16:41:00Z | Completed | Sprint 1: Wave System, Loot, Damage, HUD | WaveManager.ts, LootManager.ts, DamageCalculator.ts |
| 2025-10-31T16:41:00Z | Upgraded | Vite v7.1.12 + Terser | package.json |
| 2025-10-31T16:41:00Z | Build | Success (24.82 KB gzipped: 6.76 KB) | dist/ |
