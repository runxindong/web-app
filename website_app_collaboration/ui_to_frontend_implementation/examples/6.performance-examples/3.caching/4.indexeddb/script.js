// 数据库配置 / Database Configuration
const DB_NAME = 'DemoDatabase';
const DB_VERSION = 1;
const STORES = {
    data: 'userData',
    sync: 'syncQueue',
    files: 'fileStorage'
};

// 打开数据库 / Open Database
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // 创建数据存储 / Create Data Store
            if (!db.objectStoreNames.contains(STORES.data)) {
                db.createObjectStore(STORES.data, { keyPath: 'id', autoIncrement: true });
            }

            // 创建同步队列存储 / Create Sync Queue Store
            if (!db.objectStoreNames.contains(STORES.sync)) {
                const syncStore = db.createObjectStore(STORES.sync, { keyPath: 'id', autoIncrement: true });
                syncStore.createIndex('status', 'status');
            }

            // 创建文件存储 / Create File Store
            if (!db.objectStoreNames.contains(STORES.files)) {
                const fileStore = db.createObjectStore(STORES.files, { keyPath: 'name' });
                fileStore.createIndex('size', 'size');
                fileStore.createIndex('type', 'type');
            }
        };
    });
}

// 保存数据 / Save Data
async function saveData() {
    const titleInput = document.getElementById('titleInput');
    const contentInput = document.getElementById('contentInput');

    if (!titleInput.value || !contentInput.value) {
        alert('请填写所有字段 / Please fill in all fields');
        return;
    }

    const data = {
        title: titleInput.value,
        content: contentInput.value,
        timestamp: new Date().toISOString()
    };

    try {
        const db = await openDatabase();
        const transaction = db.transaction([STORES.data], 'readwrite');
        const store = transaction.objectStore(STORES.data);

        await new Promise((resolve, reject) => {
            const request = store.add(data);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });

        titleInput.value = '';
        contentInput.value = '';
        loadData();
        refreshInfo();
    } catch (error) {
        console.error('保存数据失败 / Failed to save data:', error);
        alert('保存失败 / Save failed');
    }
}

// 加载数据 / Load Data
async function loadData() {
    const listContainer = document.querySelector('#dataStorage .list-container');
    listContainer.innerHTML = '';

    try {
        const db = await openDatabase();
        const transaction = db.transaction([STORES.data], 'readonly');
        const store = transaction.objectStore(STORES.data);

        const request = store.getAll();
        request.onsuccess = () => {
            const data = request.result;
            data.forEach(item => {
                const element = document.createElement('div');
                element.className = 'list-item';
                element.innerHTML = `
                    <h4>${item.title}</h4>
                    <p>${item.content}</p>
                    <small>${new Date(item.timestamp).toLocaleString()}</small>
                `;
                listContainer.appendChild(element);
            });
        };
    } catch (error) {
        console.error('加载数据失败 / Failed to load data:', error);
        listContainer.innerHTML = '<div class="error">加载失败 / Load failed</div>';
    }
}

// 清除数据 / Clear Data
async function clearData() {
    try {
        const db = await openDatabase();
        const transaction = db.transaction([STORES.data], 'readwrite');
        const store = transaction.objectStore(STORES.data);

        await new Promise((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });

        loadData();
        refreshInfo();
    } catch (error) {
        console.error('清除数据失败 / Failed to clear data:', error);
        alert('清除失败 / Clear failed');
    }
}

// 创建离线数据 / Create Offline Data
async function createOfflineData() {
    const data = {
        action: 'create',
        data: {
            title: `离线项目 / Offline Item ${Date.now()}`,
            content: '待同步 / Pending sync',
            timestamp: new Date().toISOString()
        },
        status: 'pending'
    };

    try {
        const db = await openDatabase();
        const transaction = db.transaction([STORES.sync], 'readwrite');
        const store = transaction.objectStore(STORES.sync);

        await new Promise((resolve, reject) => {
            const request = store.add(data);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });

        updateSyncStatus();
    } catch (error) {
        console.error('创建离线数据失败 / Failed to create offline data:', error);
        alert('创建失败 / Creation failed');
    }
}

