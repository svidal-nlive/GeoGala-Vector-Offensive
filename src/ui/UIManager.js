/**
 * UI Manager - Coordinates HUD, Overlays, and Particles
 * Geo Gala: Vector Offensive
 *
 * Central hub for all UI rendering
 */

import { HUD } from './HUD.js';
import { Overlay } from './Overlay.js';
import { ParticleSystem } from './ParticleSystem.js';

export class UIManager {
  constructor(canvas, gameState) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.gameState = gameState;

    // Initialize subsystems
    this.hud = new HUD(canvas, gameState);
    this.overlay = new Overlay(canvas);
    this.particles = new ParticleSystem(canvas);

    // UI state
    this.showDebug = false;
    this.fpsCounter = { frames: 0, lastTime: 0, fps: 60 };
  }

  update(dt) {
    this.hud.update(dt);
    this.overlay.update(dt);
    this.particles.update(dt);

    // FPS counter
    this.updateFPS(dt);
  }

  render() {
    // Particles render on VFX layer (6)
    this.particles.render();

    // HUD renders on layer (7)
    this.hud.render();

    // Overlays render on top of everything
    this.overlay.render();

    // Debug overlay
    if (this.showDebug) {
      this.renderDebugInfo();
    }
  }

  // ============================================
  // HUD DELEGATION
  // ============================================

  animateHeartLost(index) {
    this.hud.animateHeartLost(index);
  }

  animateHeartGained(index) {
    this.hud.animateHeartGained(index);
  }

  animateWaveStart() {
    this.hud.animateWaveStart();
  }

  animateWaveClear() {
    this.hud.animateWaveClear();
  }

  // ============================================
  // OVERLAY DELEGATION
  // ============================================

  showTitleScreen() {
    this.overlay.show('title');
  }

  showPauseScreen() {
    this.overlay.show('pause');
  }

  showGameOverScreen(stats) {
    this.overlay.show('gameover', stats);
  }

  showUpgradeScreen() {
    this.overlay.show('upgrade');
  }

  hideOverlay() {
    this.overlay.hide();
  }

  // ============================================
  // PARTICLE DELEGATION
  // ============================================

  emitExplosion(x, y, color) {
    this.particles.emitExplosion(x, y, color);
  }

  emitNuke(x, y) {
    this.particles.emitNuke(x, y);
  }

  emitPlayerDeath(x, y) {
    this.particles.emitPlayerDeath(x, y);
  }

  emitTrail(x, y, vx, vy, color) {
    this.particles.emitTrail(x, y, vx, vy, color);
  }

  emitSparks(x, y, normalX, normalY) {
    this.particles.emitSparks(x, y, normalX, normalY);
  }

  emitCollectSparkle(x, y, color) {
    this.particles.emitCollectSparkle(x, y, color);
  }

  clearParticles() {
    this.particles.clear();
  }

  // ============================================
  // DEBUG OVERLAY
  // ============================================

  toggleDebug() {
    this.showDebug = !this.showDebug;
  }

  renderDebugInfo() {
    this.ctx.save();

    const x = 10;
    let y = this.canvas.height - 100;
    const lineHeight = 14;

    // Semi-transparent background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(x - 5, y - lineHeight, 200, lineHeight * 6);

    // Debug text
    this.ctx.font = '12px "Share Tech Mono", monospace';
    this.ctx.fillStyle = '#00FF00';

    this.ctx.fillText(`FPS: ${this.fpsCounter.fps}`, x, y);
    y += lineHeight;

    this.ctx.fillText(`Particles: ${this.particles.getParticleCount()}`, x, y);
    y += lineHeight;

    this.ctx.fillText(`Entities: ${this.gameState.entityCount || 0}`, x, y);
    y += lineHeight;

    this.ctx.fillText(`Wave: ${this.gameState.wave || 1}`, x, y);
    y += lineHeight;

    this.ctx.fillText(`Heat: ${(this.gameState.heat || 0).toFixed(1)}%`, x, y);
    y += lineHeight;

    this.ctx.fillText(`Power: ${this.gameState.powerLevel || 0}/10`, x, y);

    this.ctx.restore();
  }

  updateFPS(dt) {
    this.fpsCounter.frames++;
    const now = performance.now();

    if (now >= this.fpsCounter.lastTime + 1000) {
      this.fpsCounter.fps = Math.round(
        (this.fpsCounter.frames * 1000) / (now - this.fpsCounter.lastTime)
      );
      this.fpsCounter.frames = 0;
      this.fpsCounter.lastTime = now;
    }
  }

  // ============================================
  // RESPONSIVE RESIZE
  // ============================================

  handleResize() {
    // Update mobile detection
    this.hud.isMobile = this.hud.detectMobile();
  }
}
