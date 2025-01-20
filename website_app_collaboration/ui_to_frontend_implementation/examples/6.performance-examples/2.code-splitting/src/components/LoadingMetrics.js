import React from 'react';

function LoadingMetrics({ data }) {
    const { firstContentfulPaint, timeToInteractive, totalBlockingTime } = data;

    const getMetricStatus = (metric, value) => {
        const thresholds = {
            firstContentfulPaint: { good: 1000, poor: 3000 },
            timeToInteractive: { good: 3000, poor: 7500 },
            totalBlockingTime: { good: 200, poor: 600 }
        };

        const threshold = thresholds[metric];
        if (!threshold) return 'unknown';

        const numericValue = parseInt(value);
        if (numericValue <= threshold.good) return 'good';
        if (numericValue <= threshold.poor) return 'moderate';
        return 'poor';
    };

    const getMetricDescription = (metric, status) => {
        const descriptions = {
            firstContentfulPaint: {
                good: '页面加载速度快 / Page loads quickly',
                moderate: '页面加载速度一般 / Page loads moderately fast',
                poor: '页面加载速度慢 / Page loads slowly'
            },
            timeToInteractive: {
                good: '页面快速可交互 / Page becomes interactive quickly',
                moderate: '页面可交互性一般 / Page interactivity is moderate',
                poor: '页面可交互性差 / Page takes too long to become interactive'
            },
            totalBlockingTime: {
                good: '页面响应及时 / Page responds promptly',
                moderate: '页面响应一般 / Page response is moderate',
                poor: '页面响应延迟 / Page response is delayed'
            }
        };

        return descriptions[metric]?.[status] || '未知状态 / Unknown status';
    };

    return (
        <div className="loading-metrics">
            <div className="metrics-header">
                <h3>加载指标 / Loading Metrics</h3>
                <p>
                    监控关键性能指标
                    Monitor key performance metrics
                </p>
            </div>

            <div className="metrics-grid">
                <div className={`metric-card ${getMetricStatus('firstContentfulPaint', firstContentfulPaint)}`}>
                    <h4>首次内容绘制 / First Contentful Paint</h4>
                    <p className="metric-value">{firstContentfulPaint}</p>
                    <p className="metric-description">
                        {getMetricDescription('firstContentfulPaint', 
                            getMetricStatus('firstContentfulPaint', firstContentfulPaint))}
                    </p>
                </div>

                <div className={`metric-card ${getMetricStatus('timeToInteractive', timeToInteractive)}`}>
                    <h4>可交互时间 / Time to Interactive</h4>
                    <p className="metric-value">{timeToInteractive}</p>
                    <p className="metric-description">
                        {getMetricDescription('timeToInteractive',
                            getMetricStatus('timeToInteractive', timeToInteractive))}
                    </p>
                </div>

                <div className={`metric-card ${getMetricStatus('totalBlockingTime', totalBlockingTime)}`}>
                    <h4>总阻塞时间 / Total Blocking Time</h4>
                    <p className="metric-value">{totalBlockingTime}</p>
                    <p className="metric-description">
                        {getMetricDescription('totalBlockingTime',
                            getMetricStatus('totalBlockingTime', totalBlockingTime))}
                    </p>
                </div>
            </div>

            <div className="metrics-summary">
                <h4>性能总结 / Performance Summary</h4>
                <ul>
                    <li>
                        首次内容绘制时间
                        First Contentful Paint time:{' '}
                        <span className={getMetricStatus('firstContentfulPaint', firstContentfulPaint)}>
                            {firstContentfulPaint}
                        </span>
                    </li>
                    <li>
                        可交互时间
                        Time to Interactive:{' '}
                        <span className={getMetricStatus('timeToInteractive', timeToInteractive)}>
                            {timeToInteractive}
                        </span>
                    </li>
                    <li>
                        总阻塞时间
                        Total Blocking Time:{' '}
                        <span className={getMetricStatus('totalBlockingTime', totalBlockingTime)}>
                            {totalBlockingTime}
                        </span>
                    </li>
                </ul>
            </div>

            <div className="optimization-tips">
                <h4>优化建议 / Optimization Tips</h4>
                <ul>
                    {parseInt(firstContentfulPaint) > 1000 && (
                        <li>
                            考虑优化首次内容加载
                            Consider optimizing initial content loading
                        </li>
                    )}
                    {parseInt(timeToInteractive) > 3000 && (
                        <li>
                            减少JavaScript执行时间
                            Reduce JavaScript execution time
                        </li>
                    )}
                    {parseInt(totalBlockingTime) > 200 && (
                        <li>
                            优化主线程任务
                            Optimize main thread tasks
                        </li>
                    )}
                </ul>
            </div>

            <div className="legend">
                <div className="legend-item good">
                    <span className="legend-color"></span>
                    <span>良好 / Good</span>
                </div>
                <div className="legend-item moderate">
                    <span className="legend-color"></span>
                    <span>一般 / Moderate</span>
                </div>
                <div className="legend-item poor">
                    <span className="legend-color"></span>
                    <span>差 / Poor</span>
                </div>
            </div>
        </div>
    );
}

export default LoadingMetrics; 