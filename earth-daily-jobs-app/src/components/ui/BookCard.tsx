'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { springBookFlip } from '@/lib/animations';

interface BookCardProps {
  coverColor?: string;
  innerColor?: string;
  spineColor?: string;
  thicknessColor?: string;
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
}

const SPINE_WIDTH = 16;
const THICKNESS = 4;

export default function BookCard({
  coverColor = '#1e4470',
  innerColor = '#e8ddd0',
  spineColor = '#122e4a',
  thicknessColor = '#163858',
  title,
  subtitle,
  width = 180,
  height = 240,
}: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    // perspective 放最外层
    <div style={{ perspective: '1200px' }}>

      {/* book-group — preserve-3d 建立 3D 上下文，hover 监听在整本书上 */}
      <div
        style={{
          transformStyle: 'preserve-3d',
          position: 'relative',
          width,
          height,
          cursor: 'pointer',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >

        {/* 后封面 — 最底层，不动 */}
        <div style={{
          position: 'absolute',
          width,
          height,
          background: '#1a3a5c',
          borderRadius: 3,
        }} />

        {/* 书页 — CSS repeating-linear-gradient 模拟纸张纹理 */}
        <div style={{
          position: 'absolute',
          width: width - 8,
          height: height - 8,
          left: 8,
          top: 4,
          background: '#f5f0e6',
          borderRadius: '0 3px 3px 0',
          transform: 'translateZ(1px)',
          overflow: 'hidden',
        }}>
          {/* 页面横线纹理 */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 5px, rgba(0,0,0,0.03) 5px, rgba(0,0,0,0.03) 5.5px)',
          }} />
          {/* 右侧页边纹理 */}
          <div style={{
            position: 'absolute',
            right: 0, top: 2, bottom: 2,
            width: 3,
            background: 'repeating-linear-gradient(to bottom, #f5f0e6 0px, #f5f0e6 1.5px, #e8e0d0 1.5px, #e8e0d0 2px)',
          }} />
          {/* 底部页边纹理 */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 2, right: 2,
            height: 3,
            background: 'repeating-linear-gradient(to right, #f5f0e6 0px, #f5f0e6 1.5px, #e8e0d0 1.5px, #e8e0d0 2px)',
          }} />
        </div>

        {/* 书脊 — rotateY(-90deg) 旋转到 3D 侧面 */}
        <div style={{
          position: 'absolute',
          left: 0, top: 0,
          width: SPINE_WIDTH,
          height,
          background: spineColor,
          transform: 'rotateY(-90deg)',
          transformOrigin: 'right center',
          borderRadius: '3px 0 0 3px',
        }}>
          <div style={{
            position: 'absolute',
            top: 40, bottom: 40,
            left: 4, right: 4,
            borderTop: '1px solid rgba(255,255,255,0.12)',
            borderBottom: '1px solid rgba(255,255,255,0.12)',
          }} />
        </div>

        {/* 前封面 — translateZ(SPINE_WIDTH) 抬起到书脊厚度，再 rotateY 翻开 */}
        <motion.div
          style={{
            position: 'absolute',
            width,
            height,
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            z: SPINE_WIDTH,
          }}
          animate={{ rotateY: isHovered ? -28 : 0 }}
          transition={springBookFlip}
        >
          {/* 封面外侧 */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: coverColor,
            borderRadius: '2px 4px 4px 2px',
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            boxSizing: 'border-box',
          }}>
            {title && (
              <div style={{
                color: 'rgba(255,255,255,0.95)',
                fontSize: 15,
                fontWeight: 500,
                textAlign: 'center',
                letterSpacing: 0.5,
                lineHeight: 1.4,
              }}>
                {title}
              </div>
            )}
            {(title || subtitle) && (
              <div style={{
                width: 40, height: 1,
                background: 'rgba(255,255,255,0.25)',
                margin: '14px 0',
              }} />
            )}
            {subtitle && (
              <div style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: 11,
                letterSpacing: 1,
              }}>
                {subtitle}
              </div>
            )}
          </div>

          {/* 封面内侧 — rotateY(180deg) 背面，翻开时可见 */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: innerColor,
            borderRadius: '2px 4px 4px 2px',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }} />

          {/* 封面厚度 — 顶边，rotateX(90deg) 折到上方 */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: THICKNESS,
            background: thicknessColor,
            transformOrigin: 'bottom',
            transform: 'rotateX(90deg)',
            borderRadius: '2px 2px 0 0',
          }} />

          {/* 封面厚度 — 右边，rotateY(90deg) 折到右侧 */}
          <div style={{
            position: 'absolute',
            top: 0, right: 0,
            width: THICKNESS,
            height: '100%',
            background: thicknessColor,
            transformOrigin: 'left',
            transform: 'rotateY(90deg)',
          }} />

          {/* 封面厚度 — 底边，rotateX(-90deg) 折到下方 */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: THICKNESS,
            background: thicknessColor,
            transformOrigin: 'top',
            transform: 'rotateX(-90deg)',
            borderRadius: '0 0 2px 2px',
          }} />
        </motion.div>

      </div>
    </div>
  );
}
