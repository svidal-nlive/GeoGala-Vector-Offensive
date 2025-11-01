# GeoGala: Vector Offensive — Technical Architecture

## 1. High-Level Systems

```plaintext
┌─────────────────────────────────────────────────────────────┐
│                    Application Entry                        │
│                  (index.html → main.js)                     │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┬────────────┐
         ▼           ▼           ▼            ▼
    ┌─────────┐ ┌─────────┐ ┌────────┐ ┌─────────┐
    │  Game   │ │  Input  │ │ Audio  │ │Renderer │
    │ State   │ │ Handler │ │Manager │ │(Canvas) │
    │ Manager │ │         │ │        │ │         │
    └────┬────┘ └────┬────┘ └───┬────┘ └────┬────┘
         │           │           │           │
         └───────────┼───────────┼───────────┘
                     │           │
          ┌──────────┴───┬───────┴──────────┐
          ▼              ▼                   ▼
      ┌─────────┐  ┌──────────┐        ┌─────────┐
      │ Entity  │  │ Collision│        │  Wave   │
      │ Manager │  │ Detector │        │Generator│
      │ (Shapes)│  │ (Spatial)│        │         │
      └─────────┘  └──────────┘        └─────────┘
```

### 1.1 Core Modules

| Module | Purpose | Key Responsibilities |
| --- | --- | --- |
| **Game State** | Persistence & wave logic | Wave counter, resources (Credits/Alloy), run state, upgrades |
| **Input Handler** | Player control normalization | Keyboard, pointer/touch, gamepad → unified input vector |
| **Renderer** | Canvas 2D output | DPR scaling, shape drawing, HUD, effects |
| **Audio Manager** | Web Audio API wrapper | Music loops, SFX playback, volume mixing, mute |
| **Entity Manager** | Shape lifecycle | Spawn, update, collision, removal |
| **Collision Detector** | Spatial queries | Bullet-vs-shape, shape-vs-player, pickup detection |
| **Wave Generator** | Formation AI | Pattern selection, enemy spawn timing, behavior trees |

---

## 2. Canvas & DPR Scaling

### 2.1 Setup Strategy

**Goal:** Support any device (1x to 3x+ DPR) with crisp rendering and smooth 60 FPS.

```javascript
// Pseudo-code pattern
const dpr = window.devicePixelRatio || 1;
const baseWidth = 800;
const baseHeight = 600;

canvas.width = baseWidth * dpr;
canvas.height = baseHeight * dpr;
canvas.style.width = baseWidth + 'px';
canvas.style.height = baseHeight + 'px';

ctx.scale(dpr, dpr);
// Draw commands use logical pixels (800x600)
// Actual canvas is (1600x1200) for 2x dpr
```

### 2.2 Rendering Pipeline

1. **Clear:** `ctx.fillStyle = '#000'; ctx.fillRect(0, 0, width, height);`
2. **Draw Layers (in order):**
   - Background (solid black or subtle grid)
   - Enemy shapes (filled + stroked)
   - Bullets (player + enemy)
   - Pickups (small glowing circles)
   - Player ship
   - UI / HUD overlay (text, bars, panel)
   - Effects (impacts, flashes)
3. **Composite:** All layers drawn to single canvas; no off-screen buffers needed for 60 FPS

### 2.3 Performance Budget

- **Target:** 60 FPS = 16.67 ms per frame
- **Allocation:**
  - Render: ≤ 12 ms (shape + bullet drawing, HUD text)
  - Update: ≤ 3 ms (movement, collision queries, wave logic)
  - Audio: ≤ 2 ms (playback, mixing, gain updates)
  - **Reserve:** 1.67 ms (GC, jank buffer)

---

## 3. Game Loop

```javascript
// Main loop (RAF / setInterval at 60 FPS)
function gameLoop(timestamp) {
  // Input: read from normalized input state
  input.update();

  // Update: move entities, check collisions, update state
  update(deltaTime);
  
  // Render: draw to canvas
  render();
  
  // Audio: sync playback if needed
  audioManager.update();
  
  requestAnimationFrame(gameLoop);
}
```

