# 设计系统规格文档 — Liquid Glass Design System

**角色**：UI/UX 设计师  
**日期**：2026-04-16  
**版本**：v2.0  
**输入文档**：docs/prd/phase-1-skeleton.md · CLAUDE.md  
**关联 AC**：AC-F1-03 · AC-F1-04 · AC-F1-05 · AC-F1-06 · AC-F1-08  
**适用 Phase**：Phase 1（Skeleton）及后续 Phase 共用基础层  
**使用方式**：CSS 变量写入 `src/styles/liquid-glass.css`，动画参数写入 `src/lib/animations.ts`，组件模板见本文第 9 节及 `docs/design/claude-design/` 目录。

---

## 1. 设计哲学

> 一切都像液体 —— 慢、软、粘、会融合。拒绝硬边、硬切、硬角。

视觉参考：Apple visionOS + iOS 26 liquid glass。

**我们的玻璃不是普通 glassmorphism**。不是一层薄磨砂膜，而是一块有厚度、有折射、有重量感的真实玻璃。透过玻璃看到的颜色，应该比直接看背景更鲜艳、更深邃 —— 这是高级毛玻璃的核心标志。

三个必须达到的质感要素：

1. **通透配方（blur + saturate + brightness）**：`backdrop-filter` 必须叠加 `saturate(180%)` 让背景色透过玻璃后更鲜艳，以及 `brightness(1.1)` 让玻璃自身带微光。缺少 `saturate` 的玻璃只是"糊"，不是"通透"。
2. **Hover Lift（抬起 + 彩色投影）**：可交互的玻璃元素 hover 时用 `translateY(-4px)` 抬起 + 底部彩色扩散投影放大，产生 3D 悬浮感，而非平面 scale。
3. **微颗粒噪点纹理**：玻璃表面叠加极低透明度（3.5%）的 noise texture，打破数字的"完美光滑"，增加实体触感。用内联 SVG filter 的 `<feTurbulence>` 生成，不引入外部图片。

三个设计禁忌：纯色背景、尖锐边角（< 12px）、快速线性动画。

---

## 2. CSS 变量完整定义

写入 `src/styles/liquid-glass.css`：

