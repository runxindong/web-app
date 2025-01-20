// 缓存版本 / Cache version
const CACHE_VERSION = 'v1';
const CACHE_NAME = `demo-cache-${CACHE_VERSION}`;

// 预缓存资源 / Resources to precache
const PRECACHE_RESOURCES = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/assets/logo.png',
    '/assets/icon.png'
];

// 运行时缓存策略 / Runtime caching strategies
const RUNTIME_CACHE_RULES = [
    {
        urlPattern: /\/api\/data/,
        strategy: 'network-first'
    },
    {
        urlPattern: /\.(png|jpg|jpeg|gif|svg)$/,
        strategy: 'cache-first'
    },
    {
        urlPattern: /\/api\/dynamic/,
        strategy: 'stale-while-revalidate'
    }
];

// 安装事件 / Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('预缓存资源 / Precaching resources');
                return cache.addAll(PRECACHE_RESOURCES);
            })
            .then(() => {
                console.log('预缓存完成 / Precaching complete');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('预缓存失败 / Precaching failed:', error);
            })
    );
});

// 激活事件 / Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => {
                            // 删除旧版本缓存 / Delete old cache versions
                            return cacheName.startsWith('demo-cache-') && 
                                   cacheName !== CACHE_NAME;
                        })
                        .map(cacheName => {
                            console.log(`删除旧缓存 / Deleting old cache: ${cacheName}`);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('现在可以处理请求 / Now ready to handle requests');
                return self.clients.claim();
            })
    );
});

// 获取事件 / Fetch event
self.addEventListener('fetch', event => {
    // 查找匹配的缓存规则 / Find matching cache rule
    const matchingRule = RUNTIME_CACHE_RULES.find(rule => 
        rule.urlPattern.test(event.request.url)
    );

    if (matchingRule) {
        switch (matchingRule.strategy) {
            case 'network-first':
                event.respondWith(networkFirst(event.request));
                break;
            case 'cache-first':
                event.respondWith(cacheFirst(event.request));
                break;
            case 'stale-while-revalidate':
                event.respondWith(staleWhileRevalidate(event.request));
                break;
            default:
                // 默认网络优先 / Default to network first
                event.respondWith(networkFirst(event.request));
        }
    } else {
        // 没有匹配规则时使用网络优先 / Use network first when no rule matches
        event.respondWith(networkFirst(event.request));
    }
});

// 网络优先策略 / Network First Strategy
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
        return response;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// 缓存优先策略 / Cache First Strategy
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
}

// 后台更新策略 / Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    const networkResponsePromise = fetch(request).then(response => {
        cache.put(request, response.clone());
        return response;
    });

    return cachedResponse || networkResponsePromise;
}

// 消息事件 / Message event
self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});

// 推送事件 / Push event
self.addEventListener('push', event => {
    const options = {
        body: event.data.text(),
        icon: '/assets/icon.png',
        badge: '/assets/badge.png'
    };

    event.waitUntil(
        self.registration.showNotification('缓存更新 / Cache Update', options)
    );
});

// 同步事件 / Sync event
self.addEventListener('sync', event => {
    if (event.tag === 'cache-update') {
        event.waitUntil(
            updateCache()
        );
    }
});

// 更新缓存 / Update cache
async function updateCache() {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    
    return Promise.all(
        requests.map(async request => {
            try {
                const response = await fetch(request);
                return cache.put(request, response);
            } catch (error) {
                console.error(`更新缓存失败 / Cache update failed: ${error.message}`);
                return Promise.resolve();
            }
        })
    );
}

// 错误处理 / Error handling
self.addEventListener('error', event => {
    console.error('Service Worker 错误 / Service Worker error:', event.error);
});

// 未处理的 Promise 拒绝 / Unhandled Promise rejection
self.addEventListener('unhandledrejection', event => {
    console.error('未处理的 Promise 拒绝 / Unhandled Promise rejection:', event.reason);
}); 