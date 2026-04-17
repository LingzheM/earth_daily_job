'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { liftVariant, springBouncy } from '@/lib/animations';

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost';
  ariaLabel?: string;
}

const sizeStyles: Record<'sm' | 'md' | 'lg', React.CSSProperties> = {
  sm: { minHeight: '36px', padding: '8px 16px',  fontSize: '12px', borderRadius: 'var(--radius-sm)' },
  md: { minHeight: '44px', padding: '12px 24px', fontSize: '13px', borderRadius: 'var(--radius-md)' },
  lg: { minHeight: '52px', padding: '14px 32px', fontSize: '15px', borderRadius: 'var(--radius-md)' },
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
  const isGhost = variant === 'ghost';

  return (
    <motion.button
      className={`${isGhost ? '' : 'glass glass-interactive'} ${disabled ? 'glass-dim' : ''} ${className}`}
      style={{
        ...sizeStyles[size],
        backdropFilter: isGhost ? 'none' : 'var(--glass-blur-light)',
        WebkitBackdropFilter: isGhost ? 'none' : 'var(--glass-blur-light)',
        fontWeight: 500,
        color: 'var(--text-primary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        outline: 'none',
        userSelect: 'none',
        border: isGhost ? 'none' : undefined,
        background: isGhost ? 'transparent' : undefined,
      }}
      variants={!disabled && !isGhost ? liftVariant : undefined}
      whileHover={!disabled ? 'hover' : undefined}
      whileTap={!disabled ? 'tap' : undefined}
      transition={springBouncy}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  );
}