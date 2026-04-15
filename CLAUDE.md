# CLAUDE.md — Life Quest（地球Online）

> 一个把日常小事变成值得收集的液态玻璃体验的生活玩具。
> 不是 To-Do App，是你的玻璃管家 + 任务雨 + 记忆池。

---

## 产品定位

**一句话**：一只住在玻璃里的管家宠物，每天给你掉落生活任务，完成后收进液态记忆池。

**不是什么**：
- 不是效率工具（不跟 Todoist/Notion 竞争）
- 不是习惯打卡（不强调"连续X天"的压力感）
- 不是3D地球（"地球Online"只是隐喻：你在地球上生活，每天有事要做）

**是什么**：
- 一个 Tamagotchi 式的网页玩具
- 把跑步、做饭、看书这些日常事变成"掉落物"和"收藏品"
- 视觉核心是 Apple visionOS / iOS 26 的 liquid glass 风格

**核心用户**：25-35岁，想给生活加点仪式感和趣味性的年轻人。讨厌严肃的 Todo 列表，想要「可爱 + 治愈 + 轻压力」的玩具式体验。

---

## 技术栈

| 层级 | 选型 | 理由 |
|------|------|------|
| 框架 | Next.js (App Router) | SSG/SSR 灵活，Vercel 一键部署 |
| 样式 | Tailwind CSS 4 | 实用优先，和 liquid glass 自定义样式共存 |
| 动画 | Framer Motion | spring 物理弹性、layout 动画、手势支持 |
| 粒子/特效 | Canvas 2D 或 SVG + Framer | 不用 Three.js，纯 2D 足够 |
| 状态管理 | Zustand | 轻量，适合小型项目 |
| 存储 | localStorage（MVP） | 后期可选 Supabase / IndexedDB |
| 部署 | Vercel | 零配置，preview 分支 |
| 包管理 | pnpm | 快、节省磁盘 |

**不使用**：Three.js、WebGL、任何后端数据库（MVP阶段）

---

## 设计系统：Liquid Glass

### 设计哲学

> 一切都像液体 —— 慢、软、粘、会融合。拒绝硬边、硬切、硬角。

**核心CSS属性**：
```css
/* 玻璃基础 */
--glass-bg: rgba(255, 255, 255, 0.12);
--glass-border: rgba(255, 255, 255, 0.18);
--glass-blur: 24px;
--glass-inner-glow: inset 0 1px 1px rgba(255, 255, 255, 0.25);

/* 圆角（永远偏大） */
--radius-sm: 12px;
--radius-md: 20px;
--radius-lg: 28px;
--radius-full: 9999px;

/* 动画时间（永远偏慢） */
--duration-fast: 0.3s;
--duration-normal: 0.5s;
--duration-slow: 0.8s;

/* 弹性参数（Framer Motion spring） */
--spring-bouncy: { stiffness: 300, damping: 20 };
--spring-gentle: { stiffness: 120, damping: 14 };
--spring-slow: { stiffness: 80, damping: 12 };
```

### 玻璃组件基类

每个组件都继承这个基础样式：
```css
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 0.5px solid var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--glass-inner-glow);
}
```

### 颜色系统

背景使用渐变色彩球（大的 radial-gradient blobs），通过 `backdrop-filter: blur()` 产生毛玻璃效果。

| 用途 | 色值 | 说明 |
|------|------|------|
| 背景色球-暖 | #FF6B6B → #FFA07A | 暖色调，心情好时 |
| 背景色球-冷 | #4FACFE → #00F2FE | 冷色调，平静状态 |
| 背景色球-紫 | #A18CD1 → #FBC2EB | 梦幻感，夜间模式 |
| 强调色 | #FFFFFF 半透明 | 高光、边框、分割线 |
| 文字-主 | rgba(255,255,255,0.9) | 标题 |
| 文字-次 | rgba(255,255,255,0.6) | 正文、描述 |
| 文字-弱 | rgba(255,255,255,0.35) | 提示、时间戳 |

### 动画规范

