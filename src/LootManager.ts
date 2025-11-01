// Loot Manager — Resource drops and collection

import { Player } from './Player';

export type LootType = 'scrap' | 'synergy' | 'rare';

export interface LootDrop {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alive: boolean;
  lootType: LootType;
  amount: number;
  lifetime: number;
  reset(_nx: number, _ny: number, _nvx: number, _nvy: number): void;
  update(_dt: number): void;
  draw(_ctx: CanvasRenderingContext2D): void;
}

export class LootManager {
  private lootDrops: LootDrop[] = [];
  private readonly PICKUP_RANGE = 50; // Auto-collect within player radius + 50px
  private readonly MAX_LIFETIME = 10; // Loot disappears after 10 seconds

  spawnLoot(x: number, y: number, type: LootType, amount: number): void {
    const maxLifetime = this.MAX_LIFETIME;
    const loot: LootDrop = {
      x,
      y,
      vx: 0,
      vy: 0,
      radius: 5,
      alive: true,
      lootType: type,
      amount,
      lifetime: 0,
      reset(nx: number, ny: number, nvx: number, nvy: number): void {
        this.x = nx;
        this.y = ny;
        this.vx = nvx;
        this.vy = nvy;
        this.alive = true;
        this.lifetime = 0;
      },
      update(dt: number): void {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.lifetime += dt;
        if (this.lifetime >= maxLifetime) {
          this.alive = false;
        }
      },
      draw(ctx: CanvasRenderingContext2D): void {
        if (!this.alive) return;
        ctx.save();
        ctx.fillStyle = type === 'scrap' ? '#FFD700' : type === 'synergy' ? '#00BFFF' : '#FF00FF';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      },
    };

    this.lootDrops.push(loot);
  }

  update(dt: number): void {
    this.lootDrops.forEach((loot) => loot.update(dt));
    this.lootDrops = this.lootDrops.filter((loot) => loot.alive);
  }

  collectLoot(player: Player, onCollect: (_type: LootType, _amount: number) => void): void {
    const collectRange = player.radius + this.PICKUP_RANGE;

    this.lootDrops.forEach((loot) => {
      if (!loot.alive) return;

      const dx = loot.x - player.x;
      const dy = loot.y - player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < collectRange) {
        onCollect(loot.lootType, loot.amount);
        loot.alive = false;
      }
    });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.lootDrops.forEach((loot) => loot.draw(ctx));
  }

  clear(): void {
    this.lootDrops = [];
  }

  getActiveLoot(): LootDrop[] {
    return this.lootDrops.filter((loot) => loot.alive);
  }
}
