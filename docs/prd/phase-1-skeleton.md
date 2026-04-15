# PRD — Phase 1：骨架 (Skeleton)

> **角色**：产品经理  
> **日期**：2026-04-15  
> **状态**：草稿 Draft v1.1（对比 Grok 版本后更新）  
> **关联**：CLAUDE.md › 开发路线图 › Phase 1

---

## 一、目标与范围

### OKR

**Objective**：搭建完整的技术骨架 + 核心视觉系统，让产品「看起来像 liquid-glass 玩具」。

**Key Results**：
- KR1：Next.js 项目成功初始化并部署到 Vercel（可公开访问）
- KR2：Liquid Glass 设计系统完整可用（GlassCard / GlassButton / GlassModal 统一使用 `glass` 基类）
- KR3：管家（Butler）组件实现静态形态 + 呼吸动画 + 3 档情绪（普通 / 开心 / 委屈）
- KR4：底部 Tab Bar 可切换 4 个页面，使用液态滑动指示器
- KR5：全局 LiquidBackground 上线，LiquidParticles 至少完成占位

**一句话验收**：部署到 Vercel 之后，在手机浏览器打开，感觉像在看一个有生命的液态玻璃屏保，而不是一个空白网页框架。

### 不在 Phase 1 范围内

- 任何任务功能（雨滴、完成动效）
- 记忆池页面（功能层）
- 人格选择 / Onboarding
- 数据持久化（localStorage 写入）
- 成就系统

---

## 二、用户故事

### US-001：首次访问看到有生命的主界面

> **作为**一个第一次打开网页的用户，  
> **我想**看到一个动态的液态玻璃背景和一只正在呼吸的管家宠物，  
> **以便**立刻感受到这个产品的调性——治愈、有趣、不像普通 Todo App。

**优先级**：P0（MVP 必须）

---

### US-002：底部导航可以切换页面

> **作为**一个想探索产品的用户，  
> **我想**点击底部 Tab Bar 上的各个入口（主页 / 任务雨 / 记忆池 / 设置），  
> **以便**了解产品有哪些功能区域，哪怕现在那些页面还是空的占位页。

**优先级**：P0（MVP 必须）

---

### US-003：管家宠物有能引起情感共鸣的基本情绪

> **作为**一个已经打开产品的用户，  
> **我想**看到管家宠物有 3 种不同的外观状态（普通 / 开心 / **委屈**），  
> **以便**立刻理解"这个宠物会因为我的行为而变化"——这是整个产品情感钩的核心。

**优先级**：P0（MVP 必须）

> **决策说明**：从 P1 升为 P0。"睡觉"在视觉上有趣但情感被动；"委屈"直接呼应 Tamagotchi 核心玩法——你不理它它就难过，第一眼就能让用户理解互动意义。

---

### US-004：全局有漂浮的液态粒子增强流动感

> **作为**一个对视觉细节敏感的用户，  
> **我想**看到背景中有细小的漂浮液滴颗粒在缓慢移动，  
> **以便**感受到整个界面是"活着的"，而不只是一个静止的毛玻璃图层。

**优先级**：P1（MVP 加分）

> **范围说明**：Phase 1 至少完成组件占位和基础实现（5-10 个粒子）；完整的融合效果（粒子靠近时合并）放到 Phase 4。

---

### US-005：背景色球跟随管家情绪微调色温

> **作为**一个观察产品细节的用户，  
> **我想**注意到背景的色温会随管家情绪发生细微变化（开心=暖色，委屈=冷色），  
> **以便**感受到产品的整体性——不是堆砌的零件，而是一个有灵魂的系统。

**优先级**：P2（Phase 1 可跳过，但 LiquidBackground 实现时预留情绪入参接口，避免后期重构）

---

### US-006：产品可在真实设备上被验证和分享

