// 移动优先的JavaScript功能

// 移动菜单控制
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (!menuToggle || !mainNav) return;

    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // 切换菜单按钮样式
        const spans = menuToggle.querySelectorAll('span');
        spans.forEach(span => span.classList.toggle('active'));
    });

    // 点击导航链接时关闭菜单
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuToggle.querySelectorAll('span').forEach(span => 
                span.classList.remove('active')
            );
        });
    });
}

// 响应式图片加载
function initResponsiveImages() {
    const images = document.querySelectorAll('img[data-srcset]');
    
    function loadAppropriateImage() {
        const width = window.innerWidth;
        
        images.forEach(img => {
            const srcset = img.dataset.srcset;
            if (!srcset) return;

            const sources = JSON.parse(srcset);
            let appropriateSource;

            if (width < 768) {
                appropriateSource = sources.mobile;
            } else if (width < 1024) {
                appropriateSource = sources.tablet;
            } else {
                appropriateSource = sources.desktop;
            }

            if (appropriateSource && img.src !== appropriateSource) {
                img.src = appropriateSource;
            }
        });
    }

    loadAppropriateImage();
    window.addEventListener('resize', loadAppropriateImage);
}

// 平滑滚动
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;

            const headerOffset = 60;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// 表单验证
function initFormValidation() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const formData = new FormData(form);
        const errors = [];

        // 验证名字
        const name = formData.get('name');
        if (!name || name.length < 2) {
            isValid = false;
            errors.push('名字至少需要2个字符');
        }

        // 验证邮箱
        const email = formData.get('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            isValid = false;
            errors.push('请输入有效的邮箱地址');
        }

        // 验证消息
        const message = formData.get('message');
        if (!message || message.length < 10) {
            isValid = false;
            errors.push('消息至少需要10个字符');
        }

        if (!isValid) {
            showFormErrors(errors);
            return;
        }

        // 模拟表单提交
        console.log('提交表单数据:', Object.fromEntries(formData));
        showSuccessMessage();
        form.reset();
    });
}

// 显示表单错误
function showFormErrors(errors) {
    const errorContainer = document.querySelector('.form-errors') || 
        createErrorContainer();
    
    errorContainer.innerHTML = errors.map(error => 
        `<p class="error-message">${error}</p>`
    ).join('');
}

// 创建错误容器
function createErrorContainer() {
    const container = document.createElement('div');
    container.className = 'form-errors';
    const form = document.querySelector('.contact-form');
    form.insertBefore(container, form.firstChild);
    return container;
}

// 显示成功消息
function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = '表单提交成功！';
    
    const form = document.querySelector('.contact-form');
    form.insertBefore(successMessage, form.firstChild);

    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

// 响应式图片懒加载
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // 回退方案
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
}

// 性能监控
function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`页面加载时间: ${loadTime}ms`);
        });
    }
}

// 初始化所有功能
function init() {
    initMobileMenu();
    initResponsiveImages();
    initSmoothScroll();
    initFormValidation();
    initLazyLoading();
    initPerformanceMonitoring();

    // 添加调整大小防抖
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            console.log('窗口调整完成');
        }, 250);
    });
}

// 当DOM加载完成时初始化
document.addEventListener('DOMContentLoaded', init); 