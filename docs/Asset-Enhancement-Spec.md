# Asset Enhancement Specification
**Geo Gala: Vector Offensive**

---

## 1. Rendering Architecture

### 1.1 Painter's Algorithm Implementation

**Layer Order (Back to Front):**

```javascript
// Render order per frame (60 FPS target)
const RENDER_LAYERS = {
  BACKGROUND: 0,    // Grid, void
  PICKUPS: 1,       // Power-ups, collectibles
  ENEMY_BULLETS: 2, // Enemy projectiles
  ENEMIES: 3,       // All enemy types
  PLAYER_BULLETS: 4,// Player projectiles
  PLAYER: 5,        // Player ship
  VFX: 6,           // Explosions, particles, trails
  HUD: 7            // UI overlay, always on top
};
```

**Performance Budget per Layer:**
- Background: 0.5ms (cached, rarely redrawn)
- Pickups: 0.5ms (max 20 active)
- Enemy Bullets: 1.0ms (max 100 active)
- Enemies: 2.0ms (max 32 active)
- Player Bullets: 1.0ms (max 50 active)
- Player: 0.3ms (single entity)
- VFX: 2.0ms (max 200 particles)
- HUD: 0.7ms (overlay compositing)

**Total Frame Budget:** 8.0ms rendering + 8.67ms logic = 16.67ms (60 FPS)

---

## 2. Visual Asset Specifications

### 2.1 Background Layer

#### Void Space
```css
/* Base void gradient */
Background: radial-gradient(
  circle at 50% 50%,
  #0F1419 0%,    /* Center - slightly lighter */
  #0A0E1A 100%   /* Edge - deep void */
);

/* Ambient glow particles */
- Count: 50 static stars
- Size: 1-3px
- Color: #1A2332 (subtle blue-gray)
- Opacity: 0.3-0.7 (random)
- No animation (performance)
```

#### Grid System
```javascript
{
  type: "isometric",
  cellSize: 64,           // 64px cells
  lineWidth: 1,
  lineColor: "#151B2E",   // Subtle grid
  opacity: 0.4,
  perspective: "2.5D",    // Slight angle for depth
  fadeDistance: 800,      // Fade out at edges
  scrollSpeed: 0.2,       // Subtle parallax on movement
}
```

**Grid Enhancement:**
- Add subtle glow to grid lines near player (8px radius, intensity 0.2)
- Pulse effect on wave clear (expand from center, 0.5s duration)
- Distortion waves on nuke activation

---

### 2.2 Pickup Assets (Layer 1)

#### Power Crystal (Blue)
```javascript
{
  geometry: "octahedron rotating",
  size: 16,
  coreColor: "#00AAFF",
  glowColor: "#00D4FF",
  glowRadius: 24,
  glowIntensity: 0.8,
  rotation: "2 RPM clockwise",
  pulseFrequency: "1 Hz",    // Breathing effect
  trail: {
    enabled: true,
    length: 3,               // 3 frame tail
    fadeRate: 0.3,
    color: "#00AAFF",
    opacity: 0.5
  }
}
```

#### Heat Sink (Cyan)
```javascript
{
  geometry: "hexagon with rotating inner ring",
  size: 14,
  coreColor: "#00FFFF",
  ringColor: "#00D4FF",
  glowRadius: 20,
  glowIntensity: 0.9,
  ringRotation: "3 RPM counter-clockwise",
  shimmer: "0.8-1.0 opacity sine wave, 2 Hz"
}
```

#### Repair Kit (Green)
```javascript
{
  geometry: "plus symbol pulsing",
  size: 16,
  coreColor: "#00FF88",
  glowColor: "#00FFB4",
  glowRadius: 22,
  glowIntensity: 1.0,
  pulseScale: "1.0-1.2",     // 20% size pulse
  pulseFrequency: "1.5 Hz",
  particles: {
    count: 4,                 // 4 orbiting sparkles
    orbit: 18,                // 18px radius
    speed: "2 RPM",
    color: "#FFFFFF",
    size: 2
  }
}
```

