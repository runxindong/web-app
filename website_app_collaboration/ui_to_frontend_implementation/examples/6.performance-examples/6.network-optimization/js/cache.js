/**
 * HTTP缓存策略示例
 */

(() => {
    const fetchDataBtn = document.getElementById('fetchDataBtn');
    const cacheStatus = document.getElementById('cacheStatus');
    const dataContainer = document.getElementById('dataContainer');

    // 模拟API端点
    const API_ENDPOINT = 'https://api.example.com/data';
    const CACHE_KEY = 'demo_data';
    const CACHE_TTL = 10000; // 10秒缓存

    // 更新缓存状态显示
    const updateCacheStatus = (status) => {
        cacheStatus.innerHTML = status;
        cacheStatus.className = 'status-container fade-in';
    };

    // 更新数据显示
    const updateDataDisplay = (data, source) => {
        const timestamp = new Date().toLocaleTimeString();
        dataContainer.innerHTML = `
            <div class="fade-in">
                <h3>数据来源: ${source}</h3>
                <p>获取时间: ${timestamp}</p>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
        `;
    };

    // 模拟API请求
    const fetchData = async () => {
        const mockData = {
            id: Math.floor(Math.random() * 1000),
            title: '示例数据',
            timestamp: Date.now()
        };

        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockData;
    };

    // 处理数据获取
    const handleDataFetch = async () => {
        try {
            utils.dom.setLoading(dataContainer, true);
            fetchDataBtn.disabled = true;

            // 检查缓存
            const cachedData = utils.cache.get(CACHE_KEY);
            
            if (cachedData) {
                utils.performance.recordCacheHit();
                updateCacheStatus('使用缓存数据');
                updateDataDisplay(cachedData, '缓存');
            } else {
                utils.performance.recordCacheMiss();
                updateCacheStatus('从API获取新数据');
                
                // 获取新数据
                const newData = await fetchData();
                
                // 更新缓存
                await utils.cache.set(CACHE_KEY, newData, CACHE_TTL);
                
                updateDataDisplay(newData, 'API');
            }

        } catch (error) {
            console.error('数据获取失败:', error);
            updateCacheStatus('数据获取失败，请重试');
        } finally {
            utils.dom.setLoading(dataContainer, false);
            fetchDataBtn.disabled = false;
        }
    };

    // 绑定事件
    fetchDataBtn.addEventListener('click', handleDataFetch);

    // 显示初始状态
    updateCacheStatus('点击按钮获取数据');
})(); 