// Base Entity Class

import { Vector2 } from './utils/math';

export class Entity {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  radius = 5;
  alive = false;

  constructor() {}

  reset(x: number, y: number, vx: number, vy: number, radius: number = 5): void {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.alive = true;
  }

  deactivate(): void {
    this.alive = false;
  }

  update(dt: number): void {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // Override in subclasses
  }

  getBoundingBox(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2,
    };
  }
}

// Entity Pool for Object Reuse
export class EntityPool<T extends Entity> {
  private pool: T[] = [];
  private active: T[] = [];
  private entityFactory: () => T;

  constructor(size: number, factory: () => T) {
    this.entityFactory = factory;
    for (let i = 0; i < size; i++) {
      this.pool.push(factory());
    }
  }

  acquire(x: number, y: number, vx: number, vy: number, radius?: number): T | null {
    let entity: T | undefined;

    if (this.pool.length > 0) {
      entity = this.pool.pop()!;
    } else {
      entity = this.entityFactory();
    }

    entity.reset(x, y, vx, vy, radius);
    this.active.push(entity);
    return entity;
  }

  release(entity: T): void {
    entity.deactivate();
    const index = this.active.indexOf(entity);
    if (index > -1) {
      this.active.splice(index, 1);
      this.pool.push(entity);
    }
  }

  getActive(): T[] {
    return this.active;
  }

  clear(): void {
    this.active.forEach((e) => {
      e.deactivate();
      this.pool.push(e);
    });
    this.active = [];
  }

  update(dt: number): void {
    for (let i = this.active.length - 1; i >= 0; i--) {
      const entity = this.active[i];
      entity.update(dt);

      // Remove off-screen entities
      if (entity.x < -50 || entity.x > 800 || entity.y < -50 || entity.y > 600) {
        this.release(entity);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.active.forEach((e) => {
      if (e.alive) {
        e.draw(ctx);
      }
    });
  }
}