#### Missile Pack (Yellow)
```javascript
{
  geometry: "triangle + chevron overlay",
  size: 14,
  coreColor: "#FFD60A",
  chevronColor: "#FFF4A0",
  glowRadius: 18,
  glowIntensity: 0.7,
  rotation: "180° flip, 0.5s interval",  // Flipping animation
  trail: false
}
```

#### Score Gem (White)
```javascript
{
  geometry: "diamond (4-point star rotating)",
  size: 12,
  coreColor: "#FFFFFF",
  glowColor: "#E0E6F0",
  glowRadius: 16,
  glowIntensity: 0.6,
  rotation: "4 RPM clockwise",
  sparkle: {
    frequency: "random 0.5-2s",
    flashDuration: "0.1s",
    flashColor: "#FFFFFF",
    flashIntensity: 2.0       // Overexposure flash
  }
}
```

**Pickup Behaviors:**
- **Magnetism:** Smooth lerp movement toward player (0.15 ease)
- **Bounce:** Gentle vertical bob (±4px, 2s cycle)
- **Spawn:** Scale from 0 to 1.0 over 0.2s with elastic easing
- **Collect:** Rapid scale to 0 with spin (0.15s) + particle burst

---

### 2.3 Projectile Assets

#### Player Projectiles (Layer 4)

**Standard Shot:**
```javascript
{
  geometry: "elongated diamond (2:1 ratio)",
  length: 12,
  width: 6,
  coreColor: "#00FFFF",
  glowColor: "#00D4FF",
  glowRadius: 8,
  glowIntensity: 0.7,
  trail: {
    length: 5,               // 5 frame trail
    fadeRate: 0.4,
    width: 4,
    color: "#00AAFF",
    opacity: 0.6
  },
  muzzleFlash: {
    duration: "2 frames",
    size: 16,
    color: "#FFFFFF",
    opacity: 0.8
  }
}
```

**Missile (Homing):**
```javascript
{
  geometry: "chevron with thruster glow",
  size: 10,
  coreColor: "#FFD60A",
  thrusterColor: "#FF9500",
  glowRadius: 10,
  glowIntensity: 0.9,
  trail: {
    type: "smoke",
    particleCount: 2,        // Per frame
    particleLifetime: "0.4s",
    particleSize: "4-8px",
    particleColor: "#FFA040",
    particleOpacity: "1.0-0.0 linear fade"
  },
  lockIndicator: {
    enabled: true,
    lineWidth: 2,
    lineColor: "#FFD60A",
    dashPattern: [4, 4],
    opacity: 0.6
  }
}
```

#### Enemy Projectiles (Layer 2)

**Order Faction (Straight Shot):**
```javascript
{
  geometry: "triangle pointing forward",
  size: 8,
  coreColor: "#00FF88",
  glowRadius: 6,
  glowIntensity: 0.5,
  trail: {
    length: 3,
    color: "#00DD77",
    opacity: 0.4
  }
}
```

**Chaos Faction (Spread Shot):**
```javascript
{
  geometry: "irregular pentagon tumbling",
  size: 7,
  coreColor: "#FF6B35",
  glowRadius: 7,
  glowIntensity: 0.6,
  rotation: "random 5-10 RPM",
  trail: {
    type: "afterimage",
    length: 4,
    fadeRate: 0.5
  }
}
```

**Fractal Faction (Homing):**
```javascript
{
  geometry: "hexagon with pulsing core",
  size: 9,
  coreColor: "#8B5CF6",
  glowRadius: 8,
  glowIntensity: 0.7,
  pulseFrequency: "3 Hz",
  homingIndicator: {
    arc: "30° cone from bullet to player",
    color: "#A78BFA",
    opacity: 0.3
  }
}
```

