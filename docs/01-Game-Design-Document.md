# GeoGala: Vector Offensive — Game Design Document

## 1. Elevator Pitch

**GeoGala: Vector Offensive** is a modern vertical fixed-shooter inspired by *Galaga* and *Chicken Invaders*. You pilot an evolving triangle starfighter against intelligent geometric factions—strikers, defenders, artillery, and support units—in rhythm-based waves. Each run layers deep weapon modifications, ship evolutions, and synergy nodes for near-endless build variety. **Simple to shoot, absurdly deep to upgrade.**

---

## 2. Core Gameplay Loop

### 2.1 Wave Structure

1. **Formation Entry** (0–3 sec)
   - Enemy formation swoops in from screen edges in synchronized groups
   - Spirals or arcs into a locked grid pattern (Galaga homage)
   - Player can attack during entry, but damage is reduced

2. **Active Phase** (10–30 sec typical)
   - Enemies break formation, execute shape-specific attack patterns
   - Triangles dive-bomb; squares wall; hexagons pulse; diamonds buff allies
   - Player maneuvers and shoots
   - Mini-objective events may appear (protect cargo, survive meteors, etc.)

3. **Clear or Failure**
   - **Clear:** All enemies destroyed → Wave Complete → earn Credits, Alloy, drops
   - **Failure:** Player hit points reach 0 → Run ends → Return to hangar, persist Alloy + unlocks

4. **Between-Wave Shop** (3–5 sec)
   - Pause action, slide-up panel with 2–3 upgrade offers
   - Option to bank resources or pick a temporary buff
   - Auto-advances if no choice made

5. **Cadence**
   - Every 5 waves: **Mini-Event** (bonus drops, escort mission, hazard corridor)
   - Every 10 waves: **Boss "Prime" Shape** (big composite geometry, 2–3 phase battle)
   - After boss: **Major Upgrade Screen** (bigger reward pool, permanent unlocks available)

---

## 3. Win & Loss Conditions

### 3.1 Per-Run (Session)

- **Win Wave:** Eliminate all 8–12 shapes in formation → Progress to Wave +1
- **Lose Wave:** Player hull hit 0 HP → Run ends, **Game Over**
- **Boss Victory:** Defeat Prime at Wave 10/20/30 → +50% resource gain, progress to Wave 11+
- **Boss Defeat:** Prime kills player → Run ends, no bonus

### 3.2 Meta (Hangar / Between Runs)

- **Goals:**
  - Reach Wave 20+ (unlock harder difficulty tier)
  - Defeat 3 bosses in one run (unlock "Prism" ship frame)
  - Accumulate 1000+ Alloy (unlock tier-2 workshop)
  - Unlock all 5 weapon lines (meta achievement)

---

## 4. Enemy Design — Shape Families

Each enemy type has **silhouette = behavior** rule so players learn at a glance.

### 4.1 Triangle (Striker)

- **Visual:** Equilateral triangle, point-forward, neon red outline
- **HP:** 1 (one-shot)
- **Behavior:**
  - Fast movement, dive-bomb patterns
  - Often appear in groups of 3–5 in arrow or "V" formations
  - Special ability: **Vector Rush** (3 triangles dive toward player lane in rapid sequence)
- **Attack:** Single bullet per dive, can be dodged
- **Drops:** 1 Credit per kill

### 4.2 Square (Defender)

- **Visual:** Square rotated 45° (diamond aspect), solid magenta, health ring
- **HP:** 3–4
- **Behavior:**
  - Slow, steady descent
  - Forms wall formations; prioritizes blocking player fire
  - Special ability: **Facet Shield** (up to 3 consecutive shots blocked if facing forward)
- **Attack:** Slow spread shot (3-way) at player
- **Drops:** 2 Credits per kill; occasional Alloy (5%)

### 4.3 Hexagon (Artillery)

- **Visual:** Regular hexagon, cyan outline, rotating weak-point indicator
- **HP:** 5–6
- **Behavior:**
  - Mid-speed, holds formation longer
  - Rotates to change weak point (top vs. side)
  - Special ability: **Hex Pulse** (radial burst of 6–8 bullets in a ring, once per phase)
- **Attack:** Radial or rotating shot pattern
- **Drops:** 3 Credits; 10% chance for Alloy

### 4.4 Diamond / Rhombus (Support)

- **Visual:** Rotated square (tall diamond), golden amber, buff aura
- **HP:** 2
- **Behavior:**
  - Orbits friendlies, grants buffs (speed +20%, fire rate +10%, shield +1)
  - Prioritized target (player should focus these first)
  - Special ability: **Vector Tag** (marks player ship; if not destroyed in 5s, "steals" 1 drone; defeating it reclaims drone as +1 or duplicates it for a burst)
