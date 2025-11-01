// Input Handler (Keyboard, Gamepad, Pointer/Touch)

import { applyDeadzone } from './utils/math';
import { INPUT } from './utils/constants';

export class InputHandler {
  private keyPressed: Set<string> = new Set();
  private gamepadState = { x: 0, y: 0, fire: false };
  private pointerState = { x: 0, y: 0, active: false, fire: false };
  private canvas: HTMLCanvasElement;
  private touchIdentifier: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setupKeyboardListeners();
    this.setupPointerListeners();
  }

  private setupKeyboardListeners(): void {
    window.addEventListener('keydown', (e) => {
      this.keyPressed.add(e.key.toLowerCase());
    });

    window.addEventListener('keyup', (e) => {
      this.keyPressed.delete(e.key.toLowerCase());
    });
  }

  private setupPointerListeners(): void {
    this.canvas.addEventListener('pointerdown', (e) => {
      this.handlePointerStart(e);
    });

    this.canvas.addEventListener('pointermove', (e) => {
      this.handlePointerMove(e);
    });

    this.canvas.addEventListener('pointerup', (e) => {
      this.handlePointerEnd(e);
    });

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.touchIdentifier = e.touches[0].identifier;
      }
    });
  }

  private handlePointerStart(e: PointerEvent): void {
    this.pointerState.active = true;
    this.pointerState.x = e.clientX;
    this.pointerState.y = e.clientY;
    if (e.isPrimary) {
      this.pointerState.fire = true;
    }
  }

  private handlePointerMove(e: PointerEvent): void {
    if (this.pointerState.active) {
      this.pointerState.x = e.clientX;
      this.pointerState.y = e.clientY;
    }
  }

  private handlePointerEnd(e: PointerEvent): void {
    if (e.isPrimary) {
      this.pointerState.active = false;
      this.pointerState.fire = false;
    }
  }

  pollGamepad(): void {
    const gamepads = navigator.getGamepads();
    if (!gamepads || gamepads.length === 0) {
      this.gamepadState = { x: 0, y: 0, fire: false };
      return;
    }

    const gamepad = gamepads[0];
    if (!gamepad || !gamepad.connected) {
      this.gamepadState = { x: 0, y: 0, fire: false };
      return;
    }

    // Left stick (axes 0, 1)
    const [x, y] = applyDeadzone(gamepad.axes[0], gamepad.axes[1], INPUT.gamepadDeadzone);

    // Fire button (Button 0 = A)
    const fire = gamepad.buttons[0]?.pressed || false;

    this.gamepadState = { x, y, fire };
  }

  getInput(): { x: number; y: number; fire: boolean } {
    this.pollGamepad();

    // Priority: gamepad > keyboard > pointer
    if (this.gamepadState.x !== 0 || this.gamepadState.y !== 0) {
      return {
        x: this.gamepadState.x,
        y: this.gamepadState.y,
        fire: this.gamepadState.fire,
      };
    }

    // Keyboard input
    let kx = 0;
    let ky = 0;
    if (this.keyPressed.has('w') || this.keyPressed.has('arrowup')) ky -= 1;
    if (this.keyPressed.has('s') || this.keyPressed.has('arrowdown')) ky += 1;
    if (this.keyPressed.has('a') || this.keyPressed.has('arrowleft')) kx -= 1;
    if (this.keyPressed.has('d') || this.keyPressed.has('arrowright')) kx += 1;

    const kFire = this.keyPressed.has(' ');

    if (kx !== 0 || ky !== 0) {
      // Normalize keyboard input
      const mag = Math.sqrt(kx * kx + ky * ky);
      return {
        x: kx / mag,
        y: ky / mag,
        fire: kFire,
      };
    }

    // Pointer input (aim towards pointer)
    if (this.pointerState.active) {
      const rect = this.canvas.getBoundingClientRect();
      const canvasCenterX = rect.width / 2;
      const canvasCenterY = rect.height / 2;

      const px = this.pointerState.x - rect.left - canvasCenterX;
      const py = this.pointerState.y - rect.top - canvasCenterY;

      const mag = Math.sqrt(px * px + py * py);
      if (mag > 0) {
        return {
          x: px / mag,
          y: py / mag,
          fire: this.pointerState.fire,
        };
      }
    }

    return { x: 0, y: 0, fire: false };
  }

  isKeyPressed(key: string): boolean {
    return this.keyPressed.has(key.toLowerCase());
  }

  shutdown(): void {
    this.keyPressed.clear();
    this.gamepadState = { x: 0, y: 0, fire: false };
    this.pointerState = { x: 0, y: 0, active: false, fire: false };
  }
}
