// components/TiltedPlanet.tsx
'use client';

import { useEffect, useRef } from 'react';

export default function TiltedPlanet() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext('2d')) return;
    const ctx = canvas.getContext('2d')!;

    const chars = ".:!?-=?#@$";
    const width = 80;  // 字符网格宽度
    const height = 40; // 字符网格高度
    const charSize = 14;

    canvas.width = width * charSize;
    canvas.height = height * charSize;

    let frame = 0;

    const render = () => {
      frame += 0.04;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `bold ${charSize}px monospace`;
      ctx.textBaseline = 'top';

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // 归一化坐标 [-1.2, 1.2]
          const nx = (x - width / 2) / (width / 3);
          const ny = (y - height / 2) / (height / 3);
          const dist = Math.sqrt(nx * nx + ny * ny);

          // 1. 核心判定逻辑
          // 空白的圆：中心 0.35 范围内绝对不画
          if (dist < 0.35) continue;

          // 2. 旋转坐标系用于 Tilted Ring
          const angle = -0.45; // 倾斜角度
          const rx = nx * Math.cos(angle) + ny * Math.sin(angle);
          const ry = -nx * Math.sin(angle) + ny * Math.cos(angle);
          // 椭圆路径判定：rx方向拉长，ry方向缩短
          const ringPath = Math.sqrt(rx * rx * 0.6 + ry * ry * 6.0);

          let char = "";
          let color = "";

          // 优先判定 Inner Core (在空白圆之外，但在核心半径之内)
          if (dist < 0.65) {
            char = chars[Math.floor(Math.abs(Math.sin(frame + dist * 8)) * chars.length)];
            color = "#FFFFFF"; // 核心用白色字符
          } 
          // 其次判定 Tilted Ring (倾斜的椭圆轨道)
          else if (ringPath > 0.85 && ringPath < 1.1) {
            // 环增加一点动态位移效果
            const ringIndex = Math.floor((frame * 5 + x * 0.5) % chars.length);
            char = chars[ringIndex];
            color = "#000000"; // 环用绿色字符
          }

          if (char) {
            ctx.fillStyle = color;
            ctx.fillText(char, x * charSize, y * charSize);
          }
        }
      }
      requestAnimationFrame(render);
    };

    render();
  }, []);

  return (
    <div className="flex justify-center items-center bg-black min-h-[500px]">
      <canvas ref={canvasRef} style={{ imageRendering: 'pixelated' }} />
    </div>
  );
}