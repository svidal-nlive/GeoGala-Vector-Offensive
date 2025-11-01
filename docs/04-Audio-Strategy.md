# GeoGala: Vector Offensive — Audio Strategy

## 1. Web Audio API Foundation

### 1.1 Context Setup

```javascript
class AudioManager {
  constructor() {
    // Create audio context (resume on user interaction)
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Master gain node
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.gain.value = 1.0;
    
    // Separate channels for music and SFX
    this.musicGain = this.ctx.createGain();
    this.sfxGain = this.ctx.createGain();
    
    this.musicGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    
    this.musicGain.gain.value = 0.6;
    this.sfxGain.gain.value = 0.8;
    
    // Buffer storage
    this.buffers = {};
    this.playing = {};
    
    this.muted = false;
  }

  async initialize() {
    // Resume context on first user interaction
    if (this.ctx.state === 'suspended') {
      document.addEventListener('click', () => {
        this.ctx.resume();
      }, { once: true });
    }
    
    // Load all audio assets
    await this.preloadAssets();
  }

  async preloadAssets() {
    const tracks = {
      'menu-loop': 'assets/audio/menu-loop.mp3',
      'arcade-loop': 'assets/audio/arcade-loop.mp3',
      'boss-phase-1': 'assets/audio/boss-phase-1.mp3',
      'boss-phase-2': 'assets/audio/boss-phase-2.mp3',
      'victory-stinger': 'assets/audio/victory-stinger.mp3',
      'defeat-stinger': 'assets/audio/defeat-stinger.mp3',
      'fire-pop': 'assets/audio/sfx/fire-pop.mp3',
      'impact-zap': 'assets/audio/sfx/impact-zap.mp3',
      'pickup-chime': 'assets/audio/sfx/pickup-chime.mp3',
      'ui-confirm': 'assets/audio/sfx/ui-confirm.mp3',
    };

    for (const [name, url] of Object.entries(tracks)) {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      this.buffers[name] = await this.ctx.decodeAudioData(arrayBuffer);
    }
  }
}
```

### 1.2 Audio Context Lifecycle

- **Resume on User Interaction:** Web Audio contexts start in "suspended" state on modern browsers. Resume on first click/touch.
- **Mute Toggle:** Fade master gain to 0 over 0.1s when muting.
- **Volume Normalization:** Prevent clipping by monitoring peak levels.

---

## 2. Music Structure & Loop Points

### 2.1 Loop Metadata

Each music track includes loop start and end times in metadata:

| Track | Duration | Loop Start | Loop End | Context |
| --- | --- | --- | --- | --- |
| **Menu Loop** | 180 sec | 0 sec | 180 sec | Menu screen (no loop needed) |
| **Arcade Loop** | 120 sec | 20 sec | 120 sec | Active wave (seamless loop every 100s) |
| **Boss Phase 1** | 90 sec | 10 sec | 90 sec | Boss entrance & first phase |
| **Boss Phase 2** | 80 sec | 8 sec | 80 sec | Boss second phase (faster tempo) |
| **Victory** | 8 sec | — | — | Stinger (no loop) |
| **Defeat** | 5 sec | — | — | Stinger (no loop) |

**Note:** Loop times encoded in MP3 metadata using GAPLESS info tags or stored in JSON sidecar.

### 2.2 Playback & Looping

```javascript
playMusic(name, loop = true) {
  // Stop current music if playing
  if (this.playing.music) {
    this.playing.music.stop();
    delete this.playing.music;
  }

  const buffer = this.buffers[name];
  if (!buffer) return;

  const source = this.ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(this.musicGain);

  if (loop) {
    source.loop = true;
    // Metadata stored separately or embedded in buffer
    const loopInfo = this.getLoopInfo(name);
    source.loopStart = loopInfo.start;
    source.loopEnd = loopInfo.end;
  }

  source.start();
  this.playing.music = source;
}

getLoopInfo(trackName) {
  const loopMap = {
    'arcade-loop': { start: 20, end: 120 },
    'boss-phase-1': { start: 10, end: 90 },
    'boss-phase-2': { start: 8, end: 80 },
  };
  return loopMap[trackName] || { start: 0, end: 0 };
}
```

