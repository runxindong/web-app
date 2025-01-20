// 购物车类
class ShoppingCart {
    constructor() {
        this.items = new Map();
        this.total = 0;
    }

    // 添加商品到购物车
    addItem(product, quantity = 1) {
        const item = this.items.get(product.id);
        if (item) {
            item.quantity += quantity;
        } else {
            this.items.set(product.id, {
                product,
                quantity
            });
        }
        this.updateTotal();
    }

    // 从购物车移除商品
    removeItem(productId) {
        this.items.delete(productId);
        this.updateTotal();
    }

    // 更新商品数量
    updateQuantity(productId, quantity) {
        const item = this.items.get(productId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.items.delete(productId);
            }
        }
        this.updateTotal();
    }

    // 计算总价
    updateTotal() {
        this.total = Array.from(this.items.values()).reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );
    }

    // 清空购物车
    clear() {
        this.items.clear();
        this.total = 0;
    }

    // 获取购物车商品列表
    getItems() {
        return Array.from(this.items.values());
    }

    // 获取总价
    getTotal() {
        return this.total;
    }
}

// 登录流程类
class LoginFlow {
    constructor() {
        this.currentStep = 1;
        this.maxSteps = 3;
        this.userData = {};
    }

    // 获取当前步骤
    getCurrentStep() {
        return this.currentStep;
    }

    // 验证当前步骤数据
    validateStep(data) {
        switch (this.currentStep) {
            case 1: // 邮箱验证
                return this.validateEmail(data.email);
            case 2: // 密码验证
                return this.validatePassword(data.password);
            case 3: // 个人信息验证
                return this.validateProfile(data);
            default:
                return false;
        }
    }

    // 验证邮箱
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }
        return true;
    }

    // 验证密码
    validatePassword(password) {
        if (!password || password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            throw new Error('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            throw new Error('Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
            throw new Error('Password must contain at least one number');
        }
        return true;
    }

    // 验证个人信息
    validateProfile(profile) {
        if (!profile.firstName || !profile.lastName) {
            throw new Error('First name and last name are required');
        }
        if (!profile.phone || !/^\d{10}$/.test(profile.phone)) {
            throw new Error('Invalid phone number format');
        }
        return true;
    }

    // 提交步骤数据
    submitStep(data) {
        if (this.validateStep(data)) {
            Object.assign(this.userData, data);
            if (this.currentStep < this.maxSteps) {
                this.currentStep++;
                return { success: true, nextStep: this.currentStep };
            } else {
                return { success: true, completed: true, userData: this.userData };
            }
        }
        return { success: false };
    }

    // 返回上一步
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            return { success: true, nextStep: this.currentStep };
        }
        return { success: false };
    }

    // 重置流程
    reset() {
        this.currentStep = 1;
        this.userData = {};
    }
}

// 端到端测试函数
async function runE2ETests() {
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

    // 测试购物车流程
    console.log('Running Shopping Cart E2E Tests...');

    const cart = new ShoppingCart();
    const products = [
        { id: 1, name: 'Product 1', price: 10.99 },
        { id: 2, name: 'Product 2', price: 19.99 },
        { id: 3, name: 'Product 3', price: 5.99 }
    ];

    try {
        // 测试添加商品
        cart.addItem(products[0], 2);
        await assert(
            cart.getItems().length === 1,
            'Cart should contain one item'
        );
        await assert(
            cart.getTotal() === 21.98,
            'Cart total should be 21.98'
        );

        // 测试更新数量
        cart.updateQuantity(products[0].id, 3);
        await assert(
            cart.getItems()[0].quantity === 3,
            'Item quantity should be updated to 3'
        );

        // 测试添加多个商品
        cart.addItem(products[1], 1);
        cart.addItem(products[2], 2);
        await assert(
            cart.getItems().length === 3,
            'Cart should contain three items'
        );

        // 测试移除商品
        cart.removeItem(products[0].id);
        await assert(
            cart.getItems().length === 2,
            'Cart should contain two items after removal'
        );

        // 测试清空购物车
        cart.clear();
        await assert(
            cart.getItems().length === 0,
            'Cart should be empty after clearing'
        );
        await assert(
            cart.getTotal() === 0,
            'Cart total should be 0 after clearing'
        );

    } catch (error) {
        console.error('Shopping Cart Test Error:', error);
        testResults.results.push({
            status: 'failed',
            message: `Shopping Cart Error: ${error.message}`
        });
    }

    // 测试登录流程
    console.log('Running Login Flow E2E Tests...');

    const loginFlow = new LoginFlow();

    try {
        // 测试邮箱验证步骤
        const step1 = loginFlow.submitStep({
            email: 'test@example.com'
        });
        await assert(
            step1.success && step1.nextStep === 2,
            'Should proceed to step 2 after valid email'
        );

        // 测试密码验证步骤
        const step2 = loginFlow.submitStep({
            password: 'TestPassword123'
        });
        await assert(
            step2.success && step2.nextStep === 3,
            'Should proceed to step 3 after valid password'
        );

        // 测试个人信息步骤
        const step3 = loginFlow.submitStep({
            firstName: 'John',
            lastName: 'Doe',
            phone: '1234567890'
        });
        await assert(
            step3.success && step3.completed,
            'Should complete flow after valid profile information'
        );

        // 测试返回功能
        loginFlow.previousStep();
        await assert(
            loginFlow.getCurrentStep() === 2,
            'Should return to step 2'
        );

        // 测试验证错误
        loginFlow.reset();
        try {
            loginFlow.submitStep({
                email: 'invalid-email'
            });
            await assert(false, 'Should throw error for invalid email');
        } catch (error) {
            await assert(
                error.message === 'Invalid email format',
                'Should receive invalid email error message'
            );
        }

        // 测试密码验证错误
        try {
            loginFlow.submitStep({
                email: 'test@example.com'
            });
            loginFlow.submitStep({
                password: 'weak'
            });
            await assert(false, 'Should throw error for invalid password');
        } catch (error) {
            await assert(
                error.message.includes('Password must be'),
                'Should receive invalid password error message'
            );
        }

    } catch (error) {
        console.error('Login Flow Test Error:', error);
        testResults.results.push({
            status: 'failed',
            message: `Login Flow Error: ${error.message}`
        });
    }

    // 输出测试结果
    console.log('E2E Test Results:', testResults);
    return testResults;
}

// 在页面加载时运行端到端测试
document.addEventListener('DOMContentLoaded', async () => {
    const testResults = await runE2ETests();
    
    // 更新UI显示测试结果
    const resultsContainer = document.getElementById('e2e-test-results');
    if (resultsContainer) {
        const summary = document.createElement('div');
        summary.innerHTML = `
            <h3>E2E Test Summary</h3>
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