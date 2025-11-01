# GeoGala: Vector Offensive — Visual Style Guide

## 1. Design Principles

- **Geometric Minimalism:** Every shape serves a purpose; no extraneous detail
- **Neon Arcade:** Bold outlines, glowing accents, high contrast
- **Readable Silhouettes:** Player learns enemy type instantly by shape
- **60 FPS Motion:** Smooth animations, no jank or blur
- **Accessible:** WCAG AA contrast for all UI text, safe-areas on mobile

---

## 2. Geometric Primitives & Rendering

### 2.1 Canvas Drawing Pattern

All shapes rendered with:

- **Fill Color:** Solid (primary faction color)
- **Stroke:** 2–3 px outline (same color or complementary glow)
- **Glow Effect:** Soft shadow or outer stroke at opacity 0.3–0.5

```javascript
// Base pattern for all shapes
ctx.fillStyle = shapeColor;
ctx.strokeStyle = shapeColor;
ctx.lineWidth = 2;
ctx.beginPath();
// ... shape path
ctx.fill();
ctx.stroke();

// Glow (optional, used sparingly for player/bosses)
ctx.strokeStyle = `rgba(0, 255, 255, 0.3)`;
ctx.lineWidth = 4;
ctx.stroke();
```

### 2.2 Player Ship (Triangle)

| Aspect | Specification |
| --- | --- |
| **Base Shape** | Equilateral triangle, point upward |
| **Dimensions** | 30 px tall × 24 px wide (base) |
| **Fill Color** | `#00ffff` (cyan) |
| **Stroke** | `#00ffff`, 2 px |
| **Glow** | `rgba(0, 255, 255, 0.3)`, 4 px outer stroke |
| **Animation** | None at rest; +10% scale on fire; shield ring on active shield |
| **Variants** | Mk II (double nose), Mk III (with orbiting drones), Mk IV (fan fire effect) |

**Rendering:**

```javascript
// Player triangle
ctx.fillStyle = '#00ffff';
ctx.strokeStyle = '#00ffff';
ctx.lineWidth = 2;

ctx.beginPath();
ctx.moveTo(x, y - 15);
ctx.lineTo(x - 12, y + 12);
ctx.lineTo(x + 12, y + 12);
ctx.closePath();
ctx.fill();
ctx.stroke();

// Shield ring (if active)
ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.arc(x, y, 20, 0, Math.PI * 2);
ctx.stroke();
```

### 2.3 Triangle Enemy (Striker)

| Aspect | Specification |
| --- | --- |
| **Base Shape** | Equilateral triangle, point-forward or angled |
| **Dimensions** | 20 px tall × 16 px wide |
| **Fill Color** | `#ff0088` (magenta/hostile) |
| **Stroke** | `#ff0088`, 1.5 px |
| **Glow** | None (unless elite) |
| **Animation** | Rotation ±5° per dive |

### 2.4 Square Enemy (Defender)

| Aspect | Specification |
| --- | --- |
| **Base Shape** | Square rotated 45° (diamond aspect) |
| **Dimensions** | 24 px × 24 px (diagonal) |
| **Fill Color** | `#ff0088` (magenta) or `#cc0066` (darker variant) |
| **Stroke** | `#ff00ff` (bright magenta), 2 px |
| **Health Ring** | Hollow circle outline, arc progresses as HP decreases |
| **Animation** | Slight pulse when shielding (+5% scale for 0.3s) |

**Health Ring:**

```javascript
// Draw based on HP / max HP
ctx.strokeStyle = '#ff00ff';
ctx.lineWidth = 2;
ctx.beginPath();
ctx.arc(x, y, 16, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (hp / maxHp));
ctx.stroke();
```

### 2.5 Hexagon Enemy (Artillery)

| Aspect | Specification |
| --- | --- |
| **Base Shape** | Regular hexagon, flat-top orientation |
| **Dimensions** | 22 px diameter (circumscribed circle) |
| **Fill Color** | `#00dddd` (cyan/hostile) |
| **Stroke** | `#00ffff` (bright cyan), 2 px |
| **Weak-Point Indicator** | Rotating line or "X" inside, highlights which face is vulnerable |
| **Animation** | Rotation ±15° per 0.5s (spin for weak-point) |

**Weak Point Indicator:**

