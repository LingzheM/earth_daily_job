/**
 * animations.ts — Central animation parameter registry
 *
 * Design spec: docs/design/design-system.md § 7
 * PRD: AC-F1-08, AC-F1-CQ-02
 *
 * ALL components must import from here. Never hardcode stiffness/damping.
 */

// ===== Framer Motion Spring Presets =====

/** Bouncy — task droplets landing, button click rebound */
export const springBouncy = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 20,
  mass: 1,
};

/** Gentle — mood transitions, Modal open, Tab indicator slide */
export const springGentle = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 14,
  mass: 1,
};

/** Slow — liquid background drift, memory pond physics */
export const springSlow = {
  type: 'spring' as const,
  stiffness: 80,
  damping: 12,
  mass: 1.2,
};

/** Tab indicator — snappier than springBouncy, less mass */
export const tabIndicator = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 25,
  mass: 0.8,
};

// ===== Hover Lift Model (v2.0 — translateY, NOT scale) =====
// CSS (.glass-interactive) handles shadow + background changes.
// Framer Motion handles y-translation only.

export const HOVER_Y      = -4;   // px — hover lift height
export const ACTIVE_Y     = -1;   // px — press retains slight lift
export const ACTIVE_SCALE = 0.98; // slight press-down feedback

export const liftVariant = {
  hover: { y: HOVER_Y },
  tap:   { y: ACTIVE_Y, scale: ACTIVE_SCALE },
};

// ===== Component Animation Variants =====

/** Butler body breathing (CSS animation handles this; variant for Framer fallback) */
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

/** Butler breathing — direct animate prop style */
export const butlerBreathe = {
  scale: [1, 1.04, 1] as number[],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};

/** Modal fade+scale open/close */
export const modalVariant = {
  hidden:  { scale: 0.85, opacity: 0 },
  visible: { scale: 1,    opacity: 1 },
  exit:    { scale: 0.9,  opacity: 0 },
};

/** Blob drift — used by LiquidBackground for keyframe paths */
export const blobDrift = {
  x: [0, 80, -60, 40, 0] as number[],
  y: [0, -50, 70, -30, 0] as number[],
  transition: {
    duration: 28,
    repeat: Infinity,
    ease: 'linear' as const,
  },
};