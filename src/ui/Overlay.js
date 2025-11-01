/**
 * Overlay System - Title Screen, Pause, Game Over
 * Geo Gala: Vector Offensive
 *
 * Full-screen modal overlays with animations
 */

export class Overlay {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.state = 'none'; // none, title, pause, gameover, upgrade
    this.transitionPhase = 0;
    this.transitionDuration = 0.4; // 400ms

    // Colors
    this.colors = {
      bg: 'rgba(10, 14, 26, 0.95)', // Semi-transparent dark
      text: '#E0E6F0',
      accent: '#00FFFF',
      warning: '#FFB800',
      danger: '#FF3366',
      success: '#00FF88'
    };

    // Title screen animation
    this.titleAnimation = {
      logoScale: 0,
      subtitleAlpha: 0,
      glowPhase: 0
    };

    // Game over stats
    this.gameOverStats = {
      finalScore: 0,
      wavesCleared: 0,
      accuracy: 0,
      highScore: false
    };
  }

  show(type, data = {}) {
    this.state = type;
    this.transitionPhase = 0;

    if (type === 'title') {
      this.initTitleScreen();
    } else if (type === 'gameover') {
      this.gameOverStats = data;
    }
  }

  hide() {
    this.state = 'none';
    this.transitionPhase = 0;
  }

  update(dt) {
    // Transition animation
    if (this.transitionPhase < 1.0) {
      this.transitionPhase += dt * 0.001 / this.transitionDuration;
      if (this.transitionPhase > 1.0) {
        this.transitionPhase = 1.0;
      }
    }

    // State-specific updates
    if (this.state === 'title') {
      this.updateTitleScreen(dt);
    }
  }

  render() {
    if (this.state === 'none') return;

    this.ctx.save();

    // Background fade-in
    const bgAlpha = this.easeOut(this.transitionPhase);
    this.ctx.fillStyle = this.colors.bg;
    this.ctx.globalAlpha = bgAlpha;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1.0;

    // Render specific overlay
    if (this.state === 'title') {
      this.renderTitleScreen();
    } else if (this.state === 'pause') {
      this.renderPauseScreen();
    } else if (this.state === 'gameover') {
      this.renderGameOverScreen();
    } else if (this.state === 'upgrade') {
      this.renderUpgradeScreen();
    }

    this.ctx.restore();
  }

  // ============================================
  // TITLE SCREEN
  // ============================================

  initTitleScreen() {
    this.titleAnimation = {
      logoScale: 0,
      subtitleAlpha: 0,
      glowPhase: 0
    };
  }

  updateTitleScreen(dt) {
    const t = this.transitionPhase;

    // Logo scale-in (elastic)
    if (t < 0.6) {
      this.titleAnimation.logoScale = this.easeElastic(t / 0.6);
    } else {
      this.titleAnimation.logoScale = 1.0 + Math.sin(this.titleAnimation.glowPhase) * 0.02;
    }

    // Subtitle fade-in (delayed)
    if (t > 0.4) {
      this.titleAnimation.subtitleAlpha = this.easeOut((t - 0.4) / 0.6);
    }

    // Glow pulse
    this.titleAnimation.glowPhase += dt * 0.002;
  }

  renderTitleScreen() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.ctx.save();

    // Logo
    this.renderLogo(centerX, centerY - 60, this.titleAnimation.logoScale);

    // Subtitle
    this.ctx.globalAlpha = this.titleAnimation.subtitleAlpha;
    this.renderSubtitle(centerX, centerY + 40);
    this.ctx.globalAlpha = 1.0;

    // Start prompt
    if (this.transitionPhase > 0.8) {
      const blinkAlpha = 0.5 + Math.sin(this.titleAnimation.glowPhase * 2) * 0.5;
      this.ctx.globalAlpha = blinkAlpha;
      this.renderStartPrompt(centerX, centerY + 140);
    }

    this.ctx.restore();
  }

  renderLogo(x, y, scale) {
    this.ctx.save();

    this.ctx.translate(x, y);
    this.ctx.scale(scale, scale);

    // "GEO GALA"
    this.ctx.font = 'bold 64px Orbitron, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.letterSpacing = '4px';

    // Outline
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 4;
    this.ctx.strokeText('GEO GALA', 0, 0);

    // Gradient fill
    const gradient = this.ctx.createLinearGradient(0, -32, 0, 32);
    gradient.addColorStop(0, '#00FFFF');
    gradient.addColorStop(0.5, '#00AAFF');
    gradient.addColorStop(1, '#0055FF');
    this.ctx.fillStyle = gradient;
    this.ctx.fillText('GEO GALA', 0, 0);

    // Glow
    const glowIntensity = 0.6 + Math.sin(this.titleAnimation.glowPhase) * 0.4;
    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = '#00D4FF';
    this.ctx.globalAlpha = glowIntensity;
    this.ctx.fillText('GEO GALA', 0, 0);

    this.ctx.restore();
  }

  renderSubtitle(x, y) {
    this.ctx.font = 'bold 24px "Share Tech Mono", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.letterSpacing = '2px';

    // Outline
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;
    this.ctx.strokeText('VECTOR OFFENSIVE', x, y);

    // Fill
    this.ctx.fillStyle = '#FFB800';
    this.ctx.fillText('VECTOR OFFENSIVE', x, y);
  }

  renderStartPrompt(x, y) {
    this.ctx.font = '18px "Share Tech Mono", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = this.colors.text;
    this.ctx.fillText('[ PRESS SPACE OR TAP TO START ]', x, y);
  }

  // ============================================
  // PAUSE SCREEN
  // ============================================

  renderPauseScreen() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.ctx.save();

    // "PAUSED" text
    this.ctx.font = 'bold 48px Orbitron, sans-serif';
    this.ctx.textAlign = 'center';

    // Outline
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 3;
    this.ctx.strokeText('PAUSED', centerX, centerY);

    // Fill
    this.ctx.fillStyle = this.colors.accent;
    this.ctx.fillText('PAUSED', centerX, centerY);

    // Glow
    this.ctx.shadowBlur = 16;
    this.ctx.shadowColor = '#00D4FF';
    this.ctx.globalAlpha = 0.7;
    this.ctx.fillText('PAUSED', centerX, centerY);
    this.ctx.globalAlpha = 1.0;

    // Instructions
    this.ctx.font = '16px "Share Tech Mono", monospace';
    this.ctx.fillStyle = this.colors.text;
    this.ctx.fillText('Press SPACE or ESC to Resume', centerX, centerY + 40);
    this.ctx.fillText('Press R to Restart', centerX, centerY + 65);

    this.ctx.restore();
  }

  // ============================================
  // GAME OVER SCREEN
  // ============================================

  renderGameOverScreen() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.ctx.save();

    // "GAME OVER" text
    this.ctx.font = 'bold 56px Orbitron, sans-serif';
    this.ctx.textAlign = 'center';

    // Outline
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 4;
    this.ctx.strokeText('GAME OVER', centerX, centerY - 80);

    // Fill (danger color)
    const gradient = this.ctx.createLinearGradient(0, centerY - 110, 0, centerY - 50);
    gradient.addColorStop(0, '#FF6B35');
    gradient.addColorStop(1, '#FF3366');
    this.ctx.fillStyle = gradient;
    this.ctx.fillText('GAME OVER', centerX, centerY - 80);

    // Stats panel
    this.renderGameOverStats(centerX, centerY - 20);

    // Restart prompt
    this.ctx.font = '18px "Share Tech Mono", monospace';
    this.ctx.fillStyle = this.colors.text;
    this.ctx.fillText('[ PRESS SPACE OR TAP TO RESTART ]', centerX, centerY + 140);

    this.ctx.restore();
  }

  renderGameOverStats(x, y) {
    const stats = this.gameOverStats;
    const lineHeight = 30;

    this.ctx.font = '20px "Share Tech Mono", monospace';
    this.ctx.textAlign = 'center';

    // Final score (highlighted)
    let scoreText = `SCORE: ${stats.finalScore.toLocaleString()}`;
    if (stats.highScore) {
      scoreText += ' ⭐ NEW HIGH SCORE!';
    }

    this.ctx.fillStyle = stats.highScore ? this.colors.success : this.colors.text;
    this.ctx.fillText(scoreText, x, y);

    // Waves cleared
    this.ctx.fillStyle = this.colors.text;
    this.ctx.fillText(`WAVES CLEARED: ${stats.wavesCleared}`, x, y + lineHeight);

    // Accuracy
    const accuracyColor = stats.accuracy > 75 ? this.colors.success :
                          stats.accuracy > 50 ? this.colors.warning :
                          this.colors.danger;
    this.ctx.fillStyle = accuracyColor;
    this.ctx.fillText(`ACCURACY: ${stats.accuracy.toFixed(1)}%`, x, y + lineHeight * 2);
  }

  // ============================================
  // UPGRADE SCREEN
  // ============================================

  renderUpgradeScreen() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.ctx.save();

    // Title
    this.ctx.font = 'bold 36px Orbitron, sans-serif';
    this.ctx.textAlign = 'center';

    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 3;
    this.ctx.strokeText('UPGRADE AVAILABLE', centerX, centerY - 120);

    this.ctx.fillStyle = this.colors.success;
    this.ctx.fillText('UPGRADE AVAILABLE', centerX, centerY - 120);

    // TODO: Render upgrade options (3 cards)
    this.renderUpgradeCard(centerX - 160, centerY, 'Power Core', 'Increase firepower');
    this.renderUpgradeCard(centerX, centerY, 'Heat Sink', 'Reduce overheat time');
    this.renderUpgradeCard(centerX + 160, centerY, 'Shield Boost', 'Extra health');

    // Instructions
    this.ctx.font = '14px "Share Tech Mono", monospace';
    this.ctx.fillStyle = this.colors.text;
    this.ctx.fillText('Tap card or press 1, 2, or 3', centerX, centerY + 120);

    this.ctx.restore();
  }

  renderUpgradeCard(x, y, title, description) {
    const width = 140;
    const height = 180;

    this.ctx.save();

    // Card background
    this.ctx.fillStyle = 'rgba(21, 27, 46, 0.9)';
    this.ctx.fillRect(x - width / 2, y - height / 2, width, height);

    // Border
    this.ctx.strokeStyle = this.colors.accent;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x - width / 2, y - height / 2, width, height);

    // Title
    this.ctx.font = 'bold 14px Orbitron, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = this.colors.accent;
    this.ctx.fillText(title, x, y - height / 4);

    // Description
    this.ctx.font = '11px "Share Tech Mono", monospace';
    this.ctx.fillStyle = this.colors.text;
    this.ctx.fillText(description, x, y + height / 4);

    this.ctx.restore();
  }

  // ============================================
  // UTILITY EASING FUNCTIONS
  // ============================================

  easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  easeElastic(t) {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 :
           t === 1 ? 1 :
           Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }
}
