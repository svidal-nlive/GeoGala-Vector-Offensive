# Balance & Tuning Reference
**Geo Gala: Vector Offensive**

---

## 1. Core Balance Philosophy

**Pillars:**
1. **Fair Challenge:** Players should feel challenged but never cheated
2. **Visible Progress:** Power increases should feel impactful immediately
3. **Strategic Depth:** Multiple viable builds and playstyles
4. **Smooth Difficulty Curve:** Gradual escalation with periodic breakthroughs

**Target Metrics:**
- Wave 5 clear rate: 80% (first-time players)
- Wave 10 clear rate: 50% (first-time players)
- Wave 20 clear rate: 20% (experienced players)
- Wave 30 clear rate: <5% (expert players)

---

## 2. Player Stats

### 2.1 Movement

| Stat | Value | Notes |
|------|-------|-------|
| **Max Speed** | 400 px/s (mobile), 600 px/s (desktop) | Feels responsive without being twitchy |
| **Acceleration** | 2000 px/s² | Reach max speed in 0.2s |
| **Deceleration** | Instant | No inertia on input release |
| **Hitbox Radius** | 10px | Generous for fairness |
| **Visual Radius** | 20px | Larger than hitbox for clarity |

### 2.2 Health

| Stat | Value | Notes |
|------|-------|-------|
| **Starting HP** | 3 | Classic arcade standard |
| **Max HP** | 5 | With upgrades |
| **Invulnerability Frames** | 1.5s | After taking damage |
| **Shield Regen Delay** | 8s | Without taking damage |
| **Shield Regen Amount** | 1 HP | One-time per damage cycle |

### 2.3 Weapon (Base)

| Stat | Value | Notes |
|------|-------|-------|
| **Fire Rate** | 10 shots/s | 100ms between shots |
| **Projectile Speed** | 800 px/s | Fast enough to feel responsive |
| **Projectile Damage** | 1 | Base damage |
| **Projectile Lifetime** | 2s | Despawn if no hit |
| **Heat per Shot** | 5% (level 0), 2% (level 10) | Scales with power |
| **Heat Dissipation** | 15%/s | ~6.67s to cool from 100% |
| **Overheat Cooldown** | 2s | Forced downtime |

---

## 3. Power Level Scaling

### 3.1 Shot Pattern Progression

| Level | Shots | Pattern | Spread Angle | Heat/Shot | DPS |
|-------|-------|---------|--------------|-----------|-----|
| 0 | 1 | Straight | 0° | 5% | 10 |
| 1 | 2 | Spread | 15° | 4.5% | 20 |
| 2 | 2 | Spread | 15° | 4% | 20 |
| 3 | 2 | Spread | 15° | 3.5% | 20 |
| 4 | 3 | Spread | 30° | 3% | 30 |
| 5 | 3 | Spread | 30° | 2.8% | 30 |
| 6 | 3 | Spread | 30° | 2.6% | 30 |
| 7 | 5 | Fan | 60° | 2.5% | 50 |
| 8 | 5 | Fan | 60° | 2.3% | 50 |
| 9 | 5 | Fan | 60° | 2.1% | 50 |
| 10 | 7 | Wave | 90° | 2% | 70 |

**Design Notes:**
- Level 0→4: Gradual increase, manageable heat
- Level 4→7: Power spike, heat management critical
- Level 7→10: Endgame power, heat optimization required

### 3.2 Power-Up Drop Rates

| Enemy Type | Drop Chance | Power Crystal |
|------------|-------------|---------------|
| Common (Scout, Shard) | 40% | 60% of drops |
| Elite (Phalanx, Vortex) | 60% | 80% of drops |
| Boss | 100% | Guaranteed upgrade core |

**Power Crystal Mechanics:**
- Each crystal: +1 power level
- Max level: 10
- Level resets on death (arcade-style)

---

## 4. Enemy Stats

### 4.1 Order Faction (Triangles)

