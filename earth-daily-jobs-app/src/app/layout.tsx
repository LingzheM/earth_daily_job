import type { Metadata } from 'next';
import './globals.css';
import LiquidBackground from '@/components/global/LiquidBackground';
import LiquidParticles from '@/components/global/LiquidParticles';

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
        <LiquidParticles />

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