// 缓存统计 / Cache Statistics
const stats = {
    dataHits: 0,
    computeHits: 0,
    lruHits: 0,
    memoryUsage: 0
};

// 数据缓存 / Data Cache
const dataCache = new Map();

// 计算结果缓存 / Computation Cache
const computationCache = new Map();

// LRU 缓存类 / LRU Cache Class
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
        this.keys = [];
    }

    get(key) {
        if (this.cache.has(key)) {
            // 更新访问顺序 / Update access order
            this.keys = this.keys.filter(k => k !== key);
            this.keys.push(key);
            stats.lruHits++;
            return this.cache.get(key);
        }
        return null;
    }

    put(key, value) {
        if (this.cache.has(key)) {
            // 更新现有键 / Update existing key
            this.cache.set(key, value);
            this.keys = this.keys.filter(k => k !== key);
            this.keys.push(key);
        } else {
            // 添加新键 / Add new key
            if (this.keys.length >= this.capacity) {
                const oldestKey = this.keys.shift();
                this.cache.delete(oldestKey);
            }
            this.cache.set(key, value);
            this.keys.push(key);
        }
    }

    clear() {
        this.cache.clear();
        this.keys = [];
    }

    getEntries() {
        return this.keys.map(key => ({
            key,
            value: this.cache.get(key),
            isNewest: key === this.keys[this.keys.length - 1],
            isOldest: key === this.keys[0]
        }));
    }
}

// 创建 LRU 缓存实例 / Create LRU Cache instance
let lruCache = new LRUCache(5);

// 获取带缓存的数据 / Fetch Data with Cache
async function fetchDataWithCache(type) {
    const dataDisplay = document.querySelector('#dataCache .data-display');
    const fetchTime = document.querySelector('#dataCache .fetch-time');
    const cacheStatus = document.querySelector('#dataCache .cache-status');
    
    try {
        const startTime = performance.now();
        let data;
        
        if (type === 'cached' && dataCache.has('testData')) {
            data = dataCache.get('testData');
            stats.dataHits++;
            cacheStatus.textContent = '从缓存获取 / Retrieved from cache';
            cacheStatus.className = 'cache-status success';
        } else {
            // 模拟 API 请求 / Simulate API request
            await new Promise(resolve => setTimeout(resolve, 1000));
            data = {
                id: Date.now(),
                value: Math.random(),
                timestamp: new Date().toISOString()
            };
            dataCache.set('testData', data);
            cacheStatus.textContent = '从网络获取 / Retrieved from network';
            cacheStatus.className = 'cache-status';
        }
        
        const endTime = performance.now();
        dataDisplay.textContent = JSON.stringify(data, null, 2);
        fetchTime.textContent = `加载时间 / Load Time: ${(endTime - startTime).toFixed(2)}ms`;
        
        updateStats();
    } catch (error) {
        dataDisplay.textContent = `错误 / Error: ${error.message}`;
        cacheStatus.textContent = '获取失败 / Fetch failed';
        cacheStatus.className = 'cache-status danger';
    }
}

// 使用缓存计算 / Compute with Cache
function computeWithCache() {
    const input = document.getElementById('computeInput');
    const resultValue = document.querySelector('#computationCache .result-value');
    const computationTime = document.querySelector('#computationCache .computation-time');
    const cacheStatus = document.querySelector('#computationCache .cache-status');
    
    const number = parseInt(input.value);
    const startTime = performance.now();
    
    try {
        let result;
        if (computationCache.has(number)) {
            result = computationCache.get(number);
            stats.computeHits++;
            cacheStatus.textContent = '从缓存获取 / Retrieved from cache';
            cacheStatus.className = 'cache-status success';
        } else {
            // 模拟复杂计算 / Simulate complex computation
            result = calculateFibonacci(number);
            computationCache.set(number, result);
            cacheStatus.textContent = '新计算 / Newly computed';
            cacheStatus.className = 'cache-status';
        }
        
        const endTime = performance.now();
        resultValue.textContent = result;
        computationTime.textContent = `计算时间 / Computation Time: ${(endTime - startTime).toFixed(2)}ms`;
        
        updateStats();
    } catch (error) {
        resultValue.textContent = '错误 / Error';
        cacheStatus.textContent = '计算失败 / Computation failed';
        cacheStatus.className = 'cache-status danger';
    }
}

