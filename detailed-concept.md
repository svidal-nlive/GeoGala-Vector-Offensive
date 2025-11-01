# GeoGala: Vector Offensive 👾🔺

Below is an outline you can actually hand to a dev (or use to make a prototype in HTML/Canvas like you’ve been doing). It keeps the *Galaga bones* (formation → attack runs → clear wave → next) but swaps aliens for geometric enemy factions, and it layers in **Chicken Invaders–level upgrade complexity**.

---

## 1. Core Pitch

* **Genre:** Vertical fixed-shooter (Galaga style), modernized
* **Theme:** Vector / geometric war — triangles, squares, hexes, prisms
* **Player Ship:** Stylized triangle fighter (base form), evolves into multi-wing / multi-core variants
* **Hook:** “Simple to shoot, absurdly deep to upgrade.” Every few stages you unlock a new weapon mod, ship module, or synergy.
* **Tone:** Clean, neon, readable — think “geometry arcade,” not “space greebles.”

---

## 2. Core Loop

1. **Wave loads:** enemy formation swoops in and “locks” into grid patterns (Galaga style).
2. **Attack phase:** enemies break formation, dive, shoot, use shape-specific abilities.
3. **Player clears wave** → earns **Credits** + **Alloy** + occasional **Blueprint/Chip drops**.
4. **Between-waves upgrade panel** (fast): pick 1 of 2–3 offers or bank resources.
5. **Every 5 waves:** mini-event (escort, bonus box, meteor corridor).
6. **Every 10 waves:** **Boss Shape** (big composite geometry).
7. **After boss:** bigger upgrade screen (like Chicken Invaders armory).

---

## 3. Enemy Design – “Shape Families”

Make the shapes **mean something** so players learn silhouette = behavior.

1. **Triangles (Strikers)**

   * Fast, dive-bomb, low HP
   * Often appear in Vs or arrows
   * Special: “Vector Rush” (3 dive in sequence)

2. **Squares (Defenders)**

   * Slow, high HP, sometimes shield nearby shapes
   * Wall formations
   * Special: “Facet Shield” (front faces block shots)

3. **Hexagons (Artillery)**

   * Mid HP, shoot radial or rotating bullets
   * Sometimes spin to change weak point
   * Special: “Hex Pulse” (AOE ring bullet)

4. **Diamonds/Rhombi (Support)**

   * Buff nearby enemies (speed, fire rate, shield)
   * Prioritized targets

5. **Composite Shapes / Bosses**

   * Built from multiple primitives (e.g. hex core + 4 rotating triangles)
   * Breaks apart into smaller shapes when damaged — Galaga “split” homage

---

## 4. Player Ship – Triangle Lineage

Base ship is a triangle, but we give it **slots**.

* **Base Stats:** Fire rate, projectile speed, move speed, hull, shields
* **Hardpoints:**

  1. **Nose slot** (always forward fire, can become laser/rail/shotgun)
  2. **Wing L/R slots** (optional side cannons / drones / missile pods)
  3. **Core slot** (passives: overheat reduction, magnet, shield regen)
  4. **Aux slot** (special: slow field, emp burst, reflect shield)

**Evolution tiers (cosmetic + functional):**

1. **Mk I – Dart** (single triangle, 1 main gun)
2. **Mk II – Trident** (split nose, 2 main barrels, 1 aux)
3. **Mk III – Vectorwing** (adds floating mini-tri drones that mirror fire)
4. **Mk IV – Prism** (fan fire + shield ring + overdrive)

Upgrades can switch the visual to “double triangle,” “inverted triangle,” or “stacked triangle,” each tied to a weapon style.

---

## 5. Weapons & Firing Styles (Chicken Invaders–level depth)

Instead of 1 linear upgrade, make **categories**:

### A. Primary Fire (choose 1 line, upgrade 6–8 times)

* **Linear Bolt** – classic pea shooter → twin → triple → rapid
* **Pulse Shot** – slower, bigger hitbox, good vs squares
* **Pierce Ray** – goes through enemies, lower ROF
* **Spread Shard** – 3–5 way, good for attack runs

### B. Element / Modifier Layer (attach to primary)

* **Plasma** (DOT / burn tick)
* **Kinetic** (bonus vs armored/square)
* **Volt** (chance to chain to nearby shape)
* **Fracture** (on kill, releases mini triangles = shrapnel)

### C. Fire Control

