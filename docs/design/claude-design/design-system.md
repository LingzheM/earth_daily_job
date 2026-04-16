# 设计系统规格文档 — Liquid Glass Design System

> **角色**：UI/UX 设计师  
> **日期**：2026-04-15  
> **版本**：v1.0  
> **关联 PRD**：phase-1-skeleton.md › F1  
> **关联 AC**：AC-F1-03, AC-F1-04, AC-F1-05, AC-F1-06, AC-F1-08

---

## 设计哲学

> 一切都像液体 —— 慢、软、粘、会融合。拒绝硬边、硬切、硬角。

视觉参考：Apple visionOS + iOS 26 liquid glass。
核心质感：**厚玻璃**（不是薄膜），有重量感，内部有光线折射。

三个关键词：
- **Translucent**（半透明） — 能看到背后的色彩，但不是完全透明
- **Glowing**（内发光） — 顶部边缘有白色高光条，像阳光打在玻璃上
- **Bouncy**（弹性） — 所有交互都有物理弹跳回弹感

---

## 1. 颜色系统

### 1.1 背景色球（Gradient Blobs）

LiquidBackground 使用 3-4 个大型 radial-gradient 色球，慢速漂移。

| 色球 | 色值 | 尺寸 | 用途 |
|------|------|------|------|
| Blob A — 暖橙 | `#FF6B6B` → `transparent` | 40-50vw | 默认常驻，活力感 |
| Blob B — 冷蓝 | `#4FACFE` → `transparent` | 35-45vw | 默认常驻，平衡冷暖 |
| Blob C — 紫粉 | `#A18CD1` → `transparent` | 30-40vw | 默认常驻，梦幻感 |
| Blob D — 青绿（可选） | `#00F2FE` → `transparent` | 25-35vw | 增加层次，Phase 1 可省略 |

**Mood 色温映射**（Phase 1 预留接口，Phase 2 实现）：
| Mood | 调整 |
|------|------|
| normal | 默认色值，不调整 |
| happy | Blob A 饱和度 +15%，Blob B 减小，整体偏暖 |
| sad | Blob B 饱和度 +15%，Blob A 减小，整体偏冷 |

### 1.2 玻璃表面色

```css
/* 玻璃背景 — 注意这是两层效果叠加 */
--glass-bg: rgba(255, 255, 255, 0.08);           /* 基底白色薄层 */
--glass-bg-hover: rgba(255, 255, 255, 0.12);     /* hover 状态 */
--glass-bg-active: rgba(255, 255, 255, 0.15);    /* active/pressed 状态 */

/* 玻璃边框 — 极细的白色描边 */
--glass-border: rgba(255, 255, 255, 0.18);
--glass-border-hover: rgba(255, 255, 255, 0.28);

/* 模糊强度 */
--glass-blur: 24px;              /* 主模糊层 */
--glass-blur-heavy: 40px;        /* TabBar 等需要更强隔离的组件 */
--glass-blur-light: 12px;        /* 小元素、粒子 */

/* 内发光 — 这是"厚玻璃"质感的关键 */
--glass-glow: inset 0 1px 1px rgba(255, 255, 255, 0.25);
--glass-glow-strong: inset 0 1px 2px rgba(255, 255, 255, 0.35);
```

### 1.3 文字色

```css
--text-primary: rgba(255, 255, 255, 0.92);       /* 标题 */
--text-secondary: rgba(255, 255, 255, 0.60);     /* 正文、描述 */
--text-tertiary: rgba(255, 255, 255, 0.35);      /* 提示、时间戳、占位 */
--text-accent: rgba(255, 255, 255, 1.0);         /* 强调、活跃 Tab 图标 */
```

### 1.4 语义色（用于 Toast、成就等，Phase 2+）

```css
--color-success: #5DCAA5;    /* 完成任务 */
--color-warning: #EF9F27;    /* 提醒 */
--color-info: #85B7EB;       /* 信息 */
--color-mood-happy: #FFA07A; /* 开心色温叠加 */
--color-mood-sad: #4FACFE;   /* 委屈色温叠加 */
```

---

## 2. 字体

### 2.1 字体族

