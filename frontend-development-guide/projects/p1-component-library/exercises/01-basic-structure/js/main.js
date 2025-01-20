// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 初始化标签页
    initTabs();
    // 初始化字符计数器
    initCharCounter();
    // 初始化表单验证
    initFormValidation();
});

// 标签页功能
function initTabs() {
    const tabButtons = document.querySelectorAll('[role="tab"]');
    const tabPanels = document.querySelectorAll('[role="tabpanel"]');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 更新标签按钮状态
            tabButtons.forEach(btn => {
                btn.setAttribute('aria-selected', 'false');
            });
            button.setAttribute('aria-selected', 'true');

            // 更新面板显示
            const targetId = button.getAttribute('aria-controls');
            tabPanels.forEach(panel => {
                panel.hidden = panel.id !== targetId;
            });
        });
    });
}

// 字符计数器功能
function initCharCounter() {
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('char-count');
    
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', () => {
            const remaining = 500 - messageTextarea.value.length;
            charCount.textContent = remaining;
        });
    }
}

// 表单验证功能
function initFormValidation() {
    const form = document.querySelector('.contact-form form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // 简单的客户端验证
            if (validateForm(data)) {
                // 在实际应用中，这里会发送到服务器
                console.log('表单数据:', data);
                alert('表单提交成功！');
                form.reset();
            }
        });
    }
}

// 表单验证辅助函数
function validateForm(data) {
    // 验证姓名
    if (!/^[A-Za-z\u4e00-\u9fa5]{2,20}$/.test(data.name)) {
        alert('请输入2-20个字符的有效姓名');
        return false;
    }
    
    // 验证邮箱
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        alert('请输入有效的邮箱地址');
        return false;
    }
    
    // 验证电话（如果提供）
    if (data.phone && !/^[0-9]{11}$/.test(data.phone)) {
        alert('请输入11位有效的手机号码');
        return false;
    }
    
    // 验证留言内容
    if (data.message.length < 10 || data.message.length > 500) {
        alert('留言内容必须在10-500字符之间');
        return false;
    }
    
    return true;
}

// 搜索功能
const searchForm = document.querySelector('.search-form');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchInput = searchForm.querySelector('input[type="search"]');
        console.log('搜索关键词:', searchInput.value);
        // 在实际应用中，这里会处理搜索逻辑
        alert(`正在搜索: ${searchInput.value}`);
    });
} 