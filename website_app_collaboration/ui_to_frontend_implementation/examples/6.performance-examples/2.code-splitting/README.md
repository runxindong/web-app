# 代码分割示例 / Code Splitting Examples

这个项目展示了在 React 应用中实现代码分割的各种方法和最佳实践。
This project demonstrates various methods and best practices for implementing code splitting in React applications.

## 功能特点 / Features

- 路由级代码分割 / Route-level code splitting
- 组件级代码分割 / Component-level code splitting
- 动态导入 / Dynamic imports
- 性能指标监控 / Performance metrics monitoring
- 预加载策略 / Preloading strategies
- 错误处理 / Error handling

## 技术栈 / Tech Stack

- React 18
- React DOM
- Web Vitals
- Testing Library
- Source Map Explorer

## 项目结构 / Project Structure

```
src/
  ├── components/         # 组件目录 / Components directory
  │   ├── CodeDemo/      # 代码示例组件 / Code example component
  │   ├── PerformanceMetrics/  # 性能指标组件 / Performance metrics component
  │   └── CodeExplanation/     # 代码说明组件 / Code explanation component
  ├── App.js             # 主应用组件 / Main application component
  ├── App.css            # 应用样式 / Application styles
  ├── index.js           # 应用入口 / Application entry point
  └── index.css          # 全局样式 / Global styles
```

## 安装 / Installation

```bash
# 克隆仓库 / Clone the repository
git clone [repository-url]

# 进入项目目录 / Enter project directory
cd code-splitting-example

# 安装依赖 / Install dependencies
npm install
```

## 使用方法 / Usage

```bash
# 启动开发服务器 / Start development server
npm start

# 构建生产版本 / Build for production
npm run build

# 分析包大小 / Analyze bundle size
npm run analyze

# 运行测试 / Run tests
npm test
```

## 代码分割示例 / Code Splitting Examples

### 1. 路由级分割 / Route-level Splitting

```jsx
import React, { Suspense } from 'react';
const Component = React.lazy(() => import('./Component'));

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Component />
        </Suspense>
    );
}
```

### 2. 动态导入 / Dynamic Import

```jsx
const loadComponent = async () => {
    const module = await import('./module');
    return module.default;
};
```

### 3. 预加载策略 / Preloading Strategy

```jsx
const preloadComponent = () => {
    const component = import('./Component');
};

if ('requestIdleCallback' in window) {
    requestIdleCallback(preloadComponent);
}
```

## 性能优化 / Performance Optimization

本项目实现了以下性能优化策略：
This project implements the following performance optimization strategies:

1. 代码分割 / Code Splitting
   - 按路由分割 / Split by route
   - 按组件分割 / Split by component
   - 按功能分割 / Split by functionality

2. 资源优化 / Resource Optimization
   - 预加载 / Preloading
   - 预获取 / Prefetching
   - 懒加载 / Lazy loading

3. 性能监控 / Performance Monitoring
   - 首次内容绘制 (FCP) / First Contentful Paint
   - 最大内容绘制 (LCP) / Largest Contentful Paint
   - 首次输入延迟 (FID) / First Input Delay
   - 累积布局偏移 (CLS) / Cumulative Layout Shift

## 最佳实践 / Best Practices

1. 选择合适的分割点 / Choose appropriate split points
2. 实现错误处理 / Implement error handling
3. 优化加载体验 / Optimize loading experience
4. 监控性能指标 / Monitor performance metrics

## 贡献 / Contributing

欢迎贡献代码和提出建议！请遵循以下步骤：
Contributions are welcome! Please follow these steps:

1. Fork 项目 / Fork the project
2. 创建特性分支 / Create a feature branch
3. 提交变更 / Commit changes
4. 推送到分支 / Push to the branch
5. 创建合并请求 / Create a Pull Request

## 许可证 / License

MIT

## 联系方式 / Contact

如有问题或建议，请提交 issue 或发送邮件。
For questions or suggestions, please submit an issue or send an email. 