### 3.1 Update Phase

1. **Player Movement:** Read normalized input vector, move player within bounds
2. **Player Firing:** Check fire button state, spawn bullets on fire timer
3. **Entity Update:**
   - Move each shape according to AI/behavior
   - Move each bullet, check out-of-bounds
4. **Collision Detection:**
   - Player vs. enemy shapes (damage player)
   - Player bullets vs. enemy shapes (damage enemy, spawn pickup)
   - Player vs. pickups (apply upgrade)
   - Enemy bullets vs. player (damage player)
5. **Wave Progression:**
   - Count remaining enemies; if 0, trigger wave-complete
   - Spawn next wave formation if all clear
6. **Audio Triggers:**
   - Fire SFX queued from input
   - Impact SFX queued from collisions
   - Victory / defeat music cues

### 3.2 Render Phase

1. **Clear canvas** with black background
2. **Draw enemies:** iterate entity list, call `enemy.draw(ctx)`
3. **Draw bullets:** iterate bullets, call `bullet.draw(ctx)`
4. **Draw pickups:** iterate pickups, call `pickup.draw(ctx)` with glow
5. **Draw player:** call `player.draw(ctx)` with neon edge effect
6. **Draw HUD:**
   - Wave counter, boss health bar (if active)
   - Player hull / shield bars
   - Credits + Alloy balance
   - Current weapon mod indicator
   - Cooldown rings for Aux abilities
7. **Draw UI Panels:** upgrade panel or pause screen (if active)

---

## 4. Entity System (Object Model)

### 4.1 Entity Base Class (Pseudo-Code)

```javascript
class Entity {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // 'triangle', 'square', 'hex', 'diamond', 'bullet', 'pickup'
    this.vx = 0;
    this.vy = 0;
    this.hp = 1;
    this.alive = true;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    // Subclasses override for AI behavior
  }

  draw(ctx) {
    // Subclasses implement shape-specific rendering
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.alive = false;
      this.onDeath();
    }
  }

  onDeath() {
    // Subclasses override
  }
}
```

### 4.2 Player Ship

```javascript
class Player extends Entity {
  constructor() {
    super(400, 550, 'player');
    this.frame = 0; // 0='Dart', 1='Trident', etc.
    this.fireRate = 0.1; // seconds
    this.fireCooldown = 0;
    this.maxHp = 3;
    this.hp = 3;
    this.shield = 0;
    this.primaryWeapon = 'LinearBolt'; // weapon line
    this.modifier = 'Plasma'; // element
    this.auxAbility = null; // null or ability name
  }

  update(dt) {
    // Move based on input vector
    const input = inputHandler.getVector(); // [-1,0,1]x[-1,0,1]
    this.x += input.x * 6 * dt;
    this.y += input.y * 6 * dt;
    
    // Clamp to screen bounds
    this.x = Math.max(10, Math.min(790, this.x));
    this.y = Math.max(100, Math.min(590, this.y));

    // Update fire cooldown
    this.fireCooldown -= dt;

    // Fire on input
    if (inputHandler.firing() && this.fireCooldown <= 0) {
      this.fire();
      this.fireCooldown = this.fireRate;
    }
  }

  fire() {
    // Spawn bullet(s) based on weapon config
    const bullet = new Bullet(this.x, this.y, 'player', this.primaryWeapon);
    entityManager.add(bullet);
    audioManager.play('fire'); // SFX
  }

  draw(ctx) {
    // Draw triangle with neon edge
    ctx.fillStyle = '#00ffff';
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - 15);
    ctx.lineTo(this.x - 12, this.y + 12);
    ctx.lineTo(this.x + 12, this.y + 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw shield ring if active
    if (this.shield > 0) {
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}
```

### 4.3 Enemy Shapes

Similar hierarchy (Triangle extends Enemy, Square extends Enemy, etc.)

**Common Enemy Base:**

