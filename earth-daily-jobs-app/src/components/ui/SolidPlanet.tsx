// components/SolidPlanet.tsx
'use client';

import { useEffect, useRef } from 'react';

export default function SolidPlanet() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext('2d')) return;
    const ctx = canvas.getContext('2d')!;

    // 字符集：从暗到亮
    const chars = " .:-=+*#%@"; 
    const width = 80;  
    const height = 40; 
    const charSize = 14;

    canvas.width = width * charSize;
    canvas.height = height * charSize;

    let frame = 0;

    const render = () => {
      frame += 0.03;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `bold ${charSize}px monospace`;
      ctx.textBaseline = 'top';

      // 模拟光线方向 (从左上方照过来)
      const lightSource = { x: Math.sin(frame), y: -1, z: 1 };

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // 归一化坐标 [-1.5, 1.5]
          const nx = (x - width / 2) / (width / 3.5);
          const ny = (y - height / 2) / (height / 3.5);
          
          // 1. 实心球核心计算 (Inner Core)
          const distSq = nx * nx + ny * ny;
          const sphereRadius = 0.8; // 核心球体的半径
          
          let char = "";
          let color = "#FFFFFF";

          if (distSq < sphereRadius * sphereRadius) {
            // 计算 3D 球面的深度 Z
            const nz = Math.sqrt(sphereRadius * sphereRadius - distSq);
            
            // 计算简单漫反射亮度 (点积)
            // 法线向量即 (nx, ny, nz)
            const dot = nx * lightSource.x + ny * lightSource.y + nz * lightSource.z;
            const luminance = Math.max(0, dot / 1.5);
            
            const charIndex = Math.floor(luminance * (chars.length - 1));
            char = chars[charIndex];
            color = `rgb(${150 + luminance * 105}, ${150 + luminance * 105}, ${150 + luminance * 105})`;
          } 
          
          // 2. 倾斜环计算 (Tilted Ring)
          const angle = -0.4;
          const rx = nx * Math.cos(angle) + ny * Math.sin(angle);
          const ry = -nx * Math.sin(angle) + ny * Math.cos(angle);
          const ringDist = Math.sqrt(rx * rx * 0.7 + ry * ry * 8.0);

          // 如果当前位置没有球体字符，或者环在球体“前面”（这里简化处理为环叠加）
          if (ringDist > 0.95 && ringDist < 1.15) {
            // 环的字符选择逻辑
            const ringCharIndex = Math.floor((Math.sin(frame * 2 + x * 0.4) + 1) / 2 * (chars.length - 1));
            char = chars[ringCharIndex];
            color = "#00FF41"; // 经典的黑客绿
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
    <div className="flex justify-center items-center bg-black min-h-[600px] w-full">
      <canvas ref={canvasRef} style={{ imageRendering: 'pixelated' }} className="max-w-full" />
    </div>
  );
}