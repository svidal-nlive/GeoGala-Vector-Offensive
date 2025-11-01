// Game Loop Entry Point (RAF-based with delta-time)

import { Renderer } from './Renderer';
import { GameState } from './GameState';
import { InputHandler } from './InputHandler';
import { AudioManager } from './AudioManager';
import { CollisionSystem } from './CollisionSystem';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { Bullet } from './Bullet';
import { EntityPool } from './Entity';
import { PerformanceMonitor } from './utils/performance';
import { COLORS, FRAME_BUDGET, ENTITY } from './utils/constants';
import { WaveManager } from './WaveManager';
import { LootManager } from './LootManager';
import { DamageCalculator } from './DamageCalculator';
import { EffectManager } from './EffectManager';
import { TouchControls } from './TouchControls';

class Game {
  renderer: Renderer;
  gameState: GameState;
  inputHandler: InputHandler;
  touchControls: TouchControls;
  audioManager: AudioManager;
  collisionSystem: CollisionSystem;
  performanceMonitor: PerformanceMonitor;
  waveManager: WaveManager;
  lootManager: LootManager;
  damageCalculator: DamageCalculator;
  effectManager: EffectManager;

  playerPool: EntityPool<Player>;
  enemyPool: EntityPool<Enemy>;
  bulletPool: EntityPool<Bullet>;

  player: Player | null = null;
  debugMode = false;
  lastFrameTime = 0;
  waveTransitionTimer = 0;
  gameOverTimer = 0;
  isGameOver = false;
  showWaveTransition = false;
  waveTransitionFade = 0;

  constructor() {
    this.renderer = new Renderer('game');
    this.gameState = new GameState();
    this.inputHandler = new InputHandler(this.renderer.canvas);
    this.touchControls = new TouchControls(this.renderer.canvas);
    this.audioManager = new AudioManager();
    this.collisionSystem = new CollisionSystem();
    this.performanceMonitor = new PerformanceMonitor();
    this.waveManager = new WaveManager();
    this.lootManager = new LootManager();
    this.damageCalculator = new DamageCalculator();
    this.effectManager = new EffectManager();

    // Initialize entity pools
    this.playerPool = new EntityPool(ENTITY.playerPoolSize, () => new Player());
    this.enemyPool = new EntityPool(ENTITY.enemyPoolSize, () => new Enemy());
    this.bulletPool = new EntityPool(ENTITY.bulletPoolSize, () => new Bullet());

    // Spawn player
    this.player = this.playerPool.acquire(
      this.renderer.getWidth() / 2,
      this.renderer.getHeight() - 50,
      0,
      0,
    );

    // Setup events
    this.setupKeyboardEvents();
    this.setupResume();
  }