```javascript
class Enemy extends Entity {
  constructor(x, y, type, hp) {
    super(x, y, type);
    this.hp = hp;
    this.maxHp = hp;
    this.behavior = 'idle'; // 'idle', 'attack', 'flee'
    this.behaviorTimer = 0;
  }

  update(dt) {
    this.behaviorTimer -= dt;

    // Behavior state machine
    switch (this.behavior) {
      case 'idle':
        // Hold formation position
        break;
      case 'attack':
        // Dive toward player or shoot
        this.executeAttack(dt);
        break;
      case 'flee':
        // Return to formation
        this.vy = -4; // move upward
        break;
    }

    // Update position
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Check out-of-bounds
    if (this.y > 620) this.alive = false;
  }

  executeAttack(dt) {
    // Subclasses override
  }

  onDeath() {
    // Spawn pickup with probability
    if (Math.random() < 0.15) {
      const pickup = new Pickup(this.x, this.y, 'credit');
      entityManager.add(pickup);
    }

    // Queue SFX
    audioManager.play('impact');

    // Add to score/credits
    gameState.credits += 2;
  }
}
```

---

## 5. Input Normalization

### 5.1 Supported Input Methods

| Input Type | Capture | Normalization |
| --- | --- | --- |
| **Keyboard** | `keydown` / `keyup` | Arrows/WASD → x/y vector [-1, 0, 1] |
| **Pointer/Touch** | `mousemove` / `touchmove` | Mouse delta or touch point → aim vector |
| **Gamepad** | `gamepadconnected` + RAF polling | Left analog stick → x/y vector + normalized |

### 5.2 Input Handler State

```javascript
class InputHandler {
  constructor() {
    this.keys = {}; // 'ArrowUp', 'KeyW', etc.
    this.pointer = { x: 400, y: 300 }; // Last mouse/touch position
    this.gamepad = null;
    this.fireButton = false;
    this.auxButton = false;
    this.focusMode = false;
  }

  getVector() {
    // Keyboard priority
    if (this.keys['ArrowUp'] || this.keys['KeyW']) return { x: 0, y: -1 };
    if (this.keys['ArrowDown'] || this.keys['KeyS']) return { x: 0, y: 1 };
    // ... (combine for diagonals)

    // Gamepad secondary
    if (this.gamepad) {
      const stick = this.gamepad.axes;
      const x = Math.abs(stick[0]) > 0.1 ? stick[0] : 0;
      const y = Math.abs(stick[1]) > 0.1 ? stick[1] : 0;
      return { x, y };
    }

    // Pointer aim (desktop)
    const player = gameState.player;
    const dx = this.pointer.x - player.x;
    const dy = this.pointer.y - player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return { x: dx / dist, y: dy / dist };
  }

  firing() {
    return this.fireButton || (this.gamepad && this.gamepad.buttons[7].pressed); // RT
  }
}
```

---

## 6. Audio Management

### 6.1 Web Audio API Setup

```javascript
class AudioManager {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.musicGain = this.ctx.createGain();
    this.sfxGain = this.ctx.createGain();
    
    this.musicGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    
    this.musicBuffers = {}; // Loaded audio buffers
    this.sfxBuffers = {};
    this.muted = false;
  }

  async loadBuffer(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return this.ctx.decodeAudioData(arrayBuffer);
  }

  play(name, isMusic = false) {
    const buffer = isMusic ? this.musicBuffers[name] : this.sfxBuffers[name];
    if (!buffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(isMusic ? this.musicGain : this.sfxGain);

    if (isMusic) {
      source.loop = true;
      source.loopStart = buffer.metadata?.loopStart || 0;
      source.loopEnd = buffer.metadata?.loopEnd || buffer.duration;
    }

    source.start();
    return source;
  }

  setMasterVolume(level) {
    this.masterGain.gain.setValueAtTime(level, this.ctx.currentTime);
  }

  toggle() {
    this.muted = !this.muted;
    this.masterGain.gain.setValueAtTime(this.muted ? 0 : 1, this.ctx.currentTime);
  }
}
```

