// 缓存统计 / Cache Statistics
let stats = {
    hits: 0,
    misses: 0,
    loadTimes: []
};

// 加载图片 / Load Image
async function loadImage(type) {
    const startTime = performance.now();
    const demoImage = document.getElementById('demoImage');
    const loadingInfo = demoImage.parentElement.querySelector('.loading-info');
    
    try {
        demoImage.parentElement.classList.add('loading');
        
        // 添加时间戳以防止缓存（仅用于演示）/ Add timestamp to prevent caching (demo only)
        const timestamp = type === 'fresh' ? `?t=${Date.now()}` : '';
        const response = await fetch(`/assets/demo-image.jpg${timestamp}`);
        
        if (!response.ok) throw new Error('Image load failed');
        
        const blob = await response.blob();
        demoImage.src = URL.createObjectURL(blob);
        
        const loadTime = performance.now() - startTime;
        stats.loadTimes.push(loadTime);
        
        if (response.headers.get('x-cache')) {
            stats.hits++;
            loadingInfo.innerHTML = `
                <span class="loading-time success">加载时间 / Load Time: ${loadTime.toFixed(2)}ms</span>
                <span class="cache-status success">从缓存加载 / Loaded from cache</span>
            `;
        } else {
            stats.misses++;
            loadingInfo.innerHTML = `
                <span class="loading-time">加载时间 / Load Time: ${loadTime.toFixed(2)}ms</span>
                <span class="cache-status">从网络加载 / Loaded from network</span>
            `;
        }
    } catch (error) {
        loadingInfo.innerHTML = `
            <span class="loading-time danger">加载失败 / Load Failed</span>
            <span class="cache-status danger">${error.message}</span>
        `;
    } finally {
        demoImage.parentElement.classList.remove('loading');
        updateStats();
    }
}

// 获取数据 / Fetch Data
async function fetchData(type) {
    const startTime = performance.now();
    const demoResult = document.querySelector('#etagDemo .demo-result');
    const responseInfo = demoResult.querySelector('.response-info');
    const loadingInfo = demoResult.querySelector('.loading-info');
    
    try {
        demoResult.classList.add('loading');
        
        const headers = new Headers();
        if (type === 'cached' && localStorage.getItem('etag')) {
            headers.append('If-None-Match', localStorage.getItem('etag'));
        }
        
        const response = await fetch('/api/data', { headers });
        const loadTime = performance.now() - startTime;
        stats.loadTimes.push(loadTime);
        
        if (response.status === 304) {
            stats.hits++;
            const cachedData = JSON.parse(localStorage.getItem('cachedData'));
            responseInfo.textContent = JSON.stringify(cachedData, null, 2);
            loadingInfo.innerHTML = `
                <span class="loading-time success">加载时间 / Load Time: ${loadTime.toFixed(2)}ms</span>
                <span class="cache-status success">使用缓存数据 / Using cached data</span>
            `;
        } else {
            stats.misses++;
            const data = await response.json();
            localStorage.setItem('cachedData', JSON.stringify(data));
            localStorage.setItem('etag', response.headers.get('ETag'));
            responseInfo.textContent = JSON.stringify(data, null, 2);
            loadingInfo.innerHTML = `
                <span class="loading-time">加载时间 / Load Time: ${loadTime.toFixed(2)}ms</span>
                <span class="cache-status">获取新数据 / Fetched fresh data</span>
            `;
        }
    } catch (error) {
        responseInfo.textContent = error.message;
        loadingInfo.innerHTML = `
            <span class="loading-time danger">加载失败 / Load Failed</span>
            <span class="cache-status danger">${error.message}</span>
        `;
    } finally {
        demoResult.classList.remove('loading');
        updateStats();
    }
}

// 获取资源 / Fetch Resource
async function fetchResource(cacheType) {
    const startTime = performance.now();
    const demoResult = document.querySelector('#cacheControlDemo .demo-result');
    const responseHeaders = demoResult.querySelector('.response-headers');
    const loadingInfo = demoResult.querySelector('.loading-info');
    
    try {
        demoResult.classList.add('loading');
        
        const response = await fetch(`/api/resource?cache=${cacheType}`);
        const loadTime = performance.now() - startTime;
        stats.loadTimes.push(loadTime);
        
        const headers = {};
        response.headers.forEach((value, key) => {
            headers[key] = value;
        });
        
        responseHeaders.textContent = JSON.stringify(headers, null, 2);
        
        if (response.headers.get('x-cache')) {
            stats.hits++;
            loadingInfo.innerHTML = `
                <span class="loading-time success">加载时间 / Load Time: ${loadTime.toFixed(2)}ms</span>
                <span class="cache-status success">从缓存加载 / Loaded from cache</span>
            `;
        } else {
            stats.misses++;
            loadingInfo.innerHTML = `
                <span class="loading-time">加载时间 / Load Time: ${loadTime.toFixed(2)}ms</span>
                <span class="cache-status">从网络加载 / Loaded from network</span>
            `;
        }
    } catch (error) {
        responseHeaders.textContent = error.message;
        loadingInfo.innerHTML = `
            <span class="loading-time danger">加载失败 / Load Failed</span>
            <span class="cache-status danger">${error.message}</span>
        `;
    } finally {
        demoResult.classList.remove('loading');
        updateStats();
    }
}

// 清除缓存 / Clear Cache
async function clearCache() {
    try {
        // 清除浏览器缓存 / Clear browser cache
        const cache = await caches.open('demo-cache');
        await cache.keys().then(keys => {
            keys.forEach(key => {
                cache.delete(key);
            });
        });
        
        // 清除本地存储 / Clear local storage
        localStorage.removeItem('etag');
        localStorage.removeItem('cachedData');
        
        // 重置统计 / Reset statistics
        stats = {
            hits: 0,
            misses: 0,
            loadTimes: []
        };
        
        updateStats();
        
        alert('缓存已清除 / Cache cleared');
    } catch (error) {
        alert(`清除缓存失败 / Cache clear failed: ${error.message}`);
    }
}

// 更新统计 / Update Statistics
function updateStats() {
    document.getElementById('cacheHits').textContent = stats.hits;
    document.getElementById('cacheMisses').textContent = stats.misses;
    
    if (stats.loadTimes.length > 0) {
        const avgTime = stats.loadTimes.reduce((a, b) => a + b) / stats.loadTimes.length;
        document.getElementById('avgLoadTime').textContent = `${avgTime.toFixed(2)}ms`;
    }
}

// 刷新统计 / Refresh Statistics
function refreshStats() {
    updateStats();
}

// 初始化 / Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
}); 