---

## 3. SFX Design & Playback

### 3.1 SFX Catalog

| SFX | Duration | Pitch Variation | Trigger | Context |
| --- | --- | --- | --- | --- |
| **Fire Pop** | 50 ms | ±1 semitone | Every bullet fired | Weapon fire feedback |
| **Impact Zap** | 100 ms | ±2 semitones | Bullet hits enemy | Combat feedback |
| **Pickup Chime** | 200 ms | Fixed | Pickup collected | Reward feedback |
| **UI Confirm** | 100 ms | Fixed | Button click | Navigation |
| **Shield Break** | 150 ms | Fixed | Shield depletes | Damage event |
| **Boss Phase** | 300 ms | Fixed | Boss transitions | Boss event |
| **Wave Clear** | 400 ms | Fixed | All enemies dead | Victory |

### 3.2 Polyphonic SFX Playback

Allow multiple SFX to play simultaneously (e.g., firing + impact at same time):

```javascript
playSFX(name, pitch = 1.0) {
  const buffer = this.buffers[name];
  if (!buffer) return;

  const source = this.ctx.createBufferSource();
  const gainNode = this.ctx.createGain();

  source.buffer = buffer;
  source.playbackRate.value = pitch;
  source.connect(gainNode);
  gainNode.connect(this.sfxGain);

  source.start();

  // Auto-cleanup after buffer duration
  setTimeout(() => source.stop(), buffer.duration * 1000);
}

// Usage: fire with random pitch variation
fireSFX() {
  const pitchVariation = 0.95 + Math.random() * 0.1; // ±5%
  this.playSFX('fire-pop', pitchVariation);
}
```

### 3.3 SFX Triggering from Game Events

```javascript
// In collision detection
if (playerBullet.hits(enemy)) {
  audioManager.playSFX('impact-zap', 0.8 + Math.random() * 0.4);
  // Random pitch between 0.8–1.2x
}

// In pickup collection
if (player.hits(pickup)) {
  audioManager.playSFX('pickup-chime', 1.0);
}

// In wave progression
if (wave.allEnemiesDefeated()) {
  audioManager.playSFX('wave-clear', 1.0);
}
```

---

## 4. Music Transitions & State Management

### 4.1 State-Based Music Playback

```javascript
class MusicStateManager {
  constructor(audioManager) {
    this.audio = audioManager;
    this.currentState = 'menu';
  }

  transitionTo(newState) {
    const transitions = {
      'menu': ['arcade', 'loading'],
      'arcade': ['boss', 'victory', 'defeat', 'pause'],
      'boss': ['arcade', 'defeat', 'victory'],
      'victory': ['arcade'],
      'defeat': ['menu'],
      'pause': ['arcade', 'menu'],
    };

    if (!transitions[this.currentState]?.includes(newState)) {
      console.warn(`Invalid transition: ${this.currentState} → ${newState}`);
      return;
    }

    this.currentState = newState;
    this.playStateMusic();
  }

  playStateMusic() {
    const musicMap = {
      'menu': 'menu-loop',
      'arcade': 'arcade-loop',
      'boss': 'boss-phase-1',
      'victory': 'victory-stinger',
      'defeat': 'defeat-stinger',
    };

    const track = musicMap[this.currentState];
    const loop = this.currentState === 'arcade' || this.currentState === 'boss';
    this.audio.playMusic(track, loop);
  }
}
```

### 4.2 Phase Transitions (Boss)

When boss enters phase 2:

