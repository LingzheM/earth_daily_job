# 设计规格 — BookCard（立体翻页书）

**角色**：UI/UX 设计师  
**日期**：2026-04-24  
**版本**：v1.0  
**输入**：docs/prd/component-book-card.md  
**开发任务卡**：docs/tasks/task-book-card.md

---

## 一、回答 PM 的 5 个问题

### Q1：书本默认尺寸

| 部件 | 数值 |
|------|------|
| 书脊宽度 | 16px |
| 封面宽度 | 140px |
| **书本总宽** | **156px**（书脊 16 + 封面 140） |
| 书本高度 | 200px |
| 书页侧面可见厚度 | 20px（右侧 + 底部） |
| 封面圆角（右侧两角） | 4px |
| 建议外层容器 | ≥ 200×240px（为侧面偏移留空间） |

---

### Q2：各部件颜色与材质

BookCard 是一个**物理书本**，不使用 `backdrop-filter`（CSS 3D transform 与 backdrop-filter 在大多数浏览器中不兼容）。书本通过渐变色和内高光模拟封面的光泽质感，与周围的液态玻璃环境形成材质对比。

| 部件 | 颜色 | 说明 |
|------|------|------|
| **封面外侧** | `linear-gradient(145deg, #1a1050 0%, #2D1B69 45%, #7B2FFF 100%)` | 深靛紫 → 品牌紫；顶部叠加白色光泽条 |
| **封面内侧** | `linear-gradient(160deg, #3a1050 0%, #9B2E7F 55%, #FF6B9D 100%)` | 玫瑰粉，翻开后形成惊喜对比 |
| **书脊** | `#110D3A` | 最深靛蓝；内侧右边缘有 `inset -2px 0 6px rgba(0,0,0,0.4)` 深影 |
| **后封面** | `#0E0A2D` | 近黑靛蓝 |
| **书页侧面** | `#EDE0CE`（最顶层）；向深层渐退至 `rgba(237,224,206,0.5)` | 暖米白，模拟纸张颜色 |

封面外侧光泽叠加：
```css
box-shadow: inset 0 1px 0 rgba(255,255,255,0.20), /* 顶边高光 */
            inset 1px 0 0 rgba(255,255,255,0.08); /* 左边缘微光 */
```

顶部渐变光泽覆盖层（伪元素）：
```css
background: linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 40%);
```

---

### Q3：书页侧面纹理实现方式

使用 **多层 div 叠加**，共 6 层，每层向外偏移 3px 并稍微缩短，模拟真实书页层次感。

```
层 0（最顶层）: #EDE0CE, opacity 1.0  ← 最亮，接近白色
层 1:           rgba(237,224,206,0.85)
层 2:           rgba(237,224,206,0.70)
层 3:           rgba(237,224,206,0.55)
层 4:           rgba(237,224,206,0.40)
层 5（最底层）: rgba(237,224,206,0.25)  ← 最暗
```

右侧 6 层：每层 `right: -(i+1) * 3px`，`top: i * 1px`，`height: 200px - i * 2px`  
底部 6 层：每层 `bottom: -(i+1) * 3px`，`left: 2px + i * 1px`，`width: 154px - i * 2px`

---

### Q4：翻开动画 Spring 参数

新增 `springBookFlip` 到 `src/lib/animations.ts`：

```ts
/** 书本翻页 — 约 0.5s，带轻微超出回弹 */
export const springBookFlip = {
  type: 'spring' as const,
  stiffness: 150,
  damping: 15,
  mass: 1,
};
```

| 参数 | 数值 | 说明 |
|------|------|------|
| stiffness | 150 | 偏快，封面"有重量但不迟钝" |
| damping | 15 | 欠阻尼（ζ ≈ 0.61），轻微超出后回弹 |
| mass | 1 | 标准质量 |
| 理论 settle 时间 | ~0.52s | 符合 AC-BOOK-11（0.5-0.6s） |
| 翻开目标角度 | -35deg（rotateY） | 比 PRD 的 25-30deg 略大，确保满足 AC-BOOK-06（内侧可见）|

> **注**：PRD 原定 25-30 度，但在 800px 透视下 35 度是使封面内侧开始可见的最小角度，属于设计决策。

---