```css
:root {

  /* ===== 玻璃材质 ===== */

  /* 背景透明度三态 */
  --glass-bg:           rgba(255, 255, 255, 0.08);
  --glass-bg-hover:     rgba(255, 255, 255, 0.12);
  --glass-bg-active:    rgba(255, 255, 255, 0.15);

  /* backdrop-filter 完整配方（blur + saturate + brightness 三件套） */
  --glass-blur:         blur(24px) saturate(180%) brightness(1.1);
  --glass-blur-heavy:   blur(40px) saturate(200%) brightness(1.05);  /* Modal / TabBar */
  --glass-blur-light:   blur(12px) saturate(160%) brightness(1.1);   /* 按钮 / 小元素 */

  /* 边框 — 1px 比 0.5px 更有"激光切割玻璃"质感 */
  --glass-border:       1px solid rgba(255, 255, 255, 0.25);
  --glass-border-hover: 1px solid rgba(255, 255, 255, 0.35);

  /* 内发光 — 三层叠加模拟厚玻璃光线折射 */
  --glass-glow: inset 0 1px 1px rgba(255, 255, 255, 0.30),
                inset 0 -1px 2px rgba(255, 255, 255, 0.05),
                inset 0 0 12px rgba(255, 255, 255, 0.04);

  /* 强内发光 — 用于 Modal 等浮层 */
  --glass-glow-strong: inset 0 1px 2px rgba(255, 255, 255, 0.35),
                       inset 0 -1px 2px rgba(255, 255, 255, 0.05);

  /* Hover Lift 投影 — 彩色扩散，模拟玻璃悬浮时对光的散射 */
  --glass-lift-shadow:       0 8px  32px rgba(120, 60, 255, 0.15),
                             0 4px  16px rgba(0, 0, 0, 0.10);
  --glass-lift-shadow-hover: 0 16px 48px rgba(120, 60, 255, 0.25),
                             0 8px  24px rgba(0, 0, 0, 0.15);


  /* ===== 圆角（永远偏大，最小 12px） ===== */
  --radius-sm:   12px;
  --radius-md:   20px;
  --radius-lg:   28px;
  --radius-xl:   36px;
  --radius-full: 9999px;


  /* ===== 间距（4px 网格） ===== */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;


  /* ===== 字体 ===== */
  /* 主字体：系统原生栈，SF Pro on Apple / Segoe UI on Windows，'Noto Sans SC' 中文兜底 */
  --font-primary: 'SF Pro Display', -apple-system, BlinkMacSystemFont,
                  'Segoe UI', 'Noto Sans SC', sans-serif;
  /* 等宽：时间戳、代码、标签数值 */
  --font-mono:    'SF Mono', 'Fira Code', 'Consolas', monospace;


  /* ===== 字号（仅尺寸值，行高/字重见第 5 节表格） ===== */
  --text-xs:   11px;
  --text-sm:   13px;
  --text-base: 15px;
  --text-lg:   18px;
  --text-xl:   24px;
  --text-2xl:  32px;


  /* ===== 文字色 ===== */
  --text-primary:   rgba(255, 255, 255, 0.92);  /* 标题 */
  --text-secondary: rgba(255, 255, 255, 0.60);  /* 正文、描述 */
  --text-tertiary:  rgba(255, 255, 255, 0.35);  /* 提示、时间戳、占位 */
  --text-accent:    rgba(255, 255, 255, 1.00);  /* 活跃 Tab 图标、强调 */


  /* ===== 背景色球（定义在此，LiquidBackground 直接引用） ===== */
  --blob-purple: #7B2FFF;  /* 极光紫，核心色调 */
  --blob-blue:   #0A3CFF;  /* 深海蓝，冷调平衡 */
  --blob-pink:   #FF6B9D;  /* 蜜桃粉，暖调点缀 */


  /* ===== 语义色（Phase 2+ 使用，Phase 1 预定义） ===== */
  --color-success:    #5DCAA5;
  --color-warning:    #EF9F27;
  --color-info:       #85B7EB;
  --color-mood-happy: #FFA07A;  /* mood=happy 时色温叠加 */
  --color-mood-sad:   #4FACFE;  /* mood=sad 时色温叠加 */


  /* ===== 层级（Z-index） ===== */
  --z-background:    -1;  /* LiquidBackground 色球 */
  --z-particles:      0;  /* LiquidParticles，pointer-events: none */
  --z-content:        1;  /* 页面内容（Butler、卡片） */
  --z-tabbar:        10;  /* 底部 TabBar，fixed */
  --z-modal-overlay: 20;  /* Modal 遮罩，盖住 TabBar */
  --z-modal:         21;  /* Modal 内容 */
  --z-toast:         30;  /* Toast 通知，最高层 */


  /* ===== 动画时长 ===== */
  --duration-fast:   0.3s;
  --duration-normal: 0.5s;
  --duration-slow:   0.8s;

}
```

---

## 3. 颜色系统

### 3.1 背景色球（Gradient Blobs）

Phase 1 默认使用三个高饱和霓虹色球，形成鲜艳通透的毛玻璃折射效果。

| 色球 | 变量名 | 色值 | 用途 |
|------|--------|------|------|
| 极光紫 | `--blob-purple` | `#7B2FFF` → transparent | 核心色调，常驻右上 |
| 深海蓝 | `--blob-blue`   | `#0A3CFF` → transparent | 冷调平衡，常驻左下 |
| 蜜桃粉 | `--blob-pink`   | `#FF6B9D` → transparent | 暖调点缀，中区漂移 |

渐变写法：`radial-gradient(circle, #7B2FFF 0%, transparent 70%)`

**Mood 色温映射**（Phase 1 预留接口，Phase 2 实现逻辑）：

| Mood | 调整方式 |
|------|----------|
| normal | 默认三球，不调整 |
| happy | 蜜桃粉色球饱和度 +20%，极光紫减小，整体偏暖 |
| sad | 深海蓝色球饱和度 +20%，蜜桃粉减小，整体偏冷 |

### 3.2 文字色阶

```
--text-primary   0.92  标题、数字、重要内容
--text-secondary 0.60  正文、描述、Tab 标签（活跃）
--text-tertiary  0.35  时间戳、提示、占位、Tab 标签（非活跃）
--text-accent    1.00  活跃 Tab 图标、强调高亮
```

---

## 4. 间距规范

