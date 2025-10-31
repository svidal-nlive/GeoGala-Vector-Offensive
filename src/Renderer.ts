// Canvas Renderer with DPR-aware Scaling

import { COLORS } from './utils/constants';

export class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  dpr: number;
  width: number;
  height: number;

  constructor(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas element with id "${canvasId}" not found`);
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.dpr = window.devicePixelRatio || 1;

    // Set logical size
    this.width = canvas.clientWidth;
    this.height = canvas.clientHeight;

    // Set physical size (DPR-aware)
    canvas.width = this.width * this.dpr;
    canvas.height = this.height * this.dpr;

    // Scale context for DPR
    this.ctx.scale(this.dpr, this.dpr);

    // Set styles
    canvas.style.width = `${this.width}px`;
    canvas.style.height = `${this.height}px`;
  }

  clear(): void {
    this.ctx.fillStyle = COLORS.bg;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawTriangle(x: number, y: number, size: number, angle: number, fillColor: string): void {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(angle);

    this.ctx.fillStyle = fillColor;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -size);
    this.ctx.lineTo(size, size);
    this.ctx.lineTo(-size, size);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.restore();
  }

  drawCircle(x: number, y: number, radius: number, fillColor: string): void {
    this.ctx.fillStyle = fillColor;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawRect(x: number, y: number, width: number, height: number, fillColor: string): void {
    this.ctx.fillStyle = fillColor;
    this.ctx.fillRect(x, y, width, height);
  }

  drawText(text: string, x: number, y: number, size: number, color: string = COLORS.ui): void {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px monospace`;
    this.ctx.textAlign = 'left';
    this.ctx.fillText(text, x, y);
  }

  drawTextCentered(text: string, x: number, y: number, size: number, color: string = COLORS.ui): void {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px monospace`;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, x, y);
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }
}
