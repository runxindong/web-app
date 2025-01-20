import React, { useState, useEffect } from 'react';

// 动态导入组件 / Dynamically import components
const PerformanceChart = React.lazy(() => import('../components/PerformanceChart'));
const BundleAnalyzer = React.lazy(() => import('../components/BundleAnalyzer'));
const LoadingMetrics = React.lazy(() => import('../components/LoadingMetrics'));

function Dashboard() {
    const [performanceData, setPerformanceData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 模拟加载性能数据 / Simulate loading performance data
        const loadPerformanceData = async () => {
            try {
                // 实际应用中，这里会从API获取数据 / In real application, this would fetch from an API
                const data = await new Promise(resolve => 
                    setTimeout(() => resolve({
                        bundleSize: {
                            total: '2.5MB',
                            chunks: [
                                { name: 'main', size: '1.2MB' },
                                { name: 'vendors', size: '800KB' },
                                { name: 'runtime', size: '50KB' }
                            ]
                        },
                        loadingTimes: {
                            firstContentfulPaint: '0.8s',
                            timeToInteractive: '1.5s',
                            totalBlockingTime: '200ms'
                        },
                        codeSpitting: {
                            totalChunks: 12,
                            lazyLoadedChunks: 8,
                            averageChunkSize: '150KB'
                        }
                    }), 1000)
                );
                setPerformanceData(data);
            } catch (error) {
                console.error('加载性能数据失败 / Failed to load performance data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadPerformanceData();
    }, []);

    if (isLoading) {
        return <div className="loading">加载中... / Loading...</div>;
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>性能监控面板 / Performance Monitoring Dashboard</h1>
                <p>
                    实时监控应用性能指标
                    Monitor application performance metrics in real-time
                </p>
            </header>

            <main className="dashboard-content">
                <section className="metrics-overview">
                    <h2>性能概览 / Performance Overview</h2>
                    <div className="metrics-grid">
                        <div className="metric-card">
                            <h3>总包大小 / Total Bundle Size</h3>
                            <p className="metric-value">{performanceData.bundleSize.total}</p>
                        </div>
                        <div className="metric-card">
                            <h3>首次内容绘制 / First Contentful Paint</h3>
                            <p className="metric-value">{performanceData.loadingTimes.firstContentfulPaint}</p>
                        </div>
                        <div className="metric-card">
                            <h3>代码块数量 / Number of Chunks</h3>
                            <p className="metric-value">{performanceData.codeSpitting.totalChunks}</p>
                        </div>
                    </div>
                </section>

                <section className="performance-charts">
                    <h2>性能图表 / Performance Charts</h2>
                    <React.Suspense fallback={<div>加载图表中... / Loading charts...</div>}>
                        <PerformanceChart data={performanceData} />
                    </React.Suspense>
                </section>

                <section className="bundle-analysis">
                    <h2>包分析 / Bundle Analysis</h2>
                    <React.Suspense fallback={<div>加载分析器... / Loading analyzer...</div>}>
                        <BundleAnalyzer data={performanceData.bundleSize} />
                    </React.Suspense>
                </section>

                <section className="loading-metrics">
                    <h2>加载指标 / Loading Metrics</h2>
                    <React.Suspense fallback={<div>加载指标中... / Loading metrics...</div>}>
                        <LoadingMetrics data={performanceData.loadingTimes} />
                    </React.Suspense>
                </section>

                <section className="optimization-tips">
                    <h2>优化建议 / Optimization Tips</h2>
                    <div className="tips-list">
                        <div className="tip-item">
                            <h3>代码分割 / Code Splitting</h3>
                            <p>
                                当前使用 {performanceData.codeSpitting.lazyLoadedChunks} 个懒加载块
                                Currently using {performanceData.codeSpitting.lazyLoadedChunks} lazy-loaded chunks
                            </p>
                        </div>
                        <div className="tip-item">
                            <h3>包大小优化 / Bundle Size Optimization</h3>
                            <p>
                                平均块大小: {performanceData.codeSpitting.averageChunkSize}
                                Average chunk size: {performanceData.codeSpitting.averageChunkSize}
                            </p>
                        </div>
                        <div className="tip-item">
                            <h3>加载性能 / Loading Performance</h3>
                            <p>
                                总阻塞时间: {performanceData.loadingTimes.totalBlockingTime}
                                Total blocking time: {performanceData.loadingTimes.totalBlockingTime}
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Dashboard; 