```javascript
// Rotating line to show weak point
const angle = (time * Math.PI) / 2; // Rotate every 4s
ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(x + Math.cos(angle) * 10, y + Math.sin(angle) * 10);
ctx.lineTo(x - Math.cos(angle) * 10, y - Math.sin(angle) * 10);
ctx.stroke();
```

### 2.6 Diamond Enemy (Support)

| Aspect | Specification |
| --- | --- |
| **Base Shape** | Rotated square (tall diamond) |
| **Dimensions** | 20 px tall × 16 px wide |
| **Fill Color** | `#ffaa00` (amber/gold, support faction) |
| **Stroke** | `#ffdd00` (bright gold), 2 px |
| **Buff Aura** | Pulsing circle, 1–2 px at 40–50 px radius, opacity 0.3 |
| **Animation** | Gentle bobbing (±3 px y-offset, 1s period) |

**Buff Aura:**

```javascript
// Pulsing support aura
const pulseScale = 0.5 + Math.sin(time * Math.PI) * 0.5;
ctx.strokeStyle = `rgba(255, 170, 0, ${0.3 * pulseScale})`;
ctx.lineWidth = 1;
ctx.beginPath();
ctx.arc(x, y, 40 + pulseScale * 10, 0, Math.PI * 2);
ctx.stroke();
```

### 2.7 Bullets (Projectiles)

| Aspect | Specification |
| --- | --- |
| **Player Bullet** | Small circle or triangle, cyan `#00ffff` |
| **Enemy Bullet** | Small circle, magenta `#ff0088` |
| **Size** | 4–6 px radius |
| **Glow** | Minimal; optional slight outer glow |
| **Motion** | Straight line, no trails (for 60 FPS clarity) |

```javascript
// Player bullet
ctx.fillStyle = '#00ffff';
ctx.beginPath();
ctx.arc(x, y, 3, 0, Math.PI * 2);
ctx.fill();

// Enemy bullet
ctx.fillStyle = '#ff0088';
ctx.beginPath();
ctx.arc(x, y, 3, 0, Math.PI * 2);
ctx.fill();
```

### 2.8 Pickups (Drops)

| Type | Shape | Color | Size |
| --- | --- | --- | --- |
| **Credit** | Small diamond | `#00ff00` (green) | 6 px |
| **Alloy** | Slightly larger diamond | `#00dd00` (darker green) | 8 px |
| **Blueprint** | Small star or gear | `#ffff00` (yellow) | 7 px |
| **Shield** | Hollow circle | `#00ffff` (cyan) | 6 px radius |

**Pickup Glow:**

```javascript
// All pickups glow and pulse
ctx.shadowColor = pickupColor;
ctx.shadowBlur = 10 + Math.sin(time * Math.PI * 2) * 5;

ctx.fillStyle = pickupColor;
ctx.beginPath();
ctx.arc(x, y, size, 0, Math.PI * 2);
ctx.fill();

ctx.shadowBlur = 0; // Reset
```

---

## 3. Boss Design (Prime Shapes)

### 3.1 Prime Hex

- **Composition:** Central hexagon + 3–4 rotating rings of smaller shapes
- **Color:** Cyan `#00ffff` with gradient tint
- **Size:** 60 px diameter (core)
- **Weak Point:** Visual indicator (arrow or highlight) shows which ring segment is vulnerable
- **Phase Transition:** Screen flash (white, 100 ms) and audio cue

### 3.2 Prime Tetra

- **Composition:** 4 triangles rotating around a central point
- **Color:** Magenta `#ff00ff` (triangles) with cyan `#00ffff` (core)
- **Size:** 50 px per triangle, 40 px core
- **Weak Point:** Each triangle has different attack; one rotates to a highlighted position each phase

### 3.3 Prime Prism

- **Composition:** Long prism body + refracted beam effect
- **Color:** Gradient cyan-to-magenta
- **Size:** 60 px wide × 40 px tall
- **Special:** Beam lines split into angles at mid-screen; visual lines show predicted impact

### 3.4 Prime Obelisk

- **Composition:** Long rectangular body + spawned support diamonds
- **Color:** Dark magenta `#cc00ff` with bright magenta `#ff00ff` accent
- **Size:** 80 px tall × 20 px wide
- **Motion:** Horizontal slides (side-to-side), then spawns 2–3 diamonds

---

## 4. Color Palette (Tokens)

### 4.1 Core Colors