* **Focus Mode:** hold to reduce spread, increase damage
* **Overdrive:** fills as you kill → burst mode for 5s
* **Heat:** sustained fire increases damage but risks overheat (forces ceasefire)

So you can end up with stuff like:

> “Twin Pierce Ray + Volt + Overdrive”
> or
> “Wide Spread Shard + Plasma + Heat Sink Core”

---

## 6. Ship Upgrade System (the fun bit)

Let’s structure it like this:

1. **Wave Upgrades (temporary/run-based)**

   * Offered every wave/mini-event
   * Small bumps: +10% fire rate, +1 drone, +pickup radius
   * Rarity tiers (Common / Advanced / Vector)

2. **Workshop Upgrades (persistent/meta)**

   * Bought with Alloy between runs
   * Unlocks **new guns**, **new ship frames**, **new aux modules**
   * Example: “Unlock Hex-Disruptor,” “Enable Dual Aux Slots,” “Start run with +1 Drone”

3. **Synergy Nodes (conditional bonuses)**

   * If you equip **2 Plasma mods** + **Heat Sink Core** → “Thermal Cascade” (burn spreads)
   * If your build is 100% Kinetic → “Hullbreaker” (extra vs boss armor)
   * If you have **3 drone sources** → “Swarm Protocol” (drones circle and intercept bullets)

4. **Ship Mastery (long-term)**

   * Each ship frame levels up separately
   * Leveling unlocks alt-skins and a passive (e.g. “+5% credit gain on this frame”)

This mirrors Chicken Invaders’ “tons of stuff to buy,” but in a geometric/slot-based way.

---

## 7. Enemy Patterns (Galaga DNA)

* **Standard Entrance:** 3–5 enemy groups spiral from top and sides, then park in formation
* **Spearhead Pattern:** triangles rush to player lane, then retreat to top
* **Column Collapse:** squares descend in a wall; you must carve a gap
* **Orbit Guard:** hex artillery stays center, diamonds orbit and buff
* **Capture Variant (Homage):** a diamond support can “vector tag” your ship — if you don’t kill it, it “steals” 1 of your drone triangles; defeating it lets you **reclaim** the drone → or **double it** (like Galaga’s dual-ship!)

That last one is a **nice nostalgia nod**.

---

## 8. Bosses – “Primes”

Every 10 waves, spawn a **Prime Shape**.

* **Prime Hex** – rotating rings, weak point opens in phases
* **Prime Tetra** – 4 rotating triangles, each has different attack pattern
* **Prime Prism** – fires refracted beams that split into angles at mid-screen
* **Prime Obelisk** – long rectangular ship, slides horizontally, spawns support shapes

Bosses drop **Blueprints** → unlock new ship parts in workshop.

---

## 9. Economy & Drops

* **Credits:** quick, run-level, buy temp upgrades mid-run
* **Alloy (or Vectors):** rarer, used for permanent unlocks
* **Blueprint Chips:** only from bosses/events, unlock new weapon lines
* **Style Tokens (optional):** just for cosmetic ship triangles

---

## 10. Game Modes

1. **Arcade / Campaign:** classic, wave-based, boss every 10
2. **Endless Formation:** formations only, faster and faster
3. **Pattern Trainer:** (for dev/debug) load a formation to test weapon builds
4. **Challenge Runs:** “Squares Only,” “No Drones,” “Pulse Weapons Only”
5. **Daily Vector:** fixed seed, compare scores

(That Pattern Trainer maps perfectly to the “visual endpoint” idea you like for inspecting assets.)

---

## 11. Visual / UI Notes (to match your usual style)

* **Player = Triangle silhouette** with neon edge + subtle inner glow
* **Enemies = solid geometric primitives** with 1–2 accents (health ring, faction color)
* **Bullets = straight, readable, no noise**
* **Upgrade Screen = side or bottom slide-up panel** that pauses action
* **Color Coding:**

  * Player: cyan / teal
  * Hostile: magenta / red
  * Support/buff: amber
  * Drops: green

---

## 12. What Makes This “Not Just Galaga With Triangles”

* Formation → dive → reclaim mechanic = **Galaga**
* Slot-based ship, synergy nodes, multi-currency, elemental modifiers = **Chicken Invaders**
* Shape-readable enemy taxonomy = **your geometric aesthetic**
* Reclaiming stolen drones = **fun nostalgia twist**
