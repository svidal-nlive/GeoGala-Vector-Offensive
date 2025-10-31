// Touch Controls for Mobile (Virtual Joystick)

export interface TouchInput {
  x: number;
  y: number;
  fire: boolean;
}

export class TouchControls {
  private canvas: HTMLCanvasElement;
  private joystickActive = false;
  private joystickStartX = 0;
  private joystickStartY = 0;
  private joystickCurrentX = 0;
  private joystickCurrentY = 0;
  private joystickRadius = 50;
  private joystickMaxDistance = 40;
  private fireButtonActive = false;
  private touchIdJoystick: number | null = null;
  private touchIdFire: number | null = null;
  
  input: TouchInput = { x: 0, y: 0, fire: false };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    this.canvas.addEventListener('touchcancel', this.handleTouchEnd.bind(this), { passive: false });
  }

  private handleTouchStart(e: unknown): void {
    const touchEvent = e as { preventDefault: () => void; changedTouches: { identifier: number; clientX: number; clientY: number }[] };
    touchEvent.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    
    for (let i = 0; i < touchEvent.changedTouches.length; i++) {
      const touch = touchEvent.changedTouches[i];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      // Left half = joystick, right half = fire button
      if (x < rect.width / 2 && this.touchIdJoystick === null) {
        this.touchIdJoystick = touch.identifier;
        this.joystickActive = true;
        this.joystickStartX = x;
        this.joystickStartY = y;
        this.joystickCurrentX = x;
        this.joystickCurrentY = y;
      } else if (x >= rect.width / 2 && this.touchIdFire === null) {
        this.touchIdFire = touch.identifier;
        this.fireButtonActive = true;
      }
    }
  }

  private handleTouchMove(e: unknown): void {
    const touchEvent = e as { preventDefault: () => void; changedTouches: { identifier: number; clientX: number; clientY: number }[] };
    touchEvent.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    
    for (let i = 0; i < touchEvent.changedTouches.length; i++) {
      const touch = touchEvent.changedTouches[i];
      
      if (touch.identifier === this.touchIdJoystick) {
        this.joystickCurrentX = touch.clientX - rect.left;
        this.joystickCurrentY = touch.clientY - rect.top;
      }
    }
  }

  private handleTouchEnd(e: unknown): void {
    const touchEvent = e as { preventDefault: () => void; changedTouches: { identifier: number }[] };
    touchEvent.preventDefault();
    
    for (let i = 0; i < touchEvent.changedTouches.length; i++) {
      const touch = touchEvent.changedTouches[i];
      
      if (touch.identifier === this.touchIdJoystick) {
        this.joystickActive = false;
        this.touchIdJoystick = null;
        this.input.x = 0;
        this.input.y = 0;
      } else if (touch.identifier === this.touchIdFire) {
        this.fireButtonActive = false;
        this.touchIdFire = null;
      }
    }
  }

  update(): void {
    if (this.joystickActive) {
      const dx = this.joystickCurrentX - this.joystickStartX;
      const dy = this.joystickCurrentY - this.joystickStartY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 5) {
        const clampedDistance = Math.min(distance, this.joystickMaxDistance);
        this.input.x = (dx / distance) * (clampedDistance / this.joystickMaxDistance);
        this.input.y = (dy / distance) * (clampedDistance / this.joystickMaxDistance);
      } else {
        this.input.x = 0;
        this.input.y = 0;
      }
    }
    
    this.input.fire = this.fireButtonActive;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.joystickActive && !this.fireButtonActive) return;
    
    ctx.save();
    
    // Draw joystick
    if (this.joystickActive) {
      // Outer circle
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.joystickStartX, this.joystickStartY, this.joystickRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Inner stick
      ctx.fillStyle = 'rgba(0, 255, 136, 0.6)';
      ctx.beginPath();
      ctx.arc(this.joystickCurrentX, this.joystickCurrentY, 20, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw fire button (right side)
    if (this.fireButtonActive) {
      const fireX = ctx.canvas.width - 80;
      const fireY = ctx.canvas.height - 80;
      
      ctx.fillStyle = 'rgba(255, 23, 68, 0.6)';
      ctx.beginPath();
      ctx.arc(fireX, fireY, 40, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(fireX, fireY, 40, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.restore();
  }
}
