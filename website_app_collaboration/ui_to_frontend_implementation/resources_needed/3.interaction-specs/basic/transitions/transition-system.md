# 过渡效果系统 | Transition System

## 过渡类型 | Transition Types

### 基础过渡 | Basic Transitions
- 透明度: `opacity`
  * 使用场景：显示/隐藏、淡入/淡出
  * 持续时间：300ms
  * 缓动函数：ease-in-out

- 变换: `transform`
  * 使用场景：移动、缩放、旋转
  * 持续时间：300ms
  * 缓动函数：ease-out

- 颜色: `color, background-color`
  * 使用场景：状态变化、主题切换
  * 持续时间：200ms
  * 缓动函数：ease

### 复合过渡 | Composite Transitions
- 卡片悬浮: `transform, box-shadow`
  * 使用场景：卡片交互
  * 持续时间：300ms
  * 缓动函数：ease

- 面板展开: `height, opacity`
  * 使用场景：折叠面板
  * 持续时间：200ms
  * 缓动函数：ease-in-out

## SCSS变量 | SCSS Variables

```scss
// Durations
$transition-duration-fast: 150ms;
$transition-duration-base: 200ms;
$transition-duration-slow: 300ms;

// Timing Functions
$transition-timing-ease: ease;
$transition-timing-linear: linear;
$transition-timing-ease-in: ease-in;
$transition-timing-ease-out: ease-out;
$transition-timing-ease-in-out: ease-in-out;

// Common Transitions
$transition-opacity: opacity $transition-duration-base $transition-timing-ease-in-out;
$transition-transform: transform $transition-duration-slow $transition-timing-ease-out;
$transition-color: color $transition-duration-base $transition-timing-ease;
$transition-background: background-color $transition-duration-base $transition-timing-ease;
$transition-shadow: box-shadow $transition-duration-base $transition-timing-ease;
$transition-height: height $transition-duration-base $transition-timing-ease-in-out;
```

## 过渡混合器 | Transition Mixins

```scss
// 基础过渡混合器
@mixin transition-base($property, $duration: $transition-duration-base, $timing: $transition-timing-ease) {
  transition: $property $duration $timing;
}

// 多重过渡混合器
@mixin transitions($transitions...) {
  transition: $transitions;
}

// 常用过渡效果
@mixin fade-transition {
  @include transition-base(opacity);
  
  &-enter {
    opacity: 0;
    &-active { opacity: 1; }
  }
  
  &-exit {
    opacity: 1;
    &-active { opacity: 0; }
  }
}

@mixin slide-transition($direction: 'up') {
  @include transition-base(transform);
  
  @if $direction == 'up' {
    &-enter {
      transform: translateY(100%);
      &-active { transform: translateY(0); }
    }
    &-exit {
      transform: translateY(0);
      &-active { transform: translateY(-100%); }
    }
  } @else if $direction == 'down' {
    &-enter {
      transform: translateY(-100%);
      &-active { transform: translateY(0); }
    }
    &-exit {
      transform: translateY(0);
      &-active { transform: translateY(100%); }
    }
  }
}

@mixin scale-transition {
  @include transition-base(transform);
  
  &-enter {
    transform: scale(0.9);
    &-active { transform: scale(1); }
  }
  
  &-exit {
    transform: scale(1);
    &-active { transform: scale(0.9); }
  }
}
```

## 组件过渡 | Component Transitions

### 按钮过渡 | Button Transitions
```scss
.button {
  @include transitions(
    background-color $transition-duration-base $transition-timing-ease,
    transform $transition-duration-fast $transition-timing-ease
  );
  
  &:hover {
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
}
```

### 卡片过渡 | Card Transitions
```scss
.card {
  @include transitions(
    transform $transition-duration-slow $transition-timing-ease-out,
    box-shadow $transition-duration-slow $transition-timing-ease-out
  );
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  }
}
```

### 模态框过渡 | Modal Transitions
```scss
.modal {
  &-backdrop {
    @include transition-base(opacity);
  }
  
  &-content {
    @include transitions(
      opacity $transition-duration-base $transition-timing-ease-out,
      transform $transition-duration-base $transition-timing-ease-out
    );
  }
  
  &-enter {
    .modal-backdrop {
      opacity: 0;
      &-active { opacity: 0.5; }
    }
    
    .modal-content {
      opacity: 0;
      transform: scale(0.9);
      &-active {
        opacity: 1;
        transform: scale(1);
      }
    }
  }
}
```

## 性能优化 | Performance Optimization

### 性能考虑 | Performance Considerations
1. 使用 transform 和 opacity
   - 避免重排/重绘
   - 启用 GPU 加速
   - 平滑过渡效果

2. 避免过渡属性
   - 布局属性 (width, height)
   - 位置属性 (top, left)
   - 复杂属性 (box-shadow)

3. 使用 will-change
   ```scss
   @mixin optimize-transitions {
     will-change: transform, opacity;
     backface-visibility: hidden;
   }
   ```

## 响应式过渡 | Responsive Transitions

### 设备适配 | Device Adaptation
```scss
@mixin responsive-transitions {
  @media (max-width: 768px) {
    transition-duration: $transition-duration-fast;
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: none !important;
  }
}
```

## 最佳实践 | Best Practices

### 过渡原则 | Transition Principles
1. 目的性
   - 增强用户体验
   - 提供视觉反馈
   - 引导用户注意

2. 一致性
   - 统一过渡时间
   - 统一缓动函数
   - 保持预期行为

3. 性能优化
   - 选择合适属性
   - 控制过渡数量
   - 优化执行性能 