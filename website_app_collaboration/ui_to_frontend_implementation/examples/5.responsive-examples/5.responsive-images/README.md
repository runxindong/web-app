# 响应式图片示例 / Responsive Images Example

本示例展示了响应式图片的各种实现技术和最佳实践。
This example demonstrates various responsive image implementation techniques and best practices.

## 功能概述 / Feature Overview

### 1. 基础优化 / Basic Optimization
- srcset 和 sizes 属性使用 / srcset and sizes attributes usage
- 响应式图片选择 / Responsive image selection
- 自动尺寸计算 / Automatic size calculation

### 2. 艺术指导 / Art Direction
- picture 元素使用 / picture element usage
- 媒体查询适配 / Media query adaptation
- 不同场景裁剪 / Different scenario cropping

### 3. 密度切换 / Density Switching
- 2x 和 3x 图片支持 / 2x and 3x image support
- 设备像素比适配 / Device pixel ratio adaptation
- 高DPI显示优化 / High DPI display optimization

### 4. 延迟加载 / Lazy Loading
- 原生延迟加载 / Native lazy loading
- 渐进式加载 / Progressive loading
- 占位符优化 / Placeholder optimization

## 技术实现 / Technical Implementation

### 响应式图片标签 / Responsive Image Tags
```html
<!-- 基础响应式图片 / Basic Responsive Image -->
<img src="image.jpg"
     srcset="small.jpg 300w,
             medium.jpg 600w,
             large.jpg 900w"
     sizes="(max-width: 300px) 100vw,
            (max-width: 600px) 50vw,
            33vw"
     alt="响应式图片示例 / Responsive image example">

<!-- 艺术指导示例 / Art Direction Example -->
<picture>
    <source media="(min-width: 800px)" srcset="large.jpg">
    <source media="(min-width: 400px)" srcset="medium.jpg">
    <img src="small.jpg" alt="艺术指导示例 / Art direction example">
</picture>
```

### 延迟加载实现 / Lazy Loading Implementation
```javascript
// 使用 Intersection Observer / Using Intersection Observer
const observer = new IntersectionObserver(callback);
observer.observe(imageElement);

// 渐进式加载 / Progressive Loading
function loadHighQualityImage(img) {
    const highRes = new Image();
    highRes.src = img.dataset.src;
    highRes.onload = () => {
        img.src = highRes.src;
    };
}
```

## 使用说明 / Usage Instructions

### 1. 图片准备 / Image Preparation
- 准备多个尺寸的图片 / Prepare multiple sizes of images
- 优化图片质量 / Optimize image quality
- 选择合适的格式 / Choose appropriate formats

### 2. 实现步骤 / Implementation Steps
1. 添加基础图片 / Add base images
2. 配置响应式属性 / Configure responsive attributes
3. 实现延迟加载 / Implement lazy loading
4. 添加降级方案 / Add fallback solutions

### 3. 测试方法 / Testing Methods
- 使用不同设备测试 / Test on different devices
- 检查网络请求 / Check network requests
- 验证加载性能 / Verify loading performance
- 测试降级方案 / Test fallback solutions

## 最佳实践 / Best Practices

### 1. 性能优化 / Performance Optimization
- 使用适当的图片尺寸 / Use appropriate image sizes
- 实现延迟加载 / Implement lazy loading
- 优化加载顺序 / Optimize loading order
- 使用现代图片格式 / Use modern image formats

### 2. 可访问性 / Accessibility
- 提供替代文本 / Provide alternative text
- 确保键盘可访问 / Ensure keyboard accessibility
- 考虑屏幕阅读器 / Consider screen readers
- 保持语义化标记 / Maintain semantic markup

### 3. 用户体验 / User Experience
- 使用加载占位符 / Use loading placeholders
- 实现平滑过渡 / Implement smooth transitions
- 避免布局偏移 / Avoid layout shifts
- 提供加载反馈 / Provide loading feedback

### 4. 维护性 / Maintainability
- 使用命名约定 / Use naming conventions
- 保持代码模块化 / Keep code modular
- 添加详细注释 / Add detailed comments
- 文档化配置选项 / Document configuration options

## 浏览器支持 / Browser Support
- Chrome 61+
- Firefox 60+
- Safari 11+
- Edge 16+
- iOS Safari 11+
- Android Chrome 61+

## 注意事项 / Notes
1. 始终提供基础图片作为后备 / Always provide base images as fallback
2. 考虑带宽和性能影响 / Consider bandwidth and performance impact
3. 测试不同网络条件 / Test under different network conditions
4. 监控和优化性能 / Monitor and optimize performance
5. 定期更新和维护 / Regular updates and maintenance 