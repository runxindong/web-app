// Service Worker 注册 / Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker 注册成功 / Service Worker registered:', registration);
                updateServiceWorkerInfo(registration);
            })
            .catch(error => {
                console.error('Service Worker 注册失败 / Service Worker registration failed:', error);
                updateServiceWorkerStatus('注册失败 / Registration failed');
            });
    });
}

// 更新 Service Worker 信息 / Update Service Worker Information
function updateServiceWorkerInfo(registration) {
    const swStatus = document.getElementById('swStatus');
    const swVersion = document.getElementById('swVersion');
    
    // 更新状态 / Update status
    if (registration.active) {
        swStatus.textContent = '活动 / Active';
        swStatus.className = 'success';
    } else if (registration.installing) {
        swStatus.textContent = '安装中 / Installing';
        swStatus.className = 'warning';
    } else if (registration.waiting) {
        swStatus.textContent = '等待中 / Waiting';
        swStatus.className = 'warning';
    }
    
    // 获取版本 / Get version
    registration.active?.postMessage({ type: 'GET_VERSION' });
}

// 更新 Service Worker 状态 / Update Service Worker Status
function updateServiceWorkerStatus(status) {
    const swStatus = document.getElementById('swStatus');
    swStatus.textContent = status;
}

// 检查网络状态 / Check Network Status
function checkNetworkStatus() {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    function updateStatus() {
        if (navigator.onLine) {
            statusIndicator.classList.add('online');
            statusIndicator.classList.remove('offline');
            statusText.textContent = '在线 / Online';
        } else {
            statusIndicator.classList.add('offline');
            statusIndicator.classList.remove('online');
            statusText.textContent = '离线 / Offline';
        }
    }
    
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
}

// 测试离线访问 / Test Offline Access
async function testOfflineAccess() {
    const button = event.target;
    button.disabled = true;
    
    try {
        // 模拟离线状态 / Simulate offline state
        await fetch('/test-offline');
        alert('资源可以离线访问 / Resource is available offline');
    } catch (error) {
        alert('资源无法离线访问 / Resource is not available offline');
    } finally {
        button.disabled = false;
    }
}

// 清除 Service Worker 缓存 / Clear Service Worker Cache
async function clearServiceWorkerCache() {
    const button = event.target;
    button.disabled = true;
    
    try {
        const registration = await navigator.serviceWorker.ready;
        await registration.active.postMessage({ type: 'CLEAR_CACHE' });
        alert('缓存已清除 / Cache cleared');
        updateCacheSize();
    } catch (error) {
        alert('清除缓存失败 / Failed to clear cache');
        console.error(error);
    } finally {
        button.disabled = false;
    }
}

// 检查预缓存状态 / Check Precache Status
async function checkPrecacheStatus() {
    const precacheList = document.getElementById('precacheList');
    
    try {
        const cache = await caches.open('demo-cache-v1');
        const keys = await cache.keys();
        
        precacheList.innerHTML = keys.map(request => `
            <li>
                ${request.url}
                <span class="success">✓</span>
            </li>
        `).join('');
        
        if (keys.length === 0) {
            precacheList.innerHTML = '<li>没有缓存项 / No cached items</li>';
        }
    } catch (error) {
        precacheList.innerHTML = `<li class="danger">检查失败 / Check failed: ${error.message}</li>`;
    }
}

// 更新预缓存 / Update Precache
async function updatePrecache() {
    const button = event.target;
    button.disabled = true;
    
    try {
        const registration = await navigator.serviceWorker.ready;
        await registration.update();
        alert('预缓存已更新 / Precache updated');
        checkPrecacheStatus();
    } catch (error) {
        alert('更新预缓存失败 / Failed to update precache');
        console.error(error);
    } finally {
        button.disabled = false;
    }
}

// 加载图片 / Load Image
async function loadImage() {
    const imageContainer = document.querySelector('.image-container');
    const demoImage = document.getElementById('demoImage');
    
    try {
        imageContainer.classList.add('loading');
        const response = await fetch('/assets/demo-image.jpg');
        const blob = await response.blob();
        demoImage.src = URL.createObjectURL(blob);
    } catch (error) {
        console.error('加载图片失败 / Failed to load image:', error);
    } finally {
        imageContainer.classList.remove('loading');
    }
}

// 获取数据 / Fetch Data
async function fetchData() {
    const apiData = document.getElementById('apiData');
    const container = apiData.parentElement;
    
    try {
        container.classList.add('loading');
        const response = await fetch('/api/data');
        const data = await response.json();
        apiData.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        apiData.textContent = `错误 / Error: ${error.message}`;
    } finally {
        container.classList.remove('loading');
    }
}

// 注册后台同步 / Register Background Sync
async function registerSync() {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        try {
            const registration = await navigator.serviceWorker.ready;
            await registration.sync.register('cache-update');
            
            const syncIndicator = document.querySelector('.sync-indicator');
            syncIndicator.classList.add('syncing');
            
            setTimeout(() => {
                syncIndicator.classList.remove('syncing');
                syncIndicator.classList.add('synced');
            }, 2000);
        } catch (error) {
            alert('注册同步失败 / Failed to register sync');
            console.error(error);
        }
    } else {
        alert('浏览器不支持后台同步 / Browser does not support background sync');
    }
}

// 检查同步状态 / Check Sync Status
async function checkSyncStatus() {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        try {
            const registration = await navigator.serviceWorker.ready;
            const tags = await registration.sync.getTags();
            
            const syncIndicator = document.querySelector('.sync-indicator');
            if (tags.includes('cache-update')) {
                syncIndicator.classList.add('syncing');
            } else {
                syncIndicator.classList.remove('syncing');
                syncIndicator.classList.add('synced');
            }
        } catch (error) {
            console.error('检查同步状态失败 / Failed to check sync status:', error);
        }
    }
}

// 注销 Service Worker / Unregister Service Worker
async function unregisterServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.ready;
        const result = await registration.unregister();
        
        if (result) {
            alert('Service Worker 已注销 / Service Worker unregistered');
            updateServiceWorkerStatus('已注销 / Unregistered');
        } else {
            alert('注销失败 / Unregister failed');
        }
    } catch (error) {
        alert('注销失败 / Unregister failed');
        console.error(error);
    }
}

// 跳过等待 / Skip Waiting
async function skipWaiting() {
    const registration = await navigator.serviceWorker.ready;
    if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
}

// 更新缓存大小 / Update Cache Size
async function updateCacheSize() {
    const cacheSizeElement = document.getElementById('cacheSize');
    
    try {
        const cache = await caches.open('demo-cache-v1');
        const keys = await cache.keys();
        const size = keys.length;
        cacheSizeElement.textContent = `${size} 个项目 / ${size} items`;
    } catch (error) {
        cacheSizeElement.textContent = '计算失败 / Calculation failed';
    }
}

// 初始化 / Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkNetworkStatus();
    checkPrecacheStatus();
    updateCacheSize();
    
    // 定期更新信息 / Periodically update information
    setInterval(() => {
        updateCacheSize();
        checkSyncStatus();
    }, 5000);
}); 