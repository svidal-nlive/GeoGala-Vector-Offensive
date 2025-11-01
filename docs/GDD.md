# Game Design Document (GDD)
**Geo Gala: Vector Offensive**

---

## 1. Game Overview

**Genre:** Arcade Fixed-Shooter  
**Core Loop:** Dodge enemy formations → Destroy waves → Collect power-ups → Upgrade weapons → Survive escalating difficulty  
**Session Length:** 8–15 minutes (casual), 30–60 minutes (hardcore)  
**Tone:** Abstract cosmic rivalry—a festival of shapes at war over symmetry itself

---

## 2. Core Mechanics

### 2.1 Player Ship (Triangle Fighter)

**Movement:**
- Free 360° movement within screen bounds (no wrapping)
- **Instant velocity response** (Chicken Invaders style - no acceleration delay)
- Max speed: 400 px/s (mobile), 600 px/s (desktop)
- **Gentle momentum on input release** (0.15s deceleration to 0, floaty arcade feel)
- Smooth damping factor: 0.85 per frame (exponential decay)

**Health:**
- 3 hit points (HP) at start
- Shield regenerates 1 HP after 8s without damage
- Visual feedback: ship outline color (green → yellow → red)

**Abilities:**
- **Primary Fire:** Auto-fire projectiles (tap/hold shoots continuously)
- **Missiles:** Limited-use homing projectiles (3 per wave, reset on wave clear)
- **Nuke:** Screen-clearing explosion (1 per 5 waves)

---

### 2.2 Weapon System

#### Power Levels (0–10)
| Level | Shot Count | Pattern | Heat/Shot |
|-------|------------|---------|-----------|
| 0 | 1 | Straight | 5% |
| 1–3 | 2 | Spread 15° | 4% |
| 4–6 | 3 | Spread 30° | 3% |
| 7–9 | 5 | Fan 60° | 2.5% |
| 10 | 7 | Wave pattern | 2% |

**Heat Mechanic:**
- Heat bar fills with each shot
- At 100% heat: weapon disabled for 2s cooldown
- Heat dissipates at 15%/s when not firing
- Visual: HUD bar + ship glow intensity

**Upgrade Cores (Phase 2):**
1. **Pulse Cannon:** High ROF, low damage
2. **Rail Spike:** Piercing shots
3. **Fractal Burst:** Projectiles split on hit
4. **Singularity Beam:** Continuous laser
5. **Prism Array:** Bouncing shots

**Synergy Nodes (Passive):**
- **Coolant Injector:** +20% heat dissipation
- **Magnet Field:** +50% pickup range
- **Shield Matrix:** +1 max HP
- **Overdrive Core:** +10% fire rate

---

### 2.3 Enemy Factions

#### Order Faction (Triangles)
- **Behavior:** Precise formations, synchronized dives
- **Attacks:** Single straight shots
- **HP:** 1
- **Score:** 100 pts
- **Variants:**
  - Scout (small, fast)
  - Phalanx (medium, shield regen)
  - Spire (large, splits into 2 scouts)

#### Chaos Faction (Irregular Polygons)
- **Behavior:** Erratic movement, unpredictable angles
- **Attacks:** Spread shots (3-way)
- **HP:** 2
- **Score:** 150 pts
- **Variants:**
  - Shard (tumbles randomly)
  - Vortex (spirals while shooting)

#### Fractal Faction (Hexagons)
- **Behavior:** Clone on death (1 → 2 smaller)
- **Attacks:** Slow homing shots
- **HP:** 1 (each clone)
- **Score:** 200 pts (full destroy)
- **Variants:**
  - Seed (spawns 3 clones)
  - Lattice (forms defensive grids)

#### Singularity Faction (Prisms/3D projections)
- **Behavior:** Warp in/out, teleport dash
- **Attacks:** Beam sweeps
- **HP:** 5
- **Score:** 500 pts
- **Variants:**
  - Phantom (phases through shots)
  - Nexus (summons reinforcements)

---

### 2.4 Wave Patterns

