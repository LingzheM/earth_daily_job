# docs/design/tab-bar.md

**文档状态**：✅ 完成（UI设计师产出）  
**版本**：1.0  
**日期**：2026-04-15  
**作者**：UI设计师（Grok）  
**输入文档**：docs/prd/phase-1-skeleton.md + CLAUDE.md（含 iOS 26 视觉升级）  
**适用 Phase**：Phase 1（Skeleton）  
**目标**：交付底部玻璃 Tab Bar 完整视觉规格、液态滑动指示器、Framer Motion 参数及可直接复制的组件模板。

---

## 1. 整体视觉规格（已融入 iOS 26 升级）

- **位置**：固定在视口底部（`fixed bottom-0`），支持 iOS Safe Area
- **高度**：72px（含 Safe Area）
- **玻璃质感**：
  - 使用 `.glass` 基类
  - 微颗粒噪点 + 极细激光切割高光边（0.5px 白色半透明）
  - 背景略微更透明（opacity 0.85），让底层 LiquidBackground 透出更多流动感
- **Hover / Active 状态**：
  - 激活 Tab：图标 + 文字颜色变为纯白高亮
  - 液态指示器：下方出现一条柔和彩色光条（宽度 = Tab 宽度），切换时平滑滑动
  - Hover Lift：单个 Tab Hover 时轻微上抬 4px + 下方投影放大 1.8 倍

---

## 2. 内联 HTML 原型（直接复制到 .html 测试真实毛玻璃 + 滑动效果）

```html
<!DOCTYPE html>
<html>
<head>
<style>
  .tab-bar {
    position: fixed; bottom: 0; left: 0; right: 0;
    height: 72px; display: flex; align-items: center; justify-content: space-around;
    background: rgba(255,255,255,0.12); backdrop-filter: blur(24px);
    border-top: 0.5px solid rgba(255,255,255,0.18);
    box-shadow: inset 0 1px 1px rgba(255,255,255,0.25), 0 -4px 20px rgba(0,0,0,0.15);
    border-radius: 0; /* TabBar 顶部不需要圆角 */
  }
  .tab {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;
    font-size: 10px; color: rgba(255,255,255,0.75); transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  .tab.active { color: #fff; }
  .indicator {
    position: absolute; bottom: 8px; height: 3px; background: linear-gradient(90deg, #FF6B6B, #00F2FE);
    border-radius: 9999px; box-shadow: 0 0 12px #FF6B6B; /* 彩色光晕 */
    transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
  }
</style>
</head>
<body style="background: linear-gradient(#1a1a2e, #16213e); height: 100vh; margin:0;">
  <div class="tab-bar">
    <div class="tab active"><span style="font-size:24px">🏠</span><span>Home</span></div>
    <div class="tab"><span style="font-size:24px">🌧</span><span>任务雨</span></div>
    <div class="tab"><span style="font-size:24px">✨</span><span>记忆池</span></div>
    <div class="tab"><span style="font-size:24px">⚙️</span><span>设置</span></div>
    <div class="indicator" style="width:25%; left:0;"></div>
  </div>
</body>
</html>
```

---

## 3. Framer Motion 参数（统一放在 animations.ts）

```ts
export const tabIndicator = {
  type: "spring",
  stiffness: 300,
  damping: 25,
  mass: 0.8
};
```

---

## 4. 完整 React TSX 模板（直接复制使用）

```tsx
// src/components/global/TabBar.tsx
import { motion, LayoutGroup } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { springGentle } from '@/lib/animations';

const tabs = [
  { id: 'home', label: 'Home', icon: '🏠', href: '/' },
  { id: 'tasks', label: '任务雨', icon: '🌧', href: '/tasks' },
  { id: 'pond', label: '记忆池', icon: '✨', href: '/pond' },
  { id: 'settings', label: '设置', icon: '⚙️', href: '/settings' },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <LayoutGroup>
      <motion.div
        className="glass fixed bottom-0 left-0 right-0 h-[72px] flex items-center px-2 z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={springGentle}
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link key={tab.id} href={tab.href} className="flex-1 flex flex-col items-center gap-1 py-1">
              <motion.div
                className={`text-3xl transition-colors ${isActive ? 'text-white' : 'text-white/70'}`}
                whileHover={{ scale: 1.15, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.icon}
              </motion.div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-white' : 'text-white/70'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}

        {/* 液态滑动指示器 */}
        <motion.div
          layoutId="tabIndicator"
          className="absolute bottom-3 h-1 bg-gradient-to-r from-[#FF6B6B] to-[#00F2FE] rounded-full shadow-[0_0_12px_#FF6B6B]"
          style={{ width: '20%', left: 'calc(10% + var(--tab-index, 0) * 20%)' }}
          transition={tabIndicator}
        />
      </motion.div>
    </LayoutGroup>
  );
}
```

---

**使用说明**：
- 在 `app/layout.tsx` 中直接 `<TabBar />`
- 激活状态由 `usePathname` 自动判断
- 液态指示器使用 `layoutId` 实现丝滑滑动

---