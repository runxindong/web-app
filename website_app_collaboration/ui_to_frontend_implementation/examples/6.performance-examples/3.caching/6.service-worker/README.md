# Service Worker 缓存示例 / Service Worker Cache Example

本示例演示了如何使用 Service Worker 实现资源缓存、离线访问、后台同步和推送通知等功能。
This example demonstrates how to implement resource caching, offline access, background sync, and push notifications using Service Worker.

## 功能特点 / Features

1. 资源缓存 / Resource Caching
   - 静态资源缓存 / Static resource caching
   - 动态资源缓存 / Dynamic resource caching
   - 缓存管理 / Cache management
   - 缓存更新 / Cache updates

2. 离线访问 / Offline Access
   - 离线页面 / Offline pages
   - 离线图片 / Offline images
   - 网络状态检测 / Network status detection
   - 降级处理 / Fallback handling

3. 后台同步 / Background Sync
   - 消息队列 / Message queue
   - 自动重试 / Automatic retry
   - 同步状态 / Sync status
   - 错误处理 / Error handling

4. 推送通知 / Push Notifications
   - 通知权限 / Notification permission
   - 通知显示 / Notification display
   - 通知交互 / Notification interaction
   - 通知管理 / Notification management

## 使用方法 / Usage

1. Service Worker 注册 / Service Worker Registration
   ```javascript
   if ('serviceWorker' in navigator) {
       navigator.serviceWorker.register('/service-worker.js')
           .then(registration => {
               console.log('Service Worker registered');
           })
           .catch(error => {
               console.error('Service Worker registration failed:', error);
           });
   }
   ```

2. 缓存管理 / Cache Management
   ```javascript
   // 添加缓存 / Add to cache
   cache.addAll([
       '/',
       '/index.html',
       '/styles.css',
       '/script.js'
   ]);

   // 从缓存获取 / Get from cache
   caches.match(event.request);

   // 删除缓存 / Delete cache
   caches.delete(CACHE_NAME);
   ```

3. 后台同步 / Background Sync
   ```javascript
   // 注册同步 / Register sync
   registration.sync.register('sync-tag');

   // 处理同步 / Handle sync
   self.addEventListener('sync', event => {
       if (event.tag === 'sync-tag') {
           // 执行同步操作 / Perform sync operation
       }
   });
   ```

## 注意事项 / Notes

1. 环境要求 / Environment Requirements
   - 需要 HTTPS 或 localhost
   - Requires HTTPS or localhost
   - 现代浏览器支持
   - Modern browser support
   - 安全上下文
   - Secure context

2. 缓存策略 / Caching Strategies
   - 缓存优先 / Cache first
   - 网络优先 / Network first
   - 缓存回退 / Cache fallback
   - 网络回退 / Network fallback

3. 性能考虑 / Performance Considerations
   - 缓存大小限制
   - Cache size limits
   - 更新策略
   - Update strategies
   - 资源优先级
   - Resource priorities

4. 调试方法 / Debugging Methods
   - Chrome DevTools
   - Firefox DevTools
   - 日志记录
   - Logging
   - 错误追踪
   - Error tracking

## 最佳实践 / Best Practices

1. 缓存管理 / Cache Management
   - 版本控制
   - Version control
   - 清理策略
   - Cleanup strategy
   - 存储限制
   - Storage limits

2. 离线体验 / Offline Experience
   - 优雅降级
   - Graceful degradation
   - 用户提示
   - User notifications
   - 数据同步
   - Data synchronization

3. 安全考虑 / Security Considerations
   - HTTPS 要求
   - HTTPS requirement
   - 作用域限制
   - Scope limitations
   - 权限管理
   - Permission management

4. 性能优化 / Performance Optimization
   - 选择性缓存
   - Selective caching
   - 预缓存
   - Precaching
   - 按需加载
   - On-demand loading

## 示例代码 / Example Code

1. 缓存策略 / Caching Strategy
   ```javascript
   self.addEventListener('fetch', event => {
       event.respondWith(
           caches.match(event.request)
               .then(response => {
                   return response || fetch(event.request);
               })
       );
   });
   ```

2. 后台同步 / Background Sync
   ```javascript
   self.addEventListener('sync', event => {
       if (event.tag === 'sync-messages') {
           event.waitUntil(
               syncMessages()
                   .catch(error => {
                       console.error('Sync failed:', error);
                   })
           );
       }
   });
   ```

3. 推送通知 / Push Notifications
   ```javascript
   self.addEventListener('push', event => {
       const options = {
           body: event.data.text(),
           icon: 'icon.png',
           badge: 'badge.png'
       };

       event.waitUntil(
           self.registration.showNotification('Title', options)
       );
   });
   ```

## 相关资源 / Related Resources

1. MDN Web Docs
   - [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
   - [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
   - [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)

2. Google Developers
   - [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers)
   - [The Offline Cookbook](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook)
   - [Adding Push Notifications](https://developers.google.com/web/fundamentals/push-notifications)

3. Web.dev
   - [Service workers and the Cache Storage API](https://web.dev/service-workers-cache-storage/)
   - [Offline UX considerations](https://web.dev/offline-ux-design-guidelines/)
   - [Progressive Web Apps](https://web.dev/progressive-web-apps/)

## 贡献 / Contributing

欢迎提交问题和改进建议。
Issues and improvements are welcome.

## 许可 / License

MIT 