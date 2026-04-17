import { animate, hover, scale } from "framer-motion";

/**
 * 
 */
export const springBouncy = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 20,
  mass: 1,
};

export const springGentle = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 14,
  mass: 1,
};

export const springSlow = {
  type: 'spring' as const,
  stiffness: 80,
  damping: 12,
  mass: 1.2,
};

export const tabIndicator = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 25,
  mass: 0.8,
};

export const HOVER_Y = -4;
export const ACTIVE_Y = -1;
export const ACTIVE_SCALE = 0.98;

export const liftVariant = {
  hover: { y: HOVER_Y},
  tap: { y: ACTIVE_Y, scale: ACTIVE_SCALE },
};

export const breatheVariant = {
  animate: {
    scale: [1.0, 1.04, 1.0],
    transition: {
      duration: 3,
      ease: 'easeInOut' as const,
      repeat: Infinity,
    },
  },
};

export const butlerBreathe = {
  scale: [1, 1.04, 1] as number[],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};

export const modalVariant = {
  hidden: { scale: 0.85, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
};

export const blobDrift = {
  X: [0, 80, -60, 40, 0] as number[],
  y: [0, -50, 70, -30, 0] as number[],
  transition: {
    duration: 28,
    repeat: Infinity,
    ease: 'linear' as const,
  },
};

