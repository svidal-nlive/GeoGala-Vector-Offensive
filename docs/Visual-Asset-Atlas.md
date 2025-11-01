# Visual Asset Atlas
**Geo Gala: Vector Offensive**

> **Reference:** See [Asset Enhancement Spec](Asset-Enhancement-Spec.md) for implementation details

---

## Quick Reference: Asset Sizes & Colors

### Pickups
| Asset | Size | Core Color | Glow Radius | Geometry |
|-------|------|------------|-------------|----------|
| Power Crystal | 16px | #00AAFF | 24px | Rotating octahedron |
| Heat Sink | 14px | #00FFFF | 20px | Hexagon + inner ring |
| Repair Kit | 16px | #00FF88 | 22px | Pulsing plus |
| Missile Pack | 14px | #FFD60A | 18px | Flipping triangle |
| Score Gem | 12px | #FFFFFF | 16px | Spinning diamond |

### Player
| State | Size | Color | Glow | Notes |
|-------|------|-------|------|-------|
| Full HP (3) | 24h×16w | #00FFFF | 20px @ 0.9 | Cyan |
| Medium HP (2) | 24h×16w | #00FFAA | 20px @ 0.7 | Yellow tint |
| Low HP (1) | 24h×16w | #FF6B35 | 20px @ 0.5 | Red warning |

### Enemies: Order Faction (Triangles)
| Type | Size | Color | HP | Glow |
|------|------|-------|----|----|
| Scout | 16px | #00FF88 | 1 | 12px @ 0.6 |
| Phalanx | 20px + 28px shield | #00FF88 | 2 | 16px @ 0.7 |
| Spire | 32px | #00FF88 | 3 | 24px @ 0.8 |

### Enemies: Chaos Faction (Polygons)
| Type | Size | Color | HP | Glow |
|------|------|-------|----|----|
| Shard | 18px | #FF6B35 | 2 | 14px @ 0.65 |
| Vortex | 22px | #FF6B35 | 3 | 18px @ 0.7 |

### Enemies: Fractal Faction (Hexagons)
| Type | Size | Color | HP | Glow |
|------|------|-------|----|----|
| Seed | 20px outer, 12px inner | #8B5CF6 | 1 | 16px @ 0.75 |
| Lattice | 18px | #8B5CF6 | 2 | 14px @ 0.7 |

### Enemies: Singularity Faction (Prisms)
| Type | Size | Color | HP | Glow |
|------|------|-------|----|----|
| Phantom | 24px | #FFD60A | 5 | 20px @ 0.85 |
| Nexus | 36px + 2 rings | #FFD60A | 8 | 28px @ 1.0 |

### Projectiles
| Type | Size | Color | Trail | Speed |
|------|------|-------|-------|-------|
| Player Shot | 12×6px | #00FFFF | 5 frames | 800 px/s |
| Missile | 10px | #FFD60A | Smoke | 400 px/s |
| Order Shot | 8px | #00FF88 | 3 frames | 300 px/s |
| Chaos Shot | 7px | #FF6B35 | 4 frames | 250 px/s |
| Fractal Shot | 9px | #8B5CF6 | Pulsing | 200 px/s (homing) |
| Singularity Beam | 60×4px | #FFD60A gradient | Wave | 600 px/s |

---

## Color Palette Master Reference

### Primary Colors
```css
--color-player:       #00FFFF  /* Cyan */
--color-player-glow:  #00D4FF  /* Bright cyan */
--color-order:        #00FF88  /* Mint green */
--color-chaos:        #FF6B35  /* Coral orange */
--color-fractal:      #8B5CF6  /* Purple */
--color-singularity:  #FFD60A  /* Gold */
```

### Background
```css
--color-void-center:  #0F1419  /* Lighter center */
--color-void-edge:    #0A0E1A  /* Deep void */
--color-grid:         #151B2E  /* Grid lines */
--color-grid-accent:  #1A2332  /* Grid highlights */
```

### UI
```css
--color-ui-text:      #E0E6F0  /* Primary text */
--color-ui-accent:    #00FFFF  /* Interactive */
--color-ui-warning:   #FFB800  /* Warnings */
--color-ui-danger:    #FF3366  /* Critical */
--color-ui-success:   #00FF88  /* Positive */
```

### Health States
```css
--health-full:        #00FFFF  /* 3 HP */
--health-medium:      #00FFAA  /* 2 HP */
--health-critical:    #FF6B35  /* 1 HP */
```

### Heat Gradient
```css
--heat-cool:          #00FFFF  /* 0-25% */
--heat-warm:          #FFB800  /* 26-50% */
--heat-hot:           #FF6B35  /* 51-80% */
--heat-critical:      #FF3366  /* 81-100% */
```

