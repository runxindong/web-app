# 反馈系统 | Feedback System

## 反馈类型 | Feedback Types

### 视觉反馈 | Visual Feedback
- 状态变化
  * 颜色变化
  * 形状变化
  * 位置变化
  * 尺寸变化

- 动画效果
  * 加载动画
  * 过渡动画
  * 强调动画
  * 状态动画

### 触觉反馈 | Haptic Feedback
- 点击反馈
  * 轻触振动
  * 长按振动
  * 滑动振动
  * 错误振动

### 声音反馈 | Audio Feedback
- 操作音效
  * 点击音效
  * 切换音效
  * 完成音效
  * 错误音效

## 反馈场景 | Feedback Scenarios

### 操作反馈 | Operation Feedback
- 按钮点击
  * 视觉：颜色变化
  * 触觉：轻触振动
  * 声音：点击音效

- 开关切换
  * 视觉：状态动画
  * 触觉：滑动振动
  * 声音：切换音效

### 状态反馈 | Status Feedback
- 加载状态
  * 视觉：加载动画
  * 触觉：无
  * 声音：无

- 完成状态
  * 视觉：成功动画
  * 触觉：完成振动
  * 声音：完成音效

- 错误状态
  * 视觉：错误动画
  * 触觉：错误振动
  * 声音：错误音效

## SCSS变量 | SCSS Variables

```scss
// Colors
$feedback-success-color: #4CAF50;
$feedback-error-color: #F44336;
$feedback-warning-color: #FFC107;
$feedback-info-color: #2196F3;

// Animations
$feedback-duration-fast: 150ms;
$feedback-duration-normal: 300ms;
$feedback-duration-slow: 450ms;

// Transitions
$feedback-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
$feedback-transition-duration: $feedback-duration-normal;
```

## 反馈混合器 | Feedback Mixins

```scss
// 视觉反馈混合器
@mixin visual-feedback($type: 'default') {
  transition: all $feedback-transition-duration $feedback-transition-timing;
  
  @if $type == 'success' {
    background-color: $feedback-success-color;
    transform: scale(1.05);
  } @else if $type == 'error' {
    background-color: $feedback-error-color;
    transform: scale(0.95);
  } @else if $type == 'warning' {
    background-color: $feedback-warning-color;
    transform: translateY(-2px);
  }
}

// 加载反馈混合器
@mixin loading-feedback {
  position: relative;
  pointer-events: none;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
}

// 状态反馈混合器
@mixin status-feedback($status) {
  @if $status == 'success' {
    border-color: $feedback-success-color;
    color: $feedback-success-color;
    animation: pulse 0.3s ease-in-out;
  } @else if $status == 'error' {
    border-color: $feedback-error-color;
    color: $feedback-error-color;
    animation: shake 0.3s ease-in-out;
  } @else if $status == 'warning' {
    border-color: $feedback-warning-color;
    color: $feedback-warning-color;
    animation: bounce 0.3s ease-in-out;
  }
}
```

## 动画效果 | Animation Effects

```scss
// 加载动画
@keyframes spin {
  to { transform: rotate(360deg); }
}

// 脉冲动画
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

// 抖动动画
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

// 弹跳动画
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
```

## 组件实现 | Component Implementation

### 按钮反馈 | Button Feedback
```scss
.button {
  @include visual-feedback;
  
  &--success {
    @include status-feedback('success');
  }
  
  &--error {
    @include status-feedback('error');
  }
  
  &--loading {
    @include loading-feedback;
  }
}
```

### 表单反馈 | Form Feedback
```scss
.form-field {
  &--success {
    @include status-feedback('success');
    
    .form-field__message {
      color: $feedback-success-color;
    }
  }
  
  &--error {
    @include status-feedback('error');
    
    .form-field__message {
      color: $feedback-error-color;
    }
  }
}
```

### 消息反馈 | Message Feedback
```scss
.message {
  transition: all $feedback-transition-duration $feedback-transition-timing;
  
  &--success {
    background-color: rgba($feedback-success-color, 0.1);
    border-left: 4px solid $feedback-success-color;
  }
  
  &--error {
    background-color: rgba($feedback-error-color, 0.1);
    border-left: 4px solid $feedback-error-color;
  }
  
  &--warning {
    background-color: rgba($feedback-warning-color, 0.1);
    border-left: 4px solid $feedback-warning-color;
  }
}
```

## 最佳实践 | Best Practices

### 反馈原则 | Feedback Principles
1. 及时性
   - 即时响应
   - 适当延迟
   - 状态清晰
   - 过渡自然

2. 明确性
   - 反馈明显
   - 状态区分
   - 信息清晰
   - 操作指引

3. 一致性
   - 视觉统一
   - 交互统一
   - 时间统一
   - 体验统一

### 可访问性 | Accessibility
1. 多感官反馈
   - 视觉提示
   - 声音提示
   - 触觉提示
   - 文字提示

2. 适应性
   - 高对比度
   - 动画控制
   - 声音控制
   - 触觉控制

3. 降级方案
   - 替代方案
   - 简化反馈
   - 关闭选项
   - 自定义设置 