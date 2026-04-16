# Phase 1 Skeleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deployable Next.js 15 app with the Liquid Glass design system (iOS 26 quality), animated butler pet (3 moods), global animated background, and tab navigation — the Phase 1 skeleton for Life Quest (地球Online).

**Architecture:** Next.js 15 App Router as the shell; Tailwind CSS 4 for layout utilities; custom `liquid-glass.css` for the glass design system (blur+saturate+brightness triple filter, noise texture, hover-lift model); Framer Motion 11 for spring animations; Zustand 5 for global butler state. No backend, no localStorage in Phase 1.

**Tech Stack:** Next.js 15, TypeScript strict, Tailwind CSS 4 (`@tailwindcss/postcss`), Framer Motion 11, Zustand 5, pnpm

---

## File Map

**Created:**
- `src/styles/liquid-glass.css` — CSS variables (v2.0) + `.glass`, `.glass-interactive`, `.glass-elevated`, `.glass-dim` + keyframes
- `src/lib/animations.ts` — Spring params + Framer Motion variants (springBouncy/Gentle/Slow, liftVariant, breatheVariant, modalVariant, tabIndicator, blobDrift, butlerBreathe)
- `src/components/ui/GlassCard.tsx`
- `src/components/ui/GlassButton.tsx`
- `src/components/ui/GlassModal.tsx`
- `src/components/global/LiquidBackground.tsx`
- `src/components/global/LiquidParticles.tsx`
- `src/components/global/TabBar.tsx`
- `src/components/butler/Butler.tsx`
- `src/components/butler/ButlerBody.tsx`
- `src/components/butler/ButlerFace.tsx`
- `src/components/butler/ButlerBubble.tsx`
- `src/store/useButlerStore.ts`
- `src/app/tasks/page.tsx`
- `src/app/pond/page.tsx`
- `src/app/settings/page.tsx`

**Modified:**
- `src/app/layout.tsx` — LiquidBackground + LiquidParticles + TabBar
- `src/app/globals.css` — Tailwind v4 import + liquid-glass import
- `src/app/page.tsx` — Home page with Butler + mood test buttons
- `postcss.config.mjs` — Tailwind v4 PostCSS plugin

**Deleted before init:**
- `package.json` (empty placeholder)
- `tailwind.config.ts` (empty placeholder)
- `next.config.js` (empty placeholder — create-next-app creates `next.config.ts`)

---

## Task 1: Initialize Next.js Project (T-101)

**Files:**
- Delete: `package.json`, `tailwind.config.ts`, `next.config.js` (all 0-byte placeholders)
- Create: all Next.js boilerplate via `create-next-app`

- [ ] **Step 1: Remove empty placeholder files**

```bash
cd /c/Users/User/2026-Q1/dev-projects/earth_daily_job
rm package.json tailwind.config.ts next.config.js
```

Expected: no errors, files removed.

- [ ] **Step 2: Run create-next-app (no `--tailwind` flag — we install v4 manually in Task 2)**

```bash
pnpm create next-app . --typescript --eslint --app --src-dir --import-alias "@/*" --no-turbopack --yes
```

If prompted about existing `src/` directory, choose to continue. Expected output ends with:
```
Success! Created life-quest at ...
```

- [ ] **Step 3: Verify dev server starts**

```bash
pnpm dev
```

Open http://localhost:3000 in browser. Expected: Next.js default welcome page, no console errors. Then Ctrl+C to stop.

- [ ] **Step 4: Enable TypeScript strict mode**

In `tsconfig.json`, verify `"strict": true` is set (create-next-app sets this by default). If not, add it:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json next.config.ts .eslintrc.json src/ public/ .gitignore
git commit -m "feat: initialize Next.js 15 App Router project with TypeScript strict"
```

---

## Task 2: Install Dependencies + Tailwind CSS 4 (T-102)

**Files:**
- Modify: `postcss.config.mjs` (create/replace)
- Modify: `src/app/globals.css`
- Delete: `tailwind.config.ts` (if create-next-app created one — we're using v4, no config file needed)

- [ ] **Step 1: Install Tailwind CSS 4 and animation/state libraries**

```bash
pnpm add tailwindcss@latest @tailwindcss/postcss@latest framer-motion zustand
```

Expected: packages installed, no peer-dependency errors.

- [ ] **Step 2: Update PostCSS config for Tailwind v4**

Replace `postcss.config.mjs` (or `postcss.config.js`) with:

```js
// postcss.config.mjs
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
export default config;
```

- [ ] **Step 3: Update globals.css for Tailwind v4**

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

/* Liquid Glass design system variables and classes are imported in layout.tsx */
/* Body base styles */
body {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont,
               'Segoe UI', 'Noto Sans SC', sans-serif;
  background: #0a0a12;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}
```

