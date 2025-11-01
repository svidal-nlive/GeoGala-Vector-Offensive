// Player Ship Entity

import { Entity } from './Entity';
import { COLORS } from './utils/constants';

export class Player extends Entity {
  health = 100;
  maxHealth = 100;
  fireRate = 0.1; // seconds
  timeSinceLastFire = 0;
  aimAngle = 0;
  maxSpeed = 450; // pixels/sec (Chicken Invaders style - faster, more responsive)
  acceleration = 2200; // pixels/sec² (smooth acceleration)
  deceleration = 1800; // pixels/sec² (smooth stop)
  fireFlash = false;
  damageFlashTimer = 0;
  targetVx = 0;
  targetVy = 0;

  constructor() {
    super();
    this.radius = 15;
  }

  reset(x: number, y: number): void {
    super.reset(x, y, 0, 0);
    this.health = this.maxHealth;
    this.timeSinceLastFire = 0;
    this.aimAngle = 0;
    this.fireFlash = false;
    this.damageFlashTimer = 0;
    this.targetVx = 0;
    this.targetVy = 0;
  }

  update(dt: number): void {
    // Smooth inertia-based movement (Chicken Invaders style)
    // Accelerate towards target velocity
    const dvx = this.targetVx - this.vx;
    const dvy = this.targetVy - this.vy;
    
    if (Math.abs(dvx) > 0.1 || Math.abs(dvy) > 0.1) {
      // Accelerating
      const accelRate = this.acceleration * dt;
      this.vx += Math.sign(dvx) * Math.min(Math.abs(dvx), accelRate);
      this.vy += Math.sign(dvy) * Math.min(Math.abs(dvy), accelRate);
    } else {
      // Decelerate to stop
      const decelRate = this.deceleration * dt;
      if (Math.abs(this.vx) > decelRate) {
        this.vx -= Math.sign(this.vx) * decelRate;
      } else {
        this.vx = 0;
      }
      if (Math.abs(this.vy) > decelRate) {
        this.vy -= Math.sign(this.vy) * decelRate;
      } else {
        this.vy = 0;
      }
    }

    // Apply movement
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.timeSinceLastFire += dt;

    // Reset fire flash after 1 frame
    if (this.fireFlash) {
      this.fireFlash = false;
    }

    // Damage flash countdown
    if (this.damageFlashTimer > 0) {
      this.damageFlashTimer -= dt;
    }
  }

  updateInput(inputX: number, inputY: number): void {
    const inputMag = Math.sqrt(inputX * inputX + inputY * inputY);
    if (inputMag > 0) {
      // Set target velocity (normalized)
      this.targetVx = (inputX / inputMag) * this.maxSpeed;
      this.targetVy = (inputY / inputMag) * this.maxSpeed;
      this.aimAngle = Math.atan2(inputY, inputX);
    } else {
      // No input - target is to stop
      this.targetVx = 0;
      this.targetVy = 0;
    }
  }

  canFire(): boolean {
    return this.timeSinceLastFire >= this.fireRate;
  }

  fire(): void {
    this.timeSinceLastFire = 0;
    this.fireFlash = true;
  }

  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
    this.damageFlashTimer = 0.2; // Flash red for 200ms
    if (this.health <= 0) {
      this.alive = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.alive) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    // Smooth rotation to aim angle (15 frames max)
    ctx.rotate(this.aimAngle + Math.PI / 2);

    // Fire flash - bright white glow
    if (this.fireFlash) {
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 15;
    }

    // Damage flash - red tint
    const damageFlashing = this.damageFlashTimer > 0 && Math.floor(this.damageFlashTimer * 10) % 2 === 0;
    ctx.fillStyle = damageFlashing ? '#ff1744' : COLORS.ship;

    // Draw ship triangle
    ctx.beginPath();
    ctx.moveTo(0, -this.radius);
    ctx.lineTo(this.radius * 0.7, this.radius);
    ctx.lineTo(-this.radius * 0.7, this.radius);
    ctx.closePath();
    ctx.fill();

    // Shield visual (when health > 50%)
    if (this.health > this.maxHealth * 0.5) {
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }
}
