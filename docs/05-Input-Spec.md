# GeoGala: Vector Offensive — Input Specification

## 1. Input Methods & Devices

### 1.1 Priority Hierarchy

1. **Keyboard** (desktop primary)
2. **Gamepad** (console-like, cross-platform)
3. **Pointer/Touch** (desktop secondary, mobile primary)

Input handler processes all three; highest-priority active input wins.

---

## 2. Keyboard Mapping

### 2.1 Primary Controls

| Action | Key 1 | Key 2 | Notes |
| --- | --- | --- | --- |
| **Move Up** | `ArrowUp` | `KeyW` | Continuous, stackable with left/right |
| **Move Down** | `ArrowDown` | `KeyS` | Continuous, stackable |
| **Move Left** | `ArrowLeft` | `KeyA` | Continuous, stackable |
| **Move Right** | `ArrowRight` | `KeyD` | Continuous, stackable |
| **Fire** | `Space` | `Enter` | Continuous while held |
| **Aux Ability** | `Shift` | `E` | Single-tap or held (depends on ability) |
| **Focus Mode** | `Ctrl` (hold) | `F` (toggle) | Reduces spread, +damage |
| **Pause** | `Escape` | `P` | Toggles pause state |
| **Mute** | `M` | — | Toggles audio mute |

### 2.2 Diagonal Movement

When multiple direction keys are held, combine into single normalized vector:

```javascript
getKeyboardVector() {
  let x = 0, y = 0;

  if (this.keys['ArrowUp'] || this.keys['KeyW']) y -= 1;
  if (this.keys['ArrowDown'] || this.keys['KeyS']) y += 1;
  if (this.keys['ArrowLeft'] || this.keys['KeyA']) x -= 1;
  if (this.keys['ArrowRight'] || this.keys['KeyD']) x += 1;

  // Normalize to prevent faster diagonal movement
  if (x !== 0 && y !== 0) {
    const magnitude = Math.sqrt(x * x + y * y);
    x /= magnitude;
    y /= magnitude;
  }

  return { x, y };
}
```

### 2.3 Key State Tracking

Use `keydown` and `keyup` events to track pressed keys:

```javascript
document.addEventListener('keydown', (event) => {
  if (!event.repeat) { // Ignore key repeats from OS
    this.keys[event.code] = true;
  }
});

document.addEventListener('keyup', (event) => {
  this.keys[event.code] = false;
});
```

---

## 3. Pointer & Touch Input

### 3.1 Desktop Mouse Aiming

On desktop, player ship aims toward mouse cursor:

```javascript
document.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  this.pointerX = event.clientX - rect.left;
  this.pointerY = event.clientY - rect.top;
});

getPointerVector() {
  const player = gameState.player;
  const dx = this.pointerX - player.x;
  const dy = this.pointerY - player.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 1) return { x: 0, y: 0 }; // Dead zone
  return { x: dx / dist, y: dy / dist };
}
```

### 3.2 Mobile Touch Aiming

On mobile, player follows touch point; fire triggered by screen contact:

```javascript
document.addEventListener('touchstart', (event) => {
  const touch = event.touches[0];
  const rect = canvas.getBoundingClientRect();
  this.pointerX = touch.clientX - rect.left;
  this.pointerY = touch.clientY - rect.top;
  this.firing = true;
  event.preventDefault(); // Prevent default scroll
});

document.addEventListener('touchmove', (event) => {
  const touch = event.touches[0];
  const rect = canvas.getBoundingClientRect();
  this.pointerX = touch.clientX - rect.left;
  this.pointerY = touch.clientY - rect.top;
  event.preventDefault();
});

document.addEventListener('touchend', (event) => {
  this.firing = false;
  event.preventDefault();
});
```

### 3.3 Safe-Area & Notch Handling

On devices with notches/safe-areas, respect viewport boundaries:

```javascript
const dpr = window.devicePixelRatio || 1;
const vw = window.innerWidth;
const vh = window.innerHeight;

// Clamp pointer to safe area
this.pointerX = Math.max(0, Math.min(vw, this.pointerX));
this.pointerY = Math.max(0, Math.min(vh, this.pointerY));
```

---

## 4. Gamepad Input

### 4.1 Gamepad API Setup