- [ ] **Step 4: Remove tailwind.config.ts if it exists (v4 doesn't need it)**

```bash
rm -f tailwind.config.ts
```

- [ ] **Step 5: Verify build compiles**

```bash
pnpm build
```

Expected: `✓ Compiled successfully` with no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: install Tailwind CSS 4, Framer Motion, Zustand; configure PostCSS"
```

---

## Task 3: Liquid Glass CSS Variables + Classes (T-103)

**Files:**
- Create: `src/styles/liquid-glass.css`
- Modify: `src/app/globals.css` (add import)

- [ ] **Step 1: Create the directory**

```bash
mkdir -p src/styles
```

- [ ] **Step 2: Create `src/styles/liquid-glass.css` with full v2.0 design system**

```css
/**
 * liquid-glass.css — Liquid Glass Design System v2.0
 *
 * Design spec: docs/design/design-system.md (v2.0, iOS 26 quality)
 * PRD: AC-F1-03
 *
 * THREE required quality elements (must not regress):
 * 1. backdrop-filter = blur + saturate(180%) + brightness(1.1) triple filter
 * 2. Hover Lift model: translateY(-4px) + colored shadow (NOT scale)
 * 3. Noise texture via SVG feTurbulence (opacity 3.5%)
 */

:root {
  /* ===== Glass surface ===== */
  --glass-bg:           rgba(255, 255, 255, 0.08);
  --glass-bg-hover:     rgba(255, 255, 255, 0.12);
  --glass-bg-active:    rgba(255, 255, 255, 0.15);

  /* Full backdrop-filter strings (blur + saturate + brightness triple) */
  --glass-blur:         blur(24px) saturate(180%) brightness(1.1);
  --glass-blur-heavy:   blur(40px) saturate(200%) brightness(1.05);
  --glass-blur-light:   blur(12px) saturate(160%) brightness(1.1);

  /* Borders — includes border-width and style */
  --glass-border:       1px solid rgba(255, 255, 255, 0.25);
  --glass-border-hover: 1px solid rgba(255, 255, 255, 0.35);

  /* Inner glow — three layers simulate thick-glass light refraction */
  --glass-glow:
    inset 0 1px 1px rgba(255, 255, 255, 0.30),
    inset 0 -1px 2px rgba(255, 255, 255, 0.05),
    inset 0 0 12px rgba(255, 255, 255, 0.04);
  --glass-glow-strong:
    inset 0 1px 2px rgba(255, 255, 255, 0.35),
    inset 0 -1px 2px rgba(255, 255, 255, 0.05);

  /* Hover Lift shadows — colored diffusion simulating glass light scatter */
  --glass-lift-shadow:
    0 8px  32px rgba(120, 60, 255, 0.15),
    0 4px  16px rgba(0, 0, 0, 0.10);
  --glass-lift-shadow-hover:
    0 16px 48px rgba(120, 60, 255, 0.25),
    0 8px  24px rgba(0, 0, 0, 0.15);

  /* ===== Border radii (always large, min 12px) ===== */
  --radius-sm:   12px;
  --radius-md:   20px;
  --radius-lg:   28px;
  --radius-xl:   36px;
  --radius-full: 9999px;

  /* ===== Spacing (4px grid) ===== */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* ===== Typography ===== */
  --font-primary: 'SF Pro Display', -apple-system, BlinkMacSystemFont,
                  'Segoe UI', 'Noto Sans SC', sans-serif;
  --font-mono:    'SF Mono', 'Fira Code', 'Consolas', monospace;

  --text-xs:   11px;
  --text-sm:   13px;
  --text-base: 15px;
  --text-lg:   18px;
  --text-xl:   24px;
  --text-2xl:  32px;

  /* ===== Text colors ===== */
  --text-primary:   rgba(255, 255, 255, 0.92);
  --text-secondary: rgba(255, 255, 255, 0.60);
  --text-tertiary:  rgba(255, 255, 255, 0.35);
  --text-accent:    rgba(255, 255, 255, 1.00);

  /* ===== Background blobs (used by LiquidBackground) ===== */
  --blob-purple: #7B2FFF;
  --blob-blue:   #0A3CFF;
  --blob-pink:   #FF6B9D;

  /* ===== Semantic colors (Phase 2+, pre-defined) ===== */
  --color-success:    #5DCAA5;
  --color-warning:    #EF9F27;
  --color-info:       #85B7EB;
  --color-mood-happy: #FFA07A;
  --color-mood-sad:   #4FACFE;

  /* ===== Z-index layers ===== */
  --z-background:    -1;
  --z-particles:      0;
  --z-content:        1;
  --z-tabbar:        10;
  --z-modal-overlay: 20;
  --z-modal:         21;
  --z-toast:         30;

  /* ===== Animation durations ===== */
  --duration-fast:   0.3s;
  --duration-normal: 0.5s;
  --duration-slow:   0.8s;
}

/* =========================================================
   BASE GLASS CLASS
   Usage: className="glass"
   Framer Motion handles y-translation for hover lift.
   CSS handles background, border, shadow changes.
   ========================================================= */
.glass {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--glass-glow);
  position: relative; /* required: :after noise needs relative parent */
  color: var(--text-primary);
}

/* Noise texture overlay (3.5% opacity SVG fractalNoise) */
.glass::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0.035;
  pointer-events: none;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* =========================================================
   INTERACTIVE GLASS CLASS
   Stack: className="glass glass-interactive"
   Framer Motion (liftVariant) handles y: -4px on hover.
   CSS handles shadow, background, border transitions.
   ========================================================= */
.glass-interactive {
  cursor: pointer;
  transition:
    box-shadow var(--duration-fast) ease,
    background var(--duration-fast) ease,
    border-color 0.2s ease;
  box-shadow: var(--glass-glow), var(--glass-lift-shadow);
}

.glass-interactive:hover {
  background: var(--glass-bg-hover);
  border: var(--glass-border-hover);
  box-shadow: var(--glass-glow), var(--glass-lift-shadow-hover);
  /* NOTE: y-translation handled by Framer Motion liftVariant, not here */
}

.glass-interactive:active {
  background: var(--glass-bg-active);
}

.glass-interactive:focus-visible {
  outline: none;
  box-shadow:
    var(--glass-glow),
    var(--glass-lift-shadow),
    0 0 0 2px rgba(255, 255, 255, 0.18);
}

/* =========================================================
   GLASS VARIANTS
   ========================================================= */