```css
--font-primary: 'SF Pro Display', -apple-system, BlinkMacSystemFont,
                'Segoe UI', 'Noto Sans SC', sans-serif;
--font-mono: 'SF Mono', 'Fira Code', 'Consolas', monospace;
```

**说明**：使用系统字体栈，避免自定义字体加载阻塞。SF Pro 在 Apple 设备上原生可用，其他平台降级到系统 Sans。中文降级到 Noto Sans SC。

### 2.2 字体尺寸

| Token | 大小 | 行高 | 字重 | 用途 |
|-------|------|------|------|------|
| `--text-xs` | 11px | 1.4 | 400 | 极小标签（时间戳） |
| `--text-sm` | 13px | 1.5 | 400 | 辅助文字、Tab 标签 |
| `--text-base` | 15px | 1.6 | 400 | 正文、描述 |
| `--text-lg` | 18px | 1.4 | 500 | 小标题 |
| `--text-xl` | 24px | 1.3 | 600 | 页面标题 |
| `--text-2xl` | 32px | 1.2 | 700 | 大数字、关键数据 |

---

## 3. 间距系统

基于 4px 网格：

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

**组件内部间距规范**：
| 场景 | 间距 |
|------|------|
| GlassCard 内边距 | 16px（移动端） / 20px（桌面端） |
| GlassButton 内边距 | 12px 24px（水平按钮） |
| 组件间距 | 12px（紧凑） / 16px（标准） / 24px（宽松） |
| 页面边距 | 16px（移动端） / 24px（桌面端） |
| TabBar 内边距 | 8px top, env(safe-area-inset-bottom) + 8px bottom |

---

## 4. 圆角系统

```css
--radius-sm: 12px;       /* 小按钮、标签、Badge */
--radius-md: 16px;       /* 普通卡片、输入框 */
--radius-lg: 24px;       /* 大卡片、Modal */
--radius-xl: 32px;       /* 全屏Sheet、特殊容器 */
--radius-full: 9999px;   /* 圆形按钮、头像、指示器 */
```

**原则**：liquid glass 风格偏好较大圆角。最小圆角 12px，绝不出现 4px/8px 的硬角。

---

## 5. 层级系统（z-index）

```css
--z-background: -1;       /* LiquidBackground 色球 */
--z-particles: 0;         /* LiquidParticles 浮动粒子 */
--z-content: 1;           /* 页面内容（Butler、卡片等） */
--z-tabbar: 10;           /* 底部 TabBar */
--z-modal-overlay: 20;    /* Modal 遮罩层 */
--z-modal: 21;            /* Modal 内容 */
--z-toast: 30;            /* Toast 通知 */
```

---

## 6. 动画参数

### 6.1 Spring 配置（Framer Motion）

```typescript
// src/lib/animations.ts

/** 快速弹跳 — 任务雨滴着陆、按钮点击反弹 */
export const springBouncy = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 20,
  mass: 1,
};

/** 柔和弹性 — 情绪切换、Modal 打开 */
export const springGentle = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 14,
  mass: 1,
};

/** 缓慢流动 — 液态背景、大范围位移 */
export const springSlow = {
  type: 'spring' as const,
  stiffness: 80,
  damping: 12,
  mass: 1.2,
};
```

### 6.2 CSS 动画参数

| 动画名称 | 属性 | 时长 | 缓动 | 循环 | 用途 |
|----------|------|------|------|------|------|
| `breathe` | scale: 1.0 → 1.04 → 1.0 | 3s | ease-in-out | infinite | 管家呼吸待机 |
| `blob-drift` | translate | 20-30s | ease-in-out | infinite alternate | 背景色球漂移 |
| `particle-float` | translate + opacity | 8-15s | linear | infinite | 粒子飘浮 |
| `hover-grow` | scale: 1.0 → 1.04 | 0.2s | ease-out | — | 所有可点击元素 hover |
| `press-shrink` | scale: 1.0 → 0.96 | 0.1s | ease-in | — | 按钮 active 状态 |
| `tab-indicator` | Framer layoutId | — | springGentle | — | Tab 指示器滑动 |

### 6.3 prefers-reduced-motion 策略

