/**
 * 防抖函数
 * @param {Function} func 需要防抖的函数
 * @param {number} wait 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 节流函数
 * @param {Function} func 需要节流的函数
 * @param {number} limit 限制时间（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

/**
 * 模拟API调用
 * @param {string} query 搜索查询
 * @returns {Promise} 返回搜索结果
 */
function mockApiCall(query) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const results = [
                `结果 1 for "${query}"`,
                `结果 2 for "${query}"`,
                `结果 3 for "${query}"`
            ];
            resolve(results);
        }, 300);
    });
}

/**
 * 生成随机颜色
 * @returns {string} 随机颜色的十六进制代码
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * 性能监控类
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            apiCalls: 0,
            scrollEvents: 0,
            resizeEvents: 0
        };
    }

    incrementApiCalls() {
        this.metrics.apiCalls++;
        this.updateMetric('apiCallCount', this.metrics.apiCalls);
    }

    incrementScrollEvents() {
        this.metrics.scrollEvents++;
        this.updateMetric('scrollHandleCount', this.metrics.scrollEvents);
    }

    incrementResizeEvents() {
        this.metrics.resizeEvents++;
        this.updateMetric('resizeCount', this.metrics.resizeEvents);
    }

    updateMetric(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
            element.classList.add('highlight');
            setTimeout(() => {
                element.classList.remove('highlight');
            }, 500);
        }
    }
}

// 导出工具函数
window.utils = {
    debounce,
    throttle,
    mockApiCall,
    getRandomColor,
    PerformanceMonitor
}; 