/* Elevated: Modal, Bubbles, Overlays */
.glass-elevated {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: var(--glass-blur-heavy);
  -webkit-backdrop-filter: var(--glass-blur-heavy);
  border: var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--glass-glow-strong), 0 8px 32px rgba(0, 0, 0, 0.2);
  position: relative;
  color: var(--text-primary);
}

.glass-elevated::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0.035;
  pointer-events: none;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* Dim: disabled / inactive states */
.glass-dim {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: var(--glass-blur-light);
  -webkit-backdrop-filter: var(--glass-blur-light);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: none;
  opacity: 0.55;
  position: relative;
}

/* =========================================================
   KEYFRAME ANIMATIONS
   Durations are staggered to prevent synchronized motion.
   ========================================================= */

/* Butler breathing */
@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.04); }
}

/* Background blob drifts — three staggered timelines */
@keyframes blob-drift-a {
  0%   { transform: translate(0, 0) scale(1); }
  33%  { transform: translate(8%, -6%) scale(1.05); }
  66%  { transform: translate(15%, 4%) scale(0.98); }
  100% { transform: translate(5%, -10%) scale(1.02); }
}

@keyframes blob-drift-b {
  0%   { transform: translate(0, 0) scale(1); }
  25%  { transform: translate(-10%, 8%) scale(1.03); }
  75%  { transform: translate(-6%, -12%) scale(0.97); }
  100% { transform: translate(4%, -5%) scale(1.01); }
}

@keyframes blob-drift-c {
  0%   { transform: translate(0, 0) scale(1); }
  40%  { transform: translate(6%, 10%) scale(1.04); }
  80%  { transform: translate(-8%, 5%) scale(0.99); }
  100% { transform: translate(2%, 8%) scale(1.02); }
}

/* Particle float */
@keyframes particle-float {
  0%   { transform: translate(0, 0) scale(1); opacity: 0.6; }
  50%  { transform: translate(var(--px, 20px), var(--py, -30px)) scale(0.8); opacity: 0.3; }
  100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
}

/* =========================================================
   REDUCED MOTION — must come last to override animations
   ========================================================= */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Import liquid-glass.css in globals.css**

Add the import to `src/app/globals.css` (after the Tailwind import):

```css
@import "tailwindcss";
@import "../styles/liquid-glass.css";

body {
  font-family: var(--font-primary);
  background: #0a0a12;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}
```

- [ ] **Step 4: Verify build**

```bash
pnpm build
```

Expected: `✓ Compiled successfully`, no CSS errors.

- [ ] **Step 5: Commit**

```bash
git add src/styles/liquid-glass.css src/app/globals.css
git commit -m "feat: add Liquid Glass CSS design system v2.0 (iOS 26 quality)"
```

---

## Task 4: Animation Parameters (T-104)

**Files:**
- Create: `src/lib/animations.ts`

- [ ] **Step 1: Create `src/lib/animations.ts`**

```bash
mkdir -p src/lib
```

```typescript
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
```