### Q5：封面 transform-origin

```css
transform-origin: left center;
/* 等价于: 0px 100px（封面高度 200px 的中点） */
```

即封面左边缘（书脊连接处）正中心。封面元素的左边缘应与书脊右边缘对齐（`left: 16px`）。

---

## 二、完整 DOM 层级与 Z 轴结构

```
div [perspective: 800px, perspectiveOrigin: 30% 40%]
  div [book-root, position: relative, width: 156px, height: 200px]
  │
  ├── div [back-cover]       z 层: 最底
  ├── div [pages-right × 6]  z 层: 中间（向右溢出）
  ├── div [pages-bottom × 6] z 层: 中间（向下溢出）
  ├── div [inner-face]       z 层: 封面正下方（封面打开后露出）
  ├── div [spine]            z 层: 最高（始终在最前）
  └── motion.div [cover]     z 层: 封面层（rotateY 动画）
        └── div [cover-front-face]
        └── ::after [光泽覆盖]
```

`perspectiveOrigin: 30% 40%` — 从书本左上方 30% 处观察，给书脊和书页提供更多立体感。

---

## 三、各元素 CSS 规格

### 后封面
```css
position: absolute; inset: 0;
background: #0E0A2D;
border-radius: 2px 4px 4px 2px;
box-shadow: 3px 4px 16px rgba(0, 0, 0, 0.5);
```

### 书脊
```css
position: absolute;
left: 0; top: 0;
width: 16px; height: 100%;
background: #110D3A;
border-radius: 2px 0 0 2px;
box-shadow: inset -2px 0 6px rgba(0, 0, 0, 0.40),
            inset 1px 0 0 rgba(255, 255, 255, 0.06);
z-index: 4; /* 始终在最前 */
```

### 封面内侧（inner-face）
```css
position: absolute;
left: 16px; top: 0;
width: 140px; height: 100%;
background: linear-gradient(160deg, #3a1050 0%, #9B2E7F 55%, #FF6B9D 100%);
border-radius: 0 4px 4px 0;
z-index: 2; /* 在封面正下方 */
```

### 前封面（motion.div）
```css
position: absolute;
left: 16px; top: 0;
width: 140px; height: 100%;
transform-origin: left center;
z-index: 3;
```

### 封面外侧（cover front face）
```css
position: absolute; inset: 0;
background: linear-gradient(145deg, #1a1050 0%, #2D1B69 45%, #7B2FFF 100%);
border-radius: 0 4px 4px 0;
box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.20),
            inset 1px 0 0 rgba(255, 255, 255, 0.08);
overflow: hidden;
```

封面光泽伪元素 `::after`：
```css
content: '';
position: absolute; top: 0; left: 0; right: 0;
height: 45%;
background: linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%);
pointer-events: none;
```

---

## 四、Framer Motion 动画规格

```ts
// animations.ts 新增：
export const springBookFlip = {
  type: 'spring' as const,
  stiffness: 150,
  damping: 15,
  mass: 1,
};
```

```tsx
// 封面动画：
<motion.div
  animate={{ rotateY: isHovered ? -35 : 0 }}
  transition={springBookFlip}
  style={{ transformOrigin: 'left center' }}
>
```

---

## 五、TSX 组件模板

```tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { springBookFlip } from '@/lib/animations';

interface BookCardProps {
  /** 封面外侧颜色（CSS background 字符串） */
  coverColor?: string;
  /** 封面内侧颜色（翻开后可见） */
  innerColor?: string;
  /** 书脊颜色 */
  spineColor?: string;
  /** 封面标题文字（可选） */
  title?: string;
  /** 宽度（含书脊），默认 156px */
  width?: number;
  /** 高度，默认 200px */
  height?: number;
}

const SPINE_WIDTH = 16;
const PAGES_DEPTH = 20;
const PAGE_COUNT = 6;

export default function BookCard({
  coverColor = 'linear-gradient(145deg, #1a1050 0%, #2D1B69 45%, #7B2FFF 100%)',
  innerColor = 'linear-gradient(160deg, #3a1050 0%, #9B2E7F 55%, #FF6B9D 100%)',
  spineColor = '#110D3A',
  title,
  width = 156,
  height = 200,
}: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const coverWidth = width - SPINE_WIDTH;

  return (
    <div
      aria-label="书本"
      style={{
        perspective: '800px',
        perspectiveOrigin: '30% 40%',
        width: width + PAGES_DEPTH,
        height: height + PAGES_DEPTH,
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ position: 'relative', width, height }}>

        {/* 后封面 */}
        <div style={{
          position: 'absolute', inset: 0,
          background: '#0E0A2D',
          borderRadius: '2px 4px 4px 2px',
          boxShadow: '3px 4px 16px rgba(0,0,0,0.5)',
        }} />

        {/* 书页 — 右侧 */}
        {Array.from({ length: PAGE_COUNT }, (_, i) => (
          <div key={`pr-${i}`} style={{
            position: 'absolute',
            right: -(i + 1) * 3,
            top: i,
            width: PAGES_DEPTH,
            height: height - i * 2,
            background: `rgba(237, 224, 206, ${1 - i * 0.15})`,
            borderRadius: '0 2px 2px 0',
          }} />
        ))}

        {/* 书页 — 底部 */}
        {Array.from({ length: PAGE_COUNT }, (_, i) => (
          <div key={`pb-${i}`} style={{
            position: 'absolute',
            bottom: -(i + 1) * 3,
            left: SPINE_WIDTH + i,
            width: coverWidth - i * 2,
            height: PAGES_DEPTH,
            background: `rgba(237, 224, 206, ${1 - i * 0.15})`,
            borderRadius: '0 0 2px 2px',
          }} />
        ))}

        {/* 封面内侧（封面打开后露出，z-index 在封面下方） */}
        <div style={{
          position: 'absolute',
          left: SPINE_WIDTH, top: 0,
          width: coverWidth, height,
          background: innerColor,
          borderRadius: '0 4px 4px 0',
          zIndex: 2,
        }} />

        {/* 书脊（始终最前） */}
        <div style={{
          position: 'absolute',
          left: 0, top: 0,
          width: SPINE_WIDTH, height: '100%',
          background: spineColor,
          borderRadius: '2px 0 0 2px',
          boxShadow:
            'inset -2px 0 6px rgba(0,0,0,0.40), inset 1px 0 0 rgba(255,255,255,0.06)',
          zIndex: 4,
        }} />

        {/* 前封面（翻页动画） */}
        <motion.div
          style={{
            position: 'absolute',
            left: SPINE_WIDTH, top: 0,
            width: coverWidth, height,
            transformOrigin: 'left center',
            zIndex: 3,
          }}
          animate={{ rotateY: isHovered ? -35 : 0 }}
          transition={springBookFlip}
        >
          {/* 封面外侧 */}
          <div style={{
            position: 'absolute', inset: 0,
            background: coverColor,
            borderRadius: '0 4px 4px 0',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.20), inset 1px 0 0 rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}>
            {/* 顶部光泽条 */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: '45%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%)',
              pointerEvents: 'none',
            }} />
            {/* 标题（可选） */}
            {title && (
              <span style={{
                position: 'absolute', bottom: 20, left: 10, right: 10,
                color: 'rgba(255,255,255,0.82)',
                fontSize: 12, fontWeight: 600,
                textAlign: 'center', lineHeight: 1.3,
              }}>
                {title}
              </span>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
```

---

## 六、Props 接口（外部 API）

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `coverColor` | `string` | 靛紫渐变 | CSS background 字符串，封面外侧 |
| `innerColor` | `string` | 玫瑰粉渐变 | CSS background 字符串，封面内侧 |
| `spineColor` | `string` | `#110D3A` | 书脊颜色 |
| `title` | `string` | `undefined` | 封面标题（可选） |
| `width` | `number` | `156` | 书本总宽（含书脊），px |
| `height` | `number` | `200` | 书本高度，px |

---

## 七、浏览器兼容注意事项

- `transform-style: preserve-3d` + 子元素 `rotateY`：Chrome 110+ ✅，iOS Safari 16+ ✅，Firefox ✅
- `perspective` 需在直接父元素或祖先元素上设置
- 不使用 `backdrop-filter`，避免与 3D transform 的浏览器兼容问题
- `will-change: transform` 可加在 `motion.div` 上提升 GPU 合成层性能（开发决策）
