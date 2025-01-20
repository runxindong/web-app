// 性能测试工具类
class PerformanceTestUtil {
    constructor() {
        this.metrics = {
            renderTime: [],
            memoryUsage: [],
            fps: []
        };
    }

    // 开始性能测试
    startTest() {
        this.metrics = {
            renderTime: [],
            memoryUsage: [],
            fps: []
        };
    }

    // 记录渲染时间
    recordRenderTime(startTime) {
        const endTime = performance.now();
        this.metrics.renderTime.push(endTime - startTime);
    }

    // 记录内存使用
    recordMemoryUsage() {
        if (window.performance && window.performance.memory) {
            this.metrics.memoryUsage.push(
                window.performance.memory.usedJSHeapSize / (1024 * 1024)
            );
        }
    }

    // 记录FPS
    recordFPS() {
        let frameCount = 0;
        let lastTime = performance.now();

        const countFrames = () => {
            const currentTime = performance.now();
            frameCount++;

            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                this.metrics.fps.push(fps);
                frameCount = 0;
                lastTime = currentTime;
            }

            requestAnimationFrame(countFrames);
        };

        requestAnimationFrame(countFrames);
    }

    // 获取平均指标
    getAverageMetrics() {
        const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

        return {
            averageRenderTime: average(this.metrics.renderTime),
            averageMemoryUsage: average(this.metrics.memoryUsage),
            averageFPS: average(this.metrics.fps)
        };
    }
}

// 虚拟列表类
class VirtualList {
    constructor(container, itemHeight, totalItems) {
        this.container = container;
        this.itemHeight = itemHeight;
        this.totalItems = totalItems;
        this.visibleItems = Math.ceil(container.clientHeight / itemHeight) + 2;
        this.scrollTop = 0;
        this.startIndex = 0;
        this.items = [];

        this.setupContainer();
        this.generateItems();
        this.render();
        this.attachEvents();
    }

    // 设置容器样式
    setupContainer() {
        this.container.style.position = 'relative';
        this.container.style.overflow = 'auto';
        this.container.innerHTML = '';

        this.content = document.createElement('div');
        this.content.style.height = `${this.totalItems * this.itemHeight}px`;
        this.content.style.position = 'relative';
        this.container.appendChild(this.content);
    }

    // 生成列表项数据
    generateItems() {
        this.items = Array.from({ length: this.totalItems }, (_, index) => ({
            id: index + 1,
            content: `Item ${index + 1}`
        }));
    }

    // 渲染可见项
    render() {
        const startTime = performance.now();

        // 清除现有内容
        this.content.innerHTML = '';

        // 计算可见范围
        const start = Math.max(0, this.startIndex - 1);
        const end = Math.min(this.totalItems, start + this.visibleItems);

        // 渲染可见项
        for (let i = start; i < end; i++) {
            const item = this.items[i];
            const element = document.createElement('div');
            element.className = 'list-item';
            element.style.position = 'absolute';
            element.style.top = `${i * this.itemHeight}px`;
            element.style.height = `${this.itemHeight}px`;
            element.style.width = '100%';
            element.textContent = item.content;
            this.content.appendChild(element);
        }

        // 记录渲染时间
        if (window.performanceTest) {
            window.performanceTest.recordRenderTime(startTime);
            window.performanceTest.recordMemoryUsage();
        }
    }

    // 处理滚动事件
    handleScroll = () => {
        const newScrollTop = this.container.scrollTop;
        const newStartIndex = Math.floor(newScrollTop / this.itemHeight);

        if (newStartIndex !== this.startIndex) {
            this.startIndex = newStartIndex;
            this.render();
        }
    }

    // 添加事件监听
    attachEvents() {
        this.container.addEventListener('scroll', this.handleScroll);
    }

    // 清理事件监听
    destroy() {
        this.container.removeEventListener('scroll', this.handleScroll);
    }
}

// 图片加载性能测试类
class ImageLoadingTest {
    constructor(container) {
        this.container = container;
        this.images = [];
        this.loadedImages = 0;
        this.totalImages = 0;
    }

    // 添加图片
    addImage(src) {
        const img = new Image();
        img.src = src;
        this.images.push(img);
        this.totalImages++;
    }

    // 加载所有图片
    async loadImages() {
        const startTime = performance.now();
        this.loadedImages = 0;

        const promises = this.images.map(img => {
            return new Promise((resolve, reject) => {
                img.onload = () => {
                    this.loadedImages++;
                    this.updateProgress();
                    resolve(img);
                };
                img.onerror = reject;
            });
        });

        try {
            await Promise.all(promises);
            const endTime = performance.now();
            return {
                loadTime: endTime - startTime,
                successRate: (this.loadedImages / this.totalImages) * 100
            };
        } catch (error) {
            console.error('Image loading error:', error);
            return {
                loadTime: performance.now() - startTime,
                successRate: (this.loadedImages / this.totalImages) * 100,
                error: error.message
            };
        }
    }

    // 更新加载进度
    updateProgress() {
        const progress = document.getElementById('image-load-progress');
        if (progress) {
            progress.textContent = `Loading: ${this.loadedImages}/${this.totalImages} images`;
        }
    }