```javascript
class GamepadInput {
  constructor() {
    this.gamepad = null;
    this.previousButtons = new Array(17).fill(false);

    window.addEventListener('gamepadconnected', (e) => {
      console.log('Gamepad connected:', e.gamepad);
      this.gamepad = e.gamepad;
    });

    window.addEventListener('gamepaddisconnected', (e) => {
      console.log('Gamepad disconnected:', e.gamepad);
      this.gamepad = null;
    });
  }

  update() {
    if (!this.gamepad) {
      // Poll manually in RAF loop
      const gamepads = navigator.getGamepads();
      this.gamepad = gamepads[0]; // Use first connected gamepad
    }

    if (!this.gamepad) return;

    // Update button states
    for (let i = 0; i < this.gamepad.buttons.length; i++) {
      this.previousButtons[i] = this.gamepad.buttons[i].pressed;
    }
  }

  getAnalogStick(stick = 'left') {
    if (!this.gamepad) return { x: 0, y: 0 };

    const startIndex = stick === 'left' ? 0 : 2;
    const x = this.gamepad.axes[startIndex];
    const y = this.gamepad.axes[startIndex + 1];

    // Apply deadzone (0.15 typical)
    const deadzone = 0.15;
    const magnitude = Math.sqrt(x * x + y * y);

    if (magnitude < deadzone) return { x: 0, y: 0 };

    // Normalize
    return {
      x: x / magnitude,
      y: y / magnitude,
    };
  }

  isButtonPressed(buttonIndex) {
    return this.gamepad?.buttons[buttonIndex]?.pressed || false;
  }

  getTrigger(triggerSide = 'right') {
    // RT: button 7, LT: button 6
    const index = triggerSide === 'right' ? 7 : 6;
    return this.gamepad?.buttons[index]?.value || 0;
  }
}
```

### 4.2 Gamepad Button Mapping (Standard Layout)

| Button | Index | Action |
| --- | --- | --- |
| A / Cross | 0 | Confirm / Fire (alt) |
| B / Circle | 1 | Cancel / Pause |
| X / Square | 2 | Aux Ability / Focus |
| Y / Triangle | 3 | — (reserved) |
| LB / L1 | 4 | — (reserved) |
| RB / R1 | 5 | — (reserved) |
| LT / L2 | 6 | — (reserved) |
| RT / R2 | 7 | Fire (primary) |
| Back / Select | 8 | Mute |
| Start | 9 | Pause |
| Left Stick Press | 10 | — (reserved) |
| Right Stick Press | 11 | — (reserved) |

### 4.3 Analog Input Mapping

| Input | Axis | Destination |
| --- | --- | --- |
| **Left Stick X** | 0 | Horizontal movement |
| **Left Stick Y** | 1 | Vertical movement |
| **Right Stick X** | 2 | Aiming (if supported) |
| **Right Stick Y** | 3 | Aiming (if supported) |
| **Left Trigger** | 4 | — (reserved) |
| **Right Trigger** | 5 | Fire intensity (0–1) |

---

## 5. Input Normalization

### 5.1 Unified Input Vector

Merge all input methods into single normalized state:

```javascript
class UnifiedInputHandler {
  constructor() {
    this.keyboard = new KeyboardInput();
    this.pointer = new PointerInput();
    this.gamepad = new GamepadInput();
  }

  getMovementVector() {
    // Priority: Keyboard > Gamepad > Pointer
    const kbVector = this.keyboard.getVector();
    if (kbVector.x !== 0 || kbVector.y !== 0) return kbVector;

    const gpVector = this.gamepad.getAnalogStick('left');
    if (Math.abs(gpVector.x) > 0.1 || Math.abs(gpVector.y) > 0.1) return gpVector;

    // On mobile, pointer aiming is automatic; on desktop, use for aim-follow
    return { x: 0, y: 0 };
  }

  getFiringState() {
    // Space or Gamepad RT (priority)
    return this.keyboard.isFiring() || 
           this.gamepad.getTrigger('right') > 0.5 ||
           this.gamepad.isButtonPressed(0); // A button
  }

  getAuxState() {
    return this.keyboard.auxPressed || 
           this.gamepad.isButtonPressed(2); // X button
  }

  update() {
    this.keyboard.update();
    this.gamepad.update();
    this.pointer.update();
  }
}
```

---

## 6. Deadzone & Input Filtering

### 6.1 Analog Stick Deadzone

Apply deadzone to analog inputs to prevent drift:

