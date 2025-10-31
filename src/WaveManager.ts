// Wave Manager — Enemy spawn scheduling and wave progression

import { Enemy, Faction } from './Enemy';
import { EntityPool } from './Entity';

interface WavePattern {
  faction: Faction;
  count: number;
  spawnDelay: number; // seconds between spawns
}

interface WaveDefinition {
  patterns: WavePattern[];
  totalEnemies: number;
}

export class WaveManager {
  private currentWave = 0;
  private enemiesSpawned = 0;
  private enemiesAlive = 0;
  private spawnTimer = 0;
  private waveComplete = false;
  private waveActive = false;
  private currentPatternIndex = 0;
  private patternSpawnCount = 0;

  private waveDefinitions: Map<number, WaveDefinition> = new Map();

  constructor() {
    this.setupWaveDefinitions();
  }

  private setupWaveDefinitions(): void {
    // Wave 1: 3 Triangles (starter)
    this.waveDefinitions.set(1, {
      patterns: [
        { faction: 'triangle', count: 3, spawnDelay: 1.0 },
      ],
      totalEnemies: 3,
    });

    // Wave 2: 3 Squares + 2 Triangles
    this.waveDefinitions.set(2, {
      patterns: [
        { faction: 'triangle', count: 2, spawnDelay: 0.8 },
        { faction: 'square', count: 3, spawnDelay: 1.0 },
      ],
      totalEnemies: 5,
    });

    // Wave 3: 4 Triangles + 2 Squares
    this.waveDefinitions.set(3, {
      patterns: [
        { faction: 'triangle', count: 4, spawnDelay: 0.7 },
        { faction: 'square', count: 2, spawnDelay: 0.9 },
      ],
      totalEnemies: 6,
    });

    // Wave 4: 2 Hexagons + 3 Squares + 2 Triangles
    this.waveDefinitions.set(4, {
      patterns: [
        { faction: 'triangle', count: 2, spawnDelay: 0.6 },
        { faction: 'square', count: 3, spawnDelay: 0.8 },
        { faction: 'hexagon', count: 2, spawnDelay: 1.2 },
      ],
      totalEnemies: 7,
    });

    // Wave 5: 1 Diamond + 3 Hexagons + 4 Triangles
    this.waveDefinitions.set(5, {
      patterns: [
        { faction: 'triangle', count: 4, spawnDelay: 0.5 },
        { faction: 'hexagon', count: 3, spawnDelay: 1.0 },
        { faction: 'diamond', count: 1, spawnDelay: 1.5 },
      ],
      totalEnemies: 8,
    });
  }

  startWave(waveNum: number): void {
    this.currentWave = waveNum;
    this.enemiesSpawned = 0;
    this.enemiesAlive = 0;
    this.spawnTimer = 0;
    this.waveComplete = false;
    this.waveActive = true;
    this.currentPatternIndex = 0;
    this.patternSpawnCount = 0;
  }

  update(dt: number, enemyPool: EntityPool<Enemy>, canvasWidth: number): void {
    if (!this.waveActive) return;

    const waveDef = this.waveDefinitions.get(this.currentWave);
    if (!waveDef) {
      this.waveComplete = true;
      this.waveActive = false;
      return;
    }

    // Check if all enemies spawned
    if (this.enemiesSpawned >= waveDef.totalEnemies) {
      // Check if wave is complete (all enemies dead)
      if (this.enemiesAlive <= 0) {
        this.waveComplete = true;
        this.waveActive = false;
      }
      return;
    }

    // Spawn enemies based on pattern
    this.spawnTimer += dt;

    const currentPattern = waveDef.patterns[this.currentPatternIndex];
    if (!currentPattern) return;

    if (this.spawnTimer >= currentPattern.spawnDelay) {
      this.spawnTimer = 0;

      // Spawn enemy
      const spawnX = canvasWidth * (0.2 + Math.random() * 0.6); // Random horizontal position
      const spawnY = -20; // Above screen
      const enemy = enemyPool.acquire(spawnX, spawnY, 0, 150); // Move down at 150 px/s

      if (enemy) {
        enemy.faction = currentPattern.faction;
        enemy.reset(spawnX, spawnY, 0, 150);
        this.enemiesSpawned++;
        this.enemiesAlive++;
        this.patternSpawnCount++;

        // Move to next pattern if current pattern complete
        if (this.patternSpawnCount >= currentPattern.count) {
          this.currentPatternIndex++;
          this.patternSpawnCount = 0;
        }
      }
    }
  }

  onEnemyDeath(): void {
    this.enemiesAlive = Math.max(0, this.enemiesAlive - 1);
  }

  isWaveComplete(): boolean {
    return this.waveComplete;
  }

  isWaveActive(): boolean {
    return this.waveActive;
  }

  getWaveNumber(): number {
    return this.currentWave;
  }

  getWaveProgress(): { spawned: number; alive: number; total: number } {
    const waveDef = this.waveDefinitions.get(this.currentWave);
    return {
      spawned: this.enemiesSpawned,
      alive: this.enemiesAlive,
      total: waveDef ? waveDef.totalEnemies : 0,
    };
  }
}