**Singularity Faction (Beam):**
```javascript
{
  geometry: "line segment with gradient",
  length: 60,
  width: 4,
  gradient: {
    start: "#FFD60A",
    end: "#FF9500"
  },
  glowRadius: 6,
  glowIntensity: 1.0,
  distortion: {
    waveAmplitude: 2,        // 2px wave
    waveFrequency: "10 Hz"   // Fast shimmer
  }
}
```

---

### 2.4 Enemy Assets (Layer 3)

#### Order Faction

**Scout (Small Triangle):**
```javascript
{
  geometry: "equilateral triangle",
  size: 16,
  fillColor: "#00FF88",
  outlineWidth: 2,
  outlineColor: "#00FFAA",
  glowRadius: 12,
  glowIntensity: 0.6,
  rotation: "points upward, rotates to face movement",
  idleAnimation: "subtle rotation ±5° per second",
  damageFlash: {
    color: "#FFFFFF",
    duration: "3 frames",
    intensity: 0.8
  }
}
```

**Phalanx (Medium Triangle + Shield):**
```javascript
{
  geometry: "triangle with hexagonal shield overlay",
  triangleSize: 20,
  shieldSize: 28,
  triangleColor: "#00FF88",
  shieldColor: "#00DD77",
  shieldOpacity: 0.4,
  outlineWidth: 2,
  glowRadius: 16,
  glowIntensity: 0.7,
  shieldRegenEffect: {
    pulseColor: "#00FFCC",
    pulseDuration: "0.3s",
    pulseSize: "28-34px"
  }
}
```

**Spire (Large Triangle):**
```javascript
{
  geometry: "large triangle with internal lines",
  size: 32,
  fillColor: "#00FF88",
  internalLines: 2,          // Structural supports
  lineColor: "#00CC70",
  outlineWidth: 3,
  glowRadius: 24,
  glowIntensity: 0.8,
  splitAnimation: {
    type: "vertical split down center",
    duration: "0.4s",
    spawnCount: 2,            // 2 scouts
    spawnOffset: "±16px horizontal",
    flashColor: "#00FFFF",
    flashDuration: "0.2s"
  }
}
```

#### Chaos Faction

**Shard (Tumbling Pentagon):**
```javascript
{
  geometry: "irregular pentagon",
  size: 18,
  fillColor: "#FF6B35",
  outlineWidth: 2,
  outlineColor: "#FF8555",
  glowRadius: 14,
  glowIntensity: 0.65,
  rotation: "random 3-8 RPM, axis changes per second",
  vertexVariation: "±2px per vertex for asymmetry",
  trail: {
    enabled: true,
    length: 2,
    opacity: 0.3
  }
}
```

**Vortex (Spiraling Hexagon):**
```javascript
{
  geometry: "hexagon with rotation trails",
  size: 22,
  fillColor: "#FF6B35",
  outlineWidth: 2,
  glowRadius: 18,
  glowIntensity: 0.7,
  rotation: "6 RPM clockwise",
  spiralPath: {
    radius: "oscillates 0-40px",
    frequency: "0.5 Hz",
    direction: "counter-clockwise around anchor"
  },
  trailEffect: {
    afterimages: 5,
    fadeRate: 0.3,
    color: "#FF5520"
  }
}
```

#### Fractal Faction

**Seed (Hexagon Generator):**
```javascript
{
  geometry: "hexagon with inner hexagon (nested)",
  outerSize: 20,
  innerSize: 12,
  outerColor: "#8B5CF6",
  innerColor: "#A78BFA",
  outlineWidth: 2,
  glowRadius: 16,
  glowIntensity: 0.75,
  rotation: "inner rotates 4 RPM opposite outer 2 RPM",
  cloneSpawn: {
    count: 3,
    spawnRadius: 24,         // Spawn 24px around parent
    spawnDuration: "0.5s",
    spawnEffect: "scale 0-1 with particle burst",
    particleColor: "#C4B5FD",
    particleCount: 8
  }
}
```

