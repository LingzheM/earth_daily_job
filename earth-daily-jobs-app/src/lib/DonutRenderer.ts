// lib/DonutRenderer.ts

interface DonutConfig {
  R1?: number; 
  R2?: number; 
  offsetZ?: number; 
  screenWidth?: number; 
  screenHeight?: number; 
  charWidth?: number; 
  charHeight?: number; 
}

export class DonutRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private A: number = 0;
  private B: number = 0;
  private frameId: number | null = null;
  private luminanceChars: string = ".,-~:;=!*#$@";

  private buffer: Uint8Array[];
  private depthBuffer: Float64Array[];
  private config: Required<DonutConfig>;

  constructor(canvas: HTMLCanvasElement, config?: DonutConfig) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error("Canvas 2D context not supported");
    this.ctx = context;

    this.config = {
      R1: 1, R2: 2, offsetZ: 5,
      screenWidth: 80, screenHeight: 24,
      charWidth: 10, charHeight: 18,
      ...config,
    };

    this.buffer = Array.from({ length: this.config.screenHeight }, () => new Uint8Array(this.config.screenWidth).fill(32));
    this.depthBuffer = Array.from({ length: this.config.screenHeight }, () => new Float64Array(this.config.screenWidth).fill(0));
    
    this.canvas.width = this.config.screenWidth * this.config.charWidth;
    this.canvas.height = this.config.screenHeight * this.config.charHeight;
  }

  private resetBuffers() {
    for (let y = 0; y < this.config.screenHeight; y++) {
      this.buffer[y].fill(32);
      this.depthBuffer[y].fill(0);
    }
  }

  public updateAndRenderFrame() {
    this.A += 0.07;
    this.B += 0.03;
    this.resetBuffers();

    const cosA = Math.cos(this.A), sinA = Math.sin(this.A);
    const cosB = Math.cos(this.B), sinB = Math.sin(this.B);
    const K1 = this.config.screenHeight * this.config.charHeight * 3 / (8 * (this.config.R1 + this.config.R2));

    for (let theta = 0; theta < 2 * Math.PI; theta += 0.07) {
      const cosT = Math.cos(theta), sinT = Math.sin(theta);
      for (let phi = 0; phi < 2 * Math.PI; phi += 0.02) {
        const cosP = Math.cos(phi), sinP = Math.sin(phi);

        const cx = this.config.R2 + this.config.R1 * cosT;
        const cy = this.config.R1 * sinT;

        const x = cx * (cosB * cosP + sinA * sinB * sinP) - cy * cosA * sinB;
        const y = cx * (sinB * cosP - sinA * cosB * sinP) + cy * cosA * cosB;
        const z = this.config.offsetZ + cosA * cx * sinP + cy * sinA;
        const ooz = 1 / z;

        const xp = Math.floor(this.config.screenWidth / 2 + (K1 / this.config.charWidth) * x * ooz);
        const yp = Math.floor(this.config.screenHeight / 2 - (K1 / this.config.charHeight) * y * ooz);

        const L = 8 * ((sinT * sinA - sinP * cosT * cosA) * cosB - sinP * cosT * sinA - sinT * cosA - cosP * cosT * sinB);

        if (xp >= 0 && xp < this.config.screenWidth && yp >= 0 && yp < this.config.screenHeight) {
          if (ooz > this.depthBuffer[yp][xp]) {
            this.depthBuffer[yp][xp] = ooz;
            const index = Math.round((L + 8) / 16 * 11);
            this.buffer[yp][xp] = this.luminanceChars.charCodeAt(Math.max(0, Math.min(11, index)));
          }
        }
      }
    }
    this.draw();
  }

  private draw() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = `${this.config.charHeight}px monospace`;
    this.ctx.fillStyle = '#00FF00';
    this.ctx.textBaseline = 'top';

    for (let y = 0; y < this.config.screenHeight; y++) {
      const line = String.fromCharCode(...this.buffer[y]);
      this.ctx.fillText(line, 0, y * this.config.charHeight);
    }
  }

  public start() {
    const loop = () => {
      this.updateAndRenderFrame();
      this.frameId = requestAnimationFrame(loop);
    };
    loop();
  }

  public stop() {
    if (this.frameId) cancelAnimationFrame(this.frameId);
  }
}