# Style Guide
**Geo Gala: Vector Offensive**

---

## 1. Visual Direction

**Core Aesthetic:** Glowing vectors on dark backgrounds—*Geometry Wars* meets *Tron*

**Design Principles:**
1. **Clarity Over Spectacle:** Every visual element must serve gameplay readability
2. **Geometric Purity:** No organic shapes, no gradients (except glows)
3. **Neon Precision:** High-contrast outlines with chromatic glow effects
4. **Responsive Scaling:** All elements scale proportionally across devices

---

## 2. Color Palette

### 2.1 Primary Colors (Design Tokens)

```css
/* tokens.css */
:root {
  /* Backgrounds */
  --color-bg-void: #0A0E1A;        /* Deep space */
  --color-bg-grid: #151B2E;        /* Grid lines */
  
  /* Player */
  --color-player-primary: #00FFFF;  /* Cyan */
  --color-player-glow: #00D4FF;
  --color-player-damaged: #FF3366;  /* Magenta-red */
  
  /* Factions */
  --color-order: #00FF88;           /* Mint green */
  --color-chaos: #FF6B35;           /* Coral orange */
  --color-fractal: #8B5CF6;         /* Purple */
  --color-singularity: #FFD60A;     /* Gold */
  
  /* UI Elements */
  --color-ui-text: #E0E6F0;         /* Off-white */
  --color-ui-accent: #00FFFF;       /* Cyan */
  --color-ui-warning: #FFB800;      /* Amber */
  --color-ui-danger: #FF3366;       /* Magenta-red */
  --color-ui-success: #00FF88;      /* Mint green */
  
  /* Power-ups */
  --color-pickup-power: #00AAFF;    /* Blue */
  --color-pickup-heat: #00FFFF;     /* Cyan */
  --color-pickup-health: #00FF88;   /* Green */
  --color-pickup-missile: #FFD60A;  /* Gold */
  --color-pickup-score: #FFFFFF;    /* White */
}
```

### 2.2 Accessibility

**Colorblind Modes:**
- **Protanopia (Red-blind):** Replace red with high-contrast yellow
- **Deuteranopia (Green-blind):** Replace green with blue-cyan
- **Tritanopia (Blue-blind):** Replace blue with magenta

**Shape Coding (Supplement Color):**
- Player: Triangle (always)
- Order: Equilateral triangles
- Chaos: Irregular polygons (3-7 sides)
- Fractal: Hexagons
- Singularity: Rotating prisms (3D effect via rotation)

---

## 3. Typography

**Font Stack:**
```css
:root {
  --font-primary: 'Orbitron', 'Rajdhani', 'Exo 2', sans-serif;
  --font-mono: 'Share Tech Mono', 'Courier New', monospace;
}
```

**Type Scale:**
```css
:root {
  --text-xs: clamp(0.75rem, 2vw, 0.875rem);    /* 12-14px */
  --text-sm: clamp(0.875rem, 2.5vw, 1rem);     /* 14-16px */
  --text-base: clamp(1rem, 3vw, 1.125rem);     /* 16-18px */
  --text-lg: clamp(1.25rem, 4vw, 1.5rem);      /* 20-24px */
  --text-xl: clamp(1.5rem, 5vw, 2rem);         /* 24-32px */
  --text-2xl: clamp(2rem, 7vw, 3rem);          /* 32-48px */
  --text-3xl: clamp(3rem, 10vw, 4rem);         /* 48-64px */
}
```

**Usage:**
- **HUD Text:** `--font-mono`, `--text-sm`
- **Score Display:** `--font-primary`, `--text-xl`
- **Wave Clear Overlay:** `--font-primary`, `--text-3xl`
- **Menu Buttons:** `--font-primary`, `--text-lg`

---

## 4. Spacing System

**Geometric Progression (Base 8px):**
```css
:root {
  --space-1: 0.5rem;   /* 8px */
  --space-2: 1rem;     /* 16px */
  --space-3: 1.5rem;   /* 24px */
  --space-4: 2rem;     /* 32px */
  --space-6: 3rem;     /* 48px */
  --space-8: 4rem;     /* 64px */
  --space-12: 6rem;    /* 96px */
}
```

