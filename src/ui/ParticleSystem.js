/**
 * Particle System - VFX Rendering Layer
 * Geo Gala: Vector Offensive
 * 
 * Handles all particle effects from Asset-Enhancement-Spec.md
 */

export class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    this.particles = [];
    this.maxParticles = 500; // Pool size
    
    // Particle presets from Visual-Asset-Atlas.md
    this.presets = {
      explosion: {
        count: 12,
        speed: { min: 60, max: 120 },
        lifetime: 0.6,
        size: { min: 3, max: 6 },
        color: '#FF6B35',
        fade: true
      },
      nuke: {
        count: 80,
        speed: { min: 100, max: 300 },
        lifetime: 1.2,
        size: { min: 4, max: 10 },
        color: '#FFD60A',
        fade: true
      },
      playerDeath: {
        count: 24,
        speed: { min: 50, max: 150 },
        lifetime: 1.5,
        size: { min: 4, max: 8 },
        color: '#00FFFF',
        fade: true,
        gravity: true
      },
      trail: {
        count: 1,
        speed: { min: 0, max: 20 },
        lifetime: 0.3,
        size: { min: 2, max: 4 },
        color: '#00D4FF',
        fade: true
      },
      spark: {
        count: 6,
        speed: { min: 40, max: 80 },
        lifetime: 0.4,
        size: { min: 2, max: 3 },
        color: '#FFB800',
        fade: true
      }
    };
  }
  
  update(dt) {
    // Update all particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      p.life -= dt * 0.001;
      
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      
      // Physics
      p.x += p.vx * dt * 0.001;
      p.y += p.vy * dt * 0.001;
      
      if (p.gravity) {
        p.vy += 200 * dt * 0.001; // Gravity acceleration
      }
      
      // Fade
      if (p.fade) {
        p.alpha = p.life / p.maxLife;
      }
    }
  }
  
  render() {
    this.ctx.save();
    
    for (const p of this.particles) {
      this.renderParticle(p);
    }
    
    this.ctx.restore();
  }
  
  renderParticle(p) {
    this.ctx.save();
    
    this.ctx.globalAlpha = p.alpha;
    
    if (p.shape === 'circle') {
      // Circle particle
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Glow
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.color;
      this.ctx.globalAlpha = p.alpha * 0.6;
      this.ctx.fill();
      
    } else if (p.shape === 'line') {
      // Trail line
      this.ctx.strokeStyle = p.color;
      this.ctx.lineWidth = p.size;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y);
      this.ctx.lineTo(p.x - p.vx * 0.05, p.y - p.vy * 0.05);
      this.ctx.stroke();
      
    } else if (p.shape === 'square') {
      // Square fragment
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.ctx.restore();
    }
    
    this.ctx.restore();
  }
  
  // ============================================
  // EMISSION METHODS
  // ============================================
  
  emit(presetName, x, y, options = {}) {
    const preset = this.presets[presetName];
    if (!preset) {
      console.warn(`Particle preset "${presetName}" not found`);
      return;
    }
    
    const count = options.count || preset.count;
    const color = options.color || preset.color;
    
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        break; // Pool full
      }
      
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const speed = this.randomRange(preset.speed.min, preset.speed.max);
      
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: this.randomRange(preset.size.min, preset.size.max),
        color,
        life: preset.lifetime,
        maxLife: preset.lifetime,
        alpha: 1.0,
        fade: preset.fade,
        gravity: preset.gravity || false,
        shape: options.shape || 'circle',
        rotation: Math.random() * Math.PI * 2
      });
    }
  }
  
  // Enemy explosion (default)
  emitExplosion(x, y, color = '#FF6B35') {
    this.emit('explosion', x, y, { color });
  }
  
  // Nuke blast
  emitNuke(x, y) {
    this.emit('nuke', x, y, { color: '#FFD60A' });
    
    // Ring shockwave (separate effect)
    this.emitShockwave(x, y);
  }
  
  // Player death
  emitPlayerDeath(x, y) {
    this.emit('playerDeath', x, y, { color: '#00FFFF' });
  }
  
  // Bullet trail
  emitTrail(x, y, vx, vy, color = '#00D4FF') {
    if (this.particles.length >= this.maxParticles) return;
    
    this.particles.push({
      x,
      y,
      vx: vx * -0.3, // Opposite direction
      vy: vy * -0.3,
      size: 2,
      color,
      life: 0.2,
      maxLife: 0.2,
      alpha: 0.8,
      fade: true,
      gravity: false,
      shape: 'circle',
      rotation: 0
    });
  }
  
  // Impact spark
  emitSparks(x, y, normalX, normalY) {
    const count = 6;
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) break;
      
      const spread = 0.6;
      const angle = Math.atan2(normalY, normalX) + (Math.random() - 0.5) * spread;
      const speed = this.randomRange(40, 80);
      
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2,
        color: '#FFB800',
        life: 0.3,
        maxLife: 0.3,
        alpha: 1.0,
        fade: true,
        gravity: false,
        shape: 'circle',
        rotation: 0
      });
    }
  }
  
  // Shockwave ring (expanding circle)
  emitShockwave(x, y) {
    // This is a special effect rendered separately
    // TODO: Implement expanding circle with fade
  }
  
  // Power-up collect sparkle
  emitCollectSparkle(x, y, color = '#FFD60A') {
    const count = 8;
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) break;
      
      const angle = (Math.PI * 2 * i) / count;
      const speed = 40;
      
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3,
        color,
        life: 0.5,
        maxLife: 0.5,
        alpha: 1.0,
        fade: true,
        gravity: false,
        shape: 'circle',
        rotation: 0
      });
    }
  }
  
  // Clear all particles
  clear() {
    this.particles = [];
  }
  
  // ============================================
  // UTILITY
  // ============================================
  
  randomRange(min, max) {
    return min + Math.random() * (max - min);
  }
  
  getParticleCount() {
    return this.particles.length;
  }
}