```css
/* Faction Colors */
--player: #00ffff;        /* Cyan */
--hostile: #ff0088;       /* Magenta/Red */
--hostile-dark: #cc0066;  /* Darker hostile variant */
--support: #ffaa00;       /* Amber/Gold */
--support-light: #ffdd00; /* Bright gold */
--pickup: #00ff00;        /* Green */
--pickup-alt: #00dd00;    /* Darker green (Alloy) */
--boss: #ff00ff;          /* Bright magenta */
--boss-alt: #cc00ff;      /* Purple-ish magenta variant */

/* UI / Text */
--ui-text: #ffffff;       /* White */
--ui-text-dim: #cccccc;   /* Dim white */
--ui-bg: rgba(0, 0, 0, 0.8);  /* Semi-transparent black */
--ui-accent: #00ffff;     /* Cyan accent */

/* Background */
--bg-primary: #000000;    /* Solid black */
--bg-grid: rgba(0, 255, 255, 0.05); /* Subtle grid overlay (optional) */
```

### 4.2 Contrast & Accessibility

- **UI Text on Dark BG:** `#ffffff` on `rgba(0, 0, 0, 0.8)` = **12.6:1 contrast** (WCAG AAA)
- **Player Cyan:** `#00ffff` on black = **11.2:1 contrast** (WCAG AAA)
- **Hostile Magenta:** `#ff0088` on black = **6.1:1 contrast** (WCAG AA)
- **Gold Support:** `#ffaa00` on black = **8.3:1 contrast** (WCAG AA+)

**CSS Example:**

```css
body {
  background: #000;
  color: #ffffff;
  font-family: monospace; /* Arcade-style */
}

.ui-text {
  color: #ffffff;
  text-shadow: 0 0 4px rgba(0, 255, 255, 0.5); /* Neon glow (optional) */
}

.enemy-label {
  color: #ff0088;
  font-weight: bold;
}
```

---

## 5. HUD & UI Panels

### 5.1 HUD Layout

```plaintext
┌────────────────────────────────────────────────────────────┐
│ Wave 05        [████████░░] Boss Hex    │  Credits: 450   │
│                                         │  Alloy: 32      │
│                                         │                 │
│                                         │  Weapon:        │
│           [Game Canvas Area]            │  Linear Bolt    │
│                                         │  + Plasma       │
│                                         │                 │
│  Player Hull: [████████░░] 2/3 HP       │  Aux: [5s →]    │
│                                         │  (ready in 5s)  │
└────────────────────────────────────────────────────────────┘
```

### 5.2 Upgrade Panel (Wave Complete)

- **Position:** Slide up from bottom or side-in from right
- **Layout:** 2–3 cards in row
- **Card Content:**
  - Icon (4-color gradient or unique symbol)
  - Rarity badge (star count: 1–3 stars)
  - Name (e.g., "Plasma Modifier")
  - Stat delta (e.g., "+15% Fire Rate")
  - Color frame: gold (Advanced), purple (Vector), gray (Common)

**Card Styling:**

```css
.upgrade-card {
  border: 2px solid #00ffff;
  background: rgba(0, 255, 255, 0.1);
  border-radius: 4px;
  padding: 12px;
  font-family: monospace;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
}

.upgrade-card:hover {
  background: rgba(0, 255, 255, 0.2);
  box-shadow: 0 0 8px rgba(0, 255, 255, 0.6);
}

.upgrade-card.rarity-advanced {
  border-color: #ffaa00;
  background: rgba(255, 170, 0, 0.1);
}

.upgrade-card.rarity-vector {
  border-color: #ff00ff;
  background: rgba(255, 0, 255, 0.1);
}
```

### 5.3 Boss Health Bar

- **Position:** Top-center or right-aligned
- **Style:** Segmented (one segment per phase)
- **Color:** Matches boss primary color (cyan for Hex, magenta for Tetra)
- **Animation:** Depletes smoothly; flashes white on phase transition

```css
.boss-health {
  width: 200px;
  height: 12px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #00ffff;
  border-radius: 2px;
  overflow: hidden;
  margin: 8px auto;
}

.boss-health-bar {
  height: 100%;
  background: linear-gradient(90deg, #00ffff, #00ffff 70%, #ffffff);
  width: 100%;
  transition: width 0.1s;
}

.boss-phase-segment {
  position: absolute;
  width: 1px;
  height: 12px;
  background: #00ffff;
  opacity: 0.5;
}
```

