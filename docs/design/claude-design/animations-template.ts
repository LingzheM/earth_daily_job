/**
 * animations.ts — 全局动画参数集中定义
 *
 * 设计规格：docs/design/design-system.md § 6
 *
 * 规则：
 * - 所有组件的动画参数必须从此文件引用
 * - 禁止在组件内硬编码 stiffness / damping 等数值
 * - 对应 PRD AC-F1-08, AC-F1-CQ-02
 */

// ===== Framer Motion Spring 配置 =====

/** 快速弹跳 — 任务雨滴着陆、按钮点击反弹 */
export const springBouncy = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 20,
  mass: 1,
};

/** 柔和弹性 — 情绪切换、Modal 打开、Tab 指示器 */
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

// ===== CSS 动画时间常量 =====

/** 呼吸动画周期 */
export const BREATHE_DURATION = '3s';
/** 呼吸动画 scale 范围 */
export const BREATHE_SCALE_MIN = 1.0;
export const BREATHE_SCALE_MAX = 1.04;

/** 背景色球漂移周期范围 */
export const BLOB_DRIFT_DURATION_MIN = 20;  // 秒
export const BLOB_DRIFT_DURATION_MAX = 30;

/** Hover 放大比例 */
export const HOVER_SCALE = 1.04;
/** Active 缩小比例 */
export const ACTIVE_SCALE = 0.96;

/** 情绪切换过渡时长 */
export const MOOD_TRANSITION_DURATION = 0.5;  // 秒

// ===== 动画 Variants（可直接用于 Framer Motion） =====

/** 呼吸动画 variant */
export const breatheVariant = {
  animate: {
    scale: [BREATHE_SCALE_MIN, BREATHE_SCALE_MAX, BREATHE_SCALE_MIN],
    transition: {
      duration: 3,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

/** 按钮交互 variant */
export const buttonVariant = {
  hover: { scale: HOVER_SCALE },
  tap: { scale: ACTIVE_SCALE },
};

/** Modal 打开/关闭 variant */
export const modalVariant = {
  hidden: { scale: 0.85, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
};