#### Scout
| Stat | Wave 1-5 | Wave 6-10 | Wave 11-20 | Wave 21-30 |
|------|----------|-----------|------------|------------|
| HP | 1 | 1 | 2 | 3 |
| Speed | 150 px/s | 180 px/s | 220 px/s | 300 px/s |
| Damage | 1 | 1 | 1 | 2 |
| Score | 100 | 120 | 150 | 200 |
| Attack Cooldown | 3s | 2.5s | 2s | 1.5s |

#### Phalanx
| Stat | Wave 1-5 | Wave 6-10 | Wave 11-20 | Wave 21-30 |
|------|----------|-----------|------------|------------|
| HP | 3 | 4 | 6 | 10 |
| Speed | 100 px/s | 120 px/s | 150 px/s | 200 px/s |
| Damage | 1 | 1 | 2 | 2 |
| Score | 200 | 250 | 300 | 400 |
| Shield Regen | 1 HP/3s | 1 HP/2.5s | 1 HP/2s | 1 HP/1.5s |

### 4.2 Chaos Faction (Polygons)

#### Shard
| Stat | Wave 1-5 | Wave 6-10 | Wave 11-20 | Wave 21-30 |
|------|----------|-----------|------------|------------|
| HP | 2 | 3 | 4 | 6 |
| Speed | 200 px/s | 240 px/s | 300 px/s | 400 px/s |
| Damage | 1 | 1 | 2 | 2 |
| Score | 150 | 180 | 220 | 300 |
| Shot Pattern | 3-way spread | 3-way spread | 5-way spread | 5-way spread |

### 4.3 Fractal Faction (Hexagons)

#### Seed
| Stat | Wave 1-5 | Wave 6-10 | Wave 11-20 | Wave 21-30 |
|------|----------|-----------|------------|------------|
| HP | 1 (per clone) | 2 (per clone) | 3 (per clone) | 4 (per clone) |
| Clone Count | 2 | 3 | 3 | 4 |
| Speed | 120 px/s | 150 px/s | 180 px/s | 220 px/s |
| Damage | 1 | 1 | 1 | 2 |
| Score | 200 (total) | 250 | 300 | 400 |

### 4.4 Singularity Faction (Prisms)

#### Phantom
| Stat | Wave 1-5 | Wave 6-10 | Wave 11-20 | Wave 21-30 |
|------|----------|-----------|------------|------------|
| HP | 5 | 8 | 12 | 20 |
| Speed | 150 px/s | 180 px/s | 220 px/s | 300 px/s |
| Damage | 2 | 2 | 3 | 3 |
| Score | 500 | 600 | 800 | 1200 |
| Teleport Cooldown | 5s | 4s | 3s | 2s |
| Phase Duration | 0.5s | 0.6s | 0.7s | 1s |

---

## 5. Wave Composition

### 5.1 Early Game (Waves 1-5)

**Wave 1:**
- 8× Order Scout
- Formation: Wedge
- Goal: Tutorial (simple pattern recognition)

**Wave 2:**
- 12× Order Scout
- Formation: Grid
- Goal: Introduce formation diversity

**Wave 3:**
- 6× Chaos Shard
- Formation: Swarm
- Goal: Introduce erratic movement

**Wave 4:**
- 4× Order Phalanx + 8× Scout
- Formation: Pincer
- Goal: Mix enemy types

**Wave 5 (Mini-Boss):**
- 1× Order Spire (splits into 2× Scout)
- 8× Scout (reinforcements)
- Goal: First multi-phase encounter

### 5.2 Mid Game (Waves 6-10)

**Wave 10 (Boss):**
- 1× "Tesseract Core" (Order faction)
- Phase 1: Invulnerable, spawns 12× Scout
- Phase 2: Core exposed (20 HP), beam attack
- Phase 3: Core damaged (10 HP), spawn 6× Phalanx
- Reward: Upgrade core drop

### 5.3 Late Game (Waves 11-20)

**Enemy Count Scaling:**
- Wave 11-15: 16-20 enemies
- Wave 16-20: 20-28 enemies

**Faction Mix:**
- 40% Order (reliable patterns)
- 30% Chaos (unpredictable)
- 20% Fractal (quantity threat)
- 10% Singularity (elite enemies)

