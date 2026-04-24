'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { springBookFlip } from '@/lib/animations';

interface BookCardProps {
  /** 封面外侧颜色（CSS background 字符串） */
  coverColor?: string;
  /** 封面内侧颜色（翻开后可见） */
  innerColor?: string;
  /** 书脊颜色 */
  spineColor?: string;
  /** 封面标题文字（可选） */
  title?: string;
  /** 宽度（含书脊），默认 156px */
  width?: number;
  /** 高度，默认 200px */
  height?: number;
}

const SPINE_WIDTH = 16;
const PAGE_COUNT = 6;

export default function BookCard({
  coverColor = 'linear-gradient(145deg, #1a1050 0%, #2D1B69 45%, #7B2FFF 100%)',
  innerColor = 'linear-gradient(160deg, #3a1050 0%, #9B2E7F 55%, #FF6B9D 100%)',
  spineColor = '#110D3A',
  title,
  width = 156,
  height = 200,
}: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const coverWidth = width - SPINE_WIDTH;

  return (
    <div
      aria-label="书本"
      style={{
        perspective: '800px',
        perspectiveOrigin: '30% 40%',
        width: width + 20,
        height: height + 20,
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ position: 'relative', width, height }}>

        {/* 后封面 */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#0E0A2D',
          borderRadius: '2px 4px 4px 2px',
          boxShadow: '3px 4px 16px rgba(0,0,0,0.5)',
        }} />

        {/* 书页 — 右侧 6 层，向右溢出 */}
        {Array.from({ length: PAGE_COUNT }, (_, i) => (
          <div key={`pr-${i}`} style={{
            position: 'absolute',
            right: -(i + 1) * 3,
            top: i,
            width: 20,
            height: height - i * 2,
            background: `rgba(237, 224, 206, ${1 - i * 0.15})`,
            borderRadius: '0 2px 2px 0',
          }} />
        ))}

        {/* 书页 — 底部 6 层，向下溢出 */}
        {Array.from({ length: PAGE_COUNT }, (_, i) => (
          <div key={`pb-${i}`} style={{
            position: 'absolute',
            bottom: -(i + 1) * 3,
            left: SPINE_WIDTH + i,
            width: coverWidth - i * 2,
            height: 20,
            background: `rgba(237, 224, 206, ${1 - i * 0.15})`,
            borderRadius: '0 0 2px 2px',
          }} />
        ))}

        {/* 封面内侧 — 封面翻开后露出，z-index 在封面下方 */}
        <div style={{
          position: 'absolute',
          left: SPINE_WIDTH,
          top: 0,
          width: coverWidth,
          height,
          background: innerColor,
          borderRadius: '0 4px 4px 0',
          zIndex: 2,
        }} />

        {/* 书脊 — z-index 最高，始终在最前 */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: SPINE_WIDTH,
          height: '100%',
          background: spineColor,
          borderRadius: '2px 0 0 2px',
          boxShadow:
            'inset -2px 0 6px rgba(0,0,0,0.40), inset 1px 0 0 rgba(255,255,255,0.06)',
          zIndex: 4,
        }} />

        {/* 前封面 — rotateY 翻页动画 */}
        <motion.div
          style={{
            position: 'absolute',
            left: SPINE_WIDTH,
            top: 0,
            width: coverWidth,
            height,
            transformOrigin: 'left center',
            zIndex: 3,
            willChange: 'transform',
          }}
          animate={{ rotateY: isHovered ? -35 : 0 }}
          transition={springBookFlip}
        >
          {/* 封面外侧 */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: coverColor,
            borderRadius: '0 4px 4px 0',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.20), inset 1px 0 0 rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}>
            {/* 顶部光泽条 */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '45%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%)',
              pointerEvents: 'none',
            }} />

            {/* 封面标题（可选） */}
            {title && (
              <span style={{
                position: 'absolute',
                bottom: 20,
                left: 10,
                right: 10,
                color: 'rgba(255,255,255,0.82)',
                fontSize: 12,
                fontWeight: 600,
                textAlign: 'center',
                lineHeight: 1.3,
              }}>
                {title}
              </span>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
