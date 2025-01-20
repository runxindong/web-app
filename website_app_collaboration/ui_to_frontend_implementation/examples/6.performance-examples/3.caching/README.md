# 缓存优化示例 / Caching Optimization Examples

本目录包含了各种缓存优化的示例和最佳实践。
This directory contains examples and best practices for caching optimization.

## 目录结构 / Directory Structure

1. 浏览器缓存 / Browser Cache
   - HTTP 缓存策略 / HTTP caching strategies
   - 缓存控制头 / Cache control headers
   - ETag 和条件请求 / ETag and conditional requests

2. Service Worker 缓存 / Service Worker Cache
   - 离线缓存 / Offline caching
   - 预缓存 / Precaching
   - 运行时缓存 / Runtime caching
   - 缓存策略 / Caching strategies

3. 内存缓存 / Memory Cache
   - 数据缓存 / Data caching
   - 计算结果缓存 / Computation result caching
   - LRU 缓存 / LRU cache

4. IndexedDB 存储 / IndexedDB Storage
   - 结构化数据存储 / Structured data storage
   - 离线数据同步 / Offline data synchronization
   - 大文件存储 / Large file storage

5. LocalStorage 缓存 / LocalStorage Cache
   - 简单数据存储 / Simple data storage
   - 配置缓存 / Configuration caching
   - 会话状态管理 / Session state management

## 缓存策略 / Caching Strategies

1. 网络优先 / Network First
   ```javascript
   async function networkFirst(request) {
     try {
       // 尝试网络请求 / Try network request
       const response = await fetch(request);
       // 存入缓存 / Store in cache
       const cache = await caches.open('dynamic-cache');
       cache.put(request, response.clone());
       return response;
     } catch (error) {
       // 网络失败时使用缓存 / Use cache when network fails
       const cache = await caches.open('dynamic-cache');
       return cache.match(request);
     }
   }
   ```

2. 缓存优先 / Cache First
   ```javascript
   async function cacheFirst(request) {
     const cache = await caches.open('static-cache');
     const cached = await cache.match(request);
     if (cached) {
       return cached;
     }
     // 缓存未命中时请求网络 / Request network when cache miss
     const response = await fetch(request);
     cache.put(request, response.clone());
     return response;
   }
   ```

3. 后台更新 / Stale While Revalidate
   ```javascript
   async function staleWhileRevalidate(request) {
     const cache = await caches.open('dynamic-cache');
     const cached = await cache.match(request);
     
     const networkPromise = fetch(request).then(response => {
       cache.put(request, response.clone());
       return response;
     });

     return cached || networkPromise;
   }
   ```

## 最佳实践 / Best Practices

1. 缓存策略选择 / Cache Strategy Selection
   - 静态资源使用缓存优先 / Use cache-first for static assets
   - API 请求使用网络优先 / Use network-first for API requests
   - 频繁更新的内容使用后台更新 / Use stale-while-revalidate for frequently updated content

2. 缓存管理 / Cache Management
   - 定期清理过期缓存 / Regularly clean expired caches
   - 版本化缓存名称 / Version cache names
   - 限制缓存大小 / Limit cache size

3. 错误处理 / Error Handling
   - 实现优雅降级 / Implement graceful degradation
   - 提供离线回退方案 / Provide offline fallbacks
   - 处理存储配额超限 / Handle storage quota exceeded

4. 性能优化 / Performance Optimization
   - 预缓存关键资源 / Precache critical resources
   - 使用适当的缓存持久化策略 / Use appropriate cache persistence strategy
   - 优化缓存更新时机 / Optimize cache update timing

## 使用方法 / Usage

1. 浏览器缓存 / Browser Cache
   ```html
   <!-- 设置缓存控制头 / Set cache control headers -->
   <meta http-equiv="Cache-Control" content="max-age=31536000">
   ```

2. Service Worker
   ```javascript
   // 注册 Service Worker / Register Service Worker
   if ('serviceWorker' in navigator) {
     navigator.serviceWorker.register('/sw.js');
   }
   ```

3. 内存缓存 / Memory Cache
   ```javascript
   const cache = new Map();
   function memoize(fn) {
     return function (...args) {
       const key = JSON.stringify(args);
       if (cache.has(key)) return cache.get(key);
       const result = fn.apply(this, args);
       cache.set(key, result);
       return result;
     };
   }
   ```

4. IndexedDB
   ```javascript
   const request = indexedDB.open('myDB', 1);
   request.onupgradeneeded = (event) => {
     const db = event.target.result;
     db.createObjectStore('myStore');
   };
   ```

5. LocalStorage
   ```javascript
   // 存储数据 / Store data
   localStorage.setItem('key', JSON.stringify(data));
   
   // 读取数据 / Read data
   const data = JSON.parse(localStorage.getItem('key'));
   ```

## 注意事项 / Notes

1. 安全性 / Security
   - 不要缓存敏感数据 / Don't cache sensitive data
   - 使用 HTTPS / Use HTTPS
   - 验证缓存数据完整性 / Verify cache data integrity

2. 性能 / Performance
   - 避免过度缓存 / Avoid over-caching
   - 监控缓存命中率 / Monitor cache hit rate
   - 优化缓存更新策略 / Optimize cache update strategy

3. 兼容性 / Compatibility
   - 检查浏览器支持 / Check browser support
   - 提供降级方案 / Provide fallback solutions
   - 处理存储限制 / Handle storage limitations 