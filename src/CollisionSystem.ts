// Collision Detection System (AABB Broad-Phase)

import { Entity } from './Entity';
import { checkCircleCollision } from './utils/math';

export interface CollisionPair {
  a: Entity;
  b: Entity;
}

export class CollisionSystem {
  private pairs: CollisionPair[] = [];

  checkCollisions(entities: Entity[]): CollisionPair[] {
    this.pairs = [];

    for (let i = 0; i < entities.length; i++) {
      if (!entities[i].alive) continue;

      for (let j = i + 1; j < entities.length; j++) {
        if (!entities[j].alive) continue;

        if (this.checkCollision(entities[i], entities[j])) {
          this.pairs.push({ a: entities[i], b: entities[j] });
        }
      }
    }

    return this.pairs;
  }

  private checkCollision(a: Entity, b: Entity): boolean {
    return checkCircleCollision(a.x, a.y, a.radius, b.x, b.y, b.radius);
  }

  getPairs(): CollisionPair[] {
    return this.pairs;
  }
}