> **作为**产品经理 / 开发者，  
> **我想**有一个可公开访问的 Vercel 部署链接并支持移动端访问，  
> **以便**在真实手机上验收体验，并能方便地分享给他人看效果。

**优先级**：P0（MVP 必须）

---

## 三、功能模块与验收标准

### F1 — 项目基础设施 + 设计系统

#### 描述

Next.js (App Router) + Tailwind CSS 4 + Framer Motion 项目骨架，包含全局 layout、设计系统 CSS 变量、基础 glass 组件三件套（`GlassCard` / `GlassButton` / `GlassModal`）。GlassModal 在 Phase 1 虽无业务场景，但作为设计系统基础组件应在本阶段建好，避免 Phase 2 引入 TaskModal 时返工。

#### 验收标准

| ID | 验收标准 | 优先级 |
|----|----------|--------|
| AC-F1-01 | `pnpm dev` 能在本地 localhost:3000 正常运行，控制台无错误 | P0 |
| AC-F1-02 | `pnpm build` 能成功编译，无类型错误，无 lint 错误 | P0 |
| AC-F1-03 | `src/styles/liquid-glass.css` 中定义了所有 CSS 变量（glass-bg / glass-border / glass-blur / radius / spring 参数注释） | P0 |
| AC-F1-04 | `GlassCard` 组件接受 `children`，渲染带 backdrop-filter、border、内阴影的玻璃卡片 | P0 |
| AC-F1-05 | `GlassButton` 组件接受 `onClick` 和 `children`，hover 时有 scale: 1.04 的放大效果 | P0 |
| AC-F1-06 | `GlassModal` 组件接受 `isOpen` / `onClose` / `children`，支持从触发位置原位生长的打开动画（液态膨胀，Phase 1 可先做简单 fade+scale） | P1 |
| AC-F1-07 | TypeScript strict mode 已开启，所有组件都有类型定义 | P0 |
| AC-F1-08 | `src/lib/animations.ts` 中集中定义了三套 spring 参数：springBouncy / springGentle / springSlow | P0 |

#### 代码质量要求（纳入 AC）

| ID | 验收标准 | 优先级 |
|----|----------|--------|
| AC-F1-CQ-01 | 所有组件文件不超过 200 行，超出则拆分子组件 | P0 |
| AC-F1-CQ-02 | 所有动画 spring 参数统一从 `src/lib/animations.ts` 引用，不在组件内硬编码 | P0 |
| AC-F1-CQ-03 | 文件命名遵循规范：组件 PascalCase，工具函数/hooks camelCase | P0 |

---

### F2 — LiquidBackground 全局背景

#### 描述

3-4 个大型渐变色球（radial-gradient blobs）在背景层慢速漂移，通过 `backdrop-filter: blur()` 产生全局毛玻璃基底。此组件挂载在 `app/layout.tsx`，所有页面共享。**实现时预留 `mood` 入参接口**（即使 Phase 1 不接入逻辑），以便 Phase 2 接入情绪色温同步时无需改组件签名。

#### 验收标准

| ID | 验收标准 | 优先级 |
|----|----------|--------|
| AC-F2-01 | 页面背景可见至少 3 个不同颜色的渐变色球，非纯色、非静止 | P0 |
| AC-F2-02 | 色球有持续的漂移动画，周期约 15-30s，动画 infinite 循环 | P0 |
| AC-F2-03 | 色球使用 CSS animation 或 Framer Motion，不使用 Three.js / WebGL | P0 |
| AC-F2-04 | 色球层在 z-index 最底层，不遮挡其他内容 | P0 |
| AC-F2-05 | 在移动端（375px 宽）和桌面端（1440px 宽）均无布局溢出或白边 | P0 |
| AC-F2-06 | 组件签名预留 `mood` prop（类型定义存在即可，Phase 1 不需要实际接入逻辑） | P1 |
| AC-F2-07 | 组件支持 `prefers-reduced-motion`：若用户系统开启了减少动画，漂移停止，色球静止显示 | P1 |