- **Attack:** None (support only)
- **Drops:** 2 Credits; 15% chance for Alloy

### 4.5 Composite / Boss (Primes)

- Assembled from multiple primitives (e.g., hex core + 4 orbiting triangles)
- Breaks apart when hit → smaller shapes spawn (Galaga "split" homage)
- See **Section 7: Boss Design** for details

---

## 5. Player Ship — Triangle Lineage

### 5.1 Base Configuration

**Core Stats:**

- Fire Rate: 0.1s per shot (base)
- Projectile Speed: 8 units/frame
- Move Speed: 6 units/frame (keyboard), variable (analog stick)
- Hull: 3 hit points (base; shield can add +2)
- Shield: none (base; acquired via upgrade)

### 5.2 Hardpoint Slots

1. **Nose Slot** (Primary Fire)
   - Always active
   - Forward-only or focus-able to sides
   - Options: Linear Bolt, Pulse Shot, Pierce Ray, Spread Shard

2. **Wing L/R Slots** (Secondary)
   - Optional (unlocked in Mk II)
   - Mirrored cannons, drones, or missile pods
   - Can be toggled on/off

3. **Core Slot** (Passive Module)
   - Permanent effect: overheat reduction, magnet (pull nearby drops), shield regen, or cooldown
   - Only 1 active at a time

4. **Aux Slot** (Special / Tactical)
   - Rare active ability: slow field, EMP burst, reflect shield, or hyperspace dash
   - Rechargeable once per 30 waves or on pickup

### 5.3 Evolution Tiers (Cosmetic + Functional)

| Tier | Name | Description | Slots | Passive |
| --- | --- | --- | --- | --- |
| 1 | Dart | Single forward triangle, sleek | Nose only | None |
| 2 | Trident | Split nose (2 barrels), side accents | Nose + Wing L/R + Aux | Fire Rate +5% |
| 3 | Vectorwing | Adds 2 orbiting mini-triangle drones | Nose + Wing L/R + Core + Aux | Fire Rate +10%, mirrored fire |
| 4 | Prism | Fan-fire + shield ring + visual overdrive effect | Nose + Wing L/R + Core + Aux | Fire Rate +15%, shield gen +1/sec |

---

## 6. Weapon System — Deep Modification

### 6.1 Primary Fire Lines (Choose 1, Upgrade 6–8 Times)

| Line | Description | Strength | Weakness |
| --- | --- | --- | --- |
| **Linear Bolt** | Classic pea-shooter → twin → triple → rapid spread | Reliable, fast ROF scaling | Lower per-shot damage |
| **Pulse Shot** | Slow, large hitbox, good vs. squares | AOE, stops shields | Lower fire rate |
| **Pierce Ray** | Passes through enemies, lower ROF | Targets clusters | Slow, lower sustain DPS |
| **Spread Shard** | 3–5 way spread, good for attack runs | Covers area | Scatter, harder to focus |

### 6.2 Element / Modifier Layer (Attach to Primary)

Apply one modifier per primary line. Adds special effect on hit or kill.

| Modifier | Effect | Synergy |
| --- | --- | --- |
| **Plasma** | DOT / burn tick (1 damage/0.5s for 3s) | Stacks with Heat Core → Thermal Cascade |
| **Kinetic** | +25% vs. armored / square enemies | Pairs well with focused fire |
| **Volt** | Chance (30%) to chain to nearby shape | Chains in clusters |
| **Fracture** | On kill, release 3 mini-triangles (shrapnel projectiles) | Triggers Swarm Protocol if 3+ sources |

### 6.3 Fire Control Modes

- **Focus Mode:** Hold button to narrow spread, +15% damage per shot. Reduces ROF by 20%.
- **Overdrive:** Meter fills as you kill (1 point per 5 kills). At 100%, activate burst: 5 seconds of +50% fire rate, faster projectiles.
- **Heat System:** Sustained fire increases damage per shot (+5% per 2 consecutive shots) but risks overheat. Overheat forces 2s ceasefire; can be mitigated by Heat Sink Core module.

### 6.4 Example Builds

- **"Twin Pierce Ray + Volt + Overdrive":** High-skill, rewards perfect aim and kill streaks.
- **"Wide Spread Shard + Plasma + Heat Sink Core":** High sustain, DOT spreads via Thermal Cascade synergy.
- **"Pulse Shot + Kinetic + Focus Mode":** Boss-melting, slow but devastating vs. single targets.

---

## 7. Ship Upgrade System

### 7.1 Wave Upgrades (Temporary / Run-Based)

Offered every wave after clear. Pick 1 of 2–3 offers, or bank resources.

**Rarity Tiers:**