**Lattice (Grid Former):**
```javascript
{
  geometry: "hexagon with connecting lines to neighbors",
  size: 18,
  fillColor: "#8B5CF6",
  outlineWidth: 2,
  glowRadius: 14,
  connectionLines: {
    width: 1,
    color: "#A78BFA",
    maxDistance: 80,         // Connect if within 80px
    opacity: 0.5,
    pulseFrequency: "2 Hz",  // Pulsing connections
    pulseOpacity: "0.3-0.7"
  }
}
```

#### Singularity Faction

**Phantom (Phasing Prism):**
```javascript
{
  geometry: "3D prism (isometric projection)",
  size: 24,
  faceColors: {
    front: "#FFD60A",
    top: "#FFF4A0",
    side: "#FFB800"
  },
  outlineWidth: 2,
  glowRadius: 20,
  glowIntensity: 0.85,
  phaseEffect: {
    frequency: "0.33 Hz",    // 3s cycle
    phaseDuration: "0.5s",   // 0.5s intangible
    phaseOpacity: 0.3,       // Fade to 30%
    phaseColor: "#FFFFFF",   // White flash
    distortion: "horizontal wave ±3px"
  },
  rotation3D: {
    axis: "Y",
    speed: "1 RPM"
  }
}
```

**Nexus (Summoner Prism):**
```javascript
{
  geometry: "large prism with orbiting rings",
  size: 36,
  faceColors: {
    front: "#FFD60A",
    top: "#FFF4A0",
    side: "#FFB800"
  },
  outlineWidth: 3,
  glowRadius: 28,
  glowIntensity: 1.0,
  orbitRings: {
    count: 2,
    radius: [32, 48],
    width: 2,
    color: "#FFF4A0",
    rotation: ["4 RPM CW", "3 RPM CCW"],
    opacity: 0.6
  },
  summonEffect: {
    telegraphDuration: "1.0s",
    telegraphIndicator: {
      type: "expanding circle at spawn point",
      color: "#FFD60A",
      startRadius: 0,
      endRadius: 40,
      opacity: "1.0-0.0"
    },
    spawnFlash: {
      color: "#FFFFFF",
      duration: "0.2s",
      radius: 60
    }
  }
}
```

---

### 2.5 Player Ship (Layer 5)

#### Triangle Fighter
```javascript
{
  geometry: "isosceles triangle (base:height = 1:1.5)",
  size: 24,                  // Height
  baseWidth: 16,
  fillColor: "#00FFFF",      // Cyan core
  outlineWidth: 3,
  outlineColor: "#00D4FF",
  glowRadius: 20,
  glowIntensity: 0.9,
  
  // Health-based color shift
  healthStates: {
    3: { fill: "#00FFFF", outline: "#00D4FF", glow: 0.9 },  // Full HP
    2: { fill: "#00FFAA", outline: "#00DD88", glow: 0.7 },  // 2 HP - yellow tint
    1: { fill: "#FF6B35", outline: "#FF5520", glow: 0.5 }   // 1 HP - red
  },
  
  // Thruster effect
  thruster: {
    geometry: "inverted triangle from base",
    size: 8,
    color: "#00AAFF",
    pulseFrequency: "10 Hz",  // Rapid flicker
    pulseIntensity: "0.6-1.0",
    particles: {
      count: 2,               // Per frame when moving
      size: "3-6px",
      color: "#00D4FF",
      lifetime: "0.2s",
      velocity: "opposite movement direction",
      fadeRate: 0.8
    }
  },
  
  // Shield visual
  shield: {
    enabled: "when regenerating",
    geometry: "hexagonal outline around ship",
    size: 32,
    color: "#00FFFF",
    opacity: 0.4,
    pulseFrequency: "2 Hz",
    pulseOpacity: "0.3-0.5"
  },
  
  // Weapon heat glow
  heatGlow: {
    minHeat: 0,
    maxHeat: 100,
    glowScale: "linear 0.9-1.5",     // Ship grows larger
    glowIntensity: "0.9-1.8",        // Glow intensifies
    glowColor: {
      0: "#00D4FF",                   // Cool - cyan
      50: "#FFB800",                  // Warm - yellow
      80: "#FF6B35",                  // Hot - orange
      100: "#FF3366"                  // Overheated - red
    }
  },
  
  // Damage flash
  damageEffect: {
    flashColor: "#FFFFFF",
    flashDuration: "4 frames",
    flashIntensity: 1.5,
    screenShake: {
      amplitude: 4,                   // 4px shake
      duration: "0.15s",
      frequency: "30 Hz"
    }
  },
  
  // Power-up collect aura
  collectAura: {
    duration: "0.3s",
    expandRadius: "20-40px",
    color: "matches pickup color",
    opacity: "0.8-0.0",
    particleBurst: {
      count: 12,
      spreadAngle: 360,
      velocity: "40-80 px/s",
      color: "matches pickup",
      lifetime: "0.4s"
    }
  }
}
```

