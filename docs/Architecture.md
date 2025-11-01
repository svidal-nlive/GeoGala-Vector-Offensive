# Architecture Document
**Geo Gala: Vector Offensive**

---

## 1. System Overview

**Architecture Pattern:** Lightweight Entity-Component-System (ECS)  
**Rendering:** Immediate-mode Canvas 2D with retained-mode HUD  
**State Management:** Single game state object with event bus

---

## 2. High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    index.html                        │
│  ┌────────────┐  ┌────────────┐  ┌──────────────┐  │
│  │ Game Canvas│  │  HUD Layer │  │  Menu Layer  │  │
│  │  (Canvas)  │  │   (HTML)   │  │   (HTML)     │  │
│  └─────┬──────┘  └─────┬──────┘  └──────┬───────┘  │
└────────┼───────────────┼─────────────────┼──────────┘
         │               │                 │
         └───────────────┴─────────────────┘
                         │
                    ┌────▼─────┐
                    │  main.js │
                    │ (Bootstrap)
                    └────┬─────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼────┐    ┌──────▼──────┐   ┌────▼─────┐
   │ Game.js │    │ Renderer.js │   │ Input.js │
   │(Loop)   │◄───┤(Draw)       │   │(Events)  │
   └────┬────┘    └─────────────┘   └────┬─────┘
        │                                  │
        │         ┌─────────────────┐     │
        └────────►│  Entity Manager │◄────┘
                  └────────┬────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
     ┌────▼────┐    ┌──────▼──────┐   ┌────▼────┐
     │Movement │    │  Collision  │   │  Spawn  │
     │ System  │    │   System    │   │ System  │
     └─────────┘    └─────────────┘   └─────────┘
```

---

## 3. Module Relationships

### 3.1 Core Modules

**main.js**
- Entry point
- Initializes canvas, input, audio
- Creates Game instance
- Handles window resize

**game.js**
- Owns game loop (requestAnimationFrame)
- Manages game state (menu, playing, paused, gameover)
- Coordinates systems execution
- Handles wave progression

**renderer.js**
- Pure rendering logic (no game state mutation)
- Draws entities, background, VFX
- Manages canvas context (DPR, clear)

**input.js**
- Abstracts keyboard, touch, gamepad
- Normalizes input vectors
- Fires input events

### 3.2 Entity System

**EntityManager**
```
┌──────────────────────────┐
│    EntityManager         │
├──────────────────────────┤
│ - entities: Entity[]     │
│ - pools: Map<type, Pool> │
├──────────────────────────┤
│ + create(type): Entity   │
│ + destroy(id): void      │
│ + query(filter): Entity[]│
└──────────────────────────┘
```

**Entity Lifecycle:**
```
create() → reset() → update(dt) → draw(ctx) → destroy() → pool
```

### 3.3 System Execution Order

```
Game Loop (60 FPS)
  ├─ 1. InputSystem.update()      // Poll input state
  ├─ 2. SpawnSystem.update()      // Create new entities
  ├─ 3. MovementSystem.update()   // Apply velocities
  ├─ 4. CollisionSystem.update()  // Detect & resolve collisions
  ├─ 5. HeatSystem.update()       // Manage weapon heat
  ├─ 6. LifetimeSystem.update()   // Remove expired entities
  ├─ 7. Renderer.draw()           // Render all entities
  └─ 8. HUD.update()              // Update HTML HUD
```

---

## 4. Data Flow Diagrams

### 4.1 Player Input → Movement

```
┌──────────┐     ┌──────────┐     ┌──────────────┐
│Keyboard/ │────►│ Input    │────►│ Player       │
│Touch/Pad │     │ Manager  │     │ Entity       │
└──────────┘     └──────────┘     └──────┬───────┘
                                          │
                                          ▼
                                   ┌──────────────┐
                                   │ Movement     │
                                   │ System       │
                                   └──────┬───────┘
                                          │
                                          ▼
                                   ┌──────────────┐
                                   │ Renderer     │
                                   │ (Draw)       │
                                   └──────────────┘
