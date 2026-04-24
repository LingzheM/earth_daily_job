'use client';

import BookCard from '@/components/ui/BookCard';

export default function PondPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div style={{
        display: 'flex',
        gap: '48px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-end',
        padding: '0 24px',
      }}>
        <BookCard
          title="今日任务"
          subtitle="DAILY QUEST"
        />
        <BookCard
          coverColor="#1e4470"
          innerColor="#e8ddd0"
          spineColor="#122e4a"
          thicknessColor="#163858"
          title="记忆池"
          subtitle="MEMORIES"
        />
        <BookCard
          coverColor="#4a1a5c"
          innerColor="#f0e6f0"
          spineColor="#2a0a35"
          thicknessColor="#3a1248"
          title="心情日记"
          subtitle="MOOD LOG"
        />
      </div>
    </main>
  );
}
