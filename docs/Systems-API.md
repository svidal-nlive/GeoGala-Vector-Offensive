# Systems API Reference
**Geo Gala: Vector Offensive**

---

## 1. Overview

This document defines the API contracts for all game systems. Each system operates on entities through well-defined interfaces.

---

## 2. System Base Class

```javascript
class System {
  constructor(name) {
    this.name = name;
    this.enabled = true;
  }
  
  /**
   * Update system logic
   * @param {Entity[]} entities - All active entities
   * @param {number} dt - Delta time in milliseconds
   */
  update(entities, dt) {
    throw new Error('System.update() must be implemented');
  }
  
  /**
   * Enable/disable system
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }
}
```

---

## 3. Movement System

**Purpose:** Update entity positions based on velocity

```javascript
class MovementSystem extends System {
  constructor() {
    super('Movement');
  }
  
  update(entities, dt) {
    entities.forEach(entity => {
      if (!entity.vx && !entity.vy) return;
      
      entity.x += entity.vx * (dt / 1000);
      entity.y += entity.vy * (dt / 1000);
      
      // Boundary handling (player only)
      if (entity.type === 'player') {
        entity.x = Math.max(entity.radius, Math.min(canvasWidth - entity.radius, entity.x));
        entity.y = Math.max(entity.radius, Math.min(canvasHeight - entity.radius, entity.y));
      }
    });
  }
}
```

**Required Entity Properties:**
- `x: number` — X position
- `y: number` — Y position
- `vx: number` — X velocity (px/s)
- `vy: number` — Y velocity (px/s)
- `type: string` — Entity type
- `radius: number` — For boundary clamping

---

## 4. Collision System

**Purpose:** Detect and resolve entity collisions

```javascript
class CollisionSystem extends System {
  constructor() {
    super('Collision');
    this.grid = new SpatialHashGrid(256);
  }
  
  update(entities, dt) {
    // Clear and rebuild spatial grid
    this.grid.clear();
    entities.forEach(e => this.grid.insert(e));
    
    // Check collisions
    entities.forEach(entity => {
      if (!entity.active || !entity.collides) return;
      
      const nearby = this.grid.query(entity.x, entity.y, entity.radius * 2);
      
      nearby.forEach(other => {
        if (entity === other || entity.team === other.team) return;
        
        if (this.checkCollision(entity, other)) {
          this.resolveCollision(entity, other);
        }
      });
    });
  }
  
  checkCollision(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const distSq = dx * dx + dy * dy;
    const radSum = a.radius + b.radius;
    return distSq < radSum * radSum;
  }
  
  resolveCollision(a, b) {
    // Apply damage
    if (a.damage) b.hp -= a.damage;
    if (b.damage) a.hp -= b.damage;
    
    // Emit events
    EventBus.emit('collision', { a, b });
    
    // Mark projectiles for removal
    if (a.type === 'projectile') a.active = false;
    if (b.type === 'projectile') b.active = false;
  }
}
```

**Required Entity Properties:**
- `x, y: number` — Position
- `radius: number` — Collision radius
- `team: number` — Team ID (0 = player, 1 = enemy)
- `hp: number` — Health points
- `damage: number` — Damage dealt on collision
- `collides: boolean` — Whether entity participates in collision
- `active: boolean` — Entity state

---

## 5. Spawn System

**Purpose:** Create entities from wave definitions

```javascript
class SpawnSystem extends System {
  constructor(waveData) {
    super('Spawn');
    this.waveData = waveData;
    this.currentWave = 0;
    this.spawnQueue = [];
    this.spawnTimer = 0;
  }
  
  startWave(waveIndex) {
    this.currentWave = waveIndex;
    const waveConfig = this.waveData[waveIndex];
    
    // Build spawn queue
    this.spawnQueue = [];
    waveConfig.enemies.forEach(enemyDef => {
      for (let i = 0; i < enemyDef.count; i++) {
        this.spawnQueue.push({
          type: enemyDef.type,
          hp: enemyDef.hp,
          delay: i * waveConfig.spawnDelay
        });
      }
    });
    
    this.spawnTimer = 0;
  }
  
  update(entities, dt) {
    if (this.spawnQueue.length === 0) return;
    
    this.spawnTimer += dt / 1000;
    
    while (this.spawnQueue.length > 0 && 
           this.spawnQueue[0].delay <= this.spawnTimer) {
      const spawn = this.spawnQueue.shift();
      this.createEnemy(spawn.type, spawn.hp);
    }
  }
  
  createEnemy(type, hp) {
    const enemy = EntityManager.create('enemy');
    enemy.variant = type;
    enemy.hp = hp;
    enemy.x = Math.random() * canvasWidth;
    enemy.y = -50; // Above screen
    
    EventBus.emit('enemy:spawned', enemy);
  }
}
```