### 5.4 Endgame (Waves 21-30)

**Wave 20 (Boss):**
- "Singularity Nexus"
- 50 HP, teleports, summons reinforcements

**Wave 30 (Final Boss):**
- "Convergence Point"
- Multi-faction hybrid
- 100 HP, all faction attack patterns
- Reward: Victory screen, max score bonus

---

## 6. Difficulty Modifiers

### 6.1 Difficulty Tiers

**Easy Mode:**
- Enemy HP: ×0.75
- Player HP: +1 (starts with 4)
- Power-up drop rate: +20%
- Score multiplier: ×0.8

**Normal Mode:**
- Baseline values

**Hard Mode:**
- Enemy HP: ×1.5
- Enemy speed: ×1.2
- Power-up drop rate: -20%
- Score multiplier: ×2.0

**Chaos Mode:**
- Random enemy types (ignore wave config)
- No power-ups drop
- Enemy HP: ×2
- Score multiplier: ×5.0

---

## 7. Scoring System

### 7.1 Base Score Values

| Action | Score |
|--------|-------|
| Destroy common enemy | 100–300 (tier-based) |
| Destroy elite enemy | 400–800 |
| Destroy boss segment | 1000 |
| Wave clear bonus | 500 |
| No-damage wave bonus | +1000 |
| Collect gem pickup | +1000 |

### 7.2 Combo Multiplier

| Consecutive Kills | Multiplier |
|-------------------|------------|
| 1-5 | 1.0× |
| 6-10 | 1.5× |
| 11-20 | 2.0× |
| 21-30 | 3.0× |
| 31-50 | 4.0× |
| 51+ | 5.0× (max) |

**Combo Rules:**
- +1 kill counter per enemy destroyed
- Reset if 2s gap between kills
- Reset if player takes damage

### 7.3 Rank Thresholds

| Rank | Score Required | Visual |
|------|----------------|--------|
| D | 0–10,000 | Gray |
| C | 10,000–50,000 | White |
| B | 50,000–150,000 | Cyan |
| A | 150,000–500,000 | Magenta |
| S | 500,000–1,000,000 | Gold |
| S+ | 1,000,000+ | Rainbow pulse |

---

## 8. Weapon Upgrade Cores (Phase 2)

### 8.1 Core Stats

| Core | Fire Rate | Heat/Shot | Special |
|------|-----------|-----------|---------|
| Pulse Cannon | 15/s | 3% | High ROF |
| Rail Spike | 3/s | 10% | Piercing |
| Fractal Burst | 8/s | 5% | Split on hit (1→3) |
| Singularity Beam | Continuous | 20%/s | Beam (hold to fire) |
| Prism Array | 10/s | 4% | Bounce off edges |

### 8.2 Synergy Nodes

| Node | Effect | Stack Limit |
|------|--------|-------------|
| Coolant Injector | +20% heat dissipation | 3 (60% total) |
| Magnet Field | +50% pickup range | 2 (100% total) |
| Shield Matrix | +1 max HP | 2 (+2 HP total) |
| Overdrive Core | +10% fire rate | 3 (+30% total) |
| Lucky Charm | +15% drop rate | 2 (+30% total) |

---

## 9. Tuning Checkpoints

**Pre-Launch Testing:**
- [ ] Wave 1-5: 80%+ completion rate (playtest group)
- [ ] Wave 10: 50%+ completion rate
- [ ] Average session length: 8-12 minutes
- [ ] 60 FPS maintained with 150+ entities (mobile)
- [ ] Combo system feels rewarding (visual + audio)

**Post-Launch Adjustments:**
- Monitor analytics for bottleneck waves
- Adjust enemy HP if clear rate <30% or >70%
- Tune combo reset timer based on average kill frequency

---

## 10. Balance Update Log

**Version 1.0 (Launch):**
- Initial values as documented

**Future Versions:**
- TBD based on telemetry

---

**Version:** 1.0  
**Last Updated:** 2025-11-01  
**Status:** ✅ Approved for development