    // 显示图片
    displayImages() {
        this.container.innerHTML = '';
        this.images.forEach(img => {
            const wrapper = document.createElement('div');
            wrapper.className = 'image-wrapper';
            wrapper.appendChild(img.cloneNode());
            this.container.appendChild(wrapper);
        });
    }
}

// 性能测试函数
async function runPerformanceTests() {
    const testResults = {
        total: 0,
        passed: 0,
        failed: 0,
        results: []
    };

    function assert(condition, message, metrics = null) {
        testResults.total++;
        if (condition) {
            testResults.passed++;
            testResults.results.push({
                status: 'passed',
                message,
                metrics
            });
        } else {
            testResults.failed++;
            testResults.results.push({
                status: 'failed',
                message,
                metrics
            });
        }
    }

    // 初始化性能测试工具
    window.performanceTest = new PerformanceTestUtil();
    window.performanceTest.startTest();
    window.performanceTest.recordFPS();

    console.log('Running Performance Tests...');

    try {
        // 测试虚拟列表性能
        const listContainer = document.getElementById('virtual-list-container');
        if (listContainer) {
            const startTime = performance.now();
            const virtualList = new VirtualList(listContainer, 40, 10000);
            const initTime = performance.now() - startTime;

            // 测试初始化时间
            assert(
                initTime < 100,
                'Virtual list initialization should be fast',
                { initializationTime: initTime }
            );

            // 测试滚动性能
            let scrollStartTime = performance.now();
            listContainer.scrollTop = 5000;
            await new Promise(resolve => setTimeout(resolve, 100));
            const scrollTime = performance.now() - scrollStartTime;

            assert(
                scrollTime < 50,
                'Scrolling should be smooth',
                { scrollingTime: scrollTime }
            );

            // 清理
            virtualList.destroy();
        }

        // 测试图片加载性能
        const imageContainer = document.getElementById('image-gallery');
        if (imageContainer) {
            const imageTest = new ImageLoadingTest(imageContainer);
            
            // 添加测试图片
            const imageUrls = [
                'https://picsum.photos/200/300',
                'https://picsum.photos/200/301',
                'https://picsum.photos/200/302',
                'https://picsum.photos/200/303',
                'https://picsum.photos/200/304'
            ];

            imageUrls.forEach(url => imageTest.addImage(url));

            // 测试图片加载
            const loadResults = await imageTest.loadImages();
            
            assert(
                loadResults.loadTime < 5000,
                'Images should load within 5 seconds',
                { loadTime: loadResults.loadTime }
            );

            assert(
                loadResults.successRate > 80,
                'Image loading success rate should be high',
                { successRate: loadResults.successRate }
            );

            // 显示加载的图片
            imageTest.displayImages();
        }

        // 获取性能指标
        await new Promise(resolve => setTimeout(resolve, 1000));
        const metrics = window.performanceTest.getAverageMetrics();

        // 验证性能指标
        assert(
            metrics.averageRenderTime < 16,
            'Average render time should be less than 16ms (60fps)',
            { averageRenderTime: metrics.averageRenderTime }
        );

        assert(
            metrics.averageFPS > 30,
            'Average FPS should be above 30',
            { averageFPS: metrics.averageFPS }
        );

        if (metrics.averageMemoryUsage) {
            assert(
                metrics.averageMemoryUsage < 100,
                'Memory usage should be reasonable',
                { averageMemoryUsage: metrics.averageMemoryUsage }
            );
        }

    } catch (error) {
        console.error('Performance Test Error:', error);
        testResults.results.push({
            status: 'failed',
            message: `Unexpected error: ${error.message}`
        });
    }

    // 输出测试结果
    console.log('Performance Test Results:', testResults);
    return testResults;
}

// 在页面加载时运行性能测试
document.addEventListener('DOMContentLoaded', async () => {
    const testResults = await runPerformanceTests();
    
    // 更新UI显示测试结果
    const resultsContainer = document.getElementById('performance-test-results');
    if (resultsContainer) {
        const summary = document.createElement('div');
        summary.innerHTML = `
            <h3>Performance Test Summary</h3>
            <p>Total Tests: ${testResults.total}</p>
            <p>Passed: ${testResults.passed}</p>
            <p>Failed: ${testResults.failed}</p>
        `;
        resultsContainer.appendChild(summary);

        const details = document.createElement('div');
        details.innerHTML = '<h3>Test Details</h3>';
        testResults.results.forEach((result, index) => {
            const resultElement = document.createElement('div');
            resultElement.className = `test-result ${result.status}`;
            let metricsHtml = '';
            if (result.metrics) {
                metricsHtml = '<div class="metrics">';
                for (const [key, value] of Object.entries(result.metrics)) {
                    metricsHtml += `<p>${key}: ${value.toFixed(2)}</p>`;
                }
                metricsHtml += '</div>';
            }
            resultElement.innerHTML = `
                <p>Test #${index + 1}: ${result.status.toUpperCase()}</p>
                <p>${result.message}</p>
                ${metricsHtml}
            `;
            details.appendChild(resultElement);
        });
        resultsContainer.appendChild(details);
    }
}); 