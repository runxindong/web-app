/**
 * 请求合并和批处理示例
 */

(() => {
    const singleRequestBtn = document.getElementById('singleRequestBtn');
    const batchRequestBtn = document.getElementById('batchRequestBtn');
    const requestMetrics = document.getElementById('requestMetrics');
    const batchResults = document.getElementById('batchResults');

    // 模拟API端点
    const API_ENDPOINTS = [
        'https://api.example.com/users/1',
        'https://api.example.com/users/2',
        'https://api.example.com/users/3',
        'https://api.example.com/users/4',
        'https://api.example.com/users/5'
    ];

    // 更新性能指标显示
    const updateMetrics = () => {
        const metrics = utils.performance.getMetrics();
        requestMetrics.innerHTML = `
            <div class="fade-in">
                <h3>请求统计</h3>
                <p>单独请求次数: ${metrics.singleRequests}</p>
                <p>批量请求次数: ${metrics.batchRequests}</p>
                <p>平均请求时间: ${metrics.averageRequestTime}ms</p>
            </div>
        `;
    };

    // 显示结果
    const displayResults = (results, type) => {
        batchResults.innerHTML = '';
        results.forEach((result, index) => {
            const resultElement = utils.dom.createElement('div', {
                className: 'result-item fade-in'
            }, [
                `<h4>用户 ${index + 1}</h4>`,
                `<p>请求类型: ${type}</p>`,
                `<pre>${JSON.stringify(result, null, 2)}</pre>`
            ]);
            batchResults.appendChild(resultElement);
        });
    };

    // 模拟单个API请求
    const mockSingleRequest = async (url) => {
        utils.performance.recordSingleRequest();
        const mockData = {
            id: url.split('/').pop(),
            name: `用户 ${Math.floor(Math.random() * 100)}`,
            email: `user${Math.floor(Math.random() * 100)}@example.com`
        };
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockData;
    };

    // 处理单独请求
    const handleSingleRequests = async () => {
        try {
            utils.dom.setLoading(batchResults, true);
            singleRequestBtn.disabled = true;
            batchRequestBtn.disabled = true;

            const results = [];
            for (const url of API_ENDPOINTS) {
                const result = await mockSingleRequest(url);
                results.push(result);
            }

            displayResults(results, '单独请求');
            updateMetrics();

        } catch (error) {
            console.error('请求失败:', error);
            batchResults.innerHTML = '请求失败，请重试';
        } finally {
            utils.dom.setLoading(batchResults, false);
            singleRequestBtn.disabled = false;
            batchRequestBtn.disabled = false;
        }
    };

    // 处理批量请求
    const handleBatchRequests = async () => {
        try {
            utils.dom.setLoading(batchResults, true);
            singleRequestBtn.disabled = true;
            batchRequestBtn.disabled = true;

            const results = await utils.request.batchFetch(API_ENDPOINTS);
            displayResults(results, '批量请求');
            updateMetrics();

        } catch (error) {
            console.error('批量请求失败:', error);
            batchResults.innerHTML = '批量请求失败，请重试';
        } finally {
            utils.dom.setLoading(batchResults, false);
            singleRequestBtn.disabled = false;
            batchRequestBtn.disabled = false;
        }
    };

    // 绑定事件
    singleRequestBtn.addEventListener('click', handleSingleRequests);
    batchRequestBtn.addEventListener('click', handleBatchRequests);

    // 显示初始指标
    updateMetrics();
})(); 