---

### F3 — Butler 管家宠物组件

#### 描述

半抽象玻璃生物形态（椭圆形玻璃胶囊 + 眼睛 + 嘴巴），常驻主页中央。Phase 1 实现：静态外观 + 呼吸待机动画 + **3 档情绪（普通 / 开心 / 委屈）**。情绪切换的业务触发逻辑在 Phase 2 完善，Phase 1 通过 props 传入即可。

> **情绪选择说明**：选择"委屈"而非"睡觉"，因为委屈状态（身体缩小、眼睛泪汪汪）能让首次用户立刻理解"这个宠物会因为我而难过"，是建立情感连接的最短路径。睡觉状态放到完整 5 档情绪系统（Phase 2）时再实现。

#### 组件树

```
Butler (主组件，管理情绪 prop)
  ├── ButlerBody   (玻璃胶囊形体 + 呼吸动画)
  └── ButlerFace   (眼睛 + 嘴巴 SVG，根据情绪变形)
```

#### 验收标准

| ID | 验收标准 | 优先级 |
|----|----------|--------|
| AC-F3-01 | 管家宠物可见，位于主页视口中央区域（约上 1/3 处） | P0 |
| AC-F3-02 | 身体为椭圆形，具有玻璃质感（backdrop-filter + 内高光） | P0 |
| AC-F3-03 | 有可辨识的眼睛（两个圆形或椭圆形）和嘴巴（SVG path） | P0 |
| AC-F3-04 | 待机状态下有持续的"呼吸"动画：scale 在 1.0～1.04 之间缓慢循环（ease-in-out, 3s, infinite） | P0 |
| AC-F3-05 | `mood` prop 接受 `'normal' \| 'happy' \| 'sad'` 三个值 | P0 |
| AC-F3-06 | mood=happy 时：眼睛弯成弧形（月牙眼），嘴角上扬 | P0 |
| AC-F3-07 | mood=sad 时：身体轻微缩小（scale ~0.92），眼睛变大且有水汪汪感（瞳孔放大），嘴巴下弯 | P0 |
| AC-F3-08 | 情绪切换时有平滑的 SVG path 变形过渡（Framer Motion morphing 或 CSS transition），时长约 0.5s | P1 |
| AC-F3-09 | 组件有管家气泡（ButlerBubble）的预留位置（Phase 1 可为空，但 DOM 结构在） | P1 |
| AC-F3-10 | 宠物在移动端不超出屏幕宽度，最大宽度约 160px | P0 |

---

### F4 — TabBar 底部导航

#### 描述

固定在屏幕底部的玻璃材质导航栏，4 个入口：主页（🏠）/ 任务雨（🌧）/ 记忆池（✨）/ 设置（⚙️）。活跃项有液态发光指示器，指示器在 tab 之间切换时液态滑动（Framer Motion `layoutId`）。

#### 验收标准

| ID | 验收标准 | 优先级 |
|----|----------|--------|
| AC-F4-01 | TabBar 固定在视口底部，滚动页面时不消失 | P0 |
| AC-F4-02 | 4 个 Tab 入口均可点击，点击后路由跳转到对应页面 | P0 |
| AC-F4-03 | TabBar 具有玻璃材质（backdrop-filter + 内阴影 + 半透明背景） | P0 |
| AC-F4-04 | 当前活跃 Tab 有视觉高亮（不限于指示器，颜色/字重/图标变化也可） | P0 |
| AC-F4-05 | 活跃指示器在 Tab 切换时有液态滑动动画（Framer Motion `layoutId`） | P1 |
| AC-F4-06 | TabBar 高度约 64-72px，图标可点击区域不小于 44×44px（符合移动端无障碍标准） | P0 |
| AC-F4-07 | 在 iPhone SE（375px）和 iPhone 14 Pro（393px）宽度下，4 个 Tab 均匀分布不溢出 | P0 |
| AC-F4-08 | 支持 iOS Safe Area（底部 padding 适配刘海屏和 Home Indicator） | P1 |