### 6.2 Music & SFX Structure

| Asset | Context | Trigger |
| --- | --- | --- |
| **Menu Loop** | 2–3 min, synth, ambient | Main screen (persistent) |
| **Arcade Loop** | 2–3 min, uptempo synth | Wave active (loops until boss) |
| **Boss Phase 1** | Dramatic, builds tension | Boss spawn |
| **Boss Phase 2–3** | Faster, urgent | Phase transition |
| **Victory** | 8–10 sec stinger | Wave clear |
| **Defeat** | 3–5 sec stinger | Player death |
| **Fire SFX** | 50–100 ms pop/beep | Every bullet (pitch varies by weapon) |
| **Impact SFX** | 100–150 ms zap/crackle | Bullet hits enemy |
| **Pickup** | 200 ms rising tone | Pickup collected |
| **UI Confirm** | 100 ms chime | Button press |

---

## 7. Collision Detection

### 7.1 AABB (Axis-Aligned Bounding Box) Strategy

For performance, use simple rectangular bounds for broad-phase collision:

```javascript
class AABB {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  intersects(other) {
    return this.x < other.x + other.w &&
           this.x + this.w > other.x &&
           this.y < other.y + other.h &&
           this.y + this.h > other.y;
  }
}
```

### 7.2 Collision Resolution

```javascript
class CollisionDetector {
  update(playerEntity, enemies, bullets, pickups) {
    // Player vs. Enemy bullets
    for (const enemy of enemies) {
      for (const bullet of enemy.bullets) {
        if (playerEntity.aabb.intersects(bullet.aabb)) {
          playerEntity.takeDamage(1);
          bullet.alive = false;
          audioManager.play('hurt');
        }
      }
    }

    // Player bullets vs. Enemy shapes
    for (const bullet of playerEntity.bullets) {
      for (const enemy of enemies) {
        if (bullet.aabb.intersects(enemy.aabb)) {
          enemy.takeDamage(1);
          bullet.alive = false;
          // Check for pickup spawn
          audioManager.play('impact');
        }
      }
    }

    // Player vs. Pickups
    for (const pickup of pickups) {
      if (playerEntity.aabb.intersects(pickup.aabb)) {
        gameState.applyUpgrade(pickup.type);
        pickup.alive = false;
        audioManager.play('pickup');
      }
    }
  }
}
```

---

## 8. Wave Generation & AI

### 8.1 Wave Patterns (Formation Selection)

```javascript
class WaveGenerator {
  selectPattern(waveNumber) {
    const difficulty = Math.floor(waveNumber / 10);
    
    if (waveNumber % 10 === 0) {
      return this.generateBoss(difficulty);
    }

    const patterns = [
      'StandardEntrance',
      'Spearhead',
      'ColumnCollapse',
      'OrbitGuard',
      'CaptureVariant',
    ];
    
    const patternIndex = (waveNumber - 1) % patterns.length;
    return this.buildFormation(patterns[patternIndex], difficulty);
  }

  buildFormation(patternName, difficulty) {
    const enemies = [];
    const baseEnemyCount = 8 + difficulty * 2;

    switch (patternName) {
      case 'StandardEntrance':
        // 3 groups of triangles + 2 groups of squares, spiraled entry
        enemies.push(...this.spawnTriangles(baseEnemyCount * 0.6));
        enemies.push(...this.spawnSquares(baseEnemyCount * 0.4));
        break;
      
      case 'Spearhead':
        // Mostly triangles in arrow formation
        enemies.push(...this.spawnTriangles(baseEnemyCount * 0.8));
        enemies.push(...this.spawnDiamonds(2 + difficulty));
        break;

      // ... more cases
    }

    return { enemies, startTime: 0 };
  }

  spawnTriangles(count) {
    const enemies = [];
    for (let i = 0; i < count; i++) {
      enemies.push(new Triangle(
        100 + (i % 5) * 100,
        -50 - Math.floor(i / 5) * 80,
        'Triangle'
      ));
    }
    return enemies;
  }
}
```

