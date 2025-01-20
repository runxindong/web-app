/**
 * 键盘导航示例
 */

(() => {
    // 模态框管理
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modal = document.getElementById('modal');
    const modalContent = modal.querySelector('.modal-content');

    // 存储上一个焦点元素
    let previousActiveElement;

    // 获取模态框中所有可聚焦元素
    const getFocusableElements = () => {
        return modalContent.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
    };

    // 焦点陷阱
    const trapFocus = (event) => {
        const focusableElements = getFocusableElements();
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        // 如果按下Shift+Tab
        if (event.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                event.preventDefault();
            }
        }
        // 如果按下Tab
        else {
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                event.preventDefault();
            }
        }
    };

    // 打开模态框
    const openModal = () => {
        previousActiveElement = document.activeElement;
        modal.hidden = false;
        
        // 设置初始焦点
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }

        // 添加键盘事件监听
        modal.addEventListener('keydown', handleModalKeydown);
    };

    // 关闭模态框
    const closeModal = () => {
        modal.hidden = true;
        modal.removeEventListener('keydown', handleModalKeydown);
        
        // 恢复焦点
        if (previousActiveElement) {
            previousActiveElement.focus();
        }
    };

    // 处理模态框键盘事件
    const handleModalKeydown = (event) => {
        // ESC键关闭模态框
        if (event.key === 'Escape') {
            closeModal();
            return;
        }

        // Tab键焦点陷阱
        if (event.key === 'Tab') {
            trapFocus(event);
        }
    };

    // 绑定事件
    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);

    // 快捷键支持
    document.addEventListener('keydown', (event) => {
        // Alt + S = 保存
        if (event.altKey && event.key === 's') {
            event.preventDefault();
            console.log('触发保存操作');
        }
        // Alt + C = 取消
        else if (event.altKey && event.key === 'c') {
            event.preventDefault();
            console.log('触发取消操作');
        }
    });

    // Tab序列管理
    const tabOrderButtons = document.querySelectorAll('.tab-order button');
    let currentTabIndex = 1;

    tabOrderButtons.forEach(button => {
        button.addEventListener('click', () => {
            const nextIndex = (parseInt(button.getAttribute('tabindex')) % tabOrderButtons.length) + 1;
            const nextButton = document.querySelector(`[tabindex="${nextIndex}"]`);
            if (nextButton) {
                nextButton.focus();
            }
        });

        // 添加键盘导航
        button.addEventListener('keydown', (event) => {
            let targetButton;

            switch (event.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    event.preventDefault();
                    targetButton = document.querySelector(`[tabindex="${(currentTabIndex % tabOrderButtons.length) + 1}"]`);
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    event.preventDefault();
                    targetButton = document.querySelector(`[tabindex="${currentTabIndex === 1 ? tabOrderButtons.length : currentTabIndex - 1}"]`);
                    break;
                case 'Home':
                    event.preventDefault();
                    targetButton = document.querySelector('[tabindex="1"]');
                    break;
                case 'End':
                    event.preventDefault();
                    targetButton = document.querySelector(`[tabindex="${tabOrderButtons.length}"]`);
                    break;
            }

            if (targetButton) {
                targetButton.focus();
                currentTabIndex = parseInt(targetButton.getAttribute('tabindex'));
            }
        });
    });

    // 焦点指示器
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
            document.body.classList.add('keyboard-user');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-user');
    });

    // 区域导航
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        // 确保每个区域都可以通过键盘访问
        if (!section.hasAttribute('tabindex')) {
            section.setAttribute('tabindex', '-1');
        }

        // 添加键盘快捷键导航
        const sectionId = section.id;
        if (sectionId) {
            document.addEventListener('keydown', (event) => {
                // Alt + 数字键快速导航到对应区域
                if (event.altKey && !isNaN(event.key)) {
                    const index = parseInt(event.key) - 1;
                    if (index >= 0 && index < sections.length) {
                        event.preventDefault();
                        sections[index].focus();
                        sections[index].scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        }
    });
})(); 