---

### 2.6 VFX Layer (Layer 6)

#### Explosion (Enemy Destroyed)
```javascript
{
  type: "geometric shatter",
  duration: "0.6s",
  
  // Phase 1: Initial flash (0-0.1s)
  flash: {
    color: "#FFFFFF",
    radius: "enemy size × 2",
    opacity: "1.0-0.0",
    duration: "0.1s"
  },
  
  // Phase 2: Shatter fragments (0.1-0.6s)
  fragments: {
    count: "enemy vertex count × 2",  // Triangles=6, Hexagons=12
    shape: "triangular shards",
    size: "4-8px",
    color: "enemy color",
    velocity: "60-120 px/s radial",
    rotation: "random 10-20 RPM",
    gravity: "200 px/s² downward",
    lifetime: "0.5s",
    fadeStart: "0.3s",
    fadeEnd: "0.5s"
  },
  
  // Phase 3: Glow ring (0-0.4s)
  shockwave: {
    color: "enemy color",
    startRadius: "enemy size",
    endRadius: "enemy size × 4",
    width: 2,
    opacity: "0.8-0.0",
    duration: "0.4s"
  },
  
  // Sparkles
  sparkles: {
    count: 8,
    size: "2-4px",
    color: "#FFFFFF",
    velocity: "40-100 px/s random directions",
    lifetime: "0.3s",
    twinkle: "random flicker"
  }
}
```

#### Player Death
```javascript
{
  type: "catastrophic disintegration",
  duration: "1.2s",
  
  // Slow-mo effect
  timeScale: 0.3,             // 30% game speed for 0.5s
  
  // Phase 1: Core collapse (0-0.3s)
  coreImplosion: {
    startRadius: 20,
    endRadius: 0,
    color: "#00FFFF",
    opacity: "1.0-0.0",
    duration: "0.3s",
    particleSuck: {
      count: 40,
      startRadius: 100,
      endRadius: 0,
      color: "#00D4FF",
      lifetime: "0.3s"
    }
  },
  
  // Phase 2: Explosion (0.3-1.2s)
  explosion: {
    flash: {
      color: "#FFFFFF",
      radius: 100,
      opacity: "1.0-0.0",
      duration: "0.2s"
    },
    shockwave: {
      color: "#00FFFF",
      startRadius: 0,
      endRadius: 200,
      width: 4,
      opacity: "1.0-0.0",
      duration: "0.6s"
    },
    debris: {
      count: 30,
      shape: "triangular chunks",
      size: "6-12px",
      color: "#00FFFF",
      velocity: "100-200 px/s radial",
      rotation: "random 15-30 RPM",
      lifetime: "0.9s",
      trail: {
        length: 4,
        fadeRate: 0.4
      }
    }
  },
  
  // Screen effect
  screenEffect: {
    chromaticAberration: {
      offset: 8,              // 8px RGB split
      duration: "0.4s"
    },
    vignette: {
      intensity: 0.6,
      duration: "0.6s"
    }
  }
}
```

