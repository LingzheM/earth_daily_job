'use client';

import BookCard from '@/components/ui/BookCard';

export default function PondPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-end' }}>
        <BookCard title="今日任务" />
        <BookCard
          coverColor="linear-gradient(145deg, #0A3CFF 0%, #0066CC 45%, #00C6FF 100%)"
          innerColor="linear-gradient(160deg, #003070 0%, #0066CC 55%, #5DCAA5 100%)"
          spineColor="#051535"
          title="记忆池"
        />
        <BookCard
          coverColor="linear-gradient(145deg, #5C1A1A 0%, #8B2252 45%, #FF6B9D 100%)"
          innerColor="linear-gradient(160deg, #4A0E30 0%, #C43A6A 55%, #FFB3D1 100%)"
          spineColor="#2A0A15"
          title="心情日记"
        />
      </div>
    </main>
  );
}
