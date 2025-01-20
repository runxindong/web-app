# 首页交互说明 | Homepage Interaction Guide

## 1. 导航交互 | Navigation Interactions

### 1.1 导航菜单 | Navigation Menu
- 悬停效果 | Hover Effect: 
  - 背景色淡入 | Background fade in
  - 持续时间 | Duration: 0.2s
  - 缓动函数 | Easing: ease-in-out

### 1.2 下拉菜单 | Dropdown Menu
- 展开动画 | Expand Animation:
  - 向下展开 | Expand downward
  - 持续时间 | Duration: 0.3s
  - 缓动函数 | Easing: cubic-bezier(0.4, 0, 0.2, 1)

### 1.3 移动端菜单 | Mobile Menu
- 侧边栏滑入 | Sidebar Slide:
  - 从左侧滑入 | Slide from left
  - 持续时间 | Duration: 0.4s
  - 带背景遮罩 | With backdrop

## 2. 滚动效果 | Scroll Effects

### 2.1 页面滚动 | Page Scroll
- 平滑滚动 | Smooth Scroll:
  - 启用于所有锚点链接 | Enabled for all anchor links
  - 持续时间 | Duration: 0.8s
  - 缓动函数 | Easing: ease-in-out

### 2.2 视差效果 | Parallax Effect
- 背景视差 | Background Parallax:
  - 滚动速率 | Scroll Rate: 0.5
  - 应用于首屏背景 | Applied to hero background

### 2.3 元素进入动画 | Element Enter Animation
- 渐入上移 | Fade Up:
  - 透明度 | Opacity: 0 -> 1
  - 位移 | Transform: translateY(20px) -> translateY(0)
  - 持续时间 | Duration: 0.6s
  - 错开时间 | Stagger: 0.1s

## 3. 交互组件 | Interactive Components

### 3.1 按钮状态 | Button States
- 悬停状态 | Hover:
  - 背景色变亮 10% | Background lighten 10%
  - 持续时间 | Duration: 0.2s
- 点击状态 | Active:
  - 背景色变暗 10% | Background darken 10%
  - 缩小效果 | Scale: 0.98

### 3.2 卡片交互 | Card Interactions
- 悬停效果 | Hover Effect:
  - 上移 | Transform: translateY(-4px)
  - 阴影增强 | Enhanced shadow
  - 持续时间 | Duration: 0.3s

### 3.3 图片加载 | Image Loading
- 渐进式加载 | Progressive Loading:
  - 模糊效果 | Blur effect
  - 从模糊到清晰 | Blur to clear
  - 持续时间 | Duration: 0.5s

## 4. 表单交互 | Form Interactions

### 4.1 输入框 | Input Fields
- 焦点状态 | Focus State:
  - 边框颜色变化 | Border color change
  - 持续时间 | Duration: 0.2s
- 验证反馈 | Validation Feedback:
  - 实时验证 | Real-time validation
  - 错误提示动画 | Error message animation

### 4.2 提交按钮 | Submit Button
- 加载状态 | Loading State:
  - 旋转动画 | Spinning animation
  - 禁用状态 | Disabled state
  - 持续时间 | Duration: 1.5s (循环 | loop)

## 5. 响应式交互 | Responsive Interactions

### 5.1 触摸设备 | Touch Devices
- 点击状态 | Tap State:
  - 触摸反馈 | Touch feedback
  - 波纹效果 | Ripple effect
  - 持续时间 | Duration: 0.4s

### 5.2 手势支持 | Gesture Support
- 滑动切换 | Swipe:
  - 支持左右滑动 | Support left/right swipe
  - 带惯性 | With momentum
  - 边界回弹 | Bounce at edges 