| 动画类型 | 参数 | 场景 |
|----------|------|------|
| 弹跳掉落 | spring, stiffness: 300, damping: 20 | 任务雨滴着陆 |
| 果冻挤压 | spring, stiffness: 120, damping: 14 | 宠物情绪变化 |
| 液态膨胀 | spring, stiffness: 80, damping: 12 | Modal生长打开 |
| 呼吸脉动 | ease-in-out, 3s, infinite | 宠物待机状态 |
| 光球飞行 | spring + 贝塞尔路径 | 完成任务反馈 |
| hover膨胀 | scale: 1.04, 0.2s | 所有可点击元素 |

---

## 产品架构：3页 + 1全局

```
┌─────────────────────────────────────┐
│           全局层 (Global)            │
│  Liquid Background（动态毛玻璃背景）  │
│  Liquid Particles（飘浮小液滴）       │
│  Toast System（液态通知）             │
│  Butler Speech Bubble（管家气泡）     │
└─────────────────────────────────────┘
         ┃           ┃           ┃
    ┌────┸────┐ ┌────┸────┐ ┌────┸────┐
    │  首页   │ │ 任务雨  │ │ 记忆池  │
    │  Home   │ │TaskDrop │ │ Memory  │
    │         │ │         │ │  Pond   │
    └─────────┘ └─────────┘ └─────────┘
         ▲           ▲           ▲
    ┌────┸────────────┸───────────┸────┐
    │      底部玻璃 Tab Bar            │
    │   Home | TaskDrop | Pond | ⚙️    │
    └─────────────────────────────────┘
```

### 页面切换方式

MVP 阶段使用 **iOS sheet 层级式**切换（务实、好实现）：
- Home → TaskDrop：从底部滑入覆盖
- Home → MemoryPond：从右侧推入
- 层与层之间毛玻璃叠加，能隐约看到下层
- Tab Bar 切换使用 Framer `layout` 动画，指示器液态滑动

后期可升级为液态融合转场（页面融化→凝聚）。

---

## 核心组件详细设计

### 1. 管家宠物（Butler）

**形态**：半抽象的玻璃生物 —— 水母/史莱姆形态，有可辨识的眼睛和简单嘴巴。
- 身体：椭圆形玻璃胶囊，带内部高光折射
- 表情：眼睛 + 嘴巴，通过 SVG path + Framer Motion 变形
- 身体动画：持续的"呼吸"脉动（scale 微变化 + 轻微形变）

**情绪系统（5档）**：

| 等级 | 名称 | 触发条件 | 视觉表现 |
|------|------|----------|----------|
| 5 | 超开心 | 完成3+任务 | 发光跳跃，眼睛弯成月牙 |
| 4 | 开心 | 完成1-2任务 | 轻微摇摆，微笑 |
| 3 | 普通 | 默认状态 | 缓慢呼吸，平静表情 |
| 2 | 委屈 | 长时间未完成 | 身体缩小，眼睛变大泪汪汪 |
| 1 | 睡觉 | 深夜/闲置 | 闭眼，偶尔翻身 |

**台词系统**：
- 固定脚本库（JSON数组），按时段 + 情绪状态 + 随机抽取
- 示例：早晨 + 普通 → "新的一天～今天想做什么？"
- 示例：晚上 + 超开心 → "今天好充实！你是最棒的～"
- 示例：下午 + 委屈 → "我等了好久...快来领个任务吧"
- 气泡从宠物头顶"生长"出来（液态膨胀动画）

### 2. 任务雨滴（Task Droplet）

**外观**：卡片形状的液态玻璃滴
- 圆角超大（border-radius: 24px+）
- 内阴影 + 顶部高光条 + 底部液体折射色
- 每种任务类型有不同的色彩倾向（运动=蓝绿，美食=暖橙，阅读=紫色）

**掉落动画**：
1. 从屏幕顶部随机位置出现（opacity 0→1 渐入）
2. 带物理重力下落（Framer spring，stiffness: 300, damping: 20）
3. 着陆时轻微弹跳 + 扩散水波纹
4. 着陆后轻微悬浮摇摆

**卡片内容**：
```
┌──────────────────────┐
│  🏃  跑步 20 分钟     │
│  "今天听着音乐跑，    │
│   推荐试试新路线～"   │
│  ⏱ 20min  ⭐ 简单     │
└──────────────────────┘
```

