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

// 安装事件 / Install Event
self.addEventListener('install', (event) => {
    console.log('Service Worker 安装中... / Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('缓存资源中... / Caching resources...');
                return cache.addAll(CACHE_URLS);
            })
            .then(() => {
                console.log('资源缓存完成 / Resources cached');
                return self.skipWaiting();
            })
    );
});

// 激活事件 / Activate Event
self.addEventListener('activate', (event) => {
    console.log('Service Worker 激活中... / Service Worker activating...');

    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('删除旧缓存... / Removing old cache...', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker 已激活 / Service Worker activated');
                return self.clients.claim();
            })
    );
});

// 请求拦截 / Fetch Event
self.addEventListener('fetch', (event) => {
    console.log('拦截请求 / Intercepting request:', event.request.url);

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('从缓存返回 / Returning from cache:', event.request.url);
                    return response;
                }

                console.log('从网络获取 / Fetching from network:', event.request.url);
                return fetch(event.request)
                    .then(response => {
                        // 检查是否有效响应 / Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // 克隆响应 / Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                console.log('缓存新响应 / Caching new response:', event.request.url);
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(error => {
                        console.error('请求失败 / Request failed:', error);
                        // 可以返回自定义的离线页面 / Can return custom offline page
                        return caches.match('/offline.html');
                    });
            })
    );
});

// 后台同步 / Background Sync
self.addEventListener('sync', (event) => {
    console.log('同步事件触发 / Sync event triggered:', event.tag);

    if (event.tag === SYNC_TAG) {
        event.waitUntil(
            // 从 IndexedDB 获取待发送的消息 / Get pending messages from IndexedDB
            getPendingMessages()
                .then(messages => {
                    return Promise.all(
                        messages.map(message => {
                            return fetch(`${API_URL}/messages`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(message)
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('发送失败 / Send failed');
                                }
                                // 从 IndexedDB 删除已发送的消息 / Remove sent message from IndexedDB
                                return deletePendingMessage(message.id);
                            });
                        })
                    );
                })
                .catch(error => {
                    console.error('同步失败 / Sync failed:', error);
                    throw error;
                })
        );
    }
});

// 推送通知 / Push Notification
self.addEventListener('push', (event) => {
    console.log('收到推送 / Push received');

    const options = {
        body: event.data.text(),
        icon: '/images/icon.png',
        badge: '/images/badge.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: '查看 / View',
                icon: '/images/checkmark.png'
            },
            {
                action: 'close',
                title: '关闭 / Close',
                icon: '/images/xmark.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('新消息 / New Message', options)
    );
});

// 通知点击 / Notification Click
self.addEventListener('notificationclick', (event) => {
    console.log('通知点击 / Notification clicked');

    event.notification.close();

    if (event.action === 'explore') {
        // 打开相应的页面 / Open corresponding page
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// 消息处理 / Message Handling
self.addEventListener('message', (event) => {
    console.log('收到消息 / Message received:', event.data);

    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// 工具函数 / Utility Functions
function getPendingMessages() {
    // 这里应该实现从 IndexedDB 获取待发送消息的逻辑
    // Should implement logic to get pending messages from IndexedDB
    return Promise.resolve([]);
}

function deletePendingMessage(id) {
    // 这里应该实现从 IndexedDB 删除已发送消息的逻辑
    // Should implement logic to delete sent message from IndexedDB
    return Promise.resolve();
}

// 错误处理 / Error Handling
self.addEventListener('error', (event) => {
    console.error('Service Worker 错误 / Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的 Promise 拒绝 / Unhandled Promise rejection:', event.reason);
}); 