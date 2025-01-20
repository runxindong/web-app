// 导航菜单控制 / Navigation Menu Control
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }
}

// 延迟加载处理 / Lazy Loading Handler
function initLazyLoading() {
    // 检查浏览器是否支持 Intersection Observer / Check if browser supports Intersection Observer
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img.lazy');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImage(img);
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // 降级处理：立即加载所有图片 / Fallback: Load all images immediately
        loadAllImages();
    }
}

// 加载单个图片 / Load Single Image
function loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;

    // 开始加载图片 / Start loading image
    const tempImage = new Image();
    
    tempImage.onload = () => {
        img.src = src;
        img.classList.add('loaded');
        
        // 移除占位符 / Remove placeholder
        const placeholder = img.parentElement.querySelector('.placeholder');
        if (placeholder) {
            placeholder.style.opacity = '0';
            setTimeout(() => placeholder.remove(), 300);
        }
    };

    tempImage.src = src;
}

// 降级：加载所有图片 / Fallback: Load All Images
function loadAllImages() {
    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => loadImage(img));
}

// 渐进式图片加载 / Progressive Image Loading
function initProgressiveLoading() {
    const progressiveImages = document.querySelectorAll('img.progressive');
    
    progressiveImages.forEach(img => {
        const src = img.getAttribute('data-src');
        if (!src) return;

        // 创建高质量图片 / Create high quality image
        const highQualityImage = new Image();
        
        highQualityImage.onload = () => {
            img.src = src;
            img.classList.add('loaded');
        };

        // 延迟加载高质量图片 / Delay loading high quality image
        setTimeout(() => {
            highQualityImage.src = src;
        }, 100);
    });
}

// 响应式图片处理 / Responsive Image Handler
function handleResponsiveImages() {
    // 监听窗口大小变化 / Listen to window resize
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
        // 防抖动处理 / Debounce handling
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // 更新sizes属性 / Update sizes attribute
            updateImageSizes();
        }, 250);
    });
}

// 更新图片sizes属性 / Update Image Sizes Attribute
function updateImageSizes() {
    const images = document.querySelectorAll('img[sizes]');
    const viewportWidth = window.innerWidth;
    
    images.forEach(img => {
        // 根据视口宽度更新sizes / Update sizes based on viewport width
        if (viewportWidth <= 400) {
            img.sizes = '100vw';
        } else if (viewportWidth <= 800) {
            img.sizes = '80vw';
        } else {
            img.sizes = '60vw';
        }
    });
}

// 图片加载错误处理 / Image Load Error Handler
function handleImageErrors() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', () => {
            // 添加错误样式 / Add error styles
            img.classList.add('error');
            
            // 显示错误提示 / Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = '图片加载失败 / Image failed to load';
            img.parentElement.appendChild(errorMessage);
        });
    });
}

// 性能监控 / Performance Monitoring
function monitorImagePerformance() {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver(list => {
            list.getEntries().forEach(entry => {
                // 记录图片加载性能 / Log image loading performance
                console.log(`Image: ${entry.name}`);
                console.log(`Loading time: ${entry.duration}ms`);
            });
        });

        observer.observe({ entryTypes: ['resource'] });
    }
}

// 初始化所有功能 / Initialize All Features
function init() {
    // 初始化导航 / Initialize navigation
    initNavigation();
    
    // 初始化图片功能 / Initialize image features
    initLazyLoading();
    initProgressiveLoading();
    handleResponsiveImages();
    handleImageErrors();
    
    // 启动性能监控 / Start performance monitoring
    monitorImagePerformance();
    
    // 初始更新图片尺寸 / Initial image size update
    updateImageSizes();
}

// 页面加载完成后初始化 / Initialize after page load
document.addEventListener('DOMContentLoaded', init); 