---

### F5 — 页面骨架（空白占位页）

#### 描述

4 个页面的基础路由和骨架布局。除主页外，其余页面在 Phase 1 只需显示占位内容（如"记忆池 — 即将到来"）。主页承载 Butler 组件和 LiquidBackground。

#### 验收标准

| ID | 验收标准 | 优先级 |
|----|----------|--------|
| AC-F5-01 | `/`（主页）可访问，显示管家宠物 + 液态背景 | P0 |
| AC-F5-02 | `/tasks`（任务雨）可访问，显示占位文字 | P0 |
| AC-F5-03 | `/pond`（记忆池）可访问，显示占位文字 | P0 |
| AC-F5-04 | `/settings`（设置）可访问，显示占位文字 | P0 |
| AC-F5-05 | 404 页面有基础处理（不显示 Next.js 默认红色错误页） | P2 |

---

### F6 — LiquidParticles 全局粒子

#### 描述

Canvas 2D 或 SVG 实现的全局漂浮小液滴，常驻 `app/layout.tsx`。Phase 1 目标是**跑通基础实现**（5-10 个粒子随机漂浮），粒子融合效果、数量自适应等完整特性留到 Phase 4 打磨。

#### 验收标准

| ID | 验收标准 | 优先级 |
|----|----------|--------|
| AC-F6-01 | 页面可见至少 5 个小液滴在缓慢漂浮，不静止 | P1 |
| AC-F6-02 | 粒子不遮挡管家宠物和 TabBar 的可交互区域 | P1 |
| AC-F6-03 | 使用 `requestAnimationFrame`，组件卸载时清理动画循环，无内存泄漏 | P1 |
| AC-F6-04 | 支持 `prefers-reduced-motion`：减少动画时粒子隐藏 | P2 |

---

### F7 — Vercel 部署

#### 描述

将项目部署到 Vercel，获得可访问的公开 URL。使用 Vercel 免费套餐，连接 GitHub 仓库实现自动部署。

#### 验收标准

| ID | 验收标准 | 优先级 |
|----|----------|--------|
| AC-F7-01 | 项目已推送到 GitHub 仓库 | P0 |
| AC-F7-02 | Vercel 项目已创建，并与 GitHub 仓库关联 | P0 |
| AC-F7-03 | `main` 分支的每次 push 自动触发 Vercel 部署 | P0 |
| AC-F7-04 | 部署后的公开 URL 可在手机浏览器正常访问（iOS Safari + Android Chrome） | P0 |
| AC-F7-05 | Vercel 部署日志无 build error（warning 可以有） | P0 |

---

## 四、非功能需求

| 类别 | 要求 | 优先级 |
|------|------|--------|
| 性能 | 首屏 LCP < 2.5s（Vercel CDN 下） | P1 |
| 动画帧率 | 背景漂移和管家呼吸动画在 iPhone 12 上不掉帧（≥ 60fps） | P1 |
| 包体积 | 首屏 JS bundle < 200KB gzipped | P2 |
| 可访问性 | 所有可点击元素有 aria-label 或可辨识的文字 | P1 |
| 浏览器支持 | iOS Safari 16+，Chrome 110+，不支持 IE | P0 |

---

## 五、任务拆分（开发工单）

> 优先级：P0 = 必须完成，P1 = 强烈建议，P2 = 有时间再做  
> 时间为区间估算，面向 Junior Dev 全职工作日

### Sprint 1（Day 1-3）：地基

