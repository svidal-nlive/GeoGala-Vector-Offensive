// Bullet Entity with Pooling

import { Entity } from './Entity';
import { COLORS } from './utils/constants';

export type BulletType = 'player' | 'enemy';

export class Bullet extends Entity {
  bulletType: BulletType = 'player';
  lifetime = 5; // seconds
  timeAlive = 0;

  constructor() {
    super();
    this.radius = 3;
  }

  reset(x: number, y: number, vx: number, vy: number, radius?: number): void {
    super.reset(x, y, vx, vy, radius);
    this.timeAlive = 0;
  }

  resetWithType(x: number, y: number, vx: number, vy: number, type: BulletType = 'player'): void {
    this.reset(x, y, vx, vy);
    this.bulletType = type;
  }

  update(dt: number): void {
    super.update(dt);
    this.timeAlive += dt;

    // Expire after lifetime
    if (this.timeAlive > this.lifetime) {
      this.alive = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.alive) return;

    ctx.fillStyle = this.bulletType === 'player' ? COLORS.bullet : COLORS.enemy;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
