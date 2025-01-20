import React from 'react';

function PerformanceChart({ data }) {
    const { bundleSize, loadingTimes, codeSpitting } = data;

    return (
        <div className="performance-chart">
            <div className="chart-section">
                <h3>包大小分析 / Bundle Size Analysis</h3>
                <div className="chart-container">
                    {bundleSize.chunks.map((chunk, index) => (
                        <div key={index} className="chart-bar">
                            <div 
                                className="bar"
                                style={{ 
                                    width: `${(parseInt(chunk.size) / parseInt(bundleSize.total)) * 100}%`
                                }}
                            >
                                <span className="bar-label">
                                    {chunk.name}: {chunk.size}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="chart-section">
                <h3>加载时间分析 / Loading Time Analysis</h3>
                <div className="metrics-grid">
                    <div className="metric-card">
                        <h4>首次内容绘制 / First Contentful Paint</h4>
                        <p className="metric-value">{loadingTimes.firstContentfulPaint}</p>
                    </div>
                    <div className="metric-card">
                        <h4>可交互时间 / Time to Interactive</h4>
                        <p className="metric-value">{loadingTimes.timeToInteractive}</p>
                    </div>
                    <div className="metric-card">
                        <h4>总阻塞时间 / Total Blocking Time</h4>
                        <p className="metric-value">{loadingTimes.totalBlockingTime}</p>
                    </div>
                </div>
            </div>

            <div className="chart-section">
                <h3>代码分割分析 / Code Splitting Analysis</h3>
                <div className="stats-container">
                    <div className="stat-item">
                        <h4>总块数 / Total Chunks</h4>
                        <p className="stat-value">{codeSpitting.totalChunks}</p>
                    </div>
                    <div className="stat-item">
                        <h4>懒加载块 / Lazy Loaded Chunks</h4>
                        <p className="stat-value">{codeSpitting.lazyLoadedChunks}</p>
                    </div>
                    <div className="stat-item">
                        <h4>平均块大小 / Average Chunk Size</h4>
                        <p className="stat-value">{codeSpitting.averageChunkSize}</p>
                    </div>
                </div>
            </div>

            <div className="chart-notes">
                <h4>性能说明 / Performance Notes</h4>
                <ul>
                    <li>
                        总包大小 / Total Bundle Size: {bundleSize.total}
                    </li>
                    <li>
                        懒加载比例 / Lazy Loading Ratio: {
                            Math.round((codeSpitting.lazyLoadedChunks / codeSpitting.totalChunks) * 100)
                        }%
                    </li>
                    <li>
                        建议优化项 / Suggested Optimizations:
                        {parseInt(bundleSize.total) > 3000000 ? (
                            <span className="warning">
                                建议进一步优化包大小
                                Consider further bundle size optimization
                            </span>
                        ) : (
                            <span className="success">
                                包大小在合理范围内
                                Bundle size within reasonable range
                            </span>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default PerformanceChart; 