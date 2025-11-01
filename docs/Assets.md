# Asset Manifest & Guidelines
**Geo Gala: Vector Offensive**

---

## 1. Asset Overview

**Total Budget:** <500 KB (all assets combined, uncompressed)

**Asset Categories:**
- Audio (music + SFX)
- Fonts (web fonts)
- Data (JSON configs)
- Code (bundled JS/CSS)

**No Image Assets:** All visuals rendered via Canvas 2D primitives

---

## 2. Audio Assets

### 2.1 Music Tracks

| Track Name | Duration | Format | Size (est.) | Usage |
|------------|----------|--------|-------------|-------|
| `menu_theme.mp3` | 2:00 loop | MP3 128kbps | ~2 MB | Main menu |
| `order_theme.mp3` | 1:30 loop | MP3 128kbps | ~1.5 MB | Order waves |
| `chaos_theme.mp3` | 1:30 loop | MP3 128kbps | ~1.5 MB | Chaos waves |
| `fractal_theme.mp3` | 1:30 loop | MP3 128kbps | ~1.5 MB | Fractal waves |
| `singularity_theme.mp3` | 1:30 loop | MP3 128kbps | ~1.5 MB | Singularity waves |
| `boss_theme.mp3` | 2:00 loop | MP3 128kbps | ~2 MB | Boss encounters |

**Total Music:** ~10 MB

**Compression Settings:**
- Format: MP3
- Bitrate: 128 kbps
- Sample rate: 44.1 kHz
- Channels: Stereo

**Looping:**
- All tracks must loop seamlessly
- Embed loop points in metadata

### 2.2 Sound Effects

| SFX Name | Duration | Format | Size | Trigger |
|----------|----------|--------|------|---------|
| `player_shoot.ogg` | 0.1s | OGG | 2 KB | Player fires |
| `enemy_hit.ogg` | 0.15s | OGG | 3 KB | Enemy takes damage |
| `enemy_explode.ogg` | 0.3s | OGG | 5 KB | Enemy destroyed |
| `player_hit.ogg` | 0.2s | OGG | 4 KB | Player damaged |
| `pickup_collect.ogg` | 0.15s | OGG | 3 KB | Pickup collected |
| `weapon_overheat.ogg` | 0.5s | OGG | 6 KB | Heat maxed out |
| `weapon_cooldown.ogg` | 0.3s | OGG | 4 KB | Heat cleared |
| `missile_launch.ogg` | 0.4s | OGG | 5 KB | Missile fired |
| `missile_lock.ogg` | 0.2s loop | OGG | 3 KB | Missile tracking |
| `nuke_charge.ogg` | 1.0s | OGG | 10 KB | Nuke charging |
| `nuke_explode.ogg` | 1.5s | OGG | 15 KB | Nuke detonation |
| `wave_clear.ogg` | 0.8s | OGG | 8 KB | Wave completed |
| `ui_click.ogg` | 0.1s | OGG | 2 KB | Button click |
| `ui_hover.ogg` | 0.05s | OGG | 1 KB | Button hover |

**Total SFX:** ~71 KB

**Naming Convention:**
- `{category}_{action}.ogg`
- Categories: player, enemy, weapon, pickup, ui, nuke
- Lowercase, underscores for spaces

### 2.3 Audio Attribution

**Licensing:**
- All audio must be royalty-free or original compositions
- Acceptable licenses: CC0, CC BY, CC BY-SA

**Recommended Sources:**
- Freesound.org (CC0/CC BY)
- OpenGameArt.org (CC0/CC BY)
- Custom synthesis (Bfxr, ChipTone for retro SFX)

**Attribution File:** `assets/audio/CREDITS.txt`
```
# Audio Credits

## Music
- menu_theme.mp3: [Composer Name] (CC BY 4.0)
  https://source-url.com

## Sound Effects
- player_shoot.ogg: Generated with Bfxr (CC0)
```

---

## 3. Font Assets

### 3.1 Typography

