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
  /**
   * Phase 2: connect to useBulterStore to shift color temperature
   */
  mood?: ButlerMood;
}

export default function LiquidBackground({mood: _mood = 'normal'}: LiquidBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a0a12 0%, #0d0d1a 50%, #080812 100%)'
      }}
    >
      {/** Blob A -upper right 25s drift */}
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
          opacity: 'blur(60px)',
          animation: 'blob-drift-a 25s ease-in-out infinite alternate',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '55vw',
          height: '5vw',
          maxWidth: '550px',
          maxHeight: '550px',
          background: 'radial-gradient(circle, #0A3CFF 0%, transparent 70%)',
          borderRadius: '50%',
          bottom: '-10%',
          left: '-8%',
          opacity: 'blur(60px)',
          animation: 'blob-drift-b 30s ease-in-out infinite alternate',
        }}
      />
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
          right: '30%',
          opacity: 0.35,
          filter: 'blur(80px)',
          animation: 'blob-drift-c 22s ease-in-out infinite alternate',
        }}
      />
    </div>
  );
}