# Technical Design Document (TDD)
**Geo Gala: Vector Offensive**

---

## 1. Architecture Overview

**Tech Stack:**
- **Frontend:** Vanilla HTML5 + CSS3 + ES2020 JavaScript (modules)
- **Rendering:** Canvas 2D API with DPR scaling
- **Build Tool:** Vite (dev server + production build)
- **Audio:** Web Audio API
- **Storage:** LocalStorage (settings, high scores)
- **Deployment:** Static hosting (Netlify, Vercel, GitHub Pages)

**Architecture Pattern:** Entity-Component-System (ECS) lite
- Entities: Player, enemies, projectiles, pickups
- Components: Position, velocity, hitbox, sprite
- Systems: Movement, collision, rendering, input

---

## 2. Project Structure

```
/
├── index.html              # Entry point
├── src/
│   ├── main.js             # App bootstrap
│   ├── game.js             # Core game loop
│   ├── renderer.js         # Canvas rendering
│   ├── input.js            # Input abstraction layer
│   ├── audio.js            # Sound manager
│   ├── entities/
│   │   ├── Player.js
│   │   ├── Enemy.js
│   │   ├── Projectile.js
│   │   └── Pickup.js
│   ├── systems/
│   │   ├── MovementSystem.js
│   │   ├── CollisionSystem.js
│   │   ├── SpawnSystem.js
│   │   └── HeatSystem.js
│   ├── ui/
│   │   ├── HUD.js
│   │   ├── Menu.js
│   │   └── Overlay.js
│   ├── data/
│   │   ├── waves.js        # Wave definitions
│   │   ├── factions.js     # Enemy configs
│   │   └── weapons.js      # Weapon data
│   └── utils/
│       ├── math.js         # Vector ops, collision
│       ├── pool.js         # Object pooling
│       └── storage.js      # LocalStorage wrapper
├── assets/
│   ├── audio/              # MP3/OGG files
│   └── fonts/              # Web fonts (if any)
├── styles/
│   ├── tokens.css          # Design system variables
│   ├── main.css            # Global styles
│   └── hud.css             # HUD-specific styles
├── docs/                   # Documentation
├── tests/                  # Unit/integration tests (Phase 2)
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## 3. Core Systems

### 3.1 Game Loop (game.js)

```javascript
class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = 'menu'; // menu | playing | paused | gameover
    this.entities = [];
    this.systems = [];
    this.lastTime = 0;
    this.accumulator = 0;
    this.fixedDelta = 1000 / 60; // 60 FPS target
  }

  init() {
    this.setupCanvas();
    this.loadSystems();
    this.bindInput();
    requestAnimationFrame(this.loop.bind(this));
  }

  loop(currentTime) {
    const delta = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulator += delta;

    // Fixed timestep updates
    while (this.accumulator >= this.fixedDelta) {
      this.update(this.fixedDelta);
      this.accumulator -= this.fixedDelta;
    }

    this.render();
    requestAnimationFrame(this.loop.bind(this));
  }

  update(dt) {
    if (this.state !== 'playing') return;
    this.systems.forEach(sys => sys.update(this.entities, dt));
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    Renderer.draw(this.ctx, this.entities, this.state);
  }
}
```

**Frame Budget:** 16.67ms (60 FPS)
- Update: 6ms max
- Render: 8ms max
- Idle: 2.67ms buffer

---

### 3.2 Rendering System (renderer.js)

**Canvas Setup:**
```javascript
function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  
  // Set canvas CSS size
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  
  return ctx;
}
```

**Rendering Order (Painter's Algorithm):**
1. Background grid (static, drawn once per frame)
2. Pickups (lowest layer)
3. Enemy projectiles
4. Enemies
5. Player projectiles
6. Player ship
7. Explosions/particles (VFX)
8. HUD overlay

**Optimization:**
- **Object Pooling:** Reuse particle/projectile instances
- **Culling:** Skip off-screen entities
- **Dirty Rectangles:** Only redraw changed regions (Phase 2)
- **OffscreenCanvas:** Pre-render complex shapes (Phase 2)

---

### 3.3 Input System (input.js)

**Abstraction Layer:**
```javascript
class InputManager {
  constructor() {
    this.keys = new Set();
    this.touch = { x: 0, y: 0, active: false };
    this.gamepad = null;
  }

  update() {
    // Poll gamepad state
    const gamepads = navigator.getGamepads();
    this.gamepad = gamepads[0] || null;
  }