#### Nuke Activation
```javascript
{
  type: "screen-clearing wave",
  duration: "2.0s",
  
  // Telegraph (0-0.5s)
  telegraph: {
    playerGlow: {
      color: "#FFFFFF",
      radius: "20-60px",
      pulseFrequency: "8 Hz",
      duration: "0.5s"
    },
    warningText: {
      text: "NUKE READY",
      color: "#FFD60A",
      fontSize: 24,
      position: "center screen",
      flash: "4 Hz"
    }
  },
  
  // Expansion wave (0.5-1.5s)
  wave: {
    startRadius: 0,
    endRadius: 2000,          // Off-screen
    speed: "1200 px/s",       // Fast expansion
    width: 40,
    gradient: {
      inner: "#FFFFFF",
      outer: "#00FFFF"
    },
    opacity: "1.0-0.3",
    distortion: {
      waveAmplitude: 10,
      waveFrequency: "5 Hz"
    }
  },
  
  // Hit effect on enemies
  enemyVaporize: {
    type: "dissolve to particles",
    duration: "0.3s",
    particleCount: 20,
    particleColor: "enemy color",
    particleVelocity: "radial outward 80-150 px/s",
    particleLifetime: "0.5s"
  },
  
  // Screen flash
  screenFlash: {
    color: "#FFFFFF",
    opacity: "0-0.8-0",       // Fade in/out
    duration: "0.4s"
  }
}
```

#### Missile Trail
```javascript
{
  type: "smoke trail",
  particlesPerFrame: 2,
  
  particle: {
    shape: "soft circle (gradient fill)",
    size: "6-10px",
    color: "#FFA040",
    lifetime: "0.4s",
    velocity: "inherit missile velocity × -0.3",  // Drift backward
    expansion: "1.0-1.5 scale",                   // Grow over time
    fadeStart: "0.2s",
    fadeEnd: "0.4s",
    turbulence: {
      amplitude: 3,                               // 3px random drift
      frequency: "5 Hz"
    }
  }
}
```

#### Combo Multiplier Text
```javascript
{
  type: "floating score text",
  trigger: "enemy kill",
  
  text: {
    content: "×2.5 COMBO",
    font: "Share Tech Mono",
    fontSize: 18,
    color: "#FFD60A",
    outlineWidth: 2,
    outlineColor: "#000000"
  },
  
  animation: {
    spawnPosition: "enemy death location",
    floatDirection: "up + slight horizontal drift",
    floatSpeed: "40 px/s",
    duration: "1.0s",
    fadeStart: "0.6s",
    fadeEnd: "1.0s",
    scaleStart: 0.8,
    scaleEnd: 1.2
  }
}
```

---

### 2.7 HUD Layer (Layer 7)

#### Health Display
```javascript
{
  type: "hearts row",
  position: "top-left, 16px padding",
  
  heart: {
    geometry: "heart shape (2 circles + triangle)",
    size: 24,
    spacing: 8,
    states: {
      full: {
        fillColor: "#00FF88",
        outlineColor: "#00FFAA",
        glowRadius: 8,
        glowIntensity: 0.6
      },
      empty: {
        fillColor: "transparent",
        outlineColor: "#1A2332",
        glowRadius: 0
      }
    },
    lostAnimation: {
      type: "shatter",
      duration: "0.3s",
      fragmentCount: 6,
      fragmentVelocity: "30-60 px/s radial"
    },
    gainedAnimation: {
      type: "scale pulse",
      scale: "0-1.3-1.0",
      duration: "0.4s",
      ease: "elastic"
    }
  }
}
```

