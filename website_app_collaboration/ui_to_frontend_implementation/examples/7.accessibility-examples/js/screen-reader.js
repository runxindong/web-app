/**
 * 屏幕阅读器支持示例
 */

(() => {
    // 动态内容更新
    const dynamicContent = document.getElementById('dynamicContent');
    const updateButton = document.getElementById('updateButton');
    const statusRegion = document.getElementById('statusRegion');

    // 更新动态内容
    const updateContent = () => {
        const timestamp = new Date().toLocaleTimeString();
        dynamicContent.textContent = `内容已更新于 ${timestamp}`;
        
        // 使用aria-live区域通知更新
        statusRegion.textContent = `内容已成功更新`;
        
        // 2秒后清除状态消息
        setTimeout(() => {
            statusRegion.textContent = '';
        }, 2000);
    };

    updateButton.addEventListener('click', updateContent);

    // 表格导航增强
    const dataTable = document.getElementById('dataTable');
    if (dataTable) {
        const cells = dataTable.getElementsByTagName('td');
        
        Array.from(cells).forEach(cell => {
            // 为每个单元格添加角色和属性
            cell.setAttribute('role', 'gridcell');
            
            // 添加列标题信息
            const columnHeader = dataTable.querySelector(`th:nth-child(${cell.cellIndex + 1})`);
            if (columnHeader) {
                cell.setAttribute('aria-describedby', columnHeader.id);
            }
        });
    }

    // 进度指示器
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    const updateProgress = (value) => {
        progressBar.setAttribute('aria-valuenow', value);
        progressBar.style.width = `${value}%`;
        progressText.textContent = `${value}%`;
        
        // 添加描述性文本
        if (value === 100) {
            progressBar.setAttribute('aria-label', '加载完成');
        } else {
            progressBar.setAttribute('aria-label', `正在加载，已完成 ${value}%`);
        }
    };

    // 模拟进度更新
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 10;
        if (progress <= 100) {
            updateProgress(progress);
        } else {
            clearInterval(progressInterval);
        }
    }, 1000);

    // 表单验证
    const form = document.getElementById('accessibleForm');
    const submitButton = form?.querySelector('button[type="submit"]');
    
    if (form) {
        const validateField = (field) => {
            const errorId = `${field.id}Error`;
            let errorElement = document.getElementById(errorId);
            
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.id = errorId;
                errorElement.className = 'error-message';
                errorElement.setAttribute('role', 'alert');
                field.parentNode.appendChild(errorElement);
            }
            
            // 清除之前的错误状态
            field.setAttribute('aria-invalid', 'false');
            field.removeAttribute('aria-errormessage');
            errorElement.textContent = '';
            
            // 验证必填字段
            if (field.hasAttribute('required') && !field.value.trim()) {
                const errorMessage = `${field.getAttribute('aria-label') || field.getAttribute('placeholder') || '此字段'}不能为空`;
                errorElement.textContent = errorMessage;
                field.setAttribute('aria-invalid', 'true');
                field.setAttribute('aria-errormessage', errorId);
                return false;
            }
            
            // 验证邮箱格式
            if (field.type === 'email' && field.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    const errorMessage = '请输入有效的邮箱地址';
                    errorElement.textContent = errorMessage;
                    field.setAttribute('aria-invalid', 'true');
                    field.setAttribute('aria-errormessage', errorId);
                    return false;
                }
            }
            
            return true;
        };

        // 实时验证
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => validateField(field));
        });

        // 表单提交验证
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            
            let isValid = true;
            form.querySelectorAll('input, select, textarea').forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                // 提交成功反馈
                const successMessage = document.createElement('div');
                successMessage.setAttribute('role', 'alert');
                successMessage.setAttribute('aria-live', 'polite');
                successMessage.textContent = '表单提交成功！';
                form.appendChild(successMessage);
                
                // 3秒后移除成功消息
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
            } else {
                // 聚焦到第一个错误字段
                const firstInvalidField = form.querySelector('[aria-invalid="true"]');
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
            }
        });
    }

    // 图片描述增强
    const images = document.querySelectorAll('img[data-description]');
    
    images.forEach(img => {
        const description = img.getAttribute('data-description');
        if (description) {
            // 创建包装容器
            const wrapper = document.createElement('div');
            wrapper.setAttribute('role', 'figure');
            wrapper.setAttribute('aria-label', description);
            
            // 将图片包装在容器中
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
            
            // 添加详细描述按钮
            const descButton = document.createElement('button');
            descButton.textContent = '查看图片描述';
            descButton.className = 'description-button';
            descButton.setAttribute('aria-expanded', 'false');
            
            const descText = document.createElement('div');
            descText.className = 'description-text';
            descText.setAttribute('role', 'region');
            descText.setAttribute('aria-hidden', 'true');
            descText.textContent = description;
            
            wrapper.appendChild(descButton);
            wrapper.appendChild(descText);
            
            // 切换描述显示
            descButton.addEventListener('click', () => {
                const isExpanded = descButton.getAttribute('aria-expanded') === 'true';
                descButton.setAttribute('aria-expanded', !isExpanded);
                descText.setAttribute('aria-hidden', isExpanded);
                descText.style.display = isExpanded ? 'none' : 'block';
            });
        }
    });
})(); 