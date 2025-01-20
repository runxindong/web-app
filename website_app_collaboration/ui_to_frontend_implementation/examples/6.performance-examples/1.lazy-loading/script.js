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

// 图片延迟加载 / Image Lazy Loading
function initImageLazyLoading() {
    // 检查浏览器支持 / Check browser support
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        // 观察所有延迟加载图片 / Observe all lazy loading images
        document.querySelectorAll('img.lazy').forEach(img => {
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
    document.querySelectorAll('img.lazy').forEach(img => loadImage(img));
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

// 组件延迟加载 / Component Lazy Loading
function initComponentLazyLoading() {
    const componentContainer = document.getElementById('component-container');
    if (!componentContainer) return;

    // 创建加载指示器 / Create loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'spinner';
    componentContainer.appendChild(loadingIndicator);

    // 使用 Intersection Observer 检测容器可见性
    // Use Intersection Observer to detect container visibility
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadComponent();
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(componentContainer);
}

// 加载组件 / Load Component
async function loadComponent() {
    const componentContainer = document.getElementById('component-container');
    if (!componentContainer) return;

    try {
        // 模拟组件加载 / Simulate component loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 移除加载指示器 / Remove loading indicator
        const spinner = componentContainer.querySelector('.spinner');
        if (spinner) spinner.remove();

        // 添加示例组件内容 / Add example component content
        componentContainer.innerHTML = `
            <div class="demo-component">
                <h3>延迟加载的组件 / Lazy Loaded Component</h3>
                <p>这个组件是动态加载的。/ This component was dynamically loaded.</p>
            </div>
        `;
    } catch (error) {
        console.error('组件加载失败 / Component loading failed:', error);
        componentContainer.innerHTML = `
            <div class="error-message">
                加载失败 / Loading failed
                <button onclick="loadComponent()">重试 / Retry</button>
            </div>
        `;
    }
}

// 字体延迟加载 / Font Lazy Loading
function initFontLazyLoading() {
    const fontDemo = document.querySelector('.custom-font');
    if (!fontDemo) return;

    // 创建字体加载 Promise / Create font loading Promise
    const fontLoader = new Promise((resolve, reject) => {
        const font = new FontFace(
            'CustomFont',
            'url(custom-font.woff2)',
            { display: 'swap' }
        );

        font.load().then(() => {
            document.fonts.add(font);
            resolve();
        }).catch(reject);
    });

    // 应用字体 / Apply font
    fontLoader.then(() => {
        fontDemo.style.fontFamily = 'CustomFont, sans-serif';
        fontDemo.classList.add('loaded');
    }).catch(error => {
        console.error('字体加载失败 / Font loading failed:', error);
    });
}

// 视频延迟加载 / Video Lazy Loading
function initVideoLazyLoading() {
    const videos = document.querySelectorAll('.lazy-video');
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadVideo(entry.target);
                videoObserver.unobserve(entry.target);
            }
        });
    });

    videos.forEach(video => videoObserver.observe(video));
}

// 加载视频 / Load Video
function loadVideo(video) {
    const src = video.getAttribute('data-src');
    if (!src) return;

    // 设置视频源 / Set video source
    const source = video.querySelector('source');
    if (source) source.src = src;
    
    // 加载视频 / Load video
    video.load();
    video.classList.add('loaded');
}

// 功能延迟加载 / Feature Lazy Loading
function initFeatureLazyLoading() {
    const loadButton = document.getElementById('load-feature');
    if (!loadButton) return;

    loadButton.addEventListener('click', async () => {
        const container = document.getElementById('feature-container');
        if (!container) return;

        // 显示加载状态 / Show loading state
        loadButton.disabled = true;
        container.innerHTML = '<div class="spinner"></div>';

        try {
            // 动态导入功能模块 / Dynamically import feature module
            await loadFeatureModule();
            
            // 更新界面 / Update UI
            container.innerHTML = `
                <div class="feature-content">
                    <h4>功能已加载 / Feature Loaded</h4>
                    <p>这个功能是动态加载的。/ This feature was dynamically loaded.</p>
                </div>
            `;
        } catch (error) {
            console.error('功能加载失败 / Feature loading failed:', error);
            container.innerHTML = `
                <div class="error-message">
                    加载失败 / Loading failed
                    <button onclick="initFeatureLazyLoading()">重试 / Retry</button>
                </div>
            `;
        } finally {
            loadButton.disabled = false;
        }
    });
}

// 模拟功能模块加载 / Simulate feature module loading
async function loadFeatureModule() {
    // 模拟网络延迟 / Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { loaded: true };
}

// 性能监控 / Performance Monitoring
function initPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
        // 监控资源加载 / Monitor resource loading
        const observer = new PerformanceObserver(list => {
            list.getEntries().forEach(entry => {
                // 记录加载性能 / Log loading performance
                console.log(`Resource: ${entry.name}`);
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
    
    // 初始化图片加载 / Initialize image loading
    initImageLazyLoading();
    initProgressiveLoading();
    
    // 初始化组件加载 / Initialize component loading
    initComponentLazyLoading();
    
    // 初始化资源加载 / Initialize resource loading
    initFontLazyLoading();
    initVideoLazyLoading();
    initFeatureLazyLoading();
    
    // 初始化性能监控 / Initialize performance monitoring
    initPerformanceMonitoring();
}

// 页面加载完成后初始化 / Initialize after page load
document.addEventListener('DOMContentLoaded', init); 