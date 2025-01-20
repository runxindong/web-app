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

// 布局状态监控 / Layout State Monitoring
function initLayoutMonitor() {
    const layoutStates = {
        mobile: window.matchMedia('(max-width: 767px)'),
        tablet: window.matchMedia('(min-width: 768px) and (max-width: 1023px)'),
        desktop: window.matchMedia('(min-width: 1024px)')
    };

    function updateLayoutState() {
        let currentState = '';
        for (const [state, query] of Object.entries(layoutStates)) {
            if (query.matches) {
                currentState = state;
                break;
            }
        }
        document.body.dataset.layout = currentState;
        handleLayoutChange(currentState);
    }

    // 监听媒体查询变化 / Listen to Media Query Changes
    Object.values(layoutStates).forEach(query => {
        query.addListener(updateLayoutState);
    });

    // 初始状态设置 / Initial State Setting
    updateLayoutState();
}

// 处理布局变化 / Handle Layout Changes
function handleLayoutChange(state) {
    // 流式布局调整 / Fluid Layout Adjustment
    adjustFluidLayout(state);
    
    // 网格布局调整 / Grid Layout Adjustment
    adjustGridLayout(state);
    
    // 弹性布局调整 / Flex Layout Adjustment
    adjustFlexLayout(state);
    
    // 混合布局调整 / Hybrid Layout Adjustment
    adjustHybridLayout(state);
}

// 流式布局调整 / Fluid Layout Adjustment
function adjustFluidLayout(state) {
    const fluidItems = document.querySelectorAll('.fluid-item');
    
    fluidItems.forEach(item => {
        switch(state) {
            case 'mobile':
                item.style.minWidth = '100%';
                break;
            case 'tablet':
                item.style.minWidth = '45%';
                break;
            case 'desktop':
                item.style.minWidth = '250px';
                break;
        }
    });
}

// 网格布局调整 / Grid Layout Adjustment
function adjustGridLayout(state) {
    const gridContainers = document.querySelectorAll('.grid-container, .auto-grid');
    
    gridContainers.forEach(container => {
        switch(state) {
            case 'mobile':
                container.style.gridTemplateColumns = '1fr';
                break;
            case 'tablet':
                container.style.gridTemplateColumns = 'repeat(2, 1fr)';
                break;
            case 'desktop':
                // 恢复到CSS中定义的默认值
                container.style.gridTemplateColumns = '';
                break;
        }
    });
}

// 弹性布局调整 / Flex Layout Adjustment
function adjustFlexLayout(state) {
    const flexContainers = document.querySelectorAll('.flex-container, .card-container');
    
    flexContainers.forEach(container => {
        switch(state) {
            case 'mobile':
                container.style.flexDirection = 'column';
                break;
            default:
                container.style.flexDirection = 'row';
                break;
        }
    });
}

// 混合布局调整 / Hybrid Layout Adjustment
function adjustHybridLayout(state) {
    const hybridMain = document.querySelector('.hybrid-main');
    
    if (hybridMain) {
        switch(state) {
            case 'mobile':
                hybridMain.style.gridTemplateColumns = '1fr';
                break;
            case 'tablet':
                hybridMain.style.gridTemplateColumns = '1fr';
                break;
            case 'desktop':
                hybridMain.style.gridTemplateColumns = '2fr 1fr';
                break;
        }
    }
}

// 平滑滚动 / Smooth Scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // 移动端菜单关闭 / Mobile Menu Closing
                const navList = document.querySelector('.nav-list');
                if (navList) {
                    navList.classList.remove('active');
                }
            }
        });
    });
}

// 布局演示增强 / Layout Demo Enhancement
function enhanceLayoutDemos() {
    // 添加交互效果 / Add Interactive Effects
    document.querySelectorAll('.grid-item, .flex-item, .card').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // 添加动态内容示例 / Add Dynamic Content Example
    const dynamicContainers = document.querySelectorAll('.grid-container, .flex-container');
    dynamicContainers.forEach(container => {
        const addButton = document.createElement('button');
        addButton.textContent = '添加项目 / Add Item';
        addButton.className = 'add-item-button';
        addButton.onclick = () => addDynamicItem(container);
        container.parentElement.insertBefore(addButton, container.nextSibling);
    });
}

// 添加动态项目 / Add Dynamic Item
function addDynamicItem(container) {
    const isGrid = container.classList.contains('grid-container');
    const newItem = document.createElement('div');
    newItem.className = isGrid ? 'grid-item' : 'flex-item';
    newItem.textContent = `${container.children.length + 1}`;
    
    // 添加动画效果 / Add Animation Effect
    newItem.style.opacity = '0';
    container.appendChild(newItem);
    requestAnimationFrame(() => {
        newItem.style.transition = 'opacity 0.3s ease';
        newItem.style.opacity = '1';
    });
}

// 性能监控 / Performance Monitoring
function monitorLayoutPerformance() {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver(list => {
            list.getEntries().forEach(entry => {
                // 记录布局性能 / Log Layout Performance
                console.log(`Layout shift: ${entry.value}`);
                console.log(`Layout shift sources:`, entry.sources);
            });
        });

        observer.observe({ entryTypes: ['layout-shift'] });
    }
}

// 初始化所有功能 / Initialize All Features
function init() {
    initNavigation();
    initLayoutMonitor();
    initSmoothScroll();
    enhanceLayoutDemos();
    monitorLayoutPerformance();
}

// 页面加载完成后初始化 / Initialize After Page Load
document.addEventListener('DOMContentLoaded', init); 