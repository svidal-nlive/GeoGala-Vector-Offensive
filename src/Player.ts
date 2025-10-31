// Player Ship Entity

import { Entity } from './Entity';
import { COLORS } from './utils/constants';

export class Player extends Entity {
  health = 100;
  maxHealth = 100;
  fireRate = 0.1; // seconds
  timeSinceLastFire = 0;
  aimAngle = 0;
  maxSpeed = 300; // pixels/sec

  constructor() {
    super();
    this.radius = 15;
  }

  reset(x: number, y: number): void {
    super.reset(x, y, 0, 0);
    this.health = this.maxHealth;
    this.timeSinceLastFire = 0;
    this.aimAngle = 0;
  }

  update(dt: number): void {
    // Base update (position delta applied externally)
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.timeSinceLastFire += dt;
  }

  updateInput(inputX: number, inputY: number): void {
    const inputMag = Math.sqrt(inputX * inputX + inputY * inputY);
    if (inputMag > 0) {
      this.vx = (inputX / inputMag) * this.maxSpeed;
      this.vy = (inputY / inputMag) * this.maxSpeed;
      this.aimAngle = Math.atan2(inputY, inputX);
    } else {
      this.vx = 0;
      this.vy = 0;
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
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.alive) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.aimAngle + Math.PI / 2);

    // Draw ship triangle
    ctx.fillStyle = COLORS.ship;
    ctx.beginPath();
    ctx.moveTo(0, -this.radius);
    ctx.lineTo(this.radius * 0.7, this.radius);
    ctx.lineTo(-this.radius * 0.7, this.radius);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}
