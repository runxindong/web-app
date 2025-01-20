// 初始化性能监控
const performanceMonitor = new utils.PerformanceMonitor();

// 搜索示例 - 防抖
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// 未优化的搜索处理函数
async function handleSearch(query) {
    performanceMonitor.incrementApiCalls();
    const results = await utils.mockApiCall(query);
    searchResults.innerHTML = results.map(result => `<div>${result}</div>`).join('');
}

// 使用防抖优化的搜索处理函数
const debouncedSearch = utils.debounce(handleSearch, 500);

searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    if (query.length > 0) {
        debouncedSearch(query);
    } else {
        searchResults.innerHTML = '';
    }
});

// 滚动示例 - 节流
const scrollContainer = document.getElementById('scrollContainer');
const scrollContent = document.getElementById('scrollContent');

// 生成滚动内容
function generateScrollItems(count) {
    const items = [];
    for (let i = 0; i < count; i++) {
        items.push(`<div class="scroll-item" style="background-color: ${utils.getRandomColor()}">
            滚动项目 ${i + 1}
        </div>`);
    }
    scrollContent.innerHTML = items.join('');
}

generateScrollItems(50);

// 未优化的滚动处理函数
function handleScroll() {
    performanceMonitor.incrementScrollEvents();
    // 模拟复杂的滚动处理逻辑
    const scrollTop = scrollContainer.scrollTop;
    const scrollHeight = scrollContainer.scrollHeight;
    const clientHeight = scrollContainer.clientHeight;
    
    if (scrollTop + clientHeight >= scrollHeight - 50) {
        // 接近底部时添加新内容
        const newItems = [];
        for (let i = 0; i < 5; i++) {
            newItems.push(`<div class="scroll-item" style="background-color: ${utils.getRandomColor()}">
                新增项目 ${Math.random().toString(36).substring(7)}
            </div>`);
        }
        scrollContent.insertAdjacentHTML('beforeend', newItems.join(''));
    }
}

// 使用节流优化的滚动处理函数
const throttledScroll = utils.throttle(handleScroll, 200);

scrollContainer.addEventListener('scroll', throttledScroll);

// 窗口调整示例 - 防抖
const resizeBox = document.getElementById('resizeBox');

// 未优化的窗口调整处理函数
function handleResize() {
    performanceMonitor.incrementResizeEvents();
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    resizeBox.style.width = `${width * 0.8}px`;
    resizeBox.style.height = `${height * 0.2}px`;
    resizeBox.innerHTML = `<p>窗口尺寸: ${width} x ${height}</p>`;
}

// 使用防抖优化的窗口调整处理函数
const debouncedResize = utils.debounce(handleResize, 250);

window.addEventListener('resize', debouncedResize);

// 初始化窗口尺寸
handleResize(); 