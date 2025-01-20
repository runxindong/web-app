/**
 * 主入口文件
 */

(() => {
    // 注册Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker 注册成功:', registration);
                })
                .catch(error => {
                    console.log('Service Worker 注册失败:', error);
                });
        });
    }

    // 添加页面可见性监听
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // 页面隐藏时暂停不必要的网络请求
            console.log('页面隐藏，暂停非必要请求');
        } else {
            // 页面显示时恢复
            console.log('页面显示，恢复请求');
        }
    });

    // 添加网络状态监听
    if ('connection' in navigator) {
        navigator.connection.addEventListener('change', () => {
            const connection = navigator.connection;
            console.log('网络状态变化:', {
                type: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            });
        });
    }

    // 监听在线/离线状态
    window.addEventListener('online', () => {
        console.log('网络已连接');
        // 恢复在线功能
    });

    window.addEventListener('offline', () => {
        console.log('网络已断开');
        // 启用离线功能
    });

    // 页面加载完成后的初始化
    window.addEventListener('load', () => {
        // 预加载其他页面资源
        const pagesToPreload = [
            '/about.html',
            '/contact.html'
        ];

        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                pagesToPreload.forEach(page => {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = page;
                    document.head.appendChild(link);
                });
            });
        }

        // 预连接常用域名
        const domainsToPrefetch = [
            'https://api.example.com',
            'https://cdn.example.com'
        ];

        domainsToPrefetch.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
        });
    });

    // 错误监控
    window.addEventListener('error', (event) => {
        console.error('资源加载错误:', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    });

    // 未处理的Promise错误
    window.addEventListener('unhandledrejection', (event) => {
        console.error('未处理的Promise错误:', event.reason);
    });
})(); 