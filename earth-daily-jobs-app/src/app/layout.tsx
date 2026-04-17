import type { Metadata } from "next";
import "./globals.css";
import LiquidBackground from "@/components/global/LiquidBackground";

export const metadata: Metadata = {
  title: "Lift Quest",
  description: "tamagochi",
  viewport: 'width=device-width,initial-scale=1,viewport-fit=cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
    >
      <body>
        {/** Global background - z-index: -1 */}
        <LiquidBackground />

        {/** Page content */}
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
