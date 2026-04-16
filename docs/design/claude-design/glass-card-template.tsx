'use client';

import { type ReactNode } from 'react';

/**
 * GlassCard — 液态玻璃卡片基础组件
 *
 * 设计规格：docs/design/design-system.md § 7.1
 * 原型预览：docs/design/design-system-prototype.html
 *
 * 视觉要点：
 * - 半透明白色背景 + backdrop-filter 模糊
 * - 顶部 inset 高光线模拟厚玻璃光线折射
 * - 圆角 24px (--radius-lg)
 * - hoverable 时背景和边框亮度同时提升
 */

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** 开启 hover 高亮效果，默认 false */
  hoverable?: boolean;
  /** 传入时自动开启 hoverable + cursor:pointer */
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = '',
  hoverable = false,
  onClick,
}: GlassCardProps) {
  const isInteractive = hoverable || !!onClick;

  return (
    <div
      className={`glass-card ${isInteractive ? 'glass-card--hoverable' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(var(--glass-blur))',
        WebkitBackdropFilter: 'blur(var(--glass-blur))',
        border: '0.5px solid var(--glass-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--glass-glow)',
        padding: '16px',            // 移动端；桌面端通过媒体查询或 className 覆盖为 20px
        transition: 'background 0.2s ease, border-color 0.2s ease',
        cursor: onClick ? 'pointer' : undefined,
      }}
    >
      {children}
    </div>
  );
}

/**
 * TODO for Developer:
 * 1. 将 inline style 迁移到 Tailwind utility 或 CSS module
 * 2. hoverable 的 hover 态增加：
 *    background → var(--glass-bg-hover)
 *    border-color → var(--glass-border-hover)
 *    （CSS :hover 伪类无法直接用 inline style，需要 CSS 方案）
 * 3. 桌面端 padding 20px 的响应式处理
 */
