'use client';

import { type ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { springGentle } from '@/lib/animations';

/**
 * GlassModal — 液态玻璃弹出浮窗
 *
 * 设计规格：docs/design/design-system.md § 7.3
 * 原型预览：docs/design/design-system-prototype.html
 *
 * Phase 1：中心 fade + scale (springGentle)
 * Phase 2：从 originRect 位置原位生长
 *
 * 视觉要点：
 * - overlay: 黑色 30% + blur(8px) 背景虚化
 * - modal: 更高不透明度的玻璃 + 更强模糊 (40px)
 * - 圆角 32px (--radius-xl)
 * - 双重阴影: 内高光 + 外投影
 * - 打开: scale 0.85→1.0 弹性, 关闭: scale→0.9 快速淡出
 */

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  /** Phase 2: 触发元素的位置，用于原位生长动画 */
  originRect?: DOMRect;
}

export default function GlassModal({
  isOpen,
  onClose,
  children,
  className = '',
  originRect,
}: GlassModalProps) {
  // ESC 键关闭
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // 阻止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="glass-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 'var(--z-modal-overlay, 20)' as any,
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.div
            className={`glass-modal ${className}`}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={springGentle}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(var(--glass-blur-heavy, 40px))',
              WebkitBackdropFilter: 'blur(var(--glass-blur-heavy, 40px))',
              border: '0.5px solid var(--glass-border)',
              borderRadius: 'var(--radius-xl)',
              boxShadow:
                'var(--glass-glow-strong), 0 8px 32px rgba(0, 0, 0, 0.2)',
              padding: '24px',
              maxWidth: '360px',
              width: '90%',
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * TODO for Developer:
 * 1. Phase 2: 使用 originRect 计算初始 transform-origin 实现原位生长
 *    initial={{ scale: 0, x: originX, y: originY }}
 * 2. 添加 focus trap（焦点锁定在 Modal 内，无障碍要求）
 * 3. 考虑 Portal 渲染（挂载到 document.body 避免 z-index 问题）
 */
