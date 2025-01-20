// 常量定义 / Constants
const CACHE_VERSION = 'v1';
const CACHE_NAME = `demo-cache-${CACHE_VERSION}`;
const SYNC_TAG = 'demo-sync';
const API_URL = 'https://api.example.com'; // 示例 API URL / Example API URL

// 要缓存的资源 / Resources to cache
const CACHE_URLS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/images/test-image.jpg'
];

// Service Worker 注册 / Service Worker Registration
async function registerServiceWorker() {
    try {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.register('service-worker.js');
            console.log('Service Worker 注册成功 / Service Worker registered:', registration);
            updateStatus('active');
            updateWorkerInfo(registration);
        } else {
            console.log('浏览器不支持 Service Worker / Browser does not support Service Worker');
            updateStatus('error');
        }
    } catch (error) {
        console.error('Service Worker 注册失败 / Service Worker registration failed:', error);
        updateStatus('error');
    }
}

// 更新状态指示器 / Update Status Indicator
function updateStatus(status) {
    const indicator = document.querySelector('.status-indicator');
    const text = document.querySelector('.status-text');

    indicator.className = 'status-indicator';
    indicator.classList.add(status);

    switch (status) {
        case 'active':
            text.textContent = '已激活 / Active';
            break;
        case 'error':
            text.textContent = '错误 / Error';
            break;
        default:
            text.textContent = '检查中... / Checking...';
    }
}

// 更新 Worker 信息 / Update Worker Information
function updateWorkerInfo(registration) {
    const status = document.querySelector('.worker-status');
    const scope = document.querySelector('.worker-scope');
    const version = document.querySelector('.worker-version');

    status.textContent = registration.active ? '活动 / Active' : '等待 / Waiting';
    scope.textContent = registration.scope;
    version.textContent = CACHE_VERSION;
}

// 缓存管理 / Cache Management
async function updateCache() {
    try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(CACHE_URLS);
        console.log('缓存更新成功 / Cache updated successfully');
        loadCachedResources();
    } catch (error) {
        console.error('缓存更新失败 / Cache update failed:', error);
    }
}

async function clearCache() {
    try {
        await caches.delete(CACHE_NAME);
        console.log('缓存清除成功 / Cache cleared successfully');
        loadCachedResources();
    } catch (error) {
        console.error('缓存清除失败 / Cache clear failed:', error);
    }
}

async function loadCachedResources() {
    const listContainer = document.querySelector('.resource-list .list-container');
    listContainer.innerHTML = '';

    try {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();

        for (const request of keys) {
            const element = document.createElement('div');
            element.className = 'list-item';
            element.innerHTML = `
                <span>${request.url}</span>
                <button onclick="removeCachedResource('${request.url}')">
                    删除 / Delete
                </button>
            `;
            listContainer.appendChild(element);
        }

        if (keys.length === 0) {
            listContainer.innerHTML = '<div class="empty-message">无缓存资源 / No cached resources</div>';
        }
    } catch (error) {
        console.error('加载缓存资源失败 / Failed to load cached resources:', error);
        listContainer.innerHTML = '<div class="error">加载失败 / Load failed</div>';
    }
}

async function removeCachedResource(url) {
    try {
        const cache = await caches.open(CACHE_NAME);
        await cache.delete(url);
        console.log('资源删除成功 / Resource deleted successfully');
        loadCachedResources();
    } catch (error) {
        console.error('资源删除失败 / Resource deletion failed:', error);
    }
}

// 离线功能测试 / Offline Feature Testing
function testOffline() {
    const networkIndicator = document.querySelector('.network-indicator');
    const networkText = document.querySelector('.network-text');

    if (navigator.onLine) {
        networkIndicator.classList.remove('offline');
        networkText.textContent = '在线 / Online';
    } else {
        networkIndicator.classList.add('offline');
        networkText.textContent = '离线 / Offline';
    }
}

async function loadImage() {
    const img = document.querySelector('.test-image');
    try {
        const response = await fetch(img.src);
        if (response.ok) {
            console.log('图片加载成功 / Image loaded successfully');
        }
    } catch (error) {
        console.error('图片加载失败 / Image load failed:', error);
    }
}

// 后台同步 / Background Sync
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;

    if (!message) {
        alert('请输入消息 / Please enter a message');
        return;
    }

    try {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            const registration = await navigator.serviceWorker.ready;
            await registration.sync.register(SYNC_TAG);
            messageInput.value = '';
            updateSyncStatus('等待同步 / Waiting for sync');
        } else {
            // 立即发送 / Send immediately
            await sendMessageToServer(message);
            messageInput.value = '';
            updateSyncStatus('已发送 / Sent');
        }
    } catch (error) {
        console.error('消息发送失败 / Message send failed:', error);
        updateSyncStatus('发送失败 / Send failed');
    }
}

async function sendMessageToServer(message) {
    try {
        const response = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error('发送失败 / Send failed');
        }

        return response.json();
    } catch (error) {
        throw error;
    }
}

function updateSyncStatus(status) {
    const statusList = document.querySelector('.status-list');
    const element = document.createElement('div');
    element.className = 'status-item';
    element.textContent = `${new Date().toLocaleTimeString()}: ${status}`;
    statusList.insertBefore(element, statusList.firstChild);
}

// 推送通知 / Push Notifications
async function requestNotificationPermission() {
    try {
        const permission = await Notification.requestPermission();
        updatePermissionStatus(permission);

        if (permission === 'granted') {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
            });

            // 发送订阅信息到服务器 / Send subscription to server
            await sendSubscriptionToServer(subscription);
        }
    } catch (error) {
        console.error('请求通知权限失败 / Failed to request notification permission:', error);
    }
}

function updatePermissionStatus(permission) {
    const permissionText = document.querySelector('.permission-text');
    switch (permission) {
        case 'granted':
            permissionText.textContent = '已允许 / Granted';
            break;
        case 'denied':
            permissionText.textContent = '已拒绝 / Denied';
            break;
        default:
            permissionText.textContent = '未请求 / Not requested';
    }
}

async function sendTestNotification() {
    if (Notification.permission === 'granted') {
        try {
            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification('测试通知 / Test Notification', {
                body: '这是一条测试通知 / This is a test notification',
                icon: '/images/icon.png',
                badge: '/images/badge.png',
                vibrate: [200, 100, 200]
            });
        } catch (error) {
            console.error('发送通知失败 / Failed to send notification:', error);
        }
    } else {
        alert('请先允许通知权限 / Please allow notification permission first');
    }
}

// Service Worker 管理 / Service Worker Management
async function unregisterServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.ready;
        const result = await registration.unregister();
        if (result) {
            console.log('Service Worker 注销成功 / Service Worker unregistered');
            updateStatus('error');
        }
    } catch (error) {
        console.error('Service Worker 注销失败 / Service Worker unregister failed:', error);
    }
}

async function skipWaiting() {
    try {
        const registration = await navigator.serviceWorker.ready;
        if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
    } catch (error) {
        console.error('跳过等待失败 / Skip waiting failed:', error);
    }
}

// 工具函数 / Utility Functions
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// 事件监听器 / Event Listeners
window.addEventListener('load', () => {
    registerServiceWorker();
    loadCachedResources();
    testOffline();
    updatePermissionStatus(Notification.permission);
});

window.addEventListener('online', testOffline);
window.addEventListener('offline', testOffline); 