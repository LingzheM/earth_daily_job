import { type ReactNode } from 'react';

interface BulterBodyProps {
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

export default function ButlerBody({children}: BulterBodyProps) {
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
        /** Extra inner highlight for thick-glass look */
        boxShadow: `
          var(--glass-glow),
          inset 0 0 30px rgba(123, 47, 255, 0.08),
          0 0 0 0.5px rgba(255, 255, 255, 0.5)
        `,
      }}
    >
      {/** Inner radial highlight - simulates light source at top-left */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: 'radial-gradient(circle at 38% 28%, rgba(255, 255, 255, 0.18) 0%, transprarent 55%',
          pointerEvents: 'none',
        }}
      />
      {children}
    </div>
  );
}