| Task ID | 任务描述 | 关联 AC | 优先级 | 预估时间 | 依赖 |
|---------|----------|---------|--------|----------|------|
| T-101 | 用 `create-next-app` 初始化项目，配置 pnpm + TypeScript strict | AC-F1-01, 02 | P0 | 1-2h | — |
| T-102 | 安装 Framer Motion + Tailwind CSS 4，配置 `tailwind.config.ts` | AC-F1-01 | P0 | 1h | T-101 |
| T-103 | 创建 `src/styles/liquid-glass.css`，定义全部 CSS 变量 | AC-F1-03 | P0 | 1-2h | T-101 |
| T-104 | 创建 `src/lib/animations.ts`，定义 springBouncy / springGentle / springSlow | AC-F1-08 | P0 | 0.5h | T-101 |
| T-105 | 实现 `GlassCard` + `GlassButton` 基础组件 | AC-F1-04, 05 | P0 | 1-2h | T-102, T-103 |
| T-106 | 实现 `GlassModal` 骨架（fade+scale 打开动画，Phase 2 再升级原位生长） | AC-F1-06 | P1 | 1-2h | T-102, T-104 |
| T-107 | 搭建 4 个页面路由骨架（`/`, `/tasks`, `/pond`, `/settings`） | AC-F5-01~04 | P0 | 1h | T-101 |

### Sprint 2（Day 4-5）：液态背景

| Task ID | 任务描述 | 关联 AC | 优先级 | 预估时间 | 依赖 |
|---------|----------|---------|--------|----------|------|
| T-201 | 实现 `LiquidBackground` 组件（3 个色球 + 漂移动画），预留 `mood` prop 接口 | AC-F2-01~06 | P0 | 3-5h | T-103 |
| T-202 | 将 `LiquidBackground` 挂载到 `app/layout.tsx` | AC-F2-01 | P0 | 0.5h | T-201 |
| T-203 | 响应式测试：375px / 1440px 无溢出 | AC-F2-05 | P0 | 1h | T-202 |
| T-204 | 实现 `LiquidParticles` 基础版（5-10 个粒子，随机漂浮） | AC-F6-01~03 | P1 | 2-4h | T-202 |
| T-205 | 添加 `prefers-reduced-motion` 支持（背景 + 粒子同时处理） | AC-F2-07, F6-04 | P1 | 0.5-1h | T-204 |

### Sprint 3（Day 6-8）：管家宠物

| Task ID | 任务描述 | 关联 AC | 优先级 | 预估时间 | 依赖 |
|---------|----------|---------|--------|----------|------|
| T-301 | 实现 `ButlerBody` 组件（椭圆玻璃胶囊 + 呼吸动画） | AC-F3-01~04 | P0 | 2-4h | T-103, T-104 |
| T-302 | 实现 `ButlerFace` 组件（normal 情绪的眼睛 + 嘴巴 SVG） | AC-F3-03 | P0 | 2-3h | — |
| T-303 | 实现 `Butler` 主组件，接受 `mood: 'normal' \| 'happy' \| 'sad'` prop | AC-F3-05 | P0 | 1h | T-301, T-302 |
| T-304 | 添加 happy（月牙眼 + 嘴角上扬）和 sad（身体缩小 + 大眼泪汪汪 + 嘴下弯）情绪的 SVG 变形 | AC-F3-06, 07 | P0 | 3-5h | T-303 |
| T-305 | 情绪切换平滑过渡动画（Framer Motion morphing，0.5s） | AC-F3-08 | P1 | 1-2h | T-304 |
| T-306 | 在主页放置管家，调整位置（约上 1/3 处）和大小（最大 160px） | AC-F3-01, 10 | P0 | 1h | T-303 |
| T-307 | 预留 `ButlerBubble` 组件 DOM 占位 | AC-F3-09 | P1 | 0.5h | T-306 |

### Sprint 4（Day 9-10）：导航 + 状态基础 + 部署