- [ ] **Step 2: Type-check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/animations.ts
git commit -m "feat: add centralized animation parameters (springs, liftVariant, breathe, modal)"
```

---

## Task 5: GlassCard + GlassButton (T-105)

**Files:**
- Create: `src/components/ui/GlassCard.tsx`
- Create: `src/components/ui/GlassButton.tsx`

- [ ] **Step 1: Create directory**

```bash
mkdir -p src/components/ui
```

- [ ] **Step 2: Create `src/components/ui/GlassCard.tsx`**

```tsx
'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { liftVariant, springBouncy } from '@/lib/animations';

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
  const isInteractive = hoverable || !!onClick;

  return (
    <motion.div
      className={`glass ${isInteractive ? 'glass-interactive' : ''} ${className}`}
      style={{ borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}
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
```

- [ ] **Step 3: Create `src/components/ui/GlassButton.tsx`**

```tsx
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
```

- [ ] **Step 4: Type-check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add GlassCard and GlassButton with v2.0 hover-lift model"
```

---

## Task 6: GlassModal (T-106)

**Files:**
- Create: `src/components/ui/GlassModal.tsx`

- [ ] **Step 1: Create `src/components/ui/GlassModal.tsx`**

```tsx
'use client';

import { type ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { springGentle, modalVariant } from '@/lib/animations';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  /** Phase 2: trigger element position for origin-grow animation */
  originRect?: DOMRect;
}

export default function GlassModal({
  isOpen,
  onClose,
  children,
  className = '',
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
    return () => { document.body.style.overflow = ''; };
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
  );
}
```

- [ ] **Step 2: Type-check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/GlassModal.tsx
git commit -m "feat: add GlassModal with fade+scale animation and ESC/overlay-click close"
```

---

## Task 7: Page Routes (T-107)

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/tasks/page.tsx`
- Create: `src/app/pond/page.tsx`
- Create: `src/app/settings/page.tsx`

- [ ] **Step 1: Create placeholder pages**

`src/app/tasks/page.tsx`:
```tsx
export default function TasksPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
        任务雨 — 即将到来 🌧
      </p>
    </main>
  );
}
```

`src/app/pond/page.tsx`:
```tsx
export default function PondPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
        记忆池 — 即将到来 ✨
      </p>
    </main>
  );
}
```

`src/app/settings/page.tsx`:
```tsx
export default function SettingsPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
        设置 — 即将到来 ⚙️
      </p>
    </main>
  );
}
```

`src/app/page.tsx` (temporary placeholder — replaced in Task 17):
```tsx
export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
        Life Quest 🌍
      </p>
    </main>
  );
}
```

- [ ] **Step 2: Verify all routes resolve**

```bash
pnpm dev
```

Visit: http://localhost:3000, http://localhost:3000/tasks, http://localhost:3000/pond, http://localhost:3000/settings — all should render without errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/
git commit -m "feat: add 4-page route skeleton (home, tasks, pond, settings)"
```

---

## Task 8: LiquidBackground (T-201)

**Files:**
- Create: `src/components/global/LiquidBackground.tsx`

Design spec: `docs/design/liquid-background.md` + `docs/design/design-system.md § 3.1`

Colors (v2.0 upgrade — NOT the grok v1.0 colors):
- Blob A: `#7B2FFF` (极光紫, upper-right)
- Blob B: `#0A3CFF` (深海蓝, lower-left)
- Blob C: `#FF6B9D` (蜜桃粉, center-drift)

- [ ] **Step 1: Create directory**

```bash
mkdir -p src/components/global
```

- [ ] **Step 2: Create `src/components/global/LiquidBackground.tsx`**

```tsx
'use client';

/**
 * LiquidBackground — Full-screen animated gradient blobs
 *
 * Design spec: docs/design/liquid-background.md
 * PRD: AC-F2-01 to AC-F2-07
 *
 * Three blobs use CSS keyframe animations (blob-drift-a/b/c, defined in liquid-glass.css).
 * Staggered durations (25s/30s/22s) prevent synchronized motion.
 * mood prop reserved for Phase 2 color-temperature sync.
 */

export type ButlerMood = 'normal' | 'happy' | 'sad';

interface LiquidBackgroundProps {
  /** Phase 2: connect to useButlerStore to shift color temperature */
  mood?: ButlerMood;
}

export default function LiquidBackground({ mood: _mood = 'normal' }: LiquidBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a0a12 0%, #0d0d1a 50%, #080812 100%)',
      }}
    >
      {/* Blob A — 极光紫 — upper right, 25s drift */}
      <div
        style={{
          position: 'absolute',
          width: '60vw',
          height: '60vw',
          maxWidth: '600px',
          maxHeight: '600px',
          background: 'radial-gradient(circle, #7B2FFF 0%, transparent 70%)',
          borderRadius: '50%',
          top: '-15%',
          right: '-10%',
          opacity: 0.55,
          filter: 'blur(60px)',
          animation: 'blob-drift-a 25s ease-in-out infinite alternate',
        }}
      />

      {/* Blob B — 深海蓝 — lower left, 30s drift */}
      <div
        style={{
          position: 'absolute',
          width: '55vw',
          height: '55vw',
          maxWidth: '550px',
          maxHeight: '550px',
          background: 'radial-gradient(circle, #0A3CFF 0%, transparent 70%)',
          borderRadius: '50%',
          bottom: '-10%',
          left: '-8%',
          opacity: 0.5,
          filter: 'blur(60px)',
          animation: 'blob-drift-b 30s ease-in-out infinite alternate',
        }}
      />

      {/* Blob C — 蜜桃粉 — center, 22s drift */}
      <div
        style={{
          position: 'absolute',
          width: '50vw',
          height: '50vw',
          maxWidth: '500px',
          maxHeight: '500px',
          background: 'radial-gradient(circle, #FF6B9D 0%, transparent 70%)',
          borderRadius: '50%',
          top: '30%',
          left: '30%',
          opacity: 0.35,
          filter: 'blur(80px)',
          animation: 'blob-drift-c 22s ease-in-out infinite alternate',
        }}
      />
    </div>
  );
}
```

- [ ] **Step 3: Type-check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/global/LiquidBackground.tsx
git commit -m "feat: add LiquidBackground with 3 animated blobs (iOS 26 neon colors)"
```

---

## Task 9: Mount Global Components in Layout (T-202)

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import './globals.css';
import LiquidBackground from '@/components/global/LiquidBackground';

export const metadata: Metadata = {
  title: 'Life Quest — 地球Online',
  description: '一只住在玻璃里的管家宠物，每天给你掉落生活任务',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        {/* Global background — z-index: -1, always behind content */}
        <LiquidBackground />

        {/* Page content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            minHeight: '100dvh',
            paddingBottom: 'calc(72px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          {children}
        </div>

        {/* TabBar placeholder — replaced in Task 19 */}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify in browser**

```bash
pnpm dev
```

Open http://localhost:3000. Expected: visible animated purple/blue/pink blobs on a dark background. No white screen, no console errors.

- [ ] **Step 3: Responsive check**

In browser DevTools, toggle between 375px (iPhone SE) and 1440px widths. Expected: blobs visible, no horizontal overflow, no white edges.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: mount LiquidBackground in global layout; set up content layer"
```

---

## Task 10: Responsive Verification (T-203)

This is a verification step, no new code.

- [ ] **Step 1: Open browser at http://localhost:3000**

- [ ] **Step 2: Check 375px width (iPhone SE)**

In DevTools: set viewport to 375×667. Expected:
- No horizontal scrollbar
- Blobs fill screen without white edges
- Background color visible (#0a0a12 dark)

- [ ] **Step 3: Check 1440px width (desktop)**

Set viewport to 1440×900. Expected: blobs appropriately sized, no overflow.

- [ ] **Step 4: Run build**

```bash
pnpm build
```

Expected: `✓ Compiled successfully`

---

## Task 11: LiquidParticles (T-204)

**Files:**
- Create: `src/components/global/LiquidParticles.tsx`

- [ ] **Step 1: Create `src/components/global/LiquidParticles.tsx`**

Canvas 2D, 8 particles, random float paths. Uses `requestAnimationFrame` with proper cleanup.

```tsx
'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
}

function createParticle(canvasWidth: number, canvasHeight: number): Particle {
  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius: 3 + Math.random() * 5,
    opacity: 0.2 + Math.random() * 0.4,
    pulseSpeed: 0.005 + Math.random() * 0.01,
    pulsePhase: Math.random() * Math.PI * 2,
  };
}

export default function LiquidParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Size canvas to viewport
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create 8 particles
    const particles: Particle[] = Array.from({ length: 8 }, () =>
      createParticle(canvas.width, canvas.height)
    );

    let animFrame: number;
    let tick = 0;

    const draw = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        // Pulse opacity
        const pulsedOpacity =
          p.opacity * (0.7 + 0.3 * Math.sin(tick * p.pulseSpeed + p.pulsePhase));

        // Draw particle
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${pulsedOpacity})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
```

- [ ] **Step 2: Add to layout.tsx**

Update `src/app/layout.tsx` — import and add `<LiquidParticles />` after `<LiquidBackground />`:

```tsx
import type { Metadata } from 'next';
import './globals.css';
import LiquidBackground from '@/components/global/LiquidBackground';
import LiquidParticles from '@/components/global/LiquidParticles';

export const metadata: Metadata = {
  title: 'Life Quest — 地球Online',
  description: '一只住在玻璃里的管家宠物，每天给你掉落生活任务',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <LiquidBackground />
        <LiquidParticles />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            minHeight: '100dvh',
            paddingBottom: 'calc(72px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Type-check + build**

```bash
pnpm tsc --noEmit && pnpm build
```

Expected: no errors.

- [ ] **Step 4: Visual check**

```bash
pnpm dev
```

Open http://localhost:3000. Expected: small white glowing dots drifting slowly over the background. Console: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/global/LiquidParticles.tsx src/app/layout.tsx
git commit -m "feat: add LiquidParticles canvas animation (8 particles, RAF with cleanup)"
```

---

## Task 12: ButlerBody (T-301)

**Files:**
- Create: `src/components/butler/ButlerBody.tsx`

Design spec: `docs/design/butler.md § 3`

- [ ] **Step 1: Create directory**

```bash
mkdir -p src/components/butler
```

- [ ] **Step 2: Create `src/components/butler/ButlerBody.tsx`**

```tsx
import { type ReactNode } from 'react';

interface ButlerBodyProps {
  children: ReactNode;
}

/**
 * ButlerBody — Glass capsule container for the butler pet
 *
 * Design spec: docs/design/butler.md § 3
 * PRD: AC-F3-01, AC-F3-02, AC-F3-04
 *
 * Uses CSS animation 'breathe' (defined in liquid-glass.css) for idle breathing.
 * Framer Motion mood-based scale is applied by the parent Butler component.
 *
 * NOT 'use client' — this is a pure CSS component. Butler.tsx is the client boundary.
 */
export default function ButlerBody({ children }: ButlerBodyProps) {
  return (
    <div
      className="glass"
      style={{
        width: '160px',
        height: '200px',
        borderRadius: '9999px',
        overflow: 'visible',
        position: 'relative',
        animation: 'breathe 3s ease-in-out infinite',
        /* Extra inner highlight for thick-glass look */
        boxShadow: `
          var(--glass-glow),
          inset 0 0 30px rgba(123, 47, 255, 0.08),
          0 0 0 0.5px rgba(255, 255, 255, 0.5)
        `,
      }}
    >
      {/* Inner radial highlight — simulates light source at top-left */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background:
            'radial-gradient(circle at 38% 28%, rgba(255, 255, 255, 0.18) 0%, transparent 55%)',
          pointerEvents: 'none',
        }}
      />
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Type-check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/butler/ButlerBody.tsx
git commit -m "feat: add ButlerBody glass capsule with CSS breathing animation"
```

---

## Task 13: ButlerFace (T-302 + T-303 partial)

**Files:**
- Create: `src/components/butler/ButlerFace.tsx`

Three mood states: `normal`, `happy`, `sad`. Eyes use AnimatePresence for fade transitions. Mouth uses Framer Motion path animation (all mouths share the same `M...Q...` path format, enabling interpolation).

- [ ] **Step 1: Create `src/components/butler/ButlerFace.tsx`**

```tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { springGentle } from '@/lib/animations';

export type ButlerMood = 'normal' | 'happy' | 'sad';

interface ButlerFaceProps {
  mood: ButlerMood;
}

// All mouth paths must have identical command structure for Framer interpolation
const mouthPaths: Record<ButlerMood, string> = {
  normal: 'M55 110 Q80 122 105 110',
  happy:  'M48 108 Q80 134 112 108',
  sad:    'M55 118 Q80 104 105 118',
};

/**
 * ButlerFace — SVG eyes + mouth with mood-based animation
 *
 * Design spec: docs/design/butler.md § 4
 * PRD: AC-F3-03, AC-F3-05, AC-F3-06, AC-F3-07, AC-F3-08
 *
 * Eyes: AnimatePresence crossfade (different element types per mood)
 * Mouth: Framer Motion path interpolation (same M...Q... format)
 */
export default function ButlerFace({ mood }: ButlerFaceProps) {
  return (
    <svg
      width="160"
      height="200"
      viewBox="0 0 160 200"
      style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
      aria-hidden="true"
    >
      {/* Eyes — fade between mood states */}
      <AnimatePresence mode="wait">
        {mood === 'normal' && (
          <motion.g
            key="normal-eyes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Left eye */}
            <ellipse cx="55" cy="75" rx="12" ry="14" fill="rgba(255,255,255,0.92)" />
            <circle  cx="57" cy="77" r="6"            fill="#1a1a2e" />
            <circle  cx="59" cy="73" r="2"            fill="rgba(255,255,255,0.7)" />
            {/* Right eye */}
            <ellipse cx="105" cy="75" rx="12" ry="14" fill="rgba(255,255,255,0.92)" />
            <circle  cx="107" cy="77" r="6"           fill="#1a1a2e" />
            <circle  cx="109" cy="73" r="2"           fill="rgba(255,255,255,0.7)" />
          </motion.g>
        )}

        {mood === 'happy' && (
          <motion.g
            key="happy-eyes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Left crescent eye */}
            <path
              d="M43 76 Q55 62 67 76"
              fill="none"
              stroke="rgba(255,255,255,0.92)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Right crescent eye */}
            <path
              d="M93 76 Q105 62 117 76"
              fill="none"
              stroke="rgba(255,255,255,0.92)"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </motion.g>
        )}

        {mood === 'sad' && (
          <motion.g
            key="sad-eyes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Left eye — enlarged, watery */}
            <ellipse cx="55" cy="76" rx="15" ry="18" fill="rgba(255,255,255,0.92)" />
            <circle  cx="57" cy="79" r="8"            fill="#1a1a2e" />
            <circle  cx="60" cy="74" r="3"            fill="rgba(255,255,255,0.7)" />
            {/* Right eye — enlarged, watery */}
            <ellipse cx="105" cy="76" rx="15" ry="18" fill="rgba(255,255,255,0.92)" />
            <circle  cx="107" cy="79" r="8"           fill="#1a1a2e" />
            <circle  cx="110" cy="74" r="3"           fill="rgba(255,255,255,0.7)" />
            {/* Tear drops */}
            <circle cx="52" cy="104" r="3.5" fill="rgba(100, 180, 255, 0.8)" />
            <circle cx="102" cy="104" r="3.5" fill="rgba(100, 180, 255, 0.8)" />
          </motion.g>
        )}
      </AnimatePresence>

      {/* Mouth — interpolates between path shapes */}
      <motion.path
        animate={{ d: mouthPaths[mood] }}
        transition={springGentle}
        fill="none"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/butler/ButlerFace.tsx
git commit -m "feat: add ButlerFace SVG with 3 mood states (normal/happy/sad)"
```

---

## Task 14: Butler Main Component + Mood Transitions (T-303, T-304, T-305)

**Files:**
- Create: `src/components/butler/Butler.tsx`
- Create: `src/components/butler/ButlerBubble.tsx`

- [ ] **Step 1: Create `src/components/butler/Butler.tsx`**

```tsx
'use client';

import { motion } from 'framer-motion';
import { springGentle } from '@/lib/animations';
import ButlerBody from './ButlerBody';
import ButlerFace, { type ButlerMood } from './ButlerFace';
import ButlerBubble from './ButlerBubble';

interface ButlerProps {
  mood?: ButlerMood;
}

/**
 * Butler — Main butler pet component
 *
 * Design spec: docs/design/butler.md
 * PRD: AC-F3-01 to AC-F3-10
 *
 * Mood scale animation (outer wrapper):
 *   normal → scale 1.0, y 0
 *   happy  → scale 1.05, y -6px (floats up)
 *   sad    → scale 0.92, y  6px (sinks slightly)
 *
 * CSS breathing (on ButlerBody):
 *   scale 1.0 ↔ 1.04 over 3s — composites cleanly with the above.
 */
export default function Butler({ mood = 'normal' }: ButlerProps) {
  const moodTransform = {
    normal: { scale: 1.0,  y: 0 },
    happy:  { scale: 1.05, y: -6 },
    sad:    { scale: 0.92, y: 6 },
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      {/* Speech bubble placeholder (T-307) */}
      <ButlerBubble />

      {/* Butler body — mood-based scale + y transition */}
      <motion.div
        animate={moodTransform[mood]}
        transition={springGentle}
        style={{ position: 'relative', maxWidth: '160px' }}
      >
        <ButlerBody>
          <ButlerFace mood={mood} />
        </ButlerBody>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/butler/ButlerBubble.tsx`**

```tsx
/**
 * ButlerBubble — Speech bubble placeholder
 *
 * PRD: AC-F3-09 — DOM structure in Phase 1, content in Phase 2.
 * Phase 2 will animate this with the 液态膨胀 (liquid expand) open animation.
 */
export default function ButlerBubble() {
  // Placeholder — empty in Phase 1
  return <div aria-hidden="true" style={{ minHeight: '0px' }} />;
}
```

- [ ] **Step 3: Type-check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/butler/
git commit -m "feat: add Butler main component with mood transitions (normal/happy/sad)"
```

---

## Task 15: Place Butler on Home Page (T-306)

**Files:**
- Modify: `src/app/page.tsx`

The home page shows Butler in the upper-third of the viewport. Three debug buttons toggle moods (to verify all three states work — can be removed later but useful for QA).

- [ ] **Step 1: Update `src/app/page.tsx`**

```tsx
'use client';

import { useState } from 'react';
import Butler from '@/components/butler/Butler';
import GlassButton from '@/components/ui/GlassButton';
import { type ButlerMood } from '@/components/butler/ButlerFace';

export default function HomePage() {
  const [mood, setMood] = useState<ButlerMood>('normal');

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100dvh',
        paddingTop: '15vh',
        gap: '40px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Butler — positioned at ~upper-third of viewport */}
      <Butler mood={mood} />

      {/* Mood toggle buttons — for Phase 1 QA, remove in Phase 2 */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <GlassButton
          size="sm"
          onClick={() => setMood('normal')}
          ariaLabel="Set mood to normal"
        >
          普通
        </GlassButton>
        <GlassButton
          size="sm"
          onClick={() => setMood('happy')}
          ariaLabel="Set mood to happy"
        >
          开心 😊
        </GlassButton>
        <GlassButton
          size="sm"
          onClick={() => setMood('sad')}
          ariaLabel="Set mood to sad"
        >
          委屈 😢
        </GlassButton>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify in browser**

```bash
pnpm dev
```

Open http://localhost:3000. Verify:
- Butler is visible, centered, in upper third of viewport
- Breathing animation is visible (subtle scale pulse)
- Clicking 开心 → eyes become crescents, smile, body floats up
- Clicking 委屈 → eyes enlarge with tears, frown, body sinks
- Clicking 普通 → returns to default
- Butler is no wider than 160px on mobile

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add Butler to home page with mood toggle buttons for QA"
```

---

## Task 16: TabBar (T-401, T-402, T-403)

**Files:**
- Create: `src/components/global/TabBar.tsx`
- Modify: `src/app/layout.tsx`

Design spec: `docs/design/tab-bar.md`

The `layoutId="tabIndicator"` pattern causes Framer Motion to animate the indicator between positions when the active tab changes.

- [ ] **Step 1: Create `src/components/global/TabBar.tsx`**

```tsx
'use client';

import { motion, LayoutGroup } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { springBouncy, liftVariant, tabIndicator } from '@/lib/animations';

const tabs = [
  { id: 'home',     label: 'Home',   icon: '🏠', href: '/'         },
  { id: 'tasks',    label: '任务雨', icon: '🌧', href: '/tasks'    },
  { id: 'pond',     label: '记忆池', icon: '✨', href: '/pond'     },
  { id: 'settings', label: '设置',   icon: '⚙️', href: '/settings' },
];

/**
 * TabBar — Fixed glass bottom navigation
 *
 * Design spec: docs/design/tab-bar.md
 * PRD: AC-F4-01 to AC-F4-08
 *
 * Indicator: layoutId="tabIndicator" animates between active tab positions.
 * Safe area: paddingBottom uses env(safe-area-inset-bottom) for iOS notch.
 */
export default function TabBar() {
  const pathname = usePathname();

  return (
    <LayoutGroup>
      <nav
        className="glass"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: '72px',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          backdropFilter: 'var(--glass-blur-heavy)',
          WebkitBackdropFilter: 'var(--glass-blur-heavy)',
          borderRadius: 0,
          borderBottom: 'none',
          borderLeft: 'none',
          borderRight: 'none',
        }}
        aria-label="Main navigation"
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                textDecoration: 'none',
                minHeight: '44px',
                minWidth: '44px',
                position: 'relative',
                paddingTop: '4px',
              }}
            >
              {/* Active indicator — layoutId enables cross-tab animation */}
              {isActive && (
                <motion.div
                  layoutId="tabIndicator"
                  transition={tabIndicator}
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    height: '3px',
                    width: '40%',
                    background: 'linear-gradient(90deg, #FF6B9D, #7B2FFF)',
                    borderRadius: '9999px',
                    boxShadow: '0 0 10px rgba(123, 47, 255, 0.6)',
                  }}
                />
              )}

              <motion.span
                style={{
                  fontSize: '24px',
                  lineHeight: 1,
                  color: isActive ? 'var(--text-accent)' : 'var(--text-secondary)',
                  transition: 'color 0.2s ease',
                }}
                variants={liftVariant}
                whileHover="hover"
                whileTap="tap"
                transition={springBouncy}
              >
                {tab.icon}
              </motion.span>

              <span
                style={{
                  fontSize: '10px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--text-accent)' : 'var(--text-tertiary)',
                  transition: 'color 0.2s ease, font-weight 0.2s ease',
                }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </LayoutGroup>
  );
}
```

- [ ] **Step 2: Add TabBar to layout.tsx**

Update `src/app/layout.tsx` to import and render TabBar:

```tsx
import type { Metadata } from 'next';
import './globals.css';
import LiquidBackground from '@/components/global/LiquidBackground';
import LiquidParticles from '@/components/global/LiquidParticles';
import TabBar from '@/components/global/TabBar';

