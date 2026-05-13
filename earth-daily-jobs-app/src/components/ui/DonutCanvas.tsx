// components/DonutCanvas.tsx
'use client';

import { useEffect, useRef } from 'react';
import { DonutRenderer } from '@/lib/DonutRenderer';

export default function DonutCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new DonutRenderer(canvasRef.current, {
      screenWidth: 60,  // 根据需要调整
      screenHeight: 30,
      charWidth: 12,
      charHeight: 12,
    });

    renderer.start();

    // 关键步骤：组件卸载时停止动画，防止内存泄漏
    return () => renderer.stop();
  }, []);

  return (
    <div className="flex justify-center items-center p-4 bg-gray-900 rounded-xl overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="max-w-full h-auto shadow-2xl"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}