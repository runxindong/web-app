import React from 'react';
import CodeDemo from './components/CodeDemo';
import PerformanceMetrics from './components/PerformanceMetrics';
import CodeExplanation from './components/CodeExplanation';
import './App.css';

function App() {
    return (
        <div className="app">
            <header className="app-header">
                <h1>代码分割示例 / Code Splitting Examples</h1>
                <p className="app-description">
                    本示例展示了代码分割的各种实现方法和最佳实践
                    This example demonstrates various implementations and best practices of code splitting
                </p>
            </header>

            <main className="app-content">
                <section className="section">
                    <h2>性能指标 / Performance Metrics</h2>
                    <PerformanceMetrics />
                </section>

                <section className="section">
                    <h2>代码示例 / Code Examples</h2>
                    <CodeDemo />
                </section>

                <section className="section">
                    <h2>概念说明 / Concept Explanation</h2>
                    <CodeExplanation />
                </section>
            </main>

            <footer className="app-footer">
                <p>
                    性能优化示例 - 代码分割
                    Performance Optimization Examples - Code Splitting
                </p>
                <p>
                    了解更多关于代码分割的信息，请访问
                    Learn more about code splitting at{' '}
                    <a
                        href="https://reactjs.org/docs/code-splitting.html"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        React Documentation
                    </a>
                </p>
            </footer>
        </div>
    );
}

export default App; 