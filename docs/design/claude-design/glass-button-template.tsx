'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

/**
 * GlassButton — 液态玻璃按钮
 *
 * 设计规格：docs/design/design-system.md § 7.2
 * 原型预览：docs/design/design-system-prototype.html
 *
 * 视觉要点：
 * - 和 GlassCard 同材质，但模糊度较低 (--glass-blur-light)
 * - hover: scale 1.04 + 背景提亮
 * - active: scale 0.96 + 背景再提亮
 * - 最小高度 44px (移动端触控标准)
 */

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** ghost: 无背景无边框，仅文字 */
  variant?: 'default' | 'ghost';
  /** 无障碍标签 */
  ariaLabel?: string;
}

const sizeMap = {
  sm: {
    minHeight: '36px',
    padding: '8px 16px',
    fontSize: '12px',
    borderRadius: 'var(--radius-sm)',
  },
  md: {
    minHeight: '44px',
    padding: '12px 24px',
    fontSize: '13px',
    borderRadius: 'var(--radius-md)',
  },
  lg: {
    minHeight: '52px',
    padding: '14px 32px',
    fontSize: '15px',
    borderRadius: '20px',
  },
};

export default function GlassButton({
  children,
  onClick,
  className = '',
  disabled = false,
  size = 'md',
  variant = 'default',
  ariaLabel,
}: GlassButtonProps) {
  const s = sizeMap[size];
  const isGhost = variant === 'ghost';

  return (
    <motion.button
      className={`glass-btn ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      whileHover={disabled ? undefined : { scale: 1.04 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        background: isGhost ? 'transparent' : 'var(--glass-bg)',
        backdropFilter: isGhost ? 'none' : 'blur(var(--glass-blur-light))',
        WebkitBackdropFilter: isGhost ? 'none' : 'blur(var(--glass-blur-light))',
        border: isGhost ? 'none' : '0.5px solid var(--glass-border)',
        borderRadius: s.borderRadius,
        boxShadow: isGhost ? 'none' : 'var(--glass-glow)',
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 500,
        color: 'var(--text-primary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        minHeight: s.minHeight,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        outline: 'none',
        userSelect: 'none' as const,
        // NOTE: hover 背景提亮需要 CSS :hover 或 Framer onHoverStart
      }}
    >
      {children}
    </motion.button>
  );
}

/**
 * TODO for Developer:
 * 1. hover 时 background 过渡到 var(--glass-bg-hover) — 可用 onHoverStart/End + state
 * 2. active 时 background 过渡到 var(--glass-bg-active)
 * 3. 将 inline style 迁移到 Tailwind/CSS module
 * 4. 考虑 focus-visible 样式（无障碍键盘导航）
 */
