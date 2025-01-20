// 常量定义 / Constants
const STORAGE_PREFIX = 'demo_';
const CONFIG_KEY = `${STORAGE_PREFIX}config`;
const SESSION_KEY = `${STORAGE_PREFIX}session`;
const DEFAULT_CONFIG = {
    theme: 'light',
    language: 'zh',
    fontSize: 16
};

// 数据存储功能 / Data Storage Functions
function saveData() {
    const keyInput = document.getElementById('keyInput');
    const valueInput = document.getElementById('valueInput');

    if (!keyInput.value || !valueInput.value) {
        alert('请填写所有字段 / Please fill in all fields');
        return;
    }

    try {
        const key = `${STORAGE_PREFIX}${keyInput.value}`;
        const data = {
            value: valueInput.value,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem(key, JSON.stringify(data));
        keyInput.value = '';
        valueInput.value = '';
        loadData();
        refreshInfo();
    } catch (error) {
        console.error('保存数据失败 / Failed to save data:', error);
        alert('保存失败 / Save failed');
    }
}

function loadData() {
    const listContainer = document.querySelector('#dataStorage .list-container');
    listContainer.innerHTML = '';

    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(STORAGE_PREFIX)) {
                const rawData = localStorage.getItem(key);
                const data = JSON.parse(rawData);
                const displayKey = key.replace(STORAGE_PREFIX, '');

                const element = document.createElement('div');
                element.className = 'list-item';
                element.innerHTML = `
                    <div>
                        <strong>${displayKey}</strong>
                        <p>${data.value}</p>
                        <small>${new Date(data.timestamp).toLocaleString()}</small>
                    </div>
                    <button onclick="removeData('${key}')">
                        删除 / Delete
                    </button>
                `;
                listContainer.appendChild(element);
            }
        }

        if (listContainer.children.length === 0) {
            listContainer.innerHTML = '<div class="empty-message">无数据 / No data</div>';
        }
    } catch (error) {
        console.error('加载数据失败 / Failed to load data:', error);
        listContainer.innerHTML = '<div class="error">加载失败 / Load failed</div>';
    }
}

function removeData(key) {
    try {
        localStorage.removeItem(key);
        loadData();
        refreshInfo();
    } catch (error) {
        console.error('删除数据失败 / Failed to remove data:', error);
        alert('删除失败 / Delete failed');
    }
}

// 配置管理功能 / Configuration Management Functions
function loadConfig() {
    try {
        const storedConfig = localStorage.getItem(CONFIG_KEY);
        const config = storedConfig ? JSON.parse(storedConfig) : DEFAULT_CONFIG;

        document.getElementById('themeSelect').value = config.theme;
        document.getElementById('langSelect').value = config.language;
        document.getElementById('fontSizeRange').value = config.fontSize;
        document.getElementById('fontSizeValue').textContent = `${config.fontSize}px`;

        applyConfig(config);
    } catch (error) {
        console.error('加载配置失败 / Failed to load config:', error);
    }
}

function saveConfig() {
    try {
        const config = {
            theme: document.getElementById('themeSelect').value,
            language: document.getElementById('langSelect').value,
            fontSize: parseInt(document.getElementById('fontSizeRange').value)
        };

        localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        applyConfig(config);
        refreshInfo();
    } catch (error) {
        console.error('保存配置失败 / Failed to save config:', error);
        alert('保存失败 / Save failed');
    }
}

function resetConfig() {
    try {
        localStorage.removeItem(CONFIG_KEY);
        loadConfig();
        refreshInfo();
    } catch (error) {
        console.error('重置配置失败 / Failed to reset config:', error);
        alert('重置失败 / Reset failed');
    }
}

function applyConfig(config) {
    document.body.setAttribute('data-theme', config.theme);
    document.documentElement.style.setProperty('--font-size-base', `${config.fontSize}px`);
    document.querySelector('.preview-content').style.fontSize = `${config.fontSize}px`;
}

// 会话状态管理 / Session State Management
function initializeSession() {
    try {
        let session = sessionStorage.getItem(SESSION_KEY);
        if (!session) {
            session = {
                startTime: new Date().toISOString(),
                counter: 0
            };
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        } else {
            session = JSON.parse(session);
        }

        updateSessionDisplay(session);
        startSessionTimer(session.startTime);
    } catch (error) {
        console.error('初始化会话失败 / Failed to initialize session:', error);
    }
}

function incrementCounter() {
    try {
        const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
        session.counter++;
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        document.querySelector('.counter-value').textContent = session.counter;
    } catch (error) {
        console.error('增加计数失败 / Failed to increment counter:', error);
    }
}

function resetCounter() {
    try {
        const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
        session.counter = 0;
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        document.querySelector('.counter-value').textContent = '0';
    } catch (error) {
        console.error('重置计数失败 / Failed to reset counter:', error);
    }
}

function updateSessionDisplay(session) {
    document.querySelector('.counter-value').textContent = session.counter;
    document.querySelector('.session-start').textContent = new Date(session.startTime).toLocaleString();
}

function startSessionTimer(startTime) {
    function updateDuration() {
        const duration = new Date() - new Date(startTime);
        const seconds = Math.floor(duration / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        const display = `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
        document.querySelector('.session-duration').textContent = display;
    }

    updateDuration();
    setInterval(updateDuration, 1000);
}

// 存储信息管理 / Storage Information Management
function refreshInfo() {
    try {
        let totalSize = 0;
        let itemCount = 0;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            totalSize += key.length + value.length;
            if (key.startsWith(STORAGE_PREFIX)) {
                itemCount++;
            }
        }

        document.querySelector('.used-space').textContent = formatSize(totalSize * 2); // UTF-16 encoding
        document.querySelector('.item-count').textContent = itemCount;

        // 估算可用空间 / Estimate available space
        const testKey = 'size_test';
        const testValue = 'a'.repeat(1024); // 1KB
        try {
            let i = 0;
            while (true) {
                localStorage.setItem(`${testKey}${i}`, testValue);
                i++;
            }
        } catch (e) {
            // 清理测试数据 / Clean up test data
            for (let j = 0; j < localStorage.length; j++) {
                const key = localStorage.key(j);
                if (key.startsWith(testKey)) {
                    localStorage.removeItem(key);
                }
            }
            const availableSpace = i * 1024;
            document.querySelector('.available-space').textContent = formatSize(availableSpace);
        }
    } catch (error) {
        console.error('刷新信息失败 / Failed to refresh info:', error);
    }
}

// 清除存储 / Clear Storage
function clearStorage() {
    if (!confirm('确定要清除所有数据吗？此操作不可撤销。\nAre you sure you want to clear all data? This cannot be undone.')) {
        return;
    }

    try {
        // 仅清除示例数据 / Only clear demo data
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key.startsWith(STORAGE_PREFIX)) {
                localStorage.removeItem(key);
            }
        }

        loadData();
        refreshInfo();
    } catch (error) {
        console.error('清除存储失败 / Failed to clear storage:', error);
        alert('清除失败 / Clear failed');
    }
}

// 工具函数 / Utility Functions
function formatSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
}

// 事件监听器 / Event Listeners
document.getElementById('fontSizeRange').addEventListener('input', (event) => {
    document.getElementById('fontSizeValue').textContent = `${event.target.value}px`;
});

// 初始化 / Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    loadData();
    initializeSession();
    refreshInfo();
}); 