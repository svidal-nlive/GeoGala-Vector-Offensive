// Vector2 & Collision Mathematics

export class Vector2 {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  subtract(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): Vector2 {
    const mag = this.magnitude();
    if (mag === 0) return new Vector2(0, 0);
    return this.multiply(1 / mag);
  }

  dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  cross(v: Vector2): number {
    return this.x * v.y - this.y * v.x;
  }

  copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }
}

// AABB Collision Detection
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function checkAABBCollision(a: BoundingBox, b: BoundingBox): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function checkCircleCollision(
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2: number,
): boolean {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distSq = dx * dx + dy * dy;
  const minDistSq = (r1 + r2) * (r1 + r2);
  return distSq < minDistSq;
}

// Gamepad Deadzone (Radial)
export function applyDeadzone(x: number, y: number, deadzone: number): [number, number] {
  const magnitude = Math.sqrt(x * x + y * y);

  if (magnitude < deadzone) {
    return [0, 0];
  }

  // Normalize to [0, 1] after deadzone
  const normalized = (magnitude - deadzone) / (1 - deadzone);
  const angle = Math.atan2(y, x);

  return [Math.cos(angle) * normalized, Math.sin(angle) * normalized];
}

// Angle Normalization
export function normalizeAngle(angle: number): number {
  return ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}

export function angleDifference(a: number, b: number): number {
  let diff = b - a;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  return diff;
}
