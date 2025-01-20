/**
 * 工具函数集合
 */

// 缓存管理
const CacheManager = {
    async set(key, data, ttl = 3600000) { // 默认1小时
        const item = {
            data,
            timestamp: Date.now(),
            ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    },

    get(key) {
        const item = localStorage.getItem(key);
        if (!item) return null;

        const { data, timestamp, ttl } = JSON.parse(item);
        if (Date.now() - timestamp > ttl) {
            localStorage.removeItem(key);
            return null;
        }

        return data;
    },

    remove(key) {
        localStorage.removeItem(key);
    }
};

// 性能监控
const PerformanceMonitor = {
    metrics: {
        requestCount: 0,
        totalRequestTime: 0,
        cacheHits: 0,
        cacheMisses: 0,
        batchRequests: 0,
        singleRequests: 0
    },

    startRequest() {
        this.metrics.requestCount++;
        return performance.now();
    },

    endRequest(startTime) {
        this.metrics.totalRequestTime += performance.now() - startTime;
    },

    recordCacheHit() {
        this.metrics.cacheHits++;
    },

    recordCacheMiss() {
        this.metrics.cacheMisses++;
    },

    recordBatchRequest() {
        this.metrics.batchRequests++;
    },

    recordSingleRequest() {
        this.metrics.singleRequests++;
    },

    getMetrics() {
        return {
            ...this.metrics,
            averageRequestTime: this.metrics.requestCount ? 
                (this.metrics.totalRequestTime / this.metrics.requestCount).toFixed(2) : 0,
            cacheHitRate: this.metrics.cacheHits + this.metrics.cacheMisses ?
                ((this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses)) * 100).toFixed(2) : 0
        };
    }
};

// 请求工具
const RequestUtil = {
    async fetch(url, options = {}) {
        const startTime = PerformanceMonitor.startRequest();
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            PerformanceMonitor.endRequest(startTime);
            return data;
        } catch (error) {
            PerformanceMonitor.endRequest(startTime);
            throw error;
        }
    },

    async batchFetch(urls) {
        PerformanceMonitor.recordBatchRequest();
        return Promise.all(urls.map(url => this.fetch(url)));
    }
};

// DOM工具
const DOMUtil = {
    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else {
                element.setAttribute(key, value);
            }
        });

        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });

        return element;
    },

    setLoading(element, isLoading) {
        if (isLoading) {
            element.classList.add('loading');
        } else {
            element.classList.remove('loading');
        }
    }
};

// 导出工具函数
window.utils = {
    cache: CacheManager,
    performance: PerformanceMonitor,
    request: RequestUtil,
    dom: DOMUtil
}; 