```

### 4.2 Enemy Spawn → Destruction

```
┌──────────┐     ┌──────────┐     ┌──────────────┐
│ Wave     │────►│ Spawn    │────►│ Enemy        │
│ Config   │     │ System   │     │ Entity       │
└──────────┘     └──────────┘     └──────┬───────┘
                                          │
                                   Movement + AI
                                          │
                                          ▼
                              ┌───────────────────────┐
                              │ Collision with        │
                              │ Player Projectile     │
                              └───────────┬───────────┘
                                          │
                   ┌──────────────────────┼──────────────────┐
                   ▼                      ▼                  ▼
            ┌──────────┐         ┌──────────────┐   ┌──────────┐
            │ Spawn    │         │ Update Score │   │ Spawn    │
            │ Explosion│         │ (HUD)        │   │ Pickup   │
            └──────────┘         └──────────────┘   └──────────┘
```

### 4.3 Wave Progression

```
Wave Start
   │
   ├─ Load Wave Config
   │     │
   │     ├─ Formation type
   │     ├─ Enemy types & counts
   │     └─ Difficulty multipliers
   │
   ├─ Spawn Enemies (via SpawnSystem)
   │     │
   │     └─ Formation positions calculated
   │
   ├─ [Gameplay Loop]
   │     │
   │     ├─ Enemies attack
   │     ├─ Player shoots
   │     └─ Collision checks
   │
   ├─ All Enemies Destroyed?
   │     │
   │     ├─ Yes → Wave Clear
   │     │   │
   │     │   ├─ Show overlay
   │     │   ├─ Award bonus
   │     │   └─ Increment wave counter
   │     │
   │     └─ No → Continue gameplay
   │
   └─ Player HP = 0?
         │
         └─ Yes → Game Over
```

---

## 5. Component Breakdown

### 5.1 Player Ship Components

```javascript
{
  // Transform
  x: 400,
  y: 600,
  rotation: 0,
  
  // Physics
  vx: 0,
  vy: 0,
  speed: 400, // px/s
  
  // Combat
  hp: 3,
  maxHp: 3,
  invulnerable: false, // Post-damage i-frames
  invulnTime: 0,
  
  // Weapon
  powerLevel: 0,
  heat: 0,
  heatMax: 100,
  fireRate: 10, // shots/s
  lastFireTime: 0,
  
  // Abilities
  missiles: 3,
  nukes: 1,
  
  // Rendering
  radius: 20,
  color: '#00FFFF',
  glow: 0.6
}
```

### 5.2 Enemy Components

```javascript
{
  // Type
  faction: 'order', // order | chaos | fractal | singularity
  variant: 'scout',
  
  // Transform
  x: 200,
  y: 100,
  rotation: 0,
  
  // AI State
  state: 'formation', // formation | dive | retreat
  targetX: 200,
  targetY: 400,
  formationSlot: 5,
  
  // Combat
  hp: 1,
  damage: 1,
  attackCooldown: 2, // seconds
  lastAttackTime: 0,
  
  // Movement
  speed: 150,
  diveSpeed: 300,
  
  // Rendering
  radius: 15,
  color: '#00FF88',
  shape: 'triangle'
}
```

---

## 6. State Machine Diagrams

### 6.1 Game State

```
        START
          │
          ▼
     ┌────────┐
     │  MENU  │◄──────────────┐
     └────┬───┘               │
          │ [START]           │
          ▼                   │
     ┌────────┐               │
     │PLAYING │               │
     └───┬─┬──┘               │
         │ │                  │
    [ESC]│ │[HP=0]            │
         │ │                  │
         ▼ ▼                  │
     ┌────────┐  ┌─────────┐ │
     │ PAUSED │  │GAMEOVER │─┘
     └────┬───┘  └─────────┘
          │
     [RESUME]
          │
          └──────────┐
                     │
                     ▼
                ┌────────┐
                │PLAYING │
                └────────┘
```

### 6.2 Enemy AI State

```
    SPAWN
      │
      ▼
 ┌─────────┐
 │FORMATION│────┐
 └────┬────┘    │
      │         │ [Timer expires]
 [Reach slot]   │
      │         │
      ▼         ▼
 ┌─────────┐ ┌──────┐
 │  IDLE   │ │ DIVE │
 └────┬────┘ └──┬───┘
      │         │
      │    [Reach bottom]
      │         │
      └─────────┴──────► RETREAT
                            │
                       [Off-screen]
                            │
                            ▼
                         DESPAWN