---

## Glow Presets

All glows use `shadowBlur` with composite mode `lighter`.

### Intensity Levels
- **Subtle:** 0.3-0.5 (background elements)
- **Medium:** 0.6-0.8 (gameplay elements)
- **Strong:** 0.9-1.2 (player, important pickups)
- **Critical:** 1.5-2.0 (warnings, explosions)

### Pre-rendered Glow Sprites
**80 total sprites** (10 sizes × 8 colors):

**Sizes:** 8, 12, 16, 20, 24, 28, 32, 40, 60, 100 pixels

**Colors:**
1. #00FFFF (Cyan - player/UI)
2. #00FF88 (Green - Order faction)
3. #FF6B35 (Orange - Chaos faction)
4. #8B5CF6 (Purple - Fractal faction)
5. #FFD60A (Gold - Singularity faction)
6. #FFFFFF (White - flashes/sparkles)
7. #FF3366 (Red - danger/damage)
8. #00AAFF (Blue - power-ups)

---

## Animation Timing Reference

### Durations
- **Micro:** 0.1s (flashes, instant feedback)
- **Quick:** 0.2-0.3s (pickups, damage)
- **Standard:** 0.4-0.6s (explosions, transitions)
- **Slow:** 0.8-1.2s (player death, nuke)

### Easing Functions
```javascript
const EASING = {
  linear: t => t,
  easeOut: t => 1 - Math.pow(1 - t, 3),
  easeInOut: t => t < 0.5 
    ? 4 * t * t * t 
    : 1 - Math.pow(-2 * t + 2, 3) / 2,
  elastic: t => {
    const c = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c) + 1;
  }
};
```

### Frequencies
- **Subtle pulse:** 1-2 Hz (breathing effects)
- **Standard pulse:** 3-4 Hz (warnings)
- **Rapid pulse:** 8-10 Hz (thrusters, critical alerts)

---

## Particle System Presets

### Explosion (Small)
```javascript
{
  count: 8,
  size: "4-8px",
  velocity: "60-120 px/s radial",
  lifetime: "0.5s",
  gravity: "200 px/s² down",
  fadeStart: "0.3s"
}
```

### Explosion (Large)
```javascript
{
  count: 20,
  size: "6-12px",
  velocity: "100-200 px/s radial",
  lifetime: "0.9s",
  gravity: "200 px/s² down",
  fadeStart: "0.5s",
  trail: { length: 4, fadeRate: 0.4 }
}
```

### Collect Burst
```javascript
{
  count: 12,
  size: "3-6px",
  velocity: "40-80 px/s radial",
  lifetime: "0.4s",
  gravity: "0",
  fadeStart: "0.2s"
}
```

### Thruster Trail
```javascript
{
  count: "2 per frame",
  size: "3-6px",
  velocity: "opposite movement × 0.5",
  lifetime: "0.2s",
  fadeRate: "0.8"
}
```

### Missile Smoke
```javascript
{
  count: "2 per frame",
  size: "6-10px",
  velocity: "inherit × -0.3",
  lifetime: "0.4s",
  expansion: "1.0-1.5 scale",
  turbulence: { amplitude: 3, frequency: "5 Hz" }
}
```

---

## Canvas Layer Structure

### Layer 0: Background (Static Canvas)
- **Redraw:** 1-2 FPS (only on screen shake/nuke)
- **Contents:** Void gradient, grid, ambient stars
- **Size:** Match viewport
- **Composite:** `source-over`

### Layer 1: Game Canvas (Primary)
- **Redraw:** 60 FPS
- **Contents:** All gameplay entities (pickups → VFX)
- **Size:** Match viewport
- **Composite:** `source-over` (entities), `lighter` (glows)

### Layer 2: HUD Canvas (Overlay)
- **Redraw:** Variable (on state change)
- **Contents:** Health, score, heat, buttons
- **Size:** Match viewport
- **Composite:** `source-over`

### Composition
```javascript
// Final frame composite
ctx.drawImage(backgroundCanvas, 0, 0);
ctx.drawImage(gameCanvas, 0, 0);
ctx.drawImage(hudCanvas, 0, 0);
```

---

## Sprite Sheet Layout (Future Optimization)

When transitioning to sprite sheets in Phase 3:

### Sheet Dimensions
- **Size:** 1024×1024 (power of 2)
- **Format:** PNG-32 with alpha
- **Compression:** TinyPNG or similar

