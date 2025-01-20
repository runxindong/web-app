// 可访问性测试工具类
class AccessibilityTestUtil {
    constructor() {
        this.violations = [];
        this.warnings = [];
    }

    // 清除测试结果
    clearResults() {
        this.violations = [];
        this.warnings = [];
    }

    // 添加违规
    addViolation(violation) {
        this.violations.push(violation);
    }

    // 添加警告
    addWarning(warning) {
        this.warnings.push(warning);
    }

    // 获取测试结果
    getResults() {
        return {
            violations: this.violations,
            warnings: this.warnings,
            totalViolations: this.violations.length,
            totalWarnings: this.warnings.length
        };
    }
}

// 导航菜单可访问性测试类
class NavigationAccessibilityTest {
    constructor(container) {
        this.container = container;
        this.testUtil = new AccessibilityTestUtil();
    }

    // 测试键盘导航
    testKeyboardNavigation() {
        const menuItems = this.container.querySelectorAll('a, button');
        menuItems.forEach(item => {
            if (!item.getAttribute('tabindex') && !item.disabled) {
                this.testUtil.addWarning({
                    element: item,
                    message: 'Interactive element should have a tabindex if not naturally focusable'
                });
            }
        });

        const focusableElements = this.container.querySelectorAll('[tabindex]');
        focusableElements.forEach(element => {
            const tabindex = parseInt(element.getAttribute('tabindex'));
            if (tabindex < 0 && !element.disabled) {
                this.testUtil.addViolation({
                    element,
                    message: 'Negative tabindex prevents keyboard navigation'
                });
            }
        });
    }

    // 测试ARIA标签
    testAriaLabels() {
        const ariaElements = this.container.querySelectorAll('[role], [aria-label], [aria-labelledby]');
        ariaElements.forEach(element => {
            if (element.hasAttribute('role')) {
                const role = element.getAttribute('role');
                if (!this.isValidAriaRole(role)) {
                    this.testUtil.addViolation({
                        element,
                        message: `Invalid ARIA role: ${role}`
                    });
                }
            }

            if (element.hasAttribute('aria-labelledby')) {
                const labelId = element.getAttribute('aria-labelledby');
                const labelElement = document.getElementById(labelId);
                if (!labelElement) {
                    this.testUtil.addViolation({
                        element,
                        message: `Missing element with id: ${labelId} referenced by aria-labelledby`
                    });
                }
            }
        });
    }

    // 测试颜色对比度
    testColorContrast() {
        const textElements = this.container.querySelectorAll('*');
        textElements.forEach(element => {
            const style = window.getComputedStyle(element);
            const backgroundColor = style.backgroundColor;
            const color = style.color;

            if (backgroundColor && color) {
                const contrast = this.calculateColorContrast(backgroundColor, color);
                if (contrast < 4.5) {
                    this.testUtil.addViolation({
                        element,
                        message: `Insufficient color contrast ratio: ${contrast.toFixed(2)}:1`
                    });
                }
            }
        });
    }

    // 测试焦点指示器
    testFocusIndicators() {
        const interactiveElements = this.container.querySelectorAll('a, button, input, select, textarea');
        interactiveElements.forEach(element => {
            const style = window.getComputedStyle(element);
            if (style.outlineStyle === 'none' || style.outlineWidth === '0px') {
                this.testUtil.addWarning({
                    element,
                    message: 'Interactive element may lack visible focus indicator'
                });
            }
        });
    }

    // 验证ARIA角色
    isValidAriaRole(role) {
        const validRoles = [
            'alert', 'alertdialog', 'application', 'article', 'banner',
            'button', 'cell', 'checkbox', 'columnheader', 'combobox',
            'complementary', 'contentinfo', 'definition', 'dialog',
            'directory', 'document', 'feed', 'figure', 'form', 'grid',
            'gridcell', 'group', 'heading', 'img', 'link', 'list',
            'listbox', 'listitem', 'log', 'main', 'marquee', 'math',
            'menu', 'menubar', 'menuitem', 'menuitemcheckbox',
            'menuitemradio', 'navigation', 'none', 'note', 'option',
            'presentation', 'progressbar', 'radio', 'radiogroup',
            'region', 'row', 'rowgroup', 'rowheader', 'scrollbar',
            'search', 'searchbox', 'separator', 'slider', 'spinbutton',
            'status', 'switch', 'tab', 'table', 'tablist', 'tabpanel',
            'term', 'textbox', 'timer', 'toolbar', 'tooltip', 'tree',
            'treegrid', 'treeitem'
        ];
        return validRoles.includes(role);
    }

