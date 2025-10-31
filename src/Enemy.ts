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
  }

  update(dt: number): void {
    super.update(dt);
    this.timeSinceLastFire += dt;
  }

  canFire(): boolean {
    return this.timeSinceLastFire >= this.fireRate;
  }

  fire(): void {
    this.timeSinceLastFire = 0;
  }

  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
    if (this.health <= 0) {
      this.alive = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.alive) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = COLORS.enemy;

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
    ctx.beginPath();
    ctx.moveTo(0, -this.radius);
    ctx.lineTo(this.radius, this.radius);
    ctx.lineTo(-this.radius, this.radius);
    ctx.closePath();
    ctx.fill();
  }

  private drawSquare(ctx: CanvasRenderingContext2D): void {
    ctx.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
  }

  private drawHexagon(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * this.radius;
      const y = Math.sin(angle) * this.radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  private drawDiamond(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.moveTo(0, -this.radius);
    ctx.lineTo(this.radius, 0);
    ctx.lineTo(0, this.radius);
    ctx.lineTo(-this.radius, 0);
    ctx.closePath();
    ctx.fill();
  }
}
