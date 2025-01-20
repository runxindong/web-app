/**
 * Service Worker
 */

const CACHE_NAME = 'network-optimization-demo-v1';
const STATIC_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/js/utils.js',
    '/js/preload.js',
    '/js/cache.js',
    '/js/batch.js',
    '/js/incremental.js',
    '/js/metrics.js',
    '/js/main.js',
    '/images/hero.jpg'
];

// 安装Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('缓存静态资源');
                return cache.addAll(STATIC_CACHE);
            })
    );
});

// 激活Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('删除旧缓存:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 处理请求
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // 如果在缓存中找到响应，则返回缓存的响应
                if (response) {
                    return response;
                }

                // 克隆请求，因为请求是一个流，只能使用一次
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(response => {
                    // 检查是否是有效的响应
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // 克隆响应，因为响应是一个流，只能使用一次
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
    );
});

// 后台同步
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(
            // 执行后台同步操作
            console.log('执行后台同步')
        );
    }
});

// 推送通知
self.addEventListener('push', (event) => {
    const options = {
        body: event.data.text(),
        icon: 'icon.png',
        badge: 'badge.png'
    };

    event.waitUntil(
        self.registration.showNotification('网络优化示例', options)
    );
});

// 通知点击
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
}); 