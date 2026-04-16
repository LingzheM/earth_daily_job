# docs/design/liquid-background.md

**文档状态**：✅ 完成（UI设计师产出）  
**版本**：1.0  
**日期**：2026-04-15  
**作者**：UI设计师（Grok）  
**输入文档**：docs/prd/phase-1-skeleton.md + CLAUDE.md（含 iOS 26 视觉升级）  
**适用 Phase**：Phase 1（Skeleton）  
**目标**：交付全局流动液体背景 + 基础粒子占位 + 情绪色温接口。

---

## 1. 整体视觉规格（已融入 iOS 26 升级）

- **层级**：`z-index: -1`，固定全屏
- **组成**：
  - 3-4 个大型 radial-gradient 色球（缓慢漂移）
  - 微颗粒噪点叠加层（全局轻微 texture）
  - 背景色温随管家 `mood` 微调（暖 → 冷）

---

## 2. 内联 HTML 原型（直接复制测试流动效果）

```html
<!DOCTYPE html>
<html>
<head>
<style>
  .liquid-bg {
    position: fixed; inset: 0; z-index: -1; overflow: hidden;
    background: linear-gradient(135deg, #1a1a2e, #16213e);
  }
  .blob {
    position: absolute; border-radius: 50%;
    filter: blur(80px); opacity: 0.6;
    animation: drift 25s infinite linear;
  }
  @keyframes drift {
    0% { transform: translate(0, 0); }
    100% { transform: translate(120px, -80px); }
  }
</style>
</head>
<body>
  <div class="liquid-bg">
    <!-- Blob 1 -->
    <div class="blob" style="width:600px;height:600px;background:radial-gradient(circle,#FF6B6B,#FFA07A);top:-10%;left:-10%;animation-delay:0s;"></div>
    <!-- Blob 2 -->
    <div class="blob" style="width:500px;height:500px;background:radial-gradient(circle,#4FACFE,#00F2FE);top:60%;right:-15%;animation-delay:-12s;"></div>
    <!-- Blob 3 -->
    <div class="blob" style="width:700px;height:700px;background:radial-gradient(circle,#A18CD1,#FBC2EB);bottom:-20%;left:20%;animation-delay:-8s;"></div>
  </div>
</body>
</html>
```

---

## 3. Framer Motion 参数

```ts
export const blobDrift = {
  x: [0, 80, -60, 40, 0],
  y: [0, -50, 70, -30, 0],
  transition: { duration: 28, repeat: Infinity, ease: "linear" }
};
```

---

## 4. 完整 React TSX 模板（直接复制使用）

```tsx
// src/components/global/LiquidBackground.tsx
import { motion } from 'framer-motion';
import { blobDrift } from '@/lib/animations';
import { useButlerStore } from '@/store/useButlerStore';

export default function LiquidBackground() {
  const { mood } = useButlerStore();

  const colorShift = mood === 'happy' 
    ? 'from-[#FF6B6B] via-[#FFA07A]' 
    : mood === 'sad' 
    ? 'from-[#4FACFE] via-[#00F2FE]' 
    : 'from-[#A18CD1] via-[#FBC2EB]';

  return (
    <div className="liquid-bg">
      {/* 3 个流动色球 */}
      <motion.div className={`absolute w-[600px] h-[600px] rounded-[50%] blur-[80px] opacity-60 ${colorShift}`} style={{ top: '-10%', left: '-10%' }} animate={blobDrift} />
      <motion.div className={`absolute w-[500px] h-[500px] rounded-[50%] blur-[80px] opacity-60 ${colorShift}`} style={{ top: '60%', right: '-15%' }} animate={blobDrift} transition={{ ...blobDrift.transition, delay: 12 }} />
      <motion.div className={`absolute w-[700px] h-[700px] rounded-[50%] blur-[80px] opacity-60 ${colorShift}`} style={{ bottom: '-20%', left: '20%' }} animate={blobDrift} transition={{ ...blobDrift.transition, delay: -8 }} />

      {/* 微颗粒噪点叠加层（iOS 26 升级） */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[length:3px_3px] opacity-5 pointer-events-none" />
    </div>
  );
}
```

---

**使用说明**：
- 在 `app/layout.tsx` 中置于最底层 `<LiquidBackground />`
- 已预留 `mood` 接口（通过 Zustand 自动同步）
- 粒子系统（LiquidParticles）Phase 1 只做占位，完整版 Phase 4 再实现

---




