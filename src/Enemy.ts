// Enemy Entity with Faction AI

import { Entity } from './Entity';
import { COLORS } from './utils/constants';

export type Faction = 'triangle' | 'square' | 'hexagon' | 'diamond';

export class Enemy extends Entity {
  faction: Faction = 'triangle';
  health = 20;
  maxHealth = 20;
  fireRate = 0.5; // seconds
  timeSinceLastFire = 0;
  loot = { scrap: 10, synergy: 0, rare: 0 };
  aiTimer = 0;
  aiAngle = 0;
  baseSpeed = 150;
  damageFlashTimer = 0;
  deathAnimTimer = 0;
  isDying = false;

  constructor(faction: Faction = 'triangle') {
    super();
    this.faction = faction;
    this.radius = 12;
    this.assignFactionStats();
  }

  private assignFactionStats(): void {
    switch (this.faction) {
    case 'triangle':
      this.maxHealth = 20;
      this.health = 20;
      this.fireRate = 0.5;
      this.loot = { scrap: 10, synergy: 0, rare: 0 };
      break;
    case 'square':
      this.maxHealth = 30;
      this.health = 30;
      this.fireRate = 0.4;
      this.loot = { scrap: 15, synergy: 1, rare: 0 };
      break;
    case 'hexagon':
      this.maxHealth = 40;
      this.health = 40;
      this.fireRate = 0.3;
      this.loot = { scrap: 20, synergy: 2, rare: 0 };
      break;
    case 'diamond':
      this.maxHealth = 50;
      this.health = 50;
      this.fireRate = 0.2;
      this.loot = { scrap: 25, synergy: 3, rare: 1 };
      break;
    }
  }

  reset(x: number, y: number, vx: number, vy: number): void {
    super.reset(x, y, vx, vy);
    this.health = this.maxHealth;
    this.timeSinceLastFire = 0;
    this.aiTimer = 0;
    this.aiAngle = 0;
    this.damageFlashTimer = 0;
    this.deathAnimTimer = 0;
    this.isDying = false;
    this.assignFactionStats();
  }

  update(dt: number): void {
    this.timeSinceLastFire += dt;
    this.aiTimer += dt;

    // Damage flash countdown
    if (this.damageFlashTimer > 0) {
      this.damageFlashTimer -= dt;
    }

    // Death animation
    if (this.isDying) {
      this.deathAnimTimer += dt;
      if (this.deathAnimTimer >= 0.3) {
        this.alive = false;
      }
      return;
    }

    // Apply faction-specific AI patterns
    this.updateAI(dt);

    // Movement
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  private updateAI(dt: number): void {
    switch (this.faction) {
    case 'triangle':
      // Linear downward movement (already set in reset)
      break;
    case 'square':
      // Sinusoidal horizontal + downward
      this.vx = Math.sin(this.aiTimer * 2) * 100;
      this.vy = this.baseSpeed;
      break;
    case 'hexagon':
      // Spiral descent
      this.aiAngle += dt * 2;
      this.vx = Math.cos(this.aiAngle) * 80;
      this.vy = this.baseSpeed * 0.8;
      break;
    case 'diamond':
      // Erratic movement (change angle every 1s)
      if (this.aiTimer % 1.0 < dt) {
        this.aiAngle = Math.random() * Math.PI * 2;
      }
      this.vx = Math.cos(this.aiAngle) * 120;
      this.vy = Math.sin(this.aiAngle) * 60 + this.baseSpeed * 0.5;
      break;
    }
  }

  canFire(): boolean {
    return this.timeSinceLastFire >= this.fireRate;
  }

  fire(): void {
    this.timeSinceLastFire = 0;
  }

  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
    this.damageFlashTimer = 0.2; // Flash for 200ms
    if (this.health <= 0) {
      this.isDying = true;
      this.deathAnimTimer = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.alive) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    // Death animation - shrink and fade
    if (this.isDying) {
      const progress = this.deathAnimTimer / 0.3;
      const scale = 1 - progress;
      ctx.scale(scale, scale);
      ctx.globalAlpha = 1 - progress;
    }

    // Damage flash - flicker every 50ms
    const shouldFlash = this.damageFlashTimer > 0 && Math.floor(this.damageFlashTimer * 20) % 2 === 0;
    ctx.fillStyle = shouldFlash ? '#ffffff' : COLORS.enemy;

    switch (this.faction) {
    case 'triangle':
      this.drawTriangle(ctx);
      break;
    case 'square':
      this.drawSquare(ctx);
      break;
    case 'hexagon':
      this.drawHexagon(ctx);
      break;
    case 'diamond':
      this.drawDiamond(ctx);
      break;
    }

    ctx.restore();
  }

  private drawTriangle(ctx: CanvasRenderingContext2D): void {
    // Pointing down
    ctx.beginPath();
    ctx.moveTo(0, this.radius);
    ctx.lineTo(this.radius, -this.radius);
    ctx.lineTo(-this.radius, -this.radius);
    ctx.closePath();
    ctx.fill();

    // White outline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  private drawSquare(ctx: CanvasRenderingContext2D): void {
    // Rotated 45 degrees
    ctx.save();
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
    
    // White outline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
    ctx.restore();
  }

  private drawHexagon(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * this.radius;
      const y = Math.sin(angle) * this.radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    // White outline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  private drawDiamond(ctx: CanvasRenderingContext2D): void {
    // Diamond on-point
    ctx.beginPath();
    ctx.moveTo(0, -this.radius);
    ctx.lineTo(this.radius * 0.7, 0);
    ctx.lineTo(0, this.radius);
    ctx.lineTo(-this.radius * 0.7, 0);
    ctx.closePath();
    ctx.fill();

    // White outline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}