  getMovement() {
    let x = 0, y = 0;

    // Keyboard
    if (this.keys.has('ArrowLeft') || this.keys.has('KeyA')) x -= 1;
    if (this.keys.has('ArrowRight') || this.keys.has('KeyD')) x += 1;
    if (this.keys.has('ArrowUp') || this.keys.has('KeyW')) y -= 1;
    if (this.keys.has('ArrowDown') || this.keys.has('KeyS')) y += 1;

    // Touch (virtual joystick)
    if (this.touch.active) {
      x = this.touch.x;
      y = this.touch.y;
    }

    // Gamepad
    if (this.gamepad) {
      x = this.gamepad.axes[0];
      y = this.gamepad.axes[1];
    }

    // Normalize diagonal movement
    const magnitude = Math.sqrt(x * x + y * y);
    if (magnitude > 1) {
      x /= magnitude;
      y /= magnitude;
    }

    return { x, y };
  }

  isFiring() {
    return this.keys.has('Space') || this.touch.active || 
           (this.gamepad && this.gamepad.buttons[7].pressed);
  }
}
```

**Touch Controls:**
- Virtual joystick (left 40% of canvas)
- Touch starts create joystick origin
- Drag distance/angle maps to movement vector
- Release resets to center

---

### 3.4 Collision Detection (systems/CollisionSystem.js)

**Broad Phase:** Spatial hash grid (256px cells)
```javascript
class SpatialHash {
  constructor(cellSize = 256) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  insert(entity) {
    const cell = this.getCell(entity.x, entity.y);
    if (!this.grid.has(cell)) this.grid.set(cell, []);
    this.grid.get(cell).push(entity);
  }

  query(x, y, radius) {
    const cells = this.getCellsInRadius(x, y, radius);
    return cells.flatMap(cell => this.grid.get(cell) || []);
  }
}
```

**Narrow Phase:** Circle-circle collision
```javascript
function checkCollision(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distSq = dx * dx + dy * dy;
  const radSum = a.radius + b.radius;
  return distSq < radSum * radSum;
}
```

**Collision Pairs:**
- Player ↔ Enemy projectiles
- Player ↔ Enemies (contact damage)
- Player projectiles ↔ Enemies
- Player ↔ Pickups

---

### 3.5 Entity Management (pool.js)

**Object Pool Pattern:**
```javascript
class EntityPool {
  constructor(factory, initialSize = 100) {
    this.factory = factory;
    this.available = [];
    this.active = [];
    
    for (let i = 0; i < initialSize; i++) {
      this.available.push(factory());
    }
  }

  acquire(...args) {
    const entity = this.available.pop() || this.factory();
    entity.reset(...args);
    this.active.push(entity);
    return entity;
  }

  release(entity) {
    const idx = this.active.indexOf(entity);
    if (idx > -1) {
      this.active.splice(idx, 1);
      this.available.push(entity);
    }
  }
}