**Wave Config Schema:**
```javascript
{
  id: number,
  faction: string,
  formation: string,
  enemies: [
    { type: string, count: number, hp: number }
  ],
  spawnDelay: number
}
```

---

## 6. Heat System

**Purpose:** Manage weapon heat mechanics

```javascript
class HeatSystem extends System {
  constructor() {
    super('Heat');
  }
  
  update(entities, dt) {
    entities.forEach(entity => {
      if (entity.type !== 'player') return;
      
      // Heat dissipation
      if (entity.heat > 0 && !entity.firing) {
        entity.heat = Math.max(0, entity.heat - (15 * dt / 1000));
      }
      
      // Overheat check
      if (entity.heat >= 100) {
        entity.overheated = true;
        entity.overheatTimer = 2000; // 2 second cooldown
        EventBus.emit('weapon:overheat', entity);
      }
      
      // Cooldown timer
      if (entity.overheated) {
        entity.overheatTimer -= dt;
        if (entity.overheatTimer <= 0) {
          entity.overheated = false;
          entity.heat = 0;
          EventBus.emit('weapon:cooled', entity);
        }
      }
    });
  }
  
  addHeat(entity, amount) {
    if (entity.overheated) return false;
    entity.heat = Math.min(100, entity.heat + amount);
    return true;
  }
}
```

**Required Player Properties:**
- `heat: number` — Current heat (0-100)
- `overheated: boolean` — Overheat state
- `overheatTimer: number` — Cooldown timer (ms)
- `firing: boolean` — Is weapon firing

---

## 7. AI System

**Purpose:** Control enemy behavior

```javascript
class AISystem extends System {
  constructor() {
    super('AI');
  }
  
  update(entities, dt) {
    entities.forEach(enemy => {
      if (enemy.type !== 'enemy') return;
      
      switch (enemy.state) {
        case 'formation':
          this.moveToFormation(enemy, dt);
          break;
        case 'dive':
          this.diveAttack(enemy, dt);
          break;
        case 'retreat':
          this.retreat(enemy, dt);
          break;
      }
      
      // Attack logic
      enemy.attackCooldown -= dt / 1000;
      if (enemy.attackCooldown <= 0 && enemy.state !== 'formation') {
        this.fireProjectile(enemy);
        enemy.attackCooldown = 2; // Reset cooldown
      }
    });
  }
  
  moveToFormation(enemy, dt) {
    const dx = enemy.targetX - enemy.x;
    const dy = enemy.targetY - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 5) {
      enemy.state = 'idle';
      enemy.vx = 0;
      enemy.vy = 0;
      return;
    }
    
    enemy.vx = (dx / dist) * enemy.speed;
    enemy.vy = (dy / dist) * enemy.speed;
  }
  
  diveAttack(enemy, dt) {
    // Dive toward player
    const player = EntityManager.getPlayer();
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    enemy.vx = (dx / dist) * enemy.diveSpeed;
    enemy.vy = (dy / dist) * enemy.diveSpeed;
    
    // Switch to retreat if past player
    if (enemy.y > player.y + 100) {
      enemy.state = 'retreat';
    }
  }
  
  retreat(enemy, dt) {
    enemy.vx = 0;
    enemy.vy = -enemy.speed;
    
    if (enemy.y < -50) {
      enemy.active = false; // Despawn
    }
  }
  
  fireProjectile(enemy) {
    const projectile = EntityManager.create('projectile');
    projectile.x = enemy.x;
    projectile.y = enemy.y;
    projectile.team = enemy.team;
    projectile.damage = enemy.damage;
    
    // Aim toward player
    const player = EntityManager.getPlayer();
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    projectile.vx = (dx / dist) * 300;
    projectile.vy = (dy / dist) * 300;
    
    EventBus.emit('enemy:fired', { enemy, projectile });
  }
}
```

**Required Enemy Properties:**
- `state: string` — AI state machine state
- `targetX, targetY: number` — Formation target position
- `speed, diveSpeed: number` — Movement speeds
- `attackCooldown: number` — Time until next attack

---

## 8. Lifetime System

**Purpose:** Remove inactive entities