**Primary Font:** Orbitron (Google Fonts)
- Weights: Regular (400), Bold (700)
- Subset: Latin
- Format: WOFF2

**Monospace Font:** Share Tech Mono (Google Fonts)
- Weight: Regular (400)
- Subset: Latin
- Format: WOFF2

**Loading Strategy:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">
```

**Fallbacks:**
```css
font-family: 'Orbitron', 'Rajdhani', 'Exo 2', sans-serif;
font-family: 'Share Tech Mono', 'Courier New', monospace;
```

**Self-Hosted Option (Phase 2):**
- Download WOFF2 from Google Fonts
- Host in `/assets/fonts/`
- Total size: ~40 KB

---

## 4. Data Assets

### 4.1 Wave Definitions

**File:** `src/data/waves.js`
**Format:** ES module export
**Size:** ~10 KB

**Schema:**
```javascript
export const waves = [
  {
    id: 1,
    faction: 'order',
    formation: 'wedge',
    enemies: [
      { type: 'scout', count: 8, hp: 1 }
    ],
    spawnDelay: 0.1,
    music: 'order_theme'
  },
  // ... 30 waves total
];
```

### 4.2 Faction Configs

**File:** `src/data/factions.js`
**Size:** ~5 KB

```javascript
export const factions = {
  order: {
    color: '#00FF88',
    description: 'Precision, hierarchy, structural integrity',
    enemies: {
      scout: { hp: 1, speed: 150, shape: 'triangle' },
      phalanx: { hp: 3, speed: 100, shape: 'triangle', shield: true },
      spire: { hp: 5, speed: 80, shape: 'triangle', splits: 2 }
    }
  },
  // ... other factions
};
```

### 4.3 Weapon Cores (Phase 2)

**File:** `src/data/weapons.js`
**Size:** ~3 KB

```javascript
export const weaponCores = {
  pulse_cannon: {
    name: 'Pulse Cannon',
    fireRate: 15,
    heatPerShot: 3,
    damage: 1,
    special: 'high_rof'
  },
  // ... other cores
};
```

---

## 5. Code Assets

### 5.1 JavaScript Bundle

**Estimated Sizes (Production):**
| Module | Size (minified + gzipped) |
|--------|---------------------------|
| main.js + dependencies | ~30 KB |
| game.js + systems | ~40 KB |
| entities | ~20 KB |
| UI components | ~15 KB |
| Utilities | ~10 KB |
| Data configs | ~15 KB |
| **Total** | **~130 KB** |

**Build Target:** <200 KB gzipped

### 5.2 CSS Bundle

**Estimated Size:** ~10 KB (minified + gzipped)

**Includes:**
- `tokens.css` (design system)
- `main.css` (global styles)
- `hud.css` (HUD components)

---

## 6. Asset Loading Strategy

### 6.1 Loading Phases

**Phase 1: Critical (Blocking)**
- HTML structure
- CSS (inline for speed)
- Main JS bundle

**Phase 2: Deferred (Non-blocking)**
- Audio buffers (Web Audio)
- Fonts (FOFT pattern)

**Phase 3: Lazy (On-demand)**
- Music tracks (load per wave/faction)

### 6.2 Loading Screen

**Progress Indicators:**
```
Loading Geo Gala...
[████████░░] 80%

- Assets: 14/18
- Audio: 8/12
- Ready!
```

**Implementation:**
```javascript
class AssetLoader {
  constructor() {
    this.total = 0;
    this.loaded = 0;
  }
  
  async loadAll() {
    const audioFiles = [...music, ...sfx];
    this.total = audioFiles.length;
    
    for (const file of audioFiles) {
      await this.loadAudio(file);
      this.loaded++;
      this.updateProgress();
    }
  }
  
