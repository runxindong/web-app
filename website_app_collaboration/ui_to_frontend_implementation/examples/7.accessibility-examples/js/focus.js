/**
 * 焦点管理示例
 */

(() => {
    // 焦点管理器类
    class FocusManager {
        constructor() {
            this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
            this.focusHistory = [];
            this.maxHistoryLength = 10;
            
            this.initializeEventListeners();
        }

        // 初始化事件监听
        initializeEventListeners() {
            document.addEventListener('focusin', this.handleFocusIn.bind(this));
            document.addEventListener('keydown', this.handleKeyDown.bind(this));
        }

        // 处理焦点进入事件
        handleFocusIn(event) {
            const element = event.target;
            
            // 记录焦点历史
            this.focusHistory.push(element);
            if (this.focusHistory.length > this.maxHistoryLength) {
                this.focusHistory.shift();
            }

            // 添加焦点样式
            this.addFocusStyles(element);
        }

        // 处理键盘事件
        handleKeyDown(event) {
            // Ctrl + Z 返回上一个焦点
            if (event.ctrlKey && event.key === 'z' && this.focusHistory.length > 1) {
                event.preventDefault();
                const previousElement = this.focusHistory[this.focusHistory.length - 2];
                if (previousElement && document.contains(previousElement)) {
                    previousElement.focus();
                }
            }
        }

        // 添加焦点样式
        addFocusStyles(element) {
            // 移除其他元素的焦点样式
            document.querySelectorAll('.focus-visible').forEach(el => {
                el.classList.remove('focus-visible');
            });

            // 添加当前元素的焦点样式
            element.classList.add('focus-visible');
        }

        // 获取可聚焦元素
        getFocusableElements(container = document) {
            return Array.from(container.querySelectorAll(this.focusableElements));
        }

        // 设置初始焦点
        setInitialFocus(container) {
            const focusableElements = this.getFocusableElements(container);
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }

        // 恢复焦点
        restoreFocus(element) {
            if (element && document.contains(element)) {
                element.focus();
                return true;
            }
            return false;
        }
    }

    // 创建焦点管理器实例
    const focusManager = new FocusManager();

    // 跳转链接管理
    const skipLinks = document.querySelectorAll('.skip-link');
    
    skipLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.tabIndex = -1;
                targetElement.focus();
                
                // 移除临时tabindex
                targetElement.addEventListener('blur', () => {
                    targetElement.removeAttribute('tabindex');
                }, { once: true });
            }
        });
    });

    // 焦点陷阱组件
    class FocusTrap {
        constructor(element) {
            this.element = element;
            this.firstFocusable = null;
            this.lastFocusable = null;
            this.isActive = false;

            this.updateFocusableElements();
        }

        updateFocusableElements() {
            const focusableElements = focusManager.getFocusableElements(this.element);
            if (focusableElements.length > 0) {
                this.firstFocusable = focusableElements[0];
                this.lastFocusable = focusableElements[focusableElements.length - 1];
            }
        }

        activate() {
            if (!this.isActive) {
                this.isActive = true;
                this.element.addEventListener('keydown', this.handleKeyDown.bind(this));
                this.firstFocusable?.focus();
            }
        }

        deactivate() {
            if (this.isActive) {
                this.isActive = false;
                this.element.removeEventListener('keydown', this.handleKeyDown.bind(this));
            }
        }

        handleKeyDown(event) {
            if (event.key === 'Tab') {
                if (event.shiftKey) {
                    if (document.activeElement === this.firstFocusable) {
                        event.preventDefault();
                        this.lastFocusable?.focus();
                    }
                } else {
                    if (document.activeElement === this.lastFocusable) {
                        event.preventDefault();
                        this.firstFocusable?.focus();
                    }
                }
            }
        }
    }

    // 初始化焦点陷阱
    const trapContainers = document.querySelectorAll('[data-focus-trap]');
    const focusTraps = new Map();

    trapContainers.forEach(container => {
        const trap = new FocusTrap(container);
        focusTraps.set(container, trap);

        // 根据可见性自动激活/停用焦点陷阱
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'hidden') {
                    const trap = focusTraps.get(mutation.target);
                    if (trap) {
                        if (mutation.target.hidden) {
                            trap.deactivate();
                        } else {
                            trap.activate();
                        }
                    }
                }
            });
        });

        observer.observe(container, { attributes: true });
    });

    // 焦点组管理
    class FocusGroup {
        constructor(container) {
            this.container = container;
            this.elements = Array.from(container.querySelectorAll('[role="tab"], [role="menuitem"]'));
            this.currentIndex = 0;

            this.init();
        }

        init() {
            this.elements.forEach((element, index) => {
                element.addEventListener('keydown', (event) => this.handleKeyDown(event, index));
            });
        }

        handleKeyDown(event, index) {
            let newIndex;

            switch (event.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    event.preventDefault();
                    newIndex = (index + 1) % this.elements.length;
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    event.preventDefault();
                    newIndex = (index - 1 + this.elements.length) % this.elements.length;
                    break;
                case 'Home':
                    event.preventDefault();
                    newIndex = 0;
                    break;
                case 'End':
                    event.preventDefault();
                    newIndex = this.elements.length - 1;
                    break;
                default:
                    return;
            }

            this.elements[newIndex].focus();
            this.currentIndex = newIndex;
        }
    }

    // 初始化焦点组
    const focusGroups = document.querySelectorAll('[role="tablist"], [role="menu"]');
    focusGroups.forEach(group => new FocusGroup(group));

    // 导出全局实例
    window.focusManager = focusManager;
})(); 