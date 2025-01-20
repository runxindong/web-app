# 延迟加载示例 / Lazy Loading Examples

本示例展示了各种延迟加载技术的实现方法和最佳实践。
This example demonstrates various lazy loading techniques and best practices.

## 功能概述 / Feature Overview

### 1. 图片延迟加载 / Image Lazy Loading
- 原生延迟加载 / Native lazy loading
- 交叉观察器 / Intersection Observer
- 渐进式加载 / Progressive loading
- 占位符优化 / Placeholder optimization

### 2. 组件延迟加载 / Component Lazy Loading
- React.lazy() 实现 / React.lazy() implementation
- 动态导入 / Dynamic imports
- 加载状态 / Loading states
- 错误处理 / Error handling

### 3. 路由延迟加载 / Route Lazy Loading
- 路由分割 / Route splitting
- 预加载策略 / Preloading strategies
- 加载提示 / Loading indicators
- 路由缓存 / Route caching

### 4. 资源延迟加载 / Resource Lazy Loading
- 脚本延迟加载 / Script lazy loading
- 样式延迟加载 / Style lazy loading
- 字体延迟加载 / Font lazy loading
- 媒体延迟加载 / Media lazy loading

## 技术实现 / Technical Implementation

### 1. 图片延迟加载 / Image Lazy Loading
```html
<!-- 原生延迟加载 / Native lazy loading -->
<img src="image.jpg" 
     loading="lazy" 
     alt="延迟加载图片 / Lazy loaded image">

<!-- 使用 Intersection Observer / Using Intersection Observer -->
<img data-src="image.jpg" 
     class="lazy" 
     alt="延迟加载图片 / Lazy loaded image">
```

```javascript
// Intersection Observer 实现 / Intersection Observer implementation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            observer.unobserve(img);
        }
    });
});

document.querySelectorAll('img.lazy').forEach(img => {
    observer.observe(img);
});
```

### 2. 组件延迟加载 / Component Lazy Loading
```javascript
// React 组件延迟加载 / React component lazy loading
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <LazyComponent />
        </Suspense>
    );
}
```

### 3. 路由延迟加载 / Route Lazy Loading
```javascript
// React Router 延迟加载 / React Router lazy loading
const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

function App() {
    return (
        <Router>
            <Suspense fallback={<Loading />}>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/about" component={About} />
                </Switch>
            </Suspense>
        </Router>
    );
}
```

### 4. 资源延迟加载 / Resource Lazy Loading
```html
<!-- 脚本延迟加载 / Script lazy loading -->
<script defer src="script.js"></script>

<!-- 样式延迟加载 / Style lazy loading -->
<link rel="preload" 
      href="style.css" 
      as="style" 
      onload="this.onload=null;this.rel='stylesheet'">
```

## 最佳实践 / Best Practices

### 1. 性能优化 / Performance Optimization
- 设置适当的阈值 / Set appropriate thresholds
- 优化加载时机 / Optimize loading timing
- 实现预加载 / Implement preloading
- 优化加载顺序 / Optimize loading order

### 2. 用户体验 / User Experience
- 提供加载反馈 / Provide loading feedback
- 实现平滑过渡 / Implement smooth transitions
- 避免布局偏移 / Avoid layout shifts
- 优化首屏加载 / Optimize initial load

### 3. 错误处理 / Error Handling
- 实现错误边界 / Implement error boundaries
- 提供降级方案 / Provide fallback solutions
- 添加重试机制 / Add retry mechanisms
- 优化错误提示 / Optimize error messages

### 4. 监控与分析 / Monitoring and Analysis
- 跟踪加载性能 / Track loading performance
- 监控错误率 / Monitor error rates
- 分析用户行为 / Analyze user behavior
- 优化加载策略 / Optimize loading strategies

## 使用说明 / Usage Instructions

### 1. 安装依赖 / Install Dependencies
```bash
npm install intersection-observer
npm install react-lazy-load-image-component
```

### 2. 配置说明 / Configuration Guide
```javascript
// webpack.config.js
module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 20000,
            maxSize: 70000,
        }
    }
};
```

### 3. 示例运行 / Running Examples
```bash
# 开发模式 / Development mode
npm run dev

# 生产构建 / Production build
npm run build
```

## 浏览器支持 / Browser Support
- Chrome 51+
- Firefox 55+
- Safari 12.1+
- Edge 79+
- iOS Safari 12.2+
- Android Chrome 51+

## 注意事项 / Notes
1. 考虑首屏内容 / Consider above-the-fold content
2. 优化加载时机 / Optimize loading timing
3. 处理加载失败 / Handle loading failures
4. 测试不同网络 / Test different networks
5. 监控性能指标 / Monitor performance metrics

## 常见问题 / Common Issues

### 1. 图片闪烁 / Image Flickering
- 问题：图片加载时出现闪烁 / Issue: Images flicker during loading
- 解决：使用占位符和渐变效果 / Solution: Use placeholders and fade effects

### 2. 组件加载失败 / Component Loading Failure
- 问题：动态组件加载失败 / Issue: Dynamic component fails to load
- 解决：实现错误边界和重试机制 / Solution: Implement error boundaries and retry mechanisms

### 3. 性能问题 / Performance Issues
- 问题：加载性能不佳 / Issue: Poor loading performance
- 解决：优化加载策略和资源大小 / Solution: Optimize loading strategy and resource size

## 更新日志 / Changelog
- 2024-01-08: 初始版本发布 / Initial version release
- 2024-01-08: 添加组件延迟加载示例 / Added component lazy loading examples
- 2024-01-08: 优化图片加载策略 / Optimized image loading strategy
- 2024-01-08: 更新文档说明 / Updated documentation 