'use client';

import { type ReactNode } from "react";
import { motion } from 'framer-motion';
import { liftVariant, springBouncy } from "@/lib/animations";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** Enable hover highlight + lift. Auto-enabled when onClick is provided. */
  hoverable?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = '',
  hoverable = false,
  onClick,
}: GlassCardProps) {
  const isInteractive = hoverable || !!onclick;

  return (
    <motion.div
      className={`glass ${isInteractive ? 'glass-interactive' : ''} ${className}`}
      style={{ borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)' }}
      variants={isInteractive ? liftVariant : undefined}
      whileHover={isInteractive ? 'hover' : undefined}
      whileTap={isInteractive ? 'tap' : undefined}
      transition={isInteractive ? springBouncy : undefined}
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
    >
      {children}
    </motion.div>
  );
}