**交互**：
- 点击雨滴 → 从雨滴位置原位"生长"成 Modal（液态膨胀）
- Modal 内有：完成✓ / 跳过→ / 稍后⏰ 三个按钮
- 完成时的反馈（三段式）：
  1. 卡片碎裂成玻璃碎片
  2. 碎片汇聚成光球，飞向管家宠物
  3. 宠物开心跳跃，光球再飞向记忆池方向

### 3. 记忆池（Memory Pond）

**概念**：不是传统的格子陈列架，而是一个液态水池。

**视觉**：
- 一个大玻璃水池/漂浮平台
- 完成的任务变成发光小水晶球/液态徽章
- 水晶球自动"吸入"池中
- 球之间互相轻微碰撞、漂浮（简单物理模拟）
- 长期使用后，池子越来越满，形成"玻璃花园"

**交互**：
- 可拖拽摆放水晶球（Framer drag + 简单碰撞检测）
- 双击/长按查看详情（完成日期 + 管家的一句评语）
- 按类别筛选（运动/美食/阅读/...），未选中的球变暗淡
- 时间线视图切换（日/周/月回顾）

**成就系统**（嵌入记忆池中）：
- 连续7天完成任务 → 解锁特殊水晶球样式
- 全品类都完成过 → 解锁彩虹球
- 隐藏成就 → 随机惊喜

### 4. 全局系统

**Liquid Background**：
- 3-4个大色彩球（radial-gradient），慢速漂移
- 用 CSS animation 或 Framer Motion 做缓慢位移
- 跟随管家情绪微调色温（开心=暖，委屈=冷）

**Liquid Particles**：
- Canvas 2D 或 SVG 实现
- 10-20个小液滴，随机飘浮
- 偶尔两个靠近时融合再分开（视觉糖果）
- 性能考虑：用 `requestAnimationFrame`，粒子数量可配置

**Toast 通知**：
- 完成任务："心情 +1！" 液态飞出
- 解锁成就：特殊液态爆炸效果
- 管家催促：小雨云飘过屏幕

**底部 Tab Bar**：
- 4个入口：Home / 任务雨 / 记忆池 / 设置
- 玻璃材质，活跃项有液态发光指示器
- 指示器在 tab 间切换时液态滑动（Framer layout 动画）

---

## 人格系统（Persona）

用户首次启动时选择生活风格，影响任务池权重。

### 4 种预设人格

**1. 运动爱好者（Run & Flow）🏃**
| 频率 | 任务示例 |
|------|----------|
| 经常做 | 跑步、健身 |
| 不经常 | 拉伸、核心训练 |
| 想做但忘 | 每天8000步、游泳 |
| 随机惊喜 | "今天跑步听这首歌超燃！" |

**2. 游戏/数码爱好者（Pixel Life）🎮**
| 频率 | 任务示例 |
|------|----------|
| 经常做 | 打游戏、刷视频 |
| 不经常 | 阅读、整理桌面 |
| 想做但忘 | 早起30分钟学新技能 |
| 随机惊喜 | 完成5天解锁新宠物皮肤 |

**3. 宠物/生活爱好者（Cute Life）🐾**
| 频率 | 任务示例 |
|------|----------|
| 经常做 | 遛狗、照顾植物 |
| 不经常 | 做饭、打扫 |
| 想做但忘 | 早睡、冥想 |
| 随机惊喜 | 管家和你的宠物"联动"情绪 |

**4. 吃货/慢生活（Food & Soul）🍳**
| 频率 | 任务示例 |
|------|----------|
| 经常做 | 点外卖 |
| 不经常 | 自己做饭、尝试新菜 |
| 想做但忘 | 每周一顿健康餐、记录心情 |
| 随机惊喜 | 完成后记忆池出现"美食水晶" |

**人格可叠加**：用户可选1-2个主人格，系统按权重混合任务。

---

## 使用场景

### 日常三时段

**早上 8:00** → 打开网页，管家睡眼惺忪打招呼。3颗任务雨滴缓缓掉落（今日推荐：跑步 + 做早餐 + 看书10分钟）。