// 斐波那契数列计算 / Fibonacci Calculation
function calculateFibonacci(n) {
    if (n <= 1) return n;
    let prev = 0, curr = 1;
    for (let i = 2; i <= n; i++) {
        const next = prev + curr;
        prev = curr;
        curr = next;
    }
    return curr;
}

// 添加到 LRU 缓存 / Add to LRU Cache
function addToLRUCache() {
    const key = Date.now().toString();
    const value = Math.random().toString(36).substring(7);
    
    lruCache.put(key, value);
    updateLRUVisualization();
    updateStats();
}

// 从 LRU 缓存获取 / Get from LRU Cache
function getFromLRUCache() {
    const entries = lruCache.getEntries();
    if (entries.length > 0) {
        const randomIndex = Math.floor(Math.random() * entries.length);
        const entry = entries[randomIndex];
        lruCache.get(entry.key);
        updateLRUVisualization();
        updateStats();
    }
}

// 更新 LRU 可视化 / Update LRU Visualization
function updateLRUVisualization() {
    const cacheEntries = document.querySelector('.cache-entries');
    const entries = lruCache.getEntries();
    
    cacheEntries.innerHTML = entries.map(entry => `
        <div class="cache-entry ${entry.isNewest ? 'most-recent' : ''} ${entry.isOldest ? 'least-recent' : ''}">
            <span class="entry-key">${entry.key}</span>
            <span class="entry-value">${entry.value}</span>
        </div>
    `).join('');
}

// 清除数据缓存 / Clear Data Cache
function clearDataCache() {
    dataCache.clear();
    document.querySelector('#dataCache .data-display').textContent = '';
    document.querySelector('#dataCache .cache-status').textContent = '缓存已清除 / Cache cleared';
    updateStats();
}

// 清除计算缓存 / Clear Computation Cache
function clearComputationCache() {
    computationCache.clear();
    document.querySelector('#computationCache .result-value').textContent = '-';
    document.querySelector('#computationCache .cache-status').textContent = '缓存已清除 / Cache cleared';
    updateStats();
}

// 清除 LRU 缓存 / Clear LRU Cache
function clearLRUCache() {
    lruCache.clear();
    updateLRUVisualization();
    updateStats();
}

// 清除所有缓存 / Clear All Caches
function clearAllCaches() {
    clearDataCache();
    clearComputationCache();
    clearLRUCache();
}

// 更新统计信息 / Update Statistics
function updateStats() {
    document.getElementById('dataHits').textContent = stats.dataHits;
    document.getElementById('computeHits').textContent = stats.computeHits;
    document.getElementById('lruHits').textContent = stats.lruHits;
    
    // 计算内存使用 / Calculate memory usage
    const totalEntries = 
        dataCache.size + 
        computationCache.size + 
        lruCache.cache.size;
    
    const estimatedSize = totalEntries * 100; // 假设每个条目平均 100 字节 / Assume average 100 bytes per entry
    document.getElementById('memoryUsage').textContent = `${(estimatedSize / 1024).toFixed(2)} KB`;
}

// 刷新统计 / Refresh Statistics
function refreshStats() {
    updateStats();
}

// 初始化 / Initialize
document.addEventListener('DOMContentLoaded', () => {
    // 设置初始 LRU 缓存大小 / Set initial LRU cache size
    const lruSizeInput = document.getElementById('lruSize');
    lruSizeInput.addEventListener('change', () => {
        const newSize = parseInt(lruSizeInput.value);
        if (newSize > 0) {
            const oldEntries = lruCache.getEntries();
            lruCache = new LRUCache(newSize);
            // 保留最新的条目 / Keep the newest entries
            oldEntries.slice(-newSize).forEach(entry => {
                lruCache.put(entry.key, entry.value);
            });
            updateLRUVisualization();
            updateStats();
        }
    });
    
    updateStats();
}); 