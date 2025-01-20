import React, { useState } from 'react';

const codeExamples = {
    basic: {
        title: '基础代码分割 / Basic Code Splitting',
        code: `// 动态导入 / Dynamic Import
import('./module').then(module => {
    // 使用模块 / Use module
});`,
        description: '使用动态导入实现基础的代码分割 / Use dynamic import for basic code splitting'
    },
    react: {
        title: 'React 组件分割 / React Component Splitting',
        code: `// React.lazy 和 Suspense / React.lazy and Suspense
const Component = React.lazy(() => import('./Component'));

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Component />
        </Suspense>
    );
}`,
        description: '使用 React.lazy 实现组件级代码分割 / Use React.lazy for component-level code splitting'
    },
    route: {
        title: '路由分割 / Route Splitting',
        code: `// 路由级代码分割 / Route-level code splitting
const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

function App() {
    return (
        <Router>
            <Suspense fallback={<Loading />}>
                <Switch>
                    <Route path="/" component={Home} />
                    <Route path="/about" component={About} />
                </Switch>
            </Suspense>
        </Router>
    );
}`,
        description: '使用路由实现页面级代码分割 / Use routing for page-level code splitting'
    }
};

function CodeDemo() {
    const [activeExample, setActiveExample] = useState('basic');

    return (
        <div className="code-demo">
            <div className="demo-nav">
                <button
                    className={`demo-nav-item ${activeExample === 'basic' ? 'active' : ''}`}
                    onClick={() => setActiveExample('basic')}
                >
                    基础示例 / Basic Example
                </button>
                <button
                    className={`demo-nav-item ${activeExample === 'react' ? 'active' : ''}`}
                    onClick={() => setActiveExample('react')}
                >
                    React 示例 / React Example
                </button>
                <button
                    className={`demo-nav-item ${activeExample === 'route' ? 'active' : ''}`}
                    onClick={() => setActiveExample('route')}
                >
                    路由示例 / Route Example
                </button>
            </div>

            <div className="demo-content">
                <h3>{codeExamples[activeExample].title}</h3>
                <pre className="code-block">
                    <code>{codeExamples[activeExample].code}</code>
                </pre>
                <p className="demo-description">
                    {codeExamples[activeExample].description}
                </p>
            </div>

            <div className="demo-tips">
                <h4>提示 / Tips</h4>
                <ul>
                    <li>
                        确保在生产环境中启用代码分割
                        Ensure code splitting is enabled in production
                    </li>
                    <li>
                        合理设置分割点以优化性能
                        Set split points reasonably to optimize performance
                    </li>
                    <li>
                        考虑使用预加载提升用户体验
                        Consider using preloading to enhance user experience
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default CodeDemo; 