```

---

## 7. Event System

**Event Bus Pattern:**
```javascript
class EventBus {
  constructor() {
    this.listeners = new Map();
  }
  
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }
  
  emit(event, data) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).forEach(cb => cb(data));
  }
}
```

**Event Types:**
- `player:hit` → Update HP, flash screen
- `enemy:destroyed` → Spawn pickup, update score
- `wave:clear` → Show overlay, increment wave
- `pickup:collected` → Apply effect, play SFX
- `weapon:overheat` → Disable firing, show warning
- `game:pause` → Freeze game loop
- `game:resume` → Resume game loop

---

## 8. Memory Management

### 8.1 Object Pooling

**Pooled Entity Types:**
- Projectiles (200 max)
- Particles (500 max)
- Enemies (100 max)
- Pickups (50 max)

**Pool Lifecycle:**
```
Acquire → Reset → Use → Release → Return to Pool
```

**Garbage Collection Strategy:**
- Minimize object creation in game loop
- Reuse arrays for queries (clear instead of new)
- Cache canvas context refs
- Pre-allocate vectors

### 8.2 Asset Loading

```
Loading Phase (Before Game Loop)
  ├─ Audio buffers (Web Audio)
  ├─ Font preload (CSS)
  └─ Config JSON (wave definitions)

Runtime (No loading)
  └─ All assets in memory
```

---

## 9. Performance Optimization

### 9.1 Render Optimizations

**Spatial Culling:**
```javascript
function getVisibleEntities(entities, viewport) {
  return entities.filter(e => {
    return e.x + e.radius > viewport.left &&
           e.x - e.radius < viewport.right &&
           e.y + e.radius > viewport.top &&
           e.y - e.radius < viewport.bottom;
  });
}
```

**Canvas State Batching:**
```javascript
// Group draw calls by color
entities.sort((a, b) => a.color.localeCompare(b.color));
let currentColor = null;

entities.forEach(e => {
  if (e.color !== currentColor) {
    ctx.strokeStyle = e.color;
    currentColor = e.color;
  }
  drawShape(ctx, e);
});
```

### 9.2 Update Optimizations

**Collision Grid:**
- 256×256 pixel cells
- Only check entities in same/adjacent cells
- Reduces O(n²) to ~O(n)

**Fixed Timestep:**
- Decouple update rate from render rate
- Accumulator pattern prevents spiral of death

---

## 10. Module Dependencies Graph

```
main.js
  ├─► game.js
  │     ├─► renderer.js
  │     ├─► input.js
  │     ├─► audio.js
  │     └─► systems/
  │           ├─► MovementSystem.js
  │           ├─► CollisionSystem.js
  │           ├─► SpawnSystem.js
  │           ├─► HeatSystem.js
  │           └─► LifetimeSystem.js
  │
  ├─► entities/
  │     ├─► Player.js
  │     ├─► Enemy.js
  │     ├─► Projectile.js
  │     └─► Pickup.js
  │
  ├─► ui/
  │     ├─► HUD.js
  │     ├─► Menu.js
  │     └─► Overlay.js
  │
  ├─► data/
  │     ├─► waves.js
  │     ├─► factions.js
  │     └─► weapons.js
  │
  └─► utils/
        ├─► math.js
        ├─► pool.js
        └─► storage.js
```

**Dependency Rules:**
- No circular dependencies
- Utils depend on nothing
- Data files are pure JSON/constants
- Systems depend only on entity interfaces

---

## 11. Scaling Strategy

**Entity Count Scaling:**
| Device | Max Entities | Particle Budget |
|--------|-------------|-----------------|
| Mobile Low | 100 | 100 particles |
| Mobile High | 150 | 200 particles |
| Desktop | 300 | 500 particles |

**Quality Tiers (Auto-detected):**
```javascript
function detectQuality() {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const cores = navigator.hardwareConcurrency || 2;
  
  if (isMobile && cores < 4) return 'low';
  if (isMobile) return 'medium';
  return 'high';
}
```

**Quality Settings:**
- **Low:** No glow, reduced particles, 30 FPS
- **Medium:** Moderate glow, standard particles, 60 FPS
- **High:** Full effects, 60 FPS

---

**Version:** 1.0  
**Last Updated:** 2025-11-01  
**Status:** ✅ Approved for development