基于 4px 网格，优先使用 `--space-*` 变量，不硬编码数值。

| 场景 | 数值 |
|------|------|
| GlassCard 内边距（移动端） | `--space-4`（16px） |
| GlassCard 内边距（桌面端） | `--space-5`（20px） |
| GlassButton 内边距 | `12px var(--space-6)`（12px 24px） |
| 组件间距（紧凑） | `--space-3`（12px） |
| 组件间距（标准） | `--space-4`（16px） |
| 组件间距（宽松） | `--space-6`（24px） |
| 页面边距（移动端） | `--space-4`（16px） |
| 页面边距（桌面端） | `--space-6`（24px） |
| TabBar 底部 | `env(safe-area-inset-bottom, 0px)` + `--space-2` |

---

## 5. 字号体系

| Token | 大小 | 行高 | 字重 | 字间距 | 用途 |
|-------|------|------|------|--------|------|
| `--text-xs`   | 11px | 1.4 | 500 | +0.06em（配合全大写）| 时间戳、分类标签（ALL CAPS） |
| `--text-sm`   | 13px | 1.5 | 400 | — | 辅助文字、Tab 标签、按钮 |
| `--text-base` | 15px | 1.6 | 400 | — | 正文、描述（行高 1.6 适合中文阅读） |
| `--text-lg`   | 18px | 1.4 | 500 | — | 小标题、卡片标题 |
| `--text-xl`   | 24px | 1.3 | 600 | -0.01em | 页面标题 |
| `--text-2xl`  | 32px | 1.2 | 700 | -0.02em | 大数字、关键数据 |

---

## 6. 层级系统

```
z-toast         30  ████████████████████████████████  Toast 通知（最高）
z-modal         21  █████████████████████████████
z-modal-overlay 20  ████████████████████████████      遮罩（盖 TabBar）
z-tabbar        10  ████████████████████              固定底部导航
z-content        1  ████████                          页面主体内容
z-particles      0  ████                              粒子（pointer-events:none）
z-background    -1  ██                                色球背景层
```

**注意**：Modal overlay（z=20）需要盖住 TabBar（z=10），确保弹窗时导航不可见。

---

## 7. 动画系统

### 7.1 Spring 参数（Framer Motion）

写入 `src/lib/animations.ts`，**所有组件必须从此文件引用，禁止硬编码**（AC-F1-CQ-02）。

```typescript
/** 快速弹跳 — 任务雨滴着陆、按钮点击反弹 */
export const springBouncy = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 20,
  mass: 1,
};

/** 柔和弹性 — 情绪切换、Modal 打开、Tab 指示器滑动 */
export const springGentle = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 14,
  mass: 1,
};

/** 缓慢流动 — 液态背景大范围位移、记忆池物理 */
export const springSlow = {
  type: 'spring' as const,
  stiffness: 80,
  damping: 12,
  mass: 1.2,
};
```

### 7.2 CSS 动画

| 动画名 | 属性变化 | 时长 | 缓动 | 循环 | 用途 |
|--------|----------|------|------|------|------|
| `breathe` | scale: 1.0 → 1.04 → 1.0 | 3s | ease-in-out | infinite | Butler 呼吸待机 |
| `blob-drift-a` | translate | 25s | ease-in-out | infinite alternate | 色球 A 漂移 |
| `blob-drift-b` | translate | 30s | ease-in-out | infinite alternate | 色球 B 漂移（时长错开） |
| `blob-drift-c` | translate | 22s | ease-in-out | infinite alternate | 色球 C 漂移（时长错开） |
| `particle-float` | translate + opacity | 8–15s | linear | infinite | 粒子飘浮 |

三个色球使用不同时长，形成交错的非规律漂移，避免整体画面同步感。

### 7.3 Hover Lift 模型

所有可点击的玻璃元素统一使用 Hover Lift，而非平面 scale：

```typescript
// animations.ts 中定义
export const HOVER_Y      = -4;    // px，hover 抬起高度
export const ACTIVE_Y     = -1;    // px，按下时轻微保留抬起
export const ACTIVE_SCALE = 0.98;  // 按下时轻微缩放

/** GlassButton + 可交互 GlassCard 共用 */
export const liftVariant = {
  hover: { y: HOVER_Y },
  tap:   { y: ACTIVE_Y, scale: ACTIVE_SCALE },
};
```

