// Particle Effect System

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  lifetime: number;
  maxLifetime: number;
  color: string;
  size: number;
  alive: boolean;
}

export class EffectManager {
  private particles: Particle[] = [];
  private readonly MAX_PARTICLES = 100;

  spawnExplosion(x: number, y: number, color: string = '#ff1744', count: number = 6): void {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.MAX_PARTICLES) break;

      const angle = (i / count) * Math.PI * 2;
      const speed = 100 + Math.random() * 100;

      const particle: Particle = {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        lifetime: 0,
        maxLifetime: 0.3 + Math.random() * 0.2,
        color,
        size: 2 + Math.random() * 2,
        alive: true,
      };

      this.particles.push(particle);
    }
  }

  update(dt: number): void {
    this.particles.forEach((p) => {
      if (!p.alive) return;

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.lifetime += dt;

      // Fade out
      if (p.lifetime >= p.maxLifetime) {
        p.alive = false;
      }
    });

    // Remove dead particles
    this.particles = this.particles.filter((p) => p.alive);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach((p) => {
      if (!p.alive) return;

      const alpha = 1 - p.lifetime / p.maxLifetime;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  clear(): void {
    this.particles = [];
  }

  getParticleCount(): number {
    return this.particles.length;
  }
}