**Wave Structure:**
1. **Formation Entry:** Enemies glide into position (2s)
2. **Attack Phase:** Break formation, dive toward player (8–15s)
3. **Cleanup:** Stragglers remain until destroyed
4. **Clear Bonus:** +500 pts × combo multiplier

**Formation Types:**
- **Wedge:** V-shape, sequential dives
- **Grid:** 4×4 block, synchronized horizontal sweeps
- **Spiral:** Enemies circle inward
- **Pincer:** Two wings flank from sides
- **Swarm:** No formation, immediate aggression

**Boss Waves (Every 10 Waves):**
- Large geometric construct (e.g., "Tesseract Core")
- Multi-phase fight (destroy segments → core exposed)
- Unique attack patterns per faction
- Reward: Guaranteed upgrade core drop

---

### 2.5 Power-Up System

**Collectibles (Drop from enemies):**
- **Power Crystal (Blue):** +1 power level
- **Heat Sink (Cyan):** Instant heat clear
- **Repair Kit (Green):** +1 HP
- **Missile Pack (Yellow):** +2 missiles
- **Score Gem (White):** +1000 pts

**Drop Rates:**
| Enemy Type | Power | Heat Sink | Repair | Missile | Gem |
|------------|-------|-----------|--------|---------|-----|
| Common | 40% | 20% | 5% | 10% | 25% |
| Elite | 60% | 15% | 10% | 10% | 5% |
| Boss | 100% (Upgrade Core) | — | 50% | 50% | — |

**Pickup Magnet:**
- Default radius: 50px
- With Synergy Node: 100px
- Items drift toward player when in range

---

### 2.6 Scoring System

**Base Score:**
- Enemy destroyed: Type base value
- Wave clear bonus: 500 pts
- No-damage bonus: +1000 pts

**Combo Multiplier:**
- Increases by 0.1× per consecutive kill (no 2s gap)
- Max: 5.0×
- Resets on player damage
- Visual: Floating multiplier text near player

**Rank Thresholds:**
| Rank | Score | Visual |
|------|-------|--------|
| D | 0–10k | Gray |
| C | 10k–50k | White |
| B | 50k–150k | Cyan |
| A | 150k–500k | Magenta |
| S | 500k+ | Gold pulsing |

---

## 3. Progression Systems

### 3.1 Intra-Run Progression
- Power level increases from pickups (resets on death)
- Missile/Nuke stockpiles carry between waves
- Combo multiplier persists until damage taken

### 3.2 Meta-Progression (Phase 3)
- **Unlock Tree:** New weapon cores, synergy nodes, ship skins
- **Currency:** Symmetry Shards (earned per wave clear)
- **Persistent Upgrades:**
  - Starting power level +1
  - Extra HP/missile capacity
  - Passive abilities (auto-magnet, heat tolerance)

---

## 4. Difficulty Curve

### Wave Scaling (1–30)
| Wave Range | Enemy HP | Enemy Speed | Formation Size | Attack Frequency |
|------------|----------|-------------|----------------|------------------|
| 1–5 | 1× | 1× | 8–12 | Low |
| 6–10 | 1.5× | 1.2× | 12–16 | Medium |
| 11–20 | 2× | 1.5× | 16–24 | High |
| 21–30 | 3× | 2× | 24–32 | Very High |

**Difficulty Tiers (Player-Selected):**
- **Easy:** Enemy HP −25%, Player HP +1
- **Normal:** Baseline values
- **Hard:** Enemy HP +50%, Score ×2
- **Chaos:** Random enemy types, no power-ups

---

## 5. Controls & Input

### Keyboard (Desktop)
- **Movement:** WASD or Arrow Keys
- **Fire:** Spacebar (hold) or Auto-fire toggle
- **Missile:** Shift
- **Nuke:** Ctrl
- **Pause:** Esc or P

### Touch (Mobile)
- **Movement:** Virtual joystick (left 40% of screen)
- **Fire:** Auto-fire enabled by default
- **Missile/Nuke:** Tap buttons (right side HUD)
- **Pause:** Three-finger tap or menu button