### 8.2 Behavior Trees (Enemy AI)

```javascript
class BehaviorTree {
  // Triangle: fast dive
  static triangleAttack(enemy, target) {
    const speed = 8;
    const dx = target.x - enemy.x;
    const dy = target.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 50) {
      // Fire at player
      enemy.fire();
    } else {
      // Move toward
      enemy.vx = (dx / dist) * speed;
      enemy.vy = (dy / dist) * speed;
    }
  }

  // Square: hold wall, block fire
  static squareDefense(enemy, allies) {
    // Position in front of nearest ally or hold column
    enemy.vy = 1; // Slow descent
    // Check if friend is nearby; if so, move to shield
  }

  // Diamond: orbit friendlies, buff
  static diamondSupport(enemy, allies) {
    // Find nearby ally, orbit at distance 40
    // Every 1 sec, apply +10% fire rate aura
  }
}
```

---

## 9. Mobile & Gamepad UX

### 9.1 Safe-Area Handling

```javascript
// CSS in index.html
body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: max(0px, env(safe-area-inset-top))
           max(0px, env(safe-area-inset-right))
           max(0px, env(safe-area-inset-bottom))
           max(0px, env(safe-area-inset-left));
  background: #000;
}

canvas {
  display: block;
  max-width: 100vw;
  max-height: 100vh;
  background: #000;
}
```

### 9.2 Touch Aim (Mobile)

On mobile, pointer position follows touch: player aims toward touched point.

```javascript
document.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  inputHandler.pointer.x = touch.clientX;
  inputHandler.pointer.y = touch.clientY;
  e.preventDefault(); // Prevent scroll
});

document.addEventListener('touchstart', (e) => {
  inputHandler.fireButton = true;
});

document.addEventListener('touchend', (e) => {
  inputHandler.fireButton = false;
});
```

### 9.3 Gamepad Mapping

| Gamepad Input | Action |
| --- | --- |
| Left Analog Stick | Move |
| Right Trigger (RT) | Fire |
| Button A / X | Fire (alternate) |
| Button Y | Aux ability |
| Button Menu | Pause |

---

## 10. Performance Optimization

### 10.1 Entity Pooling

For bullets (thousands per run), use object pooling to avoid GC stalls:

```javascript
class BulletPool {
  constructor(size = 500) {
    this.bullets = Array.from({ length: size }, () => new Bullet());
    this.index = 0;
  }

  get() {
    const bullet = this.bullets[this.index % this.bullets.length];
    this.index++;
    return bullet;
  }

  reset(bullet) {
    bullet.alive = false;
    bullet.x = 0;
    bullet.y = 0;
  }
}
```

### 10.2 Spatial Partitioning (Future)

For wave 20+, if collision queries slow down, implement grid-based broad-phase:

```javascript
class SpatialGrid {
  constructor(cellSize = 100) {
    this.cellSize = cellSize;
    this.grid = {};
  }

  add(entity) {
    const cellKey = this.getCellKey(entity.x, entity.y);
    if (!this.grid[cellKey]) this.grid[cellKey] = [];
    this.grid[cellKey].push(entity);
  }

  getNearby(entity, radius = 100) {
    const cellKey = this.getCellKey(entity.x, entity.y);
    return this.grid[cellKey] || [];
  }
}
```

---

## 11. Cross-References

- **Game Design:** See [01-Game-Design-Document.md](01-Game-Design-Document.md) for gameplay mechanics
- **Visual Rendering:** See [03-Visual-Style-Guide.md](03-Visual-Style-Guide.md) for shape specs & colors
- **Audio API:** See [04-Audio-Strategy.md](04-Audio-Strategy.md) for sound design
- **Input Handling:** See [05-Input-Spec.md](05-Input-Spec.md) for detailed input mapping
- **Performance:** See [Testing.md](Testing.md) for FPS budget validation & profiling