// Usage
const projectilePool = new EntityPool(() => new Projectile(), 200);
const bullet = projectilePool.acquire(x, y, vx, vy);
```

---

### 3.6 Audio System (audio.js)

**Web Audio Architecture:**
```javascript
class AudioManager {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.sounds = new Map();
    this.musicNode = null;
    this.sfxVolume = 0.7;
    this.musicVolume = 0.5;
  }

  async load(name, url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
    this.sounds.set(name, audioBuffer);
  }

  play(name, volume = 1.0) {
    const buffer = this.sounds.get(name);
    if (!buffer) return;

    const source = this.ctx.createBufferSource();
    const gainNode = this.ctx.createGain();
    
    source.buffer = buffer;
    gainNode.gain.value = volume * this.sfxVolume;
    
    source.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    source.start(0);
  }
}
```

**Audio Budget:**
- Max simultaneous sounds: 32
- Prioritize critical SFX (player damage, wave clear)
- Compress to MP3 (44.1kHz, 128kbps)

---

## 4. Data Structures

### 4.1 Wave Definition Format (data/waves.js)

```javascript
export const waves = [
  {
    id: 1,
    faction: 'order',
    formation: 'wedge',
    enemies: [
      { type: 'scout', count: 8, hp: 1 }
    ],
    spawnDelay: 0.1, // seconds between spawns
    music: 'order_theme_1'
  },
  {
    id: 2,
    faction: 'chaos',
    formation: 'grid',
    enemies: [
      { type: 'shard', count: 12, hp: 2 }
    ],
    spawnDelay: 0.15,
    music: 'chaos_theme_1'
  }
  // ... up to wave 30
];
```

### 4.2 Entity Schema

```javascript
class Entity {
  constructor() {
    this.id = generateUUID();
    this.type = ''; // 'player' | 'enemy' | 'projectile' | 'pickup'
    this.active = true;
    
    // Transform
    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.scale = 1;
    
    // Physics
    this.vx = 0;
    this.vy = 0;
    this.radius = 10;
    
    // Gameplay
    this.hp = 1;
    this.damage = 1;
    this.team = 0; // 0 = player, 1 = enemy
    
    // Rendering
    this.color = '#00FFFF';
    this.shape = 'triangle';
    this.glow = 0; // 0-1 intensity
  }
}
```

---

## 5. Performance Budgets

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| **Frame Time** | 16.67ms | 20ms |
| **Entity Count** | 200 max | 300 max |
| **Draw Calls** | <500 | <1000 |
| **Memory (Heap)** | <100 MB | <150 MB |
| **JS Bundle Size** | <200 KB (gzipped) | <300 KB |
| **Asset Load** | <2s on 4G | <5s |

**Monitoring:**
```javascript
// Performance tracking
const perfMonitor = {
  frameStart: 0,
  frameTimes: [],
  
  begin() {
    this.frameStart = performance.now();
  },
  
  end() {
    const frameTime = performance.now() - this.frameStart;
    this.frameTimes.push(frameTime);
    if (this.frameTimes.length > 60) this.frameTimes.shift();
    
    const avg = this.frameTimes.reduce((a, b) => a + b) / this.frameTimes.length;
    if (avg > 20) console.warn(`Frame budget exceeded: ${avg.toFixed(2)}ms`);
  }
};
```

---

## 6. Save Data Schema

**LocalStorage Keys:**
```javascript
{
  'geogala:settings': {
    sfxVolume: 0.7,
    musicVolume: 0.5,
    difficulty: 'normal',
    controls: 'keyboard', // keyboard | touch | gamepad
    reducedMotion: false
  },
  'geogala:progress': {
    highScore: 0,
    lastWave: 1,
    unlockedCores: ['pulse_cannon'],
    unlockedNodes: [],
    totalShards: 0
  },
  'geogala:stats': {
    totalPlaytime: 0,
    totalKills: 0,
    totalDeaths: 0,
    wavesCleared: 0
  }
}
```

---

## 7. Rendering Primitives

**Geometric Shapes (Canvas 2D):**
```javascript
function drawTriangle(ctx, x, y, size, rotation, color, glow) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  
  // Glow effect
  if (glow > 0) {
    ctx.shadowBlur = 20 * glow;
    ctx.shadowColor = color;
  }
  
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(-size * 0.866, size * 0.5);
  ctx.lineTo(size * 0.866, size * 0.5);
  ctx.closePath();
  ctx.stroke();
  
  ctx.restore();
}

function drawHexagon(ctx, x, y, size, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const px = x + size * Math.cos(angle);
    const py = y + size * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
}
```

---

## 8. Build & Deployment

**Vite Configuration (vite.config.js):**
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Relative paths for GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
```

**Deployment Targets:**
- **GitHub Pages:** `npm run build` → push `/dist` to `gh-pages` branch
- **Netlify:** Auto-deploy from `main` branch
- **Vercel:** Zero-config detection

---

## 9. Testing Strategy (Phase 2)

**Unit Tests (Vitest):**
- Collision detection accuracy
- Object pool management
- Math utilities (vector ops, lerp)

**Integration Tests:**
- Wave spawn sequences
- Damage calculation
- Score computation

**Manual QA:**
- 60 FPS on target devices (iPhone 12, Pixel 5, desktop)
- Touch controls responsiveness
- Audio sync (visual feedback matches SFX timing)

---

## 10. Security & Constraints

**Allowed Operations:**
- Read/write LocalStorage (scoped to domain)
- Fetch audio assets (same-origin)
- Canvas 2D rendering
- Web Audio API

**Forbidden:**
- No eval() or Function() constructor
- No external scripts (inline only via Vite bundling)
- No access to camera/microphone/geolocation
- No network requests post-load (offline-capable)

**Content Security Policy (CSP):**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';">
```

---

## 11. Browser Compatibility

**Polyfills Required:**
- None (target ES2020+ browsers)

**Fallbacks:**
- Web Audio: Silent mode if AudioContext unavailable
- GamepadAPI: Keyboard-only if unsupported
- DPR scaling: Default to 1 if `devicePixelRatio` missing

**Testing Matrix:**
| Browser | Version | Platform | Priority |
|---------|---------|----------|----------|
| Chrome | 90+ | Desktop/Mobile | P0 |
| Firefox | 88+ | Desktop/Mobile | P0 |
| Safari | 14+ | iOS | P0 |
| Edge | 90+ | Desktop | P1 |

---

**Version:** 1.0  
**Last Updated:** 2025-11-01  
**Status:** ✅ Approved for development