| Task ID | 任务描述 | 关联 AC | 优先级 | 预估时间 | 依赖 |
|---------|----------|---------|--------|----------|------|
| T-401 | 实现 `TabBar` 组件（4 Tab + 玻璃材质 + 均匀布局） | AC-F4-01~04, 06~07 | P0 | 2-4h | T-103 |
| T-402 | 添加 Framer Motion `layoutId` 液态指示器滑动 | AC-F4-05 | P1 | 1-2h | T-401 |
| T-403 | iOS Safe Area 适配（env(safe-area-inset-bottom)） | AC-F4-08 | P1 | 0.5-1h | T-401 |
| T-404 | 初始化 Zustand `useButlerStore`（仅 mood 状态 + setter，不含持久化） | — | P1 | 1-2h | T-101 |
| T-405 | 将项目推送到 GitHub | AC-F7-01 | P0 | 0.5h | 全部 P0 任务 |
| T-406 | 在 Vercel 创建项目并部署 | AC-F7-02~05 | P0 | 1h | T-405 |
| T-407 | 手机浏览器验收走查（iOS Safari + Android Chrome） | 全部 P0 AC | P0 | 1-2h | T-406 |

> **T-404 决策说明**：Zustand butlerStore 在 Phase 1 只需建骨架（mood 状态），不接入 localStorage 也不接入任务逻辑。提前建好可避免 Phase 2 引入时改动管家组件的 prop 结构。此项为 P1，若时间不够可推迟到 Phase 2 第一天做。

**总预估工时**：约 28-42 小时（3-5 个工作日，含 P1 项）

---

## 六、P0 验收清单（Phase 1 完成门槛）

下列条件**全部满足**，Phase 1 才算完成，可以进入 Phase 2：

- [ ] `pnpm build` 零错误
- [ ] Vercel 部署成功，公开 URL 可访问
- [ ] 主页可见液态玻璃背景（3 个漂移色球）
- [ ] 主页可见管家宠物（椭圆玻璃体 + 眼睛 + 嘴巴 + 呼吸动画）
- [ ] 管家宠物可切换 normal / happy / sad 三种情绪外观
- [ ] TabBar 可见，4 个 Tab 均可点击跳转
- [ ] 在 iOS Safari 手机浏览器上无明显布局问题
- [ ] 控制台无 JS 错误（warning 可忽略）
- [ ] 所有组件文件 ≤ 200 行，动画参数从 animations.ts 统一引用

**PM 验收交付物**（开发完成后提交）：
- [ ] Vercel 部署链接
- [ ] 录屏 / GIF：展示 LiquidBackground 漂移 + 管家三种情绪切换 + Tab 切换效果
- [ ] 所有 P0 AC 自测完成并打 ✅

---

## 七、设计师交接说明

Phase 1 可采用**骨架先行**策略：开发按 CLAUDE.md 中的 CSS 变量做初始实现，设计师出稿后再做精确对齐。两种节奏均可，取决于团队偏好。

| 需要的设计稿 | 说明 | 对应文档 |
|-------------|------|----------|
| 设计系统规格 | CSS 变量精确数值、色彩 token、字体规格 | `docs/design/design-system.md` |
| Butler 视觉规格 | 身体尺寸、眼睛比例、三种情绪的 SVG path 数值 | `docs/design/butler.md` |
| TabBar 视觉规格 | 高度、图标样式、指示器形状和颜色 | `docs/design/tab-bar.md` |

---

## 八、变更日志

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0 | 2026-04-15 | 初稿 |
| v1.1 | 2026-04-15 | 对比 Grok 版本后更新：① 新增 OKR 格式目标；② US-003 升为 P0，情绪"睡觉"改为"委屈"；③ 新增 US-004 液态粒子、US-006 开发者视角；④ F1 补充 GlassModal + 代码质量 AC；⑤ 新增 F6 LiquidParticles 模块；⑥ F2 预留 mood 接口；⑦ 任务表新增依赖列、时间改为区间、新增 T-404 Zustand 骨架 |

---

*文档维护：产品经理 | 下次更新触发条件：Phase 2 启动前或有重大需求变更*
