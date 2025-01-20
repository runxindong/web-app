# 动画系统 | Animation System

## 动画原则 | Animation Principles

### 时间控制 | Timing Control
- 快速动画: `150ms`
  * 使用场景：按钮点击、开关切换
  * 特点：及时反馈、瞬间响应

- 标准动画: `300ms`
  * 使用场景：面板展开、列表加载
  * 特点：自然流畅、视觉舒适

- 慢速动画: `450ms`
  * 使用场景：页面转场、模态框
  * 特点：优雅过渡、引导注意

### 缓动函数 | Easing Functions
- 标准缓动: `cubic-bezier(0.4, 0, 0.2, 1)`
  * 使用场景：一般过渡
  * 特点：平滑自然

- 减速缓动: `cubic-bezier(0.0, 0, 0.2, 1)`
  * 使用场景：元素进入
  * 特点：优雅到达

- 加速缓动: `cubic-bezier(0.4, 0, 1, 1)`
  * 使用场景：元素退出
  * 特点：快速离开

## 动画类型 | Animation Types

### 过渡动画 | Transitions
```scss
// 基础过渡
.transition-basic {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

// 渐入渐出
.fade {
  transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1);
  
  &-enter {
    opacity: 0;
    &-active { opacity: 1; }
  }
  
  &-exit {
    opacity: 1;
    &-active { opacity: 0; }
  }
}

// 滑动
.slide {
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
  
  &-up {
    transform: translateY(100%);
    &-active { transform: translateY(0); }
  }
  
  &-down {
    transform: translateY(-100%);
    &-active { transform: translateY(0); }
  }
}
```

### 关键帧动画 | Keyframe Animations
```scss
// 旋转加载
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.rotate {
  animation: rotate 1s linear infinite;
}

// 脉冲效果
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}

// 弹跳效果
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.bounce {
  animation: bounce 1s ease-in-out infinite;
}
```

## SCSS变量 | SCSS Variables

```scss
// Duration
$duration-fast: 150ms;
$duration-standard: 300ms;
$duration-slow: 450ms;

// Easing
$easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
$easing-decelerate: cubic-bezier(0.0, 0, 0.2, 1);
$easing-accelerate: cubic-bezier(0.4, 0, 1, 1);

// Animation Properties
$animation-rotate: rotate 1s linear infinite;
$animation-pulse: pulse 2s ease-in-out infinite;
$animation-bounce: bounce 1s ease-in-out infinite;
```

## 动画混合器 | Animation Mixins

```scss
// 过渡混合器
@mixin transition($property: all, $duration: $duration-standard, $easing: $easing-standard) {
  transition: $property $duration $easing;
}

// 淡入淡出
@mixin fade($duration: $duration-standard) {
  @include transition(opacity, $duration);
  
  &-enter {
    opacity: 0;
    &-active { opacity: 1; }
  }
  
  &-exit {
    opacity: 1;
    &-active { opacity: 0; }
  }
}

// 缩放
@mixin scale($duration: $duration-standard) {
  @include transition(transform, $duration);
  
  &-enter {
    transform: scale(0.9);
    &-active { transform: scale(1); }
  }
  
  &-exit {
    transform: scale(1);
    &-active { transform: scale(0.9); }
  }
}

// 动画混合器
@mixin animation($name, $duration: 1s, $timing-function: ease, $iteration: 1) {
  animation: $name $duration $timing-function $iteration;
}
```

## 性能优化 | Performance Optimization

### 性能原则 | Performance Principles
1. 使用 transform 和 opacity
   - 避免触发重排
   - GPU 加速
   - 平滑性能

2. 避免同时动画
   - 控制动画数量
   - 错开动画时间
   - 减少性能压力

3. 使用 will-change
   - 提前告知浏览器
   - 谨慎使用
   - 适时移除

```scss
// 性能优化混合器
@mixin performance-optimize {
  will-change: transform, opacity;
  backface-visibility: hidden;
  perspective: 1000px;
  transform: translateZ(0);
}
```

## 响应式动画 | Responsive Animations

### 设备适配 | Device Adaptation
```scss
// 响应式动画混合器
@mixin responsive-animation {
  @include mobile {
    // 减少动画时间
    transition-duration: $duration-fast;
    // 简化动画效果
    animation-duration: $duration-fast;
  }
  
  @media (prefers-reduced-motion: reduce) {
    // 禁用动画
    transition: none !important;
    animation: none !important;
  }
}
```

### 动画降级 | Animation Fallback
```scss
// 动画降级混合器
@mixin animation-fallback {
  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
    transition: none !important;
  }
  
  @supports not (animation: name) {
    // 提供降级方案
    opacity: 1 !important;
    transform: none !important;
  }
}
```

## 最佳实践 | Best Practices

### 动画原则 | Animation Principles
1. 目的性
   - 增强用户体验
   - 提供视觉反馈
   - 引导用户注意
   - 表达状态变化

2. 一致性
   - 统一动画风格
   - 保持时间一致
   - 维护交互预期
   - 避免过度使用

3. 可访问性
   - 考虑动画敏感
   - 提供关闭选项
   - 合理的动画幅度
   - 适当的动画速度 