**午后摸鱼** → 无聊时点"召唤更多雨滴"，随机出有趣小任务（"去阳台看5分钟云"、"给朋友发一条问候消息"），完成即有治愈反馈。

**晚上 10:00** → 完成任务后回顾。管家超开心转圈，记忆池多了几颗新水晶球，可以拖着玩一会儿再关闭。

---

## 数据模型（localStorage）

```typescript
// 用户配置
interface UserConfig {
  personas: PersonaType[];        // 选择的人格标签
  butlerName: string;             // 管家名字（可自定义）
  createdAt: string;              // 注册时间
}

// 任务定义
interface Task {
  id: string;
  type: 'exercise' | 'food' | 'reading' | 'cleaning' | 'sleep' | 'social' | 'surprise';
  title: string;
  description: string;            // 随机小提示
  duration: number;               // 预计分钟数
  difficulty: 1 | 2 | 3;         // 简单/中等/挑战
  persona: PersonaType[];         // 关联人格
  icon: string;                   // 图标标识
}

// 已完成任务（水晶球）
interface CompletedTask {
  id: string;
  taskId: string;
  completedAt: string;
  butlerComment: string;          // 管家的一句评语
  position?: { x: number; y: number }; // 记忆池中的位置
}

// 管家状态
interface ButlerState {
  mood: 1 | 2 | 3 | 4 | 5;
  lastInteraction: string;
  totalCompleted: number;
  streak: number;                 // 连续活跃天数
}

// 成就
interface Achievement {
  id: string;
  title: string;
  description: string;
  condition: string;              // 解锁条件描述
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
```

---

## 项目目录结构

```
life-quest/
├── CLAUDE.md                     # 本文件（项目圣经）
├── next.config.js
├── tailwind.config.ts
├── package.json
├── public/
│   └── fonts/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # 全局 layout（含 LiquidBackground + Particles）
│   │   ├── page.tsx              # 首页 Home
│   │   ├── tasks/page.tsx        # 任务雨页
│   │   ├── pond/page.tsx         # 记忆池页
│   │   └── settings/page.tsx     # 设置页
│   ├── components/
│   │   ├── global/
│   │   │   ├── LiquidBackground.tsx
│   │   │   ├── LiquidParticles.tsx
│   │   │   ├── TabBar.tsx
│   │   │   └── Toast.tsx
│   │   ├── butler/
│   │   │   ├── Butler.tsx        # 管家主组件
│   │   │   ├── ButlerFace.tsx    # 表情 SVG
│   │   │   ├── ButlerBubble.tsx  # 台词气泡
│   │   │   └── ButlerBody.tsx    # 身体形态动画
│   │   ├── tasks/
│   │   │   ├── TaskDroplet.tsx   # 任务雨滴
│   │   │   ├── TaskModal.tsx     # 任务详情浮窗
│   │   │   ├── TaskDropZone.tsx  # 掉落区域
│   │   │   └── CompletionEffect.tsx # 完成动效（碎裂→光球→飞行）
│   │   ├── pond/
│   │   │   ├── MemoryPond.tsx    # 记忆池主组件
│   │   │   ├── CrystalBall.tsx   # 水晶球
│   │   │   ├── PondPhysics.tsx   # 简单碰撞/漂浮物理
│   │   │   └── AchievementBadge.tsx
│   │   └── ui/
│   │       ├── GlassCard.tsx     # 玻璃卡片基础组件
│   │       ├── GlassButton.tsx   # 玻璃按钮
│   │       └── GlassModal.tsx    # 玻璃弹窗（原位生长动画）
│   ├── data/
│   │   ├── tasks.ts              # 预设任务库
│   │   ├── dialogues.ts          # 管家台词库
│   │   └── achievements.ts       # 成就列表
│   ├── store/
│   │   ├── useButlerStore.ts     # 管家状态（Zustand）
│   │   ├── useTaskStore.ts       # 任务状态
│   │   └── usePondStore.ts       # 记忆池状态
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   ├── useTimeOfDay.ts       # 当前时段（早/午/晚）
│   │   └── usePhysics.ts         # 简单物理模拟 hook
│   ├── lib/
│   │   ├── taskEngine.ts         # 任务分发逻辑（人格权重 + 随机）
│   │   └── moodEngine.ts         # 情绪计算逻辑
│   └── styles/
│       └── liquid-glass.css      # 全局 liquid glass 样式变量
```

