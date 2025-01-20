/**
 * 增量加载示例
 */

(() => {
    const contentContainer = document.getElementById('contentContainer');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // 配置
    const PAGE_SIZE = 10;
    let currentPage = 0;
    let isLoading = false;
    let hasMore = true;

    // 生成模拟数据
    const generateMockData = (page) => {
        const items = [];
        const startIndex = page * PAGE_SIZE;
        
        for (let i = 0; i < PAGE_SIZE; i++) {
            items.push({
                id: startIndex + i,
                title: `内容项 ${startIndex + i + 1}`,
                description: `这是第 ${startIndex + i + 1} 个内容项的详细描述。`,
                timestamp: new Date(Date.now() - (startIndex + i) * 60000).toLocaleString()
            });
        }

        return items;
    };

    // 创建内容项元素
    const createContentItem = (item) => {
        return utils.dom.createElement('div', {
            className: 'content-item fade-in'
        }, [
            `<h3>${item.title}</h3>`,
            `<p>${item.description}</p>`,
            `<small>发布时间: ${item.timestamp}</small>`
        ]);
    };

    // 显示加载状态
    const setLoading = (loading) => {
        isLoading = loading;
        loadMoreBtn.disabled = loading;
        loadingIndicator.style.display = loading ? 'block' : 'none';
    };

    // 加载更多内容
    const loadMoreContent = async () => {
        if (isLoading || !hasMore) return;

        try {
            setLoading(true);

            // 模拟API请求延迟
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 获取新数据
            const newItems = generateMockData(currentPage);

            // 模拟数据结束
            if (currentPage >= 5) {
                hasMore = false;
                loadMoreBtn.style.display = 'none';
            }

            // 添加新内容
            newItems.forEach(item => {
                const itemElement = createContentItem(item);
                contentContainer.appendChild(itemElement);
            });

            currentPage++;

        } catch (error) {
            console.error('加载失败:', error);
            const errorElement = utils.dom.createElement('div', {
                className: 'error-message'
            }, ['加载失败，请重试']);
            contentContainer.appendChild(errorElement);
        } finally {
            setLoading(false);
        }
    };

    // 检查滚动位置
    const checkScroll = () => {
        if (!hasMore || isLoading) return;

        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        // 当滚动到距离底部100px时加载更多
        if (scrollHeight - scrollTop - clientHeight < 100) {
            loadMoreContent();
        }
    };

    // 绑定事件
    loadMoreBtn.addEventListener('click', loadMoreContent);
    window.addEventListener('scroll', checkScroll);

    // 初始加载
    loadMoreContent();
})(); 