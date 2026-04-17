'use client';

import { motion, AnimatePresence } from "framer-motion";
import { springGentle } from "@/lib/animations";

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
      {/** Eyes - fade between mood states */}
      <AnimatePresence mode="wait">
        {mood === 'normal' && (
          <motion.g
            key="normal-eyes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/** Left eye */}
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
  )
}

