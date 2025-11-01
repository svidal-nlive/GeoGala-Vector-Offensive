// Performance Profiling & FPS Counter

export class PerformanceMonitor {
  private frameTimes: number[] = [];
  private fpsCounter = 0;
  private lastFpsUpdate = 0;
  private currentFps = 60;
  private maxFrameTimeP95 = 16.67;
  private readonly maxSamples = 300; // 5 seconds at 60 FPS

  recordFrameTime(deltaTime: number): void {
    this.frameTimes.push(deltaTime);
    if (this.frameTimes.length > this.maxSamples) {
      this.frameTimes.shift();
    }
  }

  updateFps(currentTime: number): void {
    this.fpsCounter++;

    if (currentTime - this.lastFpsUpdate >= 1000) {
      this.currentFps = this.fpsCounter;
      this.fpsCounter = 0;
      this.lastFpsUpdate = currentTime;
      this.calculateP95();
    }
  }

  private calculateP95(): void {
    if (this.frameTimes.length === 0) return;

    const sorted = [...this.frameTimes].sort((a, b) => a - b);
    const p95Index = Math.ceil(sorted.length * 0.95) - 1;
    this.maxFrameTimeP95 = sorted[p95Index];
  }

  getFps(): number {
    return this.currentFps;
  }

  getP95FrameTime(): number {
    return this.maxFrameTimeP95;
  }

  getAverageFrameTime(): number {
    if (this.frameTimes.length === 0) return 0;
    return this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
  }

  isFrameBudgetExceeded(threshold = 18): boolean {
    return this.maxFrameTimeP95 > threshold;
  }

  logMetrics(): string {
    return `FPS: ${this.currentFps} | P95: ${this.maxFrameTimeP95.toFixed(2)}ms | Avg: ${this.getAverageFrameTime().toFixed(2)}ms`;
  }
}