export const metadata: Metadata = {
  title: 'Life Quest — 地球Online',
  description: '一只住在玻璃里的管家宠物，每天给你掉落生活任务',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <LiquidBackground />
        <LiquidParticles />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            minHeight: '100dvh',
            paddingBottom: 'calc(72px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          {children}
        </div>
        <TabBar />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Type-check + build**

```bash
pnpm tsc --noEmit && pnpm build
```

Expected: no errors.

- [ ] **Step 4: Verify in browser**

```bash
pnpm dev
```

- TabBar is visible at bottom of screen
- 4 tabs visible with icons and labels
- Clicking 任务雨 navigates to /tasks, indicator slides to that tab
- Clicking 记忆池 navigates to /pond, indicator slides
- At 375px width: all 4 tabs evenly distributed, no overflow
- Active tab icon is brighter than inactive tabs

- [ ] **Step 5: Commit**

```bash
git add src/components/global/TabBar.tsx src/app/layout.tsx
git commit -m "feat: add TabBar with layoutId liquid indicator animation + iOS safe area"
```

---

## Task 17: Zustand Butler Store (T-404)

**Files:**
- Create: `src/store/useButlerStore.ts`
- Modify: `src/app/page.tsx` (connect to store)

- [ ] **Step 1: Create directory and store**

```bash
mkdir -p src/store
```

`src/store/useButlerStore.ts`:

```typescript
import { create } from 'zustand';
import { type ButlerMood } from '@/components/butler/ButlerFace';

interface ButlerStore {
  mood: ButlerMood;
  setMood: (mood: ButlerMood) => void;
  totalCompleted: number;
  incrementCompleted: () => void;
}

export const useButlerStore = create<ButlerStore>((set) => ({
  mood: 'normal',
  setMood: (mood) => set({ mood }),
  totalCompleted: 0,
  incrementCompleted: () =>
    set((state) => ({ totalCompleted: state.totalCompleted + 1 })),
}));
```

- [ ] **Step 2: Connect home page to store**

Update `src/app/page.tsx` to use the store instead of local state:

```tsx
'use client';

import Butler from '@/components/butler/Butler';
import GlassButton from '@/components/ui/GlassButton';
import { useButlerStore } from '@/store/useButlerStore';

export default function HomePage() {
  const { mood, setMood } = useButlerStore();

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100dvh',
        paddingTop: '15vh',
        gap: '40px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Butler mood={mood} />

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <GlassButton size="sm" onClick={() => setMood('normal')} ariaLabel="Set mood normal">
          普通
        </GlassButton>
        <GlassButton size="sm" onClick={() => setMood('happy')} ariaLabel="Set mood happy">
          开心 😊
        </GlassButton>
        <GlassButton size="sm" onClick={() => setMood('sad')} ariaLabel="Set mood sad">
          委屈 😢
        </GlassButton>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Type-check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/store/useButlerStore.ts src/app/page.tsx
git commit -m "feat: add Zustand useButlerStore (mood state); connect home page to store"
```

---

## Task 18: Final Build Verification + GitHub Push (T-405)

- [ ] **Step 1: Run full build**

```bash
pnpm build
```

Expected: `✓ Compiled successfully`, zero TypeScript errors, zero ESLint errors.

- [ ] **Step 2: Run dev + manual P0 acceptance checklist**

```bash
pnpm dev
```

Check each item:
- [ ] `pnpm build` zero errors ✓ (step 1)
- [ ] Home page shows 3 animated blobs (不同颜色: 紫/蓝/粉)
- [ ] Butler visible, centered, in upper ~1/3 of viewport
- [ ] Butler breathing animation visible (subtle scale pulse)
- [ ] Clicking 开心: crescent eyes + wide smile + body floats up
- [ ] Clicking 委屈: large watery eyes + tears + frown + body sinks
- [ ] Clicking 普通: back to normal
- [ ] TabBar visible at bottom with 4 tabs
- [ ] All 4 tab links navigate correctly
- [ ] Indicator slides between tabs with spring animation
- [ ] At 375px width: no overflow, tabs evenly distributed
- [ ] 8 white particles drifting on screen
- [ ] No JS console errors (warnings okay)

- [ ] **Step 3: Check all files are under 200 lines**

```bash
wc -l src/components/ui/*.tsx src/components/butler/*.tsx src/components/global/*.tsx src/store/*.ts src/lib/*.ts
```

Expected: all files ≤ 200 lines.

- [ ] **Step 4: Push to GitHub**

```bash
git push origin master
```

Expected: push succeeds.

---

## Task 19: Vercel Deployment (T-406, T-407)

- [ ] **Step 1: Deploy to Vercel via CLI or dashboard**

Option A (CLI):
```bash
pnpm add -D vercel
pnpm vercel --prod
```

Option B (Dashboard): Go to vercel.com, import the GitHub repository, accept defaults (Next.js auto-detected).

Expected: deployment completes, Vercel provides a production URL (`https://your-project.vercel.app`).

- [ ] **Step 2: Verify production URL works**

Open the Vercel URL in:
- Desktop browser: background visible, butler visible, tabs work
- Mobile browser (iOS Safari or Android Chrome): layout fits, tabs visible, 44px tap targets

- [ ] **Step 3: Verify Vercel build log**

In Vercel dashboard → Deployments → latest → check build log.
Expected: no build errors (warnings okay).

- [ ] **Step 4: Confirm auto-deploy is set up**

In Vercel project settings, confirm "Production Branch" is set to `master` (or `main`). Future pushes will auto-deploy.

---

## Self-Review Checklist

### Spec Coverage

| Requirement | Task |
|-------------|------|
| AC-F1-01 pnpm dev works | Task 1 |
| AC-F1-02 pnpm build zero errors | Task 18 |
| AC-F1-03 liquid-glass.css CSS variables | Task 3 |
| AC-F1-04 GlassCard | Task 5 |
| AC-F1-05 GlassButton with hover | Task 5 |
| AC-F1-06 GlassModal | Task 6 |
| AC-F1-07 TypeScript strict | Task 1 |
| AC-F1-08 animations.ts springs | Task 4 |
| AC-F1-CQ-01 ≤200 lines | Task 18 step 3 |
| AC-F1-CQ-02 animations from animations.ts | All tasks |
| AC-F2-01 to AC-F2-06 LiquidBackground | Task 8 |
| AC-F2-07 prefers-reduced-motion | Task 3 (CSS) |
| AC-F3-01 to AC-F3-10 Butler | Tasks 12-15 |
| AC-F4-01 to AC-F4-08 TabBar | Task 16 |
| AC-F5-01 to AC-F5-04 page routes | Task 7 |
| AC-F6-01 to AC-F6-03 LiquidParticles | Task 11 |
| AC-F7-01 to AC-F7-05 Vercel deploy | Tasks 18-19 |

All P0 acceptance criteria are covered. P2 items (404 page AC-F5-05, particles reduced-motion AC-F6-04) are intentionally deferred.

### Placeholder Scan

No TBD, TODO (in plan steps), or "similar to Task N" patterns present. All code steps are complete.

### Type Consistency

- `ButlerMood` type exported from `ButlerFace.tsx`, imported by `Butler.tsx`, `useButlerStore.ts`, `LiquidBackground.tsx`
- `liftVariant`, `springBouncy`, `springGentle` used consistently across all components
- `tabIndicator` defined in `animations.ts`, used only in `TabBar.tsx`

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-16-phase-1-skeleton.md`.**

**Two execution options:**

**1. Subagent-Driven (recommended)** — Dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
