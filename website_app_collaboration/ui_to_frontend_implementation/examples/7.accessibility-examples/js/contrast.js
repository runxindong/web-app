/**
 * 颜色对比度示例
 */

(() => {
    // 颜色对比度计算工具
    class ContrastChecker {
        constructor() {
            this.minContrastRatio = 4.5; // WCAG AA标准
            this.enhancedContrastRatio = 7; // WCAG AAA标准
        }

        // 计算相对亮度
        calculateRelativeLuminance(r, g, b) {
            const [rs, gs, bs] = [r, g, b].map(c => {
                c = c / 255;
                return c <= 0.03928
                    ? c / 12.92
                    : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        }

        // 计算对比度
        calculateContrastRatio(color1, color2) {
            const l1 = this.calculateRelativeLuminance(...this.hexToRgb(color1));
            const l2 = this.calculateRelativeLuminance(...this.hexToRgb(color2));
            const lighter = Math.max(l1, l2);
            const darker = Math.min(l1, l2);
            return (lighter + 0.05) / (darker + 0.05);
        }

        // 十六进制颜色转RGB
        hexToRgb(hex) {
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result
                ? [
                    parseInt(result[1], 16),
                    parseInt(result[2], 16),
                    parseInt(result[3], 16)
                ]
                : [0, 0, 0];
        }

        // 检查对比度是否符合标准
        checkContrast(color1, color2) {
            const ratio = this.calculateContrastRatio(color1, color2);
            return {
                ratio: ratio.toFixed(2),
                passesAA: ratio >= this.minContrastRatio,
                passesAAA: ratio >= this.enhancedContrastRatio
            };
        }

        // 建议替代颜色
        suggestAlternativeColor(backgroundColor, textColor) {
            const originalRatio = this.calculateContrastRatio(backgroundColor, textColor);
            if (originalRatio >= this.enhancedContrastRatio) {
                return textColor; // 已经符合最高标准
            }

            const rgb = this.hexToRgb(textColor);
            const steps = [
                [20, 20, 20],
                [-20, -20, -20]
            ];

            for (const [dr, dg, db] of steps) {
                const newColor = this.rgbToHex(
                    this.clamp(rgb[0] + dr),
                    this.clamp(rgb[1] + dg),
                    this.clamp(rgb[2] + db)
                );
                const newRatio = this.calculateContrastRatio(backgroundColor, newColor);
                if (newRatio >= this.minContrastRatio) {
                    return newColor;
                }
            }

            // 如果无法找到合适的颜色，返回黑色或白色
            const bgLuminance = this.calculateRelativeLuminance(...this.hexToRgb(backgroundColor));
            return bgLuminance > 0.5 ? '#000000' : '#FFFFFF';
        }

        // RGB转十六进制
        rgbToHex(r, g, b) {
            return '#' + [r, g, b]
                .map(x => {
                    const hex = x.toString(16);
                    return hex.length === 1 ? '0' + hex : hex;
                })
                .join('');
        }

        // 限制RGB值在0-255范围内
        clamp(value) {
            return Math.min(255, Math.max(0, value));
        }
    }

    // 颜色选择器组件
    class ColorPicker {
        constructor(container) {
            this.container = container;
            this.contrastChecker = new ContrastChecker();
            
            this.backgroundInput = container.querySelector('.background-color');
            this.textInput = container.querySelector('.text-color');
            this.previewText = container.querySelector('.preview-text');
            this.contrastRatio = container.querySelector('.contrast-ratio');
            this.wcagAA = container.querySelector('.wcag-aa');
            this.wcagAAA = container.querySelector('.wcag-aaa');
            this.suggestedColor = container.querySelector('.suggested-color');
            
            this.init();
        }

        init() {
            // 初始化颜色选择器
            this.backgroundInput.value = '#FFFFFF';
            this.textInput.value = '#000000';

            // 绑定事件
            this.backgroundInput.addEventListener('input', () => this.updateContrast());
            this.textInput.addEventListener('input', () => this.updateContrast());

            // 初始更新
            this.updateContrast();
        }

        updateContrast() {
            const backgroundColor = this.backgroundInput.value;
            const textColor = this.textInput.value;

            // 更新预览
            this.previewText.style.backgroundColor = backgroundColor;
            this.previewText.style.color = textColor;

            // 计算对比度
            const result = this.contrastChecker.checkContrast(backgroundColor, textColor);

            // 更新结果显示
            this.contrastRatio.textContent = `对比度: ${result.ratio}:1`;
            this.wcagAA.textContent = `WCAG AA: ${result.passesAA ? '通过' : '未通过'}`;
            this.wcagAAA.textContent = `WCAG AAA: ${result.passesAAA ? '通过' : '未通过'}`;

            // 如果不符合标准，提供建议的颜色
            if (!result.passesAA) {
                const suggestedColor = this.contrastChecker.suggestAlternativeColor(
                    backgroundColor,
                    textColor
                );
                this.suggestedColor.textContent = `建议颜色: ${suggestedColor}`;
                this.suggestedColor.style.color = suggestedColor;
                this.suggestedColor.hidden = false;
            } else {
                this.suggestedColor.hidden = true;
            }
        }
    }

    // 自动对比度修正
    class AutoContrastFixer {
        constructor() {
            this.contrastChecker = new ContrastChecker();
            this.init();
        }

        init() {
            // 获取所有文本元素
            const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a');

            textElements.forEach(element => {
                // 获取计算后的样式
                const computedStyle = window.getComputedStyle(element);
                const backgroundColor = this.rgbToHex(computedStyle.backgroundColor);
                const textColor = this.rgbToHex(computedStyle.color);

                // 检查对比度
                const result = this.contrastChecker.checkContrast(backgroundColor, textColor);

                // 如果对比度不足，自动修正
                if (!result.passesAA) {
                    const suggestedColor = this.contrastChecker.suggestAlternativeColor(
                        backgroundColor,
                        textColor
                    );
                    element.style.color = suggestedColor;

                    // 添加工具提示说明颜色已被修正
                    element.setAttribute('title', `颜色已自动调整以提高可读性 (原始颜色: ${textColor})`);
                }
            });
        }

        // RGB字符串转十六进制
        rgbToHex(rgb) {
            // 处理rgba()格式
            const matches = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (matches) {
                const [_, r, g, b] = matches;
                return '#' + [r, g, b]
                    .map(x => {
                        const hex = parseInt(x).toString(16);
                        return hex.length === 1 ? '0' + hex : hex;
                    })
                    .join('');
            }
            return rgb; // 如果已经是十六进制格式
        }
    }

    // 高对比度模式切换
    class HighContrastMode {
        constructor() {
            this.isHighContrast = false;
            this.originalStyles = new Map();
            this.init();
        }

        init() {
            const toggle = document.getElementById('highContrastToggle');
            if (toggle) {
                toggle.addEventListener('click', () => this.toggleHighContrast());
            }
        }

        toggleHighContrast() {
            this.isHighContrast = !this.isHighContrast;
            
            if (this.isHighContrast) {
                this.enableHighContrast();
            } else {
                this.disableHighContrast();
            }

            // 保存用户偏好
            localStorage.setItem('highContrastMode', this.isHighContrast);
        }

        enableHighContrast() {
            document.body.classList.add('high-contrast');

            // 存储原始样式并应用高对比度样式
            document.querySelectorAll('*').forEach(element => {
                const computedStyle = window.getComputedStyle(element);
                this.originalStyles.set(element, {
                    color: element.style.color,
                    backgroundColor: element.style.backgroundColor
                });

                // 应用高对比度样式
                if (computedStyle.color !== 'transparent') {
                    element.style.color = '#FFFFFF';
                }
                if (computedStyle.backgroundColor !== 'transparent') {
                    element.style.backgroundColor = '#000000';
                }
            });
        }

        disableHighContrast() {
            document.body.classList.remove('high-contrast');

            // 恢复原始样式
            this.originalStyles.forEach((styles, element) => {
                element.style.color = styles.color;
                element.style.backgroundColor = styles.backgroundColor;
            });

            this.originalStyles.clear();
        }
    }

    // 初始化组件
    document.querySelectorAll('.color-picker-container').forEach(container => {
        new ColorPicker(container);
    });

    // 初始化自动对比度修正
    new AutoContrastFixer();

    // 初始化高对比度模式
    new HighContrastMode();
})(); 