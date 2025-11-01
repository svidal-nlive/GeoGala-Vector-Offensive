// Game State Manager

export interface WorkshopUpgrade {
  id: string;
  name: string;
  level: number;
}

export class GameState {
  wave = 0;
  score = 0;
  multiplier = 1.0;
  comboCounter = 0;
  noHitWave = true;
  resources = {
    scrap: 0,
    synergy: 0,
    rare: 0,
  };
  workshopUpgrades: Map<string, WorkshopUpgrade> = new Map();
  isRunActive = false;
  bestScore = 0;
  runCount = 0;

  constructor() {
    this.loadWorkshopUpgrades();
    this.loadRunStats();
  }

  startRun(): void {
    this.wave = 1;
    this.score = 0;
    this.multiplier = 1.0;
    this.comboCounter = 0;
    this.noHitWave = true;
    this.resources = { scrap: 0, synergy: 0, rare: 0 };
    this.isRunActive = true;
    this.runCount++;
    this.saveRunStats();
  }

  endRun(): void {
    this.isRunActive = false;
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      this.saveRunStats();
    }
  }

  nextWave(): void {
    this.wave++;
    this.multiplier = Math.min(2.0, 1.0 + (this.wave - 1) * 0.1); // Cap at 2.0x

    // Bonus for no-hit waves
    if (this.noHitWave) {
      this.score = Math.floor(this.score * 1.1);
    }
    this.noHitWave = true; // Reset for next wave
  }

  onPlayerHit(): void {
    this.noHitWave = false;
  }

  addScore(points: number): void {
    this.score += Math.floor(points * this.multiplier);
  }

  addResources(type: keyof typeof this.resources, amount: number): void {
    this.resources[type] += amount;
  }

  addWorkshopUpgrade(upgrade: WorkshopUpgrade): void {
    this.workshopUpgrades.set(upgrade.id, upgrade);
  }

  getUpgrade(id: string): WorkshopUpgrade | undefined {
    return this.workshopUpgrades.get(id);
  }

  saveWorkshopUpgrades(): void {
    const data = Array.from(this.workshopUpgrades.values());
    try {
      localStorage.setItem('geogala_workshop', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save workshop upgrades:', e);
    }
  }

  loadWorkshopUpgrades(): void {
    try {
      const data = localStorage.getItem('geogala_workshop');
      if (data) {
        const upgrades = JSON.parse(data) as WorkshopUpgrade[];
        this.workshopUpgrades.clear();
        upgrades.forEach((upgrade) => {
          this.workshopUpgrades.set(upgrade.id, upgrade);
        });
      }
    } catch (e) {
      console.error('Failed to load workshop upgrades:', e);
      this.workshopUpgrades.clear();
    }
  }

  clearRun(): void {
    this.wave = 0;
    this.score = 0;
    this.multiplier = 1.0;
    this.comboCounter = 0;
    this.noHitWave = true;
    this.resources = { scrap: 0, synergy: 0, rare: 0 };
    this.isRunActive = false;
  }

  loadRunStats(): void {
    try {
      const data = localStorage.getItem('geogala_run_stats');
      if (data) {
        const stats = JSON.parse(data) as { bestScore: number; runCount: number };
        this.bestScore = stats.bestScore || 0;
        this.runCount = stats.runCount || 0;
      }
    } catch (e) {
      console.error('Failed to load run stats:', e);
    }
  }

  saveRunStats(): void {
    try {
      const stats = { bestScore: this.bestScore, runCount: this.runCount };
      localStorage.setItem('geogala_run_stats', JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save run stats:', e);
    }
  }
}
