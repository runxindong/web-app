import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// 动态导入特性组件 / Dynamically import feature components
const FeatureCard = React.lazy(() => import('../components/FeatureCard'));
const CodeDemo = React.lazy(() => import('../components/CodeDemo'));

function Home() {
    const [showFeatures, setShowFeatures] = useState(false);

    return (
        <div className="home">
            <section className="hero">
                <h1>代码分割最佳实践 / Code Splitting Best Practices</h1>
                <p>学习如何优化您的应用性能 / Learn how to optimize your application performance</p>
                <button 
                    className="cta-button"
                    onClick={() => setShowFeatures(true)}
                >
                    查看特性 / View Features
                </button>
            </section>

            {showFeatures && (
                <section className="features">
                    <React.Suspense fallback={<div>加载中... / Loading...</div>}>
                        <div className="feature-grid">
                            <FeatureCard
                                title="路由分割 / Route Splitting"
                                description="按路由拆分代码，提高初始加载速度 / Split code by routes to improve initial load speed"
                                link="/about"
                            />
                            <FeatureCard
                                title="组件分割 / Component Splitting"
                                description="动态加载组件，优化页面性能 / Dynamically load components to optimize page performance"
                                link="/dashboard"
                            />
                            <FeatureCard
                                title="按需加载 / On-demand Loading"
                                description="根据用户交互按需加载内容 / Load content based on user interaction"
                                link="/settings"
                            />
                        </div>
                    </React.Suspense>
                </section>
            )}

            <section className="demo">
                <h2>代码示例 / Code Examples</h2>
                <React.Suspense fallback={<div>加载中... / Loading...</div>}>
                    <CodeDemo />
                </React.Suspense>
            </section>

            <section className="links">
                <h2>快速导航 / Quick Navigation</h2>
                <nav>
                    <Link to="/about">关于 / About</Link>
                    <Link to="/dashboard">仪表板 / Dashboard</Link>
                    <Link to="/settings">设置 / Settings</Link>
                </nav>
            </section>
        </div>
    );
}

export default Home; 