```javascript
applyDeadzone(value, deadzone = 0.15) {
  const magnitude = Math.abs(value);
  if (magnitude < deadzone) return 0;

  // Normalize and scale
  const normalized = (magnitude - deadzone) / (1 - deadzone);
  return Math.sign(value) * normalized;
}

// 2D deadzone (radial)
apply2DDeadzone(x, y, deadzone = 0.15) {
  const magnitude = Math.sqrt(x * x + y * y);
  if (magnitude < deadzone) return { x: 0, y: 0 };

  const normalized = (magnitude - deadzone) / (1 - deadzone);
  return {
    x: (x / magnitude) * normalized,
    y: (y / magnitude) * normalized,
  };
}
```

### 6.2 Input Smoothing (Optional)

For analog input on mobile, apply exponential smoothing:

```javascript
constructor() {
  this.smoothing = 0.8; // 0–1, higher = more smooth
  this.prevX = 0;
  this.prevY = 0;
}

getSmoothedVector(x, y) {
  this.prevX = this.prevX * this.smoothing + x * (1 - this.smoothing);
  this.prevY = this.prevY * this.smoothing + y * (1 - this.smoothing);
  return { x: this.prevX, y: this.prevY };
}
```

---

## 7. Input Feedback

### 7.1 Visual Feedback

When player fires, briefly scale up the player ship:

```javascript
onFire() {
  this.fireScale = 1.1; // 10% larger
  setTimeout(() => {
    this.fireScale = 1.0;
  }, 50); // Shrink back after 50 ms
}

draw(ctx) {
  ctx.scale(this.fireScale, this.fireScale);
  // Draw player
}
```

### 7.2 Audio Feedback

Every keypress on UI menus plays a confirmation SFX:

```javascript
document.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    audioManager.playSFX('ui-confirm');
  }
});
```

### 7.3 Haptic Feedback (Gamepad)

On compatible gamepads, trigger vibration on fire:

```javascript
onFire() {
  if (this.gamepad && this.gamepad.vibrationActuator) {
    this.gamepad.vibrationActuator.playEffect('dual-rumble', {
      startDelay: 0,
      duration: 50, // 50 ms
      strongMagnitude: 0.8,
      weakMagnitude: 0.4,
    });
  }
}
```

---

## 8. Mobile-Specific UX

### 8.1 Touch UI Buttons (Overlay)

Optional on-screen buttons for mobile:

```html
<div id="touch-controls" style="display: none;">
  <button id="fire-btn">Fire</button>
  <button id="aux-btn">Ability</button>
  <button id="pause-btn">Pause</button>
</div>
```

**Show on mobile, hide on desktop:**

```javascript
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
if (isMobile) {
  document.getElementById('touch-controls').style.display = 'flex';
}
```

### 8.2 Gesture Support (Future)

Optionally support swiping or pinching for alternative controls:

```javascript
document.addEventListener('swipe', (event) => {
  if (event.direction === 'up') {
    inputHandler.auxButton = true;
  }
});

document.addEventListener('pinch', (event) => {
  // Could map to zoom or special ability
});
```

---

## 9. Input Persistence & Rebinding

### 9.1 Remap Storage

Allow players to rebind controls (future):

```javascript
class InputConfig {
  constructor() {
    this.keyMap = JSON.parse(localStorage.getItem('keyMap')) || {
      moveUp: 'ArrowUp',
      moveDown: 'ArrowDown',
      moveLeft: 'ArrowLeft',
      moveRight: 'ArrowRight',
      fire: 'Space',
      aux: 'Shift',
    };
  }

  rebind(action, newKey) {
    this.keyMap[action] = newKey;
    localStorage.setItem('keyMap', JSON.stringify(this.keyMap));
  }
}
```

### 9.2 Settings UI

```html
<div id="input-settings">
  <label>Move Up: <input type="text" id="moveUp" readonly></label>
  <button onclick="rebindKey('moveUp')">Rebind</button>
  <!-- Repeat for other actions -->
</div>
```

---

## 10. Cross-References

- **Game Design:** See [01-Game-Design-Document.md](01-Game-Design-Document.md) for control actions
- **Architecture:** See [02-Technical-Architecture.md](02-Technical-Architecture.md) for input integration
- **Audio:** See [04-Audio-Strategy.md](04-Audio-Strategy.md) for feedback sounds
- **Testing:** See [Testing.md](Testing.md) for input latency targets
