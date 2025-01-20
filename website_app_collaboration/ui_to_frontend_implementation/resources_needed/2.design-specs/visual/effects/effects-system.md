# 特效系统 | Effects System

## 阴影效果 | Shadows

### 海拔层级 | Elevation Levels
- 层级 1: `0 2px 4px rgba(0,0,0,0.1)`
  * 使用：卡片、下拉菜单
  * 海拔：低层级元素
- 层级 2: `0 4px 8px rgba(0,0,0,0.1)`
  * 使用：浮动按钮、工具提示
  * 海拔：中层级元素
- 层级 3: `0 8px 16px rgba(0,0,0,0.1)`
  * 使用：模态框、对话框
  * 海拔：高层级元素
- 层级 4: `0 16px 24px rgba(0,0,0,0.1)`
  * 使用：通知提示、强调元素
  * 海拔：最高层级元素

### 交互状态 | Interactive States
- 默认状态: `0 2px 4px rgba(0,0,0,0.1)`
- 悬停状态: `0 4px 8px rgba(0,0,0,0.15)`
- 激活状态: `0 2px 4px rgba(0,0,0,0.2)`
- 禁用状态: `none`

## 圆角效果 | Border Radius

### 标准圆角 | Standard Radius
- 小圆角: `4px`
  * 使用：按钮、输入框
- 中圆角: `8px`
  * 使用：卡片、对话框
- 大圆角: `16px`
  * 使用：浮动按钮、徽章
- 全圆角: `50%`
  * 使用：头像、图标按钮

### 组件特例 | Component Exceptions
- 标签: `2px`
- 工具提示: `4px`
- 通知提示: `8px`
- 模态框: `12px`

## 透明度 | Opacity

### 标准透明度 | Standard Opacity
- 不透明: `1`
  * 使用：主要内容、图标
- 高透明度: `0.87`
  * 使用：主要文本
- 中透明度: `0.6`
  * 使用：次要文本、禁用状态
- 低透明度: `0.38`
  * 使用：占位符、提示文本
- 微透明: `0.12`
  * 使用：分割线、边框

### 遮罩层 | Overlays
- 模态遮罩: `rgba(0,0,0,0.4)`
- 抽屉遮罩: `rgba(0,0,0,0.3)`
- 菜单遮罩: `rgba(0,0,0,0.2)`
- 工具提示遮罩: `rgba(0,0,0,0.1)`

## SCSS变量 | SCSS Variables

```scss
// Shadows
$shadow-level-1: 0 2px 4px rgba(0,0,0,0.1);
$shadow-level-2: 0 4px 8px rgba(0,0,0,0.1);
$shadow-level-3: 0 8px 16px rgba(0,0,0,0.1);
$shadow-level-4: 0 16px 24px rgba(0,0,0,0.1);

// Interactive Shadows
$shadow-hover: 0 4px 8px rgba(0,0,0,0.15);
$shadow-active: 0 2px 4px rgba(0,0,0,0.2);

// Border Radius
$radius-sm: 4px;
$radius-md: 8px;
$radius-lg: 16px;
$radius-full: 50%;

// Component Specific Radius
$radius-tag: 2px;
$radius-tooltip: 4px;
$radius-notification: 8px;
$radius-modal: 12px;

// Opacity
$opacity-full: 1;
$opacity-high: 0.87;
$opacity-medium: 0.6;
$opacity-low: 0.38;
$opacity-subtle: 0.12;

// Overlays
$overlay-modal: rgba(0,0,0,0.4);
$overlay-drawer: rgba(0,0,0,0.3);
$overlay-menu: rgba(0,0,0,0.2);
$overlay-tooltip: rgba(0,0,0,0.1);
```

## 混合器 | Mixins

```scss
// 阴影混合器
@mixin elevation($level) {
  @if $level == 1 {
    box-shadow: $shadow-level-1;
  } @else if $level == 2 {
    box-shadow: $shadow-level-2;
  } @else if $level == 3 {
    box-shadow: $shadow-level-3;
  } @else if $level == 4 {
    box-shadow: $shadow-level-4;
  }
}

// 圆角混合器
@mixin border-radius($size) {
  @if $size == 'sm' {
    border-radius: $radius-sm;
  } @else if $size == 'md' {
    border-radius: $radius-md;
  } @else if $size == 'lg' {
    border-radius: $radius-lg;
  } @else if $size == 'full' {
    border-radius: $radius-full;
  }
}

// 透明度混合器
@mixin opacity($level) {
  @if $level == 'high' {
    opacity: $opacity-high;
  } @else if $level == 'medium' {
    opacity: $opacity-medium;
  } @else if $level == 'low' {
    opacity: $opacity-low;
  } @else if $level == 'subtle' {
    opacity: $opacity-subtle;
  }
}
```

## 动画效果 | Animations

### 过渡时间 | Transition Duration
- 快速: `150ms`
  * 使用：按钮反馈、开关状态
- 标准: `300ms`
  * 使用：面板展开、淡入淡出
- 缓慢: `450ms`
  * 使用：模态框、页面转换

### 缓动函数 | Easing Functions
- 标准缓动: `cubic-bezier(0.4, 0, 0.2, 1)`
  * 使用：一般过渡
- 减速缓动: `cubic-bezier(0.0, 0, 0.2, 1)`
  * 使用：元素进入
- 加速缓动: `cubic-bezier(0.4, 0, 1, 1)`
  * 使用：元素退出

```scss
// Animation Variables
$duration-fast: 150ms;
$duration-standard: 300ms;
$duration-slow: 450ms;

$easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
$easing-decelerate: cubic-bezier(0.0, 0, 0.2, 1);
$easing-accelerate: cubic-bezier(0.4, 0, 1, 1);

// Animation Mixins
@mixin transition-standard($property) {
  transition: $property $duration-standard $easing-standard;
}

@mixin transition-entrance($property) {
  transition: $property $duration-standard $easing-decelerate;
}

@mixin transition-exit($property) {
  transition: $property $duration-standard $easing-accelerate;
}
``` 