// 同步数据 / Sync Data
async function syncData() {
    if (!navigator.onLine) {
        alert('离线状态 / Offline');
        return;
    }

    try {
        const db = await openDatabase();
        const transaction = db.transaction([STORES.sync], 'readwrite');
        const store = transaction.objectStore(STORES.sync);
        const index = store.index('status');

        const pendingItems = await new Promise((resolve, reject) => {
            const request = index.getAll('pending');
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        for (const item of pendingItems) {
            try {
                // 模拟同步到服务器 / Simulate sync to server
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // 更新同步状态 / Update sync status
                item.status = 'completed';
                await new Promise((resolve, reject) => {
                    const request = store.put(item);
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject(request.error);
                });
            } catch (error) {
                console.error('同步项目失败 / Failed to sync item:', error);
            }
        }

        updateSyncStatus();
        document.querySelector('.sync-time').textContent = new Date().toLocaleString();
    } catch (error) {
        console.error('同步失败 / Sync failed:', error);
        alert('同步失败 / Sync failed');
    }
}

// 清除同步队列 / Clear Sync Queue
async function clearSyncQueue() {
    try {
        const db = await openDatabase();
        const transaction = db.transaction([STORES.sync], 'readwrite');
        const store = transaction.objectStore(STORES.sync);

        await new Promise((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });

        updateSyncStatus();
    } catch (error) {
        console.error('清除同步队列失败 / Failed to clear sync queue:', error);
        alert('清除失败 / Clear failed');
    }
}

// 存储文件 / Store Files
async function storeFiles() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;

    if (files.length === 0) {
        alert('请选择文件 / Please select files');
        return;
    }

    try {
        const db = await openDatabase();
        const transaction = db.transaction([STORES.files], 'readwrite');
        const store = transaction.objectStore(STORES.files);

        for (const file of files) {
            const reader = new FileReader();
            await new Promise((resolve, reject) => {
                reader.onload = async () => {
                    try {
                        await new Promise((resolve, reject) => {
                            const request = store.put({
                                name: file.name,
                                type: file.type,
                                size: file.size,
                                data: reader.result,
                                timestamp: new Date().toISOString()
                            });
                            request.onsuccess = () => resolve();
                            request.onerror = () => reject(request.error);
                        });
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                };
                reader.onerror = () => reject(reader.error);
                reader.readAsDataURL(file);
            });
        }

        fileInput.value = '';
        loadFiles();
        updateStorageInfo();
    } catch (error) {
        console.error('存储文件失败 / Failed to store files:', error);
        alert('存储失败 / Storage failed');
    }
}

// 加载文件 / Load Files
async function loadFiles() {
    const listContainer = document.querySelector('#fileStorage .list-container');
    listContainer.innerHTML = '';

    try {
        const db = await openDatabase();
        const transaction = db.transaction([STORES.files], 'readonly');
        const store = transaction.objectStore(STORES.files);

        const request = store.getAll();
        request.onsuccess = () => {
            const files = request.result;
            files.forEach(file => {
                const element = document.createElement('div');
                element.className = 'list-item';
                element.innerHTML = `
                    <div class="file-info">
                        <strong>${file.name}</strong>
                        <small>${formatSize(file.size)}</small>
                    </div>
                    <div class="file-actions">
                        <button onclick="downloadFile('${file.name}')">
                            下载 / Download
                        </button>
                    </div>
                `;
                listContainer.appendChild(element);
            });
        };
    } catch (error) {
        console.error('加载文件失败 / Failed to load files:', error);
        listContainer.innerHTML = '<div class="error">加载失败 / Load failed</div>';
    }
}

// 下载文件 / Download File
async function downloadFile(fileName) {
    try {
        const db = await openDatabase();
        const transaction = db.transaction([STORES.files], 'readonly');
        const store = transaction.objectStore(STORES.files);

        const request = store.get(fileName);
        request.onsuccess = () => {
            const file = request.result;
            if (file) {
                const link = document.createElement('a');
                link.href = file.data;
                link.download = file.name;
                link.click();
            }
        };
    } catch (error) {
        console.error('下载文件失败 / Failed to download file:', error);
        alert('下载失败 / Download failed');
    }
}

// 清除文件 / Clear Files
async function clearFiles() {
    try {
        const db = await openDatabase();
        const transaction = db.transaction([STORES.files], 'readwrite');
        const store = transaction.objectStore(STORES.files);

        await new Promise((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });

        loadFiles();
        updateStorageInfo();
    } catch (error) {
        console.error('清除文件失败 / Failed to clear files:', error);
        alert('清除失败 / Clear failed');
    }
}

// 更新同步状态 / Update Sync Status
async function updateSyncStatus() {
    try {
        const db = await openDatabase();
        const transaction = db.transaction([STORES.sync], 'readonly');
        const store = transaction.objectStore(STORES.sync);
        const index = store.index('status');

        const request = index.count('pending');
        request.onsuccess = () => {
            document.querySelector('.queue-count').textContent = request.result;
        };
    } catch (error) {
        console.error('更新同步状态失败 / Failed to update sync status:', error);
    }
}

// 更新存储信息 / Update Storage Info
async function updateStorageInfo() {
    try {
        const db = await openDatabase();
        const transaction = db.transaction([STORES.files], 'readonly');
        const store = transaction.objectStore(STORES.files);

        const request = store.getAll();
        request.onsuccess = () => {
            const files = request.result;
            const totalSize = files.reduce((sum, file) => sum + file.size, 0);
            document.querySelector('.used-space').textContent = formatSize(totalSize);
        };

        if (navigator.storage && navigator.storage.estimate) {
            const estimate = await navigator.storage.estimate();
            const available = estimate.quota - estimate.usage;
            document.querySelector('.available-space').textContent = formatSize(available);
        }
    } catch (error) {
        console.error('更新存储信息失败 / Failed to update storage info:', error);
    }
}

// 删除数据库 / Delete Database
function deleteDatabase() {
    if (!confirm('确定要删除数据库吗？此操作不可撤销。\nAre you sure you want to delete the database? This cannot be undone.')) {
        return;
    }

    const request = indexedDB.deleteDatabase(DB_NAME);
    
    request.onsuccess = () => {
        alert('数据库已删除 / Database deleted');
        location.reload();
    };

    request.onerror = () => {
        alert('删除数据库失败 / Failed to delete database');
    };
}

// 刷新信息 / Refresh Info
async function refreshInfo() {
    try {
        const db = await openDatabase();
        document.querySelector('.db-version').textContent = db.version;
        document.querySelector('.store-count').textContent = db.objectStoreNames.length;

        let totalRecords = 0;
        const stores = Array.from(db.objectStoreNames);
        
        for (const storeName of stores) {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            
            await new Promise((resolve) => {
                const request = store.count();
                request.onsuccess = () => {
                    totalRecords += request.result;
                    resolve();
                };
            });
        }

        document.querySelector('.record-count').textContent = totalRecords;
    } catch (error) {
        console.error('刷新信息失败 / Failed to refresh info:', error);
    }
}

// 格式化文件大小 / Format File Size
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

// 检查网络状态 / Check Network Status
function checkNetworkStatus() {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');

    function updateStatus() {
        if (navigator.onLine) {
            statusIndicator.classList.add('online');
            statusIndicator.classList.remove('offline');
            statusText.textContent = '在线 / Online';
        } else {
            statusIndicator.classList.add('offline');
            statusIndicator.classList.remove('online');
            statusText.textContent = '离线 / Offline';
        }
    }

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
}

// 初始化 / Initialize
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await openDatabase();
        loadData();
        loadFiles();
        updateSyncStatus();
        updateStorageInfo();
        refreshInfo();
        checkNetworkStatus();
    } catch (error) {
        console.error('初始化失败 / Initialization failed:', error);
    }
}); 