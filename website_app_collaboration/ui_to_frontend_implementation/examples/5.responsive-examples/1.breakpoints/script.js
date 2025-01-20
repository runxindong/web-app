// 断点管理工具
const breakpoints = {
    mobile: 767,
    tablet: 1023,
    desktop: 1199
};

// 断点检测函数
function checkBreakpoint() {
    const width = window.innerWidth;
    let currentBreakpoint = '';

    if (width <= breakpoints.mobile) {
        currentBreakpoint = 'mobile';
    } else if (width <= breakpoints.tablet) {
        currentBreakpoint = 'tablet';
    } else if (width <= breakpoints.desktop) {
        currentBreakpoint = 'desktop';
    } else {
        currentBreakpoint = 'large';
    }

    document.body.dataset.breakpoint = currentBreakpoint;
    return currentBreakpoint;
}

// 响应式图片加载
function handleResponsiveImages() {
    const images = document.querySelectorAll('img[data-src]');
    const breakpoint = checkBreakpoint();

    images.forEach(img => {
        const sources = JSON.parse(img.dataset.src);
        img.src = sources[breakpoint] || sources.default;
    });
}

// 响应式导航
function handleResponsiveNav() {
    const nav = document.querySelector('nav');
    const breakpoint = checkBreakpoint();

    if (breakpoint === 'mobile') {
        if (!nav.querySelector('.menu-toggle')) {
            const toggle = document.createElement('button');
            toggle.className = 'menu-toggle';
            toggle.innerHTML = '菜单';
            toggle.addEventListener('click', () => {
                nav.classList.toggle('nav-open');
            });
            nav.prepend(toggle);
        }
    } else {
        const toggle = nav.querySelector('.menu-toggle');
        if (toggle) {
            toggle.remove();
        }
        nav.classList.remove('nav-open');
    }
}

// 响应式表单验证
function initFormValidation() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = form.querySelector('#name').value;
        const email = form.querySelector('#email').value;
        const message = form.querySelector('#message').value;

        // 简单验证
        if (name.length < 2) {
            alert('姓名至少需要2个字符');
            return;
        }

        if (!email.includes('@')) {
            alert('请输入有效的邮箱地址');
            return;
        }

        if (message.length < 10) {
            alert('留言至少需要10个字符');
            return;
        }

        // 模拟表单提交
        console.log('表单提交:', { name, email, message });
        alert('表单提交成功！');
        form.reset();
    });
}

// 响应式工具提示
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.dataset.tooltip;
            
            // 根据断点调整位置
            const breakpoint = checkBreakpoint();
            if (breakpoint === 'mobile') {
                tooltip.style.maxWidth = '200px';
            }

            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.top = `${rect.bottom + 5}px`;
            tooltip.style.left = `${rect.left}px`;
        });

        element.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// 响应式代码高亮
function initCodeHighlight() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        // 添加行号
        const lines = block.textContent.split('\n');
        block.innerHTML = lines.map((line, index) => 
            `<span class="line">${line}</span>`
        ).join('\n');

        // 根据断点调整字体大小
        const breakpoint = checkBreakpoint();
        if (breakpoint === 'mobile') {
            block.style.fontSize = '14px';
        } else {
            block.style.fontSize = '16px';
        }
    });
}

// 初始化函数
function init() {
    // 初始检查断点
    checkBreakpoint();

    // 初始化各个功能
    handleResponsiveImages();
    handleResponsiveNav();
    initFormValidation();
    initTooltips();
    initCodeHighlight();

    // 监听窗口调整
    window.addEventListener('resize', () => {
        checkBreakpoint();
        handleResponsiveImages();
        handleResponsiveNav();
        initCodeHighlight();
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 