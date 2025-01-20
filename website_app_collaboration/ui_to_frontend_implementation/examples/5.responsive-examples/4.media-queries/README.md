# 媒体查询示例 / Media Queries Example

本示例展示了各种媒体查询的使用方法和最佳实践。
This example demonstrates various media query usage methods and best practices.

## 功能概述 / Feature Overview

### 1. 基础查询 / Basic Queries
- 响应式断点设置 / Responsive breakpoint settings
- 设备宽度适配 / Device width adaptation
- 布局调整示例 / Layout adjustment examples

### 2. 复杂条件 / Complex Conditions
- 屏幕方向检测 / Screen orientation detection
- 宽高比适配 / Aspect ratio adaptation
- 组合查询示例 / Combined query examples

### 3. 设备特性 / Device Features
- 悬停检测 / Hover detection
- 指针类型识别 / Pointer type recognition
- 深色模式支持 / Dark mode support

### 4. 打印样式 / Print Styles
- 打印布局优化 / Print layout optimization
- 内容筛选显示 / Content filtering
- 打印专用样式 / Print-specific styles

## 技术实现 / Technical Implementation

### CSS 媒体查询 / CSS Media Queries
```css
/* 移动设备 / Mobile Devices */
@media (max-width: 767px) {
    /* 样式定义 / Style definitions */
}

/* 平板设备 / Tablet Devices */
@media (min-width: 768px) and (max-width: 1023px) {
    /* 样式定义 / Style definitions */
}

/* 桌面设备 / Desktop Devices */
@media (min-width: 1024px) {
    /* 样式定义 / Style definitions */
}
```

### JavaScript 特性检测 / JavaScript Feature Detection
```javascript
// 检测屏幕方向 / Detect screen orientation
window.matchMedia('(orientation: portrait)').matches

// 检测深色模式 / Detect dark mode
window.matchMedia('(prefers-color-scheme: dark)').matches

// 检测悬停能力 / Detect hover capability
window.matchMedia('(hover: hover)').matches
```

## 使用说明 / Usage Instructions

### 1. 查看示例 / View Examples
- 调整浏览器窗口大小 / Resize browser window
- 切换设备方向 / Toggle device orientation
- 切换系统主题 / Switch system theme
- 尝试打印页面 / Try printing the page

### 2. 测试方法 / Testing Methods
- 使用浏览器开发工具 / Use browser developer tools
- 在不同设备上测试 / Test on different devices
- 检查打印预览 / Check print preview
- 验证特性检测 / Verify feature detection

### 3. 代码结构 / Code Structure
```
4.media-queries/
├── index.html      # 主页面 / Main page
├── styles.css      # 样式定义 / Style definitions
├── script.js       # 交互逻辑 / Interaction logic
└── README.md       # 说明文档 / Documentation
```

## 最佳实践 / Best Practices

### 1. 断点设置 / Breakpoint Setting
- 使用有意义的断点 / Use meaningful breakpoints
- 避免设备特定断点 / Avoid device-specific breakpoints
- 考虑内容需求 / Consider content requirements

### 2. 性能优化 / Performance Optimization
- 避免复杂查询 / Avoid complex queries
- 优化选择器性能 / Optimize selector performance
- 减少重排重绘 / Reduce reflows and repaints

### 3. 可维护性 / Maintainability
- 使用CSS变量 / Use CSS variables
- 保持代码模块化 / Keep code modular
- 添加清晰注释 / Add clear comments

### 4. 可访问性 / Accessibility
- 确保打印友好 / Ensure print-friendly
- 支持操作系统设置 / Support OS settings
- 考虑辅助技术 / Consider assistive technologies

## 浏览器支持 / Browser Support
- Chrome 21+
- Firefox 3.5+
- Safari 4+
- Edge 12+
- iOS Safari 3.2+
- Android Browser 2.1+

## 注意事项 / Notes
1. 媒体查询应该是渐进增强的一部分 / Media queries should be part of progressive enhancement
2. 始终提供基础样式作为后备 / Always provide base styles as fallback
3. 测试不同设备和浏览器 / Test across different devices and browsers
4. 考虑性能影响 / Consider performance implications 