#### Heat Bar
```javascript
{
  type: "horizontal bar",
  position: "top-left, below health, 16px padding",
  
  bar: {
    width: 120,
    height: 12,
    backgroundColor: "#151B2E",
    outlineWidth: 2,
    outlineColor: "#1A2332",
    
    fill: {
      gradient: "heat-based",
      colors: {
        0: "#00FFFF",       // Cool
        50: "#FFB800",      // Warm
        80: "#FF6B35",      // Hot
        100: "#FF3366"      // Critical
      },
      glowIntensity: "scales with heat 0.3-1.2"
    },
    
    warningThreshold: {
      heat: 80,
      pulseFrequency: "3 Hz",
      pulseOpacity: "0.6-1.0",
      flashColor: "#FF3366"
    },
    
    overheatEffect: {
      color: "#FF3366",
      flash: "5 Hz for 2s cooldown",
      steamParticles: {
        count: 3,
        size: "4-8px",
        color: "#FFFFFF",
        velocity: "upward 20-40 px/s",
        lifetime: "0.6s",
        opacity: "0.6-0.0"
      }
    }
  }
}
```

#### Score Display
```javascript
{
  type: "animated number",
  position: "top-right, 16px padding",
  
  text: {
    font: "Orbitron",
    fontSize: 28,
    color: "#E0E6F0",
    outlineWidth: 2,
    outlineColor: "#000000",
    glowColor: "#00FFFF",
    glowRadius: 6,
    glowIntensity: 0.4
  },
  
  animation: {
    type: "count-up",
    duration: "0.3s",          // Smooth increment
    ease: "ease-out",
    
    onScoreIncrease: {
      scale: "1.0-1.15-1.0",   // Pulse
      duration: "0.2s",
      glowBoost: 0.8           // Glow intensifies
    }
  },
  
  rankBadge: {
    position: "below score",
    fontSize: 14,
    color: "rank-based",
    colors: {
      D: "#808080",
      C: "#E0E6F0",
      B: "#00FFFF",
      A: "#FF00FF",
      S: "#FFD60A"
    },
    glow: "matches rank color",
    pulseOnRankUp: {
      scale: "0.8-1.5-1.0",
      duration: "0.5s"
    }
  }
}
```

#### Power Level Indicator
```javascript
{
  type: "segmented bar",
  position: "top-right, below score, 16px padding",
  
  segments: {
    count: 10,                // 0-10 power levels
    width: 12,
    height: 8,
    spacing: 4,
    
    filled: {
      color: "#00AAFF",
      glowColor: "#00D4FF",
      glowRadius: 6,
      glowIntensity: 0.7
    },
    
    empty: {
      color: "#151B2E",
      outlineColor: "#1A2332",
      outlineWidth: 1
    },
    
    fillAnimation: {
      type: "left-to-right wipe",
      duration: "0.2s",
      ease: "ease-out"
    }
  }
}
```

#### Wave Counter
```javascript
{
  type: "text with decorative brackets",
  position: "top-center",
  
  text: {
    content: "[ WAVE 7 ]",
    font: "Share Tech Mono",
    fontSize: 20,
    color: "#E0E6F0",
    outlineWidth: 2,
    outlineColor: "#000000",
    letterSpacing: 2
  },
  
  animation: {
    onWaveStart: {
      type: "slide-in from top",
      duration: "0.4s",
      ease: "ease-out",
      overshoot: 10           // Bounce 10px past final position
    },
    onWaveClear: {
      type: "scale + glow pulse",
      scale: "1.0-1.3-1.0",
      glowColor: "#00FF88",
      glowIntensity: 1.5,
      duration: "0.5s"
    }
  }
}
```

