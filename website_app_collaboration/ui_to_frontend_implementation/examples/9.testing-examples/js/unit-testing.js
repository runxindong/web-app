// 计算器类
class Calculator {
    constructor() {
        this.currentValue = 0;
        this.memory = [];
    }

    // 加法运算
    add(value) {
        if (typeof value !== 'number') {
            throw new Error('Invalid input: value must be a number');
        }
        this.currentValue += value;
        this.memory.push({ operation: 'add', value });
        return this.currentValue;
    }

    // 减法运算
    subtract(value) {
        if (typeof value !== 'number') {
            throw new Error('Invalid input: value must be a number');
        }
        this.currentValue -= value;
        this.memory.push({ operation: 'subtract', value });
        return this.currentValue;
    }

    // 乘法运算
    multiply(value) {
        if (typeof value !== 'number') {
            throw new Error('Invalid input: value must be a number');
        }
        this.currentValue *= value;
        this.memory.push({ operation: 'multiply', value });
        return this.currentValue;
    }

    // 除法运算
    divide(value) {
        if (typeof value !== 'number') {
            throw new Error('Invalid input: value must be a number');
        }
        if (value === 0) {
            throw new Error('Division by zero is not allowed');
        }
        this.currentValue /= value;
        this.memory.push({ operation: 'divide', value });
        return this.currentValue;
    }

    // 清除当前值
    clear() {
        this.currentValue = 0;
        this.memory = [];
        return this.currentValue;
    }

    // 获取运算历史
    getHistory() {
        return this.memory;
    }
}

// 表单验证类
class FormValidator {
    constructor() {
        this.rules = {
            required: (value) => value !== undefined && value !== null && value.toString().trim() !== '',
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            minLength: (value, length) => value.length >= length,
            maxLength: (value, length) => value.length <= length,
            numeric: (value) => /^\d+$/.test(value),
            alphanumeric: (value) => /^[a-zA-Z0-9]+$/.test(value),
            password: (value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)
        };
    }

    // 添加自定义验证规则
    addRule(name, validator) {
        if (typeof validator !== 'function') {
            throw new Error('Validator must be a function');
        }
        this.rules[name] = validator;
    }

    // 验证单个值
    validate(value, rules) {
        const errors = [];

        for (const [rule, params] of Object.entries(rules)) {
            const validator = this.rules[rule];
            if (!validator) {
                throw new Error(`Unknown validation rule: ${rule}`);
            }

            const isValid = validator(value, params);
            if (!isValid) {
                errors.push({
                    rule,
                    message: this.getErrorMessage(rule, params)
                });
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // 验证表单对象
    validateForm(formData, validationRules) {
        const results = {};
        let isValid = true;

        for (const [field, rules] of Object.entries(validationRules)) {
            const value = formData[field];
            const result = this.validate(value, rules);
            
            results[field] = result;
            if (!result.isValid) {
                isValid = false;
            }
        }

        return {
            isValid,
            results
        };
    }

    // 获取错误消息
    getErrorMessage(rule, params) {
        const messages = {
            required: 'This field is required',
            email: 'Please enter a valid email address',
            minLength: `Minimum length should be ${params} characters`,
            maxLength: `Maximum length should be ${params} characters`,
            numeric: 'Please enter numbers only',
            alphanumeric: 'Please enter letters and numbers only',
            password: 'Password must be at least 8 characters long and contain at least one letter and one number'
        };

        return messages[rule] || 'Invalid value';
    }
}

// 单元测试函数
function runTests() {
    const testResults = {
        total: 0,
        passed: 0,
        failed: 0,
        results: []
    };

    function assert(condition, message) {
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

    // 测试计算器
    console.log('Running Calculator tests...');
    const calculator = new Calculator();

    // 测试加法
    assert(calculator.add(5) === 5, 'Calculator.add(5) should return 5');
    assert(calculator.add(3) === 8, 'Calculator.add(3) should return 8');

    // 测试减法
    calculator.clear();
    assert(calculator.subtract(5) === -5, 'Calculator.subtract(5) should return -5');
    assert(calculator.subtract(3) === -8, 'Calculator.subtract(3) should return -8');

    // 测试乘法
    calculator.clear();
    calculator.add(4);
    assert(calculator.multiply(3) === 12, 'Calculator.multiply(3) should return 12');

    // 测试除法
    calculator.clear();
    calculator.add(12);
    assert(calculator.divide(3) === 4, 'Calculator.divide(3) should return 4');

    // 测试错误处理
    try {
        calculator.divide(0);
        assert(false, 'Calculator.divide(0) should throw an error');
    } catch (error) {
        assert(error.message === 'Division by zero is not allowed', 'Division by zero error message should match');
    }

    // 测试表单验证
    console.log('Running FormValidator tests...');
    const validator = new FormValidator();

    // 测试必填验证
    const requiredResult = validator.validate('', { required: true });
    assert(!requiredResult.isValid, 'Required field validation should fail for empty string');

    // 测试邮箱验证
    const validEmail = validator.validate('test@example.com', { email: true });
    assert(validEmail.isValid, 'Email validation should pass for valid email');

    const invalidEmail = validator.validate('invalid-email', { email: true });
    assert(!invalidEmail.isValid, 'Email validation should fail for invalid email');

    // 测试密码验证
    const validPassword = validator.validate('Password123', { password: true });
    assert(validPassword.isValid, 'Password validation should pass for valid password');

    const invalidPassword = validator.validate('weak', { password: true });
    assert(!invalidPassword.isValid, 'Password validation should fail for invalid password');

    // 测试表单验证
    const formData = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'Password123'
    };

    const formRules = {
        username: {
            required: true,
            minLength: 3,
            maxLength: 20
        },
        email: {
            required: true,
            email: true
        },
        password: {
            required: true,
            password: true
        }
    };

    const formResult = validator.validateForm(formData, formRules);
    assert(formResult.isValid, 'Form validation should pass for valid form data');

    // 输出测试结果
    console.log('Test Results:', testResults);
    return testResults;
}

// 在页面加载时运行测试
document.addEventListener('DOMContentLoaded', () => {
    const testResults = runTests();
    
    // 更新UI显示测试结果
    const resultsContainer = document.getElementById('test-results');
    if (resultsContainer) {
        const summary = document.createElement('div');
        summary.innerHTML = `
            <h3>Test Summary</h3>
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