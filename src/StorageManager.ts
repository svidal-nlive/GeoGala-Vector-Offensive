// Storage Manager for Persistence

export class StorageManager {
  private readonly storageKey = 'geogala_data';

  save(key: string, data: unknown): void {
    try {
      const storage = this.loadAll();
      storage[key] = data;
      localStorage.setItem(this.storageKey, JSON.stringify(storage));
    } catch (e) {
      console.error(`Failed to save ${key}:`, e);
    }
  }

  load(key: string): unknown {
    try {
      const storage = this.loadAll();
      return storage[key];
    } catch (e) {
      console.error(`Failed to load ${key}:`, e);
      return null;
    }
  }

  private loadAll(): Record<string, unknown> {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Failed to load storage:', e);
      return {};
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
  }

  remove(key: string): void {
    try {
      const storage = this.loadAll();
      delete storage[key];
      localStorage.setItem(this.storageKey, JSON.stringify(storage));
    } catch (e) {
      console.error(`Failed to remove ${key}:`, e);
    }
  }
}
