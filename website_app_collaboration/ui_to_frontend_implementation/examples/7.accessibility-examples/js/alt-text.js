/**
 * 替代文本示例
 */

(() => {
    // 图片替代文本管理器
    class ImageAltTextManager {
        constructor() {
            this.init();
        }

        init() {
            // 检查所有图片
            const images = document.querySelectorAll('img');
            
            images.forEach(img => {
                this.enhanceImage(img);
            });

            // 监听动态添加的图片
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeName === 'IMG') {
                            this.enhanceImage(node);
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        enhanceImage(img) {
            // 检查是否已有替代文本
            if (!img.hasAttribute('alt')) {
                // 尝试从其他属性获取描述
                const description = img.getAttribute('title') || 
                                  img.getAttribute('data-description') ||
                                  this.generateAltFromContext(img);
                
                if (description) {
                    img.setAttribute('alt', description);
                } else {
                    // 如果是装饰性图片，使用空alt
                    img.setAttribute('alt', '');
                    img.setAttribute('role', 'presentation');
                }
            }

            // 添加图片查看器
            this.addImageViewer(img);
        }

        generateAltFromContext(img) {
            // 尝试从周围文本生成描述
            const parent = img.parentElement;
            const siblings = Array.from(parent.childNodes);
            let description = '';

            // 检查相邻文本节点
            siblings.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent.trim();
                    if (text) {
                        description = text;
                    }
                }
            });

            // 检查相邻标题
            const nearestHeading = parent.querySelector('h1, h2, h3, h4, h5, h6');
            if (nearestHeading) {
                description = nearestHeading.textContent.trim();
            }

            // 检查图片文件名
            if (!description) {
                const filename = img.src.split('/').pop().split('.')[0];
                description = filename.replace(/[_-]/g, ' ');
            }

            return description;
        }

        addImageViewer(img) {
            // 创建包装容器
            const wrapper = document.createElement('div');
            wrapper.className = 'image-wrapper';
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);

            // 创建描述按钮
            const descButton = document.createElement('button');
            descButton.className = 'image-desc-button';
            descButton.setAttribute('aria-label', '查看图片描述');
            wrapper.appendChild(descButton);

            // 创建描述面板
            const descPanel = document.createElement('div');
            descPanel.className = 'image-desc-panel';
            descPanel.setAttribute('role', 'dialog');
            descPanel.setAttribute('aria-label', '图片描述');
            wrapper.appendChild(descPanel);

            // 添加描述内容
            const descContent = document.createElement('div');
            descContent.className = 'desc-content';
            descPanel.appendChild(descContent);

            // 添加关闭按钮
            const closeButton = document.createElement('button');
            closeButton.className = 'close-button';
            closeButton.setAttribute('aria-label', '关闭描述');
            descPanel.appendChild(closeButton);

            // 绑定事件
            descButton.addEventListener('click', () => {
                this.showImageDescription(img, descPanel, descContent);
            });

            closeButton.addEventListener('click', () => {
                this.hideImageDescription(descPanel);
            });

            // ESC键关闭
            descPanel.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    this.hideImageDescription(descPanel);
                }
            });
        }

        showImageDescription(img, panel, content) {
            // 收集图片信息
            const info = {
                alt: img.getAttribute('alt') || '无替代文本',
                title: img.getAttribute('title') || '无标题',
                dimensions: `${img.naturalWidth} x ${img.naturalHeight}`,
                filename: img.src.split('/').pop(),
                filesize: '获取中...'
            };

            // 获取文件大小
            fetch(img.src)
                .then(response => {
                    const size = response.headers.get('content-length');
                    info.filesize = size ? this.formatFileSize(size) : '未知';
                    this.updateDescriptionContent(content, info);
                })
                .catch(() => {
                    info.filesize = '未知';
                    this.updateDescriptionContent(content, info);
                });

            // 显示面板
            panel.hidden = false;
            panel.setAttribute('aria-hidden', 'false');
            
            // 焦点管理
            this.previousActiveElement = document.activeElement;
            const firstFocusable = panel.querySelector('button');
            firstFocusable?.focus();
        }

        hideImageDescription(panel) {
            panel.hidden = true;
            panel.setAttribute('aria-hidden', 'true');
            
            // 恢复焦点
            this.previousActiveElement?.focus();
        }

        updateDescriptionContent(content, info) {
            content.innerHTML = `
                <dl>
                    <dt>替代文本:</dt>
                    <dd>${info.alt}</dd>
                    <dt>标题:</dt>
                    <dd>${info.title}</dd>
                    <dt>尺寸:</dt>
                    <dd>${info.dimensions}</dd>
                    <dt>文件名:</dt>
                    <dd>${info.filename}</dd>
                    <dt>文件大小:</dt>
                    <dd>${info.filesize}</dd>
                </dl>
            `;
        }

        formatFileSize(bytes) {
            const units = ['B', 'KB', 'MB', 'GB'];
            let size = parseInt(bytes);
            let unitIndex = 0;

            while (size >= 1024 && unitIndex < units.length - 1) {
                size /= 1024;
                unitIndex++;
            }

            return `${size.toFixed(1)} ${units[unitIndex]}`;
        }
    }

    // SVG图标管理器
    class SVGIconManager {
        constructor() {
            this.init();
        }

        init() {
            // 处理内联SVG
            const svgElements = document.querySelectorAll('svg');
            svgElements.forEach(svg => this.enhanceSVG(svg));

            // 处理SVG使用
            const svgUses = document.querySelectorAll('use');
            svgUses.forEach(use => this.enhanceSVGUse(use));

            // 监听动态添加的SVG
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeName === 'svg') {
                            this.enhanceSVG(node);
                        } else if (node.nodeName === 'use') {
                            this.enhanceSVGUse(node);
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        enhanceSVG(svg) {
            // 确保SVG可访问
            if (!svg.hasAttribute('role')) {
                svg.setAttribute('role', 'img');
            }

            // 添加标题和描述
            if (!svg.querySelector('title') && !svg.hasAttribute('aria-label')) {
                const title = document.createElement('title');
                const description = svg.getAttribute('data-description') || 
                                  this.generateSVGDescription(svg);
                title.textContent = description;
                svg.insertBefore(title, svg.firstChild);
            }

            // 确保正确的ARIA属性
            if (svg.getAttribute('aria-hidden') !== 'true') {
                const description = svg.querySelector('title')?.textContent ||
                                  svg.getAttribute('aria-label');
                if (description) {
                    svg.setAttribute('aria-label', description);
                }
            }
        }

        enhanceSVGUse(use) {
            const svg = use.closest('svg');
            if (svg) {
                // 获取引用的图标ID
                const href = use.getAttribute('href') || use.getAttribute('xlink:href');
                if (href) {
                    const iconId = href.replace('#', '');
                    const iconDefinition = document.getElementById(iconId);
                    
                    if (iconDefinition) {
                        // 从图标定义获取描述
                        const description = iconDefinition.getAttribute('data-description') ||
                                          iconDefinition.querySelector('title')?.textContent;
                        
                        if (description && !svg.hasAttribute('aria-label')) {
                            svg.setAttribute('aria-label', description);
                        }
                    }
                }
            }
        }

        generateSVGDescription(svg) {
            // 尝试从类名生成描述
            const className = svg.getAttribute('class');
            if (className) {
                const iconName = className.split(' ')
                    .find(cls => cls.includes('icon-'))
                    ?.replace('icon-', '')
                    ?.replace(/-/g, ' ');
                
                if (iconName) {
                    return iconName.charAt(0).toUpperCase() + iconName.slice(1) + ' 图标';
                }
            }

            // 从父元素或周围文本生成描述
            const parent = svg.parentElement;
            const text = parent.textContent.trim().replace(svg.textContent.trim(), '');
            if (text) {
                return text + ' 图标';
            }

            return '图标';
        }
    }

    // 初始化管理器
    new ImageAltTextManager();
    new SVGIconManager();
})(); 