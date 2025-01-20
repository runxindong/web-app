import React, { useEffect, useState } from 'react';

function PerformanceMetrics() {
    const [metrics, setMetrics] = useState({
        fcp: null,
        lcp: null,
        fid: null,
        cls: null,
        ttfb: null
    });

    useEffect(() => {
        // 模拟获取性能指标 / Simulate getting performance metrics
        const simulateMetrics = () => {
            setMetrics({
                fcp: Math.round(Math.random() * 1000 + 500),  // 500-1500ms
                lcp: Math.round(Math.random() * 2000 + 1000), // 1000-3000ms
                fid: Math.round(Math.random() * 100 + 50),    // 50-150ms
                cls: (Math.random() * 0.1).toFixed(3),        // 0-0.1
                ttfb: Math.round(Math.random() * 200 + 100)   // 100-300ms
            });
        };

        // 实际应用中，使用 Performance API / In real application, use Performance API
        if ('performance' in window) {
            // First Contentful Paint
            const paintEntries = performance.getEntriesByType('paint');
            const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
            if (fcpEntry) {
                setMetrics(prev => ({ ...prev, fcp: Math.round(fcpEntry.startTime) }));
            }

            // Time to First Byte
            const navigationEntry = performance.getEntriesByType('navigation')[0];
            if (navigationEntry) {
                setMetrics(prev => ({ 
                    ...prev, 
                    ttfb: Math.round(navigationEntry.responseStart - navigationEntry.requestStart) 
                }));
            }

            // 监听 PerformanceObserver / Listen to PerformanceObserver
            if ('PerformanceObserver' in window) {
                // Largest Contentful Paint
                const lcpObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    setMetrics(prev => ({ ...prev, lcp: Math.round(lastEntry.startTime) }));
                });

                // First Input Delay
                const fidObserver = new PerformanceObserver((entryList) => {
                    const firstEntry = entryList.getEntries()[0];
                    setMetrics(prev => ({ ...prev, fid: Math.round(firstEntry.duration) }));
                });

                // Cumulative Layout Shift
                const clsObserver = new PerformanceObserver((entryList) => {
                    let clsValue = 0;
                    entryList.getEntries().forEach(entry => {
                        clsValue += entry.value;
                    });
                    setMetrics(prev => ({ ...prev, cls: clsValue.toFixed(3) }));
                });

                try {
                    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                    fidObserver.observe({ entryTypes: ['first-input'] });
                    clsObserver.observe({ entryTypes: ['layout-shift'] });
                } catch (e) {
                    console.warn('Performance API not fully supported');
                    simulateMetrics();
                }
            } else {
                simulateMetrics();
            }
        } else {
            simulateMetrics();
        }
    }, []);

    const getMetricStatus = (metric, value) => {
        if (value === null) return 'unknown';
        
        const thresholds = {
            fcp: { good: 1000, poor: 3000 },
            lcp: { good: 2500, poor: 4000 },
            fid: { good: 100, poor: 300 },
            cls: { good: 0.1, poor: 0.25 },
            ttfb: { good: 200, poor: 600 }
        };

        const threshold = thresholds[metric];
        if (!threshold) return 'unknown';

        if (value <= threshold.good) return 'good';
        if (value <= threshold.poor) return 'moderate';
        return 'poor';
    };

    return (
        <div className="performance-metrics">
            <div className={`metric-item ${getMetricStatus('fcp', metrics.fcp)}`}>
                <h3>首次内容绘制 / First Contentful Paint (FCP)</h3>
                <p className="metric-value">{metrics.fcp ? `${metrics.fcp}ms` : '计算中 / Calculating...'}</p>
            </div>

            <div className={`metric-item ${getMetricStatus('lcp', metrics.lcp)}`}>
                <h3>最大内容绘制 / Largest Contentful Paint (LCP)</h3>
                <p className="metric-value">{metrics.lcp ? `${metrics.lcp}ms` : '计算中 / Calculating...'}</p>
            </div>

            <div className={`metric-item ${getMetricStatus('fid', metrics.fid)}`}>
                <h3>首次输入延迟 / First Input Delay (FID)</h3>
                <p className="metric-value">{metrics.fid ? `${metrics.fid}ms` : '计算中 / Calculating...'}</p>
            </div>

            <div className={`metric-item ${getMetricStatus('cls', metrics.cls)}`}>
                <h3>累积布局偏移 / Cumulative Layout Shift (CLS)</h3>
                <p className="metric-value">{metrics.cls ?? '计算中 / Calculating...'}</p>
            </div>

            <div className={`metric-item ${getMetricStatus('ttfb', metrics.ttfb)}`}>
                <h3>首字节时间 / Time to First Byte (TTFB)</h3>
                <p className="metric-value">{metrics.ttfb ? `${metrics.ttfb}ms` : '计算中 / Calculating...'}</p>
            </div>

            <div className="metrics-legend">
                <div className="legend-item good">
                    <span className="legend-color"></span>
                    <span className="legend-text">良好 / Good</span>
                </div>
                <div className="legend-item moderate">
                    <span className="legend-color"></span>
                    <span className="legend-text">一般 / Moderate</span>
                </div>
                <div className="legend-item poor">
                    <span className="legend-color"></span>
                    <span className="legend-text">差 / Poor</span>
                </div>
            </div>
        </div>
    );
}

export default PerformanceMetrics; 