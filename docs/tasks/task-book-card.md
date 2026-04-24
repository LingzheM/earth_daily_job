# 组件任务卡 — BookCard（立体翻页书）

**组件名称**：BookCard  
**关联 PRD**：docs/prd/component-book-card.md  
**设计规格**：docs/design/book-card.md  
**输出路径**：`src/components/ui/BookCard.tsx`

---

## 视觉要求

| 部件 | 精确数值 |
|------|---------|
| 书本总宽 | 156px（书脊 16px + 封面 140px） |
| 书本高度 | 200px |
| 书页侧面厚度 | 20px（右侧 + 底部各 6 层 div） |
| 封面圆角（右侧） | 4px |
| 封面外侧背景 | `linear-gradient(145deg, #1a1050 0%, #2D1B69 45%, #7B2FFF 100%)` |
| 封面内侧背景 | `linear-gradient(160deg, #3a1050 0%, #9B2E7F 55%, #FF6B9D 100%)` |
| 书脊颜色 | `#110D3A` |
| 后封面颜色 | `#0E0A2D` |
| 书页侧面颜色 | `rgba(237, 224, 206, 1.0 → 0.25)` 6层递减 |
| 封面顶部光泽 | `linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%)`，高度 45% |
| 书脊阴影 | `inset -2px 0 6px rgba(0,0,0,0.40)` |

---

## 动画要求

**新增到 `src/lib/animations.ts`（必须在实现前添加）：**

```ts
export const springBookFlip = {
  type: 'spring' as const,
  stiffness: 150,
  damping: 15,
  mass: 1,
};
```

| 参数 | 值 |
|------|-----|
| hover 翻开角度 | `rotateY: -35deg` |
| leave 合上角度 | `rotateY: 0deg` |
| transform-origin | `left center`（封面左边缘，书脊连接处） |
| 动画变量名 | `springBookFlip`（从 animations.ts 引用） |

---

## Props 接口（外部 API）

```ts
interface BookCardProps {
  coverColor?: string;   // 默认: 靛紫渐变
  innerColor?: string;   // 默认: 玫瑰粉渐变
  spineColor?: string;   // 默认: '#110D3A'
  title?: string;        // 可选封面标题
  width?: number;        // 默认: 156
  height?: number;       // 默认: 200
}
```

---

## 技术要求

- `perspective: 800px` 设置在最外层容器，`perspectiveOrigin: '30% 40%'`
- **不使用** `backdrop-filter`（与 CSS 3D transform 不兼容）
- 书脊 `z-index: 4`，封面 `z-index: 3`，内侧 `z-index: 2`（封面下方）
- 书页侧面（右侧 + 底部）使用 6 层 `div` 叠加，索引 `i` 控制偏移和透明度
- Framer Motion `animate` 控制 `rotateY`，`useState(isHovered)` 控制触发
- `onMouseEnter` / `onMouseLeave` 在最外层容器
- 组件无外部依赖（无 Zustand store，无任务数据）

---

## 验收标准（直接引用 PRD）

- [ ] AC-BOOK-01：书本有立体感，不是扁平图形
- [ ] AC-BOOK-02：可辨识书脊、封面、书页侧面纹理
- [ ] AC-BOOK-03：封面在书页上方，层次可见
- [ ] AC-BOOK-04：默认状态封面完全合上，看不到内侧
- [ ] AC-BOOK-05：hover 时封面绕书脊翻开 ~35 度
- [ ] AC-BOOK-06：翻开后可见封面内侧（玫瑰粉渐变）
- [ ] AC-BOOK-07：翻开后可见内侧下方的书页
- [ ] AC-BOOK-08：书脊、后封面、书页在 hover 中静止
- [ ] AC-BOOK-09：翻开动画有弹性超出回弹
- [ ] AC-BOOK-10：合上动画同样有弹性
- [ ] AC-BOOK-11：翻开/合上约 0.5s（springBookFlip settle ~0.52s）
- [ ] AC-BOOK-13：组件无 Zustand/任务数据依赖
- [ ] AC-BOOK-15：可在任意页面单独渲染
