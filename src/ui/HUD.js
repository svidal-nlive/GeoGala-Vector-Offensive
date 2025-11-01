/**
 * HUD System - Enhanced UI Rendering
 * Geo Gala: Vector Offensive
 *
 * Implements all UI elements from Asset-Enhancement-Spec.md
 */

export class HUD {
  constructor(canvas, gameState) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.gameState = gameState;
    this.isMobile = this.detectMobile();

    // Animation states
    this.scoreAnimation = { current: 0, target: 0, velocity: 0 };
    this.heartAnimations = [];
    this.heatWarningPhase = 0;
    this.rankBadgeScale = 1.0;
    this.waveCounterY = -50; // Slide-in position

    // Colors from tokens.css
    this.colors = {
      text: '#E0E6F0',
      accent: '#00FFFF',
      warning: '#FFB800',
      danger: '#FF3366',
      success: '#00FF88',
      bgDark: '#151B2E',
      bgOutline: '#1A2332'
    };
  }

  detectMobile() {
    return window.innerWidth < 768 ||
           ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0);
  }

  update(dt) {
    // Update score count-up animation
    this.updateScoreAnimation(dt);

    // Update heat warning pulse
    if (this.gameState.heat > 80) {
      this.heatWarningPhase += dt * 0.003 * 3; // 3 Hz
    }

    // Update wave counter slide-in
    if (this.waveCounterY < 16) {
      this.waveCounterY += dt * 0.4; // Ease-out
      if (this.waveCounterY > 16) {
        this.waveCounterY = 16;
      }
    }
  }

  render() {
    this.ctx.save();

    if (this.isMobile) {
      this.renderMobileHUD();
    } else {
      this.renderDesktopHUD();
    }

    this.ctx.restore();
  }

  renderDesktopHUD() {
    const padding = 16;

    // Top-left: Health + Heat
    this.renderHealth(padding, padding);
    this.renderHeatBar(padding, padding + 40);

    // Top-right: Score + Power Level
    this.renderScore(this.canvas.width - padding, padding);
    this.renderPowerLevel(this.canvas.width - padding, padding + 50);

    // Top-center: Wave Counter
    this.renderWaveCounter(this.canvas.width / 2, this.waveCounterY);
  }

  renderMobileHUD() {
    const padding = 16;

    // Compact top bar
    this.renderHealth(padding, padding);
    this.renderScore(this.canvas.width - padding, padding);

    // Second row
    this.renderHeatBar(padding, padding + 36);
    this.renderPowerLevel(this.canvas.width - padding, padding + 36);

    // Wave counter (centered)
    this.renderWaveCounter(this.canvas.width / 2, 12);

    // Bottom: Touch controls
    this.renderTouchControls();
  }

  // ============================================
  // HEALTH DISPLAY
  // ============================================

  renderHealth(x, y) {
    const heartSize = 24;
    const spacing = 8;
    const maxHP = this.gameState.maxHP || 3;
    const currentHP = this.gameState.hp || 3;

    for (let i = 0; i < maxHP; i++) {
      const heartX = x + i * (heartSize + spacing);
      const isFull = i < currentHP;

      this.drawHeart(heartX, y, heartSize, isFull, i);
    }
  }

  drawHeart(x, y, size, isFull, index) {
    this.ctx.save();

    // Check for animation
    const anim = this.heartAnimations[index];
    if (anim) {
      const scale = anim.scale;
      this.ctx.translate(x + size / 2, y + size / 2);
      this.ctx.scale(scale, scale);
      this.ctx.translate(-(x + size / 2), -(y + size / 2));
    }

    // Heart geometry (2 circles + triangle)
    const radius = size * 0.25;

    this.ctx.beginPath();
    // Left circle
    this.ctx.arc(x + radius, y + radius * 0.8, radius, 0, Math.PI * 2);
    // Right circle
    this.ctx.arc(x + size - radius, y + radius * 0.8, radius, 0, Math.PI * 2);
    // Bottom triangle
    this.ctx.moveTo(x, y + radius);
    this.ctx.lineTo(x + size / 2, y + size);
    this.ctx.lineTo(x + size, y + radius);
    this.ctx.closePath();

    if (isFull) {
      // Full heart
      this.ctx.fillStyle = this.colors.success;
      this.ctx.fill();

      this.ctx.strokeStyle = '#00FFAA';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Glow
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = this.colors.success;
      this.ctx.globalAlpha = 0.6;
      this.ctx.fill();
    } else {
      // Empty heart
      this.ctx.strokeStyle = this.colors.bgOutline;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  // Heart animation when HP lost
  animateHeartLost(index) {
    this.heartAnimations[index] = {
      scale: 1.0,
      phase: 'shatter',
      time: 0
    };

    // Trigger shatter particles
    this.createHeartShatterParticles(index);
  }

  // Heart animation when HP gained
  animateHeartGained(index) {
    this.heartAnimations[index] = {
      scale: 0,
      phase: 'gain',
      time: 0
    };
  }

  createHeartShatterParticles(index) {
    // TODO: Integrate with particle system
    // 6 fragments, radial velocity 30-60 px/s
  }

  // ============================================
  // HEAT BAR
  // ============================================

  renderHeatBar(x, y) {
    const width = 120;
    const height = 12;
    const heat = this.gameState.heat || 0;

    this.ctx.save();

    // Background
    this.ctx.fillStyle = this.colors.bgDark;
    this.ctx.fillRect(x, y, width, height);

    this.ctx.strokeStyle = this.colors.bgOutline;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, width, height);

    // Heat fill (gradient based on level)
    if (heat > 0) {
      const fillWidth = (heat / 100) * width;
      const gradient = this.ctx.createLinearGradient(x, y, x + width, y);

      if (heat < 50) {
        gradient.addColorStop(0, '#00FFFF'); // Cool
        gradient.addColorStop(1, '#00AAFF');
      } else if (heat < 80) {
        gradient.addColorStop(0, '#00FFFF');
        gradient.addColorStop(0.5, '#FFB800'); // Warm
        gradient.addColorStop(1, '#FF6B35');
      } else {
        gradient.addColorStop(0, '#FFB800');
        gradient.addColorStop(1, '#FF3366'); // Critical
      }

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(x + 1, y + 1, fillWidth - 2, height - 2);

      // Glow intensity scales with heat
      const glowIntensity = 0.3 + (heat / 100) * 0.9;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = heat > 80 ? this.colors.danger : this.colors.accent;
      this.ctx.globalAlpha = glowIntensity;
      this.ctx.fillRect(x + 1, y + 1, fillWidth - 2, height - 2);
    }

    // Warning pulse at 80%+
    if (heat > 80) {
      const pulseAlpha = 0.6 + Math.sin(this.heatWarningPhase) * 0.4;
      this.ctx.globalAlpha = pulseAlpha;
      this.ctx.strokeStyle = this.colors.danger;
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(x - 1, y - 1, width + 2, height + 2);
    }

    // Overheat effect (100%)
    if (heat >= 100) {
      this.renderHeatSteamParticles(x + width / 2, y);
    }

    this.ctx.restore();

    // Label
    this.ctx.fillStyle = this.colors.text;
    this.ctx.font = '10px "Share Tech Mono", monospace';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('HEAT', x, y - 4);
  }

  renderHeatSteamParticles(x, y) {
    // TODO: Integrate with particle system
    // 3 particles, upward 20-40 px/s, 0.6s lifetime
  }

  // ============================================
  // SCORE DISPLAY
  // ============================================

  renderScore(x, y) {
    this.ctx.save();

    // Count-up animation
    const displayScore = Math.floor(this.scoreAnimation.current);

    // Scale pulse on score increase
    const scale = 1.0 + (this.scoreAnimation.velocity > 0 ? 0.05 : 0);
    this.ctx.translate(x, y);
    this.ctx.scale(scale, scale);
    this.ctx.translate(-x, -y);

    // Score text
    this.ctx.font = 'bold 28px Orbitron, sans-serif';
    this.ctx.textAlign = 'right';
    this.ctx.fillStyle = this.colors.text;
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;

    const scoreText = displayScore.toLocaleString();
    this.ctx.strokeText(scoreText, x, y);
    this.ctx.fillText(scoreText, x, y);

    // Glow
    this.ctx.shadowBlur = 6;
    this.ctx.shadowColor = this.colors.accent;
    this.ctx.globalAlpha = 0.4 + (this.scoreAnimation.velocity > 0 ? 0.4 : 0);
    this.ctx.fillText(scoreText, x, y);

    this.ctx.restore();

    // Rank badge below score
    this.renderRankBadge(x, y + 20);
  }

  renderRankBadge(x, y) {
    const score = this.gameState.score || 0;
    let rank, color;

    if (score >= 500000) {
      rank = 'S';
      color = '#FFD60A'; // Gold
    } else if (score >= 150000) {
      rank = 'A';
      color = '#FF00FF'; // Magenta
    } else if (score >= 50000) {
      rank = 'B';
      color = '#00FFFF'; // Cyan
    } else if (score >= 10000) {
      rank = 'C';
      color = '#E0E6F0'; // White
    } else {
      rank = 'D';
      color = '#808080'; // Gray
    }

    this.ctx.save();

    // Scale animation on rank up
    this.ctx.translate(x, y);
    this.ctx.scale(this.rankBadgeScale, this.rankBadgeScale);
    this.ctx.translate(-x, -y);

    this.ctx.font = 'bold 14px Orbitron, sans-serif';
    this.ctx.textAlign = 'right';
    this.ctx.fillStyle = color;
    this.ctx.fillText(`RANK ${rank}`, x, y);

    // Glow
    this.ctx.shadowBlur = 8;
    this.ctx.shadowColor = color;
    this.ctx.globalAlpha = 0.6;
    this.ctx.fillText(`RANK ${rank}`, x, y);

    this.ctx.restore();
  }

  updateScoreAnimation(dt) {
    const target = this.gameState.score || 0;
    const current = this.scoreAnimation.current;

    if (current !== target) {
      // Smooth count-up
      const diff = target - current;
      this.scoreAnimation.velocity = diff * 0.1; // Ease-out
      this.scoreAnimation.current += this.scoreAnimation.velocity;

      // Snap when close
      if (Math.abs(diff) < 1) {
        this.scoreAnimation.current = target;
        this.scoreAnimation.velocity = 0;
      }
    } else {
      this.scoreAnimation.velocity = 0;
    }
  }

  // ============================================
  // POWER LEVEL INDICATOR
  // ============================================

  renderPowerLevel(x, y) {
    const segmentWidth = 12;
    const segmentHeight = 8;
    const spacing = 4;
    const maxLevel = 10;
    const currentLevel = this.gameState.powerLevel || 0;

    this.ctx.save();

    for (let i = 0; i < maxLevel; i++) {
      const segX = x - (maxLevel - i) * (segmentWidth + spacing);
      const isFilled = i < currentLevel;

      if (isFilled) {
        // Filled segment
        this.ctx.fillStyle = '#00AAFF';
        this.ctx.fillRect(segX, y, segmentWidth, segmentHeight);

        // Glow
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = '#00D4FF';
        this.ctx.globalAlpha = 0.7;
        this.ctx.fillRect(segX, y, segmentWidth, segmentHeight);
        this.ctx.globalAlpha = 1.0;
      } else {
        // Empty segment
        this.ctx.strokeStyle = this.colors.bgOutline;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(segX, y, segmentWidth, segmentHeight);
      }
    }

    this.ctx.restore();

    // Label
    this.ctx.fillStyle = this.colors.text;
    this.ctx.font = '10px "Share Tech Mono", monospace';
    this.ctx.textAlign = 'right';
    this.ctx.fillText('POWER', x, y - 4);
  }

  // ============================================
  // WAVE COUNTER
  // ============================================

  renderWaveCounter(x, y) {
    const wave = this.gameState.wave || 1;
    const text = `[ WAVE ${wave} ]`;

    this.ctx.save();

    this.ctx.font = 'bold 20px "Share Tech Mono", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.letterSpacing = '2px';

    // Outline
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;
    this.ctx.strokeText(text, x, y);

    // Fill
    this.ctx.fillStyle = this.colors.text;
    this.ctx.fillText(text, x, y);

    this.ctx.restore();
  }

  // Wave start animation
  animateWaveStart() {
    this.waveCounterY = -50; // Reset to off-screen
  }

  // Wave clear animation
  animateWaveClear() {
    // Scale + glow pulse
    // TODO: Implement scale animation
  }

  // ============================================
  // TOUCH CONTROLS (Mobile)
  // ============================================

  renderTouchControls() {
    if (!this.isMobile) return;

    const padding = 40;
    const buttonSize = 56;
    const spacing = 16;

    // Virtual joystick (left side)
    this.renderVirtualJoystick(
      padding + 60,
      this.canvas.height - padding - 60
    );

    // Action buttons (right side)
    this.renderActionButton(
      this.canvas.width - padding - buttonSize,
      this.canvas.height - padding - buttonSize,
      '🚀',
      'missile',
      this.gameState.missiles || 0
    );

    this.renderActionButton(
      this.canvas.width - padding - buttonSize,
      this.canvas.height - padding - buttonSize * 2 - spacing,
      '💣',
      'nuke',
      this.gameState.nukes || 0
    );
  }

  renderVirtualJoystick(centerX, centerY) {
    const outerRadius = 60;
    const innerRadius = 24;

    // Get joystick state from input manager
    const stick = this.gameState.joystickState || { x: 0, y: 0, active: false };

    if (!stick.active) {
      // Inactive state (semi-transparent)
      this.ctx.globalAlpha = 0.3;
    }

    this.ctx.save();

    // Outer ring
    this.ctx.strokeStyle = this.colors.bgOutline;
    this.ctx.lineWidth = 3;
    this.ctx.fillStyle = this.colors.bgDark;
    this.ctx.globalAlpha = 0.6;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Inner stick
    const stickX = centerX + stick.x * (outerRadius - innerRadius);
    const stickY = centerY + stick.y * (outerRadius - innerRadius);

    this.ctx.fillStyle = this.colors.accent;
    this.ctx.globalAlpha = 0.8;
    this.ctx.beginPath();
    this.ctx.arc(stickX, stickY, innerRadius, 0, Math.PI * 2);
    this.ctx.fill();

    // Glow
    this.ctx.shadowBlur = 12;
    this.ctx.shadowColor = '#00D4FF';
    this.ctx.globalAlpha = 0.8;
    this.ctx.fill();

    this.ctx.restore();
  }

  renderActionButton(x, y, icon, type, count) {
    const size = 56;
    const isDisabled = count <= 0;

    this.ctx.save();

    // Background circle
    this.ctx.fillStyle = this.colors.bgDark;
    this.ctx.globalAlpha = isDisabled ? 0.3 : 0.6;
    this.ctx.beginPath();
    this.ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    this.ctx.fill();

    // Outline
    this.ctx.strokeStyle = this.colors.bgOutline;
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    // Icon
    this.ctx.font = `${size * 0.6}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = isDisabled ? '#404040' : this.colors.text;
    this.ctx.globalAlpha = 1.0;
    this.ctx.fillText(icon, x + size / 2, y + size / 2);

    // Count badge
    if (!isDisabled) {
      this.ctx.font = 'bold 12px Orbitron, sans-serif';
      this.ctx.fillStyle = this.colors.accent;
      this.ctx.textAlign = 'right';
      this.ctx.fillText(`×${count}`, x + size - 4, y + size - 4);
    }

    this.ctx.restore();
  }

  // ============================================
  // FLOATING COMBO TEXT
  // ============================================

  renderComboText(x, y, multiplier, alpha) {
    this.ctx.save();

    const text = `×${multiplier.toFixed(1)} COMBO`;
    const fontSize = 18;

    this.ctx.font = `bold ${fontSize}px "Share Tech Mono", monospace`;
    this.ctx.textAlign = 'center';

    // Outline
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;
    this.ctx.globalAlpha = alpha;
    this.ctx.strokeText(text, x, y);

    // Fill
    this.ctx.fillStyle = '#FFD60A';
    this.ctx.fillText(text, x, y);

    this.ctx.restore();
  }
}