### Gamepad (Phase 2)
- **Movement:** Left stick
- **Fire:** Right trigger (RT) or A button
- **Missile:** Right bumper (RB)
- **Nuke:** Left bumper (LB)
- **Pause:** Start

---

## 6. UI/UX Flow

### Main Menu
```
┌─────────────────────────────┐
│    GEO GALA: VECTOR OFFENSIVE │
│                               │
│      [START GAME]             │
│      [CONTINUE]               │
│      [LEADERBOARD]            │
│      [SETTINGS]               │
│      [CREDITS]                │
└─────────────────────────────┘
```

### In-Game HUD
```
┌─────────────────────────────┐
│ SCORE: 45,230  PWR: ▰▰▰▱▱   │ ← Top bar
│ HP: ♥♥♡  HEAT: [▰▰▰▱▱▱]    │
├─────────────────────────────┤
│                               │
│        [GAME CANVAS]          │
│                               │
├─────────────────────────────┤
│  🚀×3    💣×1      [PAUSE]   │ ← Bottom bar (mobile)
└─────────────────────────────┘
```

### Wave Clear Screen
```
┌─────────────────────────────┐
│       WAVE 5 CLEARED!         │
│                               │
│   Score: 12,450               │
│   Combo: 3.2×                 │
│   No-Damage Bonus: +1000      │
│                               │
│   [Next Wave in 3s...]        │
└─────────────────────────────┘
```

---

## 7. Audio Design

### Music System (Phase 2)
- **Adaptive Layers:** Intensity scales with enemy count
- **Tracks per Faction:** Unique themes for Order/Chaos/Fractal/Singularity
- **Boss Themes:** High-energy remixes

### Sound Effects
| Event | Sound | Priority |
|-------|-------|----------|
| Player shoot | Pew (pitched per power) | Medium |
| Enemy destroyed | Pop + glass shatter | High |
| Power-up collect | Chime | High |
| Heat warning | Beep (80% heat) | High |
| Missile lock | Ping loop | Medium |
| Nuke activation | Charge + boom | Critical |
| Shield break | Crack | High |

---

## 8. Accessibility Features

- **Colorblind Modes:** Shape coding + icon markers
- **Reduced Motion:** Disable screen shake, particle effects
- **High Contrast:** Boost outline thickness, reduce glow
- **Text Scaling:** UI text respects OS font size
- **Pause Lock:** Must hold Pause for 1s to prevent accidental quits

---

## 9. Narrative & Lore (Light Touch)

**Framing Device:**
The "Geo Gala" is an ancient cosmic tournament where geometric civilizations compete for dimensional supremacy. Each faction represents a philosophical approach to existence:

- **Order (Triangles):** Precision, hierarchy, structural integrity
- **Chaos (Polygons):** Entropy, adaptation, creative destruction
- **Fractal (Hexagons):** Self-similarity, infinite recursion, growth
- **Singularity (Prisms):** Unity through collapse, transcendence

Players pilot a neutral arbiter ship enforcing symmetry by dismantling extremist formations. Minimal text, conveyed through brief faction intro cards before boss waves.

---

## 10. Balancing Philosophy

**Design Pillars:**
1. **Readability First:** Players should never die without understanding why.
2. **Risk-Reward:** High-damage weapons have drawbacks (heat, slow fire rate).
3. **Skill Ceiling:** Perfect play (no-damage runs) should feel achievable, not impossible.
4. **Variety Over Grind:** New mechanics every 5 waves, not stat inflation.

**Tuning Targets:**
- Average player clears Wave 10 within 5 attempts
- Expert players reach Wave 30+ with optimal builds
- No single weapon core dominates all scenarios

---

## 11. Future Expansions (Post-Launch)

- **Daily Challenges:** Pre-set waves with global leaderboards
- **Faction Campaigns:** Story mode for each faction (5 waves each)
- **Remix Mode:** Community-designed wave patterns
- **Ship Customization:** Cosmetic skins unlocked via achievements

---

**Version:** 1.0  
**Last Updated:** 2025-11-01  
**Status:** ✅ Approved for development
