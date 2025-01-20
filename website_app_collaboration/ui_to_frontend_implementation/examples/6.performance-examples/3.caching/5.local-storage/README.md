# LocalStorage 缓存示例 / LocalStorage Cache Example

本示例演示了如何使用 LocalStorage 和 SessionStorage 在浏览器中进行数据缓存和状态管理。
This example demonstrates how to use LocalStorage and SessionStorage for data caching and state management in the browser.

## 功能特点 / Features

1. 数据存储 / Data Storage
   - 键值对存储 / Key-value pair storage
   - 数据持久化 / Data persistence
   - 自动时间戳 / Automatic timestamps
   - 数据删除 / Data deletion

2. 配置管理 / Configuration Management
   - 主题切换 / Theme switching
   - 语言选择 / Language selection
   - 字体大小调整 / Font size adjustment
   - 配置重置 / Configuration reset

3. 会话状态 / Session State
   - 计数器 / Counter
   - 会话时长 / Session duration
   - 开始时间 / Start time
   - 状态重置 / State reset

4. 存储信息 / Storage Information
   - 已用空间 / Used space
   - 可用空间 / Available space
   - 项目数量 / Item count
   - 存储清理 / Storage cleanup

## 使用方法 / Usage

1. 数据存储 / Data Storage
   ```javascript
   // 保存数据 / Save data
   localStorage.setItem('key', 'value');

   // 读取数据 / Read data
   const value = localStorage.getItem('key');

   // 删除数据 / Delete data
   localStorage.removeItem('key');

   // 清除所有数据 / Clear all data
   localStorage.clear();
   ```

2. 会话存储 / Session Storage
   ```javascript
   // 保存会话数据 / Save session data
   sessionStorage.setItem('key', 'value');

   // 读取会话数据 / Read session data
   const value = sessionStorage.getItem('key');

   // 会话结束时自动清除 / Automatically cleared when session ends
   ```

3. 存储事件监听 / Storage Event Listening
   ```javascript
   // 监听存储变化 / Listen for storage changes
   window.addEventListener('storage', (event) => {
       console.log('Key:', event.key);
       console.log('Old Value:', event.oldValue);
       console.log('New Value:', event.newValue);
       console.log('Storage Area:', event.storageArea);
   });
   ```

## 注意事项 / Notes

1. 存储限制 / Storage Limits
   - LocalStorage 通常限制在 5-10MB 之间
   - LocalStorage is typically limited to 5-10MB
   - 不同浏览器限制不同
   - Limits vary between browsers

2. 安全考虑 / Security Considerations
   - 不要存储敏感数据
   - Don't store sensitive data
   - 数据未加密
   - Data is not encrypted
   - 可被 XSS 攻击访问
   - Accessible via XSS attacks

3. 性能影响 / Performance Impact
   - 同步 API 可能阻塞
   - Synchronous API may block
   - 大量数据影响性能
   - Large data affects performance
   - 建议分批处理
   - Batch processing recommended

4. 兼容性 / Compatibility
   - 现代浏览器支持良好
   - Well supported in modern browsers
   - 私密浏览模式可能受限
   - May be limited in private browsing
   - 需要降级处理
   - Fallback handling needed

## 最佳实践 / Best Practices

1. 数据管理 / Data Management
   - 使用前缀避免冲突
   - Use prefixes to avoid conflicts
   - 结构化数据序列化
   - Serialize structured data
   - 定期清理过期数据
   - Clean up expired data regularly

2. 错误处理 / Error Handling
   - 捕获配额超限异常
   - Catch quota exceeded errors
   - 提供友好错误提示
   - Provide friendly error messages
   - 实现降级存储方案
   - Implement fallback storage solutions

3. 性能优化 / Performance Optimization
   - 批量操作数据
   - Batch data operations
   - 避免频繁读写
   - Avoid frequent read/write
   - 合理设置过期时间
   - Set reasonable expiration times

4. 安全防护 / Security Protection
   - 验证数据完整性
   - Validate data integrity
   - 过滤特殊字符
   - Filter special characters
   - 实施访问控制
   - Implement access control

## 示例代码 / Example Code

```javascript
// 配置管理示例 / Configuration management example
const config = {
    theme: 'light',
    language: 'en',
    fontSize: 16
};

// 保存配置 / Save configuration
localStorage.setItem('app_config', JSON.stringify(config));

// 读取配置 / Read configuration
const savedConfig = JSON.parse(localStorage.getItem('app_config'));

// 会话状态示例 / Session state example
const session = {
    startTime: new Date().toISOString(),
    visits: 1
};

// 保存会话 / Save session
sessionStorage.setItem('user_session', JSON.stringify(session));

// 存储事件示例 / Storage event example
window.addEventListener('storage', (event) => {
    if (event.key === 'app_config') {
        const newConfig = JSON.parse(event.newValue);
        applyConfig(newConfig);
    }
});
```

## 相关资源 / Related Resources

1. MDN Web Docs
   - [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
   - [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
   - [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

2. Web.dev
   - [Storage for the web](https://web.dev/storage-for-the-web/)
   - [Storage quota and usage](https://web.dev/storage-quota-and-usage/)

3. Can I Use
   - [Web Storage Support Tables](https://caniuse.com/?search=localStorage)

## 贡献 / Contributing

欢迎提交问题和改进建议。
Issues and improvements are welcome.

## 许可 / License

MIT 