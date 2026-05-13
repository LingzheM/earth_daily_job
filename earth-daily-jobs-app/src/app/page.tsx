'use client';

import { useState } from "react";
import Butler from "@/components/butler/Butler";
import GlassButton from "@/components/ui/GlassButton";
import { type ButlerMood } from "@/components/butler/ButlerFace";
import DonutCanvas from "@/components/ui/DonutCanvas";
import TiltedPlanet from "@/components/ui/TiltedPlanet";
import SolidPlanet from "@/components/ui/SolidPlanet";

export default function HomePage() {
  const [mood, setMood] = useState<ButlerMood>('normal');

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <SolidPlanet />
    </main>
  )

  /** 
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
  */
}