```javascript
class LifetimeSystem extends System {
  constructor() {
    super('Lifetime');
  }
  
  update(entities, dt) {
    entities.forEach((entity, index) => {
      // Remove inactive entities
      if (!entity.active) {
        EntityManager.destroy(entity.id);
        return;
      }
      
      // Remove off-screen entities
      if (this.isOffScreen(entity)) {
        if (entity.type === 'projectile' || entity.type === 'particle') {
          EntityManager.destroy(entity.id);
        }
      }
      
      // Lifetime countdown
      if (entity.lifetime !== undefined) {
        entity.lifetime -= dt / 1000;
        if (entity.lifetime <= 0) {
          entity.active = false;
        }
      }
    });
  }
  
  isOffScreen(entity) {
    const margin = 100;
    return entity.x < -margin || 
           entity.x > canvasWidth + margin ||
           entity.y < -margin || 
           entity.y > canvasHeight + margin;
  }
}
```

**Optional Entity Properties:**
- `lifetime: number` — Seconds until auto-destroy
- `active: boolean` — Entity state

---

## 9. Particle System

**Purpose:** Manage visual effects

```javascript
class ParticleSystem extends System {
  constructor() {
    super('Particle');
    this.particles = [];
  }
  
  emit(x, y, config) {
    for (let i = 0; i < config.count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = config.speed.min + Math.random() * (config.speed.max - config.speed.min);
      
      const particle = {
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: config.color,
        size: config.size,
        lifetime: config.lifetime,
        alpha: 1
      };
      
      this.particles.push(particle);
    }
  }
  
  update(entities, dt) {
    this.particles = this.particles.filter(p => {
      p.x += p.vx * (dt / 1000);
      p.y += p.vy * (dt / 1000);
      p.lifetime -= dt / 1000;
      p.alpha = p.lifetime / p.lifetimeMax;
      
      return p.lifetime > 0;
    });
  }
  
  draw(ctx) {
    this.particles.forEach(p => {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    ctx.globalAlpha = 1;
  }
}
```

**Particle Config Schema:**
```javascript
{
  count: number,
  speed: { min: number, max: number },
  color: string,
  size: number,
  lifetime: number
}
```

---

## 10. Event Bus API

```javascript
// Subscribe to events
EventBus.on('player:hit', (data) => {
  console.log('Player hit!', data);
});

// Emit events
EventBus.emit('player:hit', { damage: 1, source: enemy });
```

**Standard Events:**

| Event | Data | Description |
|-------|------|-------------|
| `player:hit` | `{ damage, source }` | Player takes damage |
| `player:fire` | `{ projectile }` | Player fires weapon |
| `enemy:spawned` | `{ enemy }` | Enemy created |
| `enemy:destroyed` | `{ enemy, score }` | Enemy killed |
| `wave:start` | `{ waveIndex }` | New wave begins |
| `wave:clear` | `{ waveIndex, bonus }` | Wave completed |
| `pickup:collected` | `{ pickup, player }` | Power-up collected |
| `weapon:overheat` | `{ player }` | Weapon overheated |
| `game:pause` | `{}` | Game paused |
| `game:resume` | `{}` | Game resumed |

---

## 11. Entity Manager API

```javascript
class EntityManager {
  /**
   * Create new entity
   * @param {string} type - Entity type
   * @returns {Entity}
   */
  static create(type) { ... }
  
  /**
   * Destroy entity by ID
   * @param {string} id - Entity ID
   */
  static destroy(id) { ... }
  
  /**
   * Get all entities
   * @returns {Entity[]}
   */
  static getAll() { ... }
  
  /**
   * Query entities by filter
   * @param {Function} filter - Filter function
   * @returns {Entity[]}
   */
  static query(filter) { ... }
  
  /**
   * Get player entity
   * @returns {Entity}
   */
  static getPlayer() { ... }
  
  /**
   * Clear all entities
   */
  static clear() { ... }
}
```

**Usage Examples:**
```javascript
// Create enemy
const enemy = EntityManager.create('enemy');
enemy.x = 100;
enemy.y = 200;

// Query all projectiles
const projectiles = EntityManager.query(e => e.type === 'projectile');

// Destroy entity
EntityManager.destroy(enemy.id);
```

---

## 12. Extension Points

**Custom Systems:**
```javascript
class MyCustomSystem extends System {
  constructor() {
    super('MyCustom');
  }
  
  update(entities, dt) {
    // Custom logic
  }
}

// Register system
game.addSystem(new MyCustomSystem());
```

**Custom Components:**
```javascript
// Extend entity with custom data
entity.customData = {
  myProperty: 'value'
};
```

---

**Version:** 1.0  
**Last Updated:** 2025-11-01  
**Status:** ✅ Approved for development
