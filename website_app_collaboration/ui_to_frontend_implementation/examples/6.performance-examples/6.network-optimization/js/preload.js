/**
 * 资源预加载示例
 */

(() => {
    const loadImageBtn = document.getElementById('loadImageBtn');
    const imageContainer = document.getElementById('imageContainer');

    // 模拟大图URL
    const largeImageUrl = 'images/hero.jpg';

    // 预加载图片
    const preloadImage = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    };

    // 处理图片加载
    const handleImageLoad = async () => {
        try {
            utils.dom.setLoading(imageContainer, true);
            loadImageBtn.disabled = true;

            // 记录开始时间
            const startTime = performance.now();

            // 加载图片
            const img = await preloadImage(largeImageUrl);
            
            // 计算加载时间
            const loadTime = performance.now() - startTime;

            // 清空容器
            imageContainer.innerHTML = '';
            
            // 创建图片元素
            const imgElement = utils.dom.createElement('img', {
                src: largeImageUrl,
                alt: '预加载的大图',
                className: 'fade-in'
            });

            // 创建加载信息
            const infoElement = utils.dom.createElement('div', {
                className: 'status-container'
            }, [
                `图片加载完成！加载时间: ${loadTime.toFixed(2)}ms`
            ]);

            // 添加到容器
            imageContainer.appendChild(imgElement);
            imageContainer.appendChild(infoElement);

        } catch (error) {
            console.error('图片加载失败:', error);
            imageContainer.innerHTML = '图片加载失败，请重试';
        } finally {
            utils.dom.setLoading(imageContainer, false);
            loadImageBtn.disabled = false;
        }
    };

    // 绑定事件
    loadImageBtn.addEventListener('click', handleImageLoad);

    // 页面加载完成后预加载图片
    window.addEventListener('load', () => {
        // 使用 requestIdleCallback 在浏览器空闲时预加载
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                preloadImage(largeImageUrl).catch(console.error);
            });
        } else {
            // 降级处理
            setTimeout(() => {
                preloadImage(largeImageUrl).catch(console.error);
            }, 1000);
        }
    });
})(); 