### Grid Layout
```
┌────────────────────────────────┐
│ Pickups (128×128 each)         │
│ [Power][Heat][Repair][Missile] │
│ [Gem]                          │
├────────────────────────────────┤
│ Player States (64×64 each)     │
│ [Full HP][2 HP][1 HP][Shield]  │
├────────────────────────────────┤
│ Enemies (variable sizes)       │
│ Order: [Scout][Phalanx][Spire] │
│ Chaos: [Shard][Vortex]         │
│ Fractal: [Seed][Lattice]       │
│ Singularity: [Phantom][Nexus]  │
├────────────────────────────────┤
│ Projectiles (32×32 each)       │
│ [Player][Missile][Order][...]  │
├────────────────────────────────┤
│ VFX Frames (64×64 each)        │
│ [Explosion 1-6][Flash][Glow]   │
└────────────────────────────────┘
```

### Sprite Atlas JSON
```json
{
  "powerCrystal": { "x": 0, "y": 0, "w": 128, "h": 128 },
  "heatSink": { "x": 128, "y": 0, "w": 128, "h": 128 },
  "playerFull": { "x": 0, "y": 128, "w": 64, "h": 64 },
  ...
}
```

---

## Asset Loading Strategy

### Phase 1: Immediate Load (Critical Path)
**Target:** <100ms
- Background gradient (generated)
- Grid pattern (generated)
- Player ship geometry (procedural)
- HUD elements (procedural)

### Phase 2: Deferred Load (Pre-game)
**Target:** <500ms
- Pre-render glow sprites (80 sprites)
- Generate enemy geometries
- Generate pickup geometries
- Compile particle templates

### Phase 3: Lazy Load (On-demand)
- Audio assets (on first interaction)
- Boss-specific VFX
- Advanced particle effects

### Loading Screen
```
┌─────────────────────────────┐
│   GEO GALA: VECTOR OFFENSIVE │
│                               │
│   [▰▰▰▰▰▰▰▱▱▱] 70%          │
│   Rendering glow sprites...   │
│                               │
│   Press SPACE to start        │
└─────────────────────────────┘
```

---

## Performance Metrics

### Target Frame Budget
- **Total:** 16.67ms @ 60 FPS
- **Render:** 8.0ms (48%)
- **Logic:** 7.0ms (42%)
- **Overhead:** 1.67ms (10%)

### Render Budget Breakdown
- Background: 0.5ms (6%)
- Pickups: 0.5ms (6%)
- Enemy bullets: 1.0ms (13%)
- Enemies: 2.0ms (25%)
- Player bullets: 1.0ms (13%)
- Player: 0.3ms (4%)
- VFX: 2.0ms (25%)
- HUD: 0.7ms (9%)

### Memory Budget
- Glow sprites: ~2 MB (80 sprites @ 25 KB avg)
- Pooled entities: ~500 KB
- Canvas buffers: ~12 MB (3 layers @ 1920×1080 RGBA)
- Total: <15 MB

---

## Accessibility: Shape Coding

**For colorblind players**, each asset category uses distinct geometry:

### Pickups
- Power: **Octahedron** (8 faces)
- Heat: **Hexagon + ring** (6 sides)
- Repair: **Plus symbol** (cross)
- Missile: **Triangle + chevron** (arrow)
- Gem: **Diamond** (4 points)

### Factions
- Order: **Triangles** (3 sides)
- Chaos: **Irregular polygons** (5-7 sides)
- Fractal: **Hexagons** (6 sides)
- Singularity: **3D prisms** (depth cue)

### Visual Markers
- Add thin outline in contrasting color (black/white)
- High-contrast mode: 3px thick outlines
- Reduced-motion mode: disable rotation/pulse

---

## Implementation Checklist

### Week 1: Core Assets
- [ ] Player ship (3 health states)
- [ ] Order faction enemies (Scout, Phalanx, Spire)
- [ ] Basic projectiles (player, Order)
- [ ] Pickups (all 5 types)
- [ ] HUD elements (health, score, heat)

### Week 2: Expanded Assets
- [ ] Chaos faction enemies
- [ ] Fractal faction enemies
- [ ] Singularity faction enemies
- [ ] All projectile types
- [ ] Touch controls (mobile)

### Week 3: VFX
- [ ] Explosion system (3 sizes)
- [ ] Particle system
- [ ] Trails (projectile, thruster, missile)
- [ ] Screen effects (flash, shake, vignette)
- [ ] Nuke effect

### Week 4: Polish & Optimization
- [ ] Glow sprite pre-rendering
- [ ] Canvas layering
- [ ] Object pooling verification
- [ ] Performance profiling
- [ ] Accessibility testing

---

**Version:** 1.0  
**Last Updated:** 2025-11-01  
**Companion Doc:** [Asset Enhancement Spec](Asset-Enhancement-Spec.md)  
**Status:** ✅ Ready for artist handoff
