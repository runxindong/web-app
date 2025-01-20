/**
 * 性能指标监控
 */

(() => {
    const performanceMetrics = document.getElementById('performanceMetrics');

    // 更新性能指标显示
    const updateMetrics = () => {
        const metrics = utils.performance.getMetrics();
        
        performanceMetrics.innerHTML = `
            <div class="fade-in">
                <h3>网络性能指标</h3>
                
                <div class="metric">
                    <span class="metric-label">总请求次数:</span>
                    <span class="metric-value">${metrics.requestCount}</span>
                </div>
                
                <div class="metric">
                    <span class="metric-label">平均请求时间:</span>
                    <span class="metric-value">${metrics.averageRequestTime}ms</span>
                </div>
                
                <div class="metric">
                    <span class="metric-label">缓存命中率:</span>
                    <span class="metric-value">${metrics.cacheHitRate}%</span>
                </div>
                
                <div class="metric">
                    <span class="metric-label">缓存命中次数:</span>
                    <span class="metric-value">${metrics.cacheHits}</span>
                </div>
                
                <div class="metric">
                    <span class="metric-label">缓存未命中次数:</span>
                    <span class="metric-value">${metrics.cacheMisses}</span>
                </div>
                
                <div class="metric">
                    <span class="metric-label">批量请求次数:</span>
                    <span class="metric-value">${metrics.batchRequests}</span>
                </div>
                
                <div class="metric">
                    <span class="metric-label">单独请求次数:</span>
                    <span class="metric-value">${metrics.singleRequests}</span>
                </div>
            </div>
        `;
    };

    // 定期更新指标
    const startMetricsUpdate = () => {
        updateMetrics();
        setInterval(updateMetrics, 1000);
    };

    // 收集导航计时指标
    const collectNavigationTiming = () => {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const navigationStart = timing.navigationStart;

            const timingMetrics = {
                // DNS查询时间
                dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
                
                // TCP连接时间
                tcpTime: timing.connectEnd - timing.connectStart,
                
                // 首字节时间
                ttfb: timing.responseStart - timing.navigationStart,
                
                // DOM加载时间
                domLoadTime: timing.domContentLoadedEventEnd - timing.navigationStart,
                
                // 页面完全加载时间
                loadTime: timing.loadEventEnd - timing.navigationStart
            };

            // 添加导航计时指标
            const timingElement = utils.dom.createElement('div', {
                className: 'fade-in'
            }, [
                '<h3>页面加载指标</h3>',
                ...Object.entries(timingMetrics).map(([key, value]) => `
                    <div class="metric">
                        <span class="metric-label">${key}:</span>
                        <span class="metric-value">${value}ms</span>
                    </div>
                `).join('')
            ]);

            performanceMetrics.appendChild(timingElement);
        }
    };

    // 收集资源计时指标
    const collectResourceTiming = () => {
        if (window.performance && window.performance.getEntriesByType) {
            const resources = window.performance.getEntriesByType('resource');
            
            const resourceStats = {
                total: resources.length,
                totalDuration: 0,
                types: {}
            };

            resources.forEach(resource => {
                const duration = resource.duration;
                const type = resource.initiatorType;

                resourceStats.totalDuration += duration;
                resourceStats.types[type] = (resourceStats.types[type] || 0) + 1;
            });

            // 添加资源计时指标
            const resourceElement = utils.dom.createElement('div', {
                className: 'fade-in'
            }, [
                '<h3>资源加载指标</h3>',
                `<div class="metric">
                    <span class="metric-label">总资源数:</span>
                    <span class="metric-value">${resourceStats.total}</span>
                </div>`,
                `<div class="metric">
                    <span class="metric-label">总加载时间:</span>
                    <span class="metric-value">${resourceStats.totalDuration.toFixed(2)}ms</span>
                </div>`,
                '<h4>资源类型统计</h4>',
                ...Object.entries(resourceStats.types).map(([type, count]) => `
                    <div class="metric">
                        <span class="metric-label">${type}:</span>
                        <span class="metric-value">${count}</span>
                    </div>
                `).join('')
            ]);

            performanceMetrics.appendChild(resourceElement);
        }
    };

    // 页面加载完成后收集性能指标
    window.addEventListener('load', () => {
        startMetricsUpdate();
        // 等待一段时间后收集导航和资源计时指标
        setTimeout(() => {
            collectNavigationTiming();
            collectResourceTiming();
        }, 0);
    });
})(); 