**Application:**
- HUD padding: `--space-2`
- Button spacing: `--space-3`
- Section gaps: `--space-6`

---

## 5. HUD Layout

### 5.1 Desktop (16:9 Landscape)

```
┌────────────────────────────────────────────┐
│ SCORE: 45,230    PWR: ▰▰▰▰▱▱▱  WAVE: 07   │
│ HP: ♥♥♡  HEAT: [▰▰▰▱▱▱▱▱]  COMBO: 2.3×   │
├────────────────────────────────────────────┤
│                                            │
│                                            │
│              [GAME CANVAS]                 │
│                                            │
│                                            │
├────────────────────────────────────────────┤
│  🚀 ×3      💣 ×1            [ESC] PAUSE   │
└────────────────────────────────────────────┘
```

**Dimensions:**
- Top HUD: 80px height
- Bottom bar: 60px height
- Canvas: Remaining vertical space

### 5.2 Mobile (9:16 Portrait)

```
┌──────────────────┐
│ 45,230  PWR: ▰▰▰ │  ← Compact header (60px)
│ ♥♥♡  [▰▰▰▱▱]    │
├──────────────────┤
│                  │
│                  │
│   [CANVAS]       │
│                  │
│                  │
│                  │
│                  │
├──────────────────┤
│   [JOYSTICK]     │  ← Touch zone (200px)
│                  │
│  🚀×3  💣×1  ☰   │
└──────────────────┘
```

**Touch Zones:**
- Joystick area: Bottom-left 40% of screen
- Fire button: Auto-fire (always on)
- Missile/Nuke: Bottom-right corner (80px buttons)

---

## 6. Visual Effects

### 6.1 Glow Rendering

**Canvas Implementation:**
```javascript
function applyGlow(ctx, color, intensity) {
  ctx.shadowBlur = 20 * intensity;
  ctx.shadowColor = color;
}

// Usage
applyGlow(ctx, '#00FFFF', 0.8);
ctx.strokeStyle = '#00FFFF';
ctx.lineWidth = 2;
ctx.stroke();
```

**Intensity Guidelines:**
- Player ship: 0.6 (idle) → 1.0 (firing)
- Enemies: 0.4 (default) → 0.8 (attacking)
- Power-ups: 0.8 (pulsing 0.6-1.0)
- Explosions: 1.0 (fade to 0 over 0.5s)

### 6.2 Particle Effects

**Explosion Particles:**
- Count: 8-12 particles
- Shape: Small triangles/lines
- Color: Entity color + white blend
- Velocity: Radial 100-300 px/s
- Lifespan: 0.3-0.6s

**Thruster Trail (Player):**
- Count: 2 particles/frame
- Shape: Small circles
- Color: Cyan fade to transparent
- Lifespan: 0.2s

### 6.3 Screen Shake

**Trigger Events:**
| Event | Intensity | Duration |
|-------|-----------|----------|
| Player hit | 10px | 0.15s |
| Nuke explosion | 20px | 0.4s |
| Boss phase transition | 15px | 0.3s |

**Implementation:**
```javascript
function screenShake(canvas, intensity, duration) {
  const startTime = performance.now();
  
  function shake() {
    const elapsed = performance.now() - startTime;
    if (elapsed > duration) {
      canvas.style.transform = 'translate(0, 0)';
      return;
    }
    
    const progress = 1 - (elapsed / duration);
    const x = (Math.random() - 0.5) * intensity * progress;
    const y = (Math.random() - 0.5) * intensity * progress;
    canvas.style.transform = `translate(${x}px, ${y}px)`;
    
    requestAnimationFrame(shake);
  }
  
  shake();
}
```

---

## 7. UI Components

### 7.1 Buttons

**Style:**
```css
.btn {
  font-family: var(--font-primary);
  font-size: var(--text-lg);
  color: var(--color-ui-text);
  background: transparent;
  border: 2px solid var(--color-ui-accent);
  padding: var(--space-2) var(--space-4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 0 10px var(--color-ui-accent);
}

.btn:hover {
  background: var(--color-ui-accent);
  color: var(--color-bg-void);
  box-shadow: 0 0 20px var(--color-ui-accent);
}

.btn:active {
  transform: scale(0.95);
}
```

