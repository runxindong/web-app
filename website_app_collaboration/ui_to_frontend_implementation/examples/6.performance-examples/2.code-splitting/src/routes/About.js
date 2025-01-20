import React from 'react';

// 动态导入组件 / Dynamically import components
const PerformanceMetrics = React.lazy(() => import('../components/PerformanceMetrics'));
const CodeExplanation = React.lazy(() => import('../components/CodeExplanation'));

function About() {
    return (
        <div className="about">
            <section className="intro">
                <h1>关于代码分割 / About Code Splitting</h1>
                <p>
                    代码分割是一种优化技术，可以显著提高应用性能。
                    Code splitting is an optimization technique that can significantly improve application performance.
                </p>
            </section>

            <section className="benefits">
                <h2>主要优势 / Key Benefits</h2>
                <div className="benefits-grid">
                    <div className="benefit-card">
                        <h3>更快的初始加载 / Faster Initial Load</h3>
                        <p>
                            只加载必要的代码，减少首次加载时间。
                            Only load necessary code, reducing initial load time.
                        </p>
                    </div>
                    <div className="benefit-card">
                        <h3>更好的缓存 / Better Caching</h3>
                        <p>
                            独立的代码块可以单独缓存和更新。
                            Separate chunks can be cached and updated independently.
                        </p>
                    </div>
                    <div className="benefit-card">
                        <h3>按需加载 / On-demand Loading</h3>
                        <p>
                            根据用户行为动态加载功能。
                            Dynamically load features based on user behavior.
                        </p>
                    </div>
                </div>
            </section>

            <section className="metrics">
                <h2>性能指标 / Performance Metrics</h2>
                <React.Suspense fallback={<div>加载中... / Loading...</div>}>
                    <PerformanceMetrics />
                </React.Suspense>
            </section>

            <section className="explanation">
                <h2>技术说明 / Technical Explanation</h2>
                <React.Suspense fallback={<div>加载中... / Loading...</div>}>
                    <CodeExplanation />
                </React.Suspense>
            </section>

            <section className="implementation">
                <h2>实现方法 / Implementation Methods</h2>
                <div className="method-list">
                    <div className="method-item">
                        <h3>动态导入 / Dynamic Import</h3>
                        <pre>
                            <code>{`
import('./module').then(module => {
    // 使用模块 / Use module
});
                            `}</code>
                        </pre>
                    </div>
                    <div className="method-item">
                        <h3>React.lazy / React.lazy</h3>
                        <pre>
                            <code>{`
const Component = React.lazy(() => 
    import('./Component')
);
                            `}</code>
                        </pre>
                    </div>
                    <div className="method-item">
                        <h3>路由分割 / Route Splitting</h3>
                        <pre>
                            <code>{`
const Route = React.lazy(() => 
    import('./routes/Route')
);
                            `}</code>
                        </pre>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About; 