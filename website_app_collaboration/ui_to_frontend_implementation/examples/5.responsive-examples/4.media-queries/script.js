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

// 检测和更新屏幕方向 / Detect and Update Screen Orientation
function updateOrientation() {
    const orientationText = document.querySelector('.orientation-text');
    if (orientationText) {
        const isPortrait = window.matchMedia('(orientation: portrait)').matches;
        orientationText.textContent = isPortrait ? 
            '竖屏 / Portrait' : 
            '横屏 / Landscape';
    }
}

// 检测和更新宽高比 / Detect and Update Aspect Ratio
function updateAspectRatio() {
    const aspectRatioText = document.querySelector('.aspect-ratio-text');
    if (aspectRatioText) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const ratio = (width / height).toFixed(2);
        aspectRatioText.textContent = `${ratio} (${width}x${height})`;
    }
}

// 检测指针类型 / Detect Pointer Type
function detectPointerType() {
    const pointerText = document.querySelector('.pointer-text');
    if (pointerText) {
        if (window.matchMedia('(pointer: fine)').matches) {
            pointerText.textContent = '精确指针 / Fine pointer (mouse)';
        } else if (window.matchMedia('(pointer: coarse)').matches) {
            pointerText.textContent = '粗略指针 / Coarse pointer (touch)';
        } else {
            pointerText.textContent = '无指针 / No pointer';
        }
    }
}

// 检测系统主题 / Detect System Theme
function detectColorScheme() {
    const themeText = document.querySelector('.theme-text');
    if (themeText) {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        themeText.textContent = isDarkMode ? 
            '深色模式 / Dark Mode' : 
            '浅色模式 / Light Mode';
    }
}

// 监听媒体查询变化 / Listen to Media Query Changes
function initMediaQueryListeners() {
    // 方向变化监听 / Orientation Change Listener
    window.matchMedia('(orientation: portrait)').addListener(updateOrientation);

    // 颜色方案变化监听 / Color Scheme Change Listener
    window.matchMedia('(prefers-color-scheme: dark)').addListener(detectColorScheme);

    // 视窗大小变化监听 / Viewport Size Change Listener
    window.addEventListener('resize', () => {
        updateAspectRatio();
        updateFeatureDetection();
    });
}

// 更新特性检测显示 / Update Feature Detection Display
function updateFeatureDetection() {
    // 更新所有检测结果 / Update all detection results
    updateOrientation();
    updateAspectRatio();
    detectPointerType();
    detectColorScheme();
}

// 初始化所有功能 / Initialize All Features
function init() {
    initNavigation();
    updateFeatureDetection();
    initMediaQueryListeners();

    // 添加示例交互效果 / Add Example Interactions
    const hoverDemo = document.querySelector('.hover-demo');
    if (hoverDemo) {
        hoverDemo.addEventListener('mouseenter', () => {
            if (window.matchMedia('(hover: hover)').matches) {
                hoverDemo.style.backgroundColor = 'var(--secondary-color)';
                hoverDemo.style.color = 'var(--light-text)';
            }
        });

        hoverDemo.addEventListener('mouseleave', () => {
            if (window.matchMedia('(hover: hover)').matches) {
                hoverDemo.style.backgroundColor = 'white';
                hoverDemo.style.color = 'var(--text-color)';
            }
        });
    }
}

// 页面加载完成后初始化 / Initialize After Page Load
document.addEventListener('DOMContentLoaded', init); 