  private setupKeyboardEvents(): void {
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'd') {
        this.debugMode = !this.debugMode;
      }
    });
  }

  private setupResume(): void {
    window.addEventListener('pointerdown', () => {
      this.audioManager.resumeContext();
    });

    window.addEventListener('keydown', () => {
      this.audioManager.resumeContext();
    });
  }

  start(): void {
    this.gameState.startRun();
    
    // Load audio assets
    this.audioManager.loadAndCacheAudio('fire', '/audio/sfx/fire.mp3');
    this.audioManager.loadAndCacheAudio('hit', '/audio/sfx/hit.mp3');
    this.audioManager.loadAndCacheAudio('upgrade', '/audio/sfx/upgrade.mp3');
    this.audioManager.loadAndCacheAudio('music', '/audio/music.mp3');
    
    // Start music after a short delay
    window.setTimeout(() => {
      this.audioManager.playMusicByKey('music', true);
    }, 500);
    
    this.waveManager.startWave(1);
    this.lastFrameTime = performance.now();
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  private gameLoop = (currentTime: number): void => {
    const dt = Math.min((currentTime - this.lastFrameTime) / 1000, 0.016); // Cap at 60 FPS delta
    this.lastFrameTime = currentTime;

    const frameStartTime = performance.now();

    // Update
    this.update(dt);

    // Render
    this.render();

    // Record metrics
    const frameEndTime = performance.now();
    const frameTime = frameEndTime - frameStartTime;
    this.performanceMonitor.recordFrameTime(frameTime);
    this.performanceMonitor.updateFps(currentTime);

    // Next frame
    requestAnimationFrame(this.gameLoop.bind(this));
  };

  private update(dt: number): void {
    if (this.isGameOver) {
      this.gameOverTimer += dt;
      // Handle restart
      const input = this.inputHandler.getInput();
      if (input.fire && this.gameOverTimer > 1.0) {
        this.restart();
      }
      return;
    }

    if (!this.player?.alive) {
      this.handleGameOver();
      return;
    }

    // Reset damage tracking
    this.damageCalculator.resetFrame();

    // Wave management
    this.waveManager.update(dt, this.enemyPool, this.renderer.getWidth());

    if (this.waveManager.isWaveComplete()) {
      this.waveTransitionTimer += dt;
      this.showWaveTransition = true;
      
      // Fade in/out effect (0-0.5s fade in, 0.5-1.0s fade out)
      if (this.waveTransitionTimer < 0.5) {
        this.waveTransitionFade = this.waveTransitionTimer * 2; // 0 -> 1
      } else {
        this.waveTransitionFade = 2 - this.waveTransitionTimer * 2; // 1 -> 0
      }

      if (this.waveTransitionTimer >= 1.0) {
        this.gameState.nextWave();
        this.waveManager.startWave(this.gameState.wave);
        this.waveTransitionTimer = 0;
        this.showWaveTransition = false;
      }
      return; // Pause gameplay during transition
    }

    // Input (merge keyboard and touch)
    this.touchControls.update();
    const keyboardInput = this.inputHandler.getInput();
    const touchInput = this.touchControls.input;
    
    const finalX = keyboardInput.x || touchInput.x;
    const finalY = keyboardInput.y || touchInput.y;
    const finalFire = keyboardInput.fire || touchInput.fire;
    
    this.player.updateInput(finalX, finalY);

    // Constrain player to full screen (Chicken Invaders style - move anywhere!)
    this.player.x = Math.max(this.player.radius, Math.min(this.renderer.getWidth() - this.player.radius, this.player.x));
    this.player.y = Math.max(this.player.radius, Math.min(this.renderer.getHeight() - this.player.radius, this.player.y));

    // Entity updates
    this.player.update(dt);
    this.enemyPool.update(dt);
    this.bulletPool.update(dt);
    this.lootManager.update(dt);
    this.effectManager.update(dt);

    // Collisions
    this.handleCollisions();

    // Loot collection
    this.lootManager.collectLoot(this.player, (type, amount) => {
      this.gameState.addResources(type, amount);
      this.audioManager.playSfxByKey('upgrade'); // Collect sound
    });

    // Fire
    if (finalFire && this.player.canFire()) {
      this.player.fire();
      this.audioManager.playSfxByKey('fire'); // Fire sound
      const bullet = this.bulletPool.acquire(
        this.player.x,
        this.player.y,
        Math.cos(this.player.aimAngle) * 300,
        Math.sin(this.player.aimAngle) * 300,
      );
      if (bullet) {
        bullet.resetWithType(
          this.player.x,
          this.player.y,
          Math.cos(this.player.aimAngle) * 300,
          Math.sin(this.player.aimAngle) * 300,
          'player',
        );
      }
    }

    // Enemy firing
    this.enemyPool.getActive().forEach((enemy) => {
      if (enemy.canFire()) {
        enemy.fire();
        const angle = Math.atan2(this.player!.y - enemy.y, this.player!.x - enemy.x);
        const bullet = this.bulletPool.acquire(
          enemy.x,
          enemy.y,
          Math.cos(angle) * 200,
          Math.sin(angle) * 200,
        );
        if (bullet) {
          bullet.resetWithType(
            enemy.x,
            enemy.y,
            Math.cos(angle) * 200,
            Math.sin(angle) * 200,
            'enemy',
          );
        }
      }
    });

    // Remove out-of-bounds entities
    this.removeOutOfBounds();
  }

  private handleCollisions(): void {
    const playerBullets = this.bulletPool.getActive().filter((b) => b.bulletType === 'player');
    const enemyBullets = this.bulletPool.getActive().filter((b) => b.bulletType === 'enemy');
    const enemies = this.enemyPool.getActive();

    // Player bullets vs enemies
    playerBullets.forEach((bullet) => {
      enemies.forEach((enemy) => {
        const dx = bullet.x - enemy.x;
        const dy = bullet.y - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < bullet.radius + enemy.radius) {
          this.damageCalculator.applyPlayerBulletDamage(bullet, enemy);
          if (enemy.health <= 0) {
            this.onEnemyDeath(enemy);
          }
        }
      });
    });

    // Enemy bullets vs player
    if (this.player) {
      enemyBullets.forEach((bullet) => {
        const dx = bullet.x - this.player!.x;
        const dy = bullet.y - this.player!.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < bullet.radius + this.player!.radius) {
          this.damageCalculator.applyEnemyBulletDamage(bullet, this.player!);
          this.gameState.onPlayerHit();
        }
      });

      // Enemy collision with player
      enemies.forEach((enemy) => {
        const dx = enemy.x - this.player!.x;
        const dy = enemy.y - this.player!.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < enemy.radius + this.player!.radius) {
          this.damageCalculator.applyEnemyCollisionDamage(enemy, this.player!);
          this.gameState.onPlayerHit();
        }
      });
    }
  }

  private onEnemyDeath(enemy: Enemy): void {
    this.gameState.addScore(100);
    this.audioManager.playSfxByKey('hit'); // Enemy death sound
    this.effectManager.spawnExplosion(enemy.x, enemy.y, COLORS.enemy, 8);
    this.lootManager.spawnLoot(enemy.x, enemy.y, 'scrap', enemy.loot.scrap);
    if (enemy.loot.synergy > 0) {
      this.lootManager.spawnLoot(enemy.x, enemy.y, 'synergy', enemy.loot.synergy);
    }
    this.waveManager.onEnemyDeath();
    enemy.alive = false;
  }

  private removeOutOfBounds(): void {
    const width = this.renderer.getWidth();
    const height = this.renderer.getHeight();

    this.bulletPool.getActive().forEach((bullet) => {
      if (bullet.x < -20 || bullet.x > width + 20 || bullet.y < -20 || bullet.y > height + 20) {
        bullet.alive = false;
      }
    });

    this.enemyPool.getActive().forEach((enemy) => {
      if (enemy.y > height + 50) {
        enemy.alive = false;
        this.waveManager.onEnemyDeath();
      }
    });
  }

  private handleGameOver(): void {
    this.isGameOver = true;
    this.gameOverTimer = 0;
    this.gameState.endRun();
    this.audioManager.stopMusic(); // Stop music on game over
  }

  private restart(): void {
    this.isGameOver = false;
    this.gameOverTimer = 0;
    this.waveTransitionTimer = 0;

    // Reset pools
    this.enemyPool.clear();
    this.bulletPool.clear();
    this.lootManager.clear();
    this.effectManager.clear();

    // Respawn player
    this.player = this.playerPool.acquire(
      this.renderer.getWidth() / 2,
      this.renderer.getHeight() - 50,
      0,
      0,
    );
    if (this.player) {
      this.player.reset(this.renderer.getWidth() / 2, this.renderer.getHeight() - 50);
    }

    // Restart game state
    this.gameState.startRun();
    this.waveManager.startWave(1);
    
    // Restart music
    window.setTimeout(() => {
      this.audioManager.playMusicByKey('music', true);
    }, 200);
  }

  private render(): void {
    this.renderer.clear();

    // Draw loot
    this.lootManager.draw(this.renderer.getContext());

    // Draw effects (particles)
    this.effectManager.draw(this.renderer.getContext());

    // Draw entities
    if (this.player?.alive) {
      this.player.draw(this.renderer.getContext());
    }
    this.enemyPool.draw(this.renderer.getContext());
    this.bulletPool.draw(this.renderer.getContext());

    // Draw HUD
    this.renderer.drawText(
      `Wave: ${this.gameState.wave}`,
      10,
      20,
      16,
      COLORS.ui,
    );
    this.renderer.drawText(
      `Score: ${this.gameState.score} (×${this.gameState.multiplier.toFixed(1)})`,
      10,
      40,
      16,
      COLORS.ui,
    );
    this.renderer.drawText(
      `Scrap: ${this.gameState.resources.scrap} | Synergy: ${this.gameState.resources.synergy}`,
      10,
      60,
      16,
      COLORS.ui,
    );

    // Health bar
    if (this.player) {
      const healthPercent = this.player.health / this.player.maxHealth;
      const barWidth = 150;
      const barHeight = 10;
      const barX = this.renderer.getWidth() - barWidth - 10;
      const barY = 10;

      const ctx = this.renderer.getContext();
      ctx.fillStyle = '#333';
      ctx.fillRect(barX, barY, barWidth, barHeight);
      ctx.fillStyle = healthPercent > 0.5 ? '#00ff88' : healthPercent > 0.25 ? '#ffeb3b' : '#ff1744';
      ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
      ctx.strokeStyle = '#fff';
      ctx.strokeRect(barX, barY, barWidth, barHeight);

      this.renderer.drawText(
        `HP: ${this.player.health}/${this.player.maxHealth}`,
        barX,
        barY - 5,
        12,
        COLORS.ui,
      );
    }

    // Wave Transition screen
    if (this.showWaveTransition) {
      const ctx = this.renderer.getContext();
      ctx.save();
      ctx.globalAlpha = this.waveTransitionFade;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, this.renderer.getWidth(), this.renderer.getHeight());

      this.renderer.drawText(
        `Wave ${this.gameState.wave + 1}`,
        this.renderer.getWidth() / 2 - 60,
        this.renderer.getHeight() / 2,
        36,
        COLORS.ship,
      );
      ctx.restore();
    }

    // Game Over screen
    if (this.isGameOver) {
      const ctx = this.renderer.getContext();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, this.renderer.getWidth(), this.renderer.getHeight());

      this.renderer.drawText(
        'GAME OVER',
        this.renderer.getWidth() / 2 - 80,
        this.renderer.getHeight() / 2 - 60,
        32,
        COLORS.warning,
      );
      this.renderer.drawText(
        `Final Score: ${this.gameState.score}`,
        this.renderer.getWidth() / 2 - 100,
        this.renderer.getHeight() / 2 - 10,
        20,
        COLORS.ui,
      );
      this.renderer.drawText(
        `Best Score: ${this.gameState.bestScore}`,
        this.renderer.getWidth() / 2 - 90,
        this.renderer.getHeight() / 2 + 20,
        18,
        COLORS.ui,
      );
      if (this.gameOverTimer > 1.0) {
        this.renderer.drawText(
          'Press SPACE to retry',
          this.renderer.getWidth() / 2 - 95,
          this.renderer.getHeight() / 2 + 60,
          16,
          COLORS.ship,
        );
      }
    }

    // Draw touch controls (mobile)
    this.touchControls.draw(this.renderer.getContext());

    // Debug HUD
    if (this.debugMode) {
      this.renderer.drawText(
        `FPS: ${this.performanceMonitor.getFps()}`,
        10,
        this.renderer.getHeight() - 80,
        14,
        COLORS.warning,
      );
      this.renderer.drawText(
        `P95: ${this.performanceMonitor.getP95FrameTime().toFixed(2)}ms`,
        10,
        this.renderer.getHeight() - 60,
        14,
        COLORS.warning,
      );
      this.renderer.drawText(
        `Entities: ${this.enemyPool.getActive().length + this.bulletPool.getActive().length + this.lootManager.getActiveLoot().length + this.effectManager.getParticleCount()}`,
        10,
        this.renderer.getHeight() - 40,
        14,
        COLORS.warning,
      );
      this.renderer.drawText(
        `Wave Progress: ${this.waveManager.getWaveProgress().alive}/${this.waveManager.getWaveProgress().total}`,
        10,
        this.renderer.getHeight() - 20,
        14,
        COLORS.warning,
      );
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.start();
});