| Tier | Effect | Example |
| --- | --- | --- |
| **Common** | +10% stat, +1 minor item | +10% fire rate, +1 pickup radius, +1 score multiplier |
| **Advanced** | +20% stat or unlock variant | +20% move speed, unlock 2nd wing slot, +1 drone |
| **Vector** | Unique synergy or permanent unlock | Unlock new primary weapon line, add Aux slot, Thermal Cascade |

### 7.2 Workshop Upgrades (Persistent / Meta)

Purchased with **Alloy** between runs. Unlocks permanent, account-level upgrades.

**Typical Costs & Tiers:**

| Unlock | Alloy Cost | Effect |
| --- | --- | --- |
| Unlock Hex-Disruptor (gun) | 100 | New primary fire line available |
| Enable Dual Aux Slots | 250 | Carry 2 active Aux abilities |
| Start Run +1 Drone | 150 | Begin each run with 1 mini-triangle |
| Mk III Vectorwing Frame | 300 | Unlock 3rd ship evolution |
| Expanded Shield (Core) | 200 | Shield modules grant +1 HP |

### 7.3 Synergy Nodes (Conditional Bonuses)

Automatic bonuses when specific equipment combinations are equipped.

| Synergy | Trigger | Bonus |
| --- | --- | --- |
| **Thermal Cascade** | 2x Plasma mods + Heat Sink Core | Burn spreads to nearby shapes; burn damage +50% |
| **Hullbreaker** | 100% Kinetic build (all mods Kinetic) | +30% damage vs. boss armor |
| **Swarm Protocol** | 3+ drone sources active | Drones circle ship, intercept 1 incoming bullet/sec |
| **Overdrive Echo** | Overdrive mode + 2 fire-control mods | Burst mode lasts +3 sec (8s total) |
| **Fracture Chain** | Fracture modifier + 2x Kinetic | Mini-triangles inherit Kinetic bonus |

### 7.4 Ship Mastery (Long-Term)

Each ship frame (Dart, Trident, Vectorwing, Prism) levels separately:

- **Progression:** 10 waves per level (max level 20 = 200 waves piloted)
- **Unlock per level:**
  - Levels 1–5: Alternative skins (color, glow, shape variants)
  - Levels 6–10: +5% Credit gain with this frame
  - Levels 11–15: +2 pickup radius
  - Levels 16–20: Passive that applies to all frames (+1% XP all ships)

---

## 8. Enemies & Patterns (Galaga DNA)

### 8.1 Formation Patterns

| Pattern | Shape | Description | Difficulty |
| --- | --- | --- | --- |
| **Standard Entrance** | Mixed | 3–5 groups spiral from edges, park in grid | Normal |
| **Spearhead** | Triangles | Triangles rush to player lane, retreat to top | Hard |
| **Column Collapse** | Squares | Squares descend as wall; player must carve gap | Hard |
| **Orbit Guard** | Hex + Diamonds | Hex center, 2–3 diamonds orbit + buff | Hard |
| **Capture Variant** | Diamond-led | Diamond "tags" player ship; steals drone on timeout | Insane |

### 8.2 Capture Mechanic (Galaga Homage)

- A Support Diamond can cast **Vector Tag** on player ship
- If not destroyed within 5 seconds, it "steals" 1 drone (if player has any)
- Defeating the Diamond triggers **Reclaim:** player chooses to get the drone back OR duplicate it temporarily
- Creates a meaningful risk-reward and dynamic combat moment

---

## 9. Boss Design — Prime Shapes

Every 10 waves (Wave 10, 20, 30, etc.), spawn a **Prime** boss.

### 9.1 Prime Types

| Boss | Composition | Phases | Special | Drops |
| --- | --- | --- | --- | --- |
| **Prime Hex** | Rotating hex core + 3 rings | 3 (each ring rotates faster) | Weak point opens per phase | Blueprint: Pulse Cannon |
| **Prime Tetra** | Tetrahedron (4 triangles rotating) | 2 (rotation speed increases) | Each triangle has unique attack | Blueprint: Spread Shard |
| **Prime Prism** | Prism body, fires refracted beams | 4 (beams split further each phase) | Beams split at mid-screen, hard to dodge | Blueprint: Pierce Ray |
| **Prime Obelisk** | Long rectangular ship | 3 (spawns support diamonds, accelerates) | Horizontal slides, summons diamonds | Blueprint: New frame or Core |

### 9.2 Boss Rewards

- **Wave 10 Boss:** 200 Credits, 20 Alloy, 1 Blueprint Chip
- **Wave 20 Boss:** 400 Credits, 50 Alloy, 2 Blueprint Chips, rare skin unlock
- **Wave 30+ Boss:** 600 Credits, 100 Alloy, 3 Blueprint Chips, permanent upgrade token