**Variants:**
- Primary: Cyan border/glow
- Danger: Magenta-red border/glow
- Success: Mint green border/glow

### 7.2 Progress Bars

**Heat Bar:**
```html
<div class="bar-container">
  <div class="bar-fill" style="width: 60%"></div>
</div>
```

```css
.bar-container {
  width: 200px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--color-ui-text);
  position: relative;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, 
    var(--color-ui-success) 0%, 
    var(--color-ui-warning) 60%, 
    var(--color-ui-danger) 100%);
  transition: width 0.1s linear;
  box-shadow: 0 0 10px currentColor;
}
```

### 7.3 Power Indicators

**Power Level Display:**
```html
<div class="power-display">
  <span class="power-pip active"></span>
  <span class="power-pip active"></span>
  <span class="power-pip active"></span>
  <span class="power-pip"></span>
  <span class="power-pip"></span>
</div>
```

```css
.power-pip {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin: 0 2px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--color-ui-text);
  transform: rotate(45deg); /* Diamond shape */
}

.power-pip.active {
  background: var(--color-ui-accent);
  box-shadow: 0 0 8px var(--color-ui-accent);
}
```

---

## 8. Animation Guidelines

### 8.1 Timing Functions

```css
:root {
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

**Usage:**
- UI transitions: `--ease-out` (0.2s)
- Menu appear: `--ease-bounce` (0.4s)
- Damage flash: `--ease-in-out` (0.1s)

### 8.2 Wave Clear Animation

1. Freeze frame (0.1s)
2. Zoom text in (`--ease-bounce`, 0.3s)
3. Score count-up (0.5s)
4. Fade to next wave (0.2s)

---

## 9. Responsive Breakpoints

```css
/* Mobile portrait (default) */
@media (min-width: 768px) {
  /* Tablet */
  --text-base: 1.125rem;
}

@media (min-width: 1024px) {
  /* Desktop small */
  --text-base: 1.25rem;
}

@media (min-width: 1920px) {
  /* Desktop large */
  --text-base: 1.5rem;
}
```

**Canvas Aspect Ratios:**
- Mobile: 9:16 (portrait)
- Tablet: 3:4 or 16:9 (orientation-aware)
- Desktop: 16:9 (landscape)

**Scaling Strategy:**
```javascript
function resizeCanvas() {
  const container = document.getElementById('game-container');
  const rect = container.getBoundingClientRect();
  const aspectRatio = window.innerWidth > window.innerHeight ? 16/9 : 9/16;
  
  let width = rect.width;
  let height = width / aspectRatio;
  
  if (height > window.innerHeight) {
    height = window.innerHeight;
    width = height * aspectRatio;
  }
  
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
}
```

---

## 10. Iconography

**Emoji Fallbacks (for MVP):**
- Health: ♥ (U+2665)
- Missile: 🚀 (U+1F680)
- Nuke: 💣 (U+1F4A3)
- Menu: ☰ (U+2630)
- Pause: ⏸ (U+23F8)

**SVG Icons (Phase 2):**
- Convert emoji to geometric line-art SVGs
- 2px stroke, no fill
- Match faction colors

---

## 11. Accessibility Checklist

- [ ] Minimum 4.5:1 contrast ratio (WCAG AA)
- [ ] Touch targets ≥44×44 CSS pixels
- [ ] Text scales with system font size
- [ ] Reduced motion mode (disable particles, shake)
- [ ] Colorblind-safe palettes
- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] Screen reader labels for UI elements
- [ ] No flashing effects >3 per second

---

## 12. Design System Checklist

**Before implementing a new component:**
1. Check if existing token can be reused
2. Verify accessibility contrast
3. Test on mobile (360×640 minimum)
4. Confirm responsive scaling
5. Document in this guide

---

**Version:** 1.0  
**Last Updated:** 2025-11-01  
**Status:** ✅ Approved for development
