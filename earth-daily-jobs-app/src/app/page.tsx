'use client';

import { useState } from "react";
import Butler from "@/components/butler/Butler";
import GlassButton from "@/components/ui/GlassButton";
import { type ButlerMood } from "@/components/butler/ButlerFace";

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
      <Butler mood={mood} />

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