---

## 10. Economy & Resource Drops

### 10.1 Currency

| Currency | Source | Use |
| --- | --- | --- |
| **Credits** | Every enemy kill (1–3 per shape) | Between-wave shop (temporary buffs) |
| **Alloy** | Boss kills (20–100), events (5–15) | Workshop (permanent unlocks) |
| **Blueprint Chips** | Boss-only drop (1–3 per boss) | Unlock new weapon lines or ship frames |
| **Style Tokens** | Rare drops (2%) | Cosmetic ship skins |

### 10.2 Drop Rate Table

| Enemy | Credits | Alloy (%) | Blueprint (%) |
| --- | --- | --- | --- |
| Triangle | 1 | — | — |
| Square | 2 | 5% | — |
| Hexagon | 3 | 10% | — |
| Diamond | 2 | 15% | — |
| Boss | 50–600 | Always 20–100 | Always 1–3 |
| Event Box | 100 | 30% | 5% |

---

## 11. Game Modes

### 11.1 Arcade / Campaign (Main)

- **Structure:** Wave-based, 10 waves per boss cycle
- **Progression:** Waves 1–10 (Boss) → Waves 11–20 (Boss) → Waves 21–30 (Boss) → Endless
- **Scaling:** Enemy HP, fire rate, count increase per wave
- **Goal:** Reach as far as possible; unlock workshop upgrades with Alloy

### 11.2 Endless Formation

- **Structure:** Only formation patterns, no bosses, faster spawn cadence
- **Scaling:** Formation complexity + enemy count increases per wave
- **Goal:** Survive as long as possible; high-score leaderboard
- **Reward:** Credits only (no Alloy)

### 11.3 Pattern Trainer (Dev / Debug)

- **Purpose:** Load a specific formation to test weapon builds
- **Access:** Dev menu or cheat command
- **Features:** Pause, slow-mo, instant-respawn, visual hitbox overlay

### 11.4 Challenge Runs

- **Fixed Seed:** Same enemy sequence every run
- **Constraints:** "Squares Only," "No Drones," "Pulse Weapons Only," "1 HP Mode"
- **Goal:** Leaderboard competition with fixed conditions
- **Reward:** Cosmetic badges, stat multiplier

### 11.5 Daily Vector

- **Reset:** Once per 24 hours, fixed seed generation
- **Structure:** 5 waves + 1 boss, fixed enemy pattern
- **Goal:** Daily high-score vs. global leaderboard
- **Reward:** 50 bonus Credits on completion

---

## 12. UI & Player Feedback

### 12.1 Pause & Upgrade Panel

- **Trigger:** Wave complete or mini-event
- **Layout:** Slide-up from bottom or slide-in from side
- **Content:** 2–3 upgrade offer cards (icon, name, stat delta, rarity badge)
- **Action:** Click/select to accept, or pass (auto-closes after 5s)

### 12.2 HUD Elements (In-Game)

- **Top-left:** Wave counter, boss health (if active)
- **Top-right:** Credits + Alloy balance, current weapon mod indicator
- **Bottom-center:** Player ship state (hull/shield bars)
- **Bottom-right:** Active Aux ability cooldown (if applicable)

### 12.3 Visual Feedback

- **Damage:** Enemy flashes red on hit, white on kill
- **Pickup:** Green glow on drop, satisfying vacuum into player
- **Upgrade Accept:** Chime + visual flash, mod icon appears in HUD
- **Boss Phase Change:** Screen shake, new music cue, health bar resets

---

## 13. Tone & Aesthetic

- **Style:** Neon arcade, geometric minimalism, "Galaga meets modern design"
- **Audio Palette:** Synth music (loops), crisp SFX (firing, impact, UI)
- **Color Coding:**
  - **Player:** Cyan / teal
  - **Hostile (Triangle/Square/Hex):** Magenta / red
  - **Support (Diamond):** Amber / gold
  - **Drops:** Green
  - **UI / Text:** Light gray or white with cyan accents
- **Motion:** Smooth, 60 FPS animations; readable bullet paths; no blur

---

## 14. Cross-References

- **Technical Details:** See [02-Technical-Architecture.md](02-Technical-Architecture.md) for systems design
- **Visual Specs:** See [03-Visual-Style-Guide.md](03-Visual-Style-Guide.md) for rendering & color tokens
- **Audio Specs:** See [04-Audio-Strategy.md](04-Audio-Strategy.md) for music & SFX structure
- **Input Handling:** See [05-Input-Spec.md](05-Input-Spec.md) for control mapping
- **Performance Targets:** See [Testing.md](Testing.md) for FPS budgets & QA matrix
