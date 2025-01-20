/**
 * ARIA属性示例
 */

(() => {
    // 标签页组件
    class TabPanel {
        constructor(container) {
            this.container = container;
            this.tabList = container.querySelector('[role="tablist"]');
            this.tabs = Array.from(this.tabList.querySelectorAll('[role="tab"]'));
            this.panels = this.tabs.map(tab => {
                return document.getElementById(tab.getAttribute('aria-controls'));
            });

            this.init();
        }

        init() {
            // 设置初始状态
            this.tabs.forEach((tab, index) => {
                const panel = this.panels[index];
                const isSelected = tab.getAttribute('aria-selected') === 'true';

                // 设置标签页属性
                tab.setAttribute('id', `tab-${index}`);
                tab.setAttribute('aria-controls', panel.id);
                tab.setAttribute('tabindex', isSelected ? '0' : '-1');

                // 设置面板属性
                panel.setAttribute('aria-labelledby', `tab-${index}`);
                panel.hidden = !isSelected;

                // 绑定事件
                tab.addEventListener('click', () => this.selectTab(index));
                tab.addEventListener('keydown', (event) => this.handleKeyDown(event, index));
            });
        }

        selectTab(index) {
            this.tabs.forEach((tab, i) => {
                const panel = this.panels[i];
                const isSelected = i === index;

                tab.setAttribute('aria-selected', isSelected);
                tab.setAttribute('tabindex', isSelected ? '0' : '-1');
                panel.hidden = !isSelected;

                if (isSelected) {
                    tab.focus();
                }
            });
        }

        handleKeyDown(event, index) {
            let newIndex;

            switch (event.key) {
                case 'ArrowLeft':
                    newIndex = index === 0 ? this.tabs.length - 1 : index - 1;
                    break;
                case 'ArrowRight':
                    newIndex = index === this.tabs.length - 1 ? 0 : index + 1;
                    break;
                case 'Home':
                    newIndex = 0;
                    break;
                case 'End':
                    newIndex = this.tabs.length - 1;
                    break;
                default:
                    return;
            }

            event.preventDefault();
            this.selectTab(newIndex);
        }
    }

    // 树形菜单组件
    class TreeView {
        constructor(container) {
            this.container = container;
            this.items = Array.from(container.querySelectorAll('[role="treeitem"]'));
            
            this.init();
        }

        init() {
            this.items.forEach(item => {
                const button = item.querySelector('button');
                const subItems = item.querySelector('[role="group"]');
                
                if (button && subItems) {
                    button.setAttribute('aria-expanded', 'false');
                    subItems.hidden = true;

                    button.addEventListener('click', () => {
                        const isExpanded = button.getAttribute('aria-expanded') === 'true';
                        button.setAttribute('aria-expanded', !isExpanded);
                        subItems.hidden = isExpanded;
                    });
                }

                // 设置层级关系
                if (item.parentElement.getAttribute('role') === 'group') {
                    item.setAttribute('aria-level', '2');
            } else {
                    item.setAttribute('aria-level', '1');
                }
            });
        }
    }

    // 菜单组件
    class Menu {
        constructor(container) {
            this.container = container;
            this.button = container.querySelector('[aria-haspopup="true"]');
            this.menu = container.querySelector('[role="menu"]');
            this.menuItems = Array.from(this.menu.querySelectorAll('[role="menuitem"]'));
            
            this.init();
        }

        init() {
            this.button.addEventListener('click', () => this.toggleMenu());
            this.button.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.openMenu();
                }
            });

            // 菜单项键盘导航
            this.menuItems.forEach((item, index) => {
                item.addEventListener('keydown', (event) => {
                    switch (event.key) {
                        case 'ArrowDown':
                            event.preventDefault();
                            this.focusMenuItem(index + 1);
                            break;
                        case 'ArrowUp':
                            event.preventDefault();
                            this.focusMenuItem(index - 1);
                            break;
                        case 'Home':
                            event.preventDefault();
                            this.focusMenuItem(0);
                            break;
                        case 'End':
                            event.preventDefault();
                            this.focusMenuItem(this.menuItems.length - 1);
                            break;
                        case 'Escape':
                            event.preventDefault();
                            this.closeMenu();
                            break;
                        case 'Enter':
                        case ' ':
                            event.preventDefault();
                            this.selectMenuItem(item);
                            break;
                    }
                });

                item.addEventListener('click', () => this.selectMenuItem(item));
            });

            // 点击外部关闭菜单
            document.addEventListener('click', (event) => {
                if (!this.container.contains(event.target)) {
                    this.closeMenu();
                }
            });
        }

        toggleMenu() {
            const isExpanded = this.button.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        }

        openMenu() {
            this.button.setAttribute('aria-expanded', 'true');
            this.menu.hidden = false;
            this.menuItems[0]?.focus();
        }

        closeMenu() {
            this.button.setAttribute('aria-expanded', 'false');
            this.menu.hidden = true;
            this.button.focus();
        }

        focusMenuItem(index) {
            if (index < 0) {
                index = this.menuItems.length - 1;
            } else if (index >= this.menuItems.length) {
                index = 0;
            }
            this.menuItems[index].focus();
        }

        selectMenuItem(item) {
            this.menuItems.forEach(menuItem => {
                menuItem.setAttribute('aria-selected', menuItem === item);
            });
            this.closeMenu();
        }
    }

    // 对话框组件
    class Dialog {
        constructor(container) {
            this.container = container;
            this.dialog = container.querySelector('[role="dialog"]');
            this.openButton = container.querySelector('[data-dialog-open]');
            this.closeButton = container.querySelector('[data-dialog-close]');
            
            this.init();
        }

        init() {
            this.openButton.addEventListener('click', () => this.openDialog());
            this.closeButton.addEventListener('click', () => this.closeDialog());

            // ESC键关闭对话框
            this.dialog.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    this.closeDialog();
                }
            });
        }

        openDialog() {
            this.dialog.hidden = false;
            this.dialog.setAttribute('aria-modal', 'true');
            
            // 存储当前焦点
            this.previousActiveElement = document.activeElement;
            
            // 设置初始焦点
            const firstFocusable = this.dialog.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            firstFocusable?.focus();
        }

        closeDialog() {
            this.dialog.hidden = true;
            this.dialog.setAttribute('aria-modal', 'false');
            
            // 恢复焦点
            this.previousActiveElement?.focus();
        }
    }

    // 工具提示组件
    class Tooltip {
        constructor(container) {
            this.container = container;
            this.triggers = Array.from(container.querySelectorAll('[aria-describedby]'));
            
            this.init();
        }

        init() {
            this.triggers.forEach(trigger => {
                const tooltipId = trigger.getAttribute('aria-describedby');
                const tooltip = document.getElementById(tooltipId);

                if (tooltip) {
                    // 鼠标事件
                    trigger.addEventListener('mouseenter', () => this.showTooltip(tooltip));
                    trigger.addEventListener('mouseleave', () => this.hideTooltip(tooltip));

                    // 键盘事件
                    trigger.addEventListener('focus', () => this.showTooltip(tooltip));
                    trigger.addEventListener('blur', () => this.hideTooltip(tooltip));

                    // ESC键关闭
                    trigger.addEventListener('keydown', (event) => {
                        if (event.key === 'Escape') {
                            this.hideTooltip(tooltip);
                        }
                    });
                }
            });
        }

        showTooltip(tooltip) {
            tooltip.hidden = false;
        }

        hideTooltip(tooltip) {
            tooltip.hidden = true;
        }
    }

    // 初始化组件
    document.querySelectorAll('[role="tablist"]').forEach(container => {
        new TabPanel(container.closest('.tab-container'));
    });

    document.querySelectorAll('[role="tree"]').forEach(container => {
        new TreeView(container);
    });

    document.querySelectorAll('.menu-container').forEach(container => {
        new Menu(container);
    });

    document.querySelectorAll('.dialog-container').forEach(container => {
        new Dialog(container);
    });

    document.querySelectorAll('.tooltip-container').forEach(container => {
        new Tooltip(container);
    });
})(); 