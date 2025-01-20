const PerformanceMetrics = ({ metrics }) => {
    return (
        <div className="performance-metrics">
            <h2>性能指标</h2>
            <div className="metric">
                <span className="metric-label">未优化组件渲染次数:</span>
                <span className="metric-value">{metrics.unoptimizedRenders}</span>
            </div>
            <div className="metric">
                <span className="metric-label">优化后组件渲染次数:</span>
                <span className="metric-value">{metrics.optimizedRenders}</span>
            </div>
            <div className="metric">
                <span className="metric-label">昂贵计算执行次数:</span>
                <span className="metric-value">{metrics.expensiveCalculations}</span>
            </div>
            <div className="metric">
                <span className="metric-label">回调函数创建次数:</span>
                <span className="metric-value">{metrics.callbackCreations}</span>
            </div>
            <div className="metric">
                <span className="metric-label">渲染时间 (ms):</span>
                <span className="metric-value">{metrics.renderTime.toFixed(2)}</span>
            </div>
        </div>
    );
}; 