---

## 6. Effects & Animation

### 6.1 Impact Flash

When bullet hits enemy:

```javascript
// Flash white for 50 ms
ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
ctx.fillRect(x - 20, y - 20, 40, 40);
```

### 6.2 Enemy Death Burst

When enemy dies, spawn 3–5 small triangles bursting outward:

```javascript
for (let i = 0; i < 5; i++) {
  const angle = (i / 5) * Math.PI * 2;
  const vx = Math.cos(angle) * 3;
  const vy = Math.sin(angle) * 3;
  
  const particle = new Particle(enemy.x, enemy.y, vx, vy, 0.3); // 0.3s life
  particles.push(particle);
}
```

### 6.3 Shield Break

When shield is hit or expires:

```javascript
// Radial shockwave
for (let i = 0; i < 12; i++) {
  const angle = (i / 12) * Math.PI * 2;
  ctx.strokeStyle = `rgba(0, 255, 255, ${0.7 - t})`;
  ctx.beginPath();
  ctx.arc(player.x, player.y, 20 + t * 50, angle, angle + 0.3);
  ctx.stroke();
}
```

### 6.4 Pickup Vacuum

When player enters pickup magnetism range, pickups move toward player:

```javascript
const dx = player.x - pickup.x;
const dy = player.y - pickup.y;
const dist = Math.sqrt(dx * dx + dy * dy);

if (dist < 100) {
  pickup.vx += (dx / dist) * 0.2;
  pickup.vy += (dy / dist) * 0.2;
}
```

---

## 7. Mobile Safe-Areas & Responsive Design

### 7.1 Safe-Area Meta Tags

```html
<meta name="viewport" 
      content="width=device-width, initial-scale=1, viewport-fit=cover">
```

### 7.2 CSS Safe-Area Padding

```css
body {
  padding: env(safe-area-inset-top)
           env(safe-area-inset-right)
           env(safe-area-inset-bottom)
           env(safe-area-inset-left);
}

canvas {
  max-width: calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right));
  max-height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
}
```

### 7.3 Touch-Friendly UI

- **Button Min Size:** 44×44 px (iOS Human Interface Guidelines)
- **Spacing:** 8 px gap between interactive elements
- **Tap Target:** Outlined boxes with 2–3 px border, not thin text links

---

## 8. Font & Typography

### 8.1 Font Family

- **Primary:** Monospace (e.g., `monospace`, `'Courier New'`, or web font `'Roboto Mono'`)
- **Fallback:** System monospace (`-apple-system-ui-monospace`, then `monospace`)
- **Size:**
  - HUD Labels: 12–14 px
  - UI Panel Titles: 16–18 px
  - Body Text: 12 px
  - Wave Counter: 24–32 px (large, prominent)

**CSS:**

```css
body {
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  line-height: 1.4;
  letter-spacing: 0.5px;
}

.ui-title {
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.wave-counter {
  font-size: 32px;
  font-weight: bold;
  color: #00ffff;
  text-shadow: 0 0 8px rgba(0, 255, 255, 0.8);
}
```

---

## 9. Sprite & Asset Sheet

For optimal performance, all shapes are drawn in code (no raster assets). However, a reference sprite sheet can be maintained:

### 9.1 Shape Reference (Grid Layout)

```plaintext
Sprite Sheet: 256×256 px, 16×16 px per cell

(0,0) Player Dart    (1,0) Player Trident  (2,0) Player Vectorwing
(0,1) Triangle Enemy (1,1) Square Enemy    (2,1) Hexagon Enemy
(0,2) Diamond Enemy  (1,2) Prime Hex       (2,2) Prime Tetra
... etc.
```

**Asset Naming:**

- `player_dart.svg`
- `player_trident.svg`
- `enemy_triangle.svg`
- `pickup_credit.svg`
- `boss_prime_hex.svg`

---

## 10. Cross-References

- **Game Design:** See [01-Game-Design-Document.md](01-Game-Design-Document.md) for mechanics
- **Technical Rendering:** See [02-Technical-Architecture.md](02-Technical-Architecture.md) for Canvas API usage
- **Audio:** See [04-Audio-Strategy.md](04-Audio-Strategy.md) for sound design
- **Testing:** See [Testing.md](Testing.md) for visual regression tests
