// 用户管理服务
class UserService {
    constructor() {
        this.users = new Map();
        this.nextId = 1;
    }

    // 创建用户
    async createUser(userData) {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 500));

        // 验证必填字段
        if (!userData.username || !userData.email) {
            throw new Error('Username and email are required');
        }

        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            throw new Error('Invalid email format');
        }

        // 检查用户名是否已存在
        const existingUser = Array.from(this.users.values()).find(
            user => user.username === userData.username
        );
        if (existingUser) {
            throw new Error('Username already exists');
        }

        // 创建新用户
        const user = {
            id: this.nextId++,
            ...userData,
            createdAt: new Date()
        };

        this.users.set(user.id, user);
        return user;
    }

    // 获取用户列表
    async getUsers() {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 300));
        return Array.from(this.users.values());
    }

    // 获取单个用户
    async getUser(id) {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 200));
        const user = this.users.get(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    // 更新用户信息
    async updateUser(id, userData) {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 400));

        const user = this.users.get(id);
        if (!user) {
            throw new Error('User not found');
        }

        // 验证邮箱格式
        if (userData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                throw new Error('Invalid email format');
            }
        }

        // 更新用户信息
        Object.assign(user, userData, {
            updatedAt: new Date()
        });

        this.users.set(id, user);
        return user;
    }

    // 删除用户
    async deleteUser(id) {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 300));

        if (!this.users.has(id)) {
            throw new Error('User not found');
        }

        this.users.delete(id);
        return true;
    }
}

// 数据同步服务
class DataSyncService {
    constructor() {
        this.data = new Map();
        this.subscribers = new Set();
    }

    // 订阅数据更新
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    // 通知所有订阅者
    notify(key, value) {
        this.subscribers.forEach(callback => {
            try {
                callback(key, value);
            } catch (error) {
                console.error('Error in subscriber callback:', error);
            }
        });
    }

    // 设置数据
    async setData(key, value) {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 200));

        this.data.set(key, value);
        this.notify(key, value);
        return true;
    }

    // 获取数据
    async getData(key) {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 100));

        if (!this.data.has(key)) {
            throw new Error('Data not found');
        }

        return this.data.get(key);
    }

    // 删除数据
    async deleteData(key) {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 150));

        if (!this.data.has(key)) {
            throw new Error('Data not found');
        }

        this.data.delete(key);
        this.notify(key, null);
        return true;
    }

    // 批量更新数据
    async batchUpdate(updates) {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 400));

        const results = [];
        for (const [key, value] of updates) {
            this.data.set(key, value);
            this.notify(key, value);
            results.push({ key, success: true });
        }

        return results;
    }
}

// 集成测试函数
async function runIntegrationTests() {
    const testResults = {
        total: 0,
        passed: 0,
        failed: 0,
        results: []
    };

    async function assert(condition, message) {
        testResults.total++;
        if (condition) {
            testResults.passed++;
            testResults.results.push({
                status: 'passed',
                message
            });
        } else {
            testResults.failed++;
            testResults.results.push({
                status: 'failed',
                message
            });
        }
    }

    // 测试用户服务和数据同步服务的集成
    console.log('Running Integration Tests...');
    
    const userService = new UserService();
    const dataSyncService = new DataSyncService();

    try {
        // 测试创建用户并同步数据
        const user = await userService.createUser({
            username: 'testuser',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User'
        });

        await assert(user.id === 1, 'User should be created with ID 1');
        
        // 同步用户数据
        await dataSyncService.setData(`user:${user.id}`, user);
        const syncedUser = await dataSyncService.getData(`user:${user.id}`);
        await assert(
            syncedUser.username === user.username,
            'Synced user data should match original user data'
        );

        // 测试更新用户并同步数据
        const updatedUser = await userService.updateUser(user.id, {
            firstName: 'Updated',
            lastName: 'Name'
        });

        await dataSyncService.setData(`user:${user.id}`, updatedUser);
        const syncedUpdatedUser = await dataSyncService.getData(`user:${user.id}`);
        await assert(
            syncedUpdatedUser.firstName === 'Updated',
            'Synced updated user data should reflect changes'
        );

        // 测试数据同步订阅
        let notificationReceived = false;
        const unsubscribe = dataSyncService.subscribe((key, value) => {
            if (key === `user:${user.id}` && value === null) {
                notificationReceived = true;
            }
        });

        // 删除用户并验证同步
        await userService.deleteUser(user.id);
        await dataSyncService.deleteData(`user:${user.id}`);
        await assert(notificationReceived, 'Subscribers should be notified of data deletion');

        // 清理订阅
        unsubscribe();

        // 测试错误处理
        try {
            await userService.createUser({
                username: 'invalid',
                email: 'invalid-email'
            });
            await assert(false, 'Should throw error for invalid email');
        } catch (error) {
            await assert(
                error.message === 'Invalid email format',
                'Should receive invalid email error message'
            );
        }

        // 测试批量数据同步
        const batchData = [
            ['key1', 'value1'],
            ['key2', 'value2'],
            ['key3', 'value3']
        ];

        const batchResults = await dataSyncService.batchUpdate(batchData);
        await assert(
            batchResults.every(result => result.success),
            'Batch update should succeed for all items'
        );

        // 验证批量更新的数据
        for (const [key, value] of batchData) {
            const syncedValue = await dataSyncService.getData(key);
            await assert(
                syncedValue === value,
                `Synced value for ${key} should match original value`
            );
        }

    } catch (error) {
        console.error('Integration Test Error:', error);
        testResults.results.push({
            status: 'failed',
            message: `Unexpected error: ${error.message}`
        });
    }

    // 输出测试结果
    console.log('Integration Test Results:', testResults);
    return testResults;
}

// 在页面加载时运行集成测试
document.addEventListener('DOMContentLoaded', async () => {
    const testResults = await runIntegrationTests();
    
    // 更新UI显示测试结果
    const resultsContainer = document.getElementById('integration-test-results');
    if (resultsContainer) {
        const summary = document.createElement('div');
        summary.innerHTML = `
            <h3>Integration Test Summary</h3>
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
            resultElement.innerHTML = `
                <p>Test #${index + 1}: ${result.status.toUpperCase()}</p>
                <p>${result.message}</p>
            `;
            details.appendChild(resultElement);
        });
        resultsContainer.appendChild(details);
    }
}); 