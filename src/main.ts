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

class Game {
  renderer: Renderer;
  gameState: GameState;
  inputHandler: InputHandler;
  audioManager: AudioManager;
  collisionSystem: CollisionSystem;
  performanceMonitor: PerformanceMonitor;

  playerPool: EntityPool<Player>;
  enemyPool: EntityPool<Enemy>;
  bulletPool: EntityPool<Bullet>;

  player: Player | null = null;
  debugMode = false;
  lastFrameTime = 0;

  constructor() {
    this.renderer = new Renderer('game');
    this.gameState = new GameState();
    this.inputHandler = new InputHandler(this.renderer.canvas);
    this.audioManager = new AudioManager();
    this.collisionSystem = new CollisionSystem();
    this.performanceMonitor = new PerformanceMonitor();

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
      this.audioManager.resumeContext().catch(() => {
        console.warn('Audio context resume failed');
      });
    });

    window.addEventListener('keydown', () => {
      this.audioManager.resumeContext().catch(() => {
        console.warn('Audio context resume failed');
      });
    });
  }

  start(): void {
    this.gameState.startRun();
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
    if (!this.player?.alive) return;

    // Input
    const input = this.inputHandler.getInput();
    this.player.updateInput(input.x, input.y);

    // Entity updates
    this.player.update(dt);
    this.playerPool.update(dt);
    this.enemyPool.update(dt);
    this.bulletPool.update(dt);

    // Collisions (placeholder, no damage logic yet)
    const pairs = this.collisionSystem.checkCollisions([
      this.player,
      ...this.enemyPool.getActive(),
      ...this.bulletPool.getActive(),
    ]);

    // Fire
    if (input.fire && this.player.canFire()) {
      this.player.fire();
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
  }

  private render(): void {
    this.renderer.clear();

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
      `Score: ${this.gameState.score}`,
      10,
      40,
      16,
      COLORS.ui,
    );

    // Debug HUD
    if (this.debugMode) {
      this.renderer.drawText(
        `FPS: ${this.performanceMonitor.getFps()}`,
        10,
        this.renderer.getHeight() - 60,
        14,
        COLORS.warning,
      );
      this.renderer.drawText(
        `P95: ${this.performanceMonitor.getP95FrameTime().toFixed(2)}ms`,
        10,
        this.renderer.getHeight() - 40,
        14,
        COLORS.warning,
      );
      this.renderer.drawText(
        `Entities: ${this.enemyPool.getActive().length + this.bulletPool.getActive().length}`,
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
