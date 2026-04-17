'use client';

import { motion } from 'framer-motion';
import { springGentle } from '@/lib/animations';
import ButlerBody from './ButlerBody';
import ButlerFace, { type ButlerMood } from './ButlerFace';
import ButlerBubble from './ButlerBubble';

interface ButlerProps {
  mood?: ButlerMood;
}

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