```css
@media (prefers-reduced-motion: reduce) {
  /* 关闭所有持续动画 */
  .breathe, .blob-drift, .particle-float {
    animation: none !important;
  }
  /* 保留瞬时过渡但缩短时长 */
  * {
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. 基础组件规格

### 7.1 GlassCard

**视觉描述**：半透明白色卡片，背景模糊，顶部有一道细微的白色高光线，像阳光打在厚玻璃板上。

| 属性 | 值 |
|------|-----|
| background | `var(--glass-bg)` |
| backdrop-filter | `blur(var(--glass-blur))` |
| border | `0.5px solid var(--glass-border)` |
| border-radius | `var(--radius-lg)` = 24px |
| box-shadow | `var(--glass-glow)` = `inset 0 1px 1px rgba(255,255,255,0.25)` |
| padding | 16px（移动端） / 20px（桌面端） |
| hover | background → `var(--glass-bg-hover)`, border → `var(--glass-border-hover)` |
| transition | `background 0.2s ease, border-color 0.2s ease` |

**Props**：
```typescript
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;    // 默认 false，开启 hover 效果
  onClick?: () => void;   // 传入时自动开启 hoverable + cursor:pointer
}
```

### 7.2 GlassButton

**视觉描述**：和 GlassCard 同材质的按钮。hover 时轻微放大（scale 1.04），按下时轻微缩小（scale 0.96）。

| 属性 | 值 |
|------|-----|
| background | `var(--glass-bg)` |
| backdrop-filter | `blur(var(--glass-blur-light))` = `blur(12px)` |
| border | `0.5px solid var(--glass-border)` |
| border-radius | `var(--radius-md)` = 16px |
| box-shadow | `var(--glass-glow)` |
| padding | 12px 24px |
| font-size | `var(--text-sm)` = 13px |
| font-weight | 500 |
| color | `var(--text-primary)` |
| hover | scale: 1.04, background → `var(--glass-bg-hover)` |
| active | scale: 0.96, background → `var(--glass-bg-active)` |
| transition | `transform 0.2s ease, background 0.2s ease` |
| min-height | 44px（移动端触控标准） |

**Props**：
```typescript
interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';   // sm=36px高, md=44px高, lg=52px高
  variant?: 'default' | 'ghost'; // ghost 无背景无边框
}
```

**尺寸映射**：
| size | height | padding | font-size | border-radius |
|------|--------|---------|-----------|---------------|
| sm | 36px | 8px 16px | 12px | 12px |
| md | 44px | 12px 24px | 13px | 16px |
| lg | 52px | 14px 32px | 15px | 20px |

### 7.3 GlassModal

**视觉描述**：从触发位置"生长"出来的液态玻璃浮层。Phase 1 先做简化版（中心 fade + scale），Phase 2 升级为原位生长。

| 属性 | 值 |
|------|-----|
| overlay background | `rgba(0, 0, 0, 0.3)` |
| overlay backdrop-filter | `blur(8px)` |
| modal background | `var(--glass-bg)` 但更不透明：`rgba(255, 255, 255, 0.12)` |
| modal backdrop-filter | `blur(var(--glass-blur-heavy))` = `blur(40px)` |
| modal border | `0.5px solid var(--glass-border)` |
| modal border-radius | `var(--radius-xl)` = 32px |
| modal box-shadow | `var(--glass-glow-strong)`, `0 8px 32px rgba(0,0,0,0.2)` |
| modal max-width | 360px（移动端） / 480px（桌面端） |
| modal padding | 24px |
| 打开动画 | scale: 0.85 → 1.0, opacity: 0 → 1, springGentle |
| 关闭动画 | scale: 1.0 → 0.9, opacity: 1 → 0, duration: 0.2s |

**Props**：
```typescript
interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  /** Phase 2: 传入触发元素的位置坐标，实现原位生长 */
  originRect?: DOMRect;
}
```

---

## 8. TabBar 规格

| 属性 | 值 |
|------|-----|
| position | fixed bottom |
| height | 64px + env(safe-area-inset-bottom) |
| background | `rgba(255, 255, 255, 0.06)` |
| backdrop-filter | `blur(var(--glass-blur-heavy))` = `blur(40px)` |
| border-top | `0.5px solid rgba(255, 255, 255, 0.10)` |
| box-shadow | `inset 0 1px 0 rgba(255, 255, 255, 0.08)` |
| padding-bottom | `env(safe-area-inset-bottom, 0px)` |

### Tab 项规格

| 属性 | 值 |
|------|-----|
| 布局 | flex: 1, 垂直居中排列 |
| 图标大小 | 24px × 24px |
| 标签字号 | `var(--text-xs)` = 11px |
| 标签字重 | 400（普通） / 500（活跃） |
| 默认颜色 | `var(--text-tertiary)` |
| 活跃颜色 | `var(--text-accent)` |
| 点击区域 | 最小 44px × 44px |
| 间距 | 图标与标签间距 4px |

### 活跃指示器

| 属性 | 值 |
|------|-----|
| 形状 | 圆角矩形药丸 |
| 尺寸 | 48px × 28px |
| border-radius | `var(--radius-full)` |
| background | `rgba(255, 255, 255, 0.12)` |
| box-shadow | `var(--glass-glow)` |
| 动画 | Framer Motion `layoutId="tab-indicator"`, transition: springGentle |

### Tab 项内容

| 序号 | 图标 | 标签 | 路由 |
|------|------|------|------|
| 1 | 房子轮廓 SVG | 主页 | `/` |
| 2 | 雨滴轮廓 SVG | 任务 | `/tasks` |
| 3 | 星星/水晶轮廓 SVG | 记忆 | `/pond` |
| 4 | 齿轮轮廓 SVG | 设置 | `/settings` |

图标使用内联 SVG（不引入图标库），stroke-width: 1.5px，stroke-linecap: round。

---

## 9. LiquidBackground 规格

### 色球布局

| 色球 | 初始位置 | 漂移范围 | 动画时长 | 尺寸 |
|------|----------|----------|----------|------|
| A（暖橙） | top: -10%, left: -10% | ±20% XY | 25s | 50vmax |
| B（冷蓝） | bottom: -15%, right: -10% | ±25% XY | 30s | 45vmax |
| C（紫粉） | top: 40%, left: 50% | ±15% XY | 22s | 40vmax |

**说明**：色球用 CSS `position: absolute` + `border-radius: 50%` + `background: radial-gradient(circle, 色值 0%, transparent 70%)`。漂移用 `@keyframes` + `transform: translate()`，不同色球使用不同时长形成交错节奏。整体包在一个 `overflow: hidden; position: fixed; inset: 0` 的容器中。

### 组件签名

```typescript
interface LiquidBackgroundProps {
  mood?: 'normal' | 'happy' | 'sad';  // Phase 1 预留
  className?: string;
}
```

---

## 10. LiquidParticles 规格（Phase 1 基础版）

| 属性 | 值 |
|------|-----|
| 实现方式 | Canvas 2D 或 纯 CSS + absolute 定位 |
| 粒子数量 | 5-10 个 |
| 粒子形状 | 圆形 |
| 粒子大小 | 3px - 8px 随机 |
| 粒子颜色 | `rgba(255, 255, 255, 0.15)` ~ `rgba(255, 255, 255, 0.30)` 随机 |
| 运动方式 | 随机方向缓慢漂浮，速度 0.1-0.3 px/frame |
| 边界处理 | 到达视口边缘后反弹或环绕 |
| 层级 | `z-index: var(--z-particles)` = 0 |
| pointer-events | none（不遮挡交互） |
| 清理 | 组件卸载时 cancelAnimationFrame |

---

## 11. 响应式断点

```css
/* 移动优先 */
--breakpoint-sm: 375px;    /* iPhone SE */
--breakpoint-md: 393px;    /* iPhone 14 Pro */
--breakpoint-lg: 768px;    /* iPad */
--breakpoint-xl: 1024px;   /* iPad Pro / 小桌面 */
--breakpoint-2xl: 1440px;  /* 大桌面 */
```

Phase 1 主要关注 375px - 393px 移动端和 1440px 桌面端两个极端。

---

## 12. 文件映射

本规格文档中的所有 CSS 变量写入 `src/styles/liquid-glass.css`。
动画参数写入 `src/lib/animations.ts`。
组件模板参见同目录下的 `.tsx` 文件。
交互原型参见同目录下的 `design-system-prototype.html`。

---

*文档维护：UI/UX 设计师 | 版本 v1.0 | 2026-04-15*
