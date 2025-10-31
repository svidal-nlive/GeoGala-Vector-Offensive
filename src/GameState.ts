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
  resources = {
    scrap: 0,
    synergy: 0,
    rare: 0,
  };
  workshopUpgrades: Map<string, WorkshopUpgrade> = new Map();
  isRunActive = false;

  constructor() {
    this.loadWorkshopUpgrades();
  }

  startRun(): void {
    this.wave = 1;
    this.score = 0;
    this.multiplier = 1.0;
    this.resources = { scrap: 0, synergy: 0, rare: 0 };
    this.isRunActive = true;
  }

  endRun(): void {
    this.isRunActive = false;
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
    this.resources = { scrap: 0, synergy: 0, rare: 0 };
    this.isRunActive = false;
  }
}
