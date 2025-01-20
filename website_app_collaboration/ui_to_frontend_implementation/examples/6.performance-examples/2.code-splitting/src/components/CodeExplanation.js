import React, { useState } from 'react';

const explanations = {
    concept: {
        title: '概念解释 / Concept Explanation',
        content: `代码分割是一种优化技术，它允许您将代码拆分成小块，然后按需加载。这可以帮助减少初始加载时间，提高应用性能。

Code splitting is an optimization technique that allows you to split your code into small chunks and load them on demand. This helps reduce initial loading time and improve application performance.`,
        code: `// 示例：动态导入 / Example: Dynamic Import
const module = await import('./module');
module.someFunction();`
    },
    implementation: {
        title: '实现方法 / Implementation Methods',
        content: `有多种方法可以实现代码分割：
1. 动态导入（import()）
2. React.lazy() 和 Suspense
3. 路由级分割
4. 组件级分割

There are several ways to implement code splitting:
1. Dynamic imports (import())
2. React.lazy() and Suspense
3. Route-level splitting
4. Component-level splitting`,
        code: `// React.lazy 示例 / React.lazy example
const Component = React.lazy(() => import('./Component'));

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Component />
        </Suspense>
    );
}`
    },
    bestPractices: {
        title: '最佳实践 / Best Practices',
        content: `代码分割的最佳实践：
1. 选择合适的分割点
2. 实现预加载策略
3. 优化加载性能
4. 处理加载失败

Code splitting best practices:
1. Choose appropriate split points
2. Implement preloading strategies
3. Optimize loading performance
4. Handle loading failures`,
        code: `// 预加载示例 / Preloading example
const Component = React.lazy(() => import('./Component'));

// 在空闲时预加载 / Preload during idle time
const preloadComponent = () => {
    const component = import('./Component');
};

if ('requestIdleCallback' in window) {
    requestIdleCallback(preloadComponent);
} else {
    setTimeout(preloadComponent, 1000);
}`
    },
    optimization: {
        title: '优化策略 / Optimization Strategies',
        content: `优化代码分割的策略：
1. 分析包大小
2. 设置合理的分割阈值
3. 实现缓存策略
4. 监控性能指标

Strategies to optimize code splitting:
1. Analyze bundle size
2. Set reasonable split thresholds
3. Implement caching strategies
4. Monitor performance metrics`,
        code: `// webpack 配置示例 / webpack configuration example
module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 20000,
            maxSize: 70000,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }
};`
    }
};

function CodeExplanation() {
    const [activeSection, setActiveSection] = useState('concept');

    return (
        <div className="code-explanation">
            <nav className="explanation-nav">
                {Object.keys(explanations).map(key => (
                    <button
                        key={key}
                        className={`nav-item ${activeSection === key ? 'active' : ''}`}
                        onClick={() => setActiveSection(key)}
                    >
                        {explanations[key].title}
                    </button>
                ))}
            </nav>

            <div className="explanation-content">
                <h3>{explanations[activeSection].title}</h3>
                <div className="content-text">
                    {explanations[activeSection].content.split('\n').map((text, index) => (
                        <p key={index}>{text}</p>
                    ))}
                </div>
                <div className="content-code">
                    <pre>
                        <code>{explanations[activeSection].code}</code>
                    </pre>
                </div>
            </div>

            <div className="explanation-notes">
                <h4>注意事项 / Notes</h4>
                <ul>
                    <li>
                        确保在生产环境中启用代码分割
                        Ensure code splitting is enabled in production
                    </li>
                    <li>
                        监控分割后的性能影响
                        Monitor performance impact after splitting
                    </li>
                    <li>
                        考虑用户的网络条件
                        Consider user's network conditions
                    </li>
                    <li>
                        实现适当的错误处理
                        Implement proper error handling
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default CodeExplanation; 