---

## 开发路线图

### Phase 1 — 骨架 + 核心玩法（Week 1-2）
- [ ] Next.js 项目初始化 + Tailwind + Framer Motion
- [ ] Liquid Glass 设计系统（CSS变量 + GlassCard/GlassButton 基础组件）
- [ ] LiquidBackground 全局背景
- [ ] Butler 管家组件（静态形态 + 呼吸动画 + 3档情绪）
- [ ] TabBar 底部导航
- [ ] 部署到 Vercel

### Phase 2 — 任务系统（Week 3-4）
- [ ] 预设任务数据库（JSON，覆盖4种人格 × 7种类型）
- [ ] TaskDroplet 雨滴组件 + 掉落动画
- [ ] TaskModal 详情浮窗（原位生长动画）
- [ ] 完成任务反馈动效（碎裂→光球→飞行）
- [ ] 管家台词系统
- [ ] localStorage 持久化

### Phase 3 — 记忆池（Week 5-6）
- [ ] MemoryPond 记忆池布局
- [ ] CrystalBall 水晶球组件
- [ ] 拖拽 + 简单碰撞物理
- [ ] 按类别筛选
- [ ] 时间线视图

### Phase 4 — 打磨 + 上线（Week 7-8）
- [ ] Onboarding 流程（选择人格）
- [ ] 成就系统
- [ ] 全局 Liquid Particles 粒子
- [ ] 响应式适配（桌面 + 移动端）
- [ ] PWA 支持
- [ ] 分享卡片生成
- [ ] 性能优化（动画节流、粒子数量自适应）

---

## 编码规范

### 通用
- 使用 TypeScript strict mode
- 组件使用函数式 + hooks，不使用 class component
- 文件命名 PascalCase（组件）、camelCase（工具函数/hooks）
- 每个组件文件不超过 200 行，超出则拆分子组件

### 样式
- 优先 Tailwind utility class
- 复杂动画 / 玻璃效果用 CSS module 或 inline style
- 动画参数统一从 `liquid-glass.css` 引用，不硬编码

### 动画
- 所有 spring 动画参数集中定义在 `src/lib/animations.ts`
- 尊重 `prefers-reduced-motion`：动画包在媒体查询里
- 粒子系统使用 `requestAnimationFrame`，组件卸载时清理

### 状态
- 全局状态用 Zustand（管家心情、任务列表、记忆池）
- 组件内部状态用 useState/useReducer
- localStorage 同步通过 Zustand middleware

---

## 参考资源

### 设计灵感
- Apple visionOS design guidelines
- iOS 26 liquid glass system
- Dribbble 搜索：glassmorphism task app, liquid UI animation, gamification dashboard, achievement wall UI
- Tamagotchi / 拓麻歌子 经典交互模式

### 技术参考
- Framer Motion docs: https://www.framer.com/motion/
- Tailwind CSS: https://tailwindcss.com/docs
- Next.js App Router: https://nextjs.org/docs/app
- Zustand: https://zustand-demo.pmnd.rs/

---

## 决策记录

| 日期 | 决策 | 理由 |
|------|------|------|
| 2025-04-15 | 收藏墙改为"记忆池" | 液态水池 + 漂浮水晶球比静态陈列架更符合 liquid glass 调性 |
| 2025-04-15 | 管家形态：半抽象玻璃生物 | 兼顾液态美感和情感连接（有眼睛嘴巴但不写实） |
| 2025-04-15 | MVP 用 sheet 式页面切换 | 开发简单且效果不差，后期再升级液态融合转场 |
| 2025-04-15 | 不用 Three.js | 纯 CSS + Canvas + Framer Motion 足够实现液态效果 |
| 2025-04-15 | Modal 从点击位置原位生长 | 比统一从底部弹出更有"液态"感 |