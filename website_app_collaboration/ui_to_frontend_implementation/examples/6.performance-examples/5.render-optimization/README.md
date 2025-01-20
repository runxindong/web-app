# 渲染优化示例 / Render Optimization Examples

本目录包含了前端渲染优化的各种示例和最佳实践。
This directory contains examples and best practices for frontend render optimization.

## 目录结构 / Directory Structure

1. 关键渲染路径优化 / Critical Rendering Path
   - HTML优化 / HTML optimization
   - CSS优化 / CSS optimization
   - JavaScript优化 / JavaScript optimization
   - 资源加载优化 / Resource loading optimization

2. 虚拟列表 / Virtual List
   - 基础实现 / Basic implementation
   - 动态高度 / Dynamic height
   - 无限滚动 / Infinite scroll
   - 分组列表 / Grouped list

3. 防抖和节流 / Debounce and Throttle
   - 输入处理 / Input handling
   - 滚动事件 / Scroll events
   - 窗口调整 / Window resize
   - API调用 / API calls

4. 重绘重排优化 / Reflow and Repaint
   - 批量DOM操作 / Batch DOM operations
   - CSS优化 / CSS optimization
   - 动画优化 / Animation optimization
   - 布局优化 / Layout optimization

5. Web Workers
   - 数据处理 / Data processing
   - 图像处理 / Image processing
   - 计算密集型任务 / Computation intensive tasks
   - 后台同步 / Background synchronization

## 最佳实践 / Best Practices

1. 关键渲染路径优化 / Critical Rendering Path Optimization
   ```html
   <!-- 内联关键CSS / Inline critical CSS -->
   <style>
     /* Critical CSS here */
   </style>
   
   <!-- 异步加载非关键CSS / Async load non-critical CSS -->
   <link rel="preload" href="styles.css" as="style" onload="this.rel='stylesheet'">
   
   <!-- 延迟加载JavaScript / Defer JavaScript -->
   <script defer src="app.js"></script>
   ```

2. 虚拟列表实现 / Virtual List Implementation
   ```javascript
   class VirtualList {
     constructor(container, items, itemHeight) {
       this.container = container;
       this.items = items;
       this.itemHeight = itemHeight;
       this.visibleItems = Math.ceil(container.clientHeight / itemHeight);
       this.scrollTop = 0;
       this.startIndex = 0;
       
       this.init();
     }
     
     init() {
       this.container.addEventListener('scroll', this.onScroll.bind(this));
       this.render();
     }
     
     onScroll() {
       this.scrollTop = this.container.scrollTop;
       this.startIndex = Math.floor(this.scrollTop / this.itemHeight);
       this.render();
     }
     
     render() {
       const endIndex = Math.min(
         this.startIndex + this.visibleItems,
         this.items.length
       );
       
       // Render only visible items
       const visibleItems = this.items
         .slice(this.startIndex, endIndex)
         .map(item => this.renderItem(item));
         
       this.container.innerHTML = visibleItems.join('');
     }
   }
   ```

3. 防抖和节流实现 / Debounce and Throttle Implementation
   ```javascript
   // 防抖函数 / Debounce function
   function debounce(func, wait) {
     let timeout;
     return function executedFunction(...args) {
       const later = () => {
         clearTimeout(timeout);
         func(...args);
       };
       clearTimeout(timeout);
       timeout = setTimeout(later, wait);
     };
   }
   
   // 节流函数 / Throttle function
   function throttle(func, limit) {
     let inThrottle;
     return function executedFunction(...args) {
       if (!inThrottle) {
         func(...args);
         inThrottle = true;
         setTimeout(() => inThrottle = false, limit);
       }
     };
   }
   ```

4. 重绘重排优化 / Reflow and Repaint Optimization
   ```javascript
   // 批量DOM操作 / Batch DOM operations
   const fragment = document.createDocumentFragment();
   items.forEach(item => {
     const element = document.createElement('div');
     element.textContent = item;
     fragment.appendChild(element);
   });
   container.appendChild(fragment);
   
   // 使用CSS类替代多个样式修改 / Use CSS class instead of multiple style changes
   element.classList.add('active');
   ```

5. Web Workers使用 / Web Workers Usage
   ```javascript
   // 创建Worker / Create Worker
   const worker = new Worker('worker.js');
   
   // 发送数据到Worker / Send data to Worker
   worker.postMessage({ data: complexData });
   
   // 接收Worker结果 / Receive Worker results
   worker.onmessage = function(e) {
     const result = e.data;
     updateUI(result);
   };
   ```

## 性能指标 / Performance Metrics

1. 关键渲染路径 / Critical Rendering Path
   - First Paint: < 1s
   - First Contentful Paint: < 1.5s
   - Time to Interactive: < 3s

2. 虚拟列表 / Virtual List
   - 渲染10000项: < 100ms
   - 滚动时帧率: 60fps
   - 内存使用: < 50MB

3. 防抖和节流 / Debounce and Throttle
   - 输入响应延迟: < 300ms
   - 滚动事件触发频率: < 60/s

4. 重绘重排 / Reflow and Repaint
   - 布局抖动: 0
   - 动画帧率: 60fps

5. Web Workers
   - 主线程阻塞: 0
   - 后台任务完成时间: 与任务复杂度相关

## 使用说明 / Usage Instructions

1. 安装依赖 / Install Dependencies
   ```bash
   npm install
   ```

2. 运行示例 / Run Examples
   ```bash
   npm start
   ```

3. 性能测试 / Performance Testing
   ```bash
   npm run benchmark
   ```

## 注意事项 / Notes

1. 性能优化 / Performance Optimization
   - 使用性能监控工具
   - 设置性能预算
   - 持续监测和优化

2. 浏览器兼容性 / Browser Compatibility
   - 检查特性支持
   - 提供降级方案
   - 测试多个浏览器

3. 可维护性 / Maintainability
   - 文档化优化策略
   - 代码注释
   - 性能测试用例 