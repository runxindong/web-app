# 设计系统规范 | Design System Specification

## 1. 颜色系统 | Color System

### 1.1 主色调 | Primary Colors
- 主要色 | Primary: #3498db
- 次要色 | Secondary: #2ecc71
- 强调色 | Accent: #e74c3c

### 1.2 中性色 | Neutral Colors
- 文本色 | Text: #333333
- 背景色 | Background: #ffffff
- 边框色 | Border: #dddddd

### 1.3 功能色 | Functional Colors
- 成功色 | Success: #27ae60
- 警告色 | Warning: #f1c40f
- 错误色 | Error: #e74c3c
- 信息色 | Info: #3498db

## 2. 排版系统 | Typography System

### 2.1 字体家族 | Font Families
- 主要字体 | Primary Font：PingFang SC, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
- 代码字体 | Code Font：Monaco, Consolas, "Courier New", monospace

### 2.2 字体大小 | Font Sizes
- 一级标题 | h1: 32px
- 二级标题 | h2: 28px
- 三级标题 | h3: 24px
- 四级标题 | h4: 20px
- 正文 | Body Text：16px
- 小字 | Small Text：14px
- 注释 | Caption：12px

### 2.3 行高 | Line Heights
- 标题 | Headings：1.4
- 正文 | Body Text：1.6
- 紧凑 | Compact：1.2

## 3. 间距系统 | Spacing System

### 3.1 基础间距 | Base Spacing
- 超小间距 | Extra Small: 4px
- 小间距 | Small: 8px
- 中间距 | Medium: 16px
- 大间距 | Large: 24px
- 超大间距 | Extra Large: 32px

### 3.2 组件间距 | Component Spacing
- 组件内间距 | Internal Padding：16px
- 组件间间距 | Component Gap：24px
- 区块间间距 | Section Gap：48px

## 4. 圆角系统 | Border Radius System
- 小圆角 | Small Radius：2px
- 中圆角 | Medium Radius：4px
- 大圆角 | Large Radius：8px
- 全圆 | Circle：50%

## 5. 阴影系统 | Shadow System
```css
/* 浮层阴影 | Floating Shadow */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

/* 卡片阴影 | Card Shadow */
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

/* 弹窗阴影 | Modal Shadow */
box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
```

## 6. 响应式断点 | Responsive Breakpoints
- 移动端 | Mobile: < 768px
- 平板 | Tablet: 768px - 1024px
- 桌面 | Desktop: > 1024px

## 7. 动画系统 | Animation System

### 7.1 过渡时间 | Transition Duration
- 快速 | Fast：0.2s
- 普通 | Normal：0.3s
- 缓慢 | Slow：0.4s

### 7.2 过渡曲线 | Transition Curves
- 默认 | Default：ease-in-out
- 弹性 | Bouncy：cubic-bezier(0.68, -0.55, 0.265, 1.55)
- 平滑 | Smooth：cubic-bezier(0.4, 0, 0.2, 1)
``` 