```javascript
onBossPhaseChange(phaseNumber) {
  // Fade out current music
  this.masterGain.gain.setTargetAtTime(0.3, this.ctx.currentTime, 0.1);

  // Play phase transition stinger
  setTimeout(() => {
    this.playSFX('boss-phase');
  }, 100);

  // After stinger, fade in new phase music
  setTimeout(() => {
    this.playMusic(`boss-phase-${phaseNumber}`, true);
    this.masterGain.gain.setTargetAtTime(1.0, this.ctx.currentTime, 0.2);
  }, 400);
}
```

---

## 5. Volume Mixing & Ducking

### 5.1 Multi-Channel Mix

```javascript
setMusicVolume(level) {
  // Level: 0.0–1.0
  this.musicGain.gain.setTargetAtTime(level, this.ctx.currentTime, 0.05);
}

setSFXVolume(level) {
  this.sfxGain.gain.setTargetAtTime(level, this.ctx.currentTime, 0.05);
}

setMasterVolume(level) {
  this.masterGain.gain.setTargetAtTime(level, this.ctx.currentTime, 0.1);
}
```

### 5.2 Audio Ducking (Optional)

When many SFX play simultaneously, reduce music volume:

```javascript
updateAudioDucking() {
  const activeSFXCount = this.countActiveSources(this.sfxGain);
  
  if (activeSFXCount > 5) {
    // Heavy SFX activity: duck music
    this.musicGain.gain.setTargetAtTime(0.3, this.ctx.currentTime, 0.1);
  } else {
    // Normal: restore music
    this.musicGain.gain.setTargetAtTime(0.6, this.ctx.currentTime, 0.1);
  }
}
```

---

## 6. Mute & Settings

### 6.1 Mute Toggle

```javascript
toggleMute() {
  this.muted = !this.muted;
  const targetGain = this.muted ? 0 : 1.0;
  this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
  
  // Persist to localStorage
  localStorage.setItem('audioMuted', this.muted.toString());
}
```

### 6.2 Settings Screen (UI)

```html
<div class="audio-settings">
  <label>Master Volume</label>
  <input type="range" id="master-volume" min="0" max="100" value="100">
  
  <label>Music Volume</label>
  <input type="range" id="music-volume" min="0" max="100" value="60">
  
  <label>SFX Volume</label>
  <input type="range" id="sfx-volume" min="0" max="100" value="80">
  
  <button id="mute-toggle">🔊 Mute</button>
</div>
```

```javascript
document.getElementById('master-volume').addEventListener('change', (e) => {
  audioManager.setMasterVolume(e.target.value / 100);
});

document.getElementById('mute-toggle').addEventListener('click', () => {
  audioManager.toggleMute();
  document.getElementById('mute-toggle').textContent = 
    audioManager.muted ? '🔇 Unmute' : '🔊 Mute';
});
```

---

## 7. Performance & Optimization

### 7.1 Preloading Strategy

Load all audio on application start (hangar/menu):

```javascript
async function initializeAudio() {
  try {
    await audioManager.preloadAssets();
    console.log('Audio assets loaded.');
  } catch (error) {
    console.error('Audio preload failed:', error);
    // Graceful degradation: game continues without audio
  }
}
```

### 7.2 Memory Management

Audio buffers are memory-intensive. Keep them in-memory for the duration of the session:

- **Total estimate:** 8–12 MB (10 tracks × ~1 MB each)
- **Streams:** Not streamed; buffers only, for predictable playback timing
- **Cleanup:** Only on application exit

### 7.3 Latency

- **Audio-to-Visual Sync:** Negligible on desktop (< 5 ms). On mobile, may vary.
- **Fire-to-Sound Latency:** Target < 50 ms. Achieved by triggering SFX synchronously with game event.

---

## 8. Cross-References

- **Game Design:** See [01-Game-Design-Document.md](01-Game-Design-Document.md) for gameplay events
- **Technical:** See [02-Technical-Architecture.md](02-Technical-Architecture.md) for system integration
- **Input:** See [05-Input-Spec.md](05-Input-Spec.md) for control feedback
- **Testing:** See [Testing.md](Testing.md) for audio quality metrics