#### Touch Controls (Mobile Only)
```javascript
{
  joystick: {
    position: "bottom-left, 40px padding",
    outerRadius: 60,
    innerRadius: 24,
    
    outer: {
      color: "#151B2E",
      outlineColor: "#1A2332",
      outlineWidth: 3,
      opacity: 0.6
    },
    
    inner: {
      color: "#00FFFF",
      glowColor: "#00D4FF",
      glowRadius: 12,
      glowIntensity: 0.8,
      opacity: 0.8
    },
    
    returnAnimation: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  
  actionButtons: {
    position: "bottom-right, 40px padding",
    layout: "vertical stack",
    spacing: 16,
    
    button: {
      size: 56,
      shape: "circle",
      backgroundColor: "#151B2E",
      outlineColor: "#1A2332",
      outlineWidth: 3,
      opacity: 0.6,
      
      icon: {
        size: 32,
        color: "#E0E6F0",
        glowColor: "#00FFFF",
        glowRadius: 8
      },
      
      pressEffect: {
        scale: 0.9,
        opacity: 0.9,
        duration: "0.1s"
      },
      
      disabledState: {
        opacity: 0.3,
        iconColor: "#404040"
      }
    },
    
    buttons: [
      {
        id: "missile",
        icon: "🚀",
        cooldownIndicator: {
          type: "radial fill",
          color: "#FFD60A",
          opacity: 0.4
        }
      },
      {
        id: "nuke",
        icon: "💣",
        chargeIndicator: {
          type: "pulsing glow",
          color: "#FF3366",
          pulseFrequency: "2 Hz"
        }
      }
    ]
  }
}
```

---

## 3. Performance Optimization

### 3.1 Object Pooling
```javascript
const POOL_SIZES = {
  playerBullets: 50,
  enemyBullets: 100,
  enemies: 32,
  particles: 200,
  pickups: 20,
  explosions: 10
};
```

### 3.2 Culling
- Entities beyond screen bounds + 100px padding are not rendered
- Particles beyond screen bounds are recycled immediately

### 3.3 Canvas Optimization
- Use OffscreenCanvas for static background (1-2 FPS redraw)
- Layer composition: Background → Game → HUD (3 canvases)
- RequestAnimationFrame with delta time smoothing

### 3.4 Glow Rendering
- Pre-render glow sprites at startup (10 sizes × 8 colors = 80 sprites)
- Use sprite stamping instead of per-frame shadowBlur
- Composite mode: `globalCompositeOperation = 'lighter'`

---

## 4. Accessibility Enhancements

### 4.1 Colorblind Modes
**Deuteranopia (Red-Green):**
- Player: Cyan → Blue (#0066FF)
- Order: Green → Yellow (#FFD60A)
- Chaos: Orange → Purple (#8B5CF6)

**Protanopia (Red-Green):**
- Player: Cyan → Cyan (no change)
- Chaos: Orange → Magenta (#FF00FF)

**Tritanopia (Blue-Yellow):**
- Player: Cyan → Red (#FF3366)
- Singularity: Gold → Magenta (#FF00FF)

### 4.2 Shape Coding
- Pickups use distinct geometry (octahedron, hexagon, plus, triangle, diamond)
- Each faction has unique enemy silhouette
- Projectile shapes differ by faction

---

## 5. Implementation Priority

### Phase 1: Core Rendering (Week 1)
- [ ] Painter's algorithm layer system
- [ ] Player ship with health states
- [ ] Basic enemy rendering (Order faction only)
- [ ] Simple projectiles (no trails)
- [ ] HUD (health, score, heat bar)

### Phase 2: Visual Polish (Week 2)
- [ ] Pickup assets with animations
- [ ] All enemy factions
- [ ] Projectile trails and effects
- [ ] Basic explosions
- [ ] Power-up collect effects

### Phase 3: VFX (Week 3)
- [ ] Advanced explosions (shatter)
- [ ] Nuke effect
- [ ] Player death sequence
- [ ] Particle systems
- [ ] Screen effects

### Phase 4: Optimization (Week 4)
- [ ] Object pooling
- [ ] Glow sprite pre-rendering
- [ ] Canvas layering
- [ ] Performance profiling

---

**Version:** 1.0  
**Last Updated:** 2025-11-01  
**Alignment:** GDD v1.0, PRD v1.0  
**Status:** ✅ Ready for implementation
