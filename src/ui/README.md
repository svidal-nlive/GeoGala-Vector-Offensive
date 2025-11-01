# UI Development Harness

Interactive testing environment for Geo Gala: Vector Offensive UI systems.

## 🚀 Quick Start

### Option 1: Using npm script (Recommended)
```bash
npm run dev:ui
```

This will:
- Start Vite dev server
- Automatically open your browser to the harness
- Enable hot module reloading (changes auto-refresh)

### Option 2: Manual Vite command
```bash
npx vite src/ui/dev-harness.html --open
```

### Option 3: Using any local server
```bash
# Python 3
python -m http.server 8000

# Node.js http-server
npx http-server -p 8000

# Then navigate to:
# http://localhost:8000/src/ui/dev-harness.html
```

> **Note**: You cannot open `dev-harness.html` directly in the browser (double-click or `file://` protocol) due to ES module CORS restrictions. You must use a local web server.

---

## 🎮 Controls

### Overlay Screens
- **Show Title Screen** - Display animated title with logo bounce
- **Show Pause Screen** - Display pause overlay
- **Show Game Over** - Display game over with stats
- **Show Upgrade Screen** - Display upgrade selection
- **Hide Overlay** - Close any active overlay

### HUD Elements
- **Lose Heart** - Trigger heart shatter animation (decreases HP)
- **Gain Heart** - Trigger heart gain animation (increases HP)
- **Increase Score** - Add random points (1K-6K)
- **Increase Heat** - Add 15% heat (triggers warning at 80%)
- **Increase Power** - Cycle power level (0-10)
- **Next Wave** - Increment wave counter with slide-in

### Particle Effects
- **Explosion** - Spawn 12-particle radial burst (random color)
- **Nuke** - Spawn 80-particle mega-blast (center screen)
- **Player Death** - Spawn 24 particles with gravity (bottom screen)
- **Bullet Trails** - Spawn 5 bullets with motion trails
- **Sparks** - Spawn collision impact sparks (random position)

### Debug & Utilities
- **Toggle Debug (F3)** - Show/hide FPS, particle count, entity count
- **Reset State** - Clear all state and particles

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `F3` | Toggle debug overlay |
| `Space` | Dismiss overlay (same as "Hide Overlay" button) |
| `Escape` | Show pause screen |

---

## 🧪 Testing Checklist

Use this harness to verify all UI functionality:

### Visual Tests
- [ ] Title screen logo bounces with elastic easing
- [ ] Subtitle fades in after 0.4s delay
- [ ] Start prompt blinks at correct rate
- [ ] Hearts render correctly (full/empty states)
- [ ] Heart shatter animation plays on HP loss
- [ ] Heart gain animation scales in from 0
- [ ] Heat bar changes color (cyan → yellow → red)
- [ ] Heat warning pulse activates at 80%
- [ ] Score count-up is smooth (not instant)
- [ ] Rank badge updates at thresholds (10K, 50K, 150K, 500K)
- [ ] Power level segments fill/unfill correctly
- [ ] Wave counter slides in from top

### Particle Tests
- [ ] Explosion particles radiate in all directions
- [ ] Nuke creates 80 particles with wider spread
- [ ] Player death particles fall with gravity
- [ ] Bullet trails follow projectile paths
- [ ] Collision sparks bounce off surface normal
- [ ] Particles fade out over lifetime
- [ ] Particle pool doesn't exceed 500

### Performance Tests
- [ ] Debug overlay shows 60 FPS consistently
- [ ] No frame drops with 200+ particles
- [ ] Score animation doesn't lag
- [ ] Multiple overlays transition smoothly

### Responsive Tests
- [ ] Resize browser window (desktop layout >768px)
- [ ] Shrink to mobile size (<768px width)
- [ ] Touch controls appear on mobile
- [ ] Virtual joystick renders correctly
- [ ] All text remains readable at all sizes

---

## 🐛 Known Issues / Limitations

1. **No Game Logic**: This is a visual testing harness only. No actual gameplay, collision detection, or game state management.

2. **Static Joystick**: The virtual joystick is rendered but not interactive (requires input system integration).

3. **Random Particles**: Some particle effects spawn at random positions for demo purposes.

4. **No Audio**: Sound effects are not implemented in this harness.

---

## 📊 Debug Overlay Info

When debug is enabled (F3), you'll see:

- **FPS**: Current frame rate (updated every 1 second)
- **Particles**: Active particle count (max 500)
- **Entities**: Simulated entity count (static value)
- **Wave**: Current wave number
- **Heat**: Current heat percentage
- **Power**: Current power level (0-10)

---

## 🔧 Troubleshooting

### "Failed to load module" or CORS error
**Solution**: You must use a web server. Run `npm run dev:ui` instead of opening the file directly.

### UI elements not visible
**Solution**: Check browser console for errors. Ensure all files exist:
- `src/ui/UIManager.js`
- `src/ui/HUD.js`
- `src/ui/Overlay.js`
- `src/ui/ParticleSystem.js`

### Fonts not loading
**Solution**: Check internet connection (fonts load from Google Fonts CDN).

### Low FPS
**Solution**: 
- Close other browser tabs
- Disable browser extensions
- Check if hardware acceleration is enabled

---

## 📁 File Structure

```
src/ui/
├── dev-harness.html      ← You are here
├── UIManager.js          ← Main coordinator
├── HUD.js                ← Health, heat, score, etc.
├── Overlay.js            ← Title, pause, game over
└── ParticleSystem.js     ← VFX particles
```

---

## 🚀 Next Steps

Once UI testing is complete:

1. **Integrate into Game Engine**
   - Import `UIManager` in `src/game/engine.js`
   - Wire game state to HUD updates
   - Trigger particle effects from collision events

2. **Add Input Handling**
   - Connect virtual joystick to movement system
   - Wire action buttons to missile/nuke weapons

3. **Audio Integration**
   - Sync explosion sounds with particle effects
   - Play UI click sounds on button presses

4. **Performance Optimization**
   - Profile particle rendering with Chrome DevTools
   - Implement sprite batching if needed
   - Add object pooling for UI elements

---

**Happy Testing! 🎮**