  updateProgress() {
    const percent = (this.loaded / this.total) * 100;
    document.getElementById('progress').style.width = `${percent}%`;
  }
}
```

---

## 7. Asset Optimization

### 7.1 Audio Optimization

**Tools:**
- Audacity (normalize, trim silence)
- FFmpeg (format conversion)

**Checklist:**
- [ ] Remove silence from start/end
- [ ] Normalize volume to -3dB
- [ ] Convert to MP3 (music) or OGG (SFX)
- [ ] Test loop points

### 7.2 Code Optimization

**Vite Build Settings:**
```javascript
// vite.config.js
export default {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        dead_code: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['lib1', 'lib2'] // if any
        }
      }
    }
  }
};
```

---

## 8. Asset Directory Structure

```
assets/
├── audio/
│   ├── music/
│   │   ├── menu_theme.mp3
│   │   ├── order_theme.mp3
│   │   ├── chaos_theme.mp3
│   │   ├── fractal_theme.mp3
│   │   ├── singularity_theme.mp3
│   │   └── boss_theme.mp3
│   ├── sfx/
│   │   ├── player_shoot.ogg
│   │   ├── enemy_hit.ogg
│   │   ├── enemy_explode.ogg
│   │   ├── player_hit.ogg
│   │   ├── pickup_collect.ogg
│   │   ├── weapon_overheat.ogg
│   │   ├── weapon_cooldown.ogg
│   │   ├── missile_launch.ogg
│   │   ├── missile_lock.ogg
│   │   ├── nuke_charge.ogg
│   │   ├── nuke_explode.ogg
│   │   ├── wave_clear.ogg
│   │   ├── ui_click.ogg
│   │   └── ui_hover.ogg
│   └── CREDITS.txt
├── fonts/ (if self-hosted)
│   ├── Orbitron-Regular.woff2
│   ├── Orbitron-Bold.woff2
│   └── ShareTechMono-Regular.woff2
└── README.md
```

---

## 9. Asset Versioning

**Cache-Busting Strategy:**
- Vite auto-appends content hash to filenames
- Example: `main.js` → `main.a4f2b9.js`

**Audio Versioning:**
- Manual versioning in filenames if updated
- Example: `menu_theme_v2.mp3`

---

## 10. Performance Budget

| Asset Type | Budget | Current | Status |
|------------|--------|---------|--------|
| **JS Bundle** | 200 KB | ~130 KB | ✅ Pass |
| **CSS Bundle** | 15 KB | ~10 KB | ✅ Pass |
| **Audio (Critical)** | 100 KB | ~71 KB | ✅ Pass |
| **Audio (Deferred)** | 10 MB | ~10 MB | ⚠️ Monitor |
| **Fonts** | 50 KB | ~40 KB | ✅ Pass |
| **Total (Initial Load)** | 400 KB | ~251 KB | ✅ Pass |

**Measurement:**
- Use Chrome DevTools Network panel
- Test on throttled 4G connection
- Target: <3s initial load time

---

## 11. Asset Checklist (Pre-Launch)

- [ ] All audio files licensed/attributed
- [ ] Music loops tested for seamless playback
- [ ] SFX normalized to consistent volume
- [ ] Fonts loaded with FOFT pattern
- [ ] Bundle size under 200 KB (gzipped)
- [ ] No unused assets in build
- [ ] Cache headers configured (1 year for hashed assets)
- [ ] CDN configured for audio (if applicable)

---

## 12. Asset Update Protocol

**Adding New Asset:**
1. Add file to appropriate `/assets/` subdirectory
2. Update this manifest with size/attribution
3. Import in relevant module
4. Test loading performance
5. Commit with message: `asset: add [name]`

**Replacing Asset:**
1. Compare file sizes (old vs. new)
2. Update attribution if source changed
3. Test in-game
4. Commit with message: `asset: update [name] - [reason]`

**Removing Asset:**
1. Remove file from `/assets/`
2. Remove references in code
3. Update manifest
4. Commit with message: `asset: remove [name] - unused`

---

**Version:** 1.0  
**Last Updated:** 2025-11-01  
**Status:** ✅ Approved for development