**实现分工**：Framer Motion `variants={liftVariant}` 负责 `y` 位移；CSS `.glass-interactive:hover` 负责 shadow 和 background 变化。两者不要混写。

### 7.4 动画 Variant 汇总

```typescript
/** 呼吸动画 */
export const breatheVariant = {
  animate: {
    scale: [1.0, 1.04, 1.0],
    transition: { duration: 3, ease: 'easeInOut', repeat: Infinity },
  },
};

/** Modal 打开 / 关闭 */
export const modalVariant = {
  hidden:  { scale: 0.85, opacity: 0 },
  visible: { scale: 1,    opacity: 1 },
  exit:    { scale: 0.9,  opacity: 0 },
};
```

### 7.5 prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 8. Glass 类系统

写入 `src/styles/liquid-glass.css`，组件通过 `className` 引用，不写 inline style。

### 8.1 基础类 `.glass`

```css
.glass {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--glass-glow);
  position: relative;  /* 必须，供 ::after 噪点定位 */
  color: var(--text-primary);
}
```

### 8.2 噪点纹理 `.glass::after`

```css
/* 叠加 3.5% 不透明的 SVG fractal noise，增加实体触感 */
.glass::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0.035;
  pointer-events: none;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

### 8.3 交互类 `.glass-interactive`

叠加在 `.glass` 之上，所有带 `onClick` 的玻璃元素使用 `className="glass glass-interactive"`。

```css
.glass-interactive {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.2s ease,
              border-color 0.2s ease;
  box-shadow: var(--glass-glow), var(--glass-lift-shadow);
}

.glass-interactive:hover {
  background: var(--glass-bg-hover);
  border: var(--glass-border-hover);
  box-shadow: var(--glass-glow), var(--glass-lift-shadow-hover);
  /* y 位移由 Framer Motion liftVariant 处理，此处不写 transform */
}

.glass-interactive:active {
  background: var(--glass-bg-active);
}

.glass-interactive:focus-visible {
  outline: none;
  box-shadow: var(--glass-glow), var(--glass-lift-shadow),
              0 0 0 2px rgba(255, 255, 255, 0.18);
}
```

### 8.4 变体

| 类名 | 适用场景 | 差异 |
|------|----------|------|
| `.glass` | 通用容器、卡片 | 基础（bg 0.08, blur 24px compound） |
| `.glass-elevated` | Modal、ButlerBubble、浮层 | bg 0.12, `--glass-blur-heavy`, `--glass-glow-strong` |
| `.glass-dim` | Disabled 状态、非活跃背景 | bg 0.04, `--glass-blur-light`, opacity 0.55 |

```css
.glass-elevated {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: var(--glass-blur-heavy);
  -webkit-backdrop-filter: var(--glass-blur-heavy);
  border: var(--glass-border);
  box-shadow: var(--glass-glow-strong), 0 8px 32px rgba(0, 0, 0, 0.2);
}

