'use client';

import { KeyboardEvent, type ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { springGentle, modalVariant } from '@/lib/animations';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  originRect?: DOMRect;
}

export default function GlassModal({
  isOpen,
  onClose,
  children,
  className = ''
}: GlassModalProps) {
  // ESC key handler
  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = '', };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 'var(--z-modal-overlay)' as unknown as number,
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.div
            className={`glass-elevated ${className}`}
            variants={modalVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={springGentle}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              maxWidth: '360px',
              width: '90%',
              zIndex: 'var(--z-modal)' as unknown as number,
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}