    // 计算颜色对比度
    calculateColorContrast(background, foreground) {
        // 简化的对比度计算
        const getRGB = (color) => {
            const hex = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            return hex ? [parseInt(hex[1]), parseInt(hex[2]), parseInt(hex[3])] : [0, 0, 0];
        };

        const getLuminance = (r, g, b) => {
            const [rs, gs, bs] = [r / 255, g / 255, b / 255].map(val => {
                return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        };

        const [r1, g1, b1] = getRGB(background);
        const [r2, g2, b2] = getRGB(foreground);
        const l1 = getLuminance(r1, g1, b1);
        const l2 = getLuminance(r2, g2, b2);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        return ratio;
    }

    // 运行所有测试
    runAllTests() {
        this.testUtil.clearResults();
        this.testKeyboardNavigation();
        this.testAriaLabels();
        this.testColorContrast();
        this.testFocusIndicators();
        return this.testUtil.getResults();
    }
}

// 表单可访问性测试类
class FormAccessibilityTest {
    constructor(container) {
        this.container = container;
        this.testUtil = new AccessibilityTestUtil();
    }

    // 测试表单标签
    testFormLabels() {
        const formControls = this.container.querySelectorAll('input, select, textarea');
        formControls.forEach(control => {
            if (!control.hasAttribute('aria-label') && !control.hasAttribute('aria-labelledby')) {
                const id = control.getAttribute('id');
                if (!id || !this.container.querySelector(`label[for="${id}"]`)) {
                    this.testUtil.addViolation({
                        element: control,
                        message: 'Form control lacks an associated label'
                    });
                }
            }
        });
    }

    // 测试错误消息
    testErrorMessages() {
        const formControls = this.container.querySelectorAll('input, select, textarea');
        formControls.forEach(control => {
            if (!control.hasAttribute('aria-describedby')) {
                this.testUtil.addWarning({
                    element: control,
                    message: 'Form control should have associated error message container'
                });
            } else {
                const descriptionId = control.getAttribute('aria-describedby');
                const descriptionElement = document.getElementById(descriptionId);
                if (!descriptionElement) {
                    this.testUtil.addViolation({
                        element: control,
                        message: `Missing error message container with id: ${descriptionId}`
                    });
                }
            }
        });
    }

    // 测试必填字段标记
    testRequiredFields() {
        const requiredFields = this.container.querySelectorAll('[required], [aria-required="true"]');
        requiredFields.forEach(field => {
            const label = this.container.querySelector(`label[for="${field.id}"]`);
            if (label && !label.textContent.includes('*') && !label.querySelector('.required-marker')) {
                this.testUtil.addWarning({
                    element: field,
                    message: 'Required field should be visually indicated'
                });
            }
        });
    }

    // 测试表单验证
    testFormValidation() {
        const form = this.container.querySelector('form');
        if (form) {
            const hasNoValidate = form.hasAttribute('novalidate');
            if (!hasNoValidate) {
                this.testUtil.addWarning({
                    element: form,
                    message: 'Form should use custom validation to ensure accessibility'
                });
            }

            const submitButton = form.querySelector('[type="submit"]');
            if (submitButton && !submitButton.hasAttribute('aria-disabled')) {
                this.testUtil.addWarning({
                    element: submitButton,
                    message: 'Submit button should indicate disabled state when form is invalid'
                });
            }
        }
    }

    // 运行所有测试
    runAllTests() {
        this.testUtil.clearResults();
        this.testFormLabels();
        this.testErrorMessages();
        this.testRequiredFields();
        this.testFormValidation();
        return this.testUtil.getResults();
    }
}

// 可访问性测试函数
async function runAccessibilityTests() {
    const testResults = {
        total: 0,
        passed: 0,
        failed: 0,
        results: []
    };

    function assert(condition, message, details = null) {
        testResults.total++;
        if (condition) {
            testResults.passed++;
            testResults.results.push({
                status: 'passed',
                message,
                details
            });
        } else {
            testResults.failed++;
            testResults.results.push({
                status: 'failed',
                message,
                details
            });
        }
    }

    console.log('Running Accessibility Tests...');

    try {
        // 测试导航菜单可访问性
        const navContainer = document.getElementById('accessible-nav');
        if (navContainer) {
            const navTest = new NavigationAccessibilityTest(navContainer);
            const navResults = navTest.runAllTests();

            assert(
                navResults.totalViolations === 0,
                'Navigation should have no accessibility violations',
                navResults
            );

            assert(
                navResults.totalWarnings < 3,
                'Navigation should have minimal accessibility warnings',
                navResults
            );
        }

        // 测试表单可访问性
        const formContainer = document.getElementById('accessible-form');
        if (formContainer) {
            const formTest = new FormAccessibilityTest(formContainer);
            const formResults = formTest.runAllTests();

            assert(
                formResults.totalViolations === 0,
                'Form should have no accessibility violations',
                formResults
            );

            assert(
                formResults.totalWarnings < 3,
                'Form should have minimal accessibility warnings',
                formResults
            );
        }

        // 测试页面标题和地标
        const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="complementary"]');
        assert(
            landmarks.length > 0,
            'Page should have proper landmark regions',
            { landmarksFound: landmarks.length }
        );

        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const headingLevels = Array.from(headings).map(h => parseInt(h.tagName[1]));
        assert(
            headingLevels.every((level, i) => i === 0 || level <= headingLevels[i - 1] + 1),
            'Heading levels should be properly structured',
            { headingLevels }
        );

        // 测试图片替代文本
        const images = document.querySelectorAll('img');
        let imagesWithAlt = 0;
        images.forEach(img => {
            if (img.hasAttribute('alt')) imagesWithAlt++;
        });
        assert(
            imagesWithAlt === images.length,
            'All images should have alt text',
            { total: images.length, withAlt: imagesWithAlt }
        );

        // 测试跳过导航链接
        const skipLink = document.querySelector('a[href^="#main"]');
        assert(
            skipLink !== null,
            'Page should have a skip navigation link',
            { skipLinkFound: skipLink !== null }
        );

    } catch (error) {
        console.error('Accessibility Test Error:', error);
        testResults.results.push({
            status: 'failed',
            message: `Unexpected error: ${error.message}`
        });
    }

    // 输出测试结果
    console.log('Accessibility Test Results:', testResults);
    return testResults;
}

// 在页面加载时运行可访问性测试
document.addEventListener('DOMContentLoaded', async () => {
    const testResults = await runAccessibilityTests();
    
    // 更新UI显示测试结果
    const resultsContainer = document.getElementById('accessibility-test-results');
    if (resultsContainer) {
        const summary = document.createElement('div');
        summary.innerHTML = `
            <h3>Accessibility Test Summary</h3>
            <p>Total Tests: ${testResults.total}</p>
            <p>Passed: ${testResults.passed}</p>
            <p>Failed: ${testResults.failed}</p>
        `;
        resultsContainer.appendChild(summary);

        const details = document.createElement('div');
        details.innerHTML = '<h3>Test Details</h3>';
        testResults.results.forEach((result, index) => {
            const resultElement = document.createElement('div');
            resultElement.className = `test-result ${result.status}`;
            let detailsHtml = '';
            if (result.details) {
                detailsHtml = '<div class="details">';
                if (typeof result.details === 'object') {
                    for (const [key, value] of Object.entries(result.details)) {
                        if (key !== 'status' && key !== 'message') {
                            detailsHtml += `<p>${key}: ${
                                typeof value === 'object' ? JSON.stringify(value) : value
                            }</p>`;
                        }
                    }
                }
                detailsHtml += '</div>';
            }
            resultElement.innerHTML = `
                <p>Test #${index + 1}: ${result.status.toUpperCase()}</p>
                <p>${result.message}</p>
                ${detailsHtml}
            `;
            details.appendChild(resultElement);
        });
        resultsContainer.appendChild(details);
    }
}); 