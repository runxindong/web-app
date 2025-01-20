# 状态系统 | State System

## 基础状态 | Basic States

### 交互状态 | Interactive States
- 默认态: `default`
  * 视觉特征：基础样式
  * 使用场景：初始状态
  * 交互限制：无

- 悬停态: `hover`
  * 视觉特征：轻微强调
  * 使用场景：鼠标悬停
  * 交互限制：仅桌面端

- 激活态: `active`
  * 视觉特征：明显强调
  * 使用场景：点击/触摸
  * 交互限制：无

- 聚焦态: `focus`
  * 视觉特征：边框高亮
  * 使用场景：键盘操作
  * 交互限制：无

### 功能状态 | Functional States
- 加载态: `loading`
  * 视觉特征：加载指示器
  * 使用场景：数据请求
  * 交互限制：禁止操作

- 禁用态: `disabled`
  * 视觉特征：降低透明度
  * 使用场景：不可用
  * 交互限制：完全禁止

- 错误态: `error`
  * 视觉特征：错误提示
  * 使用场景：验证失败
  * 交互限制：需要修正

- 成功态: `success`
  * 视觉特征：成功提示
  * 使用场景：操作完成
  * 交互限制：无

## SCSS变量 | SCSS Variables

```scss
// State Colors
$state-default-color: #2196F3;
$state-hover-color: darken($state-default-color, 10%);
$state-active-color: darken($state-default-color, 20%);
$state-focus-color: $state-default-color;
$state-disabled-color: #BDBDBD;
$state-error-color: #F44336;
$state-success-color: #4CAF50;

// State Opacities
$state-default-opacity: 1;
$state-hover-opacity: 0.9;
$state-active-opacity: 0.8;
$state-disabled-opacity: 0.5;

// State Transitions
$state-transition-duration: 200ms;
$state-transition-timing: ease-out;
```

## 状态混合器 | State Mixins

```scss
// 基础状态混合器
@mixin state-base {
  transition: all $state-transition-duration $state-transition-timing;
}

// 交互状态混合器
@mixin interactive-states {
  @include state-base;
  
  &:hover {
    @media (hover: hover) {
      opacity: $state-hover-opacity;
      transform: translateY(-1px);
    }
  }
  
  &:active {
    opacity: $state-active-opacity;
    transform: translateY(0);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba($state-focus-color, 0.2);
  }
  
  &:disabled {
    opacity: $state-disabled-opacity;
    cursor: not-allowed;
    pointer-events: none;
  }
}

// 加载状态混合器
@mixin loading-state {
  position: relative;
  pointer-events: none;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1em;
    height: 1em;
    margin: -0.5em;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
}

// 错误状态混合器
@mixin error-state {
  border-color: $state-error-color;
  color: $state-error-color;
  
  &:focus {
    box-shadow: 0 0 0 2px rgba($state-error-color, 0.2);
  }
}

// 成功状态混合器
@mixin success-state {
  border-color: $state-success-color;
  color: $state-success-color;
  
  &:focus {
    box-shadow: 0 0 0 2px rgba($state-success-color, 0.2);
  }
}
```

## 组件状态 | Component States

### 按钮状态 | Button States
```scss
.button {
  @include interactive-states;
  
  &--primary {
    background-color: $state-default-color;
    color: white;
    
    &:hover {
      background-color: $state-hover-color;
    }
    
    &:active {
      background-color: $state-active-color;
    }
  }
  
  &--loading {
    @include loading-state;
  }
}
```

### 输入框状态 | Input States
```scss
.input {
  @include interactive-states;
  
  &--error {
    @include error-state;
  }
  
  &--success {
    @include success-state;
  }
}
```

### 开关状态 | Toggle States
```scss
.toggle {
  @include interactive-states;
  
  &--checked {
    background-color: $state-success-color;
    
    .toggle__handle {
      transform: translateX(100%);
    }
  }
  
  &--disabled {
    opacity: $state-disabled-opacity;
  }
}
```

## 状态管理 | State Management

### 状态切换 | State Transitions
```scss
// 状态切换混合器
@mixin state-transition($states...) {
  transition-property: $states;
  transition-duration: $state-transition-duration;
  transition-timing-function: $state-transition-timing;
}

// 使用示例
.component {
  @include state-transition(background-color, transform);
  
  &.is-active {
    background-color: $state-active-color;
    transform: scale(0.98);
  }
}
```

### 状态组合 | State Combinations
```scss
// 组合状态混合器
@mixin combined-states {
  &.is-loading.is-disabled {
    opacity: $state-disabled-opacity;
    pointer-events: none;
  }
  
  &.is-error:not(.is-disabled) {
    @include error-state;
  }
  
  &.is-success:not(.is-disabled) {
    @include success-state;
  }
}
```

## 最佳实践 | Best Practices

### 状态原则 | State Principles
1. 清晰性
   - 状态变化明显
   - 反馈及时
   - 用户可感知
   - 符合预期

2. 一致性
   - 统一视觉表现
   - 统一交互模式
   - 统一状态转换
   - 统一命名规范

3. 可访问性
   - 键盘可访问
   - 屏幕阅读器支持
   - 高对比度支持
   - 减少动画 