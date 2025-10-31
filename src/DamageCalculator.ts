// Damage Calculator — Hit damage resolution

import { Player } from './Player';
import { Enemy } from './Enemy';
import { Bullet } from './Bullet';

export class DamageCalculator {
  private damageThisFrame: Set<string> = new Set();

  // Reset frame tracking (call at start of each frame)
  resetFrame(): void {
    this.damageThisFrame.clear();
  }

  // Apply damage for player bullet hitting enemy
  applyPlayerBulletDamage(bullet: Bullet, enemy: Enemy): void {
    const key = `bullet-${bullet.x}-${bullet.y}-enemy-${enemy.x}-${enemy.y}`;
    if (this.damageThisFrame.has(key)) return;

    enemy.takeDamage(10); // Player bullets do 10 damage
    bullet.alive = false; // Remove bullet on hit
    this.damageThisFrame.add(key);
  }

  // Apply damage for enemy bullet hitting player
  applyEnemyBulletDamage(bullet: Bullet, player: Player): void {
    const key = `bullet-${bullet.x}-${bullet.y}-player`;
    if (this.damageThisFrame.has(key)) return;

    player.takeDamage(5); // Enemy bullets do 5 damage
    bullet.alive = false; // Remove bullet on hit
    this.damageThisFrame.add(key);
  }

  // Apply damage for enemy collision with player
  applyEnemyCollisionDamage(enemy: Enemy, player: Player): void {
    const key = `enemy-${enemy.x}-${enemy.y}-player`;
    if (this.damageThisFrame.has(key)) return;

    player.takeDamage(10); // Enemy collision does 10 damage
    enemy.takeDamage(enemy.maxHealth); // Kill enemy on collision
    this.damageThisFrame.add(key);
  }
}