.glass-dim {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: var(--glass-blur-light);
  -webkit-backdrop-filter: var(--glass-blur-light);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: none;
  opacity: 0.55;
}
```

---

## 9. 基础组件规格

### 9.1 GlassCard

**视觉描述**：半透明玻璃容器，顶部有白色高光线（内发光），通过背景透过时的饱和度增强产生通透感。可选 Hover Lift 交互。

**Props**：
```typescript
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;   // 开启 hover 高亮，默认 false
  onClick?: () => void;  // 传入时自动开启 hoverable + cursor:pointer
}
```

**关键实现要点**：
- `className={`glass ${isInteractive ? 'glass-interactive' : ''}`}`
- `backdropFilter: 'var(--glass-blur)'`（不要写 `blur(var(--glass-blur))`）
- `border: 'var(--glass-border)'`
- `position: 'relative'`（供 `::after` 噪点定位）
- 交互版需将根元素改为 `motion.div`，加 `variants={liftVariant} whileHover="hover" whileTap="tap" transition={springBouncy}`

**尺寸规范**：
| 属性 | 移动端 | 桌面端 |
|------|--------|--------|
| padding | 16px | 20px |
| border-radius | `--radius-lg`（28px） | `--radius-lg`（28px） |
| min-width | — | — |

---

### 9.2 GlassButton

**视觉描述**：和 GlassCard 同材质，但使用 `--glass-blur-light`（较低模糊度）。Hover 时 Lift 抬起，Active 时轻微回压。

**Props**：
```typescript
interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost';  // ghost：无背景无边框
  ariaLabel?: string;
}
```

**尺寸映射**：
| size | 高度 | 内边距 | 字号 | 圆角 |
|------|------|--------|------|------|
| sm | 36px | 8px 16px | 12px | `--radius-sm`（12px） |
| md | 44px | 12px 24px | 13px | `--radius-md`（20px） |
| lg | 52px | 14px 32px | 15px | `--radius-md`（20px） |

**关键实现要点**：
- `backdropFilter: 'var(--glass-blur-light)'`
- `variants={liftVariant} whileHover="hover" whileTap="tap" transition={springBouncy}`
- `disabled` 时：`opacity: 0.4, cursor: 'not-allowed'`，不传 `whileHover/whileTap`
- `position: 'relative'`（供 `::after` 噪点定位）
- 最小高度 44px（移动端触控标准）

---

### 9.3 GlassModal

**视觉描述**：从中心 fade + scale 打开的玻璃浮层（Phase 1），Phase 2 升级为从 `originRect` 原位生长。

**Props**：
```typescript
interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  /** Phase 2：触发元素位置，实现原位生长 */
  originRect?: DOMRect;
}
```

**层级结构**：
```
Overlay（z = --z-modal-overlay = 20）
  background: rgba(0,0,0,0.3)
  backdropFilter: blur(8px)    ← overlay 只用纯 blur，不加 saturate
  └── Modal 内容（z = --z-modal = 21）
        className="glass-elevated"
        borderRadius: --radius-xl（36px）
        maxWidth: 360px（移动端） / 480px（桌面端）
        padding: 24px
```

**动画**：
- 打开：`scale: 0.85 → 1.0, opacity: 0 → 1`，使用 `springGentle`
- 关闭：`scale: 1.0 → 0.9, opacity: 1 → 0`，`duration: 0.2s`
- 包裹在 `AnimatePresence` 中

**必须实现的行为**：
- ESC 键触发 `onClose`
- 点击 Overlay 触发 `onClose`
- 打开时锁定 `body` 滚动（`overflow: hidden`），关闭时恢复

---

## 10. 响应式断点

```css
--breakpoint-sm:  375px;   /* iPhone SE，Phase 1 最小宽度 */
--breakpoint-md:  393px;   /* iPhone 14 Pro */
--breakpoint-lg:  768px;   /* iPad */
--breakpoint-xl:  1440px;  /* 大桌面，Phase 1 验收目标 */
```

Phase 1 主要保证 375px 和 1440px 两个极端正常显示（AC-F2-05）。

---

## 11. 文件映射

| 内容 | 写入位置 |
|------|----------|
| 全部 CSS 变量（第 2、8 节） | `src/styles/liquid-glass.css` |
| Spring 参数 + Variants（第 7 节） | `src/lib/animations.ts` |
| GlassCard 组件 | `src/components/ui/GlassCard.tsx` |
| GlassButton 组件 | `src/components/ui/GlassButton.tsx` |
| GlassModal 组件 | `src/components/ui/GlassModal.tsx` |
| 参考模板 | `docs/design/claude-design/*.tsx` |

---

## 12. 变更日志

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0 | 2026-04-15 | 初稿（claude-design 目录） |
| v2.0 | 2026-04-16 | 全面升级：① backdrop-filter 改为 blur+saturate+brightness 三件套；② Hover 模型从 scale 改为 Hover Lift（translateY -4px + 彩色投影）；③ 背景色球改为高饱和霓虹色（#7B2FFF/#0A3CFF/#FF6B9D）；④ 增加噪点纹理（.glass::after SVG feTurbulence）；⑤ 边框改为 1px/0.25；⑥ --glass-glow 改为三层叠加；⑦ 新增 liftVariant 到 animations.ts；⑧ 字体栈补充 Noto Sans SC 中文兜底；⑨ text-xs 字重改为 500；⑩ text-base 行高改为 1.6 |

---

*文档维护：UI/UX 设计师 | 下次更新触发条件：CLAUDE.md 设计系统章节变更，或新组件进入设计阶段*
